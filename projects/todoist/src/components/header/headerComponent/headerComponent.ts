import $ from 'jquery';

import '../headerComponent/headerComponent.scss';
const headerTemplate = require('../headerComponent/headerComponent.hbs');

export class HeaderComponents {

    constructor(){
      this.setHtml();
    }

    setHtml(){
      $(".main .header").html(headerTemplate())

      this.initEvents();
    }
    
    initEvents(){
      $(".menu-btn").on("click" , (e) => {
        $(".main .menu").toggleClass("show")
      })
      // $(".home-page-btn").on("click" , (e) => {
      // })
    }
}