// const express = require('express')
// const dotenv = require('dotenv')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const cors =require('cors')
// dotenv.config()
// const app = express()
// app.use(cors())
// app.use(express.json()) 




// const port =process.env.PORT || 5000;



// const uri =process.env.MONGODB_URI;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
   
//     await client.connect();

//     const db = client.db('appoinmentsdb')
//     const appoinmentsCollection = db.collection('appoinments')
//     const bookingCollection = db.collection('bookings')

//     app.get('/appoinments',async(req,res)=>{
//       const result = await appoinmentsCollection.find().toArray()

//       res.send(result)
//     })
//     app.get('/appoinments/:appoinmentId', async(req, res)=>{
//       const {appoinmentId}= req.params;

//       const result= await appoinmentsCollection.findOne({_id: new ObjectId(appoinmentId)})
//       res.send(result)

//     })

//     app.get('/featured',async(req,res)=>{
//       const result= await appoinmentsCollection.find().limit(3).toArray()
//       res.send(result)
//     })
//                     // booking section
//     app.post('/booking',async(req,res)=>{
//       const bookingData= req.body;
//       const result= await bookingCollection.insertOne(bookingData)
//       res.send(result)
//     })

//     app.get('/booking/:userId',async(req,res)=>{
//       const {userId}= req.params;
//       const result= await bookingCollection.find({userId:userId}).toArray()
//       res.send(result)
//     })

//     app.delete('/booking/:bookingId', async(req,res)=>{
//       const {bookingId}=req.params;
//       const result=await bookingCollection.deleteOne({_id:new ObjectId(bookingId)})
//     })
//     app.patch('/booking/:id', async(req, res)=>{
//       const {id}=req.params;
//       const updateData = req.body;
//       const result= await bookingCollection.updateOne({_id: new ObjectId(id)},{$set:updateData})
//       res.send(result)
//     })
   
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
    
//     // await client.close();
//   }
// }
// run().catch(console.dir);


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

// 🎯 ফিক্স ১: কানেকশন লিক এবং লিমিট ওভারফ্লো বন্ধ করতে Connection Pool সেট করা হয়েছে
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,             // একসঙ্গে ১০টির বেশি কানেকশন ওপেন হতে দেবে না
  serverSelectionTimeoutMS: 5000, // ৫ সেকেন্ডের মধ্যে কানেক্ট না হলে এরর দেখাবে
});

async function run() {
  try {
    
    await client.connect();

    const db = client.db('appoinmentsdb');
    const appoinmentsCollection = db.collection('appoinments');
    const bookingCollection = db.collection('bookings');

    // Appointments Routes
    app.get('/appoinments', async (req, res) => {
      const result = await appoinmentsCollection.find().toArray();
      res.send(result);
    });

    app.get('/appoinments/:appoinmentId', async (req, res) => {
      const { appoinmentId } = req.params;
      const result = await appoinmentsCollection.findOne({ _id: new ObjectId(appoinmentId) });
      res.send(result);
    });

    app.get('/featured', async (req, res) => {
      const result = await appoinmentsCollection.find().limit(3).toArray();
      res.send(result);
    });

    // Booking Section
    app.post('/booking', async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result);
    });

    app.get('/booking/:userId', async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

  
    app.delete('/booking/:bookingId', async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) });
      res.send(result); // ফ্রন্টএন্ডে রেজাল্ট পাঠানো হলো, এখন "Deleting..." এ আটকে থাকবে না!
    });

    app.patch('/booking/:id', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await bookingCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    });

    // DB Connection Ping Check
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}


run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});