import {
    Column,
    Entity,
  } from "typeorm";

@Entity("BoroughStatsByMonth", { schema: "db356_dsmiller" })
export class BoroughStatsByMonth {

    @Column({ name: "Borough_ID", primary: true})
    boroughId: number;

    @Column("int", { primary: true, name: "year", nullable: true })
    year: number | null;
  
    @Column("int", { primary: true, name: "month", nullable: true })
    month: number | null;

    @Column({ name: "TotalCrimes"})
    totalCrimes: number;

    @Column({ name: "TotalViolentCrimes"})
    totalViolentCrimes: number;
}