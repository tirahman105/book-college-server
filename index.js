const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kx4dtgt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("collegeDB").collection("users");
    const collegeCollection = client.db('collegeDB').collection('collegeCollection');
    const admissionCollection = client.db('collegeDB').collection('admission');
    const reviewCollection = client.db('collegeDB').collection('reviews');

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      console.log('existing user', existingUser);
      if (existingUser) {
        return res.send({ message: 'User already exists' });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get('/users/details/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: 'User not found' });
        }
        res.send(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.get('/colleges', async (req, res) => {
      const cursor = collegeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.patch('/colleges/:id', async (req, res) => {
     
    //   const review= req.body.downloadLink;
      
    //   const id = req.params.id;
    //   console.log(id);
    //   const filter = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //     $set: {
          
    //       review: review,
    //     },
    //   };

    //   const result = await collegeCollection.updateOne(filter, updateDoc);
    //   res.send(result);

    // })


    app.get('/colleges/details/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await collegeCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: 'College not found' });
        }
        res.send(result);
      } catch (error) {
        console.error('Error fetching college data:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.get('/colleges/details/name/:name', async (req, res) => {
      const name = req.params.name;
      try {
        const query = { name: name };
        const result = await collegeCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: 'College not found' });
        }
        res.send(result);
      } catch (error) {
        console.error('Error fetching college data:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.post('/admission', async(req, res) => {
      const admission =req.body;
      admission.createdAt = new Date();
      console.log('new admission', admission);
      const result = await admissionCollection.insertOne(admission);
      res.send(result);
  })

  app.get('/admission', async(req, res) => {
    console.log(req.query.email);
    let query = {};
    if(req.query?.email){
      query = {email: req.query.email}
    }
    const result = await admissionCollection.find(query).sort({createdAt: -1}).toArray();
    res.send(result)
  })


  app.post('/reviews', async(req, res) => {
    const review =req.body;
    review.createdAt = new Date();
    console.log('new review', review);
    const result = await reviewCollection.insertOne(review);
    res.send(result);
})


app.get('/reviews', async (req, res) => {
  const cursor = reviewCollection.find();
  const result = await cursor.toArray();
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

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
