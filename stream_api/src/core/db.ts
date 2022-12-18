import mongoose from 'mongoose'

mongoose.connect(process.env.STREAM_DB_DATA as string, {}, (err) => {
  if (err)
    throw new Error(`An error occurred while connecting to: ${err.message}`)

  console.log('Connected to Stream DB')
})
