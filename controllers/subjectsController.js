'use strict';

const admin = require('../db');
// const adminFirestore = admin.firestore();
// const fireStorageRef = admin.storage().ref();

const firebase = require('../db');
const firestore = firebase.firestore();

const Subject = require('../models/subject');
const Teacher = require('../models/teacher');

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG'];

const date = require('date-and-time');

//LINK: New Sub Route
const subjectRoute =  async (req, res) => {
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


//LINK: Add Subjects
const addSubject = async (req, res) => {
    const selectedTeacher_id = req.body.subTeacher;
    const imgEncoded = req.body.subImg;
    const now = new Date();

        if (imgEncoded == null) return
        const cover = JSON.parse(imgEncoded);

        if (cover != null && imageMimeTypes.includes(cover.type)) {
            const convertedImg = cover.data;
            const convertedImgType = cover.type;

            try {

                const teacher = firestore.collection('Teachers').doc(selectedTeacher_id);
                const getRef = await teacher.get();
                const addSub = firestore.collection('Subjects').doc();
        
                await addSub.set({
                    subjectName: req.body.subName,
                    subjectSchedule: req.body.subSched,
                    subjectTeacher: getRef.data().lastName + ', ' + getRef.data().firstName,
                    subCoverImg: convertedImg,
                    imgType: convertedImgType,
                    teacherReference: teacher,
                    createdAt: date.format(now, 'YYYY/MM/DD HH:mm:ss')
                });

                console.log('Added subject with ID:',addSub.id);
                res.redirect('/');
                
            } catch (error) {
                console.log(error);
            }
        }
};


//LINK: Subjects
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await firestore.collection('Subjects').orderBy('subjectName', 'asc');
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
                    doc.data().subCoverImg,
                    doc.data().imgType,
                    doc.data().teacherReference,
                    doc.data().createdAt
                );
                //console.log(counter++,subjects);
                subjectsArray.push(subjects);
            });
            res.render('subjects/index', {getSubject: subjectsArray});
        }
    } catch (error) {
        console.error(error.message);
        res.redirect('/');
    }
};

module.exports = {
    addSubject,
    getAllSubjects,
    subjectRoute
}