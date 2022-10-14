const { Router } = require('express');
const coursesController = require('../controllers/coursesController');
const { requireTeacherAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/create', requireTeacherAuth, coursesController.courses_create_get);
router.get('/', coursesController.courses_list);
router.post('/create', coursesController.courses_create_post);
router.post('/:id', coursesController.courses_update_post);
router.get('/:id', coursesController.courses_details);
router.delete('/:id', requireTeacherAuth, coursesController.courses_delete);
router.delete('/', coursesController.delete_redirect);

module.exports = router;