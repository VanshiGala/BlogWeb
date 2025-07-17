import { Router } from "express";
import multer from "multer";
import path from 'path';
import Blog from "../models/blog.js"
import Comment from "../models/comments.js"


const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  path.resolve("./public/uploads/"))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname} `;
    cb(null, filename);
  }
})

const upload = multer({storage: storage})
router.get("/add-new", (req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
})

// router.get("/:id", async (req,res)=>{
//     const blog = await Blog.findById(req.params.id).populate("createdBy")
//     return res.render('blog', {
//       user:req.user,
//       blog,
//     })
// })
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) return res.status(404).send("Blog not found");

    return res.render("blog", {
      user: req.user,
      blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/comment/:blogId", async(req,res)=>{
 

  const comment = await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy: req.user._id,
  })
 return res.redirect(`/blog/${req.params.blogId}`);

})

router.post("/",upload.single("coverImage"), async (req,res)=>{
    const {title, body} = req.body
    
 const blogs = await  Blog.create({
    body,
    title,
    createdBy:req.user._id,
    coverImageURL:`/uploads/${req.file.filename}`,
  })
    return res.redirect(`/blog/${blogs._id}`);

})


export default router;