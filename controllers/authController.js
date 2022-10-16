const { Student, Teacher }= require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  let errors = { username: '', password: '' };

  // incorrect username
  if (err.message === 'Incorrect username') {
    errors.username = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'Incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate username error
  if (err.code === 11000) {
    errors.username = 'That username is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('Student validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes('Teacher validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createUserToken = (id) => {
  return jwt.sign({ id }, 'sdev 255 final', {
    expiresIn: maxAge
  });
};
const createTeacherToken = (id) => {
    return jwt.sign({ id }, 'sdev 255 final teacher', {
      expiresIn: maxAge
    });
  };

// controller actions

//User
const signup_get = (req, res) => {
    res.render('signup');
  };
  
const login_get = (req, res) => {
    res.render('login', { title: 'Login Page' });
  };

  const logout_get = (req, res) => {
    res.cookie('user', '', { maxAge: 1 });
    res.cookie('teacher', '', { maxAge: 1 });
    res.redirect('/');
  };

//student
const student_signup_post = async (req, res) => {
  const { fName, lName, username, password } = req.body;

  try {
    const student = await Student.create({ lName, fName, username, password });
    const token = createUserToken(student._id);
    res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ student: student._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
};

const student_login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const student = await Student.login(username, password);
    const token = createUserToken(student._id);
    res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ student: student._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }


};

//teacher
  const teacher_signup_post = async (req, res) => {
    const { fName, lName, username, password, department } = req.body;
  
    try {
      const teacher = await Teacher.create({ fName, lName, username, password, department  });
      const tToken = createTeacherToken(teacher._id);
      res.cookie('teacher', tToken, { httpOnly: true, maxAge: maxAge * 1000 });
      const token = createUserToken(teacher._id);
      res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ teacher: teacher._id });
    
    }
    catch(err) {
      console.log(err);
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  };
  
  const teacher_login_post = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const teacher = await Teacher.login(username, password);
      const token = createUserToken(teacher._id);
      res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
      const tToken = createTeacherToken(teacher._id);
      res.cookie('teacher', tToken, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ teacher: teacher._id });
    
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  
  };
  

//exports
module.exports = { 
  signup_get,
  login_get,
  logout_get,
  student_signup_post,
  student_login_post,
  teacher_signup_post,
  teacher_login_post,
};
