const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7txzq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectID
const PORT = process.env.PORT || 4000;

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteer = client.db("volunteerNetwork").collection("volunteerActivities");
  const userCollection = client.db("volunteerNetwork").collection("volunteers");
  console.log("DATABASE CONNECTED SUCCESSFULLY");

  app.post('/add-event', (req, res) =>{
      const event = req.body;
      volunteer.insertOne(event)
      .then(result => {
        res.send(result.insertedCount>0)
      })
  })

  app.get('/all-registration', (req, res) =>{
     userCollection.find({})
     .toArray((err, documents) =>{
       res.send(documents)
     })
  })

  app.get('/events/:email', (req, res) =>{
     userCollection.find({email: req.params.email})
     .toArray((err, documents) =>{
       res.send(documents)
     })
  })

  app.delete('/events/:id', (req, res) =>{
    userCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount>0)
    })
 })

  app.post('/user-registration', (req, res) =>{
    const user = req.body;
    userCollection.insertOne(user)
    .then(result =>{
      res.send(result.insertedCount>0)
    })
  })

  app.get('/all-activities', (req, res) =>{
    volunteer.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
});


app.get('/', (req, res) =>{
    res.send("I am working now");
})

app.listen(PORT, () =>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})