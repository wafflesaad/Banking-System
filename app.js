const express = require("express");
const path = require("path");
// const mysql = require("mysql2");
const mongoose = require("mongoose");


// const mongodb = require("mongodb");
// const mongoclient = mongodb.MongoClient;

const app = express();
const port = process.env.PORT || 3000;

const url = "mongodb://localhost:27017/Bank";
const dbname = "Bank";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

// const client = new mongoclient(url, {useNewUrlParser: true,useUnifiedTopology: true});
// const client = new mongoclient(url,{ useNewUrlParser: true, useUnifiedTopology: true });

// client.connect((err)=>{
//     if(err){
//         console.log(err);
//         return;
//     }

//     console.log("Connected to mongodb database");
//     resolve();
// });


// let p = new Promise((resolve,reject)=>{

//     try{
//         client.connect((err)=>{
//             if(err){
//                 console.log(err);
//                 return;
//             }
        
//             console.log("Connected to mongodb database");
//             resolve();
//         });
//     }
//     catch(err){
//         reject(err);
//     }

// });


// p.then(()=>{
//     console.log("Connected to Mongodb");
// }).catch((err)=>{
//     console.log(err);
// });




app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/",(req,res)=>{
    res.render("main");
})

app.listen(port, "0.0.0.0", ()=>{
    console.log(`App running on port ${port}`);
});