const express=require('express')
require('./db/moongoose')
const userrouter=require('./router/user')
const taskrouter=require('./router/task')

const app=express()
const port = process.env.PORT

app.use(express.json())

app.use(userrouter)
app.use(taskrouter)



app.listen( port, () => 
{
    console.log('server is running on port : ' + port )
})
