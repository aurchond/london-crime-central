const chalk = require('chalk');
const figlet = require('figlet');
import * as h from "./helpers";
import {
	command, description,
	program, requiredArg, usage,
	version,
	Command
} from 'commander-ts';
import { AddReportView } from './views/AddReportView';
import { ProcessReportView } from './views/ProcessReportView';
import { DisplayStatsView } from './views/DisplayStatsView';
import { QueryCrimeView } from './views/QueryCrimeView';
import { CommandFactory } from './CommandFactory';

// Display our app title
const initialRedText = new Promise( (resolutionFunc,rejectionFunc) => {
  figlet('London Crime Central', { horizontalLayout: 'full'},function(err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
  }
    console.log(chalk.red(data));
    resolutionFunc("done");
  });
});

// Run the actual program
initialRedText.then( (val) => {
  new Program();
});

@program()
@version('1.0.0')
@description('London Crime Central')
@usage('--help')
export class Program {

	constructor() {}

	run(@requiredArg('message') message) {}

  // Add a crime report using command 'addReport'
	@command()
	async addReport(this: Command ) {
    console.log('ADD A CRIME REPORT');

    // Show user the appropriate view and get data for the report
    let view = new AddReportView();
    const data = await view.getData();
    console.log(h.PrettyPrintObject(data))

    // Enter this information into the Reports table
    const factoryObject = new CommandFactory();
    const commandObject = factoryObject.getCommand("addReport");
    let result = await commandObject.run(data);

    console.log("Thank you for reporting this crime. The report has been succesfully added to our database and will be reviewed by an officer.");
    console.log("Here's your generated report within our 'Reports' table: ")  
    console.log(h.PrettyPrintObject(result));
  }

  // Process a crime report using command 'processReport'
  @command()
	async processReport(this: Command ) {
    console.log('PROCESS A CRIME REPORT');

    let view = new ProcessReportView();
    const report = await view.getReport();
    
    // Process the selected report, entering information from it into the Crimes/Crimedetails tables
    const factoryObject = new CommandFactory();
    const commandObject = factoryObject.getCommand("processReport");

    // This run command will output information
    await commandObject.run(report);
  }

  // Display stats by LSOA/Borough using command 'displayStats'
  @command()
	async displayStats(this: Command ) {
    console.log('DISPLAY STATS BY LSOA/BOROUGH');
    let view = new DisplayStatsView();
    const locationInfo = await view.getLocationInfo();
    
    const factoryObject = new CommandFactory();
    const commandObject = factoryObject.getCommand("displayStats");
    let result = await commandObject.run(locationInfo);

    if (result) {
      console.log("Here is your requested information: ")
      console.log(h.PrettyPrintObject(result))
    } else {
      console.log("Sorry, our database does not have any information for the given parameters.")
    }

  }

  // Query crime by using command 'queryCrime'
  @command()
	async queryCrime(this: Command ) {
    console.log('QUERY CRIME BY CRIMETYPE/LSOA/BOROUGH');
    let view = new QueryCrimeView();
    const data = await view.getData();


    const factoryObject = new CommandFactory();
    const commandObject = factoryObject.getCommand("queryCrime");

    let result = await commandObject.run(data);
    console.log(result);    
  }
}
