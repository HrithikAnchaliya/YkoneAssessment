var connection = require("../db/sqlConnection");
var injestion = require("./injestion");

//move these to a constants file for sql queries
const GET_ALL_CLIENTS = "SELECT * FROM client,client_finance,client_contact WHERE client.id = client_finance.client_id AND client.id = client_contact.client_id LIMIT ? OFFSET ?"
const TOTAL_CLIENTS = "SELECT count(*) FROM client";

const CREATE_NEW_CLIENT = "INSERT INTO client (name, description, activity, cin, registration_date, category, sub_category, roc, class, status) VALUES (?,?,?,?,?,?,?,?,?,?)";
const CREATE_NEW_CLIENT_2 = 'INSERT INTO client_finance (client_id, auth_capital, paid_capital) VALUES (?,?,?)';
const CREATE_NEW_CLIENT_3 = 'INSERT INTO client_contact (client_id, pincode, state, address, email) VALUES (?,?,?,?,?)';

const DELETE_CLIENT_FINANCE = "DELETE FROM client_finance WHERE client_id = ?";
const GET_ONE_CLIENT = "SELECT * FROM client,client_finance,client_contact WHERE client.id = client_finance.client_id AND client.id = client_contact.client_id AND client.id = ?"
const UPDATE_CLIENT = "UPDATE client SET name=?, description=?, activity=?, cin=?, registration_date=?, category=?, sub_category=?, roc=?, class=?, status=? WHERE id=?";
const UPDATE_CLIENT_FINANCE = "UPDATE client_finance SET auth_capital=?, paid_capital=? WHERE client_id = ?";
const UPDATE_CLIENT_CONTACT = "UDPATE client_contact SET pincode=?, state=?, address=?, email=? WHERE client_id=?";


//need to make the below logic look better, but first fundamental functionality to be tested
const getAllClients = async (page=1, limit=20) => {
    const offset = page - 1 * limit;
    const[clients] = connection.execute(GET_ALL_CLIENTS, [limit, offset]);
    const [total] = connection.execute(TOTAL_CLIENTS);

    const totalPages = Math.ceil(total[0].total/limit);
    return {
        data: clients,
        page: page,
        size: limit,
        totalPages: totalPages
    }
};

const createNewClient = async(clientData) => {
    injestion(clientData);   
}

const getOneClient = async (clientId) => {
    const [client] = connection.execute(GET_ONE_CLIENT, [clientId], function(err){
        if(err) console.error(err);
    });
    return {
        data: client
    }
}

module.exports = {getAllClients};