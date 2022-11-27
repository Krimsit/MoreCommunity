import { FC, useState } from "react"

import { useCommunityData } from "dto/hooks/Communities"

import { Community, QueryWrapper } from "@container"
import Filter from "./Filter"

import { Community as ICommunity } from "dto/types/Communities"

import { Cards, Container, Title } from "./Communities.styles"

const Communities: FC = () => {
  const { data, status } = useCommunityData()

  const [filteredItems, setFilteredItems] = useState<ICommunity[]>(data || [])

  const handleSearch = (value: string) => {
    const _items = data?.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )

    setFilteredItems(_items || [])
  }

  return (
    <Container>
      <Title>Сообщества</Title>
      <Filter onSearch={handleSearch} />
      <QueryWrapper status={status}>
        <Cards>
          {filteredItems?.map((item) => (
            <Community key={item.id} {...item} />
          ))}
        </Cards>
      </QueryWrapper>
    </Container>
  )
}

export default Communities
