const prompts = require('prompts');
prompts.override(require('yargs').argv);
import * as c from "./constants";
import * as db from "../db";
import { Connection} from "typeorm";
import * as e from "../entity";

// get information from user input
export class QueryCrimeView  {
  
  async getData():Promise<any> {
    // Open connection 
    const connection = await db.connect([e.CrimeTypes, e.Lsoa, e.Boroughs]);
    
    // Get which type of query the user wants to do
    const queryParams = await prompts([c.getQueryParams]);
    const queryCrimeQuestions = await this.getQueryCrimeQuestions(connection, queryParams.params);
    
    // return the response and close the connection
    const queryTypeSelection = await prompts(queryCrimeQuestions);

    // this is case where there is no crimetype given, we default to showing all crime types
    if (!queryParams.params.includes("crimeType")) {
      queryTypeSelection["type"] = (await db.GetCrimeTypes(connection)).map(e => e.crimeTypeId.toString());
    }

    // the number of rows that the user wants to see
    let numRowsObject = await prompts([c.numRows]);
    queryTypeSelection["numRows"] = Object.values(numRowsObject);

    await connection.close();
    return queryTypeSelection;
  }

  // We can add multiple query parameters, ie. the user can query based on any combination of the 3 parameters below
  async getQueryCrimeQuestions(connection: Connection, queryParams: String[]):Promise<c.promptQuestion[]> {
    const result = [];
    if (queryParams.includes("crimeType")) {
        result.push(await c.GenerateCrimeTypeQuestion(connection, true));
    }
    if (queryParams.includes("lsoa")) {
        result.push(await c.LsoaQuestion(connection));
    }
    if (queryParams.includes("Borough")) {
        result.push((await c.BoroughQuestion(connection)));
    }
    return result;
  }
}