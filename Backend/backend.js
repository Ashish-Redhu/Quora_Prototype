const path = require("path");           // To access public/views from anywhere.
const express = require("express");
const {v4: uuidv4} = require("uuid");   // To generate random user-id.
const app = express();
const port=8080;
app.listen(port, ()=>{
    console.log(`I am backend server and listening on http://localhost:8080/posts`);
})


// To use view-files from anywhere.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// To use public files from anywhere.
app.use(express.static(path.join(__dirname, "../public")));

// To understand data send by "Post" request.
app.use(express.urlencoded({extended : true}));
app.use(express.json());

// For now we don't have data-base, that's why we will store data inside array in the form of objects.
let arr=[
    {
      userid: uuidv4(),
      authorname: "Ashish", 
      content: "My name is Ashish a Full stack web-developer."
    },
    {
      userid: uuidv4(), 
      authorname: "Aman", 
      content: "I am Aman an Android developer."
    }
]

//1.)  To view all the posts that already exist.
app.get("/posts", (req, res)=>{
    res.render("home.ejs", {arr});
})
//1.i) To view a particular post.
app.get("/posts/:userid", (req, res)=>{
    let {userid}=req.params;
    let post=arr.find(p => p.userid === userid);
    res.render("viewsinglepost.ejs", {post});
})

//2.)  To create a new post.
// i) Render form
app.post("/posts", (req, res)=>{
    res.render("createpost.ejs");
})
// ii) Update data in array/db.
app.post("/posts/new", (req,res)=>{
    let {username, content}=req.body;
    console.log(username); 
    console.log(content);
    arr.push({userid: uuidv4(), authorname: username, content});
    res.redirect("/posts");   // Redirecting to posts page after saving.
})
// What we are doing, we are making all the updates in the main-backend file which is connected to DB. We are not making updates in the renderd files. 


//3.) To update a post
// i) Accepting the request from button, get request and render an edit form.
app.get("/posts/:id/edit", (req,res)=>{
    let {id}=req.params;
    let post=arr.find((p) => p.userid === id);
    res.render("editpost.ejs", {post});
})

// ii) Making updates in array of objects after form submission
// We can't directly make PATCH requests. For that we have to take help of a package of express.
// npm install method-override.
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.patch("/posts/:id", (req,res)=>{
    let {id}=req.params;
    let newcontent=req.body.content;
    let post = arr.find((p)=> p.userid === id);
    post.content=newcontent;
    res.redirect("/posts");
})

// By default a form send "get" request and possible to send "post" request also. But for sending another type of request we use this method-override. we write the same thing "post" inside method. But make some changes in "action" url only.



//4.) Delete a post.
app.get("/posts/:id/delete", (req,res)=>{
    let {id} = req.params;
    let post = arr.find((p) => p.userid === id);
    arr = arr.filter((p) => p.userid != id);
    res.redirect("/posts");
})