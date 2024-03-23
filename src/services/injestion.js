const connection = require('../db/sqlConnection');
// const clientRawData = require('./crawler')

// Specify the URL of the website to crawl
const websiteUrl = 'https://www.companydetails.in/latest-registered-company-mca';

// Rate limit: Delay between consecutive requests (in milliseconds)
const delayBetweenRequests = 10000; // Example: 7 seconds

const insertData = (clientData) => {
    try {
        // let value =  [ [
        //     'A2M INFRASTRUCTURE PRIVATE LIMITED',
        //     'A2M INFRASTRUCTURE PRIVATE LIMITED is a RAJASTHAN based PRIVATE ltd. Company Registered at dated 19-MAR-2024 on Ministry of Corporate Affairs(MCA), The Corporate Identification Number (CIN) of  A2M INFRASTRUCTURE PRIVATE LIMITED is U68200RJ2024PTC093391 and registration number is     U68200RJ2024PTC093391 It has been classified as COMPANY LIMITED BY SHARES  and is registered under Registrar of Companies ROC JAIPUR India. Authorized share capital of A2M INFRASTRUCTURE PRIVATE LIMITED is Rs. 100000 and its paid up capital is Rs.  100000. It aspire to serve in  NA activities across the India. Its Annual General Meeting (AGM) was lastly conducted on   and as per the records of Ministry of Corporate Affairs (MCA),   its balance sheet was last filed on . The registered Email address of A2M INFRASTRUCTURE PRIVATE LIMITED is bhawanisingh420454@gmail.com and its registered address is 29, RAJPUTANA MOHALLA GAROODWASI CHAKSU JAIPUR JAIPUR RJ 303901 IN    RAJASTHAN RAJASTHAN india 303901.The current status of A2M INFRASTRUCTURE PRIVATE LIMITED shows as an NOT AVAILABLE FOR EFILING.',
        //     'NA',
        //     'U68200RJ2024PTC093391',
        //     new Date('2024-03-18T18:30:00.000Z'),
        //     'COMPANY LIMITED BY SHARES',
        //     'NON-GOVT COMPANY',
        //     'ROC JAIPUR',
        //     'PRIVATE',
        //     'NOT AVAILABLE FOR EFILING'
        //   ]]
        console.log("Starting process", clientData);

        // const clientData = await clientRawData(websiteUrl, delayBetweenRequests);
        const clientDetails = clientData.map(client => [client.title, client.description, client.activity, client.cin, client.date, client.category, client.subCategory, client.roc, client.class, client.status]);
        let sql = "INSERT INTO client (name, description, activity, cin, registration_date, category, sub_category, roc, class, status) VALUES ?";
        let insertId;
        connection.query(sql, [clientDetails], (err, result) => {
            if (err) console.log(err);
            insertId = result.insertId;
            console.log(insertId);
            let clientIntricates = {};
            for (let index = 0; index < clientData.length; index++) {
                clientIntricates[clientData[index].cin] = insertId + index;
            }
            console.log(clientIntricates);

            const clientFinanceDetails = clientData.map(client => [clientIntricates[client.cin], client.auth_capital, client.paid_capital]);
            const clientContactDetails = clientData.map(client => [clientIntricates[client.cin], client.pin, client.state, client.address, client.email]);

            connection.query('INSERT INTO client_finance (client_id, auth_capital, paid_capital) VALUES ? ', [clientFinanceDetails], (err, result) => {
                if (err) console.log(err);
            });
            connection.query('INSERT INTO client_contact (client_id, pincode, state, address, email) VALUES ? ', [clientContactDetails], (err, result) => {
                if (err) console.log(err);
            });
        });


        // const clientFinanceDetails = clientData.map(client => [clientIntricates[client.cin], client.auth_captial, client.paid_capital]);
        // const clientContactDetails = clientData.map(client => [clientIntricates[client.cin], client.pin, client.state, client.address, client.email]);

        // connection.query('INSERT INTO client_finance (client_id, auth_capital, paid_capital) VALUES ? ', [clientFinanceDetails]);
        // connection.query('INSERT INTO client_contact (client_id, pincode, state, address, email) VALUES ? ', [clientContactDetails]);
    } catch (error) {
        console.error('Error executing statements ', error);
    }
};

const insertSingleData = (clientData) => {
    try {
        console.log("Starting process", clientData);
        const clientDetails = [clientData.title, clientData.description, clientData.activity, clientData.cin, clientData.date, clientData.category, clientData.subCategory, clientData.roc, clientData.class, clientData.status];
        let sql = "INSERT INTO client (name, description, activity, cin, registration_date, category, sub_category, roc, class, status) VALUES (?,?,?,?,?,?,?,?,?,?)";
        let insertId;
        connection.query(sql, clientDetails, (err, result) => {
            if (err) console.log(err);
            insertId = result.insertId;

            const clientFinanceDetails = [insertId, clientData.auth_capital, clientData.paid_capital];
            const clientContactDetails = [insertId, clientData.pin, clientData.state, clientData.address, clientData.email];

            connection.query('INSERT INTO client_finance (client_id, auth_capital, paid_capital) VALUES (?,?,?) ', clientFinanceDetails, (err, result) => {
                if (err) console.log(err);
            });
            connection.query('INSERT INTO client_contact (client_id, pincode, state, address, email) VALUES (?,?,?,?,?) ', clientContactDetails, (err, result) => {
                if (err) console.log(err);
            });
            console.log("Single data insert done for id", insertId);
        });
        return {
            id: insertId
        }
    } catch (error) {
        console.error('Error inserting data:', error);
        return {
            'error':'Internal Server Error'
        };
    }
};

module.exports = insertSingleData;