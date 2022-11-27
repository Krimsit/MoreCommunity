import { useRouter } from "next/router"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

import authenticationAPI from "dto/api/AuthenticationAPI"

import {
  AuthorizationData,
  RegistrationData,
  AuthenticationResponse
} from "dto/types/Authentication"
import { Response } from "types/default"

export const useLogin = (): UseMutationResult<
  Response<AuthenticationResponse>,
  Error,
  AuthorizationData
> => {
  const router = useRouter()

  return useMutation<
    Response<AuthenticationResponse>,
    Error,
    AuthorizationData
  >(["login"], (data) => authenticationAPI.login(data), {
    onSuccess: (response) => {
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token)
        router.reload()
      }
    }
  })
}

export const useRegistration = (): UseMutationResult<
  Response<AuthenticationResponse>,
  Error,
  RegistrationData
> => {
  const router = useRouter()

  return useMutation<Response<AuthenticationResponse>, Error, RegistrationData>(
    ["registration"],
    (data) => authenticationAPI.registration(data),
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token)
          router.reload()
        }
      }
    }
  )
}
