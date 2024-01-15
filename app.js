const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const port = process.env.PORT || 80;

app.get("/",(req,res)=>{
    res.send("Server set!");
})

app.listen(port, "0.0.0.0", ()=>{
    console.log(`App running on port ${port}`);
});