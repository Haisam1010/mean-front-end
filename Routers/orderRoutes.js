import express from 'express';
import Order from "../Models/Order.js";
import Order_items from "../Models/Order_items.js";
const router = express.Router();

// Get All Orders
router.get('/',async(req,res)=>{
    const orders = await Order.find().populate('user','name').sort({'dateOrdered':-1})
    if(!orders){
        res.status(500).json({success:false})
    }
    res.send(orders)
})

// Get  Orders By ID
router.get('/:id',async(req,res)=>{
    const order = await Order.findById(req.params.id).populate('user','name')
    .populate({path:'orderItems',populate:{path:'product',populate:'category'}})
    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order)
})
// Post Orders 
router.post('/product',async (req,res)=>{
    const orderItemsId =Promise.all( req.body.orderItems.map(async(orderItem)=>{
        const newOrderItem = new Order_items({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save()
        return savedOrderItem._id
    }))
    const orderItemsIdResolved = await orderItemsId

    let orders = new Order({
        orderItems:orderItemsIdResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:req.body.totalPrice,
        user:req.body.user
    })
    orders = await orders.save() 
    if(!orders){
        res.status(400).json({message:"order cannot be created",success:false})
    }
    res.send(orders)
})

// Update Orders 
router.put('/:id', async (req,res)=>{
    const updateOrder = await Order.findByIdAndUpdate(req.params.id,{
      status: req.body.status
    })
    category = await updateOrder.save()

    if(!category){
        return res.status(400).send('The Category Cannot be Created')
    }
    res.send(category)
})

// Delete Orders

router.delete(':/id', async (req,res)=>{
    Order.findByIdAndDelete(req.params.id).then(order => {
       if (order){
            return res.status(200).json({msg:'Order Deleted'})
       } 
       else{
            return res.status(500).json({msg:"Order Not Found"})
       }
    })
})
