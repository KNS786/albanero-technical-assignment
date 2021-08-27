var myLogger=(req,res,next)=>{
    console.log("middleware started")
    next();
}
module.exports=myLogger