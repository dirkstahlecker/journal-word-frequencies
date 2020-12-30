import { Pool } from 'pg'

const pool = new Pool({
  user: 'dirkstahlecker',
  host: 'localhost',
  database: 'wordfreq',
  // password: 'password',
  port: 5432,
})

export const getNames = (req: any, res: any): any => {
  console.log("/getNames")
  pool.query('SELECT * FROM names', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/