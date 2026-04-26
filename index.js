import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import studentRoutes from './routes/student.routes.js';
import studentViewRoutes from './routes/student.view.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use('/students',      studentRoutes);
app.use('/view/students', studentViewRoutes);

app.get('/', (req, res) => res.redirect('/view/students'));
app.use((req, res) => res.status(404).send('<h2>404 — Page Not Found</h2><a href="/">Go Home</a>'));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});