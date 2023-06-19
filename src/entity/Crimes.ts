import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("crimeType_ID", ["crimeTypeId"], {})
@Index(
  "idx_CrimesTable",
  ["crimeId", "year", "month", "lsoaId", "crimeTypeId"],
  {}
)
@Index("LSOA_ID", ["lsoaId"], {})
@Entity("Crimes", { schema: "db356_dsmiller" })
export class Crimes {
  @PrimaryGeneratedColumn({ type: "int", name: "crime_ID" })
  crimeId: number;

  @Column("decimal", { name: "year", nullable: true, precision: 4, scale: 0 })
  year: number | null;

  @Column("decimal", { name: "month", nullable: true, precision: 2, scale: 0 })
  month: number | null;

  @Column("decimal", {
    name: "LSOA_ID",
    nullable: true,
    precision: 8,
    scale: 0,
  })
  lsoaId: number | null;

  @Column("int", { name: "crimeType_ID", nullable: true })
  crimeTypeId: number | null;
}
