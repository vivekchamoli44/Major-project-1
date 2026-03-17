const express=require("express");
const router=express.Router();



//USERS
//index

router.get("/",(req,res)=>{
    res.send("Get all users");
});
//Show-user
router.get("/:id",(req,res)=>{
    res.send("Get for show user id ");
});
//post route
router.post("/",(req,res)=>{
    res.send("post for users");
});

//delete route
router.delete("/:id",(req,res)=>{
    res.send("Delete for users");
});


module.exports=router; 