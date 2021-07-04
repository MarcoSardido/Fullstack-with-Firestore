'use strict';

const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const firebase = require('../db');
const firestore = firebase.firestore();
const date = require('date-and-time');

const Subject = require('../models/subject');
const uploadPath = path.join('public', Subject.coverImageBasePath);

const Teacher = require('../models/teacher');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});


const upload = multer({storage: storage});




// const imageMimeTypes = ['image/jepg', 'image/jpg', 'image/png', 'image/PNG'];
// const upload = multer({
//     destination: function(req, file, callback) {
//         callback(null, uploadPath);
//     },
//     filename: (req, file, callback) => {
//         callback(null, new Date().toISOString + file.originalname);
//    }
// });


// const {
//     addSubject,
//     getAllSubjects,
//     subjectRoute} = require('../controllers/subjectsController');

//LINK: New Sub Route
router.get('/new', async (req, res) => {
    try {
        //Checking if Teachers Database != 0
        const getTeachers = await firestore.collection('Teachers').get();
        const techersArray = [];
        if(getTeachers.empty) {
            res.render('teachers/new', {errorMessage: 'No Teacher Record Found'});
        } else {
            getTeachers.forEach(doc => {
                const teacher = new Teacher (
                    doc.id,
                    doc.data().firstName,
                    doc.data().lastName
                );
                techersArray.push(teacher);
            });

            //Checking if Subjects Database != 0
            await firestore.collection('Subjects').get().then(snap => {
                const size = snap.size;
                if (size != 0) {
                    res.render('subjects/new', {
                        errorMessage: `${size} subject found`,
                        getTeachers: techersArray
                    });
                } else {
                    res.render('subjects/new', {
                        errorMessage: 'No Subjects Found',
                        getTeachers: techersArray
                    });
                };
            });
        };
    } catch (error) {
        console.error(error.message);
    };
});

//LINK: Add Subjects
router.post('/', upload.single('subImg'), async (req, res) => {
    const fileName = req.file != null ? req.file.path : null;
    const id = req.body.subTeacher;
    const now = new Date();
    console.log('REQ FILE: ', req.file);
    try {
        const teacher = firestore.collection('Teachers').doc(id);
        const getRef = await teacher.get();
        const addSub = firestore.collection('Subjects').doc();

        await addSub.set({
            subjectName: req.body.subName,
            subjectSchedule: req.body.subSched,
            subjectTeacher: getRef.data().lastName + ', ' + getRef.data().firstName,
            subImageName: fileName,
            teacherReference: teacher,
            createdAt: date.format(now, 'YYYY/MM/DD HH:mm:ss')
        });
        console.log('Added subject with ID:',addSub.id);
        res.redirect('subjects');
    } catch (error) {
        console.log(error);
    }
});

//LINK: Subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await firestore.collection('Subjects');
        const data = await subjects.get();
        const subjectsArray = [];

        if(data.empty) {
            res.redirect('subjects/new');
        } else {
            let counter=1;
            data.forEach(doc => {
                const subjects = new Subject(
                    doc.id,
                    doc.data().subjectName,
                    doc.data().subjectSchedule,
                    doc.data().subjectTeacher,
                    doc.data().subImageName,
                    doc.data().teacherReference,
                    doc.data().createdAt
                );
                console.log(counter++,subjects);
                subjectsArray.push(subjects);
            });
            res.render('subjects/index', {getSubject: subjectsArray});
        }
    } catch (error) {
        console.error(error.message);
        res.redirect('/');
    }
});

module.exports = {
    routes: router
}