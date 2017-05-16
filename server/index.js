//Import node_modules
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mysql = require("mysql");

var app = express();

//Path variables
var clientPath = path.join(__dirname, "../client");

//Static File
app.use(express.static(clientPath));

//body-parser for JSON
app.use(bodyParser.json());

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "willsmith",
    password: "romans831",
    database: "Seinfeld"
});

function sendQuery(procedure, values) {
    return new Promise(function (fulfill, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                var queryString;
                switch (procedure) {
                    case "GET_ALL":
                        queryString = "CALL GetAllThoughts()";
                        break;
                    case "GET_SINGLE":
                        queryString = "CALL GetSingleThought(?)";
                        break;
                    case "INSERT":
                        queryString = "CALL InsertThought(?, ?)";
                        break;
                    case "UPDATE":
                        queryString = "CALL UpdateThought(?, ?)";
                        break;
                    case "DELETE":
                        queryString = "CALL DeleteThought(?)";
                        break;
                    case "GET_USERS":
                        queryString = "SELECT * FROM Users";
                        break;
                }
                connection.query(queryString, values, function (err, resultSets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(resultSets);
                    }
                })
            }
        });
    });
}
//Set up routes 
app.route("/thoughts/*/update")
    .get(function (req, res) {
        res.sendFile(path.join(clientPath, "views/update.html"));
    })

app.route("/thoughts/*")
    .get(function (req, res) {
        res.sendFile(path.join(clientPath, "views/single.html"));
    })

app.route("/thoughts")
    .get(function (req, res) {
        res.sendFile(path.join(clientPath, "views/list.html"));
    })

//SET UP OUR ROUTE FOR /API/thoughts
app.route("/api/thoughts")
    //IF SOMEONE IS SENDING A 'GET' REQUEST TO OUR ROUTE
    .get(function (req, res) {
        sendQuery("GET_ALL", []).then(function (data) {
            res.send(data[0]);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    })
    //OTHERWISE, IF SOMEONE IS SENDING A 'POST' REQUEST TO OUR ROUTE
    .post(function (req, res) {
        sendQuery("INSERT", [req.body.message, req.body.userid]).then(function (data) {
            res.status(201).send(data[0]);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

//SET UP OUR ROUTE FOR USERS
app.route('/api/users')
    .get(function (req, res) {
        sendQuery("GET_USERS", []).then(function (data) {
            res.send(data);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

//SET UP OUR ROUTE FOR AN INDIVIDUAL Thought
app.route("/api/thoughts/:id")
    .get(function (req, res) {
        sendQuery("GET_SINGLE", [req.params.id]).then(function (data) {
            console.log(data);
            res.send(data[0]);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .put(function (req, res) {
        sendQuery("UPDATE", [req.params.id, req.body.message]).then(function (data) {
            res.sendStatus(204);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .delete(function (req, res) {
        sendQuery("DELETE", [req.params.id]).then(function () {
            res.sendStatus(204);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

//LISTEN ON PORT 3000
app.listen(3000);


