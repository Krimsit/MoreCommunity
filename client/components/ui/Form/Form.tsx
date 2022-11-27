import { FC, cloneElement, useEffect, ChangeEvent, ReactElement } from "react"
import classNames from "classnames"
import {
  useForm,
  Controller,
  useFormContext,
  FormProvider
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { FormProps, FormFieldProps } from "./Form.interface"

import {
  FormContainer,
  Field,
  FieldLabel,
  FieldController,
  FieldDescription
} from "./Form.styles"

const isEmpty = (value: any): boolean => {
  switch (value) {
    case "":
    case null:
    case undefined:
      return true
    default:
      return false
  }
}

const FormField: FC<FormFieldProps> = ({
  name,
  children,
  label,
  description
}) => {
  const {
    control,
    getValues,
    formState: { errors }
  } = useFormContext()
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}
      <FieldController>
        <Controller
          control={control && control}
          name={name}
          render={({ field }) => {
            const child = children as ReactElement<any>

            return cloneElement(child, {
              ...field,
              validation: {
                type: errors[name]
                  ? "error"
                  : !isEmpty(getValues(name)) && "success",
                message: errors[name]?.message
              },
              onChange: (event: ChangeEvent) => {
                field.onChange(event)
                child?.props.onChange && child.props.onChange(event)
              }
            })
          }}
        />
      </FieldController>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

const Form: FC<FormProps> = ({
  children,
  onSubmit,
  shouldFocusError = true,
  validationMode = "onChange",
  defaultValues,
  className,
  name,
  yupSchema
}) => {
  const method = useForm({
    mode: validationMode,
    shouldFocusError: shouldFocusError,
    defaultValues: defaultValues,
    resolver: yupSchema && yupResolver(yupSchema)
  })

  const { handleSubmit, reset } = method

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <FormProvider {...method}>
      <FormContainer
        onSubmit={onSubmit && handleSubmit(onSubmit)}
        name={name}
        className={classNames("form", {
          [`${className}`]: !!className
        })}>
        {children}
      </FormContainer>
    </FormProvider>
  )
}

export { FormField }

export default Form
