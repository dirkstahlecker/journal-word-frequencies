import {Request, Response} from 'express';
import { DisplayNameInfo, FullNameInfo, makeQuery } from './db/DbUtils';
import { DisplayNamesDB } from './db/DisplayNamesDB';
import { FullNamesDb } from './db/FullNamesDb';



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

// async function displayNameContainsLastName(displayname: string, lastname: string): Promise<boolean>
// {
  // TODO: this won't work
//   const query: string = `SELECT lastname FROM names WHERE displayname='${displayname}';`;
//   const result = await makeQuery(query);
//   if (result.rows.length !== 1)
//   {
//     throw new Error("Invariant failed: selecting displayname returns more than one row");
//   }
//   const lastnames: string[] = result.rows[0].lastname;
//   return lastnames.indexOf(lastname) > -1;
// }



/*********************************************************************/
// Route endpoints

export const newDisplayNameEndpoint = async(req: any, res: any) => {
  console.log('/api/newDisplayName');
  const displayname = req.body.params.displayName;

  DisplayNamesDB.add(displayname);

  // // Check if that display name exists. If it does, add to the array. If not, add a new row.
  // const haveDisplayName = await displaynameExistsInNamesTable(displayname);

  // if (!haveDisplayName) // does not exist, need to insert a new row
  // {
  //   const results = await DisplayNamesDB.add(displayname);
  //   return results;
  // }
  // else // exists, need to add to the existing array
  // {
  //   // check if displayname already has the first and last name - do nothing if so

  //   // const hasFirstName: boolean = await displayNameContainsFirstName(displayname, firstname);
  //   // const hasLastName: boolean = await displayNameContainsLastName(displayname, lastname);


  //   // const results = await appendFirstAndLastNames(displayname, firstname, lastname);
  //   // return results;
  // }
}

export const getAllDisplayNamesEndpoint = async(req: Request, res: Response) => {
	console.log(`/api/displayName/all`);

  const result = await DisplayNamesDB.get();

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
  const result: FullNameInfo[] = await FullNamesDb.get(displayName);
  // console.log(result);

  res.set('Content-Type', 'application/json');
	res.json(result);
}

export const getAllFullNamesEndpoint = async(req: Request, res: Response) => {
  console.log("/api/fullNames/all");

  const fullNames: FullNameInfo[] | null = await FullNamesDb.getAll();

  res.set('Content-Type', 'application/json');
	res.json(fullNames);
}
