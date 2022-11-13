import { NextPage } from "next"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import testAPI from "../dto/api/TestAPI"
import { useTestData } from "../dto/hooks/Test"

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Home: NextPage = () => {
  const { data } = useTestData()

  return <Container>{data?.title}</Container>
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(["test_data"], testAPI.getTestData)

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default Home
