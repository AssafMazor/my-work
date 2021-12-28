import $ from 'jquery';
import '../headerComponent/headerComponent.scss';

export class HeaderComponents {

    constructor(){
      this.setHtml();
    }

    setHtml(){
      let compiled = require('../headerComponent/headerComponent.html');
      $(".main .header").html(compiled)
    }
}