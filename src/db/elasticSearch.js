const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const elasticClient = new Client({node: process.env.ELASTICSEARCH_URI, auth: {apiKey: process.env.ELASTICSEARCH_APIKEY}});

module.exports = elasticClient;