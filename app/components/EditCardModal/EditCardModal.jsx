import { useEffect, useRef } from 'react'
import './editCardModal.css'

const EditCardModal = ({
  setShowEditModal,
  showEditModal,
  editInput,
  setEditInput,
  editDueDate,
  setEditDueDate,
  editCardHandler,
}) => {
  const textareaRef = useRef()

  useEffect(() => {
    if (showEditModal) {
      textareaRef.current?.focus()
    }
  }, [showEditModal])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && showEditModal) setShowEditModal(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [showEditModal, setShowEditModal])

  if (!showEditModal) return null

  return (
    <div
      className="edit-card-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="bg-blur" onClick={() => setShowEditModal(false)} />
      <form onSubmit={editCardHandler}>
        <button
          type="button"
          onClick={() => setShowEditModal(false)}
          className="close-modal-btn"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>

        <h3 id="edit-modal-title" className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-1">
          Edit Task
        </h3>

        <label htmlFor="edit-title" className="text-sm text-gray-500 dark:text-gray-400">
          Title
        </label>
        <textarea
          id="edit-title"
          ref={textareaRef}
          cols="30"
          rows="4"
          className="input"
          value={editInput}
          onChange={(e) => setEditInput(e.target.value)}
          aria-label="Task title"
        />

        <label htmlFor="edit-due-date" className="text-sm text-gray-500 dark:text-gray-400">
          Due date <span className="opacity-60">(optional)</span>
        </label>
        <input
          id="edit-due-date"
          type="date"
          className="input"
          value={editDueDate || ''}
          onChange={(e) => setEditDueDate(e.target.value)}
          aria-label="Due date"
        />

        <div className="flex gap-2">
          <button type="submit" className="btn flex-1">Save changes</button>
          {editDueDate && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setEditDueDate('')}
              title="Clear due date"
              aria-label="Clear due date"
            >
              Clear date
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EditCardModal

