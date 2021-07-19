const express = require('express');
const router = express.Router();


const {
    addSubject,
    getAllSubjects,
    subjectRoute} = require('../controllers/subjectsController');

// Getting all Subjects 
router.get('/', getAllSubjects);

// New Subject Route
router.get('/new', subjectRoute);

// Create Subject
router.post('/', addSubject);

module.exports = {
    routes: router
}