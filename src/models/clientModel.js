const connection = require("../db/sqlConnection");

// Constants for SQL queries
const sqlQueries = {
    GET_ALL_CLIENTS: "SELECT client.id,client.name, client.description, client.activity, client.cin, client.registration_date,client.category, client.sub_category,client.roc, client.class, client.status, client_finance.auth_capital,client_finance.paid_capital, client_contact.pincode, client_contact.state, client_contact.address, client_contact.email  FROM client, client_finance, client_contact WHERE client.id = client_finance.client_id AND client.id = client_contact.client_id LIMIT ? OFFSET ?",
    TOTAL_CLIENTS: "SELECT count(*) FROM client",
    CREATE_NEW_CLIENT: "INSERT INTO client (name, description, activity, cin, registration_date, category, sub_category, roc, class, status) VALUES (?,?,?,?,?,?,?,?,?,?)",
    CREATE_NEW_CLIENT_FINANCE: "INSERT INTO client_finance (client_id, auth_capital, paid_capital) VALUES (?,?,?)",
    CREATE_NEW_CLIENT_CONTACT: "INSERT INTO client_contact (client_id, pincode, state, address, email) VALUES (?,?,?,?,?)",
    DELETE_CLIENT: "DELETE FROM client_finance WHERE client_id = ?",
    GET_ONE_CLIENT: "SELECT client.id,client.name, client.description, client.activity, client.cin, client.registration_date,client.category, client.sub_category,client.roc, client.class, client.status, client_finance.auth_capital,client_finance.paid_capital, client_contact.pincode, client_contact.state, client_contact.address, client_contact.email FROM client, client_finance, client_contact WHERE client.id = client_finance.client_id AND client.id = client_contact.client_id AND client.id = ?",
    UPDATE_CLIENT: "UPDATE client SET ? WHERE id = ?",
    UPDATE_CLIENT_FINANCE: "UPDATE client_finance SET ? WHERE client_id = ?",
    UPDATE_CLIENT_CONTACT: "UPDATE client_contact SET ? WHERE client_id = ?"
};

const getAllClients = (page = 1, limit = 20, callback) => {
    const offset = (page - 1) * limit;
    connection.query(sqlQueries.GET_ALL_CLIENTS, [limit, offset], function (err, result) {
        if (err) {
            console.error("Error fetching clients", err);
            callback(err, null);
        }
        callback(null, result);
    });
};

// Function to get one client
const getOneClient = (clientId, callback) => {
    connection.execute(sqlQueries.GET_ONE_CLIENT, [clientId], function (err, result) {
        if (err) {
            console.error("Error fetching client with clientId:", clientId, err);
            callback(err, null);
        }
        callback(null, result[0]);
    });
};

const deleteClientById = (clientId, callback) => {
    connection.execute(sqlQueries.DELETE_CLIENT, [clientId], function (err, result) {
        if (err) {
            console.error("Error deleting client with clientId:", clientId, err);
            callback(err, null);
        }
        callback(null, result);
    });
}

const updateClientById = (clientId, clientData, callback) => {

    const client = {
        name: clientData.name,
        description: clientData.description,
        activity: clientData.activity,
        cin: clientData.cin,
        registration_date: clientData.registration_date,
        category: clientData.category,
        sub_category: clientData.sub_category,
        roc: clientData.roc,
        class:clientData.class,
        status: clientData.status
    };

    const clientContact = {
        pincode: clientData.pincode,
        state: clientData.state,
        address: clientData.address,
        email: clientData.email
    };

    const clientFinance = {
        auth_capital: clientData.auth_capital,
        paid_capital: clientData.paid_capital
    };

    connection.query(sqlQueries.UPDATE_CLIENT, [client, clientId], function (err, result) {
        if (err) {
            console.error("Error updating client with clientId:", clientData.clientId, err);
            callback(err, null);
        }
        connection.query(sqlQueries.UPDATE_CLIENT_CONTACT, [clientContact, clientId], function (err, result) {
            if (err) {
                console.error("Error updating client with clientId:", clientData.clientId, err);
                callback(err, null);
            }
            connection.query(sqlQueries.UPDATE_CLIENT_FINANCE, [clientFinance, clientId], function (err, result) {
                if (err) {
                    console.error("Error updating client with clientId:", clientData.clientId, err);
                    callback(err, null);
                }
                callback(null, result);
            });
        });
    });
};

const createNewClient = (clientData, callback) => {
    try {
        console.debug("Starting process", clientData);
        const clientDetails = [clientData.name, clientData.description, clientData.activity, clientData.cin, clientData.registration_date, clientData.category, clientData.sub_category, clientData.roc, clientData.class, clientData.status];
        connection.query(sqlQueries.CREATE_NEW_CLIENT, clientDetails, (err, result) => {
            if (err) {
                console.error("Error creating new client", err);
                callback(err, null);
            }
            const clientFinanceDetails = [result.insertId, clientData.auth_capital, clientData.paid_capital];
            const clientContactDetails = [result.insertId, clientData.pincode, clientData.state, clientData.address, clientData.email];

            connection.query(sqlQueries.CREATE_NEW_CLIENT_FINANCE, clientFinanceDetails, (err, result) => {
                if (err) {
                    console.error("Error inserting client finance details", err);
                    callback(err, null);
                }
            });
            connection.query(sqlQueries.CREATE_NEW_CLIENT_CONTACT, clientContactDetails, (err, result) => {
                if (err) {
                    console.error("Error inserting client contact details", err);
                    callback(err, null);
                }
            });
            callback(null, result.insertId);
            console.log("Single data insert done for id", result.insertId);
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        callback(error, null);
    }
};

module.exports = {getAllClients, createNewClient, getOneClient, deleteClientById, updateClientById};