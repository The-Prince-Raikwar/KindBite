import express from "express" 
import {addTocart,deleteFromcart,getCart} from "../controllers/cartController.js"
import { authMiddleware } from "../middleware/auth.js"

export const cartRouter=express.Router()
cartRouter.post("/add",authMiddleware,addTocart)
cartRouter.post("/remove",authMiddleware,deleteFromcart)
cartRouter.post("/get",authMiddleware,getCart)