import { Check, Star, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../ui'

type TodoItem = {
  text: string
  starred: boolean
  done: boolean
}

const base: TodoItem[] = [
  { text: 'Meeting with CEO', starred: false, done: false },
  { text: 'Pick up kids from school', starred: true, done: false },
  { text: 'Shopping with Brother', starred: false, done: false },
  { text: 'Review with HR', starred: false, done: true },
  { text: 'Going to Dia’s School', starred: false, done: false },
  { text: 'Check design files', starred: true, done: false },
  { text: 'Update File', starred: false, done: false },
]

export function TodoList({ active = 3 }: { active?: number }) {
  const [items, setItems] = useState<TodoItem[]>(base)

  const toggleDone = (index: number) => {
    setItems(current => current.map((item, i) => i === index ? { ...item, done: !item.done } : item))
  }

  const toggleStar = (index: number) => {
    setItems(current => current.map((item, i) => i === index ? { ...item, starred: !item.starred } : item))
  }

  const removeItem = (index: number) => {
    setItems(current => current.filter((_, i) => i !== index))
  }

  return (
    <ul className="space-y-3">
      {items.map(({ text, starred, done }, i) => {
        const isActive = i === active

        return (
          <li
            key={`${text}-${i}`}
            className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'border border-line bg-white/80 text-ink dark:border-line-dark dark:bg-card-dark dark:text-ink-dark'
            }`}
          >
            <button
              type="button"
              aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
              onClick={() => toggleDone(i)}
              className={`grid h-5 w-5 place-items-center rounded-md border ${
                isActive
                  ? 'border-white/80 bg-white/15 text-white'
                  : 'border-[#cdd8e7] bg-white text-transparent dark:border-line-dark dark:bg-page-dark'
              }`}
            >
              {done && <Check size={12} strokeWidth={3} />}
            </button>

            <span className={`flex-1 text-base font-medium ${isActive ? 'text-white' : 'text-ink dark:text-ink-dark'}`}>
              {text}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Toggle favorite"
                onClick={() => toggleStar(i)}
                className={`grid h-8 w-8 place-items-center rounded-full ${
                  isActive ? 'text-white/80 hover:bg-white/10' : 'text-muted hover:bg-primary/5 dark:text-muted-dark'
                }`}
              >
                <Star
                  size={18}
                  className={starred ? 'fill-yellow-400 text-yellow-400' : isActive ? 'text-white/80' : 'text-muted dark:text-muted-dark'}
                />
              </button>

              <button
                type="button"
                aria-label="Delete task"
                onClick={() => removeItem(i)}
                className={`grid h-8 w-8 place-items-center rounded-full border ${
                  isActive
                    ? 'border-white/30 bg-white/10 text-white hover:bg-white/15'
                    : 'border-line bg-transparent text-muted hover:bg-primary/5 dark:border-line-dark dark:text-muted-dark'
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
  return (
    <>
      <PageHead title="To-Do List">
        <Link to="/todo/new" className="btn-primary">Add New Task</Link>
      </PageHead>
      <TodoList />
    </>
  )
}

export const AddTodo = () => (
  <>
    <PageHead title="Add New To-Do"><button className="btn-primary px-8">Save</button></PageHead>
    <input placeholder="Write your task name here" className="input mb-5 max-w-sm" />
    <TodoList active={-1} />
  </>
)

export const _unused = Check
