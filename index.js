var express=require('express');
var app=express();
var dotenv=require('dotenv');
dotenv.config();
var PORT= process.env.PORT
var bodyParser=require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(express.json());

require('./db.connection')


app.use('/',require('./routes/signup'))
app.use('/',require('./routes/followers'));
app.use('/',require('./routes/following'))
app.use('/',require('./routes/action'));
app.use('/',require('./routes/alluser'))
app.use('/',require('./routes/createPost'));
app.use('/',require('./routes/feed'));

app.listen(PORT,function(){
    console.log("App running");
})