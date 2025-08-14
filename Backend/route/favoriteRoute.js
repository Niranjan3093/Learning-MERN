import express from 'express';
import {
  addToFavorites,
  getFavorites,
  getFavoriteById,
  removeFromFavorites,
  clearFavorites,
} from '../controller/favoriteController.js';

const router = express.Router();

router.post('/add', addToFavorites); 
router.get('/:userId', getFavorites); 
router.get('/:userId/:productId', getFavoriteById); 
router.delete('/remove', removeFromFavorites); 
router.delete('/clear/:userId', clearFavorites); 

export default router;