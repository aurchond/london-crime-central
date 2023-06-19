import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("crimeType_ID", ["crimeTypeId"], {})
@Index("LSOA_ID", ["lsoaId"], {})
@Entity("Reports", { schema: "db356_dsmiller" })
export class Reports {
  @PrimaryGeneratedColumn({ type: "int", name: "report_ID" })
  reportId: number;

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

  @Column("float", { name: "longitude", nullable: true, precision: 12 })
  longitude: number | null;

  @Column("float", { name: "latitude", nullable: true, precision: 12 })
  latitude: number | null;

  @Column("varchar", { name: "location", nullable: true, length: 64 })
  location: string | null;

  @Column("tinyint", {
    name: "completed",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  completed: boolean | null;
}
