const elasticClient = require("../db/elasticSearch");
const clientService = require("../models/clientModel");
require('dotenv').config();

const indexName = process.env.ELASTICSEARCH_INDEX_NAME

async function createIndexInElasticsearch() {
    const isIndexed  = await elasticClient.indices.exists({ index: indexName });

    if (!isIndexed) {
        await elasticClient.indices.create({index: indexName});
        console.log(`Index '${indexName}' created.`);
    } else {
        console.log(`Index '${indexName}' already exists.`);
    }
}

async function indexDataInElasticSearch(docId, data) {
    try {
        let indexedResult = await elasticClient.index({
            index: indexName,
            id: docId,
            document: data
        });
        console.log("Indexed Into ES", indexedResult)
    }
    catch (error) {
        console.error(`Error Indexing the document: ${error}`);
    }
}

async function searchInElasticsearch(query) {
    try {
        const {body} = await elasticClient.search({
            index: indexName,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['id', 'name', 'cin', 'email']
                    }
                }
            }
        });
        return body.hits.hits.map(hit => hit._source); }
    catch (error) {
        console.error(`Error finding the document: ${error}`);
    }
}

async function deleteDataInElasticSearch(docId) {
    try {
        const response = await elasticClient.delete({
            index: indexName,
            id: docId,
        });
        console.log(`Document deleted: ${response}`);
    } catch (error) {
        console.error(`Error deleting document: ${error}`);
    }
}

const queryElasticsearch = (req, res) => {
    try {
        let hits = searchInElasticsearch(req.query.value)
        res.json(hits)
    } catch (error) {
        console.error("Error while querying the Elasticsearch:", req.body);
        res.status(500).json({'error': 'Internal Server Error'});
    }
};


module.exports = {indexDataInElasticSearch, searchInElasticsearch, createIndexInElasticsearch, deleteDataInElasticSearch, queryElasticsearch}