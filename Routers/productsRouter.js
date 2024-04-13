import express from 'express';
import Products from '../Models/Product.js'
import Catagories from '../models/Catagories.js';
import mongoose from 'mongoose';
import Product from '../Models/Product.js';
const router = express.Router();

// Create Product List
router.post('/', async (req,res)=>{
    const category = await Catagories.findById(req.body.category)
    if(!category){
        return res.status(500).json({message:'No categories found'})
    }
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    },{new:true})

    if(!product){
        res.status(500).json({message:'The Product Cannot Be Created Try Again...!'})
    }
    res.send(product)
})
// Get All Product List and Filter Option
router.get('/', async (req,res)=>{
    let filter = {}
    if(req.query.categories){
        filter = {category:req.query.categories.split(',')}
    }
    const productsList = await Products.find(filter).populate('category')
    if(!productsList){
        res.status(500).json({message:'Products List Not Found'})
    }
    res.send(productsList)
})
// Get Product By Id
router.get('/:id',async (req,res)=>{
    const {id:ProductId} = req.params
    const productId = await Products.findById(ProductId).populate('category')
    if(!productId){
        res.status(400).json({message:'productId Notfound'})
    }
    res.send(productId)
})
//  updateProductById
router.put('/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({message:'Invalid Object Id'})
    }
    const category = await Catagories.findById(req.body.category)

    if(!category){
        res.status(400).json({message:'No Category Found..!'})
    }

    const product = await Products.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
    }, {new:true})
    if(!product){
    return res.status(500).send('the product cannot be updated!')
    res.send(product)
    }
})
// Delete Product
router.delete('/:id', async (req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "product not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

// sample counts
router.get('/get/count', async(req,res)=>{
    const productCount = await Product.countDocuments({})
    if(!productCount){
        res.status(401).json({success:false, message:'No Products Counts Available'})
    }
    res.send({
        productCount : productCount
    })
})

// Get Featured Products
router.get('/get/featured/:count', async(req,res)=>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured:true}).limit(+count)
    if(!products){
        res.status(401).json({success:false, message:'No Products Counts Available'})
    }
    res.send(products)
})
export default router