const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} = require("../controllers/materialController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

router.post("/", protect, createRequest);

router.get("/my-requests", protect, getMyRequests);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

router.get("/", protect, adminOnly, getAllRequests);

router.patch("/:id/status", protect, adminOnly, updateRequestStatus);

router.delete("/:id", protect, adminOnly, deleteRequest);

module.exports = router;