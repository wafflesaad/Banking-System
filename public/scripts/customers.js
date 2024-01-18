const custs = document.getElementById("custs");

fetch("/getcustomers", {
    method: "GET"
}).then((response) => {
    return response.json();
}).then((data)=>{
    console.log(data);

    for(let i = 0; i < data.length; i++){
        const cust = document.createElement("a");
        cust.href = "/customers/:" + data[i].accountno;
        cust.innerHTML = data[i].name;
        cust.className = "custobj";
        custs.appendChild(cust);
    }

}).catch((err)=>{
    console.log(err);
})