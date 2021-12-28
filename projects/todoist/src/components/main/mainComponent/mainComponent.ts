import $ from 'jquery';
import { get } from 'lodash';
import { HeaderComponents } from "../../header/headerComponent/headerComponent"

export class MainComponents {

    constructor(){
      let firstName: string = 'John';
      this.setHtml();

      new HeaderComponents();
    }

    setHtml(){
      let compiled = require('../mainComponent/mainComponent.html');
      $(".main").html(compiled)
    }
}