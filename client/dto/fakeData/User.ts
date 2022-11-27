import { User } from "dto/types/User"
import { Community } from "dto/types/Communities"
import { Response } from "types/default"

export const UserFakeData: Response<User | null> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: {
    avatar:
      "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
    username: "Test",
    email: "test@test.com"
  }
}

export const UserMyCommunitiesFakeData: Response<Community[]> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: [
    {
      id: 795,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Ernser LLC",
      description:
        "Deserunt expedita dolorum voluptates. Impedit beatae quia molestiae culpa similique sint est inventore. Voluptatem officia quidem iusto nisi quasi culpa ut veniam. Eos voluptas excepturi. Qui eius maiores quod. Sint consequuntur unde ut dolor est sequi ex dolores.",
      followers: 176,
      keywords: ["Account", "Gorgeous", "Metal"]
    },
    {
      id: 600,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Stanton Group",
      description:
        "Quaerat beatae cum minus. Unde qui consequatur voluptatem quos quo sit omnis. Vel expedita quos.",
      followers: 716,
      keywords: ["installation", "Account", "Tuna"],
      isStreamOnline: true
    }
  ]
}

export const UserFollowedCommunitiesFakeData: Response<Community[]> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: [
    {
      id: 795,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Ernser LLC",
      description:
        "Deserunt expedita dolorum voluptates. Impedit beatae quia molestiae culpa similique sint est inventore. Voluptatem officia quidem iusto nisi quasi culpa ut veniam. Eos voluptas excepturi. Qui eius maiores quod. Sint consequuntur unde ut dolor est sequi ex dolores.",
      followers: 176,
      keywords: ["Account", "Gorgeous", "Metal"],
      isMyLike: true
    },
    {
      id: 600,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Stanton Group",
      description:
        "Quaerat beatae cum minus. Unde qui consequatur voluptatem quos quo sit omnis. Vel expedita quos.",
      followers: 716,
      keywords: ["installation", "Account", "Tuna"],
      isStreamOnline: true,
      isMyLike: true
    },
    {
      id: 620,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Stanton Group",
      description:
        "Quaerat beatae cum minus. Unde qui consequatur voluptatem quos quo sit omnis. Vel expedita quos.",
      followers: 716,
      keywords: ["installation", "Account", "Tuna"],
      isMyLike: true
    }
  ]
}
