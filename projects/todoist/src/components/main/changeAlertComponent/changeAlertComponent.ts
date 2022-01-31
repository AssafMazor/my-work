import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ILabel } from '../../../interfaces/label.interface';
import { ITask } from '../../../interfaces/task.interface';
import { LabelsService } from '../../../services/labels.service';
import { TasksService } from '../../../services/tasks.service';

import "./changeAlertComponent.scss"
const changeAlertTemplate = require('../changeAlertComponent/changeAlertComponent.hbs');

export class ChangeAlertComponent {
    private $el:any;
    private taskService:TasksService = TasksService.Instance;
    private labelsService:LabelsService = LabelsService.Instance;
    private descardTask:ITask;

    constructor(descardTask){
        this.descardTask = descardTask
        this.setHtml();
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
        this.$el = $(changeAlertTemplate({}));
        $(".main .change-alert-dialog").html(this.$el);

        this.initEvents();
    }  

    //----------------------------------
    // setHtml
    //----------------------------------

    initEvents(){
        this.$el.find(".close-wrap").on("click" , (e) => {
            this.onCloseBtnClick(e);
        })
        this.$el.find(".popper").on("click" , (e) => {
            this.onPopperClick(e);
        })
        this.$el.find(".discard-btn").on("click" , (e) => {
            this.onDiscardBtnClick(e);
        })
    }

    //----------------------------------
    // onCloseBtnClick
    //----------------------------------

    onCloseBtnClick(e){
        $(".change-alert-dialog").addClass("hide");
    }

    //----------------------------------
    // onPopperClick
    //----------------------------------

    onPopperClick(e){
        $(".change-alert-dialog").addClass("hide");
    }

    //----------------------------------
    // onDiscardBtnClick
    //----------------------------------

    onDiscardBtnClick(e){
        this.taskService.editTask({
            "name":this.descardTask.name,
            "title":this.descardTask.title,
            "parentId":this.descardTask.parentId,
            "sentTime":this.descardTask.sentTime,
            "isToday":this.descardTask.isToday,
            "labels":this.descardTask.labels,
            "isfinished":this.descardTask.isfinished,
            "priority":this.descardTask.priority,
            "category":this.descardTask.category,
            "id":this.descardTask.id,
            "children":this.descardTask.children,
            "sectionId":this.descardTask.parentId
        }
        );
        $(".change-alert-dialog").addClass("hide");
        $(".view-task-dialog").addClass("hide");
        window.history.back();
    }
}