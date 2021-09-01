const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const PORT= process.env.PORT
const bodyParser=require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(express.json());


//db connection
require('./db.connection')


app.use('/',require('./routes/signup'))
app.use('/',require('./routes/followers'));
app.use('/',require('./routes/following'))
app.use('/',require('./routes/action'));
app.use('/',require('./routes/alluser'))
app.use('/',require('./routes/createPost'));
app.use('/',require('./routes/feed'));

app.listen(PORT,()=>{
    console.log("App Running");
    
})


