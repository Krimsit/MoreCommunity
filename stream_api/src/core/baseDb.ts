import { Pool } from 'pg'

const client = new Pool({
  host: process.env.BASE_DB_HOST,
  port: Number(process.env.BASE_DB_PORT),
  user: process.env.BASE_DB_USER,
  password: process.env.BASE_DB_PASSWORD,
  database: process.env.BASE_DB_DATABASE
})

client.connect((err) => {
  if (err) {
    console.error('An error occurred while connecting to: ', err.message)
  } else {
    console.log('Connected to Base DB')
  }
})

export default client
