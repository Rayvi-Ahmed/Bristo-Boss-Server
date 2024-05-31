const express= require('express')
const app=express()
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 1000;


// MiddleWare ///
app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send('Boosss is sitting here') 
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poxvpxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    

    // collections

    const menuCollection=client.db('BristoDB').collection('menu')
    const userCollection=client.db('BristoDB').collection('user')
    const reviewCollection=client.db('BristoDB').collection('Review')
    const cartCollection=client.db('BristoDB').collection('Carts')





        // all register Users API
        app.post('/users',async(req,res)=>{
          const user=req.body
          const result = await userCollection.insertOne(user)
          res.send(result)
        })
  
 
// Menu Data get 

        app.get('/menu',async(req,res)=>{
        const result= await menuCollection.find().toArray()
        res.send(result)
        
        })
        app.get('/review',async(req,res)=>{
            const result=await reviewCollection.find().toArray()
            res.send(result)
        })


        // All carts posted
        app.post('/carts',async(req,res)=>{
          const cartsItem=req.body
          const result = await cartCollection.insertOne(cartsItem)
          res.send(result)
        })

      // All Carts Are send to Client site for Read/ Shown
        app.get('/carts',async(req,res)=>{
          const email = req.query.email
          const query= {email:email}
          const result=await cartCollection.find(query).toArray()
          res.send(result)
        })



      // Indivisual Cart Delete API

     app.delete('/carts/:id',async(req,res)=>{
      const id= req.params.id;
      const query={_id:new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
     })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
    run().catch(console.dir);

    app.listen(port,()=>{
    console.log(`Bristo boss is running at port ${port}`)
    })

    