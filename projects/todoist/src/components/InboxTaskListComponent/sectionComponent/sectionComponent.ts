import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../../taskListItem/taskListItem";

import '../sectionComponent/sectionComponent.scss';
const sectionTemplate = require('../sectionComponent/sectionComponent.hbs');

export class sectionComponent {
    private tasksService:TasksService = TasksService.Instance;
    private labelsService:LabelsService  = LabelsService.Instance;;
    private sectionName:string;
    private $el:any;
    private parent:any;

    constructor(sectionName:string , parent){
      this.sectionName = sectionName
      this.parent = parent
      this.setHtml();

    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(sectionTemplate({
        sectionName:this.sectionName,
      }))
      
      this.parent.$el.find(".section-list").html(this.$el);
      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
    }
}