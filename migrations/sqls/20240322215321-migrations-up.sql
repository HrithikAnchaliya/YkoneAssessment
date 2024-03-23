/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS client (
	id INT(5) NOT NULL AUTO_INCREMENT COMMENT 'unique identifier',
	name VARCHAR(60) NOT NULL COMMENT 'name of the client',
    description VARCHAR(10000) DEFAULT NULL COMMENT 'name of the client',
    activity VARCHAR(60) DEFAULT NULL COMMENT 'activity of the client',
	cin VARCHAR(21) NOT NULL COMMENT 'CIN of client',
	registration_date DATE NOT NULL,
	category VARCHAR(60) DEFAULT NULL COMMENT 'category of the client',
	sub_category VARCHAR(60) DEFAULT NULL COMMENT 'category of the client',
	roc VARCHAR(60) NOT NULL COMMENT 'region of the client',
	class VARCHAR(100) DEFAULT NULL COMMENT 'class entity of the client',
	status VARCHAR(100) DEFAULT NULL COMMENT 'current status of the client',
	PRIMARY KEY (id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS client_finance (
	id INT(5) NOT NULL AUTO_INCREMENT COMMENT 'unique identifier',
	client_id INT(5) NOT NULL COMMENT 'unique identifier of a client',
	auth_capital INT(10) COMMENT 'authorized capital of the client',
	paid_capital INT(10) COMMENT 'paid capital of the client',
	PRIMARY KEY (id),
	CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES client (id) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS client_contact (
	id INT(5) NOT NULL AUTO_INCREMENT COMMENT 'unique identifier',
	client_id INT(5) NOT NULL COMMENT 'unique identifier of a client',
	pincode INT(6) NOT NULL COMMENT 'pincode of the region',
	state VARCHAR(50) NOT NULL COMMENT 'state of the region',
	address VARCHAR(500) NOT NULL COMMENT 'official address of the client',
	email VARCHAR(100) NOT NULL COMMENT 'official email address of the client',
	PRIMARY KEY (id),
	CONSTRAINT fk_client_id FOREIGN KEY (client_id) REFERENCES client (id) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
