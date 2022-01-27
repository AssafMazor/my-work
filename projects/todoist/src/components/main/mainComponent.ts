import $ from 'jquery';
import { HeaderComponents } from "../headerComponent/headerComponent"
import { MenuComponent } from "../menuComponent/menuComponent"

import "./mainComponent.scss"
const mainTemplate = require('./mainComponent.hbs');

export class MainComponents {
  private $el:any;

  constructor(){
    this.setHtml();
    this.createComponents();
  }

  createComponents(){
    new HeaderComponents();
    new MenuComponent();
  }

  setHtml(){
    this.$el = $(mainTemplate({}));
    $(".main").html(this.$el);
  }
}