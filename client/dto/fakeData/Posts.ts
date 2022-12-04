import { Delete, Like, Post } from "dto/types/Posts"
import { Response } from "types/default"
import { File } from "../types/Files"

export const TestPost: Post = {
  id: 1,
  title: "Что такое Lorem Ipsum?",
  content:
    '<p><strong>Lorem Ipsum</strong> - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.</p> <p>В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.</p>',
  likes: 100,
  comments: 100,
  createdAt: new Date(2022, 10, 25).toDateString(),
  isMyLike: false,
  communityId: 1
}

export const PostsFakeData: Response<Post[]> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: [TestPost]
}

export const PostFakeData: Response<Post> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: TestPost
}

export const PostLikeFakeData: Response<Like> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: {
    isMyLike: true,
    count: 101
  }
}

export const PostDeleteFakeData: Response<Delete> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: true
}

export const PostFiles: File[] = [
  {
    id: 1,
    type: "image",
    url: "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
    name: "file.test"
  },
  {
    id: 2,
    type: "video",
    url: "https://res.cloudinary.com/dwtd9mmad/video/upload/v1669663918/Metal_Wind_Chimes_at_Sunset_preview_w34nz4.mp4",
    name: "file.test"
  },
  {
    id: 3,
    type: "audio",
    url: "https://res.cloudinary.com/dwtd9mmad/video/upload/v1669664251/doom_eternal_22._The_Only_Thing_They_Fear_Is_You_rm1a7w.mp3",
    name: "file.test"
  },
  {
    id: 4,
    type: "document",
    url: "https://res.cloudinary.com/dwtd9mmad/raw/upload/v1669664404/%D0%98%D0%A1%D0%A2220-%D0%A2%D0%9F%D0%9E_2-%D0%A1%D1%83%D0%B1%D0%B1%D0%BE%D1%82%D0%B8%D0%BD_sqenes.docx",
    name: "file.test"
  },
  {
    id: 5,
    type: "image",
    url: "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
    name: "file.test"
  },
  {
    id: 6,
    type: "audio",
    url: "https://res.cloudinary.com/dwtd9mmad/video/upload/v1669664251/doom_eternal_22._The_Only_Thing_They_Fear_Is_You_rm1a7w.mp3",
    name: "file.test"
  },
  {
    id: 7,
    type: "document",
    url: "https://res.cloudinary.com/dwtd9mmad/raw/upload/v1669664404/%D0%98%D0%A1%D0%A2220-%D0%A2%D0%9F%D0%9E_2-%D0%A1%D1%83%D0%B1%D0%B1%D0%BE%D1%82%D0%B8%D0%BD_sqenes.docx",
    name: "file.test"
  }
]
