import React from 'react'

const Input = (props) => {
  return (
    <div className="flex flex-col mt-10 w-[90%]">
      <label htmlFor={props.name}>{props.name}</label>
      <input
        type={props.type}
        placeholder={props.name}
        className="border-2 px-3 py-1 rounded-lg border-zinc-700"
      />
    </div>
  )
}

export default Input
