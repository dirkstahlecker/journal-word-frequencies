import { DisplayNameInfo, makeQuery } from "./DbUtils";

export abstract class DisplayNamesDB
{
  /**
   * Get entrypoint - returns info just from the names database
   * @param displayname returns displayname info for this displayname, or for all if undefined
   * Returns null if that displayname doesn't exist
   */
  public static async get(displayname?: string): Promise<DisplayNameInfo[] | null>
  {
    if (displayname === undefined)
    {
      return this.getAll();
    }
    const result: DisplayNameInfo | null = await this.getInfoForDisplayname(displayname);
    if (result == null)
    {
      return null;
    }
    return [result];
  }

  public static async add(displayname: string): Promise<any>
  {
    const insertQuery: string = `INSERT INTO names (displayname) VALUES
      ('${displayname}');`;
    return makeQuery(insertQuery);
  }

  public static async delete(displayName: string): Promise<void>
  {
    const deleteQuery: string = `DELETE FROM names WHERE names.displayname='${displayName}';`;
    const result = await makeQuery(deleteQuery);
    
    return;
  }

  /////////////////////////////////////////////////////////////////////////////////

  private static async getAll(): Promise<DisplayNameInfo[] | null>
  {
    const query: string = 'SELECT * FROM names';
    const result = await makeQuery(query);
    if (result.rows.length == 0)
    {
      return null;
    }
    return result.rows as DisplayNameInfo[];
  }

  private static async getInfoForDisplayname(displayname: string): Promise<DisplayNameInfo | null>
  {
    const query: string = `SELECT * FROM names WHERE displayname='${displayname}';`;
    const result = await makeQuery(query);
    if (result.rows.length !== 1)
    {
      return null;
    }
    return result.rows[0] as DisplayNameInfo;
  }


}

