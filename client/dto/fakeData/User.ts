import { User } from "dto/types/User"
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
