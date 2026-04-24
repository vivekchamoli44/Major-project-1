const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema"); 
const Review=require("./models/reviews");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
         return res.redirect("/login");
    }  
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);    
        if(!listing.owner._id.equals(res.locals.currentUser._id)){
            req.flash("error","You dont have permission to edit or delete This Listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
}
  

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

//JOI validation    
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);    

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

//REVIEW DELETION AUTHORIZATION
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);    
        if(!review.author.equals(res.locals.currentUser._id)    ){
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
}
