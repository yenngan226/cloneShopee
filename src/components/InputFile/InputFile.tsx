import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { config } from 'src/constant/config'

type Props = {
  onChangeInputFile: (file: File) => void
}
export default function InputFile({ onChangeInputFile }: Props) {
  const { t } = useTranslation(['header'])

  const avatarRef = useRef<HTMLInputElement>(null)
  const handleUploadImg = () => {
    avatarRef.current?.click()
  }
  const onChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileLocal = e.target.files?.[0]
    if (
      (fileLocal && fileLocal?.size > config.maxImgFileSize) ||
      !fileLocal?.type.includes('image')
    ) {
      toast.error('Kích thước file tối đa 1MB.Định dạng file: .JPEG,.PNG')
    } else {
      onChangeInputFile(fileLocal)
    }
  }
  return (
    <>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png'
        id=''
        ref={avatarRef}
        onChange={onChangeImg}
        onClick={(event) => {
          ;(event.target as any).value = null
        }}
      />
      <button
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm hover:shadow-md'
        onClick={handleUploadImg}
      >
        {t('header:upload')}
      </button>
    </>
  )
}
