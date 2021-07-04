'use strict';

const firebase = require('../db');
const firestore = firebase.firestore();
const Teacher = require('../models/teacher');

const getCurrentDate = (new Date()).toString().split(' ').splice(1,3).join(' ');


/**
 * 
 * @function addStudent used for adding new student to firebase firestore
 * 
 */
const addStudent = async (req, res) => {
    
    try {
        // const student = new Student(
        //     req.body.fName,
        //     req.body.lName,
        //     req.body.age,
        //     getCurrentDate
        // );
        // const data = req.body;
        // const res = await firestore.collection('Students').doc().set(data);
        // const res = await firestore.collection('Students').doc().set(Object.assign,({},student));
        const techer = firestore.collection('Teachers').doc();
        await techer.set({
            firstName: req.body.fname,
            lastName: req.body.lname,
            age: req.body.age,
            date: getCurrentDate
        });
        console.log('Added teacher with ID:',techer.id);
        res.redirect('teachers');
    } catch (error) {
        // res.sendstatus(400)
        console.error(error.message);
    }
}


/**
 * 
 * @function getAllStudents used for getting all the records of students
 * 
 */
const getAllStudents = async (req, res) => {
    // const searchArray = {};
    // if(req.query.name != null && req.query.name !== '') {
    //     searchArray.name = new RegExp(req.query.name, 'i');
    // }
    try {
        const teacher = await firestore.collection('Teachers');
        const data = await teacher.get();
        const teachersArray = [];

        if(data.empty) {
            res.render('teachers/new', {errorMessage: 'No Teacher Record Found'});
        } else {
            data.forEach(doc => {
                const teacher = new Teacher (
                    doc.id,
                    doc.data().firstName,
                    doc.data().lastName,
                    doc.data().age,
                    doc.data().date
                );
                teachersArray.push(teacher);
            });
                                            //, searchArray: req.query { IN INDEX.EJS (value="<%=searchArray.name%>")}
            res.render('teachers/index', {getTeachers: teachersArray});
            // console.table(studentsArray);
        }
    } catch (error) {
        console.error(error.message);
        res.redirect('/');
    }
}


/**
 * 
 * @function getStudent used for finding specific student
 * 
 */
const getStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const student = await firestore.collection('Students').doc(id);
        const data = await student.get();

        if(!data.exists()) {
            res.sendstatus(404).send('No Student With The Given ID');
        } else {
            res.send(data.data());
        }
    } catch {
        res.sendstatus(400);
    }
}


/**
 * 
 * @function updateStudent used for updating selected student
 * 
 */
const updateStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student =  await firestore.collection('Students').doc(id);
        await student.update(data);
        res.send('Student Record Updated Successfully');
    } catch {
        res.sendstatus(400);
    }
}


/**
 * 
 * @function deleteStudent used for deleting selected student
 * 
 */
const deleteStudent = async (req, res) => {
    try {
        const id = req.params.id;
        await firestore.collection('Students').data(id).delete();
        res.send('Record Deleted Successfully');
    } catch {
        res.sendstatus(400);
    }
}

module.exports = {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
}