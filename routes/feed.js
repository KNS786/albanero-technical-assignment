var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";

async function FollowingPostMessageGet(db,following,username){
     db.collection('createpost').find({'username':following}).toArray(function(error,result){
        if(error) throw error;
        if(result.length > 0){
            //following found already found the user
            console.log(result);
            //store db
        async function GetDbFolloweing(){
            var myObj={};
            var myRes=Promise.all(result.map(async (value)=>{
                 myObj.username=value.username;
                 myObj.post=value.mypost;
                 var query={'username':username,'Feed':[]}
                 var params={}
                 params['$push']={'Feed':{'$each':[myObj]}}
                db.collection('feeds').updateMany(query,params,{'upsert':true},function(errors,result){
                     if(errors) throw errors;
                     return true;
                })


            })) 
        }

         GetDbFolloweing();

        }
      

     })
}



///following username with respect body
router.get('/feed',function(req,res){
    var username=req.body.username;
    if(username) {
        MangoDbClient.connect(url,function(error,result){
             var myFollower=result.db('albanero');
             var IamFollowing={}
             myFollower.collection('feeds').find({'username':username}).toArray(function(error,result){
                 if(error) throw error;
                 if(result.length==0){
                     myFollower.collection('createpost').find({'username':username}).toArray(function(error,result){
                        if(error) throw error;
                        console.log("Result"+result);

                        var obj={
                            'username':req.body.username,
                            'post':[result.mypost]
                        }
                        myFollower.collection('feeds').insertMany(obj,function(errors,result){
                           if(errors) throw errors;
                           
                           return true;
                        })


                     })
                   
                 }

             })
             myFollower.collection('following').find({'username':req.body.username}).toArray(function(errors,result){
                   if(errors) throw errors;
                   var FollowingPresent=result,Following;
                   FollowingPresent.forEach((value)=>{
                       Following=value["following"];
                       /*if(!IamFollowing[Following]) Length to follow */ IamFollowing[Following]=1;
                    })
                  
              var allFollowingList=Object.keys(IamFollowing).map(String);
              allFollowingList.push(req.body.username);
              async function Data(){
                   var myAllRes=Promise.all(allFollowingList.map(async(value)=>{
                       //  console.log("My values"+value);//working correct 
                         await FollowingPostMessageGet(myFollower,value,req.body.username);
                   }));

              }
              Data();              

             })
             myFollower.collection('feeds').find({'username':username}).toArray(function(error,result){
                 if(error) throw error;
                 var Feed=[];
                 Feed.push(result)
                 myFollower.collection('createpost').find({'username':username}).toArray(function(error,result){
                     if(error) throw error;
                     Feed.push(result);
                     res.status(200).json({res:Feed})
                 })
                 
             })    
        
        }) 


    }
    
})




module.exports=router ;