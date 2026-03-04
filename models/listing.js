const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://image.pngaaa.com/13/1887013-middle.png",
        set:(v)=>v===""?"https://image.pngaaa.com/13/1887013-middle.png":v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;