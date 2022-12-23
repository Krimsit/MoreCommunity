import { FC, useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { useUploadPostFiles } from "dto/hooks/Files"
import { useCreate, useUpdate } from "dto/hooks/Posts"

import { Button, Modal, Upload, UploadFileProps } from "@ui"
import { MdUpload } from "react-icons/md"

import { PostPost } from "dto/types/Posts"
import { CreatePostProps } from "./PostSettings.interface"

import { Base, Form, Input, Textarea, Title } from "./PostSettings.styles"
import * as yup from "yup"
import { PayloadFile } from "../../../dto/types/Files"

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>
      resolve(reader?.result ? reader.result.toString() : "")
    reader.onerror = (error) => reject(error)
  })

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
  onSuccess
}) => {
  const { mutateAsync: upload, status: uploadStatus } = useUploadPostFiles()
  const { mutateAsync: create, status: createStatus } = useCreate(communityId)
  const { mutateAsync: update, status: updateStatus } = useUpdate(
    communityId,
    postId || 0
  )

  const [formMethods, setFormMethods] = useState<UseFormReturn | null>(null)

  const handleUploadFiles = async (
    id: number,
    files: UploadFileProps[] = []
  ) => {
    const _files: PayloadFile[] = await Promise.all(
      files.map(async (item) => {
        return {
          file: await toBase64(item.originalFile),
          type: item.type,
          name: item.name
        }
      })
    )

    return new Promise((resolve) => {
      upload({
        postId: id,
        folder: `posts/community_${communityId}/post_${id}`,
        files: _files
      }).then(() => resolve(true))
    })
  }

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
