const express = require('express');
const router = express.Router();

const {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent} = require('../controllers/teacherController');

// Getting all Students 
router.get('/', getAllStudents);

// New Students Route
router.get('/new', (req, res) => {
    res.render('teachers/new');
});

// Create Student
router.post('/', addStudent);


// Get One Student
router.get('/:id', getStudent);

// Update Student
router.put('/:id', updateStudent);

// Delete Student
router.delete('/: id', deleteStudent);

module.exports = {
    routes: router
}