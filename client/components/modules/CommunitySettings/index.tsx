import { FC, useEffect, useState } from "react"
import { v4 as uuid } from "uuid"
import { UseFormReturn } from "react-hook-form"
import * as yup from "yup"

import { useUpload } from "dto/hooks/Files"
import { useById, useCreate, useDelete, useUpdate } from "dto/hooks/Communities"

import { Modal, Tag, Upload, UploadFileProps } from "@ui"
import { QueryWrapper } from "@container"
import { MdDelete, MdUpload } from "react-icons/md"

import { PostCommunity } from "dto/types/Communities"
import {
  CreateCommunityProps,
  InitialValues
} from "./CommunitySettings.interface"

import {
  Avatar,
  Banner,
  BannerImage,
  Base,
  Controls,
  DeleteButton,
  Form,
  Input,
  Keywords,
  KeywordsField,
  KeywordsFieldAdd,
  SendButton,
  Textarea,
  Title
} from "./CommunitySettings.styles"
import { Description as InputError } from "components/ui/Input/Input.styles"

const validationSchema = yup.object().shape({
  avatar: yup.array().length(1, "Загрузите аватарку!"),
  banner: yup.array().length(1, "Загрузите баннер!"),
  name: yup.string().required("Введите имя!"),
  description: yup.string().required("Введите описание!"),
  keywords: yup.array().min(1, "Введите хотя бы одно ключевое слово!")
})

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>
      resolve(reader?.result ? reader.result.toString() : "")
    reader.onerror = (error) => reject(error)
  })

const CreateCommunity: FC<CreateCommunityProps> = ({
  open,
  onClose,
  communityId,
  onSuccess,
  onDelete
}) => {
  const { data: community, status: communityStatus } = useById(communityId || 0)
  const { mutateAsync: upload, status: uploadStatus } = useUpload()
  const { mutateAsync: createCommunity, status: createStatus } = useCreate()
  const { mutateAsync: updateCommunity, status: updateStatus } = useUpdate(
    communityId || 0
  )
  const { mutateAsync: deleteCommunity, status: deleteStatus } = useDelete(
    communityId || 0
  )

  const [formMethods, setFormMethods] = useState<UseFormReturn | null>(null)
  const [initialValues, setInitialValues] = useState<InitialValues | null>(null)
  const [avatarImage, setAvatarImage] = useState<string>("")
  const [bannerImage, setBannerImage] = useState<string>("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordValue, setKeywordValue] = useState<string>("")
  const [keywordsError, setKeywordsError] = useState<string>("")

  const handleClose = () => {
    onClose()
    setKeywords([])
    setKeywordValue("")
    formMethods?.reset()
  }

  const handleSubmit = async (
    values: Omit<PostCommunity, "keywords" | "avatar" | "banner"> & {
      avatar: UploadFileProps[] | string
      banner: UploadFileProps[] | string
    }
  ) => {
    let _avatar: string | null = null
    let _banner: string | null = null

    if (typeof values.avatar !== "string") {
      await upload({
        folder: `communities/avatars/${values.name}`,
        file: await toBase64(values.avatar[0].originalFile),
        name: values.avatar[0].name,
        type: values.avatar[0].type
      }).then((result) => {
        _avatar = result.url
      })
    } else {
      _avatar = values.avatar
    }

    if (typeof values.banner !== "string") {
      await upload({
        folder: `communities/banners/${values.name}`,
        file: await toBase64(values.banner[0].originalFile),
        name: values.banner[0].name,
        type: values.banner[0].type
      }).then((result) => {
        _banner = result.url
      })
    } else {
      _banner = values.banner
    }

    !communityId && delete values.id

    const _data: PostCommunity = {
      ...values,
      avatar: _avatar || "",
      banner: _banner || "",
      keywords: keywords
    }

    communityId
      ? updateCommunity(_data)
          .then((community) => onSuccess && onSuccess(community))
          .catch((error: { [key: string]: string }) => {
            Object.keys(error).forEach((key) => {
              formMethods?.setError(key, {
                type: "custom",
                message: error[key]
              })
            })
          })
      : createCommunity(_data)
          .then((community) => onSuccess && onSuccess(community))
          .catch((error: { [key: string]: string }) => {
            Object.keys(error).forEach((key) => {
              formMethods?.setError(key, {
                type: "custom",
                message: error[key]
              })
            })
          })
  }

  const handleDelete = () =>
    deleteStatus !== "loading" &&
    deleteCommunity().then(() => onDelete && onDelete(communityId as number))

  const handleChangeKeyword = (value: string) => {
    setKeywordValue(value)
  }

  const handleAddKeyword = () => {
    if (keywordValue) {
      setKeywords([...keywords, keywordValue])
      setKeywordValue("")
    }
  }

  useEffect(() => {
    if (communityId && community) {
      const _initialValues: InitialValues = {
        ...community,
        avatar: [
          {
            id: 1,
            type: "image",
            name: "avatar",
            url: community.avatar
          }
        ],
        banner: [
          {
            id: 1,
            type: "image",
            name: "banner",
            url: community.banner || ""
          }
        ],
        keywords: community.keywords
      }

      setAvatarImage(community.avatar)
      setBannerImage(community.banner || "")
      setKeywords(community.keywords)
      setInitialValues(_initialValues)
    }
  }, [community, communityId])

  useEffect(() => {
    formMethods?.formState.errors.keywords &&
      setKeywordsError(
        formMethods?.formState?.errors?.keywords?.message as string
      )
  }, [formMethods?.formState.errors])

  return (
    <Modal open={open} onClose={handleClose}>
      <Base>
        <Title>
          {initialValues ? "Редактирование сообщества" : "Создание сообщества"}
        </Title>
        <QueryWrapper status={communityId ? communityStatus : "success"}>
          <Form
            defaultValues={initialValues || {}}
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
                    alt="Аватарка сообщества"
                    styleType="dark"
                    noImageContent={<MdUpload fontSize={42} />}
                    overflowContent={<MdUpload fontSize={42} />}
                  />
                }
              />
            </Form.FormField>
            <Form.FormField name="banner">
              <Upload
                onChange={(files) => setBannerImage(files[0].thumbUrl)}
                styleType="dark"
                button={
                  <Banner>
                    {bannerImage ? (
                      <BannerImage src={bannerImage} alt="Баннер сообщества" />
                    ) : (
                      <>
                        <MdUpload fontSize={42} />
                      </>
                    )}
                    <span>
                      <MdUpload fontSize={42} />
                    </span>
                  </Banner>
                }
              />
            </Form.FormField>
            <Form.FormField name="name">
              <Input placeholder="Введите название" />
            </Form.FormField>
            <Form.FormField name="description">
              <Textarea placeholder="Введите описание" />
            </Form.FormField>
            <>
              <KeywordsField>
                <Input
                  placeholder="Введите ключевое слово"
                  value={keywordValue}
                  onChange={handleChangeKeyword}
                />
                <KeywordsFieldAdd onClick={handleAddKeyword}>
                  +
                </KeywordsFieldAdd>
              </KeywordsField>
              <Keywords>
                {keywords.map((item) => (
                  <Tag key={uuid()} styleType="dark">
                    {item}
                  </Tag>
                ))}
              </Keywords>
              {keywordsError && (
                <InputError type="error">{keywordsError}</InputError>
              )}
            </>
            <Controls>
              <SendButton
                type="submit"
                styleType="dark"
                loading={
                  uploadStatus === "loading" ||
                  createStatus === "loading" ||
                  updateStatus === "loading"
                }>
                {initialValues ? "Обновить" : "Создать"}
              </SendButton>
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

export default CreateCommunity
