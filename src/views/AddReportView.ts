const prompts = require('prompts');
prompts.override(require('yargs').argv);
import * as c from "./constants";
import * as db from "../db";
import { Connection} from "typeorm";
import * as e from "../entity";

// get information from user input
export class AddReportView  {
  async getData():Promise<any> {
    // Open connection 
    const connection = await db.connect([e.Lsoa, e.CrimeTypes]);

    // Elicit information from the user through asking questions
    const questions = await this.getNewReportQuestions(connection);

    // Return the information they entered to the calling function and close the connection
    const response = await prompts(questions);
    await connection.close();
    return response;
  }

  async getNewReportQuestions(connection: Connection):Promise<c.promptQuestion[]> {
    return await [
      // Match to Crime Type
      (await c.GenerateCrimeTypeQuestion(connection)),
      // Lat/Lon Questions
      ...c.LatLonQuestions,
      // Match to LSOA
      c.LsoaQuestion(connection),
      // Describe Location
      c.LocationQuestion,
      // Get Year and Month
      c.AddReportYearQuestion,
      c.AddReportMonthQuestion
    ];
  }
}