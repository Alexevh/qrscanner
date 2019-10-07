
export class Registro {

    public format: string;
    public texto: string;
    public type; string;
    public icon: string;
    public created: Date;

    constructor(format: string, texto: string) {

        this.format = format;
        this.texto = texto;
        this.created = new Date();
        this.determinarTipo();

    }

    private determinarTipo() {

        const inicioTexto = this.texto.substr(0, 4);

        switch (inicioTexto) {

            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;
            case 'geo:':
                this.type = 'geo';
                this.icon = 'pin';
                break;
            default:
                this.type = 'no-config';
                this.icon = 'create';
                break;

        }
    }
}