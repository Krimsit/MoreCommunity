import socketIO from "socket.io-client"

const socket = socketIO(`${process.env.NEXT_PUBLIC_STREAM_SOCKET_URL}`)

export default socket