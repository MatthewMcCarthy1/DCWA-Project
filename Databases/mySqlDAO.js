var mysql = require("promise-mysql");

var pool;

/*trying to get my student data to load and found this fix for the error i was getting

Error number: 1251; Symbol: ER_NOT_SUPPORTED_AUTH_MODE; SQLSTATE: 08004
Message: Client does not support authentication protocol requested by server; consider upgrading MySQL client

Fix i found: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';

*/

//connection pool
mysql
  .createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "proj2024Mysql",
  })
  .then((p) => {
    pool = p;
  })
  .catch((e) => {
    console.log("pool error:" + e);
  });

//get all the students in alphabetical order (by ID)
var getStudents = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student ORDER BY sid ASC")
      .then((students) => {
        console.log(students);
        resolve(students);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

// Get a student by ID
var getStudentById = function (sid) {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student WHERE sid = ?", [sid])
      .then((students) => {
        console.log(students);
        resolve(students);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

//Update a student
var updateStudent = function (sid, name, age) {
    return new Promise((resolve, reject) => {
      pool
        .query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, sid])
        .then((students) => {
          console.log(students);
          resolve(students);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

// Add a new student
var addStudent = function (sid, name, age) {
  return new Promise((resolve, reject) => {
    pool
      .query("INSERT INTO student (sid, name, age) VALUES (?, ?, ?)", [
        sid,
        name,
        age,
      ])
      .then((students) => {
        console.log(students);
        resolve(students);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

module.exports = { getStudents, getStudentById, addStudent , updateStudent};
