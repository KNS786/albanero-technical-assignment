const express=require('express');
const multer =require('multer');
const path=require('path')
const router=express.Router();
const logger=require('../middleware/logger')

//config
const {DB_COLLECTION_USER,DB_NAME}=require('../config');
//db
const {get}=require('../db.connection');

//Set Storage Engine
function setStorage(LoginUserName){
  var storage=multer.diskStorage({
    destination:`./uploads/${LoginUserName}/`,
    filename:function(req,file,cb){
        cb(null,file.fieldname+' '+Date.now()+path.extname(file.originalname));

    }
  })

  var upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
       checkFileType(file,cb);
    } 
   }).single('upload');

   return upload;
}
//chack file Type
function checkFileType(file,cb){
    var fileTypes=/jpg|jpeg|mp4/;
    var extname = fileTypes.test(path.extname(file.originalname).toLowerCase()) ;
    var mimeType=fileTypes.test(file.mimetype);
    
    if(mimeType && extname){
        return cb(null,true);
    }else{
        return cb("unknown file format");
    }
}

async function UploadFile(req,res,next,LoginUserName){
    let upload=setStorage(LoginUserName);
     upload(req,res,(err)=>{
        if(err){
            res.sendStatus(404).json({msg:'something went wrong'})
        }else{
          if(req.file==undefined){
              res.send({fileErr:'no file selected!'})
          }
          else{
            // res.status(200).json({msg:"file uploaded successfully"});
            res.status(200).json({'username':'navani'});
          }
  
        }
    })

}


router.post('/upload',async function(req,res){
    //create unique bucket
    let LoginUserName="kholi";
    await UploadFile(req,res,LoginUserName);

})





module.exports=router;