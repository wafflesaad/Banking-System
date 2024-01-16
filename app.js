const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const url = "mongodb://127.0.0.1:27017/Bank";

mongoose.connect(url);

// , {useNewUrlParser: true, useUnifiedTopology: true}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

const cutomerSchema = new mongoose.Schema({
    name: String,
    email: String,
    balance: Number,
    address: String
});

const customer = mongoose.model("customer", cutomerSchema);



app.post("/add", (req,res)=>{
  let body = req.body;
  console.log(body);

  const newcust = new customer({
    name: body.name,
    email: body.email,
    balance: body.balance,
    address: body.address
  });
  
  newcust.save();
  res.sendStatus(200);
});

app.get("/",(req,res)=>{
    res.render("main");
})

app.listen(port, "0.0.0.0", ()=>{
    console.log(`App running on port ${port}`);
});