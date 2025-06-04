// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require('dotenv').config()


// const app = express(express.json);


// const jwt = require('jsonwebtoken');
 


// const posts = [
//     {
//         username: 'Munaxe',
//         title: 'Post 1'
//     },
//     {
//         username: 'Loid',
//         title: 'Post 2'
//     }
// ]

// app.get('/posts', (req, res) => {
//     res.json(posts);
// })

// app.post('/login', (req, res) => {
//     //authenticate users
//     const username = req.body.username;
//     const user = {name: username}

//     const token = jwt.sign(user, process.env.JWT_SECRET_KEY)
//     res.json({token: token})
// })