# London Crime Central

Code written by Aurchon Datta, Devon Miller-Junk, and Braden Bakker. Database is run on marmoset ece servers. This project is completed for use in ECE 356 F2021.

## Required Installations:
1. Node (version 12.16.1 is guaranteed to work)
2. NPM (version 8.3.0 is guaranteed to work)
3. TS-NODE (version 8.10.1 is guaranteed to work)

## Steps to run this project:
1. Ensure you are connected to the UW VPN or are on campus
2. Get dependencies
>Run `npm i`
2. Run the project
> Run `npm run start [insert command here]`
3. Below shows a list of command options:
>addReport (submit a new report for police to look at)
>processReport (police officer can process reports once the proper investigation has been completed)
>displayStats (view crime statistics by LSOA or Borough)
>queryCrime (search for crimes by LSOA, Borough or CrimeType)

-----
## File Structure:

The following file structure is used by the project:

### index.ts
The index.ts file is the file called when running the program. It hosts the top level function calls for completing the relevant tasks. Based on the command the user enters, index.ts determines which view to use to ask the user questions, then which command to use to process the input.
### Views
The `views` folder contains all of the views required to collect the relevant information from the user. Once all 
of the information is collected, it is passed back to the index.ts file.

### Entity
The `entity` folder contains all of our typeORM entities. The key piece of information here is that the database has already
been set up, so the ORM is solely used for querying, updating,
deleting, and inserting records. All entities are exported from
the index file located in the folder. Our relational schema 
contains views, which are expressed as Entities.

### Database
The `db` folder contains the relevant functions to connect to and query the datase.

### Commands
The `commands` directory contains all of the relevant commands
to retrieve and process information from the database based on
the data submitted by the user.
