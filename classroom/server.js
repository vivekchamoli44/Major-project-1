const express=require("express");
const app=express();
const users=require("./routes/user");
const posts=require("./routes/post");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

let sessionOptions={secret:"mysupersecretstring",resave:false,saveUninitialized:true};
app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"views"));



app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name=='anonymous'){
        req.flash("error","Some error occured");
    }
    else{
        req.flash("success","user registered");
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
});

//port
app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
});