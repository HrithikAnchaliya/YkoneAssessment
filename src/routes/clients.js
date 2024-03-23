const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/:id', clientController.getClient);
router.delete('/:id', clientController.deleteClient);
router.post('/', clientController.createClient);
router.post('/:id', clientController.updateClient);
router.get('/', clientController.getClients);

module.exports = router;