import $ from "jquery";
import { TodayTaskListComponent } from "../components/todayTaskListComponent/todayTaskListComponent";
import { InboxTaskListComponent } from "../components/InboxTaskListComponent/InboxTaskListComponent";
import { ViewTaskComponents } from "../components/viewTaskComponent/viewTaskComponent";
import { UpcomingComponent } from "../components/upcomingComponent/upcomingComponent";
import { TasksService } from '../services/tasks.service';
import { FiltersLabelsComponent } from "../components/filters-LabelsComponent/filtersLabelsComponent";
import { labelTasksListComponent } from "../components/labelTasksListComponent/labelTasksListComponent";

export class UiManagerService {
    private static _instance: UiManagerService;
    tasksService:TasksService = TasksService.Instance;

    constructor(){
    }

    //----------------------------------
    // showInbox
    //----------------------------------

    showInbox(){
        new InboxTaskListComponent(this.tasksService.getTasks());
    }

    //----------------------------------
    // showToday
    //----------------------------------

    showToday(){
        new TodayTaskListComponent(this.tasksService.getAllTasks());
    }

    //----------------------------------
    // showViewTask
    //----------------------------------

    showViewTask(taskId:string){
        $(".view-task-dialog").removeClass("hide")
        new ViewTaskComponents(taskId);
    }

    //----------------------------------
    // showUpcoming
    //----------------------------------

    showUpcoming(){
        new UpcomingComponent(this.tasksService.getAllTasks());
    }

    //----------------------------------
    // showFillterAndLabels
    //----------------------------------

    showFillterAndLabels(){
        new FiltersLabelsComponent();
    }

    showLabelTasksList(labelName:string){
        new labelTasksListComponent(labelName)
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}