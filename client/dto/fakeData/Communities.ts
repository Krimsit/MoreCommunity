import { Community, Follow, Delete } from "dto/types/Communities"
import { Response } from "types/default"

export const TestCommunity: Community = {
  id: 1,
  avatar:
    "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
  banner:
    "https://sun9-30.userapi.com/impg/_hGpPSIUqmlbjlHS0VCO1XBE2ALgoBN3PFXxnw/ov4HNKptc70.jpg?size=2560x1707&quality=95&sign=03c776dc8006f09953e9f4161c1da217&type=album",
  name: "Homenick, Weissnat and Beier",
  description:
    "Nihil nostrum eos voluptatibus maxime nam reprehenderit. Fuga officiis perspiciatis quia et possimus voluptatem magni iure rerum. Dolorem consequatur unde quos quasi eos. Voluptatum ut dolore commodi exercitationem quis accusantium animi officiis. Maiores et totam harum unde voluptas quaerat et repudiandae tempore.",
  followers: 169,
  keywords: ["Tactics", "Infrastructure", "Florida"],
  isOwner: true
}

export const CommunitiesFakeData: Response<Community[]> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: [TestCommunity]
}

export const CommunityFakeData: Response<Community> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: TestCommunity
}

export const CommunityFollowFakeData: Response<Follow> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: {
    followed: true,
    count: 170
  }
}

export const CommunityDeleteFakeData: Response<Delete> = {
  status: 200,
  message: "Запрос успешно выполнен",
  data: true
}
