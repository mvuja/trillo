'use client'
import BoardData from "../../data/board-data.json"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './board.css'

import Header from "../Header/Header"
import Column from "../Column/Column"
import EditCardModal from "../EditCardModal/EditCardModal"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog"

import createGuidId from '../../hooks/GuiId'

export default function Board() {
  const [ready, setReady] = useState(false)
  const [boardData, setBoardData] = useState(getInitialData)
  const [searchQuery, setSearchQuery] = useState('')
  const [boardTitle, setBoardTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('boardTitle') || 'Trillo Board'
    }
    return 'Trillo Board'
  })

  // Edit card modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editInput, setEditInput] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editID, setEditID] = useState()

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState(null)

  const notify = (txt) => toast(txt, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  })

  // Initial load
  useEffect(() => {
    if (typeof window !== 'undefined') setReady(true)
  }, [])

  function getInitialData() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('data')
      return saved ? JSON.parse(saved) : BoardData
    }
    return BoardData
  }

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('data', JSON.stringify(boardData))
    }
  }, [boardData])

  // Drag & drop
  const onDragEnd = (result) => {
    if (!result.destination) return

    // Column reorder
    if (result.type === 'COLUMN') {
      const cols = [...boardData]
      const [removed] = cols.splice(result.source.index, 1)
      cols.splice(result.destination.index, 0, removed)
      setBoardData(cols)
      return
    }

    // Card move — deep copy first to avoid mutation
    const newBoardData = boardData.map(col => ({ ...col, items: [...col.items] }))
    const sourceCol = newBoardData.find(col => col.id.toString() === result.source.droppableId)
    const destCol = newBoardData.find(col => col.id.toString() === result.destination.droppableId)
    if (!sourceCol || !destCol) return
    const [dragItem] = sourceCol.items.splice(result.source.index, 1)
    destCol.items.splice(result.destination.index, 0, dragItem)
    setBoardData(newBoardData)
  }

  // Card CRUD
  const onAddCard = (boardId, title) => {
    const item = {
      id: createGuidId(),
      title,
      priority: 0,
      chat: 0,
      attachment: 0,
      assignees: [],
      dueDate: null,
    }
    setBoardData(prev =>
      prev.map(col =>
        col.id.toString() === boardId.toString()
          ? { ...col, items: [...col.items, item] }
          : col
      )
    )
    notify('Task successfully created!')
  }

  const onDeleteCard = (id) => {
    setConfirmDialog({
      message: 'Delete this task? This cannot be undone.',
      onConfirm: () => {
        setBoardData(prev =>
          prev.map(col => ({ ...col, items: col.items.filter(item => item.id !== id) }))
        )
        setConfirmDialog(null)
        notify('Task deleted.')
      },
    })
  }

  const onEditCard = (id, title, dueDate) => {
    setShowEditModal(true)
    setEditInput(title)
    setEditDueDate(dueDate || '')
    setEditID(id)
  }

  const editCardHandler = (e) => {
    e.preventDefault()
    if (!editInput.trim()) return
    setBoardData(prev =>
      prev.map(col => ({
        ...col,
        items: col.items.map(item =>
          item.id === editID
            ? { ...item, title: editInput.trim(), dueDate: editDueDate || null }
            : item
        ),
      }))
    )
    setShowEditModal(false)
    notify('Task updated!')
  }

  // Column CRUD
  const onRenameColumn = (boardId, newName) => {
    setBoardData(prev =>
      prev.map(col =>
        col.id.toString() === boardId.toString() ? { ...col, name: newName } : col
      )
    )
  }

  const onDeleteColumn = (boardId) => {
    setBoardData(prev => prev.filter(col => col.id.toString() !== boardId.toString()))
    notify('Column deleted.')
  }

  // Add column
  const [addNewInput, setAddNewInput] = useState('')
  const [showAddList, setShowAddList] = useState(false)
  const addColumn = () => {
    if (addNewInput.trim()) {
      setBoardData(prev => [...prev, { id: createGuidId(), name: addNewInput.trim(), items: [] }])
      notify('Column successfully created!')
      setShowAddList(false)
    }
    setAddNewInput('')
  }

  // Reset
  const onReset = () => {
    setConfirmDialog({
      message: 'Reset the board to default? All your changes will be lost.',
      onConfirm: () => {
        setBoardData(BoardData)
        setBoardTitle('Trillo Board')
        localStorage.removeItem('boardTitle')
        setConfirmDialog(null)
        notify('Board reset to defaults.')
      },
    })
  }

  return (
    <main>
      <ToastContainer />
      <div className="flex flex-col h-screen">
        <Header
          boardTitle={boardTitle}
          setBoardTitle={setBoardTitle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReset={onReset}
        />
        <div className="relative h-full mt-11">
          <EditCardModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            editInput={editInput}
            setEditInput={setEditInput}
            editDueDate={editDueDate}
            setEditDueDate={setEditDueDate}
            editCardHandler={editCardHandler}
          />

          <ConfirmDialog
            dialog={confirmDialog}
            onCancel={() => setConfirmDialog(null)}
          />

          {ready && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="columns-container"
                  >
                    {boardData.map((board, bIndex) => (
                      <Draggable
                        key={board.id}
                        draggableId={`column-${board.id}`}
                        index={bIndex}
                      >
                        {(provided, snapshot) => (
                          <Column
                            board={board}
                            bIndex={bIndex}
                            provided={provided}
                            colSnapshot={snapshot}
                            boardData={boardData}
                            onDeleteCard={onDeleteCard}
                            onEditCard={onEditCard}
                            onAddCard={onAddCard}
                            onRenameColumn={onRenameColumn}
                            onDeleteColumn={onDeleteColumn}
                            searchQuery={searchQuery}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Add list — inline after columns */}
                    <div className="add-list-inline">
                      {showAddList ? (
                        <div className="add-list-inline-form-wrapper">
                          <input
                            type="text"
                            value={addNewInput}
                            onChange={(e) => setAddNewInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Escape') { setShowAddList(false); setAddNewInput('') } }}
                            placeholder="Enter list name…"
                            className="add-list-inline-input"
                            aria-label="New column name"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button className="btn flex-1" onClick={addColumn}>Add list</button>
                            <button
                              className="btn-cancel"
                              onClick={() => { setShowAddList(false); setAddNewInput('') }}
                              aria-label="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="add-task"
                          onClick={() => setShowAddList(true)}
                          aria-label="Add another list"
                        >
                          <span>Add list</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </main>
  )
}
