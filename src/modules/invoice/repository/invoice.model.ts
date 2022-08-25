import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import Product from "../domain/product.entity";

@Table({
  tableName: "invoices",
  timestamps: false,
})

//address: Address; // value object
//items: Product[]; // Product entity
/*
    id: string;
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    total: number;
*/

export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: true })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipCode: string;

  /*
  items: {
      id: string;
      name: string;
      price: number;
  }[];
  */

  //@Column({ allowNull: false })
  //items: Product[];

  @Column({ allowNull: false })
  total: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
