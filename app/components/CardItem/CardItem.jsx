import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import './cardItem.css'

const PRIORITY_LABELS = ['Low Priority', 'Medium Priority', 'High Priority']
const PRIORITY_CLASSES = ['priority-0', 'priority-1', 'priority-2']

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CardItem({ item, index, boardData, onDeleteCard, onEditCard, dimmed }) {
  const [priority, setPriority] = useState(item.priority)
  const [showPriority, setShowPriority] = useState(false)
  const priorityRef = useRef()
  const priorityBtnRef = useRef()
  const isNew = useRef(true)
  useEffect(() => { isNew.current = false }, [])

  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date()

  const showPriorityHandler = () => setShowPriority(prev => !prev)

  const closeOpenPriorities = useCallback(
    (e) => {
      if (
        priorityRef.current &&
        showPriority &&
        !priorityRef.current.contains(e.target) &&
        !priorityBtnRef.current.contains(e.target)
      ) {
        setShowPriority(false)
      }
    },
    [showPriority]
  )

  useEffect(() => {
    document.addEventListener('mousedown', closeOpenPriorities)
    return () => document.removeEventListener('mousedown', closeOpenPriorities)
  }, [closeOpenPriorities])

  const changePriority = (pr) => {
    setPriority(pr)
    const dataHolder = boardData.map(col => ({ ...col, items: [...col.items] }))
    dataHolder.forEach((col) => {
      col.items.forEach((el2) => {
        if (item.id === el2.id) el2.priority = pr
      })
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem('data', JSON.stringify(dataHolder))
    }
    setShowPriority(false)
  }

  return (
    <Draggable index={index} draggableId={item.id.toString()}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card ${snapshot.isDragging ? 'dragging' : ''} ${dimmed ? 'card-dimmed' : ''}`}
        >
          <div className="card-inner">
            {/* Grip icon — visual only, full card is draggable */}
            <span className="card-drag-handle" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </span>

            {/* Priority label */}
            <button
              ref={priorityBtnRef}
              onClick={showPriorityHandler}
              className={`card-label ${PRIORITY_CLASSES[priority]}`}
              aria-label={`Priority: ${PRIORITY_LABELS[priority]}. Click to change.`}
            >
              {PRIORITY_LABELS[priority]}
            </button>

            <div
              className={`prority-dropdown ${showPriority ? 'p-visible' : ''}`}
              ref={priorityRef}
              role="menu"
              aria-label="Select priority"
            >
              {[0, 1, 2].map((pr) => (
                <button
                  key={pr}
                  className={`card-label ${PRIORITY_CLASSES[pr]}`}
                  onClick={() => changePriority(pr)}
                  aria-label={PRIORITY_LABELS[pr]}
                  role="menuitem"
                />
              ))}
            </div>

            <h5 className="card-title">{item.title}</h5>

            {/* Due date */}
            {item.dueDate && (
              <div className={`card-due-date ${isOverdue ? 'due-overdue' : ''}`} aria-label={`Due: ${formatDate(item.dueDate)}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <span>{formatDate(item.dueDate)}</span>
              </div>
            )}

            {/* Actions */}
            <button
              className="card-edit"
              onClick={() => onEditCard(item.id, item.title, item.dueDate)}
              aria-label="Edit task"
              title="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
              </svg>
            </button>

            <button
              className="card-trash"
              onClick={() => onDeleteCard(item.id)}
              aria-label="Delete task"
              title="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default CardItem
