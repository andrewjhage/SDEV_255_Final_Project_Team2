const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({ 
    courseName: {
        type: String,
        required: true
    },
    courseNumber: {
        type: String,
        required: true
    },
    courseDescript: {
        type: String,
        required: true
    },
    subjectArea: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;