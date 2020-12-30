import fs from 'fs';
import path from 'path';

const JOURNAL_PATH: string = "";

export abstract class Parser
{
  public static async parse(journalText: string): Promise<void>
  {
    console.log("Parsing...");
  }
}
