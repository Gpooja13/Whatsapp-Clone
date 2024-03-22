import { Router } from "express";
import {
  addMessage,
  getMessages,
  addImageMessage,
  getInitialContactswithMessages,
} from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images" });

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.get("/add-initial-contacts/:from", getInitialContactswithMessages);

export default router;
