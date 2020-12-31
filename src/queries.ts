import { Pool } from 'pg'
//tslint:disable
const pg = require('pg');
// tslint:enable

// https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it

const connString = process.env.DATABASE_URL
  || 'postgresql://dirkstahlecker@localhost:5432/wordfreq';
console.log("connString: " + connString);

let pool: Pool;
if (process.env.DATABASE_URL)
{
  pool = new Pool({
    connectionString : connString,
    ssl: { rejectUnauthorized: false }
  });
}
else
{
  pool = new Pool({
    connectionString: connString
  });
}

// const pool = new Pool({
//   user: 'tsbqunitsyqmur', //'dirkstahlecker',
//   host: process.env.DATABASE_URL || 'localhost',
//   database: 'dfd3r33aio9vo3', //'wordfreq',
//   // password: 'password',
//   password: '5fdc0e7b6c8978b6dbf9291025a3e510f49ca1fef9436e8917cffdd167b800ac',
//   port: 5432,
// })

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////



export const getNames = (req: any, res: any): any => {
  console.log("/api/getNames")
  pool.query('SELECT * FROM names', (error, results) => {
    if (error)
    {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

export const newDisplayName = (req: any, res: any) => {
  console.log('/api/newDisplayName');
  const { displayname, firstname, lastname } = req.body;

  // Check if that display name exists. If it does, add to the array. If not, add a new row.
  const getQuery: string = `SELECT * FROM names WHERE displayname='${displayname}';`
  pool.query(getQuery, (getError, getResults) => {
    if (getError)
    {
      throw getError;
    }
    if (getResults.rowCount === 0) // does not exist, need to insert a new row
    {
      const insertQuery: string = `INSERT INTO names (displayname, firstname, lastname) VALUES
        ('${displayname}', '{${firstname}}', '{${lastname}}');`;
      pool.query(insertQuery, (insertError, insertResults) => {
        if (insertError)
        {
          throw insertError;
        }
        console.log("INSERTED");
        console.log(insertResults);
        return insertResults;
      })
    }
    else // exists, need to add to the existing array
    {
      const appendQuery: string = `UPDATE names
        SET firstname = firstname || array['${firstname}'] where displayname = '${displayname}';`
      pool.query(appendQuery, (appendError, appendResults) => {
        if (appendError)
        {
          throw appendError;
        }
        console.log("APPENDED")
        console.log(appendResults);
        return appendResults;
      })
    }
  })


  // const query: string = `INSERT INTO names (displayname, firstname, lastname) VALUES ` +
  //   `('${displayname}', '{${firstname}}', '{${lastname}}')`;

  // console.log(query)

  // pool.query(query, (error, results) => {
  //   if (error)
  //   {
  //     throw error
  //   }
  //   res.status(201).send(`User added with ID: ${res.insertId}`)
  // })
}

