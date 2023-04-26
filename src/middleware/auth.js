const jwt=require("jsonwebtoken");


const auth=async (req,res,next)=>{
try {
    const authToken= req.header("Authorization").replace("Bearer","").trim();
    const verify =jwt.verify(authToken,"secretKey");
    next()
} catch (error) {
    res.status(400).json("authentication failed")
}
}


module.exports=auth