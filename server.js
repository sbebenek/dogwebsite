//basic express app - source https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3
//an express app interfaces with the database by handling api requests
//import mysql when you want to use that
require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto'); //required for random 'unique' multer file naming
const mime = require("mime"); //required for random 'unique' multer file naming
const cors = require('cors');
const fs = require('fs'); //filesystem, needed to delete image files
const bcrypt = require('bcryptjs'); //required for login password hashing

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/public', express.static(path.join(__dirname,'/client/public')));


//MYSQL CONNECTION DONE HERE - source https://www.youtube.com/watch?v=xn9ef5pod18&list=LLi27Shmiim3B-lLFh8XjLTQ&index=2
//database connection is made upon server start
var mysqlConnection = mysql.createConnection({
    /* local connection string
    host: "localhost",
    user: "root",
    password: "root",
    database: "dogwebsite",
    multipleStatements: true
    */
   host: "us-cdbr-east-05.cleardb.net",
   user: "bc4b59c8dae429",
   password: "04f9a378",
   database: "heroku_63a39bb59a8dbcf",
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






//MULTER INSTANCE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/client/public/images')) 
    },

    filename: function (req, file, cb) {
        //https://github.com/expressjs/multer/issues/170#issuecomment-123362345
        //generate a random unique name based on the current date/time
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2500000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            console.log("Image upload validation passed. file type = " + file.mimetype);
            cb(null, true);
        }
        else {
            console.log("image upload validation failed. file type = " + file.mimetype + ", file size = " + file.size / 1000000 + "mb. Either wrong file type or size > 2.5mb");
            cb(null, false);
            return cb(new Error('Validation failed. Image invalid file type - ' + file.mimetype));
        }
    }
}).single('file');








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

//api endpoint that returns the 3 newest dog entries in the database
app.get('/api/dogs/new', (req,res) => {
    mysqlConnection.query("SELECT * FROM dogs ORDER BY dogid DESC LIMIT 3", (err, result, fields) => {
        if(!err) {
            res.json(result);
            console.log("-----");
            console.log("Sent list of 3 newest dogs from the database");
        }
        else {
            console.log(err);
            res.json(err);
        }
    });
});


