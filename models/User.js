const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema'); 
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({ 
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
}, {timestamps: true});

const studentSchema = extendSchema(userSchema, {
    classes: {
        type: Array,
        required: false
    }
});

const teacherSchema = extendSchema(userSchema, {
    department: {
        type: String,
        required: true
    }
});

studentSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

teacherSchema.pre('save', async function(next) {
    //test to ensure it's just teachers creating these accounts? 
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

studentSchema.statics.login = async function(username, password) {
    const student = await this.findOne({ username });
    if (student) {
      const auth = await bcrypt.compare(password, student.password);
      if (auth) {
        return student;
      }
      throw Error('Incorrect password');
    }
    throw Error('Incorrect username');
};

teacherSchema.statics.login = async function(username, password) {
    const teacher = await this.findOne({ username });
    if (teacher) {
      const auth = await bcrypt.compare(password, teacher.password);
      if (auth) {
        return teacher;
      }
      throw Error('Incorrect password');
    }
    throw Error('Incorrect username');
};

const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = { Student, Teacher };
