import express from 'express';
import {
  getAllProduct,
  createProduct,
  getProductById
} from '../controller/productController.js';

const router = express.Router();

router.get('/products', getAllProduct);
router.post('/products', createProduct);
router.get('/products/:id', getProductById);

export default router;