const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const port = process.env.PORT
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    const facilityCollaction = database.collection('facility')

    app.post('/all-facilities', async (req, res) => {
      const add = req.body
      const result = await facilityCollaction.insertOne(add);
      res.json(result)
    })

    app.get('/all-facilities', async (req, res) => {
       const result = await facilityCollaction.find().toArray()
       res.json(result);
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