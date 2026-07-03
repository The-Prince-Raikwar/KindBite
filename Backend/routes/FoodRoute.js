import express from "express";
import { addFood, listfood, removeFood ,updateFood} from "../controllers/foodController.js";
import multer from "multer";

export const FoodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",   // ✅ must match static folder
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

FoodRouter.post("/add", upload.single("image"), addFood);
FoodRouter.get("/list", listfood);
FoodRouter.post("/remove", removeFood);
FoodRouter.put("/update",updateFood);