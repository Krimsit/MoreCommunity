import { Schema, Document, model } from 'mongoose'

export interface IStream extends Document {
  key: {
    type: String
    required: boolean
  }
  communityId: {
    type: Number
    required: boolean
  }
  title: {
    type: String
    required: boolean
  }
  description: {
    type: String
  }
}

const StreamSchema = new Schema<IStream>({
  key: {
    type: String,
    required: true
  },
  communityId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
})

const Stream = model<IStream>('Stream', StreamSchema)

export default Stream
