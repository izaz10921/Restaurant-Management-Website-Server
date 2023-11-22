const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());





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
    

    const foodCollection = client.db('FoodHub').collection('allFoods');
    const orderFoodCollection = client.db('FoodHub').collection('orderFood');


    //add food




  app.get('/allFoods', async (req, res) => {
    let query = {};

    if (req.query?.email) {
        query = { makerEmail: req.query.email };
    } else if (req.query?.search) {
        query = { foodName: { $regex: req.query.search, $options: 'i' } };
    }

    const result = await foodCollection.find(query).toArray();
    res.send(result);
});







app.get('/orderFood', async (req, res) => {
  console.log(req.query.email);
  let query = {};

  if (req.query?.email) {
      query = { buyerEmail: req.query.email };
  }

  const result = await orderFoodCollection
      .find(query)
      .sort({ orderQuantity: -1 }) 
      .toArray();

  res.send(result);
});







    app.post('/allFoods',async(req,res) =>{
      const userAddedFood  = req.body;
      // console.log(userAddedFood );
      const result =await foodCollection.insertOne(userAddedFood );
      res.send(result);
    });


    





    app.get('/allFoods/:id',async(req,res) => {

      const id =req.params.id;
      const query = {_id: new ObjectId(id)}

      const result =await foodCollection.findOne(query);
      res.send(result);

    })
   

    //order food

    app.post('/orderFood',async(req,res) =>{
      const orderFood = req.body;
      console.log(orderFood);
      const result =await orderFoodCollection.insertOne(orderFood);
      res.send(result);
    });


    app.put("/allFoods/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      
     
      const updateItem = req.body;
      const item = {
        $set: {
          foodName: updateItem.foodName,
          foodImageURL: updateItem.foodImageURL,
          makerEmail: updateItem.makerEmail,
          makerName: updateItem.makerName,
          price: updateItem.price,
          foodOrigin: updateItem.foodOrigin,
          description: updateItem.description,
          foodQuantity: updateItem.foodQuantity,
          foodCategory: updateItem.foodCategory
        },
      };
      const result = await foodCollection.updateOne(
        filter,
        item
      );

      res.send(result);
    });



    app.delete('/orderFood/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await orderFoodCollection.deleteOne(query);
      res.send(result);
  })

















    // Send a ping to confirm a successful connection
   
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
