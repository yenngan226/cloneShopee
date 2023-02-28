import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

export interface InputNumberProps
  extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  className?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumberInner(
    {
      errorMessage,
      className,
      classNameInput = 'w-full rounded-md border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
      classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
      value = '',
      onChange,
      ...rest
    },
    ref
  ) {
    const [localValue, setLocalValue] = useState(value)
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target

      if (/^\d+$/.test(value) || value === '') {
        // thực thi onChange callback từ bên ngoài truyền vào
        onChange && onChange(e)
        //Cập nhật localValue state
        setLocalValue(value)
      }
    }
    return (
      <div className={className}>
        <input
          {...rest}
          className={classNameInput}
          onChange={handleOnChange}
          ref={ref}
          value={value || value === ' ' ? value : localValue}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    )
  }
)

export default InputNumber
