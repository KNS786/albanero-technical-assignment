//who is following me
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("albanero");
  dbo.createCollection("follower", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}); 