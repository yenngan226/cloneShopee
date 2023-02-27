import React, { useState } from 'react'
import InputNumber, { InputNumberProps } from '../InputNumber'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  value = 0,
  onFocusOut,
  classNameWrapper = 'ml-6',
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState(Number(value))
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = Number(e.target.value)
    if (max !== undefined && inputValue > max) {
      inputValue = max
    } else if (inputValue < 0) {
      inputValue = 1
    }
    onType && onType(inputValue)
    setLocalValue(inputValue)
  }
  const increase = () => {
    let inputValue = Number(value || localValue) + 1
    if (max !== undefined && inputValue > max) {
      inputValue = max
    }
    onIncrease && onIncrease(inputValue)
    setLocalValue(inputValue)
  }
  const decrease = () => {
    let inputValue = Number(value || localValue) - 1
    if (inputValue < 1) {
      inputValue = 1
    }
    onDecrease && onDecrease(inputValue)
    setLocalValue(inputValue)
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(e.target.value))
  }
  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button
        onClick={decrease}
        className=' flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-100 text-gray-600'
      >
        -
      </button>
      <InputNumber
        value={value || localValue}
        classNameError='hidden'
        classNameInput='border-gray-100 h-8 w-12 border-t border-b text-center outline-none'
        onChange={handleOnChange}
        {...rest}
        onBlur={handleBlur}
      />
      <button
        onClick={increase}
        className=' flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-100 text-gray-600'
      >
        +
      </button>
    </div>
  )
}
