const request=require('supertest');
const express=require('express');
const app=require('../index') //app

describe('Api testing',()=>{
    let user={"fullname":"kannan","username":"kns672","email":"knna@test.com","password":"mypossword123"}
    let RegisterMessage={'msg':'successfully signup '};
    let alredyRegistered ={msg:"username already exists"}
    it("post message for signup ",(done)=>{
        request=request('http://localhost:7000');
        request(app)
        .post('/signup')
        .send(user)
        .set('Accept','application/json')
        .expect('Content-Type',/json/)
        .expect(200)
        .end((err,res)=>{
           //expect(res.body).toEqual(RegisterMessage)
           if(err) return done(err);
           return done();
        })

    })

})


describe("GET/alluser",function(){
    it("it response the alluser in present the db",function(done){
        request=request('http://localhost:7000')
        request(app)
        .get('/alluser')
        .set('Accept','application/json')
        .expect('Content-Type',/json/)
        .expect(200,done)
    })


})
