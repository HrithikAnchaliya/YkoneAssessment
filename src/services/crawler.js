const axios = require('axios');
const cheerio = require('cheerio');
const injestion = require('./injestion')

/*
    Crawler for the website
    https://www.companydetails.in/latest-registered-company-mca

*/

// Function to make a delayed request
async function delayedRequest(url, delay) {
    return new Promise(resolve => {
        setTimeout(async () => {
            try {
                const response = await axios.get(url);
                resolve(response.data);
            } catch (error) {
                console.error('Error:', error.message);
                resolve(null);
            }
        }, delay);
    });
}

async function crawlClientData(title, delayBetweenRequests) {
    try {
        // Format the URL
        let url = `https://www.companydetails.in/company/${title}`;
        const html = await delayedRequest(url, delayBetweenRequests); // Initial request without delay
        if (!html) return null; // Exit if request failed

        // Load HTML content into Cheerio
        const $ = cheerio.load(html);

        let clientDetails = {};

        clientDetails.title = $('h1.text-primary').text();
        clientDetails.description = "";

        $('div.DESC').children().each((index, element) => {
            clientDetails.description += $(element).text()
        });

        let clientIntricates = []
        $('h6.text-left').each((index, element) => {
            clientIntricates.push($(element).text());
        });

        clientDetails.activity = clientIntricates[1];
        clientDetails.cin = clientIntricates[2];
        clientDetails.date =  new Date(clientIntricates[3]);
        clientDetails.category = clientIntricates[4];
        clientDetails.subCategory = clientIntricates[5].replace(/\t/g, '');
        clientDetails.class = clientIntricates[6];
        clientDetails.roc = clientIntricates[7];
        clientDetails.status = clientIntricates[8].replace(/\t/g, '');
        clientDetails.auth_capital = clientIntricates[9];
        clientDetails.paid_capital = clientIntricates[10].replace(/\t/g, '');
        clientDetails.state = clientIntricates[13];
        clientDetails.pin = clientIntricates[14].replace(/\t/g, '');
        clientDetails.address = clientIntricates[16];
        clientDetails.email = clientIntricates[17];

        return clientDetails;

    } catch (error) {
        console.error('Error:', error.message);
    }

}

async function crawlWebsite(url, delayBetweenRequests) {
    try {
        // Fetch the HTML content of the website
        const html = await delayedRequest(url, 0); // Initial request without delay
        if (!html) return; // Exit if request failed

        // Load HTML content into Cheerio
        const $ = cheerio.load(html);

        // Extract information from the page
        const urlTitles = [];

        // Example: Extract all client title
        $('a.text-uppercase').each((index, element) => {
            let name = $(element).text()
            let urlValues = name.replaceAll(" ", "-").toLowerCase();
            urlTitles.push(urlValues);
        });

        let clients = []

        // Extract company data
        for(let i = 0; i < urlTitles.length; i++){
            let client = await crawlClientData(urlTitles[i], delayBetweenRequests);
            // console.log("Per Client", client);
            if (client) {
                injestion(client);
            }
        }

        // await injestion(clients);

        //  return clients;

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Specify the URL of the website to crawl
const websiteUrl = 'https://www.companydetails.in/latest-registered-company-mca';

// Rate limit: Delay between consecutive requests (in milliseconds)
const delayBetweenRequests = 500; // Example: 7 seconds

crawlWebsite(websiteUrl, delayBetweenRequests);

// Start crawling the website
module.exports = crawlWebsite;