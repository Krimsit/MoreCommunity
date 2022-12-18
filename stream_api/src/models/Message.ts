import { Schema, Document, model } from 'mongoose'

export interface IMessage extends Document {
  text: {
    type: String
    required: boolean
  }
  username: {
    type: String
    required: boolean
  }
  streamId: {
    type: Schema.Types.ObjectId
    ref: string
    required: boolean
  }
}

const MessageSchema = new Schema<IMessage>({
  text: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  streamId: {
    type: Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  }
})

const Message = model<IMessage>('Message', MessageSchema)

export default Message
