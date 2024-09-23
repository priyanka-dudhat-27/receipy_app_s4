import mongoose from "mongoose";
const cuisineTypes = [
  'Italian',
  'Chinese',
  'Mexican',
  'Indian',
  'Japanese',
  'French',
  'Thai',
  'Greek',
  'Spanish',
  'American',
  'Other'
];

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    type: String,
    required: true,
    trim: true
  }],
  instructions: {
    type: String,
    required: true
  },
  cuisineType: {
    type: String,
    required: true,
    enum: cuisineTypes,
    default: 'Other'
  },
  cookingTime: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;