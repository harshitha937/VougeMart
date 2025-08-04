const Product = require('../models/productModel');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;
        const image = req.file ? req.file.filename : null;
        if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if(!countInStock){
      return res.status(400).json({ message: 'Count intstaock is required' });
    }
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    } 
    const newProduct =await  new Product({
      name,
      description,
      price,
      category,
      countInStock,
      image,
       postedBy: req.user._id,

    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed', error: err.message });
  }
};

// Get all products
// Get all products (with optional category filter)
exports.getProducts = async (req, res) => {
  try {
    const query = {};

    // Support filtering by category via query param
    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Fetching products failed', error: err.message });
  }
};


// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Fetching product failed', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Product update failed', error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
