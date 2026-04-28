import { useEffect, useRef } from 'react'
import './confirmDialog.css'

const ConfirmDialog = ({ dialog, onCancel }) => {
  const confirmBtnRef = useRef()

  useEffect(() => {
    if (dialog) {
      confirmBtnRef.current?.focus()
    }
  }, [dialog])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && dialog) onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [dialog, onCancel])

  if (!dialog) return null

  return (
    <div
      className="edit-card-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="bg-blur" onClick={onCancel} />
      <div className="confirm-dialog">
        <p id="confirm-title" className="confirm-message">{dialog.message}</p>
        <div className="confirm-actions">
          <button
            ref={confirmBtnRef}
            className="btn-danger"
            onClick={dialog.onConfirm}
          >
            Delete
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

