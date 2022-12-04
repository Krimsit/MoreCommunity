import styled from "styled-components"

import { Avatar, Button, Container, Form, Input } from "@ui"
import { MdDelete, MdEdit } from "react-icons/md"

export const Base = styled(Container).attrs(() => ({
  type: "1"
}))<{ isDetail?: boolean }>`
  min-width: ${({ isDetail }) => (isDetail ? "700px" : 0)};
  min-height: 0;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  gap: 25px;

  @media screen and (max-width: 1300px) {
    min-width: 0;
    max-width: 100%;
  }
`

export const Header = styled.div`
  padding-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.text.light};
`

export const Status = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

export const Time = styled.span`
  justify-self: flex-end;
  font-weight: 300;
  font-size: 10px;
  line-height: 12px;
  margin-bottom: 10px;
`

export const Title = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin: 0;
  padding: 0;
`

export const Content = styled.div<{ isDetail?: boolean }>`
  width: 100%;
  overflow: hidden;
  min-height: 90px;

  ${({ isDetail }) =>
    !isDetail &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  `}
`

export const Files = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

export const MoreFiles = styled(Container).attrs(() => ({
  type: "2"
}))`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  border-radius: 13px;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
`

export const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

export const OwnerControls = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 30px;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`

export const OwnerControlsEdit = styled(MdEdit)`
  cursor: pointer;
  font-size: 24px;
`

export const OwnerControlsDelete = styled(MdDelete)`
  cursor: pointer;
  font-size: 24px;
  fill: #ff5154;
`

export const UserControls = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 30px;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }
`

export const OpenAllButton = styled(Button)`
  padding: 0 25px;
  height: 50px;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  gap: 10px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

export const CommentsBlock = styled.div`
  width: 100%;
  padding-top: 25px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.text.light};
`

export const Comments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`

export const ShowAllComments = styled(Button)`
  margin: 20px auto 0;
`

export const CreateComment = styled(Form)`
  margin-top: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;

  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-areas: "avatar input" "button button";
    grid-template-columns: 60px auto;
  }
`

export const CreateCommentAvatar = styled(Avatar).attrs(() => ({
  size: "small"
}))`
  grid-area: avatar;
`

export const CreateCommentInput = styled(Input)`
  grid-area: input;
  width: 100%;
  flex: 1;
`

export const CreateCommentButton = styled(Button).attrs(() => ({
  type: "submit"
}))`
  grid-area: button;
  min-width: 60px;
  width: 60px;
  height: 60px;
  padding: 0;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 24px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    border-radius: 13px;
  }
`

export const Comment = styled(Container).attrs(() => ({
  type: "2"
}))`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 25px;
  min-width: 0;
  min-height: 0;
  padding: 10px;
`

export const CommentData = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    flex: 1;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    margin: 0;
    padding: 0;
  }

  span {
    width: 100%;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    margin: 0;
    padding: 0;

    &.date {
      font-weight: 200;
      font-size: 12px;
      line-height: 12px;
      text-align: right;
    }
  }
`
