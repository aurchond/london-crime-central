import {
    Column,
    Entity,
  } from "typeorm";

@Entity("LsoaStats", { schema: "db356_dsmiller" })
export class LsoaStats {

    @Column({ name: "LSOA_ID", primary: true})
    lsoaId: number;

    @Column()
    TotalCrimes: number;

    @Column()
    PercentViolentCrimes: number;

    @Column({ name: "crimeRateSlope"})
    deltaCrimeRate: number;

}