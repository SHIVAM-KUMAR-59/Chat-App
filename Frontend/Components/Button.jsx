import React from 'react'

const Button = (props) => {
  return (
    <button className="bg-red-700 px-3 py-2 rounded-lg !important">
      {props.name}
    </button>
  )
}

export default Button
