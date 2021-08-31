var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var MONGODB_URI=process.env.MONGODB_URI;
var DB_NAME=process.env.DB_NAME
var client=new MangoDbClient(MONGODB_URI)

//collections
var DB_COLLECTION_POST=process.env.DB_COLLECTION_POST;
var DB_COLLECTION_FOLLOWER=process.env.DB_COLLECTION_FOLLOWER;

async function PostMyFollower(createMyPost,currentFollower,params){            
    var result;
    return result=await createMyPost.collection(DB_COLLECTION_POST).updateMany(currentFollower,params,{upsert:true});
 }


async function PostUniqueFollower(createMyPost,MyFollowerList,LoginUserName,message){
    //console.log(MyFollowerList);
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
     await client.connect();
     var Follower=client.db(DB_NAME);
     var query ={'username':username,'mypost':[]}
     var params={}
     params['$push']={'mypost':{'$each':[message]}}
     var UpdateUser=await Follower.collection(DB_COLLECTION_POST).updateMany(query,params,{upsert:true});
     var getAllFollower=await Follower.collection(DB_COLLECTION_FOLLOWER).find({'username':username}).toArray();
     var MyFollowerList=await GetFollowerList(getAllFollower);
    // MyFollowerList.push(username);
     console.log("VBDFDFFD"+MyFollowerList);
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
    await client.connect();
    var createMypost=client.db(DB_NAME);
    var getAllUserpost= await createMypost.collection(DB_COLLECTION_POST).find({}).toArray();
   return res.status(200).json({msg:getAllUserpost})
       

})

module.exports=router;