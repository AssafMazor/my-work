import $ from "jquery";
import { TodayTaskListComponent } from "../components/todayTaskList/today-task-list-component";
import { InboxTaskListComponent } from "../components/Inbox-task-list/Inbox-task-list-component";
import { ViewTaskComponent } from "../components/viewTask/view-task-component";
import { UpcomingComponent } from "../components/upcomingTasksList/upcoming-tasks-list-component";
import { TasksService } from '../services/tasks.service';
import { FiltersLabelsComponent } from "../components/filters-labels/filters-labels-component";
import { labelTasksListComponent } from "../components/label-tasks-list/label-tasks-list-component";
import { SignUpComponent } from '../components/sign-up/sign-up-component';
import { LoginComponent } from "../components/login/login-component";

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
        new ViewTaskComponent(taskId);
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

    //----------------------------------
    // showLabelTasksList
    //----------------------------------
    
    showLabelTasksList(labelName:string){
        new labelTasksListComponent(labelName)
    }

    //----------------------------------
    // showLoginPage
    //----------------------------------

    showSignUpPage(){
        new SignUpComponent()
    }

    //----------------------------------
    // showLoginPage
    //----------------------------------

    showLoginPage(){
        new LoginComponent()
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}