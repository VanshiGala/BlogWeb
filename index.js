import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import {checkForAuthentiationCookie} from "./middlewares/authentication.js"
import  userRoute from "./routes/user.js"
import  blogRoute from "./routes/blog.js"
import Blog from './models/blog.js'
const app = express()

mongoose.connect("mongodb://localhost:27017/blogify").then(e=>{
    console.log("MongoDB connected")
})

app.set('view engine', 'ejs')
app.set('views',path.resolve("./views"))

app.use(express.urlencoded({extended : true}))
app.use("/user", userRoute)
app.use(cookieParser())
app.use(checkForAuthentiationCookie("token"))
app.use(express.static(path.resolve("./public")));
app.use("/blog", blogRoute)


app.get("/",async  (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs : allBlogs,
    })
})


app.listen(8000,()=>{
    console.log("Server is running!")
})