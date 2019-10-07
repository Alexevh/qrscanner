import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slidesOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private scanner: BarcodeScanner, private data: DataLocalService) { }


  ionViewDidEnter() {
    this.scan();
  }

  scan() {

    this.scanner.scan().then(barcodeData => {
      //console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled){
        this.data.guardarRegistro(barcodeData.format, barcodeData.text);
      
      }

    }).catch(err => {
      this.data.guardarRegistro( 'QRCode', 'geo:-34.91306923812173,-56.19171753367311' );
    });
  }

}
