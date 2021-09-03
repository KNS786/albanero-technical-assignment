const express=require("express");
const router=express.Router();
const {DB_NAME,DB_COLLECTION_USER}=require('../config')
const {get}=require('../db.connection');

router.post('/login',async function(req,res){
    let body= req.body;
    let result=get();
    let dbFind=result.db(DB_NAME);
    let user=await dbFind.collection(DB_COLLECTION_USER).find({'username':body.username,'password':body.password}).toArray();
    if(user.length > 0){
        return res.status(200).json({msg:'successfully login'})
    }
    else{
        return res.status(400).json({msg:'please signup'})
    }

})

module.exports=router;