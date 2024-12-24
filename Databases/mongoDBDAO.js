//import the client
const MongoClient = require("mongodb").MongoClient;
//connect to the mongo server and access the database
MongoClient.connect("mongodb://127.0.0.1:27017")
  .then((client) => {
    db = client.db("proj2024MongoDB");
    coll = db.collection("lecturers");
  })
  .catch((error) => {
    console.log(error.message);
  });

//get all lecturers
var getAllLecturers = function () {
  return new Promise((resolve, reject) => {
    var cursor = coll.find();
    cursor
      .toArray()
      .then((documents) => {
        resolve(documents);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = {
  getAllLecturers
}