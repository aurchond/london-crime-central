import {
    Column,
    Entity,
  } from "typeorm";

@Entity("BoroughStats", { schema: "db356_dsmiller" })
export class BoroughStats {

    @Column({ name: "Borough_ID", primary: true})
    boroughId: number;

    @Column()
    TotalCrimes: number;

    @Column()
    PercentViolentCrimes: number;

    @Column({ name: "crimeRateSlope"})
    deltaCrimeRate: number;

}