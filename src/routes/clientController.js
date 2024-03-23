const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService')

router.get('/clients', async (req, res)=> {
    try{
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const clients = await clientService.getAllClients(page, size);
        res.json(clients);
    } catch (error){
        console.error("Error fetching companies:",error);
        res.status(500).json({'error':'Internal Server Error'});
    }
});

module.exports = router;