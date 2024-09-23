import express from 'express';
import {addRecipe,getUserRecipes,getRecipe,updateRecipe,deleteRecipe} from '../controllers/receipyController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/addReceipy',protect,addRecipe);

router.get('/getUserRecipes',protect,getUserRecipes);

router.get('/getRecipe/:id',protect,getRecipe);

router.put('/updateRecipe/:id',protect,updateRecipe);

router.delete('/deleteRecipe/:id',protect,deleteRecipe);

export default router;