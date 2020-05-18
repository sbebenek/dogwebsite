//basic express app - source https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3
//an express app interfaces with the database by handling api requests
//import mysql when you want to use that
const express = require('express');
const path = require('path');
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());


//MYSQL CONNECTION DONE HERE - source https://www.youtube.com/watch?v=xn9ef5pod18&list=LLi27Shmiim3B-lLFh8XjLTQ&index=2
//database connection is made upon server start
var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "dogwebsite",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("Successfully connected to dogwebsite database");
    }
    else {
        console.log("Connection error");
    }
});

// Serve the static files from the React app -- only viewable once react app is built for production deployment
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req, res) => {
    var list = ["Doggus", "Echo", "Perogi"];
    res.json(list);
    console.log('Sent list of items (not from database)');
});

//api endpoint that returns list of dogs in the database
app.get('/api/dogs/list', (req, res) => {
    mysqlConnection.query("SELECT * from dogs", (err, result, fields) => {
        if (!err) {
            res.json(result);
            console.log("-----");
            console.log("Sent list of dogs from the database");
        }
        else {
            console.log(err);
        }
    });
});

//api endpoint that adds a dog to the database
app.post('/api/dogs/add', (req, res) => {
    console.log("-----");
    console.log("Data was just received by the server: Add Dog post data")
    //POST Parameters are grabbed using req.body.variable_name
    let body = req.body;
    let name = body.name, breed = body.breed, gender = body.gender, age = body.age, weight = body.weight, color = body.color;
    //named placeholders strips sql commands - prevents sql injections - https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs
    mysqlConnection.query("INSERT INTO dogs (dogname, dogbreed, doggender, dogage, dogweight, dogcolor) VALUES (?, ?, ?, ?, ?, ?)", [
        name,
        breed,
        gender,
        age,
        weight,
        color
    ], (err, result, fields) => {
        if (!err) {
            res.send("success");
            console.log("Dog entry was successfully added to the database with these values: " + name + ', ' + breed + ', ' + gender + ', ' + age + ', ' + weight + ', ' + color);
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});

//api endpoint that gets a dog with a given id
app.get('/api/dogs/:id', (req, res) => {
    console.log("-----");
    console.log("Dog was requested with the id of: " + req.params.id);
    //if id is null or invalid (ie. NaN)
    if (req.params.id === null || isNaN(req.params.id)) {
        console.log("Error: ID is null or invalid");
        return res.status(400).send({
            message: 'Invalid or missing ID'
        });
    }
    //else, id is valid
    mysqlConnection.query("SELECT * FROM dogs WHERE dogid = ?", [
        req.params.id
    ], (err, result, fields) => {
        if (!err) {
            if (result.length === 0) {
                console.log("No entry with that ID found");
                console.log(result);
                res.status(400).json({
                    '': ''
                });            }
            else {
                res.json(result);
                console.log("Sent dog entry with the id: " + req.params.id);
            }
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});

//**UPDATE DOGS */
app.put('/api/dogs/update/:id', (req, res) => {
    console.log("-----");
    console.log("Data was received to update dog entry at id: " + req.params.id);

    //POST Parameters are grabbed using req.body.variable_name
    let body = req.body;
    let id = body.id, name = body.name, breed = body.breed, gender = body.gender, age = body.age, weight = body.weight, color = body.color;
    //named placeholders strips sql commands - prevents sql injections - https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs
    mysqlConnection.query("UPDATE dogs SET dogname = ?, dogbreed = ?, doggender = ?, dogage = ?, dogweight = ?, dogcolor = ? WHERE dogid = ?;", [
        name,
        breed,
        gender,
        age,
        weight,
        color,
        id
    ], (err, result, fields) => {
        if (!err) {
            res.send("success");
            console.log("Dog entry at id "+ id +" was successfully updated to the database with these values: " + name + ', ' + breed + ', ' + gender + ', ' + age + ', ' + weight + ', ' + color);
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});

//**API DELETE DOGS ENDPOINT */
app.delete('/api/dogs/delete/:id', (req, res) => {
    console.log("-----");
    console.log("Data was received to delete dog entry at id: " + req.params.id);
    //if id is null or invalid (ie. NaN)
    if (req.params.id === null || isNaN(req.params.id)) {
        console.log("Error: ID is null or invalid");
        return res.status(400).send({
            message: 'Invalid or missing ID'
        });
    }
    //else, id is valid
    mysqlConnection.query("DELETE FROM dogs WHERE dogid = ?", [
        req.params.id
    ], (err, result, fields) => {
        if (!err) {
            if (result.length === 0) {
                console.log("No entry with that ID found");
                console.log(result);
                res.status(400).json({
                    '': ''
                });            }
            else {
                res.json(result);
                console.log("Deleted dog entry with the id: " + req.params.id);
            }
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});

//********************************************************************************************************************************************************************************/
//***************************************************                     LOGIN ENDPOINTS                           **************************************************************/
//********************************************************************************************************************************************************************************/

app.post('/api/accounts/signin', (req, res) => {
    console.log("-----");
    console.log("Account with username: " + req.body.username + " attempting to sign in...");
    //if id is null or invalid (ie. NaN)
    if (req === null) {
        console.log("Error: Request is null or invalid");
        return res.status(400).send({
            message: 'Error: Request is null or invalid'
        });
    }
    //else, id is valid
    mysqlConnection.query("SELECT * FROM accounts WHERE accountusername = ? AND accountpassword = ?", [
        req.body.username,
        req.body.password
    ], (err, result, fields) => {
        if (!err) {
            if (result.length === 0) {
                console.log("No entry with that username and password found.");
                console.log(result);
                res.json(result);            
            }
            else {
                const data = {
                    id: result[0].accountid,
                    username: result[0].accountusername,
                    isadmin: result[0].accountisadmin
                }
                
                res.json(data);
                console.log("Sent account entry with the username: " + req.body.username);
                console.log("Sending this data: " + data.username + ", " + data.isadmin);
            }
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});


// Handles any requests that don't match the ones above -- only viewable once react app is built for production deployment
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('Express App is running and listening on port ' + port);