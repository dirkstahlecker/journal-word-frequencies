import fs from 'fs';
import path from 'path';

const JOURNAL_PATH: string = "";

export class Parser
{
  public static async parse(): Promise<void>
  {
    const data = fs.readFileSync(path.join(__dirname, JOURNAL_PATH), 'utf8');
    const json = await JSON.parse(data);


  }
}
