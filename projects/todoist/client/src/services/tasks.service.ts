import { ITask } from "../interfaces/task.interface"
import { EventEmitter } from 'events';
import moment from "moment";
import { isEmpty } from "lodash";
import $ from 'jquery'

export class TasksService {
    private static _instance: TasksService;

    eventEmitter: EventEmitter;
    taskList: ITask[] = [];

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    //----------------------------------
    // laodData
    //----------------------------------

    laodData(callback) {
        $.ajax({
            type: "get",
            url: 'http://localhost:3000/88/tasks',
            success: (result) => {
                this.taskList = result;
                callback()
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // returnNewTask
    //----------------------------------

    createEmptyTask(): ITask {
        return {
            "id": new Date().getTime().toString(),
            "data": {
                "name": "",
                "title": "",
                "isToday": false,
                "parentId": "-1",
                "sentTime": new Date().getTime(),
                "labels": [],
                "isfinished": false,
                "priority": 4,
                "category": 1,
                "children": [],
                "sectionId": "-1"
            }
        }
    }

    //----------------------------------
    // getAllTasks
    //----------------------------------

    getAllTasks(): ITask[] {
        return this.taskList
    }

    //----------------------------------
    // getTasks
    //----------------------------------

    getTasks(): ITask[] {
        return this.getTasksBySection("-1");
    }

    //----------------------------------
    // getTasksBySection
    //----------------------------------

    getTasksBySection(sectionId: string): ITask[] {
        let fillterd = this.taskList.filter((task) => {
            return task.data.sectionId === sectionId && task.data.parentId === "-1"
        });
        return fillterd;
    }

    //----------------------------------
    // getTask
    //----------------------------------

    getTask(taskId: string): ITask | null {
        let fillterd = this.taskList.filter((task) => {
            return task.id === taskId;
        });
        return !isEmpty(fillterd) ? fillterd[0] : null;
    }

    //----------------------------------
    // getCompletedTask
    //----------------------------------

    getCompletedTask(taskId: string): ITask {
        let fillterd = this.taskList.filter((task) => {
            return task.id === taskId
        });
        return fillterd[0];
    }

    //----------------------------------
    // removeLabelsFromTasks
    //----------------------------------

    removeLabelsFromTasks(labelId: string, callback: Function) {
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/removeLabels/${labelId}`,
            data: {
                "labelId": labelId
            },
            success: (result) => {
                this.taskList = result
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // getCompletedTasksList
    //----------------------------------

    getCompletedTasksList(sectionId: string): ITask[] {
        let fillterd = this.taskList.filter((task) => {
            return task.data.isfinished && task.data.sectionId === sectionId
        });
        return fillterd
    }

    //----------------------------------
    // getTasksByLabelId
    //----------------------------------

    getTasksByLabelId(labelId: string): ITask[] {
        let fillterd = this.taskList.filter((task) => {
            return task.data.labels.includes(labelId);
        })
        return fillterd
    }

    //----------------------------------
    // getTasksByDate
    //----------------------------------

    getTasksByDate(day: number): ITask[] {
        let start = moment(day).startOf('day').valueOf();
        let end = moment(day).endOf('day').valueOf();

        let fillterd = this.taskList.filter((task) => {
            return task.data.sentTime >= start && task.data.sentTime < end;
        })
        return fillterd;
    }

    //----------------------------------
    // getOverDueTasks
    //----------------------------------

    getOverDueTasks(): ITask[] {
        let fillterd = this.taskList.filter((task) => {
            return new Date(task.data.sentTime).getDate() === new Date().getDate() - 1
        })
        return fillterd;
    }

    //----------------------------------
    // addTaskLabels
    //----------------------------------

    addTaskLabels(taskId: string, choosenLabels: string[], callback: Function) {
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/addLabel/${taskId}`,
            data: {
                "labels": JSON.stringify(choosenLabels)
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit('task-change');
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // addTasknewLabels
    //----------------------------------

    addTasknewLabels(taskId: string, choosenLabels: string[], callback: Function) {
        setTimeout(() => {
            let task = this.getTask(taskId);
            if (task) {
                choosenLabels.forEach((id: string) => {
                    if (!(task!).data.labels.includes(id)) {
                        task!.data.labels.push(id);
                    }
                })
            }
            this.eventEmitter.emit('task-change');
            callback()
        }, 0);
    }

    //----------------------------------
    // addNewTask
    //----------------------------------

    addNewTask(newTask: ITask, callback: Function) {
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/addTask/${newTask.id}`,
            data: {
                "data": JSON.stringify(newTask.data)
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit('task-change');
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // addSubTask
    //----------------------------------

    addSubTask(newSubTask: ITask, task: ITask, callback: Function) {
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/subTask/${newSubTask.id}`,
            data: {
                "task": JSON.stringify(newSubTask)
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit('addNewSubTask', task, newSubTask);
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // getTaskLabels
    //----------------------------------

    getTaskLabels(labelId: string) {
        let fillterd = this.taskList.filter((task: ITask) => {
            return task.data.labels.includes(labelId)
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    //----------------------------------
    // getLabelTaskLength
    //----------------------------------

    getLabelTaskLength(labelId: string): number {
        var fillterd = this.taskList.filter((task: ITask) => {
            return task.data.labels.includes(labelId);
        })
        return fillterd.length
    }

    //----------------------------------
    // getNotFinishedTasks
    //----------------------------------

    getNotFinishedTasks() {
        let fillterd = this.taskList.filter((task) => {
            return !task.data.isfinished && task.data.parentId === "-1"
        })
        return fillterd
    }

    //----------------------------------
    // duplicateTask
    //----------------------------------

    duplicateTask(task: ITask, callback: Function) {
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/duplicateTask/${task.id}`,
            data: {
                "data": JSON.stringify(task)
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit('task-change');
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // editTask
    //----------------------------------

    editTask(editedTask: ITask, callback: Function) {
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/88/editTask/${editedTask.id}`,
            data: {
                "data": JSON.stringify(editedTask)
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit('task-change');
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // finishTask
    //----------------------------------

    finishTask(task: ITask, callback: Function) {
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/88/finishTask/${task.id}`,
            data:{
                data:task
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit('task-change');
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // deleteTask
    //----------------------------------

    deleteTask(taskId: string, callback: Function) {
        let task = this.getTask(taskId);
        if(task){
            $.ajax({
                type: "DELETE",
                url: `http://localhost:3000/88/deleteTask/${taskId}`,
                data:{
                    data:task.data.parentId
                },
                success: (result) => {
                    this.taskList = result
                    this.eventEmitter.emit('task-change');
                    callback();
                },
                error: () => {
                    return;
                }
            });
        }
    }

    //----------------------------------
    // getCompletedTasks
    //----------------------------------

    getCompletedTasks() {
        let fillterd = this.taskList.filter((task) => {
            return task.data.isfinished
        });
        return fillterd
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}

