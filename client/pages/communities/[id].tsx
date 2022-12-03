import { NextPage } from "next"
import { useRouter } from "next/router"
import Head from "next/head"

import { useById } from "dto/hooks/Communities"

import { QueryWrapper } from "@container"
import Community from "components/modules/Community"

const CommunityPage: NextPage = () => {
  const router = useRouter()

  const { data, status } = useById(Number(router.query.id) || 0)

  return (
    <QueryWrapper status={status}>
      <Head>
        <title>{data?.name}</title>
      </Head>
      <Community />
    </QueryWrapper>
  )
}

export default CommunityPage
