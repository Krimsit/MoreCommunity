import { FC, useEffect, useState } from "react"

import { useCommunity } from "dto/hooks/Communities"

import { Community, QueryWrapper } from "@container"
import Filter from "./Filter"

import { Community as ICommunity } from "dto/types/Communities"

import { Cards, Container, Title } from "./Communities.styles"

const Communities: FC = () => {
  const { data, status } = useCommunity()

  const [filteredItems, setFilteredItems] = useState<ICommunity[]>(data || [])

  const handleSearch = (value: string) => {
    const _items = data?.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )

    setFilteredItems(_items || [])
  }

  useEffect(() => {
    setFilteredItems(data || [])
  }, [data])

  return (
    <Container>
      <Title>Сообщества</Title>
      <Filter onSearch={handleSearch} />
      <QueryWrapper status={status}>
        <Cards>
          {filteredItems.length
            ? filteredItems?.map((item) => (
                <Community key={item.id} {...item} />
              ))
            : "Пока не созданно ни одного сообщества"}
        </Cards>
      </QueryWrapper>
    </Container>
  )
}

export default Communities
