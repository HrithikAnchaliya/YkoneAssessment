const express = require('express');
const router = express.Router();
const elasticController = require('../controllers/elasticController');

router.post("/search", elasticController.queryElasticsearch);

module.exports = router;