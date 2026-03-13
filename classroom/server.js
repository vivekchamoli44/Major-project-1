const express=require("express");
const app=express();


app.get("/",(req,res)=>{
    res.send("Hi i am root");
});
//USERS
//index

app.get("/users",(req,res)=>{
    res.send("Get all users");
});
//Show-user
app.get("/users/:id",(req,res)=>{
    res.send("Get for show user id ");
});
//post route
app.post("/users",(req,res)=>{
    res.send("post for users");
});

//delete route
app.delete("/users/:id",(req,res)=>{
    res.send("Delete for users");
});

//POSTS

//index

app.get("/",(req,res)=>{
    res.send("Get all users");
});
//Show-user
app.get("/users/:id",(req,res)=>{
    res.send("Get for show user id ");
});
//post route
app.post("/users",(req,res)=>{
    res.send("post for users");
});

//delete route
app.delete("/users/:id",(req,res)=>{
    res.send("Delete for users");
});



app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
});