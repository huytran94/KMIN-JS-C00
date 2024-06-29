export class Book {
    constructor({id, name, price = 0, provider = ""}) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._provider = provider;
    }
}