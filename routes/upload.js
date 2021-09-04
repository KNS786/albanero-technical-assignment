const express=require('express');
const multer =require('multer');
const path=require('path')
const router=express.Router();
const logger=require('../middleware/logger')

//config
const {DB_NAME,DB_COLLECTION_UPLOAD_FILES}=require('../config');
//db
const {get}=require('../db.connection');

//Set Storage Engine
function setStorage(){
  var storage=multer.diskStorage({
    destination:`./uploads/`,
    filename:function(req,file,cb){
        cb(null,file.fieldname+' '+Date.now()+path.extname(file.originalname));

    }
  });
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

async function UploadFile(req,res){
    let upload=setStorage();
     upload(req,res,(err)=>{
         console.log(req["file"]);
        if(err){
            res.sendStatus(404).json({msg:'something went wrong'})
        }else{
          if(req.file==undefined){
              res.send({fileErr:'no file selected!'})
          }
          else{
            //store the db for user upload information
            async function Db(){
                let result=get();
                let dbFind=result.db(DB_NAME);
                let query={'username':req.body.username,'FileInfo':[]}
                let params ={};
                params['$push']={'FileInfo':{'$each':[req['file']]}}
                await dbFind.collection(DB_COLLECTION_UPLOAD_FILES).updateMany(query,params,{upsert:true});

            }
           Db().then(()=>res.status(200).json({"upload":"file upload successfully!"}))
          }
  
        }
    })

}

router.post('/upload',async function(req,res){
    //create unique bucket
    await UploadFile(req,res);
})


//get all uploads file info
router.get('/uploadsinfo',async function(req,res){
    let result=get();
    let dbFind=result.db(DB_NAME);
    let getAllRes = await dbFind.collection(DB_COLLECTION_UPLOAD_FILES).find({}).toArray();
    res.status(200).json({info:getAllRes});
})


module.exports=router;