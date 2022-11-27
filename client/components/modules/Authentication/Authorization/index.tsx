import { FC } from "react"
import * as yup from "yup"

import { useLogin } from "dto/hooks/Authentication"

import { Form, Button } from "@ui"
import { MdSend } from "react-icons/md"

import { AuthorizationData } from "dto/types/Authentication"

import {
  Fields,
  Title,
  Input,
  Controls,
  Question
} from "../Authentication.styles"

const validationSchema = yup.object().shape({
  username: yup.string().required("Введите логин!"),
  password: yup.string().required("Введите пароль!")
})

const Authorization: FC<{
  changeForm: (type: "authorization" | "registration") => void
}> = ({ changeForm }) => {
  const { mutate } = useLogin()

  const onSubmit = (data: AuthorizationData) => mutate(data)

  return (
    <>
      <Title>Авторизация</Title>
      <Form yupSchema={validationSchema} onSubmit={onSubmit}>
        <Fields>
          <Form.FormField name="username">
            <Input placeholder="Логин" autoComplete={false} />
          </Form.FormField>
          <Form.FormField name="password">
            <Input type="password" placeholder="Пароль" autoComplete={false} />
          </Form.FormField>
        </Fields>
        <Controls>
          <Button type="submit" styleType="dark">
            Отправить
            <MdSend />
          </Button>
          <Question>
            У вас нет аккаунта?
            <span onClick={() => changeForm("registration")}>
              Зарегестрироваться
            </span>
          </Question>
        </Controls>
      </Form>
    </>
  )
}

export default Authorization
