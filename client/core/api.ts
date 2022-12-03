import axios from "axios"
import MockAdapter from "axios-mock-adapter"

import { AuthenticationFakeData } from "dto/fakeData/Authentication"
import {
  UserFakeData,
  UserSettingsFakeData,
  UserDeleteFakeData,
  UserMyCommunitiesFakeData,
  UserFollowedCommunitiesFakeData
} from "dto/fakeData/User"
import {
  PostsFakeData,
  PostFakeData,
  PostLikeFakeData
} from "dto/fakeData/Posts"
import {
  CommunitiesFakeData,
  CommunityFakeData,
  CommunityFollowFakeData,
  CommunityDeleteFakeData
} from "dto/fakeData/Communities"
import {
  LastCommentsFakeData,
  CommentsFakeData,
  CreateCommentFakeData
} from "dto/fakeData/Comments"
import { FilesFakeData, FileUploadFakeData } from "dto/fakeData/Files"

const axiosConfig = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    "Access-Control-Allow-Origin": `*`,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "application/json",
    Authorization:
      process.browser &&
      localStorage.getItem("token") &&
      `Bearer ${localStorage.getItem("token")}`
  }
})

const fakeApi = new MockAdapter(axiosConfig, { delayResponse: 1000 })

// Fake API для аутентификации
fakeApi.onPost("/authentication/login").reply(200, AuthenticationFakeData)
fakeApi
  .onPost("/authentication/registration")
  .reply(200, AuthenticationFakeData)

// Fake API для данных пользователя
fakeApi.onGet("/user").reply(200, UserFakeData)
fakeApi.onGet("/user/test_user_id/settings").reply(200, UserSettingsFakeData)
fakeApi.onPut("/user/test_user_id").reply(200, UserFakeData)
fakeApi.onDelete("/user/test_user_id").reply(200, UserDeleteFakeData)
fakeApi.onGet("/user").reply(200, UserFakeData)
fakeApi.onGet("/user/my-communities").reply(200, UserMyCommunitiesFakeData)
fakeApi
  .onGet("/user/followed-communities")
  .reply(200, UserFollowedCommunitiesFakeData)

// Fake API для сообществ
fakeApi.onGet("/communities").reply(200, CommunitiesFakeData) // Получение список всех сообществ
fakeApi.onPost("/communities").reply(200, CommunityFakeData) // Создание сообщество
fakeApi.onGet("/communities/1").reply(200, CommunityFakeData) // Получение сообщеста по ID
fakeApi.onPut("/communities/1").reply(200, CommunityFakeData) // Обновление сообщества
fakeApi.onDelete("/communities/1").reply(200, CommunityDeleteFakeData) // Удаление сообщества
fakeApi.onPost("/communities/1/follow").reply(200, CommunityFollowFakeData) // Подписка / отписка от сообщества
fakeApi.onGet("/communities/popular").reply(200, CommunitiesFakeData) // Получение списка популярных сообществ

// Fake API для постов
fakeApi.onGet("/communities/1/posts").reply(200, PostsFakeData)
fakeApi.onGet("/communities/1/posts/1").reply(200, PostFakeData)
fakeApi.onPost("/communities/1/posts/1/like").reply(200, PostLikeFakeData)

// Fake API для комментариев
fakeApi.onGet("/communities/1/posts/1/comments").reply(200, CommentsFakeData)
fakeApi
  .onGet("/communities/1/posts/1/comments/last")
  .reply(200, LastCommentsFakeData)
fakeApi
  .onPost("/communities/1/posts/1/comments")
  .reply(204, CreateCommentFakeData)

// Fake APO для файлов
fakeApi.onGet("/files/1").reply(200, FilesFakeData)
fakeApi.onPost("/files").reply(200, FileUploadFakeData)

if (process.env.NODE_ENV === "production") {
  fakeApi.restore()
}

export default axiosConfig
