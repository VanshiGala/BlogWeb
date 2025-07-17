import {Schema, model} from 'mongoose'
import { createToken } from "../service/authentication.js";
import { createHmac, randomBytes } from 'crypto';
const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
        
    },
    password:{
         type:String,
        required:true,
    },profileImageUrl:{
        type:String,
        default:"/public/default.png"
    }, 
    role:{
        type:String,
        enum:["USER", "ADMIN"],
        default:"USER",
    }
},{timestamps: true});

userSchema.pre('save', function(next){
const user = this;
if (!user.isModified("password")) return next();
const salt = randomBytes(16).toString("hex");
const hashedPass = createHmac("sha256",salt).update(user.password).digest("hex")
this.salt = salt;
this.password = hashedPass;
next()
})

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found")
   const salt = user.salt;
    const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex")
    if (user.password !== userProvidedHash) throw new Error("Incorrect password")
   const token = createToken(user)
    return token
})

const User = model("user", userSchema);
export default User;
