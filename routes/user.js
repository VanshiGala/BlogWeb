import {application, Router} from "express"
import User from "../models/User.js"; 


const router = Router();

router.get("/signin",(req,res)=>{
    return res.render("signin" , {
    user: req.user})
});

router.get("/signup",(req,res)=>{
    return res.render("signup",{
      user:req.user,
    })
});



router.post("/signin", async (req,res)=>{
 
  const {email, password} = req.body;
  const token = await User.matchPasswordAndGenerateToken(email, password)
return res.cookie("token", token).redirect("/");
// res.cookie("token", token, { httpOnly: true }.redirect("/"));

     });

router.get("/logout",(req,res)=>{
res.clearCookie("token").redirect("/");
})

router.post("/signup", async (req,res)=>{
    console.log("req.body:", req.body); 
   try {
    const { fullName, email, password } = req.body;
    await User.create({ fullName, email, password });
    return res.redirect("/");
  } catch (err) {
   return res.status(400).render("signin", {
  error: "Incorrect email or password!",
  user: req.user,
});
   
  }
});

export default router;