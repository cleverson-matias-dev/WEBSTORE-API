export class CategoryName {
    private _value: string;

    constructor(value: string) {
        if (!this.validate(value)) {
            throw new Error('Nome de Category inválida.');
        }
        this._value = value;
    }

    static create(value: string): CategoryName {
        return new CategoryName(value);
    }

    private validate(value: string): boolean {
        if (!value || value.length < 3 || value.length > 100) {
            return false;
        }

        const regexValido = /^[a-zA-Z0-9À-ÿ\s!@#$%&*()\-=_+[\]{};:,.?/\\|]+$/;

        return regexValido.test(value);
    }

    val(): string {
        return this._value;
    }
}
