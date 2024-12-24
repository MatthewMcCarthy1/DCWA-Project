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

//STUDENTS

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
      .query("UPDATE student SET name = ?, age = ? WHERE sid = ?", [
        name,
        age,
        sid,
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

//GRADES
var getGrades = function () {
  return new Promise((resolve, reject) => {
    pool
      .query(
        "Select s.name AS student_name, m.name AS module_name, g.grade FROM student s LEFT JOIN grade g ON s.sid = g.sid LEFT JOIN module m on g.mid = m.mid ORDER BY s.name ASC, g.grade ASC"
      )
      .then((grades) => {
        console.log(grades);
        resolve(grades);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

//LECTURERS
//check if a lecurer teaches a module
var lecturerTeachesModules = function(lid) {
  return new Promise((resolve, reject) => {
    pool 
    .query("SELECT * from module WHERE lecturer = ?", [lid])
    .then((result) => {
      console.log(result);
      resolve(result);
    })
    .catch((error) => {
      console.log(error);
      reject(error);
    });
  })
}

//delete a lecturer 

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  getGrades,
  lecturerTeachesModules
};
