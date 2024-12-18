export class CustomError extends Error {
    constructor (name: string, message: string ){
        super(message);
        this.name = name;
    }

    alert(){
        alert(this.name + ":\n" + this.message);
    }
}