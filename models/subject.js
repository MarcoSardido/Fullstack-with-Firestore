class Subject {
    constructor(id, subjectName, subjectSchedule, subjectTeacher, subImage, imgType, teacherReference, createdAt) {
        this.id = id;
        this.subjectName = subjectName;
        this.subjectSchedule = subjectSchedule;
        this.subjectTeacher = subjectTeacher;
        this.subImage = subImage;
        this.imgType = imgType;
        this.teacherReference = teacherReference;
        this.createdAt = createdAt;
    }
}

module.exports = Subject;