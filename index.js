const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kr9ltvg.mongodb.net/?retryWrites=true&w=majority`;

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

    const foodCollection = client.db('FoodHub').collection('allFoods');
    const requestedFoodCollection = client.db('FoodHub').collection('requestFood');


    //add food

    app.post('/allFoods',async(req,res) =>{
      const userAddedFood  = req.body;
      console.log(userAddedFood );
      const result =await foodCollection.insertOne(userAddedFood );
      res.send(result);
    });


    app.get('/allFoods',async(req,res) =>{

      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    app.get('/allFoods/:id',async(req,res) => {

      const id =req.params.id;
      const query = {_id: new ObjectId(id)}

      const result =await foodCollection.findOne(query);
      res.send(result);

    })


    //request food

    app.post('/requestFood',async(req,res) =>{
      const requestFood = req.body;
      console.log(requestFood);
      const result =await requestedFoodCollection.insertOne(requestFood);
      res.send(result);
    });


















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res) => {
    res.send('Server is is running')
})

app.listen(port, () => {
    console.log(`Running on port no:${port}`)
})
