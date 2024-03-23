const express = require('express');
const router = express.Router();
const crawlController = require('../controllers/crawlController');

router.post('/crawl-begin', crawlController.startCrawling);

module.exports = router;