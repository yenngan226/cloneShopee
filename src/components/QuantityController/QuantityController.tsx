import React from 'react'
import InputNumber, { InputNumberProps } from '../InputNumber'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  value,
  classNameWrapper = 'ml-6',
  ...rest
}: Props) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = Number(e.target.value)
    if (max !== undefined && inputValue > max) {
      inputValue = max
    } else if (inputValue < 0) {
      inputValue = 1
    }
    onType && onType(inputValue)
  }
  const increase = () => {
    let inputValue = Number(value) + 1
    if (max !== undefined && inputValue > max) {
      inputValue = max
    }
    onIncrease && onIncrease(inputValue)
  }
  const decrease = () => {
    let inputValue = Number(value) - 1
    if (inputValue < 1) {
      inputValue = 1
    }
    onDecrease && onDecrease(inputValue)
  }
  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button
        onClick={decrease}
        className=' flex h-7 w-7 items-center justify-center rounded-l-sm border border-gray-100 text-gray-600'
      >
        -
      </button>
      <InputNumber
        value={value}
        classNameError='hidden'
        classNameInput='border-gray-100 h-7 w-14 border-t border-b text-center outline-none'
        onChange={handleOnChange}
        {...rest}
      />
      <button
        onClick={increase}
        className=' flex h-7 w-7 items-center justify-center rounded-r-sm border border-gray-100 text-gray-600'
      >
        +
      </button>
    </div>
  )
}
