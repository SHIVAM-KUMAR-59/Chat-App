import React from 'react'
import { io } from 'socket.io-client'

const socket = io(`http://localhost:8000`)

const PracticeButton = () => {
  const handleOnClick = (e) => {
    socket.emit('practice', e.target.value)
    console.log(e.target.value)
    alert('Practiced!')
  }
  return (
    <button value="Practice" onClick={handleOnClick}>
      Practice
    </button>
  )
}

export default PracticeButton
