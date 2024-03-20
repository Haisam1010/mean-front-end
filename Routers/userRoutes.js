import mongoose from "mongoose";
import Users from "../Models/Users.js";
import express from 'express';
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const router = express.Router()

// Get All userData
router.get('/', async(req,res)=>{
    const userList = await Users.find().select('-passwordHash')
    if(!userList){
        res.status(400).json({success:false, message:'Users Not Found'})
    }
    res.status(200).send(userList)
})
// Get  userData By ID
router.get('/:id', async(req,res)=>{
    const user = await Users.findById(req.params.id).select('-passwordHash')
    if(!user){
        res.status(400).json({success:false, message:'User Not Found'})
    }
    res.status(200).send(user)
})
// User Register
router.post('/register', async(req,res)=>{
    let user = Users({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        city:req.body.city,
        country:req.body.country,
        zip:req.body.zip
    })
    user = await user.save()
    if(!user){
        res.status(501).json({success:false, message:'User Can not Be Created'})
    }
    res.send(user).status(200)
})

// Login User
router.post('/login',async(req,res)=>{
    const existingUser = await Users.findOne({email:req.body.email})
    if(!existingUser){
      return  res.status(400).send("User Not Found")
    }
    if(existingUser && bcrypt.compareSync(req.body.password, existingUser.passwordHash)){
        const token = jwt.sign({
            userId:existingUser.id,
            isAdmin:existingUser.isAdmin
        },process.env.SECRET)
        return res.status(200).send({user:existingUser.email,token:token})
    }else{
        res.status(401).json({success:false,message:'Password is Wrong'})
    }
    
})

// Get User Count
router.get('/get/count', async(req,res)=>{
    const userCount = await Users.countDocuments({})
    if(!userCount){
        res.status(401).json({success:false, message:'No Products Counts Available'})
    }
    res.send({
        userCount : userCount
    })
})

//Update User DetailsById
router.put('/update/:id', async (req,res)=>{
    const userExist = await Users.findById(req.params.id)
    let newPassword 
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password,10)
    }
    else{
        newPassword = userExist.passwordHash
    }
    const updateUser = await Users.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        email:req.body.email,
        passwordHash:newPassword,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        city:req.body.city,
        country:req.body.country,
        zip:req.body.zip
    },{new:true})
    
    if(!updateUser){
        res.status(400).json({msg:'User Profile Cannot Be Updated'})
        return 
    }

    res.status(200).send(updateUser).json({success:true,message:'User Profile Updated'})
    return 
})


 export default router