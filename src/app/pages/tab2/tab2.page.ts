import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from 'src/app/models/registro.model';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  registros: Registro[] = [];
  registro: Registro;

   /* esto es por que como la pantalla de no hay favoritos es un sldie de esta manera le quiero el movimiento */
   sliderOpt ={
    allowSlidePrev: false,
    allowSlideNext: false
   }
   
  constructor(public data: DataLocalService, private actionCtrl: ActionSheetController,
    private socialsharing: SocialSharing, private platform: Platform) { }

  ionViewWillEnter() {
    this.registros = this.data.guardados;
  }

  enviarCorreo() {

    this.data.enviarCorreo();
  }

  abrirRegistro(registro) {
    this.data.abrirRegistro(registro);
  }

  async lanzarMenu(registro: Registro) {

    let guardarBorrarBtn;


    guardarBorrarBtn = {
      text: 'Eliminar',
      icon: 'trash',
      /* como esto esta global no puedo hacer el css en el local, tengo que meterlo en el gloal.css */
      cssClass: 'action-dark',
      handler: () => {
        this.data.borrarRegistro(registro);
      }
    };



    const actionSheet = await this.actionCtrl.create({

      buttons: [{
        text: 'Compartir',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {

          /* me voy a fijar si estoy en modo PWA y comparto, si no uso el cel */
          this.compartirRegistro(registro);


        }
      },
        guardarBorrarBtn,
      {
        text: 'Cancel',
        icon: 'close',
        cssClass: 'action-dark',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  /* esto es para poder compartir en modo PWA */
  compartirRegistro(registro: Registro) {

    if (this.platform.is('cordova')) {
      /* si estoy en cordova o sea un phono */
      this.socialsharing.share(registro.texto, '', '', '');
    } else {
      if (navigator['share']) {
        navigator['share']({
          title: '',
          text: registro.texto,
          url: '',
        })
          .then(() => console.log('Todo correcto'))
          .catch((error) => console.log('Error al compartir', error));
      }
    }

  }

}//fin

