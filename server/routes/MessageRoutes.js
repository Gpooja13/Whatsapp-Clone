import { Router } from "express";
import {
  addMessage,
  getMessages,
  getInitialContactswithMessages,
} from "../controllers/MessageController.js";

const router = Router();

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.get("/add-initial-contacts/:from", getInitialContactswithMessages);

export default router;