//api endpoint that adds a dog to the database
app.post('/api/dogs/add', authenticateToken, (req, res) => {
    console.log("-----");
    console.log("Data was just received by the server: Add Dog post data");
    if (req.id === null) { //if there somehow was no id in the JWT token or if the JWT token was never set and the code somehow reached here, return 401
        return res.status(401).send({
            message: 'Invalid or missing authentication token'
        });
    }
    //POST Parameters are grabbed using req.body.variable_name
    let body = req.body;
    let name = body.name, breed = body.breed, gender = body.gender, age = body.age, weight = body.weight, color = body.color, description = body.description, location = body.location;
    //named placeholders strips sql commands - prevents sql injections - https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs
    mysqlConnection.query("INSERT INTO dogs (dogname, dogbreed, doggender, dogage, dogweight, dogcolor, dogdescription, doglocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        name,
        breed,
        gender,
        age,
        weight,
        color,
        description,
        location
    ], (err, result, fields) => {
        if (!err) {
            let response = {
                id: result.insertId
            }
            res.json(response);
            console.log("result id = " + result.insertId);
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
                });
            }
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
app.put('/api/dogs/update/:id', authenticateToken, (req, res) => {
    console.log("-----");
    console.log("Data was received to update dog entry at id: " + req.params.id);

    //POST Parameters are grabbed using req.body.variable_name
    let body = req.body;
    let id = body.id, name = body.name, breed = body.breed, gender = body.gender, age = body.age, weight = body.weight, color = body.color,
        description = body.description, location = body.location;
    //react & express file upload - https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
    //named placeholders strips sql commands - prevents sql injections - https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs
    mysqlConnection.query("UPDATE dogs SET dogname = ?, dogbreed = ?, doggender = ?, dogage = ?, dogweight = ?, dogcolor = ?, dogdescription = ?, doglocation = ? WHERE dogid = ?;", [
        name,
        breed,
        gender,
        age,
        weight,
        color,
        description,
        location,
        id
    ], (err, result, fields) => {
        if (!err) {
            res.send("success");
            console.log("Dog entry at id " + id + " was successfully updated to the database with these values: " + name + ', ' + breed + ', ' + gender + ', ' + age + ', ' + weight + ', ' + color);
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});

//**API UPLOAD IMAGE ENDPOINT **//
app.post('/api/upload', authenticateToken, (req, res) => {
    console.log("-----");
    console.log("file being uploaded...");
    console.log("validating image file...");

    //react & express file upload - https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer Error. If the image uploaded uploaded was larger than 2.5mb, that may be why this error was triggered.");
            return res.status(500).json(err);
        } else if (err) {
            console.log("Unknown Error.");
            console.log(err);
            console.log(req.body);
            return res.status(500).json(err);
        }
        console.log("Validation passed!");
        console.log(req.body);
        console.log("new file name - " + req.file.filename);

        /*** DELETING OLD IMAGE IF IT EXISTS HERE ***/
        console.log("Selecting entry with id " + req.body.id + " to see if it has an image...");
        mysqlConnection.query("SELECT * FROM dogs WHERE dogid = ?;", [
            req.body.id
        ], (err, result, fields) => {
            if (!err) {
                if (result.length === 0) {
                    console.log("No entry with that ID found");
                    console.log(result);
                    res.status(400).json({
                        '': ''
                    });
                }
                else {
                    if (result[0].dogimageref === null || result[0].dogimageref === "") {
                        console.log("This entry's imageref = " + result[0].dogimageref);
                        console.log("No image currently associated with this record. Nothing to delete.");
                    }
                    else {
                        console.log("Image found - " + result[0].dogimageref);
                        console.log("Deleting this image...");
                        //deleting image with fs - https://stackoverflow.com/questions/41411604/how-to-delete-local-file-with-fs-unlink
                        fs.unlink(path.join(__dirname, '/client/public/images/' + result[0].dogimageref), (err) => {
                            if (err) {
                                console.log("failed to delete local image:" + err);
                            } else {
                                console.log('successfully deleted local image');
                            }
                        });
                    }
                }
            }
            else {
                console.log(err);
            }
        });

        //now, add that file name to this id's database entry
        mysqlConnection.query("UPDATE dogs SET dogimageref = ? WHERE dogid = ?;", [
            req.file.filename,
            req.body.id
        ], (err, result, fields) => {
            if (!err) {
                console.log("Dog entry at id " + req.body.id + " has had its image sucessfully updated to " + req.file.filename);
                res.status(200);
            }
            else {
                res.send(err);
                console.log(err);
            }
        });


        console.log("File sucessfully uploaded. Check the /public/images folder!");
        return res.status(200).send(req.file);
    })
});

//**API DELETE DOGS ENDPOINT */
app.delete('/api/dogs/delete/:id', authenticateToken, (req, res) => {
    console.log("-----");
    console.log("Data was received to delete dog entry at id: " + req.params.id);
    //if id is null or invalid (ie. NaN)
    if (req.params.id === null || isNaN(req.params.id)) {
        console.log("Error: ID is null or invalid");
        return res.status(400).send({
            message: 'Invalid or missing ID'
        });
    }

    /*** DELETING OLD IMAGE IF IT EXISTS HERE ***/
    console.log("Selecting entry with id " + req.body.id + " to see if it has an image...");
    mysqlConnection.query("SELECT * FROM dogs WHERE dogid = ?;", [
        req.params.id
    ], (err, result, fields) => {
        if (!err) {
            if (result.length === 0) {
                console.log("No entry with that ID found");
                console.log(result);
                res.status(400).json({
                    '': ''
                });
            }
            else {
                if (result[0].dogimageref === null || result[0].dogimageref === "") {
                    console.log("This entry's imageref = " + result[0].dogimageref);
                    console.log("No image currently associated with this record. Nothing to delete.");
                }
                else {
                    console.log("Image found - " + result[0].dogimageref);
                    console.log("Deleting this image...");
                    //deleting image with fs - https://stackoverflow.com/questions/41411604/how-to-delete-local-file-with-fs-unlink
                    fs.unlink(path.join(__dirname, '/client/public/images/' + result[0].dogimageref), (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });
                }
            }
        }
        else {
            console.log(err);
        }
    });

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
                });
            }
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

    /**
     * JWT Token creation and refresh - https://www.youtube.com/watch?v=mbsmsi7l3r4
     * STEPS:
     * 1. authenticate user by comparing username and password to entries in the database
     */
    mysqlConnection.query("SELECT * FROM accounts WHERE accountusername = ?", [
        req.body.username
    ], (err, result, fields) => {
        if (!err) {
            if (result.length === 0) {
                console.log("No entry with that username and password found.");
                console.log(result);
                res.json(result);
            }
            else if (bcrypt.compareSync(req.body.password, result[0].accountpassword) === false) {
                console.log("Incorrect password for username");
                res.json(null); //wrong way to do this but front end expects an empty response for invalid passwords
            }
            else {
                const user = {
                    id: result[0].accountid,
                    username: result[0].accountusername,
                    isadmin: result[0].accountisadmin
                }

                //creating the jwt token
                const jwtToken = generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); // TODO: add the refresh token to a database, to prove that the refresh token exists
                user.jwtToken = jwtToken;
                user.refreshToken = refreshToken;

                res.json(user);
                console.log("Sent account entry with the username: " + req.body.username);
                console.log("Sending this data: " + user.username + ", " + user.isadmin);
            }
        }
        else {
            res.send(err);
            console.log(err);
        }
    });
});

