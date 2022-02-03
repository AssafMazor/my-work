import $ from 'jquery';
import { HeaderComponents } from "../header/header-component"
import { MenuComponent } from "../menu/menu-component"

import "../main/main-component.scss"
const mainTemplate = require('../main/main-component.hbs');

export class MainComponent {
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