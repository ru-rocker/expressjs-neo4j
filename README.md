# Overview
This is a demo CRUD service by using NodeJS and Neo4j.

# REST
This demo is about creating, updating, retrieveng and deleting companies object via web service.
The web service itself will be exposed as a REST service, following its standard:
* POST: to create a company
* PUT: to update a company
* GET: to retrieve comapanies
* DELETE: to remove companies
Default path is `http://localhost:3000`.

# NodeJS
For this purpose, I will use `ExpressJS` as a web application framework. 
As a basic setup, I use express generator.
For authentication I use JWT mechanism, by using `PassportJS`
And several supporting libraries such as `swagger`, `morgan`, `lodash`.
Least, for connecting to Neo4j, I use official neo4j javascript driver `neo4j-driver`.

## Dependencies
Here are the complete dependencies by far

       npm install morgan body-parser cors neo4j-driver method-override config.json lodash swagger-node-express swagger-jsdoc swagger-ui-express passport passport-jwt jsonwebtoken --save
       npm install eslint --save-dev

## Run ESLINT
How to linter code

       ./node_modules/.bin/eslint --ext *.js


## Testing
Testing dependencies
      
       npm install mocha chai chai-http --save-dev

# Run your application

       npm start

# Execute test

       npm test


# Swagger
All the endpoint is documented through swagger, by accessing context path `api-docs`.

