const Category = require("../models/Category");
const { cloudinary } = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce/categories" },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!req.file)
    return res.status(400).json({ message: "Category image is required" });

  const exists = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  if (exists)
    return res.status(400).json({ message: "Category already exists" });

  const result = await uploadToCloudinary(req.file.buffer);
  const image = { url: result.secure_url, public_id: result.public_id };

  const category = await Category.create({ name, image });
  res.status(201).json(category);
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (error) {
        console.warn(
          "Failed to delete category image from Cloudinary:",
          error.message,
        );
      }
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted", categoryId: req.params.id });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
