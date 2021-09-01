const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_POST,DB_COLLECTION_FOLLOWER}=require('../config');

//db
const {get}=require('../db.connection');

async function PostMyFollower(createMyPost,currentFollower,params){            
    var result;
    return result=await createMyPost.collection(DB_COLLECTION_POST).updateMany(currentFollower,params,{upsert:true});
 }


async function PostUniqueFollower(createMyPost,MyFollowerList,LoginUserName,message){
    var result=Promise.all(MyFollowerList.map(async(value)=>{
        query={"postuser":value,'post':[]}
        params={};
       params["$set"]={'postedBy':LoginUserName}
       params['$push']={'post':{'$each':[message]}}
        await PostMyFollower(createMyPost,query,params);

    }))
  return result;   
}



router.post('/addpost',async (req,res)=>{
     var {username,message}=req.body;
     var results=get();
     var Follower=results.db(DB_NAME);
     var query ={'username':username,'mypost':[]}
     var params={}
     params['$push']={'mypost':{'$each':[message]}}
     var UpdateUser=await Follower.collection(DB_COLLECTION_POST).updateMany(query,params,{upsert:true});
     var getAllFollower=await Follower.collection(DB_COLLECTION_FOLLOWER).find({'username':username}).toArray();
     var MyFollowerList=await GetFollowerList(getAllFollower);
    // MyFollowerList.push(username);
     await PostUniqueFollower(Follower,MyFollowerList,username,message);

     return res.status(200).json({'msg':'Your post created !'})

})

async function GetFollowerList(Followers){
    //get last index values all value are updated 
    var len=Followers.length;
    var obj={},res=[]
    var newArray=await Promise.all(Followers.map(async(value)=>{
          var follower=value.follower[0]["myFollower"];
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
    var results=get();
    var createMypost=results.db(DB_NAME);
    var getAllUserpost= await createMypost.collection(DB_COLLECTION_POST).find({}).toArray();
   return res.status(200).json({msg:getAllUserpost})
       

})

module.exports=router;