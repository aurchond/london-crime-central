import {
  Column,
  Entity,
  Index,
} from "typeorm";

@Index("Borough_ID", ["boroughId"], {})
@Index("idx_LsoaBurrough", ["lsoaId", "boroughId"], {})
@Index("LSOA_NM", ["lsoaNm"], { unique: true })
@Entity("LSOA", { schema: "db356_dsmiller" })
export class Lsoa {
  @Column("decimal", { primary: true, name: "LSOA_ID", precision: 8, scale: 0 })
  lsoaId: number;

  @Column("varchar", { name: "LSOA_NM", unique: true, length: 35 })
  lsoaNm: string;

  @Column("decimal", {
    name: "Borough_ID",
    nullable: true,
    precision: 8,
    scale: 0,
  })
  boroughId: number | null;
}
