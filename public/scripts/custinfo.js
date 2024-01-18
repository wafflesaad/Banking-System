const cname = document.getElementById("cname");
const caddress = document.getElementById("caddress");
const cemail = document.getElementById("cemail");
const cbalance = document.getElementById("cbalance");
const transfer = document.getElementById("transfer");
const sendcont = document.getElementById("sendcont");
const send = document.getElementById("send");
const sendto = document.getElementById("sendto");
const sendamount = document.getElementById("sendamount"); 
const statusmsg = document.getElementById("status");

statusmsg.style.display = "none";
sendcont.style.display = "none";

fetch("/getcustinfo", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        accountno: accountno
    })
}).then((res)=>{
    return res.json();
}).then((data)=>{
    console.log(data);
    cname.innerHTML += data.name;
    caddress.innerHTML += data.address;
    cemail.innerHTML += data.email;
    cbalance.innerHTML += data.balance;
}).catch((err)=>{
    console.log(err);
});


transfer.addEventListener("click", ()=>{
    if(sendcont.style.display == "none"){
        sendcont.style.display = "flex";
    }else{
        sendcont.style.display = "none";
    }
});

send.addEventListener("click", ()=>{
    let sendaddress = sendto.value;
    let amount = sendamount.value;
    
    fetch("/transact", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: accountno,
            to: sendaddress,
            amount: amount    
        })
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        if(statusmsg.style.display == "none"){
            statusmsg.style.display = "block";
        }

        if(data.custnotfound){
            statusmsg.innerHTML = "Customer not found";
            return;
        }

        if(data.recnotfound){
            statusmsg.innerHTML = "Recipient not found";
            return;
        }

        if(data.insufficientbalance){
            statusmsg.innerHTML = "Insufficient balance";
            return;
        }

        if(data.status == "success"){
            statusmsg.innerHTML = "Transaction successful";
        }
        cbalance.innerHTML = "Balance: " + data.newbalance;
    }).catch((err)=>{
        console.log(err);
        if(statusmsg.style.display == "none"){
            statusmsg.style.display = "block";
        }

        statusmsg.innerHTML = "Transaction failed";

    });
    
});

    

