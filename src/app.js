const express = require('express');
const app = express();
const clients = require("./routes/clients");
const crawler = require("./routes/crawler");
const elastic = require('./routes/indexer')

app.use(express.json())
app.use('/clients', clients);
app.use('/crawler', crawler);
app.use('/elastic', elastic);

app.get('/', (req, res, next) => {
    res.send({message: "Hello, YKone"});
})

app.listen(5000, () => {
    console.log("Web App");
})