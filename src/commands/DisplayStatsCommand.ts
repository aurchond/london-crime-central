import { ICommand } from "./Command";
import * as e from "../entity";
import * as db from "../db";
import { getManager } from "typeorm";

// Show statistics for a location based on a specific frequency,
// there are four different combinations possible
export class DisplayStatsCommand implements ICommand {
  async run(data: any): Promise<any> {
    try {
      if (data.statsFrequency == 'monthly') {
        if (data.locationType == 'LSOA') {
          // LSOA statistics for a given month/year
          return await this.getMonthlyLsoaStats(data);
        }
        else {
          // Borough statistics for a given month/year
          return await this.getMonthlyBoroughStats(data);
        }
      }
      else {
        if (data.locationType == 'LSOA') {
          // General LSOA statistics
          return await this.getGeneralLsoaStats(data.locationID);
        }
        else {
          // General Borough statistics
          return await this.getGeneralBoroughStats(data.locationID);
        }
      }
    } catch(e) {
      console.log("Exception in DisplayStatsCommand(): " + e);
    }
  }

  async getMonthlyLsoaStats(data: any): Promise<any> {
    try {
      const connection = await db.connect([e.LsoaStatsByMonth]);
      let lsoaStatsByMonth = await connection.getRepository(e.LsoaStatsByMonth).findOne({
        lsoaId: data.locationID,
        year: data.year,
        month: data.month
      });
      await connection.close();

      return lsoaStatsByMonth;
    } catch (e) {
      console.log("Exception in getMonthlyLsoaStats: " + e);
    }
  }

  async getMonthlyBoroughStats(data: any): Promise<any> {
    try {
      const connection = await db.connect([e.BoroughStatsByMonth]);
      let boroughStatsByMonth = await connection.getRepository(e.BoroughStatsByMonth).findOne({
        boroughId: data.locationID,
        year: data.year,
        month: data.month
      });
      await connection.close();

      return boroughStatsByMonth;
    } catch (e) {
      console.log("Exception in getMonthlyBoroughStats: " + e);
    }
  }

  async getGeneralLsoaStats(lsoaid: number): Promise<any> {
    try {
      const connection = await db.connect([e.LsoaStats]);
      let lsoaStats = await connection.getRepository(e.LsoaStats).findOne(lsoaid);
      await connection.close();

      return lsoaStats;
    } catch (e) {
      console.log("Exception in getGeneralLsoaStats: " + e);
    }
  }

  async getGeneralBoroughStats(boroughid: number): Promise<any> {
    try {
      const connection = await db.connect([e.BoroughStats]);
      let boroughStats = await connection.getRepository(e.BoroughStats).findOne(boroughid);
      await connection.close();

      console.log("General Statistics on this Borough:")
      return boroughStats;
    } catch (e) {
      console.log("Exception in getGeneralBoroughStats: " + e);
    }
  }
}