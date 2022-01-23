import $ from "jquery";
import { TodayTaskListComponent } from "../components/todayTaskListComponent/todayTaskListComponent";
import { inboxTaskListComponent } from "../components/InboxTaskListComponent/InboxTaskListComponent";
import { viewTaskComponents } from "../components/viewTaskComponent/viewTaskComponent";

export class UiManagerService {

    private static _instance: UiManagerService;

    constructor(){

    }

    //----------------------------------
    // showInbox
    //----------------------------------

    showInbox(inboxTasks){
        new inboxTaskListComponent(inboxTasks);
    }

    //----------------------------------
    // showToday
    //----------------------------------

    showToday(todayTasks){
        new TodayTaskListComponent(todayTasks);
    }

    //----------------------------------
    // showInbox
    //----------------------------------

    showViewTask(taskId){
        $(".view-task-dialog").removeClass("hide")
        new viewTaskComponents(taskId);
    }


    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}