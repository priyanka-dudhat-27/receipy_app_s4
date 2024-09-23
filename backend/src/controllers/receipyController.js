import Recipe from "../models/receipyModel.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Helper function to delete image file
async function deleteImage(imagePath) {
  try {
    await fs.unlink(path.join(process.cwd(), imagePath));
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

const upload = multer({ storage: storage });

export const addRecipe = [
    upload.single("image"),
    async (req, res) => {
      try {
        console.log("Received file:", req.file);  // Log the entire file object
        console.log("Request body:", req.body);   // Log the request body
  
        const { title, ingredients, instructions, cuisineType, cookingTime } = req.body;
        
        let imagePath = null;
        if (req.file) {
          imagePath = `/uploads/${req.file.filename}`;
          console.log("Image path:", imagePath);  // Log the image path
        } else {
          console.log("No image file received");  // Log if no file was received
        }
  
        const newRecipe = new Recipe({
          title,
          ingredients,
          instructions,
          cuisineType,
          cookingTime,
          image: imagePath,
          createdBy: req.user._id,
        });
  
        console.log("New recipe object:", newRecipe);  // Log the new recipe object
  
        await newRecipe.save();
        res.status(201).json(newRecipe);
      } catch (error) {
        console.error("Error in addRecipe:", error);  // Log any errors
        if (req.file) {
          await deleteImage(req.file.path);
        }
        res.status(400).json({ message: error.message });
      }
    },
  ];

export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecipe = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, ingredients, instructions, cuisineType, cookingTime } =
        req.body;
      const updateData = {
        title,
        ingredients: JSON.parse(ingredients),
        instructions,
        cuisineType,
        cookingTime,
      };

      const existingRecipe = await Recipe.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!existingRecipe)
        return res.status(404).json({ message: "Recipe not found" });

      if (req.file) {
        if (existingRecipe.image) {
          await deleteImage(existingRecipe.image);
        }
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updateData,
        { new: true }
      );
      res.json(updatedRecipe);
    } catch (error) {
      if (req.file) {
        await deleteImage(req.file.path);
      }
      res.status(400).json({ message: error.message });
    }
  },
];

export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (deletedRecipe.image) {
      await deleteImage(deletedRecipe.image);
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
