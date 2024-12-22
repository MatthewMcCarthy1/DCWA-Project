//import express
var express = require('express');
var app = express();

//import ejs (embedded javascript)
let ejs = require('ejs');
app.set('view engine', 'ejs');

//HOME
app.get("/", (req, res) => {
    res.render("home")
})

//STUDENTS
app.get("/students", (req,res) => {
    res.render("students")
})

//GRADES
app.get("/grades", (req,res) => {
    res.render("grades")
})

//LECTURERS
app.get("/lecturers", (req,res) => {
    res.render("lecturers")
})

//start the server on port 3004
app.listen(3004, () => {
    console.log("Server is listening")
})