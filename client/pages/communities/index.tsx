import { NextPage } from "next"
import { dehydrate, QueryClient } from "@tanstack/react-query"

import communitiesAPI from "dto/api/CommunitiesAPI"

import Layout from "@layout"
import Communities from "components/modules/Communities"

const CommunitiesPage: NextPage = () => {
  return (
    <Layout>
      <Communities />
    </Layout>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(["communities"], communitiesAPI.getAll)

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default CommunitiesPage
