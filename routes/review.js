const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing");
const Review=require("../models/reviews.js")
const {validatereview,isLoggedIn, isReviewAuthor}=require("../middleware.js");



//reviews route
router.post("/",isLoggedIn,validatereview,wrapAsync( async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review( req.body.review);
    console.log(newReview);
    newReview.author=req.user._id;  
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review added !")
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);

}))

//review Delete route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync( async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted ")
    res.redirect(`/listings/${id}`);
}))


module.exports=router;