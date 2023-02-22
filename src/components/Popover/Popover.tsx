import React, { ElementType, useId, useRef, useState } from 'react'
import { useFloating, FloatingPortal, arrow, shift, offset, Placement } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}

export default function Popover({
  className,
  renderPopover,
  placement,
  children,
  as: Element = 'div',
  initialOpen
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const { x, y, strategy, refs, middlewareData } = useFloating({
    placement: placement,
    middleware: [
      offset(6),
      shift(),
      arrow({
        element: arrowRef
      })
    ]
  })
  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element className={className}>
      <div
        ref={refs.setReference}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        className=' mr-5 flex cursor-pointer items-center justify-center py-1 text-white hover:text-gray-300'
      >
        {children}
        <FloatingPortal id={id}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
                initial={{ opacity: 0, transform: 'scale(0)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0)' }}
                transition={{ duration: 0.2 }}
              >
                <span
                  ref={arrowRef}
                  style={{
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                  className='absolute z-10 -translate-y-[95%] border-[0.8rem] border-x-transparent border-y-transparent border-b-white'
                ></span>
                {renderPopover}
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </div>
    </Element>
  )
}
