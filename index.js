const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/myDb";

app.use(cors())
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// insert
app.post('/users/create', async(req, res) => {
  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('mydb').collection('users').insertOne({
    id: parseInt(user.id),
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    email: user.email,
    avatar: user.avatar
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+user.id+" is created",
    "user": user
  });
})

// get all
app.get('/users', async(req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('mydb').collection('users').find({}).toArray();
  await client.close();
  res.status(200).send(users);
})

// get by name
app.get('/users/:fname', async(req, res) => {
  const fname = req.params.fname;
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db('mydb').collection('users').findOne({"fname": fname});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "user": user
  });
})

// get by id
app.get('/users/ids/:id', async(req, res) => {
  const _id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db('mydb').collection('users').findOne({"id": _id});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "user": user
  });
})

// update
app.put('/users/update', async(req, res) => {
  const user = req.body;
  const id = parseInt(user.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('mydb').collection('users').updateOne({'id': id}, {"$set": {
    id: parseInt(user.id),
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    email: user.email,
    avatar: user.avatar
  }});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+id+" is updated",
    "user": user
  });
})

// delete
app.delete('/users/delete', async(req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('mydb').collection('users').deleteOne({'id': id});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+id+" is deleted"
  });
})