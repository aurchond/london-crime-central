import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("crimeType_NM", ["crimeTypeNm"], { unique: true })
@Index("idx_CrimeTypeIsViolent", ["crimeTypeId", "violent"], {})
@Entity("CrimeTypes", { schema: "db356_dsmiller" })
export class CrimeTypes {
  @PrimaryGeneratedColumn({ type: "int", name: "crimeType_ID" })
  crimeTypeId: number;

  @Column("varchar", {
    name: "crimeType_NM",
    nullable: true,
    unique: true,
    length: 32,
  })
  crimeTypeNm: string | null;

  @Column("tinyint", {
    name: "violent",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  violent: boolean | null;
}
