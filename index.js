const express = require('express')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors =require('cors')
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json()) 




const port =process.env.PORT || 5000;



const uri = `mongodb://docAppoinment:34jRupOFX732HFTu@ac-l1otbgb-shard-00-00.bron4kg.mongodb.net:27017,ac-l1otbgb-shard-00-01.bron4kg.mongodb.net:27017,ac-l1otbgb-shard-00-02.bron4kg.mongodb.net:27017/?ssl=true&replicaSet=atlas-npqpq7-shard-0&authSource=admin&appName=Cluster0`

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
   
    await client.connect();

    const db = client.db('appoinmentsdb')
    const appoinmentsCollection = db.collection('appoinments')

    app.get('/appoinments',async(req,res)=>{
      const result = await appoinmentsCollection.find().toArray()

      res.send(result)
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
