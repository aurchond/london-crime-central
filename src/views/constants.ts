import { Connection} from "typeorm";
import { toTitleCase } from '../helpers';
import * as db from "../db";
import * as e from "../entity";
import * as h from "../helpers";

interface choice {
    title: String,
    value: String
}

export interface promptQuestion {
    type: 'text' | 'multiselect',
    name: String,
    message: String,
    initial?: String,
    validate?: Function,
    max?: Number,
    min?: Number,
    hint?: String,
    choices?: choice[],
    format?: Function,
    onRender?: Function,
    onState?: Function
}

export interface locationInfo {
    locationID: number,
    statsFrequency: 'monthly' | 'general',
    locationType: 'LSOA' | 'Borough',
    month?: number,
    year?: number
}

// FOR ADD REPORT

export const LocationQuestion: promptQuestion = {
    type: 'text',
    name: 'location',
    message: 'Describe the exact location where the incident occured:',
    validate: location => locationValidator(location) ? true : 'Error: Must enter a location'
}

export const GenerateCrimeTypeQuestion = async(connection: Connection, multiselect = false):Promise<promptQuestion> => {
    const crimeTypeMapper = (crimeType: e.CrimeTypes):choice => {
        return {
            title: toTitleCase(crimeType.crimeTypeNm),
            value: crimeType.crimeTypeId.toString()
        }
    }
    return {
        type: 'multiselect',
        name: 'type',
        message: 'What type of crime was it?' + (multiselect ? ' (select multiple)' : ''),
        validate: type => type ? true : 'must select an item',
        max: multiselect ? 20 : 1,
        min: 1,
        hint: 'Space to select. Return to submit',
        choices: (await db.GetCrimeTypes(connection)).map(crimeTypeMapper)
    }
}

export const LatLonQuestions:promptQuestion[] = [
    {
        type: 'text',
        name: 'latitude',
        message: 'At what latitude did this crime occur (press enter if unknown)?',
        validate: latitude => !latitude || Number(latitude) ? true : 'Error: Must be a number'
    },
    {
        type: 'text',
        name: 'longitude',
        message: 'At what longitude did this crime occur (press enter if unknown)?',
        validate: longitude => !longitude || Number(longitude) ? true : 'Error: Must be a number'
    }
];

// Note: Lsoa Code is specified in UK government format, e.g. 'E01000001'
// We specify in LSOA ID (1000001)
export const LsoaQuestion = (connection: Connection):promptQuestion => {
    return {
        type: 'text',
        name: 'lsoaid',
        message: 'What is the LSOA Code? (eg. E01000001)',
        format: convertLsoaCdToId,
        validate: async(lsoaCd) => await validateLsoaCD(lsoaCd, connection) ? true : 'Error: Must enter a valid LSOA'
    }
};

// FOR PROCESS REPORT
export const GenerateReportsQuestion = async(connection: Connection):Promise<promptQuestion> => {
    const reportMapper = (report: e.Reports):choice => {
        return {
            title: h.PrettyPrintObject(report),
            value: report.reportId.toString()
        }
    }

    return {
        type: 'multiselect',
        name: 'reportid',
        message: 'Which report would you like to process?',
        validate: type => type ? true : 'must select an item',
        max: 1,
        min: 1,
        hint: 'Space to select. Return to submit',
        choices: (await db.GetUncompletedReports(connection)).map(reportMapper)  
    }
}

// FOR DISPLAY STATS
export const GenerateLocationTypeQuestion = (): promptQuestion => {
    
    return {
        type: 'multiselect',
        name: 'locationtype',
        message: 'Would you like to display stats by LSOA or Borough?',
        validate: type => type ? true : 'must select an item',
        max: 1,
        min: 1,
        hint: 'Space to select. Return to submit',
        choices: [
            {title: "LSOA", value: "LSOA"},
            {title: "Borough", value: "Borough"}
        ]
            
    }
}

// export const DateRangeQuestion:promptQuestion[] = [
//     {
//         type: 'text',
//         name: 'startYear',
//         message: 'From what year would you like to start querying?',
//         validate: year => parseInt(year) ? true : 'Error: Must be a valid year'
//     },
//     {
//         type: 'text',
//         name: 'startMonth',
//         message: 'From what month would you like to start querying (enter 1-12)?',
//         validate: month => monthValidator(month) ? true : 'Error: Must be a valid month'
//     },
//     {
//         type: 'text',
//         name: 'endYear',
//         message: 'At what year would you like to end querying?',
//         validate: year => parseInt(year) ? true : 'Error: Must be a valid year'
//     },
//     {
//         type: 'text',
//         name: 'endMonth',
//         message: 'At what month would you like to end querying (enter 1-12)?',
//         validate: month => monthValidator(month) ? true : 'Error: Must be a valid month'
//     },
// ];

