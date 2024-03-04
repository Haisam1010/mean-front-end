import { Router } from "express"
import Catagories from "../models/Catagories.js"
const router = Router()

// Get Product Categories 
router.get("/", async (req, res) => {
    const catagories = await Catagories.find()
    if(!catagories){
        res.status(500).json({success:false})
    }
    res.status(200).send(catagories)
})

// Get Product By Id
router.get('/:id', async (req,res)=>{
    const id = await Catagories.findById(req.params.id)

    if(!id) {
        res.status(500).json({message:'The Categories With The Given By ID was Notfound'})
    }
    res.status(200).send(id)
})


router.post("/", async (req, res) => {
    let order = {
        name: req.body.name,
        icon:req.body.icon || "",
        color: req.body.color || ""
    }
    if (!order.name) {
        return res.status(400).send("category name is required")
    }
})

//Update CategoryById
router.put('/:id', async (req,res)=>{
    const updateCategory = await Catagories.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon || Catagories.icon,
        color:req.body.color
    })
    category = await updateCategory.save()

    if(!category){
        return res.status(400).send('The Category Cannot be Created')
    }
    res.send(category)
})

// Delete Category By Id
router.delete('',async(req,res)=>{
    const deleteCategory = await Catagories.findByIdAndRemove(req.params.id).then(catagories=>{
        if(catagories){
            return res.status(200).json({success:true, message:'The category Deleted'})
        }
        else{
            return res.status(404).json({success:false, message:'The category Id Notfound'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
})

export default router
