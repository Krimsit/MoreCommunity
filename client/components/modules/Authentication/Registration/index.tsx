import { FC, useState } from "react"
import * as yup from "yup"
import { UseFormReturn } from "react-hook-form"

import { useUpload } from "dto/hooks/Files"
import { useRegistration } from "dto/hooks/Authentication"

import { Form, Upload, Avatar, UploadFileProps } from "@ui"
import { MdSend, MdUpload } from "react-icons/md"

import { RegistrationData } from "dto/types/Authentication"

import {
  Fields,
  Title,
  Input,
  Controls,
  Question,
  SendButton
} from "../Authentication.styles"

const validationSchema = yup.object().shape({
  username: yup.string().required("Введите логин!"),
  password: yup.string().required("Введите пароль!")
})

const Authorization: FC<{
  changeForm: (type: "authorization" | "registration") => void
}> = ({ changeForm }) => {
  const { mutateAsync: upload, status: uploadingStatus } = useUpload()
  const { mutateAsync: registration, status: registrationStatus } =
    useRegistration()

  const [formMethods, setFormMethods] = useState<UseFormReturn | null>(null)
  const [avatarImage, setAvatarImage] = useState<string>("")

  const onSubmit = async (
    values: Omit<RegistrationData, "avatar"> & { avatar: UploadFileProps[] }
  ) => {
    let _avatar: string | null = null

    await upload({
      ...values.avatar[0],
      folder: `communities/avatar`
    }).then((result) => {
      _avatar = result.url
    })

    const _data: RegistrationData = {
      ...values,
      avatar: _avatar || ""
    }

    registration(_data).catch((error: { [key: string]: string }) => {
      Object.keys(error).forEach((key) => {
        formMethods?.setError(key, { type: "custom", message: error[key] })
      })
    })
  }

  return (
    <>
      <Title>Регистрация</Title>
      <Form
        yupSchema={validationSchema}
        onSubmit={onSubmit}
        onInit={setFormMethods}>
        <Fields>
          <Form.FormField name="avatar">
            <Upload
              onChange={(files) => setAvatarImage(files[0].thumbUrl)}
              styleType="dark"
              button={
                <Avatar
                  img={avatarImage}
                  alt="Аватарка пользователя"
                  styleType="dark"
                  noImageContent={<MdUpload fontSize={42} />}
                  overflowContent={<MdUpload fontSize={42} />}
                  loading={uploadingStatus === "loading"}
                />
              }
            />
          </Form.FormField>
          <Form.FormField name="username">
            <Input placeholder="Логин" autoComplete={false} />
          </Form.FormField>
          <Form.FormField name="email">
            <Input placeholder="Почта" autoComplete={false} />
          </Form.FormField>
          <Form.FormField name="password">
            <Input type="password" placeholder="Пароль" autoComplete={false} />
          </Form.FormField>
        </Fields>
        <Controls>
          <SendButton
            type="submit"
            styleType="dark"
            loading={registrationStatus === "loading"}>
            Зарегестрироваться
            <MdSend />
          </SendButton>
          <Question>
            У вас уже есть аккаунт?
            <span onClick={() => changeForm("authorization")}>
              Войти в аккаунт
            </span>
          </Question>
        </Controls>
      </Form>
    </>
  )
}

export default Authorization
