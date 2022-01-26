import $ from 'jquery';
import { HeaderComponents } from "../headerComponent/headerComponent"
import { MenuComponent } from "../menuComponent/menuComponent"
import { TasksService } from"../../services/tasks.service";
import { LabelsService } from"../../services/labels.service";
import { SectionsService } from '../../services/section.service'; 

import "./mainComponent.scss"
const mainTemplate = require('./mainComponent.hbs');

export class MainComponents {
  private tasksService:TasksService = TasksService.Instance;
  private labelService:LabelsService  = LabelsService.Instance;
  private sectionsService:SectionsService  = SectionsService.Instance;
  private $el:any;

  constructor(){
    this.setHtml();

    this.tasksService.laodData(()=>{
      this.sectionsService.laodData(()=>{
        this.labelService.laodData(()=>{
          $(".loader").addClass("hide");
          this.createComponents();
        });  
      })
    });
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