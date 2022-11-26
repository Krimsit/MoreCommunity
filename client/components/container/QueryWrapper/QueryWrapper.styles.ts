import styled, { keyframes } from "styled-components"

const pulseAnimation = ({ color }: { color: string }) => keyframes`
  0% {
    box-shadow: ${color} 0 0 0px 20px;
  }
  40% {
    box-shadow: none;
  }
  100% {
    box-shadow: ${color} 0 0 0 25px inset;
  }
`

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

export const PulseLoader = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  animation: ${() =>
      pulseAnimation({
        color: "#fff"
      })}
    0.7s linear infinite alternate;
  border: 2px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  text-indent: 50px;
`
