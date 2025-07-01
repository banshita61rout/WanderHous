const express = require("express");
const app =express();
const mongoose =require("mongoose");
const listing = require('./models/listing');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderhous";
main().then(()=>{
    console.log("connected to db");
      
})   
.catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}
   
app.get("/",(req,res) => {
     res.send("hi ! im banshita... welcome  to this site")
    });
app.get("/testlisting",async(req,res) => {
    let samplelisting = new listing({
        title: "My New Villa",
        description:"by the beach",
        price:1200,
        location:"calangute,Goa",
        country:"India"
    })
     await samplelisting.save();
     console.log("sample was saved");
     res.send("succesfull");

})

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
});
