import { ICommand } from "./commands/Command";
import { ProcessReportCommand } from "./commands/ProcessReportCommand";
import { ErrorCommand } from "./commands/ErrorCommand";
import { AddReportCommand } from "./commands/AddReportCommand";
import { DisplayStatsCommand } from "./commands/DisplayStatsCommand";
import { QueryCrimeCommand } from "./commands/QueryCrimeCommand";


export class CommandFactory {
    getCommand(commandName: string): ICommand {
      
     switch(commandName) {
      case "addReport":
       return new AddReportCommand();

      case "processReport":
       return new ProcessReportCommand();

      case "displayStats":
      return new DisplayStatsCommand();

      case "queryCrime":
        return new QueryCrimeCommand();
      
      // invalid input
      default:
       return new ErrorCommand();
     }
    }
  }