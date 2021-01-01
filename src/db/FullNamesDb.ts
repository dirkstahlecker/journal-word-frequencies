import { DisplayNameInfo, FullNameInfo, makeQuery } from "./DbUtils";
import { DisplayNamesDB } from "./DisplayNamesDB";


export abstract class FullNamesDb
{
  public static async get(displayname?: string): Promise<FullNameInfo[] | null>
  {
    if (displayname !== undefined)
    {
      return this.getFullNamesForDisplayname(displayname);
    }

    throw new Error("NOT IMPLEMENTED");
  }

  private static async getFullNamesForDisplayname(displayname: string): Promise<FullNameInfo[] | null>
  {
    const query: string = `SELECT names.displayname, firstlast.firstname, firstlast.lastname
    FROM names
    FULL OUTER JOIN firstlast ON names.name_id=firstlast.name_id
    WHERE names.displayname='${displayname}';`;
    const result = await makeQuery(query);
    if (result.rows.length == 0)
    {
      return null;
    }
    return result.rows as FullNameInfo[];
  }

  public static async addNewFullName(displayname: string, firstname: string, lastname: string): Promise<boolean>
  {
    const existingFullNames: FullNameInfo[] | null = await FullNamesDb.get(displayname);
    if (existingFullNames.length > 0)
    {
      const n: FullNameInfo | undefined = existingFullNames.find((fullName: FullNameInfo) => {
        return fullName.firstname === firstname && fullName.lastname === lastname;
      });
      if (n !== undefined)
      {
        console.log("Didn't insert fullname - already exists");
        return false;
      }
    }

    // TODO: check if they exist already
    const query: string = `INSERT INTO firstlast (name_id, firstname, lastname) VALUES
      ((SELECT name_id FROM names WHERE displayname='${displayname}'), '${firstname}', '${lastname}');`;
    await makeQuery(query);
    return true;
  }

  public static async deleteFullName(displayname: string, firstname: string, lastname: string): Promise<void>
  {
    //find the name_id to use, so we delete the first and last name only for the indicated displayname
    const displayNameInfo: DisplayNameInfo[] | null = await DisplayNamesDB.get(displayname);
    if (displayNameInfo.length !== 1)
    {
      console.log("display name doesn't exist");
      return; //do nothing
    }
    const nameId: string = displayNameInfo[0].name_id.toString();

    //find the firstlast_id to delete
    const getQuery: string = `SELECT firstlast.firstandlast_id FROM firstlast 
    WHERE firstlast.name_id='${nameId}' 
    AND firstlast.firstname='${firstname}' AND firstlast.lastname='${lastname}';`;
    const getResult = await makeQuery(getQuery);
    if (getResult.rows.length !== 1)
    {
      throw new Error("Multiple possible rows to delete");
    }
    const firstlastId: number = getResult.rows[0].firstandlast_id;

    //now delete the row with the firstlast_id
    const deleteQuery: string = `DELETE FROM firstlast WHERE firstandlast_id='${firstlastId}';`;
    return makeQuery(deleteQuery);
  }
}
