import { ICommand } from "./Command";
import * as e from "../entity";
import * as db from "../db";

// Add a crime report to the database
export class AddReportCommand implements ICommand {
  async run(data:any): Promise<any> {
    // make a new reprt entity using the data passed in
    let report = new e.Reports();
    report.year =  data.year;
    report.month = data.month; 
    report.crimeTypeId = data.type;
    report.location = data.location;

    // only enter latitude/longitude if they were provided by the user
    if (data.latitude) report.latitude = data.latitude;
    if (data.longitude) report.longitude = data.longitude;
    report.lsoaId = data.lsoaid;
    report.completed = false;
    try {
      // Connect to the database and save the report
      const connection = await db.connect([e.Reports]);
      await connection.manager.save(report);
      await connection.close();

      return report;
    } catch (e) {
      console.log("Exception in saving: " + e);
    }

    return false;
   }
  }