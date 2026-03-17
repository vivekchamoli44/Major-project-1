const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js")
const ExpressError=require("../utils/ExpressError.js")

//JOI validation    
const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);    

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

//reviews route
router.post("/",validatereview,wrapAsync( async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review( req.body.review);
   

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review added !")
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);

}))

//review Delete route 
router.delete("/:reviewId",wrapAsync( async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted ")
    res.redirect(`/listings/${id}`);
}))


module.exports=router;