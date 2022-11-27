import { Community } from "dto/types/Communities"
import { Response } from "types/default"

export const CommunityFakeData: Community = {
  id: 3,
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
  data: [
    {
      id: 601,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Johnson, Gaylord and Brakus",
      description:
        "Inventore consequatur assumenda. Blanditiis consequuntur suscipit amet officia et aut eum. Qui sed in quia cum ipsum dolorem officia consequatur nesciunt. Quaerat eum tenetur in labore voluptatem dolores aliquam. Est ducimus quasi quis earum amet. Ullam voluptatem molestiae ipsam quaerat numquam voluptate vitae possimus.",
      followers: 364,
      keywords: ["Account", "state", "maximize"]
    },
    {
      id: 923,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Barrows Group",
      description:
        "Occaecati consequatur et consequatur voluptatibus ut nihil. At aperiam ipsum aperiam quia autem. Necessitatibus sint necessitatibus eum. Reiciendis molestiae voluptas unde cumque placeat provident voluptatem aliquid. Necessitatibus aut explicabo eos exercitationem libero. Nam eos est non labore accusamus vel aliquam ut error.",
      followers: 282,
      keywords: ["wireless", "Frozen", "Bedfordshire"],
      isStreamOnline: true
    },
    {
      id: 961,
      avatar: "http://placeimg.com/640/480",
      banner: "http://placeimg.com/640/480",
      name: "Hettinger Group",
      description:
        "Iste nemo qui. Eum omnis ipsum excepturi porro provident. Quisquam ab quia voluptatibus.",
      followers: 858,
      keywords: ["e-markets", "Ariary", "Steel"]
    }
  ]
}
