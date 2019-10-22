const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_CONNECT,{useNewUrlParser : true , useCreateIndex: true, useFindAndModify:false} )
