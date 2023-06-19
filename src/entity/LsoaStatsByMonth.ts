import { Column, Entity, Index } from "typeorm";

@Index("idx_BurroughStatsByMonth", ["lsoaId", "year", "month"], {
  unique: true,
})
@Entity("LsoaStatsByMonth", { schema: "db356_dsmiller" })
export class LsoaStatsByMonth {
  @Column("decimal", {
    primary: true,
    name: "LSOA_ID",
    nullable: true,
    precision: 8,
    scale: 0,
  })
  lsoaId: number | null;

  @Column("int", { primary: true, name: "year", nullable: true })
  year: number | null;

  @Column("int", { primary: true, name: "month", nullable: true })
  month: number | null;

  @Column("int", { name: "TotalCrimes", nullable: true })
  totalCrimes: number | null;

  @Column("int", { name: "TotalViolentCrimes", nullable: true })
  totalViolentCrimes: number | null;
}
