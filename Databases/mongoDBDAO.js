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

//delete a lecturer
var deleteLecturer = function(lid) {
  return new Promise((resolve, reject) => {
    coll.deleteOne({_id: lid})
    .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      reject(error);
    });
  })
}

//EXTRA FUNCTIONALITY
//update a lecturer
var updateLecturer = function (lid, name, did) {
  return new Promise((resolve, reject) => {
    coll.updateOne({ _id: lid }, { $set: { name: name, did: did } })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//get a lecturer by ID
var getLecturerById = function (lid) {
  return new Promise((resolve, reject) => {
    coll.findOne({ _id: lid })
      .then((lecturer) => {
        resolve(lecturer);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = {
  getAllLecturers,
  deleteLecturer,
  updateLecturer,
  getLecturerById
}