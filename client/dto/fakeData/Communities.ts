import { Community, Follow } from "dto/types/Communities"
import { Response } from "types/default"

export const TestCommunity: Community = {
  id: 1,
  avatar: "https://placeimg.com/640/480",
  banner: "https://placeimg.com/640/480",
  name: "Homenick, Weissnat and Beier",
  description:
    "Nihil nostrum eos voluptatibus maxime nam reprehenderit. Fuga officiis perspiciatis quia et possimus voluptatem magni iure rerum. Dolorem consequatur unde quos quasi eos. Voluptatum ut dolore commodi exercitationem quis accusantium animi officiis. Maiores et totam harum unde voluptas quaerat et repudiandae tempore.",
  followers: 169,
  keywords: ["Tactics", "Infrastructure", "Florida"]
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
