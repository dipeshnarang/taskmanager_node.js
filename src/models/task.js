const mongoose=require('mongoose')
const validator=require('validator')

const taskschema=new mongoose.Schema(
{
    description:{
        type:String,
        trim:true,
        required:true,

    },
    completed:{
        type:Boolean,
        default:false

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    }

},{
    timestamps:true
})

taskschema.pre('save' , async function(next) 
{
    const task=this
    console.log('just before saving ')
    next()
})

const Task = mongoose.model('Task' , taskschema) 



module.exports=Task