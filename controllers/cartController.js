import userModel from "../models/userModel.js"

//Thêm sản phẩm vào cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { itemId, size } = req.body

    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      }
      else {
        cartData[itemId][size] = 1
      }
    }
    else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }

    await userModel.findByIdAndUpdate(userId, { cartData })
    res.json({ success: true, message: "Added To Cart" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//Cập nhật cart

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    // nếu product chưa tồn tại thì tạo
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (quantity === 0) {
      // xoá size
      delete cartData[itemId][size];

      // nếu product không còn size nào → xoá luôn product
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Lấy dữ liệu cart

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id

    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;

    res.json({ success: true, message: "Cart Updated", cartData })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { addToCart, updateCart, getUserCart }