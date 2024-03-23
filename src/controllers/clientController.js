const clientService = require('../models/clientModel')
const { indexDataInElasticSearch, deleteDataInElasticSearch } = require('../controllers/elasticController')


const getClients = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        clientService.getAllClients(page, size, (err, result) => {
            if (err) {
                res.status(500).json({'error': 'Error fetching clients'});
                return;
            }
            res.json(result);
        });
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({'error': 'Internal Server Error'});
    }
};

const getClient = (req, res) => {
    try {
        const clientId = req.params.id;
        clientService.getOneClient(clientId, (err, result)=> {
            if (err) {
                res.status(500).json({'error': `Error fetching client with id: ${clientId}`});
                return;
            }
            res.json(result);
        });
    } catch (error) {
        console.error("Error fetching client:", req.params.id, error);
        res.status(500).json({'error': 'Internal Server Error'});
    }
};

const deleteClient = (req, res) => {
    try {
        const clientId = req.params.id;
        clientService.deleteClientById(clientId, (err, result)=> {
            if (err) {
                res.status(500).json({'error': `Error deleting client with id: ${clientId}`});
                return;
            }
            deleteDataInElasticSearch(clientId);
            res.json({"msg":"successfully deleted the client"});
        });

    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({'error': 'Internal Server Error'});
    }
};

const createClient = (req, res) => {
    try {
        clientService.createNewClient(req.body,(err, result)=>{
            if(err){
                res.status(500).json({'error': `Error creating new client with cin: ${req.body.cin}`});
                return;
            }
            indexDataInElasticSearch(result);
            res.json({"msg":`created client successfully with id ${result}`});
        });
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(500).json({'error': 'Internal Server Error'});
    }
};

const updateClient = (req, res) => {
    try {
        // console.log(req.params, req.body);
        clientService.updateClientById(req.params.id,req.body,(err, result)=> {
            if(err){
                res.status(500).json({'error': `Error creating new client with cin: ${req.body.cin}`});
                return;
            }
            indexDataInElasticSearch(req.params.id)
            res.json({"msg":`updated client successfully with id ${req.params.id}`});
        });
    } catch (error) {
        console.error("Error updating client with request:", req.body);
        res.status(500).json({'error': 'Internal Server Error'});
    }
};

module.exports = {getClients, getClient, deleteClient, createClient, updateClient};