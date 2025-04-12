const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
///*********************************  4000 for local : 3000 for lightsail
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:3000', 'https://ourmcia.org', 'https://chess.ourmcia.org', 'http://10.0.0.42:3000'];

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://rahulvarunb:bT21@cluster0.mfsl6.mongodb.net";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/*
async function readFunction() {

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const database = client.db('chess');
        const collection = database.collection('players');

        const query = {};
        const result = await collection.find(query).toArray();

        console.log("Found documents:", result);
        console.log("Found documents count:", result.length);
    } finally {
        await client.close();
    }
}

async function writeFunction() {

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const database = client.db('chess');
        const collection = database.collection('players');

        const doc = { name: "John", grade: 3 };
        const result = await collection.insertOne(doc);

        console.log(`New document inserted with _id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}
*/


app.use(cors());
//app.use(cors({ origin: 'https://www.ourmcia.org' }));

//app.use(cors({ origin: '*' }));

// app.use((req, res, next) => {
//     const allowedOrigins = ['*'];
//     const origin = req.headers.origin;
//     // if (allowedOrigins.includes(origin)) {
//     //     res.setHeader('Access-Control-Allow-Origin', origin);
//     // }
//     res.header('Access-Control-Allow-Origin', '*');

//     //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
//     res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', true);
//     return next();
// });

// Option 1 without CORS
// app.use((req, res, next) => {
//     const origin = req.headers.origin; // Get the Origin header from the request
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin); // Set the matching origin
//     }
//     //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     next();
// });

async function connectToDatabase() {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db('chess');
    const collection = database.collection('players');
    return collection;
}
async function connectToDatabasePlayerDetails() {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db('chess');
    const collection = database.collection('playerDetails');
    //const collection2 = [...collection].sort((a, b) => a.Name - b.Name);
    return collection;
}
async function connectToDatabasePairings() {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db('chess');
    const collection = database.collection('pairings');
    return collection;
}

app.get('/', (req, res) => {
    res.send("Hi2");
});

app.get('/data', async (req, res) => {
    const collection = await connectToDatabase();
    const data = await collection.find({}).toArray();
    res.json(data);
});
app.get('/playerDetails/:group', async (req, res) => {

    console.log("************************", req.params.group);
    const collection = await connectToDatabasePlayerDetails();
    const data = await collection.find({ Group: req.params.group }).sort({ Score: -1, Rating: -1, Name: -1 }).toArray();
    res.json(data);
});
app.get('/pairings/:group', async (req, res) => {
    const collection = await connectToDatabasePairings();
    const data = await collection.find({ Group: req.params.group }).toArray();
    //console.log(data);
    res.json(data);
});

//readFunction().catch(console.error);
//writeFunction().catch(console.error);



app.listen(PORT, () => {

    console.log("Server is running on port ", PORT);

});