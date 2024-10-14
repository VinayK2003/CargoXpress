import { Router } from "express";
import { signup, login } from "../controllers/authControllers";
import { authMiddleware, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/admin", authMiddleware, authorize(["admin"]), async (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

router.get("/driver", authMiddleware, authorize(["driver"]), async (req, res) => {
  res.status(200).json({ message: "Welcome, Driver!" });
});

router.get("/user", authMiddleware, authorize(["user"]), async (req, res) => {
  res.status(200).json({ message: "Welcome, User!" });
});

export default router;