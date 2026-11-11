import { Check, Plus, Star, Trash2, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHead } from '../ui'

export type TodoItem = {
  id: number
  text: string
  starred: boolean
  done: boolean
}

const STORAGE_KEY = 'dashstack_todos'

const initialTodos: TodoItem[] = [
  { id: 1, text: 'Meeting with CEO', starred: false, done: false },
  { id: 2, text: 'Pick up kids from school', starred: true, done: false },
  { id: 3, text: 'Shopping with Brother', starred: false, done: false },
  { id: 4, text: 'Review with HR', starred: false, done: true },
  { id: 5, text: "Going to Dia's School", starred: false, done: false },
  { id: 6, text: 'Check design files', starred: true, done: false },
  { id: 7, text: 'Update File', starred: false, done: false },
]

function getStoredTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fallback
  }
  return initialTodos
}

function saveStoredTodos(items: TodoItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('dashstack_todos_changed'))
  } catch {
    // ignore quota errors
  }
}

export function useTodos() {
  const [items, setItems] = useState<TodoItem[]>(getStoredTodos)

  useEffect(() => {
    const sync = () => setItems(getStoredTodos())
    window.addEventListener('dashstack_todos_changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('dashstack_todos_changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const addTodo = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    const current = getStoredTodos()
    const nextId = current.reduce((max, t) => Math.max(max, t.id), 0) + 1
    const newItem: TodoItem = {
      id: nextId,
      text: trimmed,
      starred: false,
      done: false,
    }
    const updated = [newItem, ...current]
    saveStoredTodos(updated)
    setItems(updated)
    return true
  }

  const toggleDone = (id: number) => {
    const current = getStoredTodos()
    const updated = current.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    saveStoredTodos(updated)
    setItems(updated)
  }

  const toggleStar = (id: number) => {
    const current = getStoredTodos()
    const updated = current.map(item => (item.id === id ? { ...item, starred: !item.starred } : item))
    saveStoredTodos(updated)
    setItems(updated)
  }

  const removeTodo = (id: number) => {
    const current = getStoredTodos()
    const updated = current.filter(item => item.id !== id)
    saveStoredTodos(updated)
    setItems(updated)
  }

  return { items, addTodo, toggleDone, toggleStar, removeTodo }
}

export function TodoList({
  active = -1,
  filter = 'all',
}: {
  active?: number
  filter?: 'all' | 'pending' | 'completed' | 'starred'
}) {
  const { items, toggleDone, toggleStar, removeTodo } = useTodos()
  const [activeId, setActiveId] = useState<number | null>(active > 0 ? active : null)

  const filteredItems = items.filter(item => {
    if (filter === 'pending') return !item.done
    if (filter === 'completed') return item.done
    if (filter === 'starred') return item.starred
    return true
  })

  if (filteredItems.length === 0) {
    return (
      <div className="card p-10 text-center text-sm muted">
        No tasks found. Click &quot;Add New Task&quot; to create one!
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {filteredItems.map(item => {
        const isActive = activeId === item.id
        const { id, text, starred, done } = item

        return (
          <li
            key={id}
            onClick={() => setActiveId(isActive ? null : id)}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-4 transition ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'border border-line bg-white/80 text-ink dark:border-line-dark dark:bg-card-dark dark:text-ink-dark'
            }`}
          >
            <button
              type="button"
              aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
              onClick={e => {
                e.stopPropagation()
                toggleDone(id)
              }}
              className={`grid h-5 w-5 place-items-center rounded-md border transition ${
                isActive
                  ? 'border-white/80 bg-white/15 text-white'
                  : done
                  ? 'border-primary bg-primary text-white'
                  : 'border-[#cdd8e7] bg-white text-transparent dark:border-line-dark dark:bg-page-dark'
              }`}
            >
              {done && <Check size={12} strokeWidth={3} />}
            </button>

            <span
              className={`flex-1 text-base font-medium transition ${
                isActive
                  ? 'text-white'
                  : done
                  ? 'line-through opacity-60 text-muted dark:text-muted-dark'
                  : 'text-ink dark:text-ink-dark'
              }`}
            >
              {text}
            </span>

            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Toggle favorite"
                onClick={() => toggleStar(id)}
                className={`grid h-8 w-8 place-items-center rounded-full transition ${
                  isActive ? 'text-white/80 hover:bg-white/10' : 'text-muted hover:bg-primary/5 dark:text-muted-dark'
                }`}
              >
                <Star
                  size={18}
                  className={
                    starred
                      ? 'fill-yellow-400 text-yellow-400'
                      : isActive
                      ? 'text-white/80'
                      : 'text-muted dark:text-muted-dark'
                  }
                />
              </button>

              <button
                type="button"
                aria-label="Delete task"
                onClick={() => removeTodo(id)}
                className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                  isActive
                    ? 'border-white/30 bg-white/10 text-white hover:bg-white/15'
                    : 'border-line bg-transparent text-muted hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:border-line-dark dark:text-muted-dark dark:hover:bg-red-500/10 dark:hover:text-red-400'
                }`}
              >
                {isActive ? <Trash2 size={14} /> : <X size={14} />}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function Todo() {
  const { addTodo, items } = useTodos()
  const [quickText, setQuickText] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'starred'>('all')

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault()
    if (quickText.trim()) {
      addTodo(quickText)
      setQuickText('')
    }
  }

  const pendingCount = items.filter(t => !t.done).length
  const completedCount = items.filter(t => t.done).length

  return (
    <>
      <PageHead title="To-Do List">
        <Link to="/todo/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add New Task
        </Link>
      </PageHead>

      <form onSubmit={handleQuickAdd} className="mb-6 flex gap-3 max-w-xl">
        <input
          value={quickText}
          onChange={e => setQuickText(e.target.value)}
          placeholder="Write your task name here..."
          className="input flex-1"
        />
        <button type="submit" className="btn-primary px-6">
          Add Task
        </button>
      </form>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'all', label: `All (${items.length})` },
              { key: 'pending', label: `Pending (${pendingCount})` },
              { key: 'completed', label: `Completed (${completedCount})` },
              { key: 'starred', label: 'Starred' },
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                filter === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-card text-muted hover:text-ink dark:bg-card-dark dark:text-muted-dark dark:hover:text-ink-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <TodoList filter={filter} />
    </>
  )
}

export const AddTodo = () => {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const { addTodo } = useTodos()
  const nav = useNavigate()

  const handleSave = (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!text.trim()) {
      setError('Please enter a task name')
      return
    }
    addTodo(text)
    nav('/todo')
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <PageHead title="Add New To-Do">
          <div className="flex items-center gap-3">
            <Link to="/todo" className="btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn-primary px-8">
              Save
            </button>
          </div>
        </PageHead>

        <div className="card mb-6 p-5 sm:p-6 max-w-2xl">
          <label className="block text-sm font-semibold mb-2">Task Title *</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={text}
              onChange={e => {
                setText(e.target.value)
                if (error) setError('')
              }}
              autoFocus
              placeholder="Write your task name here..."
              className={`input flex-1 ${error ? 'border-red-500' : ''}`}
            />
            <button type="submit" className="btn-primary whitespace-nowrap px-6">
              Save Task
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      </form>

      <h3 className="mb-4 text-lg font-bold">Existing Tasks</h3>
      <TodoList />
    </>
  )
}
