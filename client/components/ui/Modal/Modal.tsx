import { FC, Fragment, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useOnClickOutside } from "usehooks-ts"

import { ModalProps } from "./Modal.interafce"

import { Overlay, Base, Portal } from "./Modal.styles"

const Modal: FC<ModalProps> = ({ open, onClose, children }) => {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const baseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = document.createElement("div")

    const target = document.body

    el?.classList.add("modal-root")

    el && target.appendChild(el)

    setEl(el)
    return () => {
      el && target.removeChild(el)
      setEl(null)
    }
  }, [])

  useOnClickOutside(baseRef, onClose)

  return (
    <>
      {el &&
        open &&
        createPortal(
          <Fragment>
            <Overlay />
            <Portal>
              <Base ref={baseRef}>{children}</Base>
            </Portal>
          </Fragment>,
          el
        )}
    </>
  )
}

export default Modal
