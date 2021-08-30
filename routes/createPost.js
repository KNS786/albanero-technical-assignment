var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)


async function PostMyFollower(createMyPost,currentFollower,params){            
    var result;
    return result=await createMyPost.collection('createpost').updateMany(currentFollower,params,{upsert:true});
 }


async function PostUniqueFollower(createMyPost,MyFollowerList,LoginUserName,message){
    console.log(MyFollowerList);
    var result=Promise.all(MyFollowerList.map(async(value)=>{
        query={"username":value,'mypost':[]}
        params={};
       // params["$set"]={"post":message,'postedBy':LoginUserName}
       params['$push']={'mypost':{'$each':[message]}}
        await PostMyFollower(createMyPost,query,params);

    }))
  return result;   
}



router.post('/addpost',async (req,res)=>{
     var {username,message}=req.body;
     await client.connect();
     var Follower=client.db('albanero');
     var query ={'username':username,'mypost':[]}
     var params={}
     params['$push']={'mypost':{'$each':[message]}}
     var UpdateUser=await Follower.collection('createpost').updateMany(query,params);
     var getAllFollower=await Follower.collection('follower').find({'username':username}).toArray();
     var MyFollowerList=await GetFollowerList(getAllFollower);
     MyFollowerList.push(username);
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
   
    console.log(newArray);
    console.log("Object "+res);

   return res;

}

//testing collection db
router.get('/getpostdb',async function(req,res){
    await client.connect();
    var createMypost=client.db('albanero');
    
    var getAllUserpost= await createMypost.collection('createpost').find({}).toArray();
  //  await FollowerList(getAllUserpost);
   return res.status(200).json({msg:getAllUserpost})
       

})

module.exports=router;