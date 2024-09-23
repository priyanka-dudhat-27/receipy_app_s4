import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { email, name, username, password } = req.body;
    if (!name || !username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!mailformat.test(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    var passformat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (!passformat.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 7 characters, 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 special character",
      });
    }

    let existedUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existedUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      req.body.password = await bcrypt.hash(password, 10);
      let userData = await User.create(req.body);
      if (userData) {
        res
          .status(200)
          .json({ message: "User Registered Successfully !", data: userData });
      } else {
        res.status(400).json({ message: "Failed to Register User" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something Wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else {
      let checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        let checkPassword = await bcrypt.compare(password, checkEmail.password);
        if (checkPassword) {
          var token = jwt.sign({ _id: checkEmail.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          const { _id, name, email, password } = checkEmail;
          return res.status(200).json({
            message: "user login successfully",
            data: checkEmail,
            token: token,
            user: { _id, name, email },
          });
        } else {
          return res.status(400).json({ message: "Password Not Match" });
        }
      } else {
        return res.status(400).json({ message: "User Not Found", status: 0 });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something Wrong" });
  }
};

export { register, login };
