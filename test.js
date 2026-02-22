import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import productModel from "./models/productModel.js";
import connectDB from "./config/mongodb.js";

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (path) => {
  const result = await cloudinary.uploader.upload(path);
  return result.secure_url;
};

async function seedProducts() {
  try {
    await productModel.deleteMany();
    console.log("Old products deleted");

    const description =
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves.";

    const rawProducts = [
      { name: "Women Round Neck Cotton Top", price: 100, category: "Women", subCategory: "Topwear", sizes: ["S","M","L"], bestseller: true },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 200, category: "Men", subCategory: "Topwear", sizes: ["M","L","XL"], bestseller: true },
      { name: "Girls Round Neck Cotton Top", price: 220, category: "Kids", subCategory: "Topwear", sizes: ["S","L","XL"], bestseller: true },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 110, category: "Men", subCategory: "Topwear", sizes: ["S","M","XXL"], bestseller: true },
      { name: "Women Round Neck Cotton Top", price: 130, category: "Women", subCategory: "Topwear", sizes: ["M","L","XL"], bestseller: true },
      { name: "Girls Round Neck Cotton Top", price: 140, category: "Kids", subCategory: "Topwear", sizes: ["S","L","XL"], bestseller: true },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 190, category: "Men", subCategory: "Bottomwear", sizes: ["S","L","XL"], bestseller: false },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 140, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Girls Round Neck Cotton Top", price: 100, category: "Kids", subCategory: "Topwear", sizes: ["M","L","XL"], bestseller: false },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 110, category: "Men", subCategory: "Bottomwear", sizes: ["S","L","XL"], bestseller: false },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 120, category: "Men", subCategory: "Topwear", sizes: ["S","M","L"], bestseller: true },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 150, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: true },
      { name: "Women Round Neck Cotton Top", price: 130, category: "Women", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 160, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 140, category: "Men", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Girls Round Neck Cotton Top", price: 170, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: true },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 150, category: "Men", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 180, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 160, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Palazzo Pants with Waist Belt", price: 190, category: "Women", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 170, category: "Women", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: true },
      { name: "Women Palazzo Pants with Waist Belt", price: 200, category: "Women", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 180, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 210, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Girls Round Neck Cotton Top", price: 190, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 220, category: "Women", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Girls Round Neck Cotton Top", price: 200, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 230, category: "Men", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: true },
      { name: "Women Round Neck Cotton Top", price: 210, category: "Women", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Girls Round Neck Cotton Top", price: 240, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 220, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: true },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 250, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Girls Round Neck Cotton Top", price: 230, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Round Neck Cotton Top", price: 260, category: "Women", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 240, category: "Women", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: true },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 270, category: "Women", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Round Neck Cotton Top", price: 250, category: "Women", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 280, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Printed Plain Cotton Shirt", price: 260, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 290, category: "Men", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 270, category: "Men", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 300, category: "Kids", subCategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Kid Tapered Slim Fit Trouser", price: 280, category: "Kids", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 310, category: "Women", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 290, category: "Men", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 320, category: "Men", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Kid Tapered Slim Fit Trouser", price: 300, category: "Kids", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 330, category: "Men", subCategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
      { name: "Kid Tapered Slim Fit Trouser", price: 310, category: "Kids", subCategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    ];

    const products = [];

    for (let i = 0; i < rawProducts.length; i++) {
      console.log(`Uploading p_img${i + 1}.png...`);

      const imageUrl = await uploadImage(`./seedImages/p_img${i + 1}.png`);

      products.push({
        ...rawProducts[i],
        description,
        image: [imageUrl],
        date: Date.now(),
      });
    }

    await productModel.insertMany(products);

    console.log("🔥 FULL 52 PRODUCTS SEEDED SUCCESSFULLY!");
    process.exit();
  } catch (err) {
    console.log("FULL ERROR:", err);
  }
}

seedProducts();