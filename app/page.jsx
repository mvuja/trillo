'use client'
import dynamic from 'next/dynamic'

const Board = dynamic(() => import('./components/Board/Board'), { ssr: false })

export default function Page() {
  return <Board />
}
