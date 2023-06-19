import { ICommand } from "./Command";
import * as e from "../entity";
import * as db from "../db";

// We can query by crime type, LSOA or Borough
export class QueryCrimeCommand implements ICommand {
  async run(data:any): Promise<any> {
    try {
      const connection = await db.connect([e.Crimes, e.CrimeTypes, e.Lsoa, e.Boroughs]);
      // since the data can be queried on multiple parameters,
      // we set the unused ones to the wildcard operator
      if (!data.boroughid){
        data.boroughid = '%';
      }
      if (!data.lsoaid){
        data.lsoaid = '%';
      }
      if (!data.type){
        data.type = '%';
      }

      // We JOIN all of the relevant tables in one go and filter this based on the user's parameters
      const result = await connection.query(`
        SELECT crime_ID, year, month, LSOA_NM, Borough_NM, crimeType_NM, reportedBy, location, outcome
        FROM Crimes
          INNER JOIN LSOA USING (LSOA_ID)
          INNER JOIN Boroughs USING (Borough_ID)
          INNER JOIN CrimeTypes USING (crimeType_ID)
          LEFT JOIN CrimeDetails USING (crime_ID)
        WHERE crimeType_ID IN (${data.type})
          AND LSOA_ID LIKE '${data.lsoaid}'
          AND Borough_ID LIKE '${data.boroughid}'
          LIMIT ${data.numRows};
      `);
      await connection.close();
      return result;
    } catch (e) {
      console.log("Exception in querying: " + e);
    }
    return null;
  }
}