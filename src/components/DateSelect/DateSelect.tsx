import range from 'lodash/range'
import React, { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: 1,
    month: 0,
    year: 1995
  })
  useEffect(() => {
    if (value) {
      setDate({
        date: value?.getDate(),
        month: value?.getMonth(),
        year: value?.getFullYear()
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = e.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div>
      <div className='flex justify-between'>
        <select
          name='date'
          id=''
          className='h-10 w-[30%] cursor-pointer rounded-sm border border-black/10 px-1 hover:border-orangeShopee md:px-3'
          value={value?.getDate() || date.date}
          onChange={handleChange}
        >
          <option disabled value={''} hidden>
            Ngày
          </option>
          {range(1, 32).map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            )
          })}
        </select>
        <select
          name='month'
          id=''
          className='h-10 w-[30%] cursor-pointer rounded-sm border border-black/10 px-1 hover:border-orangeShopee md:px-3'
          value={value?.getMonth() || date.month}
          onChange={handleChange}
        >
          <option disabled value={''} hidden>
            Tháng
          </option>
          {range(0, 12).map((item) => {
            return (
              <option value={item} key={item}>
                {item + 1}
              </option>
            )
          })}
        </select>
        <select
          name='year'
          id=''
          className='h-10 w-[30%] cursor-pointer rounded-sm border border-black/10 px-1 hover:border-orangeShopee md:px-3'
          value={value?.getFullYear() || date.year}
          onChange={handleChange}
        >
          <option disabled value={''} hidden>
            Năm
          </option>
          {range(1920, 2024)
            .reverse()
            .map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              )
            })}
        </select>
      </div>
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>
        {errorMessage}
      </div>
    </div>
  )
}
