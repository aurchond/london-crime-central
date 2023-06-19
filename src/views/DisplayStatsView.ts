const prompts = require('prompts');
prompts.override(require('yargs').argv);
import * as c from "./constants";
import * as db from "../db";
import { Connection} from "typeorm";
import * as e from "../entity";

// get information from user input
export class DisplayStatsView {

  async getLocationInfo():Promise<c.locationInfo> {
    
    try {
      // Open connection 
      const connection = await db.connect([e.Lsoa, e.Boroughs]);

      // LOCATION TYPE (LSOA or Borough) 
      const locationTypeQuestion = this.getLocationTypeQuestion();
      const locationTypeObj = await prompts(locationTypeQuestion);
      // parse locationType from their response
      let locationTypeString = Object.values(locationTypeObj).toString();
      let locationType;
      if (locationTypeString == 'LSOA') locationType = 'LSOA';
      else locationType = 'Borough';


      // LOCATION ID
      const locationIDQuestion = await this.getLocationIDQuestion(connection, locationTypeObj);
      const locationIDObj = await prompts(locationIDQuestion);
      // parse locationID from their response
      let locationID = Number(Object.values(locationIDObj).toString());


      // STATS FREQUENCY (monthly or general)
      const statsFrequencyQuestion = this.getStatsFrequencyQuestion();
      const statsFrequencyObj = await prompts(statsFrequencyQuestion);
      // parse statsFrequency from their response
      let statsFrequencyString = Object.values(statsFrequencyObj).toString();
      let statsFrequency;

      // if the frequency is monthly, we need to get more information about
      // specific month/year that the user would like to look at
      if (statsFrequencyString == 'monthly') {
        let monthlyFrequencyObj = await this.getMonthlyLocationInfo();
        
        // converts the response to a number type
        let year = Number(monthlyFrequencyObj.year);
        let month = Number(monthlyFrequencyObj.month);

        await connection.close();
        
        // return object with the month and year fields filled in
        return {
          locationID: locationID,
          statsFrequency: 'monthly',
          locationType: locationType,
          month: month,
          year: year
        }
      } 

      // this is the general statistics case, don't need extra info from user
      else {
        statsFrequency = 'general';

        await connection.close();

        return {
          locationID: locationID,
          statsFrequency: statsFrequency,
          locationType: locationType
        }
      }
    }
    
    catch (e) {
      console.log("e: " + e);
    }
  }

  async getMonthlyLocationInfo(): Promise<any> {
    console.log("Please enter the month/year that you want to look at (note please press enter if command is stuck):");
    // if it's monthly stats we need to get more the exact data/month from the user
    const statsFrequencyQuestions = this.getStatsFrequencyQuestions();
    const statsFrequencyObj = await prompts(statsFrequencyQuestions);

    return statsFrequencyObj;
  }

  getLocationTypeQuestion():c.promptQuestion {
    return c.GenerateLocationTypeQuestion();
  }

  getStatsFrequencyQuestion():c.promptQuestion {
    return c.GenerateStatsFrequency();
  }

  async getLocationIDQuestion(connection: Connection, response: any):Promise<c.promptQuestion> {
    if (response.locationtype == "LSOA") {
        return c.LsoaQuestion(connection);
    } else {
        return c.BoroughQuestion(connection);
    } 
  }

  getStatsFrequencyQuestions():c.promptQuestion[] {
    return [
      // Crime Year
      c.YearQuestion,
      // Crime Month
      c.MonthQuestion,
    ];
  }

}