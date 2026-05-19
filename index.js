const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const port = process.env.PORT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI


app.use(express.json())
app.use(cors())

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

    const database = client.db('sportnest');
    const facilityCollection = database.collection('facility')

    app.post('/all-facilities', async (req, res) => {
      const add = req.body
      const result = await facilityCollection.insertOne(add);
      res.json(result)
    })

    app.get('/all-facilities', async (req, res) => {
      const result = await facilityCollection.find().toArray()
      res.json(result);
    })

    app.get('/featured-facilities', async (req, res) => {
      const result = await facilityCollection.find().limit(6).toArray()
      res.json(result)
    })

    app.get('/all-facilities/:id', async (req, res) => {
      const id = req.params.id

      const query = {
        _id: new ObjectId(id)
      }

      const result = await facilityCollection.findOne(query)
      res.json(result)
    })

    app.patch('/all-facilities/:id', async (req, res) => {
      const id = req.params.id

      const updateData = req.body
      const result = await facilityCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )
      res.json(result)
    })

    app.delete( '/all-facilities/:id' , async (req, res) => {
      const id = req.params.id 
      const result = await facilityCollection.deleteOne(
        {_id: new ObjectId(id)}
      )
      res.json(result)
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