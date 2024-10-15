import { Router } from "express";
import { signup, login,handleBooking,driverperformance } from "../controllers/authControllers";
import { authMiddleware, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/bookings", handleBooking);
router.get("/bookings", handleBooking);
router.delete("/bookings", handleBooking);
router.put("/bookings", handleBooking);
router.put("/driver", driverperformance);

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