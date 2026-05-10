// backend/server.js
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const SECRET = 'your-secret-key'

app.use(cors())
app.use(express.json())

let users = []
let todos = []

app.post('/register', (req, res) => {
  const { email, password } = req.body
  users.push({ email, password })
  res.json({ message: 'registered' })
})

app.post('/login', (req, res) => {
  const user = users.find(u => u.email === req.body.email)
  if (!user) return res.status(401).json({ error: 'not found' })
  const token = jwt.sign({ email: user.email }, SECRET)
  res.json({ token })
})

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'no token' })
  try { req.user = jwt.verify(token, SECRET); next() }
  catch { res.status(401).json({ error: 'invalid token' }) }
}

app.get('/todos', auth, (req, res) => res.json(todos))
app.post('/todos', auth, (req, res) => {
  const todo = { id: Date.now(), text: req.body.text, done: false }
  todos.push(todo)
  res.json(todo)
})

app.listen(3000, () => console.log('API running on port 3000'))