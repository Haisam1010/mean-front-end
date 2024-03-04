import Order from "../Models/Order.js";
const router = express.Router();

// Get All Orders
router.get('/',async(req,res)=>{
    const orders = await Order.find({})
    if(!orders){
        res.status(500).json({success:false})
    }
    res.send(orders)
})

// Post Orders
router.post('/orders',async (req,res)=>{
    let orders = new Order({
        orderItems:req.body.orderItems,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,git remote add origin https://github.com/Haisam1010/mean-front-end.git
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
        res.status(500).json({success:false})
    }
    res.send(orders)
})


