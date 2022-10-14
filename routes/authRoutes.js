const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

//User
router.get('/signup', authController.signup_get);
router.get('/login', authController.login_get);
router.get('/logout', authController.logout_get);

//students
router.post('/student/signup', authController.student_signup_post);
router.post('/student/login', authController.student_login_post);

//teachers
router.post('/teacher/signup', authController.teacher_signup_post);
router.post('/teacher/login', authController.teacher_login_post);

module.exports = router;