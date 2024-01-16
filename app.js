const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/",(req,res)=>{
    res.render("main");
})

app.listen(port, "0.0.0.0", ()=>{
    console.log(`App running on port ${port}`);
});