import { Comment } from "dto/types/Comments"
import { Response } from "types/default"

export const CommentsFakeData: Response<Comment[]> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: [
    {
      id: 1,
      avatar:
        "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
      username: "Test",
      content: "Comment 1",
      createdAt: new Date().toDateString()
    },
    {
      id: 2,
      avatar:
        "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
      username: "User",
      content: "Comment 2",
      createdAt: new Date().toDateString()
    },
    {
      id: 3,
      avatar:
        "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
      username: "Test",
      content: "Comment 1",
      createdAt: new Date().toDateString()
    },
    {
      id: 4,
      avatar:
        "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
      username: "User",
      content: "Comment 2",
      createdAt: new Date().toDateString()
    }
  ]
}

export const LastCommentsFakeData: Response<Comment[]> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: [
    {
      id: 1,
      avatar:
        "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
      username: "Test",
      content: "Comment 1",
      createdAt: new Date().toDateString()
    },
    {
      id: 2,
      avatar:
        "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
      username: "User",
      content: "Comment 2",
      createdAt: new Date().toDateString()
    }
  ]
}

export const CreateCommentFakeData: Response<Comment> = {
  status: 200,
  message: "Запрос выполнен",
  data: {
    id: 5,
    avatar:
      "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
    username: "User",
    content: "new comment",
    createdAt: new Date().toDateString()
  }
}
