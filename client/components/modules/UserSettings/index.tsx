import { FC, useState, useEffect } from "react"
import { useRouter } from "next/router"
import * as yup from "yup"
import { UseFormReturn } from "react-hook-form"

import { useSettings, useUpdate, useDelete } from "dto/hooks/User"
import { useUpload } from "dto/hooks/Files"

import { Modal, Upload, UploadFileProps } from "@ui"
import { QueryWrapper } from "@container"
import { MdDelete, MdUpload, MdLogout } from "react-icons/md"

import { Settings } from "dto/types/User"
import { UserSettingsProps, InitialValues } from "./UserSettings.interface"

import {
  Base,
  Title,
  Form,
  Input,
  Avatar,
  Controls,
  SendButton,
  LogoutButton,
  DeleteButton
} from "./UserSettings.styles"

const validationSchema = yup.object().shape({
  avatar: yup.array().length(1, "Загрузите аватарку!"),
  username: yup.string().required("Введите логин!"),
  email: yup
    .string()
    .email("Введите корректный e-mail")
    .required("Введите e-mail"),
  password: yup.string().required("Введите пароль!")
})

const UserSettings: FC<UserSettingsProps> = ({ open, onClose, userId }) => {
  const router = useRouter()

  const { data: settings, status: settingsStatus } = useSettings(userId)
  const { mutateAsync: upload, status: uploadStatus } = useUpload()
  const { mutateAsync: updateUser, status: updateStatus } = useUpdate(userId)
  const { mutateAsync: deleteUser, status: deleteStatus } = useDelete(userId)

  const [formMethods, setFormMethods] = useState<UseFormReturn | null>(null)
  const [initialValues, setInitialValues] = useState<InitialValues | null>(null)
  const [avatarImage, setAvatarImage] = useState<string>("")

  const handleSubmit = async (
    values: Omit<Settings, "avatar"> & { avatar: UploadFileProps[] | string }
  ) => {
    let _avatar: string | null = null

    if (typeof values.avatar !== "string") {
      await upload({
        ...values.avatar[0],
        folder: `users/${values.username}`
      }).then((result) => {
        _avatar = result.url
      })
    } else {
      _avatar = values.avatar
    }

    const _data: Settings = {
      ...values,
      avatar: _avatar || ""
    }

    updateUser(_data)
      .then(() => {
        router.reload()
      })
      .catch((error: { [key: string]: string }) => {
        Object.keys(error).forEach((key) => {
          formMethods?.setError(key, { type: "custom", message: error[key] })
        })
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem("token")
    router.reload()
  }

  const handleDelete = () =>
    deleteStatus !== "loading" && deleteUser().then(() => handleLogout())

  useEffect(() => {
    if (settings) {
      const _initialValues: InitialValues = {
        ...settings,
        avatar: [
          {
            id: 1,
            type: "image",
            name: "avatar",
            url: settings.avatar || ""
          }
        ]
      }

      setAvatarImage(settings.avatar || "")
      setInitialValues(_initialValues)
    }
  }, [settings])

  return (
    <Modal open={open} onClose={onClose}>
      <Base>
        <Title>Настройки аккаунта</Title>
        <QueryWrapper status={settingsStatus}>
          <Form
            defaultValues={initialValues}
            yupSchema={validationSchema}
            onSubmit={handleSubmit}
            onInit={setFormMethods}>
            <Form.FormField name="avatar">
              <Upload
                onChange={(files) => setAvatarImage(files[0].thumbUrl)}
                styleType="dark"
                button={
                  <Avatar
                    img={avatarImage}
                    alt="Аватарка"
                    styleType="dark"
                    noImageContent={<MdUpload fontSize={42} />}
                    overflowContent={<MdUpload fontSize={42} />}
                  />
                }
              />
            </Form.FormField>
            <Form.FormField name="username">
              <Input type="text" placeholder="Введите ваш логин" />
            </Form.FormField>
            <Form.FormField name="email">
              <Input type="email" placeholder="Введите вашу почту" />
            </Form.FormField>
            <Form.FormField name="password">
              <Input type="password" placeholder="Введите новый пароль" />
            </Form.FormField>
            <Controls>
              <SendButton
                type="submit"
                styleType="dark"
                loading={
                  updateStatus === "loading" || uploadStatus === "loading"
                }>
                Обновить
              </SendButton>
              <LogoutButton onClick={handleLogout}>
                <MdLogout />
              </LogoutButton>
              <DeleteButton onClick={handleDelete}>
                <QueryWrapper status={deleteStatus} loaderSize="1em">
                  <MdDelete />
                </QueryWrapper>
              </DeleteButton>
            </Controls>
          </Form>
        </QueryWrapper>
      </Base>
    </Modal>
  )
}

export default UserSettings
