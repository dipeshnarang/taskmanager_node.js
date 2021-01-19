const express=require('express')
const User=require('./../models/user')
const brcypt=require('bcryptjs')
const auth=require('../middleware/auth')
const sharp= require('sharp')
const multer=require('multer')
const {sendwelcomemail}=require('../emails/account')
const {sendremoveemail}=require('../emails/account')
const router=new express.Router()

router.get('/test' , (req,res)=>
{
    res.send('from a new file')
})

router.post('/users',   async(req,res)=>
{
    const user= await new User(req.body)
    

    //console.log(req.body)
    try{
        await user.save()
        await sendwelcomemail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.send({user, token })

    }catch(e)
    {
        res.status(400).send(e)
    }
    
    // user.save().then(()=>
    // {
    //   res.send(user) 
    // }).catch((error)=>
    // {
    //     res.status(400)
    //     res.send(error)
        
    // })
})

const avatar=multer({
    
    limits:{
        fileSize:1*1024*1024
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('file not supported'))
        }
        cb(undefined , true)

    } 
})




router.post('/upload/me/avatar',auth  ,avatar.single('avatar'), async (req,res) =>
{
    const buffer= await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    
        res.status(200).send('image uploaded')
    
    
},(error , req,res ,next)=>
{
    res.status(400).send({error:error.message})
})





router.post('/users/login' , async(req,res)=>
{

    try{
        const user=await  User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user ,token})


    }catch(e)
    {
        res.status(400).send('invalid credentials')
    }
})

router.post('/users/logout' , auth ,async (req,res)=>
{
    try{
        req.user.tokens= req.user.tokens.filter((token)=>
        {
            return token.token !== req.token

        })
        await req.user.save()
        res.send('logout succesful')

    }catch(e)
    {
        res.status(401).send()
    }
})

router.post('/users/logout/all' , auth , async (req,res)=>
{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send('logged out from all devices')

    }catch{
        res.status(401).send()
    }
})

router.get('/users/me', auth , async(req,res) =>
{
        res.send(req.user).status(200)
    
})

router.get('/users',async (req , res)=>
{
    try{
        const user= await User.find({})
    res.send(user)

    }catch(e)
    {
        res.send('error')
    }

})


router.patch('/users/me',auth , async(req,res) =>
{
    const updates=Object.keys(req.body)
    const allowedUpdates=['age' , "email" , "password"]
    const ValidOperation=updates.every((update)=> {
       return  allowedUpdates.includes(update)})

    if(!ValidOperation)
    {
      return  res.send('not a valid operation')
    }


    try{
        const user=await User.findById(req.user._id)

        updates.forEach((update)=> user[update]=req.body[update])

        user.save()
        // const user= await User.findByIdAndUpdate(req.params.id , req.body , {new:true , runValidators: true})
        if(!user)
        {
            return res.send('no user found')
        }
         return res.send(user)
            
    }catch(e)
    {
        res.send(e)
    }
})

router.delete('/users/me',auth  , async(req,res) =>
{


    try{
        await req.user.remove()
        sendremoveemail(req.user.email, req.user.name)
        res.send(req.user)
        
    }catch(e)
    {
        console.log(e)
        res.status(400).send(e)
    }
})

// router.get('/*', (req,res) =>
// {
//     console.log('inside *')
//     res.send('site under maintainence')
// })

router.delete('/users/me/avatar' , auth , async(req,res)=>
{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send()
    }catch(e)
    {
        res.status(501)
    }
})

router.get('/users/me/avatar' , auth , (req,res)=>
{
    try{
        res.set('Content-type','image/png')
        res.send(req.user.avatar)
        

    }catch(e)
    {
        res.status(404)

    }
    
})
router.get('/users/:id/avatar' ,async (req,res)=>
{
    try{
        const user= await User.findById(req.params.id)
        res.set('Content-Type','image/png')
        res.send(user.avatar)
        

    }catch(e)
    {
        res.status(404)

    }
    
})

module.exports=router
