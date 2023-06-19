const prompts = require('prompts');
prompts.override(require('yargs').argv);
import * as c from "./constants";
import * as db from "../db";
import { Connection} from "typeorm";
import * as e from "../entity";

// get information from user input
export class ProcessReportView  {
  async getReport():Promise<any> {
    try {
      // Open connection 
      const connection = await db.connect([e.Reports]);

      // Ask user which report they would like to process
      const question = await c.GenerateReportsQuestion(connection);
      const response = await prompts(question);

      // get the reportID from the reponse
      let reportId = Number(Object.values(response.reportid));

      // get the report by the report id
      let report = await db.GetReportByID(reportId, connection);

      // set the report to be completed and save this to the db
      report.completed = true;
      await connection.manager.save(report);

      await connection.close();
      return report;
    }
    catch (e) {
      console.log("getReport() - exception: " + e);
    }
  }
}