const crawlController = require('../services/crawler')

const websiteUrl = 'https://www.companydetails.in/latest-registered-company-mca';

// Rate limit: Delay between consecutive requests (in milliseconds)
const delayBetweenRequests = 500; // Example: 7 seconds
const startCrawling = (req, res) => {
    crawlController.crawlWebsite(websiteUrl, delayBetweenRequests)
        .then(() => console.log("Crawling completed successfully"))
        .catch(error => console.error("Error while crawling data", error));
    res.status(200)
        .json({"msg": "Started crawling successfully"});
}

module.exports = {startCrawling};