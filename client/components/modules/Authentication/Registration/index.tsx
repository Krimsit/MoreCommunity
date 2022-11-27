import { FC } from "react"
import * as yup from "yup"

import { Form, Button } from "@ui"
import { MdSend } from "react-icons/md"

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
  const onSubmit = (data: any) => console.log(data)

  return (
    <>
      <Title>Регистрация</Title>
      <Form yupSchema={validationSchema} onSubmit={onSubmit}>
        <Fields>
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
          <Button type="submit" styleType="dark">
            Зарегестрироваться
            <MdSend />
          </Button>
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
