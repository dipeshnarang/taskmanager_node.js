const mongoose = require('mongoose')

// mongoose.connect(process.env.DATABASE_CONNECT,{useNewUrlParser : true , useCreateIndex: true, useFindAndModify:false,useNewUrlParser:true} )

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{useNewUrlParser : true , useCreateIndex: true, useFindAndModify:false,useNewUrlParser:true,
    useUnifiedTopology:true} )
