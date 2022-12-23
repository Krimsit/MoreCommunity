import { FC, useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { useUpload } from "dto/hooks/Files"
import { useCreate, useUpdate } from "dto/hooks/Posts"

import { Button, Modal, Upload, UploadFileProps } from "@ui"
import { MdUpload } from "react-icons/md"

import { PostPost } from "dto/types/Posts"
import { CreatePostProps } from "./PostSettings.interface"

import { Base, Form, Input, Textarea, Title } from "./PostSettings.styles"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  title: yup.string().required("Введите заголовок!"),
  content: yup.string().required("Введите содержание!")
})

const CreatePost: FC<CreatePostProps> = ({
  open,
  onClose,
  initialValues,
  communityId,
  postId,
  communityName,
  onSuccess
}) => {
  const { mutate: upload, status: uploadStatus } = useUpload()
  const { mutateAsync: create, status: createStatus } = useCreate(communityId)
  const { mutateAsync: update, status: updateStatus } = useUpdate(
    communityId,
    postId || 0
  )

  const [formMethods, setFormMethods] = useState<UseFormReturn | null>(null)

  const handleUploadFiles = (id: number, files?: UploadFileProps[]) =>
    new Promise((resolve) => {
      if (files?.length) {
        files.forEach((file) => {
          upload({
            ...file,
            folder: `communities/${communityName}/posts_${id}`,
            postId: id
          })
        })
      }
    })

  const handleSubmit = async (
    values: PostPost & { files?: UploadFileProps[] }
  ) => {
    const _data: PostPost = {
      title: values.title,
      content: values.content
    }

    postId
      ? update(_data)
          .then((post) =>
            handleUploadFiles(post.id, values.files).then(() => onSuccess())
          )
          .catch((error: { [key: string]: string }) => {
            Object.keys(error).forEach((key) => {
              formMethods?.setError(key, {
                type: "custom",
                message: error[key]
              })
            })
          })
      : create(_data)
          .then((post) =>
            handleUploadFiles(post.id, values.files).then(() => onSuccess())
          )
          .catch((error: { [key: string]: string }) => {
            Object.keys(error).forEach((key) => {
              formMethods?.setError(key, {
                type: "custom",
                message: error[key]
              })
            })
          })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Base>
        <Title>
          {initialValues ? "Редактирование поста" : "Создание поста"}
        </Title>
        <Form
          defaultValues={initialValues}
          yupSchema={validationSchema}
          onSubmit={handleSubmit}
          onInit={setFormMethods}>
          <Form.FormField name="title">
            <Input placeholder="Введите заголовок" />
          </Form.FormField>
          <Form.FormField name="content">
            <Textarea placeholder="Введите контент" />
          </Form.FormField>
          <Form.FormField name="files">
            <Upload
              styleType="dark"
              button={
                <Button styleType="dark">
                  <MdUpload />
                  Прикрепить файлы
                </Button>
              }
              withPreviews
            />
          </Form.FormField>
          <Button
            type="submit"
            styleType="dark"
            loading={
              uploadStatus === "loading" ||
              createStatus === "loading" ||
              updateStatus === "loading"
            }>
            {initialValues ? "Обновить" : "Создать"}
          </Button>
        </Form>
      </Base>
    </Modal>
  )
}

export default CreatePost
