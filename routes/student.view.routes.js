import { Router } from 'express';
import { viewStudents, viewNewStudent, viewEditStudent, viewCreateStudent, viewUpdateStudent, viewDeleteStudent } from '../controllers/student.controller.js';

const router = Router();

router.get('/',            viewStudents);
router.get('/new',         viewNewStudent);
router.get('/:id/edit',    viewEditStudent);
router.post('/',           viewCreateStudent);
router.post('/:id/update', viewUpdateStudent);
router.post('/:id/delete', viewDeleteStudent);

export default router;