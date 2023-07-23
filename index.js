// const express = require('express')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const cors = require('cors')
// const app = express()
// require('dotenv').config()
// const port = process.env.PORT || 5000




// // middleware
// app.use(cors());
// app.use(express.json())



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kx4dtgt.mongodb.net/?retryWrites=true&w=majority`;

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
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const usersCollection = client.db("collegeDB").collection("users");
//     const collegeCollection = client.db('collegeDB').collection('collegeCollection');


//     app.post('/users', async (req, res) => {
//         const user = req.body;
//         console.log(user);
//         const query = { email: user.email }
//         const existingUser = await usersCollection.findOne(query);
//           console.log('existing user' , existingUser)
//         if (existingUser) {
//           return res.send({ message: 'user already exists' })
//         }
  

//         const result = await usersCollection.insertOne(user);
//         res.send(result);
//       })

//       app.get('/users/details/:id', async(req, res) => {
//         const id = req.params.id;
//         const query = {_id: new ObjectId (id)}
//         const result = await usersCollection.findOne(query);
//         res.send(result);
//       })

//       app.get('/colleges', async(req, res) => {
//         const cursor = collegeCollection.find();
//         const result = await cursor.toArray();
//         res.send(result)
//       })
  
//       app.get('/colleges/details/:id', async(req, res) => {
//         const id = req.params.id;
//         const query = {_id: new ObjectId (id)}
//         const result = await collegeCollection.findOne(query);
//         res.send(result);
//       })
  
    

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);





// app.get('/', (req, res) => {
//   res.send(' server is running!')
// })


// app.listen(port, () => {
//   console.log(`app listening on port ${port}`)
// })


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
    await client.connect();

    const usersCollection = client.db("collegeDB").collection("users");
    const collegeCollection = client.db('collegeDB').collection('collegeCollection');
    const admissionCollection = client.db('collegeDB').collection('admission');

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

    app.post('/admission', async(req, res) => {
      const admission =req.body;
      admission.createdAt = new Date();
      console.log('new admission', admission);
      const result = await admissionCollection.insertOne(admission);
      res.send(result);
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

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
