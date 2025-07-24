const Product = require('../models/productModel');
const Category = require("../models/categoryModel");

// ✅ Add product
async function addProduct(req, res) {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required" });
    }

    const existing = await Product.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Product with this name already exists" });
    }

    const image = `/${req.file.path.replace(/\\/g, "/")}`;
    const product = new Product({
      name,
      image,
      brand,
      description,
      price,
      quantity,
      category: category.trim(),
      createdBy: req.user._id
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// ✅ Get all products
async function getAllProducts(req, res) {
  const products = await Product.find()
    .populate('category')
    .populate('createdBy', 'username');
  res.json(products);
}

// ✅ Update product
async function updateProduct(req, res) {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updates = req.body;
  Object.assign(product, updates);

  await product.save();
  res.json(product);
}

// ✅ Delete product
async function deleteProduct(req, res) {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  await Product.deleteOne({ _id: id });
  res.json({ message: "Product deleted" });
}

// ✅ Get products with search + pagination
async function getProducts(req, res) {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
}

// ✅ Get top rated products
async function getTopProducts(req, res) {
  const products = await Product.find().sort({ rating: -1 }).limit(4);
  res.json(products);
}

// ✅ Get newest products
async function getNewProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 }).limit(5);
  res.json(products);
}

// ✅ Filter products by category
const filterProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(404).json({ error: "Category not found" });
      }
      filter.category = categoryDoc._id;
    }

    const products = await Product.find(filter).populate("category");
    res.json(products);
  } catch (error) {
    console.error("Filter Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get product by ID
async function getProductById(req, res) {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate('createdBy', 'username');
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
}

// ✅ Add product review (only one review per user)
async function addProductReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ error: "Product already reviewed" });
  }

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
}

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
  getTopProducts,
  getNewProducts,
  filterProducts,
  addProductReview,
};
