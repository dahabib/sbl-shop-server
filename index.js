const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ihro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5055;

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("sbl-shop").collection("products");
    const ordersCollection = client.db("sbl-shop").collection("orders");
    // perform actions on the collection object

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        // console.log(product);
        productCollection.insertOne(product)
        .then(result => {
            console.log('data added successfully');
            res.send('successfully added');
    })})


    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray( (err, product) => {
            res.send(product);
        })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectID(req.params.id) })
        .toArray( (err, product) => {
            res.send(product[0]);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordesCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({ email: req.query.email })
        .toArray( (err, orders) => {
            res.send(orders);
        })
    })


    app.get("/", (req, res) => {
        res.send('connected from server');
    })

});

app.listen(port);