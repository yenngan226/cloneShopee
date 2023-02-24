import { InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  className?: string

  register?: UseFormRegister<any>
  autoComplete?: string
}

export default function Input({
  errorMessage,
  className,
  classNameInput = 'w-full rounded-md border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  register,
  name,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name) : {}
  return (
    <div className={className}>
      <input {...rest} className={classNameInput} {...registerResult} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
