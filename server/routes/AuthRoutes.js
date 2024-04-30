import { Router } from "express";
import {
  checkUser,
  generateToken,
  getAllUsers,
  onBoardUser,
  updateUser
} from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/update-user",updateUser);
router.post("/onBoard-user", onBoardUser);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;
