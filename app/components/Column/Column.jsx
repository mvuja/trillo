'use client'
import { useState, useRef, useEffect } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import CardItem from '../CardItem/CardItem'
import './column.css'

function Column({
  board,
  provided,
  boardData,
  onDeleteCard,
  onEditCard,
  onAddCard,
  onRenameColumn,
  onDeleteColumn,
  searchQuery,
}) {
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(board.name)
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const nameInputRef = useRef()
  const addTaskRef = useRef()
  const isNew = useRef(true)
  useEffect(() => { isNew.current = false }, [])

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus()
  }, [editingName])

  useEffect(() => {
    if (showForm) addTaskRef.current?.focus()
  }, [showForm])

  const startEditing = () => {
    setEditingName(true)
    setNameInput(board.name)
  }

  const commitName = () => {
    const trimmed = nameInput.trim()
    if (trimmed) onRenameColumn(board.id, trimmed)
    setEditingName(false)
  }

  const handleNameKey = (e) => {
    if (e.key === 'Enter') commitName()
    if (e.key === 'Escape') setEditingName(false)
  }

  const handleAddCard = () => {
    if (text.trim()) {
      onAddCard(board.id, text.trim())
      setText('')
      setShowForm(false)
    } else {
      setShowForm(false)
    }
  }

  const handleAddKeyDown = (e) => {
    if (e.key === 'Escape') { setShowForm(false); setText('') }
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="w-96 flex-shrink-0 align-top mx-2"
    >
        <div className={`column ${isNew.current ? 'column-enter' : ''}`}>
        <span className="column-top-bar" />

        {/* Column Header */}
        <div className="column-header">
          {/* Drag handle */}
          <span
            {...provided.dragHandleProps}
            className="column-drag-handle"
            aria-label="Drag column"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </span>

          {/* Title / inline rename */}
          <div className="column-title-area">
            {editingName ? (
              <div className="board-edit-container">
                <input
                  ref={nameInputRef}
                  type="text"
                  className="editing-board-name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={handleNameKey}
                  onBlur={commitName}
                  aria-label="Column name"
                />
                <button onClick={() => setEditingName(false)} aria-label="Cancel rename">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
            ) : (
              <span className="column-name">{board.name}</span>
            )}
          </div>

          {/* Card count badge */}
          {!editingName && (
            <span className="column-badge" aria-label={`${board.items.length} tasks`}>
              {board.items.length}
            </span>
          )}

          {/* Rename button */}
          {!editingName && (
            <button
              onClick={startEditing}
              className="column-action-btn"
              aria-label="Rename column"
              title="Rename column"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
              </svg>
            </button>
          )}

          {/* Delete column button */}
          {!editingName && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="column-action-btn column-delete-btn"
              aria-label="Delete column"
              title="Delete column"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )}
        </div>

        {/* Inline delete-column confirmation */}
        {showDeleteConfirm && (
          <div className="column-confirm-delete">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Delete &ldquo;{board.name}&rdquo; and all its tasks?
            </p>
            <div className="flex gap-2 mt-2">
              <button
                className="btn-danger"
                onClick={() => { onDeleteColumn(board.id); setShowDeleteConfirm(false) }}
                autoFocus
              >
                Delete
              </button>
              <button className="btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Card list */}
        <Droppable droppableId={board.id.toString()} type="CARD">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div className={snapshot.isDraggingOver ? 'dragging-over' : ''}>
                <div
                  className="card-list-scroll overflow-x-hidden h-auto"
                  style={{ maxHeight: 'calc(100vh - 290px)' }}
                >
                  {board.items.length === 0 && !showForm && (
                    <div className="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 mx-auto mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <p className="text-sm dark:text-gray-400 text-gray-400">No tasks yet</p>
                    </div>
                  )}

                  {board.items.map((item, iIndex) => {
                    const isMatch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())
                    return (
                      <CardItem
                        boardData={boardData}
                        onDeleteCard={onDeleteCard}
                        onEditCard={onEditCard}
                        key={item.id}
                        item={item}
                        index={iIndex}
                        dimmed={!!searchQuery && !isMatch}
                      />
                    )
                  })}

                  {provided.placeholder}
                </div>

                {/* Add card form */}
                {showForm ? (
                  <div className="p-3">
                    <textarea
                      ref={addTaskRef}
                      className="textarea"
                      rows={3}
                      placeholder="Task title…"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleAddKeyDown}
                      aria-label="New task title"
                    />
                    <div className="flex gap-2">
                      <button className="btn flex-1" onClick={handleAddCard}>
                        Add task
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => { setShowForm(false); setText('') }}
                        aria-label="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="add-task"
                    onClick={() => setShowForm(true)}
                    aria-label={`Add task to ${board.name}`}
                  >
                    <span>Add task</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default Column

