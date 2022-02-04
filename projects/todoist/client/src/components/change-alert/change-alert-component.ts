import $ from 'jquery';
import { ITask } from '../../interfaces/task.interface';
import { LabelsService } from '../../services/labels.service';
import { TasksService } from '../../services/tasks.service';

import "../change-alert/change-alert-component.scss"
const changeAlertTemplate = require('../change-alert/change-alert-component.hbs');

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
            "id":this.descardTask.id,
            "data":{
                "name":this.descardTask.data.name,
                "title":this.descardTask.data.title,
                "parentId":this.descardTask.data.parentId,
                "sentTime":this.descardTask.data.sentTime,
                "isToday":this.descardTask.data.isToday,
                "labels":this.descardTask.data.labels,
                "isfinished":this.descardTask.data.isfinished,
                "priority":this.descardTask.data.priority,
                "category":this.descardTask.data.category,
                "children":this.descardTask.data.children,
                "sectionId":this.descardTask.data.parentId
            }
        },
        ()=>{}
        );
        $(".change-alert-dialog").addClass("hide");
        $(".view-task-dialog").addClass("hide");
        window.history.back();
    }
}