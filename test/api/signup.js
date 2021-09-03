const  request=require('supertest');
const app=require('../../index');
const {get,close} = require('../../db.connection');

describe('POST /signup',()=>{
     before((done)=>{
          let result=get();
          let DB_NAME='albanero'
          let dbFind=result.db(DB_NAME);
          if(dbFind) done()
           
     })
     after((done )=>{
         //db close
         let dbclose=close()
         if(dbclose) done();
     })
      it('Ok,signup a new user ',(done)=>{
          request=request('http://localhost:7000')
         request(app).post('/signup')
        .send({'username':'kkkk89','fullname':'karthiks','email':'jkas@test.com','password':'mypassword123'})
        .then((res)=>{
            let response=res.body;
            expect(response).toEqual({'msg':'successfully signup '})
            done();
        })

      })

})