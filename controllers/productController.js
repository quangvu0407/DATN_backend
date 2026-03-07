import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js";

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Danh sách sản phẩm
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Thông tin sản phẩm 
const singleProducts = async (req, res) => {
  try {
    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
      res.json({ success: false, message: "Product doesn't find!" })
    }
    else {
      res.json({ success: true, product })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL: /api/product/:id
    const { name, description, price, category, subCategory, bestseller, sizes } = req.body;

    // Tìm và cập nhật sản phẩm
    const product = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        bestseller: bestseller === 'true' || bestseller === true ? true : false,
        sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes
      },
      { new: true } // Trả về dữ liệu mới sau khi update
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    res.json({ success: true, message: "Product updated successfully", product });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProducts, updateProduct }