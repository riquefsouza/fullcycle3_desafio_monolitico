import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id?: Id;
    name: string;
    price: number;
};

export default class Product implements AggregateRoot {
    private _id: Id;
    private _name: string;
    private _email: string;
    private _price: number;

    constructor(props: ProductProps) {
        this._id = props.id || new Id();
        this._name = props.name;
        this._price = props.price;
    }

    get id(): Id {
        return this._id;
    }    

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get price(): number {
        return this._price;
    }
}