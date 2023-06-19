import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("report_ID", ["reportId"], {})
@Entity("CrimeDetails", { schema: "db356_dsmiller" })
export class CrimeDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "crime_ID" })
  crimeId: number;

  @Column("char", { name: "reportedBy", nullable: true, length: 3 })
  reportedBy: string | null;

  @Column("float", { name: "longitude", nullable: true, precision: 12 })
  longitude: number | null;

  @Column("float", { name: "latitude", nullable: true, precision: 12 })
  latitude: number | null;

  @Column("varchar", { name: "location", nullable: true, length: 64 })
  location: string | null;

  @Column("varchar", { name: "outcome", nullable: true, length: 128 })
  outcome: string | null;

  @Column("int", { name: "report_ID", nullable: true })
  reportId: number | null;
}
