const Course = require('../models/Course');

//Course list
const courses_list = (req, res) => {
    Course.find().sort({ createdAt: -1})
     .then((result) => {
         res.render('courses/course', { title: 'All Courses', courses: result});
     })
     .catch((err) => {
         console.log(err);
     });

};

//Individual course details
const courses_details = (req, res) => {
    const id = req.params.id;
     Course.findById(id)
     .then((result) => {
         res.render('courses/details', {course: result, title: 'Course Page'});
     })
     .catch((err) => {
         console.log(err);
         res.redirect('/404');
     });
};

//TEACHER ONLY create a new course page
const courses_create_get = (req, res) => {
    res.render('courses/create', { title: "Create a New Course"});
};

//TEACHER ONLY post to create new course
const courses_create_post = (req, res) => {
    const course = new Course(req.body);
     course.save()
     .then((result) => {
         res.redirect('/courses')
    })
     .catch((err) => {
         console.log(err);
     }); 
};

const courses_update_post = (req, res) => {
    //update the course 
    const id = req.params.id;
    Course.findByIdAndUpdate(id, req.body, { new: true})
    .then((result) => {
        res.redirect(id);
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/404');
    });

};

//TEACHER ONLY delete a course
const courses_delete = (req, res) => {
    const id = req.params.id;

     Course.findByIdAndDelete(id)
     .then((result) => {
         res.json({ redirect: '/courses' });
     })
     .catch((err) => {
         console.log(err);
     });

};

const delete_redirect = (re, res) => {
    res.json({ redirect: '/courses' });
}

//exports
module.exports = { 
    courses_list,
    courses_details,
    courses_create_get,
    courses_create_post,
    courses_delete,
    courses_update_post,
    delete_redirect
};

//Alter (temp to save code)
// app.post('/account', (req, res) => {
//     const course = new Course(req.body);
  
//     course.save()
//     .then((result) => {
//         res.redirect('/courses')
  
//     })
//     .catch((err) => {
//         console.log(err);
//     });
  
//   });