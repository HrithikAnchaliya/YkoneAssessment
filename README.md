YKone Assessment 

Assessment Title - Buiding a crawler and implementing an API to consume 

Stack Used: Nodejs, ExpressJS, Mysql, Elasticsearch

Commands to run the Project

Make sure to run `docker-compose up` to run an MSQL Instance
Elasticsearch running in cloud

.env -> ( Added ) 

1) npm install
2) npm run migrate-up -> ( To run migrations for creating table )
3) npm run migrate-down ->  ( To drop the tables )
4) node ./src/app.js -> (start the server)

Architecture of the project

1) Crawl the site and get all the data and injest simultaneously into both MSQL and ELASTICSEARCH
2) consume the API's to make CRUD opertions
3) Search API uses Elasticseach to get data 
