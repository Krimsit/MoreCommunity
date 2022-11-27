import { ReactNode } from "react"

export interface FormFieldProps {
  name: string
  label?: string
  description?: ReactNode
  children: ReactNode
}

export interface FormProps {
  validationMode?: "onBlur" | "onChange" | "onSubmit" | "onTouched"
  shouldFocusError?: boolean
  onSubmit?: (data: any) => void
  defaultValues?: any
  className?: string
  name?: string
  yupSchema?: any
  children?: ReactNode
}
