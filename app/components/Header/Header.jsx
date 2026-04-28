import { useState, useRef, useEffect } from 'react'
import './header.css'

const Header = ({ boardTitle, setBoardTitle, searchQuery, setSearchQuery, onReset }) => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const titleInputRef = useRef()

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus()
  }, [editingTitle])

  const startEditingTitle = () => { setTitleInput(boardTitle); setEditingTitle(true) }
  const commitTitle = () => {
    const t = titleInput.trim()
    if (t) { setBoardTitle(t); if (typeof window !== 'undefined') localStorage.setItem('boardTitle', t) }
    setEditingTitle(false)
  }
  const handleTitleKey = (e) => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false) }


  const darkToggle = () => {
    setDark(d => {
      const next = !d
      if (typeof window !== 'undefined') localStorage.setItem('darkMode', next)
      return next
    })
  }

  const MoonIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    )

    const SunIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    )

  const DarkToggleBtn = () => (
    <button
      className="dark-toggle"
      onClick={darkToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {!dark ? <MoonIcon /> : <SunIcon />}
    </button>
  )

  return (
    <div className="header">
      <div className="header-title-container">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={handleTitleKey}
            onBlur={commitTitle}
            className="header-title-input"
            aria-label="Board title"
          />
        ) : (
          <h4
            className="header-title"
            onDoubleClick={startEditingTitle}
            title="Double-click to rename"
          >
            {boardTitle}
          </h4>
        )}
        <div className="toggle-mobile">
          <DarkToggleBtn />
        </div>
      </div>

      {/* Search */}
      <div className="header-search">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="header-search-input"
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="search-clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Reset */}
      <button
        className="btn-reset"
        onClick={onReset}
        aria-label="Reset board to default"
        title="Reset board to default data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span className="hidden md:inline">Reset</span>
      </button>

      <div className="toggle-desktop">
        <DarkToggleBtn />
      </div>
    </div>
  )
}

export default Header