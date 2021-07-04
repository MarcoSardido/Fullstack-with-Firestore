const express = require('express');
const router = express.Router();

const firebase = require('../db');
const firestore = firebase.firestore();

const Subject = require('../models/subject');

router.get('/', async (req, res) => {
    try {
        const subjects = await firestore.collection('Subjects').orderBy('createdAt', 'desc').limit(10);
        const data = await subjects.get();
        const displaySubjects = [];

        if(data.empty) {
            res.redirect('subjects/new');
        } else {
            data.forEach(doc => {
                const subjects = new Subject(
                    doc.id,
                    doc.data().subjectName,
                    doc.data().subjectSchedule,
                    doc.data().subjectTeacher,
                    doc.data().subImageName
                );
                displaySubjects.push(subjects);
            });
            res.render('index', {displaySub: displaySubjects});
        }
    } catch (error) {
        console.error(error.message);
        res.redirect('/');
    }
})

module.exports = router;