import Student from '../models/student.model.js';

// GET /students — paginated list (JSON)
export const getAllStudents = async (req, res) => {
  try {
    const page    = Math.max(1, parseInt(req.query.page)  || 1);
    const limit   = Math.max(1, parseInt(req.query.limit) || 10);
    const sortBy  = ['name', 'roll', 'createdAt'].includes(req.query.sortBy)
                      ? req.query.sortBy : 'createdAt';
    const order   = req.query.order === 'asc' ? 1 : -1;
    const skip    = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find().sort({ [sortBy]: order }).skip(skip).limit(limit),
      Student.countDocuments(),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /students
export const createStudent = async (req, res) => {
  try {
    const { name, roll } = req.body;
    const student = await Student.create({ name, roll });
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Roll number already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /students/:id
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Roll number already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /view/students
export const viewStudents = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.max(1, parseInt(req.query.limit) || 10);
    const sortBy = ['name', 'roll', 'createdAt'].includes(req.query.sortBy)
                     ? req.query.sortBy : 'createdAt';
    const order  = req.query.order === 'asc' ? 1 : -1;
    const skip   = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find().sort({ [sortBy]: order }).skip(skip).limit(limit),
      Student.countDocuments(),
    ]);

    res.render('students/index', {
      students,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      query: req.query,
      error: null,
      success: req.query.success || null,
    });
  } catch (err) {
    res.render('students/index', {
      students: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
      query: req.query,
      error: err.message,
      success: null,
    });
  }
};

// GET /view/students/new
export const viewNewStudent = (req, res) => {
  res.render('students/edit', { student: null, error: null });
};

// GET /view/students/:id/edit
export const viewEditStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.redirect('/view/students');
    res.render('students/edit', { student, error: null });
  } catch (err) {
    res.redirect('/view/students');
  }
};

// POST /view/students (create via form)
export const viewCreateStudent = async (req, res) => {
  try {
    const { name, roll } = req.body;
    await Student.create({ name, roll });
    res.redirect('/view/students?success=Student+added+successfully');
  } catch (err) {
    const message = err.code === 11000
      ? 'Roll number already exists'
      : err.message;
    res.render('students/edit', { student: null, error: message });
  }
};

// POST /view/students/:id/update
export const viewUpdateStudent = async (req, res) => {
  try {
    const { name, roll } = req.body;
    await Student.findByIdAndUpdate(
      req.params.id,
      { name, roll },
      { new: true, runValidators: true }
    );
    res.redirect('/view/students?success=Student+updated+successfully');
  } catch (err) {
    const student = await Student.findById(req.params.id).catch(() => null);
    const message = err.code === 11000
      ? 'Roll number already exists'
      : err.message;
    res.render('students/edit', { student, error: message });
  }
};

// POST /view/students/:id/delete
export const viewDeleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/view/students?success=Student+deleted+successfully');
  } catch (err) {
    res.redirect('/view/students');
  }
};