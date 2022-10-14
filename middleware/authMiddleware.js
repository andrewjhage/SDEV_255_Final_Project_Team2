const jwt = require('jsonwebtoken');
const { Student, Teacher } = require('../models/User');

//require user to be logged in
const requireAuth = (req, res, next) => {
  const token = req.cookies.user;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'sdev 255 final', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

//require teacher to be logged iin
const requireTeacherAuth = (req, res, next) => {
    const token = req.cookies.teacher;
  
    // check json web token exists & is verified
    if (token) {
      jwt.verify(token, 'sdev 255 final teacher', (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/courses');
        } else {
          next();
        }
      });
    } else {
      res.redirect('/courses');
    }
  };

const checkUser = (req, res, next) => {
    const student = req.cookies.user;
    const teacher = req.cookies.teacher;
    res.locals.student = null;
    res.locals.teacher = null;
    if (teacher) {
        jwt.verify(teacher, 'sdev 255 final teacher', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                alert('Need Teacher Authorization to complete action');
                res.locals.teacher = null;
                next();
            }else {
                let teacher = await Teacher.findById(decodedToken.id);
                res.locals.teacher = teacher;
                next();
            }
        });
    }
    else if (student) {
      jwt.verify(student, 'sdev 255 final', async (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            res.locals.student = null;
            next();
        }else {
            let student = await Student.findById(decodedToken.id);
            res.locals.student = student;
            next();
        }

      });
    }
    else {
        res.locals.student = null;
        res.locals.teacher = null;
        next();
    }
};


module.exports = { requireAuth, requireTeacherAuth, checkUser};