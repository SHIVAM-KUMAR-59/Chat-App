import React from 'react'
import Input from '../Components/Input'
import Button from '../Components/Button'

const Auth = () => {
  return (
    <section>
      <div className="flex flex-col items-center w-full lg:w-[30%] mx-auto lg:mt-40">
        <form
          action=""
          className="flex flex-col gap-4 items-center justify-center border-2 border-black w-full"
        >
          <Input name="Username" type="text" />
          <Input name="Email" type="email" />
          <Input name="Password" type="password" />
          <Button name="Register" />
          <Button name="Login" />
        </form>
      </div>
    </section>
  )
}

export default Auth
