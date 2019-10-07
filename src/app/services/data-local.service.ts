import { Injectable, OnInit } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController, ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService  implements OnInit{

  guardados: Registro[] = [];


  async ngOnInit() {
  // await this.cargarRegistros();

  }



   constructor(private storage: Storage, private navCTRL: NavController, private iab: InAppBrowser, private file: File, 
    private mail: EmailComposer, private toastCTRL: ToastController) {

    this.cargarRegistros();
   
   }



   async guardarRegistro(format: string, texto: string) {
 
    /* esto es para prevenir el poco probable caso de que fueramos a guardar algo antes de inicializar
    el registro en memoria */
    await this.cargarRegistros();

    const nuevoRegistro = new Registro(format, texto);
    /* LO PONGO AL PRINCIIO DEL ARREGLO */
    this.guardados.unshift(nuevoRegistro);
    console.log('me llego para guardar', texto);
    this.storage.set('registros', this.guardados);
    this.abrirRegistro(nuevoRegistro);
    

  }

  async cargarRegistros(){
    const historial = await this.storage.get('registros');
    this.guardados = historial || [];
    return  historial;
    
  }

  abrirRegistro(registro: Registro){

    this.navCTRL.navigateForward('/tabs/tab2');

    switch(registro.type){

      case 'http':
          const browser = this.iab.create(registro.texto, '_system');
         
      break;
      case 'geo':
        this.navCTRL.navigateForward(`/tabs/tab2/mapa/${ registro.texto }`);
      break;
      default:
      //sarasa
      break;  
    }


  }

  enviarCorreo() {

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push( titulos );

    this.guardados.forEach( registro => {

      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.texto.replace(',', ' ') }\n`;

      arrTemp.push( linea );

    });

    this.crearArchivoFisico( arrTemp.join('') );

  }

  crearArchivoFisico( text: string ) {

    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
      .then( existe => {
        console.log('Existe archivo?', existe );
        return this.escribirEnArchivo( text );
      })
      .catch( err => {

        return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
                .then( creado => this.escribirEnArchivo( text ) )
                .catch( err2 => console.log( 'No se pudo crear el archivo', err2 ));

      });


  }

  async escribirEnArchivo( text: string ) {

    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );

    const archivo = `${this.file.dataDirectory}/registros.csv`;
    // console.log(this.file.dataDirectory + 'registros.csv');

    const email = {
      to: 'correo5@servidor.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aquí tienen sus backups de los scans - <strong>ScanApp</strong>',
      isHtml: true
    };

    // Send a text message using default options
    this.mail.open(email);

  }

  borrarRegistro(registro: Registro){

    
    for( let i = 0; i < this.guardados.length; i++){ 
      if ( this.guardados[i].created === registro.created) {
        this.guardados.splice(i, 1); 
        i--;
      }
      /*sobreescribo los datos */
      this.storage.set('registros', this.guardados);
      this.presentarToast(`El registro ha sido eliminado`);
      
   }

    

  }

  async presentarToast(mensaje)
  {
    const toast = await this.toastCTRL.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
    });

    toast.present();

  }
}
