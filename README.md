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

MYSQL Relations
 
![schema_1](https://github.com/HrithikAnchaliya/YkoneAssessment/assets/32984102/e1687b10-7803-433e-b564-3692f6134386)
![schema_2](https://github.com/HrithikAnchaliya/YkoneAssessment/assets/32984102/d71b8f5e-0ebb-4dbc-8328-1c62850f2e96)
![scehma](https://github.com/HrithikAnchaliya/YkoneAssessment/assets/32984102/70a9c7f2-1714-425f-94bd-a7abff1fd10c)

