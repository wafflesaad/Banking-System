const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const url = "mongodb://127.0.0.1:27017/Bank";

try{
mongoose.connect(url);
}
catch(err){
  console.log(err);
}

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
    address: String,
    accountno: String
});

 const transactionSchema = new mongoose.Schema({
    from: String,
    to: String,
    amount: Number,
    date: Date
  });

const transaction = mongoose.model("transaction", transactionSchema);
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

app.post("/update", (req,res)=>{
  let body = req.body;
  console.log(body);

  customer.updateOne({name: body.name}, {$set:{accountno: body.accountno}}).then((result)=>{
    console.log("Updated");
    console.log(result);
  }).catch((err)=>{
    console.log("Error updating");
    console.log(err);
  });

  res.sendStatus(200);
});

//expected transaction body: from, to, amount

app.post("/transact", async (req,res)=>{
  let body = req.body;
  let abort = false;
  let newbalance = 0;
  async function findFrom(){
    console.log("findfrom started");
    await customer.findOne({accountno: body.from}).then((result)=>{
      if(!result){
        console.log("No from entry found");
        
        let obj = {
          custnotfound: true
        }
        res.send(obj);
        abort = true;
        return;
      }
      console.log(result);
      
      if(result.balance < body.amount){
        console.log("Insufficient balance");
        let obj = {
          insufficientbalance: true
        }
        res.send(obj);
        abort = true;
        return;
      }

    }).catch((err)=>{
      console.log(err);
      res.sendStatus(204);
    });
    console.log("findfrom ended");
  }

  async function findTo(){
    console.log("findto started");
    await customer.findOne({accountno: body.to}).then((result)=>{
      if(!result){
        console.log("No to entry found");
        let obj = {
          recnotfound: true
        }
        res.send(obj);
        abort = true;
        return;
      }
      console.log(result);
    }).catch((err)=>{
      console.log(err);
      res.sendStatus(204);
    });
    console.log("findto ended");
  }


  async function updateFrom(){
    console.log("updatefrom started");
    await customer.updateOne({accountno: body.from},{$inc:{balance: -body.amount}},).then((result)=>{
      console.log("Updated from");
      console.log(result);
    }).catch((err)=>{
      console.log("Error updating from");
      console.log(err);
    });

    await customer.findOne({accountno: body.from}).select("balance").then((result)=>{
      console.log("New balance");
      console.log(result);
      newbalance = result.balance;
    }).catch((err)=>{
      console.log(err);
    });

    console.log("updatefrom ended");
  }


  async function updateTo(){
    console.log("updateto started");
    await customer.updateOne({accountno: body.to},{$inc:{balance: body.amount}},).then((result)=>{
      console.log("Updated to");
      console.log(result);
    }).catch((err)=>{
      console.log("Error updating to");
      console.log(err);
    });

    console.log("updateto ended");
  }

  await findFrom();
  if(abort){
    return;
  }
  await findTo();
  if(abort){
    return;
  }
  await updateFrom();
  await updateTo();

  //adding entry to transaction history
  let entry = new transaction({
    from: body.from,
    to: body.to,
    amount: body.amount,
    date: new Date()
  });

  entry.save().then((result)=>{
    console.log(result);
  }).catch((err)=>{
    console.log(err);
  });
  
  let obj = {
    from: body.from,
    to: body.to,
    amount: body.amount,
    date: new Date(),
    status: "success",
    newbalance: newbalance
  }

  res.json(obj);

});

app.get("/",(req,res)=>{
    res.render("main");
})

app.get("/customers", (req,res)=>{
  res.render("customers");
});

app.get("/customers/:accno", (req,res)=>{
  let accno = req.params.accno;
  accno = accno.substring(1);
  res.render("custinfo", {accno: accno});

  // customer.findOne({accountno: accno}).then((result)=>{
  //   console.log(result);
  //   res.send(result);
  // }).catch((err)=>{
  //   console.log(err);
  // });

})

app.post("/getcustinfo", (req,res)=>{
  let accno = req.body.accountno;
  console.log(accno);
  customer.findOne({accountno: accno}).then((result)=>{
    console.log(result);
    res.send(result);
  }).catch((err)=>{
    console.log(err);
  });
  
});

app.get("/getcustomers", (req,res)=>{
  customer.find().select("name accountno").then((result)=>{
    res.send(result);
  }).catch((err)=>{
    console.log(err);
  });
});

app.listen(port, "0.0.0.0", ()=>{
    console.log(`App running on port ${port}`);
});