import $ from 'jquery';
import { HeaderComponents } from "../headerComponent/headerComponent"
import { TaskListComponents } from "../taskList/taskListComponents"
import { MenuComponent } from "../menuComponent/menuComponent"
import { TasksService } from"../../services/tasks.service";
import { LabelsService } from"../../services/labels.service";

import "./mainComponent.scss"
const mainTemplate = require('./mainComponent.hbs');

export class MainComponents {
    private tasksService:TasksService = TasksService.Instance;
    private labelService:LabelsService  = LabelsService.Instance;
    private $el:any;

    constructor(){
      this.setHtml();

      this.tasksService.laodData(()=>{
        this.labelService.laodData(()=>{
          $(".loader").addClass("hide");
          this.createComponents();
        });  
      });
    }

    createComponents(){
      new HeaderComponents();
      new MenuComponent();
      new TaskListComponents(this.tasksService.getTasks());
    }

    setHtml(){
      this.$el = $(mainTemplate({}));
      $(".main").html(this.$el)
    }
}