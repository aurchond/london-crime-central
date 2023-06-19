import { ICommand } from "./Command";

// User has entered an invalid command
export class ErrorCommand implements ICommand {
    async run(data:any): Promise<unknown> {
        let promise = new Promise (async (resolve, reject) =>{
          // resolve right away 
          resolve("No keywords found. Please type 'Help' to see what keywords can be used");
        });
        return promise;
        }
  }