const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser} = require('./middleware/authMiddleware');
const { Student } = require('./models/User');


//express app
const app = express();

//connect to database

const dbURI = 'mongodb+srv://sdev255:password255@sdev255.1xd7ayx.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

//register view engine 
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

//Routes 
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index', { title: 'Home Page' }));
app.get('/account', requireAuth, (req, res) => {
  const student = req.cookies.user;
  const teacher = req.cookies.teacher;
  if (teacher) {
    res.render('account', { title: 'User Account', classList: [] });
  } else {
  jwt.verify(student, 'sdev 255 final', async (err, decodedToken) => {
    if (err) {
      console.log(err.message);
    }else {
      await Student.findById(decodedToken.id)
      .then((result) => {
        res.render('account', { title: 'User Account', classList: result.classes });
      });
    }

  });
}
});
app.post('/dropClass/:id', (req, res) => {
  const student = req.cookies.user;
  const id = req.params.id;
  jwt.verify(student, 'sdev 255 final', async (err, decodedToken) => {
    if (err) {
        console.log(err.message);
    }else {
        await Student.findByIdAndUpdate(decodedToken.id, { $pull: {
          classes: id
        }
      })
      .then((result) => {
        res.redirect('/account');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/404');
    });
    }
  });

});
app.get('/register', requireAuth, (req, res) => res.render('register', { title: 'Registration' }));
app.post('/register', (req, res) => {
  const student = req.cookies.user;
  jwt.verify(student, 'sdev 255 final', async (err, decodedToken) => {
    if (err) {
        console.log(err.message);
    }else {
        await Student.findByIdAndUpdate(decodedToken.id, { $push: {
          classes: req.body.courseNumber
        }
      })
      .then((result) => {
        res.redirect('/account');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/404');
    });
    }
  });

});
app.use(authRoutes);
app.use('/courses', coursesRoutes);

//LAST
app.use((req, res) => {
  res.status(404).render('404', { title: "404"});

});

const courses_list = (req, res) => {
  Course.find().sort({ createdAt: -1})
   .then((result) => {
       res.render('courses/course', { title: 'All Courses', courses: result});
   })
   .catch((err) => {
       console.log(err);
   });

};
