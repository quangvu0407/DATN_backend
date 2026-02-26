import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import orderModel from "../models/orderModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

//route cho login
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = createToken(user._id)
      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, message: "Invalid password" })
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

//route cho register
const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Kiểm tra người dùng đã tồn tại chưa.
    const exists = await userModel.findOne({ email })

    if (exists) {
      return res.json({ success: false, message: "User already exists" })
    }

    // Kiểm tra email và password

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    })

    const user = await newUser.save()

    const token = createToken(user._id)

    res.json({ success: true, token })

  } catch (error) {
    // console.log(error);
    res.json({ success: false, message: error.message })
  }
}

//route cho đăng nhập admin

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.headers);

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, message: "invalid admin account!" })
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// route trả về thông tin người dùng hiện tại (token phải hợp lệ)
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const orderCount = await orderModel.countDocuments({
      userId: req.user.id,
    });
    res.json({ success: true, user, orderCount});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, getUserProfile }