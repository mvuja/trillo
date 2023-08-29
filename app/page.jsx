'use client'
import BoardData from "./data/board-data.json"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { useEffect, useState } from "react"

// components
import Header from "./components/Header"
import CardItem from "./components/CardItem"

// custom hooks
import createGuidId from './hooks/GuiId'

export default function Home() {
  const [text, setText] = useState('')
  const [ready, setReady] = useState(false)
  const [boardData, setBoardData] = useState(getInitialData())
  const [showForm, setShowForm] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(0)


  useEffect(() => {
    if (process.browser) {
      setReady(true)
    }
  }, [])

  
  // LOCAL STORAGE
  function getInitialData() {
    if(typeof window !== 'undefined'){
      const temp = localStorage.getItem('data')
      const savedData = JSON.parse(temp)
      return savedData || BoardData
    }
  }
  useEffect(() => {
      if(typeof window !== 'undefined'){
        const temp = JSON.stringify(boardData)
        localStorage.setItem('data', temp)
      }

      // console.log(boardData)
  })


  
  const onDragEnd = (re) => {
    if (!re.destination) return
    let newBoardData = boardData
    var dragItem =
      newBoardData[parseInt(re.source.droppableId)].items[re.source.index]
    newBoardData[parseInt(re.source.droppableId)].items.splice(
      re.source.index,
      1
    )
    newBoardData[parseInt(re.destination.droppableId)].items.splice(
      re.destination.index,
      0,
      dragItem
    )
    setBoardData(newBoardData)
  }

  const onAddCard = (e) => {
    // if(e.keyCode === 13) //Enter
    // {
      const val = text
      if(val.length === 0) {
        setShowForm(false)
      }
      else {
        const boardId = e.target.attributes['data-id'].value
        const item = {
          id: createGuidId(),
          title: val,
          priority: 0,
          chat:0,
          attachment: 0,
          assignees: []
        }
        let newBoardData = boardData
        newBoardData[boardId].items.push(item)
        setBoardData(newBoardData)
        setShowForm(false)
        setText('')
      }
    // }
  }
  
  return (
    <main>
      <div className="flex flex-col h-screen">
          {/* Board header */}
          <Header setBoardData={setBoardData} />

        <div className="relative h-full mt-11">
          {/* Board columns */}
          {ready && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="overflow-x-auto overflow-y-hidden inset-0 absolute whitespace-nowrap select-none">
                {boardData.map((board, bIndex) => {
                  return (
                    <div key={board.id} className="w-96 whitespace-nowrap align-top h-full inline-block mx-2 first:ml-10 last:mr-10">
                      <Droppable droppableId={bIndex.toString()}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <div
                              className={`column ${snapshot.isDraggingOver && "dragging-over"}`}
                            >
                              <span className="column-top-bar"></span>
                              <h4 className=" p-3 flex justify-between items-center mb-2">
                                <span className="column-title">
                                  {board.name}
                                </span>
                              </h4>

                              <div className="overflow-y-auto overflow-x-hidden h-auto pb-1"
                              style={{maxHeight:'calc(100vh - 290px)'}}>
                                {board.items.length > 0 &&
                                  board.items.map((item, iIndex) => {
                                    return (
                                      <CardItem
                                        key={item.id}
                                        data={item}
                                        index={iIndex}
                                        className="m-3"
                                      />
                                    );
                                  })}
                                {provided.placeholder}
                              </div>
                              
                              {
                                showForm && selectedBoard === bIndex ? (
                                  <div className="p-3">
                                    <textarea
                                      className="textarea" 
                                      rows={3}
                                      placeholder="Task info"
                                      value={text}
                                      onChange={(e) => setText(e.target.value)}
                                    />
                                    <button className="btn" data-id={bIndex} onClick={(e) => onAddCard(e)}>Add</button>
                                  </div>
                                ): (
                                  <button
                                    className="flex justify-center items-center my-3 space-x-2 text-lg"
                                    onClick={() => {setSelectedBoard(bIndex); setShowForm(true);}}
                                  >
                                    <span>Add task</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                  </button>
                                )
                              }
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )
                })}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>
    </main>
  )
}