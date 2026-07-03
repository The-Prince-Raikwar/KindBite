import { foodModel } from "../models/FoodModels.js";
import fs from "fs";



export const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded or file field name is incorrect." });
  }
  let image_filename = `${req.file.filename}`;
  
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    res.json({ success: false, message: "ERROR" });
  }
};
export const listfood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`upload/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message:"Food Removed" });

  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    await foodModel.findByIdAndUpdate(_id, data, { new: true });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
}
