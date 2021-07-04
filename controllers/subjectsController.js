'use strict';

const path = require('path');
const multer = require('multer');

const firebase = require('../db');
const firestore = firebase.firestore();

const Subject = require('../models/subject');
const uploadPath = path.join('public', Subject.converImageBasePath);
const Teacher = require('../models/teacher');

const imageMimeTypes = ['image/jepg', 'image/png'];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
   }
});


// router.get('/new', subjectRoute);
const subjectRoute = async (req, res) => {
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
};



/**
 * 
 * @function addSubject router.post('/', addSubject);
 * 
 */
const addSubject =  async (req, res) => {
    upload.single('subImg')
    const fileName = req.file != null ? req.file.fileName : null;
    const id = req.body.subTeacher;
    try {
        const teacher = firestore.collection('Teachers').doc(id);
        const getRef = await teacher.get();
        const addSub = firestore.collection('Subjects').doc();
        //console.log(id);
        await addSub.set({
            subjectName: req.body.subName,
            subjectSchedule: req.body.subSched,
            subjectTeacher: getRef.data().lastName + ',' + getRef.data().firstName,
            subImageName: fileName,
            teacherReference: teacher
        });
        console.log('Added subject with ID:',addSub.id);
        res.redirect('subjects');
    } catch (error) {
        console.error(error.message);
    }
};


/**
 * 
 * @function getAllSubjects used for getting all the records of students
 * 
 */
// router.get('/', getAllSubjects);
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await firestore.collection('Subjects');
        const data = await subjects.get();
        const subjectsArray = [];

        if(data.empty) {
            res.redirect('subjects/new');
        } else {
            data.forEach(doc => {
                const subjects = new Subject(
                    doc.id,
                    doc.data().subjectName,
                    doc.data().subjectSchedule,
                    doc.data().subjectTeacher,
                    doc.data().subImageName,
                    doc.data().teacherReference
                );
                subjectsArray.push(subjects);
            });
            res.render('subjects/index', {getSubject: subjectsArray});
        }
    } catch (error) {
        console.error(error.message);
        res.redirect('/');
    }
}


module.exports = {
    addSubject,
    getAllSubjects,
    subjectRoute
}