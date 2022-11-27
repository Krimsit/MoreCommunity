import { ChangeEvent, FC, useState } from "react"

import { InputProps } from "./Input.interface"

import { Base, Field } from "./Input.styles"

const Input: FC<InputProps> = ({
  name,
  prefix,
  type,
  value,
  onChange,
  disable,
  placeholder,
  className,
  styleType = "light"
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value || "")

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disable) {
      setCurrentValue(e.target.value)
      onChange && onChange(e.target.value)
    }
  }

  return (
    <>
      <Base styleType={styleType} className={className}>
        {!!prefix && prefix}
        <Field
          name={name}
          type={type}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          disabled={disable}
        />
      </Base>
    </>
  )
}

export default Input
