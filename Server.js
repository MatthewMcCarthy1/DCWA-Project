//import express
var express = require("express");
var app = express();

//import ejs (embedded javascript)
let ejs = require("ejs");
app.set("view engine", "ejs");

//import mysqldao
var mysqlDAO = require("./Databases/mySqlDAO");

//import body parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//import express-validator
const { check, validationResult } = require("express-validator");

//import MongoDB
var mongoDBDAO = require("./Databases/mongoDBDAO");

//HOME
app.get("/", (req, res) => {
  res.render("home");
});

//STUDENTS

//GET BY ID for editing a student
app.get("/students/edit/:sid", (req, res) => {
  const sid  = req.params.sid;
  mysqlDAO
    .getStudentById(sid)
    .then((students) => {
      if (students && students.length > 0) {
        res.render("editStudent", { student: students[0], errors: [] });
      } else {
        res.status(404).send("Student not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching student:", error);
      res.status(500).send("Internal Server Error");
    });
});

//POST BY ID to update a student
app.post(
  "/students/edit/:sid",
  [
    //validate user input
    check("name")
      .isLength({ min: 2 })
      .withMessage("Name should be a minimum of 2 characters"),
    check("age").isInt({ min: 18 }).withMessage("Age should be 18 or older"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const { sid } = req.params;
    const { name, age } = req.body;

    //show the errors
    if (!errors.isEmpty()) {
      return res.render("editStudent", {
        student: { sid, name, age },
        errors: errors.array(),
      });
    }

    //update the student in the database 
    mysqlDAO
      .updateStudent(sid, name, age)
      .then(() => {
        res.redirect("/students");
      })
      .catch((error) => {
        console.error("Error updating student:", error);
        res.status(500).send("Internal Server Error");
      });
  }
);

//GET ALL students
app.get("/students", (req, res) => {
  mysqlDAO
    .getStudents() //get the students
    .then((students) => {
      res.render("students", { students }); //render the student data
    })
    .catch((error) => {
      //catch any errors
      console.error("Error getting students:", error.message);
      res.status(500).send("Internal Server Error");
    });
});

//GET ADD A student page
app.get("/students/add", (req, res) => {
  res.render("addStudent", { student: {}, errors: [] });
});

//POST ADD a student
app.post(
  "/students/add",
  [
    //validate the user input
    check("sid")
      .isLength({ min: 4, max: 4 })
      .withMessage("Student ID must be 4 characters long"),
    check("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    check("age").isInt({ min: 18 }).withMessage("Age must be 18 or older"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    //show errors if any
    if (!errors.isEmpty()) {
      return res.render("addStudent", {
        student: req.body,
        errors: errors.array(),
      });
    }

    const { sid, name, age } = req.body;

    mysqlDAO
      .getStudentById(sid)
      .then((existingStudent) => {
        //if the student id already exists give the user an error
        if (existingStudent.length > 0) {
          return res.render("addStudent", {
            student: req.body,
            errors: [{ msg: "Student ID already exists" }],
          });
        }

        //add the student to the database
        return mysqlDAO.addStudent(sid, name, age);
      })
      .then(() => {
          res.redirect("/students");
      })
      .catch((error) => {
        console.error("Error adding student:", error.message);
        res.status(500).send("Internal Server Error");
      });
  }
);

//GRADES
app.get("/grades", (req, res) => {
    mysqlDAO.getGrades()
    .then((grades) => {
      res.render("grades", { grades });
    })
    .catch((error) => {
      console.error("Error fetching grades:", error.message);
      res.status(500).send("Internal Server Error");
    });
});

//LECTURERS 
//GET ALL lecturers and sort them by lecturer id in alphabetical order
app.get("/lecturers", (req, res) => {
  mongoDBDAO.getAllLecturers()
  .then((lecturers) => {
    //Sort lecturers by lecturer ID in alphabetical order
    lecturers.sort((a, b) => a._id.localeCompare(b._id));
    res.render("lecturers", { lecturers });
  })
  .catch((error) => {
    console.error("Error fetching lecturers:", error.message);
    res.status(500).send("Internal Server Error");
  });
});

//DELETE A lecturer based off their id
app.get("/lecturers/delete/:lid", (req, res) => {
  const lid = req.params.lid;

  mysqlDAO.lecturerTeachesModules(lid)
  .then((teachesModules) => {
    if(teachesModules) {
      //if the lecturer teaches modules, send an error
      return res.status(400).send(`<p><a href="/">Home</a></p>
        <h1>Error Message</h1>
        <h2>Cannot delete lecturer ${lid}. He/She has associated modules</h2>`);
    }
    else {
      //if not then delete the lecturer
      return mongoDBDAO.deleteLecturer(lid).then(() => {
        res.redirect("/lecturers")
      });
    }
  })
  .catch((error) => {
    console.error("Error deleting lecturer:", error.message);
    res.status(500).send("Internal Server Error");
  });
})

//EXTRA FUNCTIONALITY
//GET BY ID for editing a lecturer
app.get("/lecturers/edit/:lid", (req, res) => {
  const lid  = req.params.lid;
  mongoDBDAO
    .getLecturerById(lid)
    .then((lecturer) => {
      if (lecturer) {
        res.render("editLecturer", { lecturer: lecturer, errors: [] });
      } else {
        res.status(404).send("Lecturer not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching lecturer:", error);
      res.status(500).send("Internal Server Error");
    });
});

//POST BY ID to update a student
app.post(
  "/lecturers/edit/:lid",
  [
    //validate user input
    check("name")
      .isLength({ min: 2 })
      .withMessage("Name should be a minimum of 2 characters"),
    check("did")
      .isLength({ min: 3 })
      .withMessage("Department ID must be exactly 3 characters long and in uppercase (example: ENG for english)"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const { lid } = req.params;
    const { name, did } = req.body;

    //show the errors
    if (!errors.isEmpty()) {
      return res.render("editLecturer", {
        lecturer: { _id: lid, name, did },
        errors: errors.array(),
      });
    }

     //update the lecturer in the database
     mongoDBDAO.updateLecturer(lid, name, did)
     .then(() => {
       res.redirect("/lecturers");
     })
     .catch((error) => {
       console.error("Error updating lecturer:", error);
       res.status(500).send("Internal Server Error");
     });
  }
);

//start the server on port 3004
app.listen(3004, () => {
  console.log("Server is listening");
});
