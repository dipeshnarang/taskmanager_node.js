//CRUD create read update delete

const {MongoClient, ObjectID}=require('mongodb')
// const mongoclient=mongodb.MongoClient
// const id= new mongodb.ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

const connectionurl='mongodb://127.0.0.1:27017'
const mongodatabase='task-manager'

MongoClient.connect(connectionurl, {useNewUrlParser: true },(error , client) =>
{
    if (error)
    {
        return console.log('unable to connect ')
    }
    console.log('connected correctly')
    const db=client.db(mongodatabase)
    // db.collection('hello').insertOne({
    //     name:'mead',
    //     _id:id,
    //     age:20
    // },(error ,result) =>
    // {
    //     if(error)
    //     {
    //         return console.log('unable to connect')
    //     }
    //     console.log(result.ops)
    // })

//     db.collection('new').insertMany([{
//         name:'gunther', 
//         age:20,
//         completed:false
//     },
//     {
//         name:'andrew',
//         age:25,
//         completed:true

//     }],
//      (error ,result) =>
//     {
//         if(error)
//         {
//             return console.log('unable to connect')
//         }
//         console.log(result.ops)
//     })
        // db.collection('hello').findOne({name:'dipesh' , age:30}, (error,data) =>
        // {
        //     if(error)
        //     {
        //      return   console.log('unable to fetch')
        //     }

        //     console.log(data)
        // })
//         db.collection('table').insertMany([{
//             name:'dipesh',
//             task:'study',
//             completed :true
//         },{
//             name:'taru',
//             task:'cleaning',
//             completed :true
//         },{
//             name:'sam',
//             task:'study',
//             completed :false
//         },{
//             name:'saad',
//             task:'groceries',
//             completed:false

//         }] ,(error,data) =>
//         {
//             if(error)
//             {
//                 return console.log('unable to create dtabase')
//             }
//             console.log(data.ops)
//         })

            // db.collection('table').findOne({_id: new ObjectID("5d0542f5b17a5d1e90c3f86c")}, (error,data) =>
            // {
            //     console.log(data)
            // })

    //         db.collection('table').find({completed:false}).toArray((error,data) =>
    //         {
    //             console.log(data)
    //         })

    const updatePromise= db.collection('table').updateOne({
        _id:new ObjectID("5d05430ebb2bb01174301191")
    } , {
            $set: {
                    name:'mike'
            }
        })
        
        updatePromise.then((result) =>
        {
            console.log(result)
        }).catch((error) =>
        {
            console.log(error)
        })

    })