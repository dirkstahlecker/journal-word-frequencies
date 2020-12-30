import { Pool } from 'pg'
//tslint:disable
const pg = require('pg');
// tslint:enable


if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}

// include an OR statement if you switch between a local dev db and
// a remote heroku environment

const connString = process.env.DATABASE_URL
  || 'postgresql://dirkstahlecker@localhost:5432/wordfreq';
console.log("connString: " + connString);

const pool = new Pool({
  connectionString : connString
});

// const pool = new Pool({
//   user: 'tsbqunitsyqmur', //'dirkstahlecker',
//   host: process.env.DATABASE_URL || 'localhost',
//   database: 'dfd3r33aio9vo3', //'wordfreq',
//   // password: 'password',
//   password: '5fdc0e7b6c8978b6dbf9291025a3e510f49ca1fef9436e8917cffdd167b800ac',
//   port: 5432,
// })

export const getNames = (req: any, res: any): any => {
  console.log("/getNames")
  pool.query('SELECT * FROM names', (error, results) => {
    if (error)
    {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/