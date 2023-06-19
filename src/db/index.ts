import {createConnection, EntitySchema, ConnectionOptions, Connection} from "typeorm";
import * as e from "../entity";

// The configuration we use throughout the app to connect to the database
const connectionConfig: ConnectionOptions = {
    type: "mysql",
    host: "marmoset04.shoshin.uwaterloo.ca",
    port: 3306,
    username: "dsmiller",
    password: "dbGrt6IPDPNqZl9BXF^8",
    database: "db356_dsmiller",
    synchronize: false, // KEEP THIS AS FALSE
    logging: false
};

// Actually connecting to the database using the above config
export const connect = async(entity:((Function | string | EntitySchema<any>))[]) => {
    let connection:Connection;
    try {
        connection = await createConnection({...connectionConfig, entities: entity});
    } catch (e) {
        console.log("Error connecting to database:" + e);
    }
    return connection;
};


// Below are multiple consts which hold the value of different queries done on the repo

export const GetCrimeTypes = async(connection: Connection): Promise<e.CrimeTypes[]> => {
    return await connection.getRepository(e.CrimeTypes).find();
}

export const GetLsoaByID = async(lsoaid: number, connection: Connection): Promise<e.Lsoa> => {
    return await connection.getRepository(e.Lsoa).findOne(lsoaid);
}

export const GetBoroughByID = async(boroughId: number, connection: Connection): Promise<e.Boroughs> => {
    return await connection.getRepository(e.Boroughs).findOne(boroughId);
}

export const GetUncompletedReports = async(connection: Connection): Promise<e.Reports[]> => {
    return await connection.getRepository(e.Reports).find({ where: { completed: 0 } });
}

export const GetReportByID = async(reportid: number, connection: Connection): Promise<e.Reports> => {
    return await connection.getRepository(e.Reports).findOne(reportid);
}