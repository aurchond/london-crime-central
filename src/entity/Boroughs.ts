import { Column, Entity, Index } from "typeorm";

@Index("Borough_NM", ["boroughNm"], { unique: true })
@Entity("Boroughs", { schema: "db356_dsmiller" })
export class Boroughs {
  @Column("decimal", {
    primary: true,
    name: "Borough_ID",
    precision: 8,
    scale: 0,
  })
  boroughId: number;

  @Column("varchar", { name: "Borough_NM", unique: true, length: 32 })
  boroughNm: string;
}
