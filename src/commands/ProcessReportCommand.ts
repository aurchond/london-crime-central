import { ICommand } from "./Command";
import * as e from "../entity";
import * as db from "../db";
import * as h from "../helpers";

export class ProcessReportCommand implements ICommand {
  
  async run(data:any): Promise<unknown> {
    let newCrimeResult;
    let newCrimeDetailsResult;
    try {
      const connection = await db.connect([e.Crimes, e.CrimeDetails]);
      
      // make new crime entity using input report
      let newCrime = new e.Crimes();
      newCrime.year = data.year;
      newCrime.month = data.month;
      newCrime.lsoaId = data.lsoaId;
      newCrime.crimeTypeId = data.crimeTypeId; 

      // save the new crime
      newCrimeResult = await connection.manager.save(newCrime);

      // make and save the associated Crime Details object
      let newCrimeDetails = this.makeCrimeDetailsObject(newCrimeResult.crimeId, data); 
      newCrimeDetailsResult = await connection.manager.save(newCrimeDetails);
      await connection.close();

      console.log("The report has been processed successfully and added to the following tables:"); 
      console.log("New entry in Crime table: "); 
      console.log(h.PrettyPrintObject(newCrimeResult));
      console.log("New entry in CrimeDetails table: ");
      console.log(h.PrettyPrintObject(newCrimeDetailsResult));

    } catch (e) {
      console.log("Exception in run(): " + e);
    }

    return newCrimeDetailsResult;
  }

  makeCrimeDetailsObject(crimeId: number, report: any): e.CrimeDetails {
    // make a new reprt entity using the data passed in
    let newCrimeDetails = new e.CrimeDetails();
    newCrimeDetails.crimeId = crimeId;
    newCrimeDetails.reportedBy = 'USR';
    if (report.longitude) newCrimeDetails.longitude = report.longitude;
    if (report.latitude) newCrimeDetails.latitude = report.latitude;
    newCrimeDetails.location = report.location;
    newCrimeDetails.outcome = 'Under Investigation'; // this is the default outcome
    newCrimeDetails.reportId = report.reportId;

    return newCrimeDetails;
  }
}