const express = require("express");
const path = require("path");
const multer = require("multer");

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getNewProducts,
  filterProducts,
  addProductReview,
  getProducts,
} = require("../controllers/productController.js");

const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const checkId = require("../middlewares/checkid.js");

const router = express.Router();

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// 🛒 Admin routes (add, update, delete)
router.post("/", authenticate, authorizeAdmin, upload.single("image"), addProduct);
router.put("/:id", authenticate, authorizeAdmin, checkId, upload.single("image"), updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, checkId, deleteProduct);

// 🌍 Public routes (view and review)
router.get("/all", getAllProducts);
router.get("/products", getProducts);
router.get("/top", getTopProducts);
router.get("/new", getNewProducts);
router.get("/:id", getProductById);
router.post("/filter", filterProducts);
router.post("/:id/review", authenticate, addProductReview);

module.exports = router;