/**
 * authorize that a given JWT token indicates that a authenticated user is an admin
 */
app.post('/api/accounts/admin', authenticateToken, (req, res) => {
    if (userIsAdmin(req) === true) {
        res.status(200);
    }
    else res.status(401);
});

//if on the front end a token check determines that a token is expired, call this endpoint with the refresh token in the body as 'token'
app.post('/api/accounts/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) { return res.sendStatus(401); }
    //TODO: check if the refresh token exists on the database. If it doesnt, return 403
    //else, it exists on the database and is a valid refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) { return res.sendStatus(403); }
        const accessToken = generateAccessToken({ id: user.id, username: user.username, isadmin: user.isadmin }); //generate a new token with all the same parameters as the old token
        res.json();
    })
});

app.delete('/api/accounts/signout', (req, res) => {
    //TODO: remove the given refresh token from the refresh token database. On the front end, delete the state variables and jwt cookie
    res.sendStatus(204);
});



/**
 * NOTE: if I want to add an add new account enpoint in the future, i will need to hash the password before adding it to the database
 */


//********************************************************************************************************************************************************************************/
//***************************************************                     EVERYTHING ELSE                           **************************************************************/
//********************************************************************************************************************************************************************************/

// Handles any requests that don't match the ones above -- only viewable once react app is built for production deployment
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


//******** AUTHENTICATION MIDDLEWARE - authenticates a given token */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // this header will have the format 'Bearer TOKEN'
    const token = authHeader && authHeader.split(' ')[1]; //if the header doesn't exist, return as undefined. If it does, return the token
    if (token == null) {
        console.log("Authenticated request attempt: no token found");
        return res.sendStatus(401); //this is the part that might not work...
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, id, username, isadmin) => {
        if (err) {
            console.log("Authenticated request attempt: expired token - response status 403");
            return res.sendStatus(403);  //a token exists, but it has expired and is no longer valid
        }
        req.id = id; //add a field to the request containing the user id
        req.isadmin = isadmin;
        next(); //move on from the middleware
    });
}

/**
 * Generates a JWT token with the given user object
 * @param {Object} user 
 * @returns {String} token
 */
function generateAccessToken(user) {
    //i want my token to contain user id, username, and isadmin
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' }); //token expires in 1 hour

}

/**
 * determines if a user is an admin if the req contains a 'isadmin' field
 * @param req
 * @returns {boolean} isAdmin
 */
function userIsAdmin(req) {
    if (req.isadmin !== null && req.isadmin === 1) {
        return true;
    }
    else return false;
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express App is running and listening on port ${PORT}`);
});

//old non-heroku way
//console.log('Express App is running and listening on port ' + port);