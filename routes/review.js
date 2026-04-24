const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing");
const Review=require("../models/reviews.js")
const {validatereview,isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


//reviews route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.createReview));

//review Delete route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;