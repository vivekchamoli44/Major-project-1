const express=require("express");
const router=express.Router();

//POSTS

//index

router.get("/",(req,res)=>{
    res.send("Get all posts");
}); 
//Show-user
router.get("/:id",(req,res)=>{
    res.send("Get for posts using id ");
});
//post route
router.post("/",(req,res)=>{
    res.send("post for posts");
});

//delete route
router.delete("/:id",(req,res)=>{
    res.send("Delete for posts");
});

module.exports=router;