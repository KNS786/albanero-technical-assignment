const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_POST,DB_COLLECTION_FOLLOWER}=require('../config');

//db
const {get}=require('../db.connection');

async function PostMyFollower(createMyPost,currentFollower,params){            
    let result;
    return result=await createMyPost.collection(DB_COLLECTION_POST).updateMany(currentFollower,params,{upsert:true});
 }


async function PostUniqueFollower(createMyPost,MyFollowerList,LoginUserName,message){
    let result=Promise.all(MyFollowerList.map(async(value)=>{
        query={"postuser":value,'post':[]}
        params={};
       params["$set"]={'postedBy':LoginUserName}
       params['$push']={'post':{'$each':[message]}}
        await PostMyFollower(createMyPost,query,params);

    }))
  return result;   
}



router.post('/addpost',async (req,res)=>{
     let {username,message}=req.body;
     let results=get();
     let Follower=results.db(DB_NAME);
     let query ={'username':username,'mypost':[]}
     let params={}
     params['$push']={'mypost':{'$each':[message]}}
     let UpdateUser=await Follower.collection(DB_COLLECTION_POST).updateMany(query,params,{upsert:true});
     let getAllFollower=await Follower.collection(DB_COLLECTION_FOLLOWER).find({'username':username}).toArray();
     let MyFollowerList=await GetFollowerList(getAllFollower);
    // MyFollowerList.push(username);
     await PostUniqueFollower(Follower,MyFollowerList,username,message);

     return res.status(200).json({'msg':'Your post created !'})

})

async function GetFollowerList(Followers){
    //get last index values all value are updated 
    let len=Followers.length;
    let obj={},res=[]
    let newArray=await Promise.all(Followers.map(async(value)=>{
          let follower=value.follower[0]["myFollower"];
          follower.forEach((names)=>{
             if(!obj[names]){ 
                 obj[names]=1;
                 res.push(names);
            }

          })


    }));
   return res;

}

//testing collection db
router.get('/getpostdb',async function(req,res){
    let results=get();
    let createMypost=results.db(DB_NAME);
    let getAllUserpost= await createMypost.collection(DB_COLLECTION_POST).find({}).toArray();
   return res.status(200).json({msg:getAllUserpost})
       

})

module.exports=router;