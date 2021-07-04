const path = require('path');

const coverImageBasePath = 'uploads/subjectCovers';

class Subject {
    constructor(id, subjectName, subjectSchedule, subjectTeacher, imageName, teacherReference, createdAt) {
        this.id = id;
        this.subjectName = subjectName;
        this.subjectSchedule = subjectSchedule;
        this.subjectTeacher = subjectTeacher;
        this.imageName = imageName;
        this.teacherReference = teacherReference;
        this.createdAt = createdAt;
    }    
}
// Subject('coverImagePath').get(function() {
//     if (this.imageName != null) {
//         return path.join('/', coverImageBasePath, this.coverImagePath)
//     }
// })


module.exports = Subject;
module.exports.coverImageBasePath = coverImageBasePath;