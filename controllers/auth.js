import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registration = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUsed = await User.findOne({ email });
    if (isUsed) {
      return res.status(409).json({
        message: "This email is already taken",
      });
    }

    const salt = bcrypt.genSaltSync(10); // создание сложности хеширования пароля
    const hash = bcrypt.hashSync(password, salt); // хеширование пароля

    const newUser = new User({
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await newUser.save(); //сохранение нового юзера в базе данных

    res.status(200).json({
      token,
      newUser,
      message: "Registration completed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error creating user" });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); // ищем узера в базе данных

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password); // сравнивает пароль в базе данных и тот который получили от клиента

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    ); //создание токена. проверка авторизовались или нет

    res.status(200).json({
      token,
      user,
      message: "You are logged in",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error user authorization" });
  }
};

//getme
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(404).json({ message: "No access" });
  }
};
