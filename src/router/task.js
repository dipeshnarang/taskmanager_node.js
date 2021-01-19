const express=require('express')
const Task=require('./../models/task')
const auth=require('../middleware/auth')

const router=new express.Router()



router.post('/tasks',auth ,async(req,res) =>
{
    //const task= new Task(req.body)
    const task= new Task({
        ...req.body,
        owner:req.user._id
    })

    try{
        await task.save()
        res.send(task)
    }catch(e)
    {
        res.send(e)
    }

    //  task.save().then(()=>
    // {
    //     res.send(task)
    // }).catch((error)=>
    // {
    //     res.status(400)
    //     res.send(error)
    // })
})


// GET tasks = /tasks?completed
// GET tasks = /tasks?sortBy=createdAt:asc
router.get('/tasks',auth ,async (req,res) => 
{
    const match={}
    const sort={}

    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy)
    {
        const parts= req.query.sortBy.split(':')
        sort[parts[0]]= parts[1] === 'desc' ? -1 : 1

    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort

                
            }
                }).execPopulate()

        res.send(req.user)
        // const tasks=await Task.find({owner:req.user._id})
        // res.status(300).send(tasks)
    }
    catch(e)
    {
        res.send(e)
    }
    // Task.find({}).then((tasks)=>
    // {
    //     res.send(tasks)
    // })
})

router.get('/tasks/:id',auth , async (req,res)=>
{
    const _id=req.params.id
    try{
        const task= await Task.findOne({_id, owner: req.user._id})

        if(!task)
        {
          return   res.send('no task found ') 
        }
        res.send(task)

    }catch(e){
        res.status(400).send('no task found')


    }
})

router.patch('/tasks/:id',auth , async(req,res) =>
{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description' , 'completed']
    const verified=updates.every((update)=>
    {
        return allowedUpdates.includes(update)
    })


    if(!verified)
    {
        return res.send('not a valid update ')
    }

    const _id=req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        

    // const task= await Task.findByIdAndUpdate(req.params.id , req.body , {new:true , runValidators: true })
    if(!task)
    {
        res.send('no task found')
    }

    updates.forEach((update)=>
        {
            task[update]=req.body[update]
        })
        task.save()

    res.send(task)
}catch(e)
{
    res.status(400).send(e)
}
    
})


router.delete('/tasks/:id' ,auth , async(req,res) =>
{
    _id=req.params.id
    try{
        const task= await Task.findOneAndDelete({_id , owner: req.user._id})

        if(!task)
        {
           return  res.send('no task found ')
        }
        res.send(task)

    }catch(e)
    {
        res.status(400).send(e)
    }
})

module.exports=router