export const GenerateStatsFrequency = (): promptQuestion => {
    
    return {
        type: 'multiselect',
        name: 'isMonthlyStats',
        message: 'Would you like to display general statistics or statistics by month?',
        validate: type => type ? true : 'must select an item',
        max: 1,
        min: 1,
        hint: 'Space to select. Return to submit',
        choices: [
            {title: "General statistics", value: "general"},
            {title: "Statistics by a specified month/year", value: "monthly"}
        ]
            
    }
}

export const BoroughQuestion = (connection: Connection): promptQuestion => {
    return {
        type: 'text',
        name: 'boroughid',
        message: 'What is the LAD Code? (eg. E06000001)',
        validate: async(ladCd) => await validateLadCD(ladCd, connection) ? true : 'Error: Must be a valid Local Area District Code',
        format: convertLadCDToBoroughId
    }
};

export const AddReportYearQuestion: promptQuestion = {
    type: 'text',
    name: 'year',
    message: 'What year did this occur in?',
    validate: year => yearValidator(year) ? true : 'Error: Year must be a 4 digit number'
}

export const AddReportMonthQuestion: promptQuestion = {
    type: 'text',
    name: 'month',
    message: 'What month did this occur in (Enter a number from 1-12): ',
    validate: month => monthValidator(month) ? true : 'Error: Must be a valid month'
}

export const YearQuestion: promptQuestion = {
    type: 'text',
    name: 'year',
    message: 'Year:',
    validate: year => yearValidator(year) ? true : 'Error: Year must be a 4 digit number'
}

export const MonthQuestion: promptQuestion = {
    type: 'text',
    name: 'month',
    message: 'Month (Enter a number from 1-12): ',
    validate: month => monthValidator(month) ? true : 'Error: Must be a valid month'
}


// FOR QUERY CRIME
export const getQueryParams: promptQuestion = {
    type: 'multiselect',
    name: 'params',
    message: 'What do you want to query by (select multiple)?',
    max: 3,
    min: 1,
    hint: 'Space to select. Return to submit',
    choices: [
        {title: "Crime Type", value: "crimeType"},
        {title: "LSOA", value: "lsoa"},
        {title: "Borough", value: "Borough"}
    ]
};

export const numRows: promptQuestion = {
    type: 'text',
    name: 'numRows',
    message: 'How many rows would you like to see? (Only between 1 and 100 rows can be displayed in the console)',
    validate: numRows => numRowsValidator(numRows) ? true : 'Error: Must enter a number between 1 and 100'
}

// Helpers
const locationValidator = (location: string):boolean => {
    return !(!location || location.length === 0 );
}

// validate the LSOA code
const validateLsoaCD = async(lsoaCD: string, connection: Connection):Promise<boolean> => {
    if (!lsoaCD.length || lsoaCD[0] != 'E' || lsoaCD[1] != '0' || lsoaCD.length != 9) {
        return false;
    }
    return !!(await db.GetLsoaByID(convertLsoaCdToId(lsoaCD), connection));
}

export const convertLsoaCdToId = (lsoaCD: string):number => {
    return parseInt(lsoaCD.substring(1));
}

// validate the LAD code (for the borough)
const validateLadCD = async(ladCD: string, connection: Connection):Promise<boolean> => {
    if (!ladCD.length || ladCD[0] != 'E' || ladCD[1] != '0') {
        return false;
    }
    return !!(await db.GetBoroughByID(convertLadCDToBoroughId(ladCD), connection));
}

export const convertLadCDToBoroughId = (ladCD: string):number => {
    return parseInt(ladCD.substring(1));
}

const isInteger = (num: string):boolean => {
    return Math.round(Number(num)) == Number(num);
}

const monthValidator = (month: string):boolean => {
    const monthNum = parseInt(month);
    return monthNum >= 1 && monthNum <= 12 && isInteger(month);
}

const yearValidator = (year: string):boolean => {
    const yearNum = parseInt(year);
    return yearNum >= 1000 && yearNum <= 9999 && isInteger(year);
}

const numRowsValidator = (month: string):boolean => {
    const numRows = parseInt(month);
    return numRows >= 1 && numRows <= 100 && isInteger(month);
}
