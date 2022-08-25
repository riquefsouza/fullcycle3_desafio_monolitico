import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id?: Id;
    name: string;
    email: string;
    salesPrice: number;
};

export default class Product extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _email: string;
    private _salesPrice: number;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._email = props.email;
        this._salesPrice = props.salesPrice;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }
}