const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


const listingController=require("../controllers/listings.js");

//Listings Route,Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//Show,Update,Delete Routes
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
module.exports=router;