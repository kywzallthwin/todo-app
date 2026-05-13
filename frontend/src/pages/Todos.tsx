import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Todo = {
  id: number
  text: string
  done: boolean
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:3000/todos', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setTodos)
  }, [])

  const addTodo = async () => {
    const res = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    })
    const todo = await res.json()
    setTodos(prev => [...prev, todo])
    setText('')
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">My Todos</h1>
        <button onClick={logout} className="text-sm text-red-500">Logout</button>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={text} onChange={e => setText(e.target.value)}
          className="border rounded-lg p-2 text-sm flex-1" placeholder="Add todo..." />
        <button onClick={addTodo} className="bg-green-600 text-white rounded-lg px-4 text-sm">Add</button>
      </div>
      {todos.map((t) => (
        <div key={t.id} className="border rounded-lg p-3 mb-2 text-sm">{t.text}</div>
      ))}
    </div>
  )
}