const express = require('express')
const router = express.Router()
const {getProducts,getProductById,deleteProduct,createProduct, updateProduct} = require('../controllers/productController.js')
const {protect,admin} = require('../middleware/authMiddleware')


// @description Fetch all products
// @router GET /api/products
// @access Public

router.route('/')
.get(getProducts)
.post(protect, admin, createProduct)
 
// @description Fetch single product
// @router GET /api/products/:id
// @access Public

 router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect,admin, updateProduct )
 


module.exports = router