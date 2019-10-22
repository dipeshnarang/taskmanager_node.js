const validator=require('validator')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('../models/task')


const userSchema= new mongoose.Schema({
    name:{
        type: String
    },
    age:{
            type:Number,
            default: 0,
            trim:true,
            validate(value)
            {
                if(value < 0)
                {
                    throw new Error ('age must be greater than 0')
                }
            }
        },
        email:
       {
           type:String,
           required:true,
           unique:true,
           lowercase:true,
           validate(value)
           {
               if( !validator.isEmail(value))
               {
                   throw new Error('email is invalid')
               }
               
           }

        },
        password:
        {
            type:String,
            required:true,
            minlength:7,
            trim:true,
            validate(value)
            {if(value.includes('password'))
            {
                throw new Error('please select a stronger password')
            }

            },
           
        },
        tokens: [{
            
            token:{
               
                type:String,
                required:true
            }
        }] ,
        avatar: {
            type:Buffer
        }  
    
},{
    timestamps:true
})

userSchema.statics.findByCredentials = async (email ,password)=>
{
    const user=await User.findOne({email:email})
    
    if(!user)
    {
        
        throw new Error ('email')
        
    }
    console.log(password)
    console.log(user.password)
    // const hash=await bcrypt.hash(password,1)
    // console.log(hash)
    const ismatch=await bcrypt.compare(password, user.password )
    
    console.log(ismatch)
    if(!ismatch)
    {
        console.log('no user')
        throw new Error('password')
    }
    
    return user

}

userSchema.methods.toJSON= function ()
{
    const user=this
    const publicinfo=user.toObject()

    delete publicinfo.password
    delete publicinfo.tokens

    return publicinfo
}

userSchema.virtual('tasks', {

    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.generateAuthToken= async function () {
    const user=this

   const token= jwt.sign({_id: user._id.toString() } , process.env.PASS_SECRET)
   user.tokens=user.tokens.concat({ token })
   await user.save()
   return token

}



//Hash the password before saving
userSchema.pre('save' , async function (next) 
{
    const user=this
    console.log('just before saving')

    if (user.isModified('password')) {
        user.password= await bcrypt.hash(user.password, 8 )
    }


    next()
})

userSchema.pre('remove' , async function (next)
{
    const user=this
    await Task.deleteMany({owner: user._id})

    next()
})

const User=mongoose.model('User', userSchema)

module.exports=User

