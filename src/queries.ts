import { Pool, QueryResult } from 'pg'
import {Request, Response} from 'express';
import * as express from 'express';
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

/*********************************************************************/
// Types

// [
//   { name_id: 1, displayname: 'dirk' },
//   { name_id: 2, displayname: 'kip' }
// ]
type DisplayNameInfo = { name_id: number, displayname: string };
type FullNameInfo = { displayname: string, firstname: string | null, lastname: string | null };

/*********************************************************************/
// Query functions

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

export async function getAllDisplayNames(): Promise<DisplayNameInfo[]>
{
  const query: string = 'SELECT * FROM names';
  const result = await makeQuery(query);
  return result.rows as DisplayNameInfo[];
}

async function displaynameExistsInNamesTable(displayname: string): Promise<boolean>
{
  const query: string = `SELECT displayname FROM names WHERE displayname='${displayname}';`;
  const result = await makeQuery(query);
  return result.rows === 1; // TODO: test
}

async function getFullNamesForDisplayname(displayname: string): Promise<FullNameInfo[]>
{
  const query: string = `SELECT names.displayname, firstlast.firstname, firstlast.lastname
  FROM names
  FULL OUTER JOIN firstlast ON names.name_id=firstlast.name_id;`;
  const result = await makeQuery(query);
  return result.rows as FullNameInfo[];
}

async function insertNewDisplayName(displayname: string): Promise<any>
{
  const insertQuery: string = `INSERT INTO names (displayname) VALUES
    ('${displayname}');`;
  return makeQuery(insertQuery);
}

async function addNewFullName(displayname: string, firstname: string, lastname: string): Promise<any>
{
  // TODO: check if they exist already
  const query: string = `INSERT INTO firstlast (name_id, firstname, lastname) VALUES
    ((SELECT name_id FROM names WHERE displayname='${displayname}'), '${firstname}', '${lastname}');`;
  return await makeQuery(query);
}

// async function appendFirstAndLastNames(displayname: string, firstname: string, lastname: string): Promise<any>
// {
//   const appendFirstQuery: string = `UPDATE names
//     SET firstname = firstname || array['${firstname}'] where displayname = '${displayname}';`
//   makeQuery(appendFirstQuery);

//   const appendLastQuery: string = `UPDATE names
//   SET lastname = lastname || array['${lastname}'] where displayname = '${displayname}';`
//   return makeQuery(appendLastQuery);
// }

// async function displayNameContainsFirstName(displayname: string, firstname: string): Promise<boolean>
// {
//   const query: string = `SELECT firstname FROM names WHERE displayname='${displayname}';`;
//   const result = await makeQuery(query);
//   if (result.rows.length !== 1)
//   {
//     throw new Error("Invariant failed: selecting displayname returns more than one row");
//   }
//   const firstnames: string[] = result.rows[0].firstname;
//   return firstnames.indexOf(firstname) > -1;
// }

async function displayNameContainsLastName(displayname: string, lastname: string): Promise<boolean>
{
  const query: string = `SELECT lastname FROM names WHERE displayname='${displayname}';`;
  const result = await makeQuery(query);
  if (result.rows.length !== 1)
  {
    throw new Error("Invariant failed: selecting displayname returns more than one row");
  }
  const lastnames: string[] = result.rows[0].lastname;
  return lastnames.indexOf(lastname) > -1;
}



/*********************************************************************/
// Route endpoints

export const newDisplayNameEndpoint = async(req: any, res: any) => {
  console.log('/api/newDisplayName');
  const { displayname, firstname, lastname } = req.body;

  // Check if that display name exists. If it does, add to the array. If not, add a new row.
  const haveDisplayName = await displaynameExistsInNamesTable(displayname);

  if (!haveDisplayName) // does not exist, need to insert a new row
  {
    const results = await insertNewDisplayName(displayname);
    return results;
  }
  else // exists, need to add to the existing array
  {
    // check if displayname already has the first and last name - do nothing if so

    // const hasFirstName: boolean = await displayNameContainsFirstName(displayname, firstname);
    // const hasLastName: boolean = await displayNameContainsLastName(displayname, lastname);


    // const results = await appendFirstAndLastNames(displayname, firstname, lastname);
    // return results;
  }
}

export const getAllDisplayNamesEndpoint = async(req: Request, res: Response) => {
	console.log(`/api/displayName/all`);

  const result = await getAllDisplayNames();

	res.set('Content-Type', 'application/json');
	res.json(result);
}

export const getFullNamesForDisplayNameEndpoint = async(req: Request, res: Response) => {
  console.log(`/api/displayName/${req.params.dName}`)
  const displayName: string = req.params.dName;
  if (displayName === undefined)
  {
    console.error("displayname is undefined");
    throw new Error("displayname is undefined");
  }
  const result: FullNameInfo[] = await getFullNamesForDisplayname(displayName);
  // console.log(result);

  res.set('Content-Type', 'application/json');
	res.json(result);
}

export const getAllFullNamesEndpoint = async(req: Request, res: Response) => {
  console.log("/api/fullNames/all");

  const fullNames: FullNameInfo[] = [];
  const displayNames: DisplayNameInfo[] = await getAllDisplayNames();
  displayNames.forEach(async(displayNameInfo: DisplayNameInfo) => {
    const names: FullNameInfo[] = await getFullNamesForDisplayname(displayNameInfo.displayname);
    console.log(names);
    fullNames.concat(names);
  });

  // console.log(fullNames)


  res.set('Content-Type', 'application/json');
	res.json(fullNames);
}
