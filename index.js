var express=require('express');
var app=express();
var PORT=7000 || process.env.PORT
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/albanero";
var bodyParser=require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(require('./middleware/logger'));
//connection mongodb
require('./db.connection')


app.use('/',require('./routes/signup'))
app.use('/',require('./routes/followers'));
app.use('/',require('./routes/following'))
app.use('/',require('./routes/action'));
app.use('/',require('./routes/alluser'))
app.use('/',require('./routes/createPost'));
app.use('/',require('./routes/feed'));



app.get('/',function(req,res){
    res.send("App running test ");
})

app.listen(PORT,function(){
    console.log("App running");
})