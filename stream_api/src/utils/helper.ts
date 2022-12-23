import { Request } from "express"

export const verifyToken = (token: string) => token ? token.split(' ')[1] : ""

export const parseJwt = (token: string) => token ? JSON.parse(atob(token.split('.')[1])) : ""

export const getUserIdFromToken = (req: Request) => {
  const jwt = parseJwt(verifyToken(req.headers['authorization'] || ""))

  const jwtKeys = Object.keys(jwt)

  return jwt[jwtKeys[0]]
}
