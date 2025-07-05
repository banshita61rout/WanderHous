const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing.js');
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderhous";
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Home route
app.get("/", (req, res) => {
  res.send("Hi! I'm Banshita... welcome to this site");
});

app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
});

//../listings/new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});


// Show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

//create route
app.post("/listings",async(req,res)=>{
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async(req,res)=>{
  let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
 let{id}=req.params;
 let deletedListing=await Listing.findByIdAndDelete(id);
 console.log("deletedListing");
 res.redirect("/listings");
}); 

// app.get("/testlisting",async(req,res) => {
//     let samplelisting = new listing({
//         title: "My New Villa",
//         description:"by the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India"
//     })
//      await samplelisting.save();
//      console.log("sample was saved");
//      res.send("succesfull");

// });
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

 