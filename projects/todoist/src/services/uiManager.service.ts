import $ from "jquery";
import { TodayTaskListComponent } from "../components/todayTaskListComponent/todayTaskListComponent";
import { InboxTaskListComponent } from "../components/InboxTaskListComponent/InboxTaskListComponent";
import { ViewTaskComponents } from "../components/viewTaskComponent/viewTaskComponent";
import { UpcomingComponent } from "../components/upcomingComponent/upcomingComponent";

export class UiManagerService {

    private static _instance: UiManagerService;

    constructor(){

    }

    //----------------------------------
    // showInbox
    //----------------------------------

    showInbox(inboxTasks){
        new InboxTaskListComponent(inboxTasks);
    }

    //----------------------------------
    // showToday
    //----------------------------------

    showToday(todayTasks){
        new TodayTaskListComponent(todayTasks);
    }

    //----------------------------------
    // showViewTask
    //----------------------------------

    showViewTask(taskId){
        $(".view-task-dialog").removeClass("hide")
        new ViewTaskComponents(taskId);
    }

    //----------------------------------
    // showUpcoming
    //----------------------------------

    showUpcoming(upComingTasks){
        new UpcomingComponent(upComingTasks);
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}