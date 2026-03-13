const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderhub";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js")

app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate); 
app.use(express.static(path.join(__dirname,"/public"))); 

main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err); 
});

async function main(){
    await mongoose.connect(MONGO_URL); 
}
app.get("/",(req,res)=>{
    res.send("Hi i am root");
}); 

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

//listings route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//New route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs",{listing});
}));
//Create route
app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);  
        await newListing.save();
        res.redirect("/listings");
}));
//Edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req,res)=>{ 
    let {id}=req.params;    
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
//reviews route
app.post("/listings/:id/reviews",validatereview,wrapAsync( async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review( req.body.review);
   

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);

}))

//review Delete route 

app.delete("/listings/:id/reviews/:reviewId",wrapAsync( async(req,res)=>{
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

//Error throw for random route
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
//Error Handler Middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

//Port
app.listen(8080,()=>{
    console.log("server is listening to 8080");
});


// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved"); 
//     res.send("sucessfull");
// })