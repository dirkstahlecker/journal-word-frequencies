import { Pool, QueryResult } from 'pg'
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

// wrapper to make a query and do error handling
async function makeQuery(query: string): Promise<any>
{
  try
  {
    const result = await pool.query(query);
    return result;
  }
  catch (e)
  {
    console.error("ERROR with query " + query);
    throw e;
  }
}

async function getRowsForDisplayName(displayname: string): Promise<any>
{
  const query: string = `SELECT * FROM names WHERE displayname='${displayname}';`;
  return makeQuery(query);
}

async function insertNewNameRow(displayname: string, firstname: string, lastname: string): Promise<any>
{
  const insertQuery: string = `INSERT INTO names (displayname, firstname, lastname) VALUES
    ('${displayname}', '{${firstname}}', '{${lastname}}');`;
  return makeQuery(insertQuery);
}

async function appendFirstAndLastNames(displayname: string, firstname: string, lastname: string): Promise<any>
{
  const appendFirstQuery: string = `UPDATE names
    SET firstname = firstname || array['${firstname}'] where displayname = '${displayname}';`
  makeQuery(appendFirstQuery);

  const appendLastQuery: string = `UPDATE names
  SET lastname = lastname || array['${lastname}'] where displayname = '${displayname}';`
return makeQuery(appendLastQuery);
}

export const newDisplayName = async(req: any, res: any) => {
  console.log('/api/newDisplayName');
  const { displayname, firstname, lastname } = req.body;

  // Check if that display name exists. If it does, add to the array. If not, add a new row.
  const getResult = await getRowsForDisplayName(displayname);

  if (getResult.rowCount === 0) // does not exist, need to insert a new row
  {
    const results = await insertNewNameRow(displayname, firstname, lastname);
    return results;
  }
  else // exists, need to add to the existing array
  {
    const results = await appendFirstAndLastNames(displayname, firstname, lastname);
    return results;
  }


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

