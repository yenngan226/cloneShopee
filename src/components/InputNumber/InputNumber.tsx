import { forwardRef, InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  className?: string
}

const InputNumber = forwardRef<HTMLInputElement, Props>(
  function InputNumberInner(
    {
      errorMessage,
      className,
      classNameInput = 'w-full rounded-md border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
      classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
      name,
      onChange,
      ...rest
    },
    ref
  ) {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target

      if ((/^\d+$/.test(value) || value === '') && onChange) {
        onChange(e)
      }
    }
    return (
      <div className={className}>
        <input
          {...rest}
          className={classNameInput}
          onChange={handleOnChange}
          ref={ref}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    )
  }
)

export default InputNumber
