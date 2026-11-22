const express = require('express');
const logger = require('./middleware/logger');
const {
  createTodoValidator,
  editTodoValidator,
} = require('./middleware/validator.js');

const errorHandler = require('./middleware/errorHandler');
const e = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

app.use(logger); // Custom middleware
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Test API', completed: true },
  { id: 4, task: 'Deploy API', completed: true },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// GET one todo by ID - Read
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
});

// POST New – Create
app.post('/todos', createTodoValidator, (req, res) => {
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  if (!newTodo.task || typeof newTodo.completed !== 'boolean') {
  return res.status(400).json({ message: 'Todo information not complete!' });
}
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// PATCH Update – Partial
app.patch('/todos/:id', editTodoValidator, (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
    if (todos.length === initialLength)
      return res.status(404).json({ error: 'Not found' });
    res.status(204).send(); // Silent success
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// GET completed todos - Read
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((todo) => todo.completed);
  res.status(200).json(completed); // Custom Read!
});

// GET active todos - Read
app.get('/todos/active', (req, res) => {
  const active = todos.filter((todo) => !todo.completed);
  res.status(200).json(active);
});

app.use(errorHandler); // Error-handling middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on http://localhost:${PORT}`));