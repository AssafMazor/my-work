import { hash } from 'bcrypt';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { HttpException } from '@exceptions/HttpException';
import { ITask,ITaskItem, IResTask } from '@interfaces/tasks.interface';
import tasksModel from '@models/tasks.model';
import { isEmpty } from '@utils/util';

class TaskService {
  public tasks = tasksModel;

  public async getAllTasks(userId:string): Promise<IResTask[]> {
    let tasks: ITaskItem[] = this.tasks.filter((taskItem)=>{
      return taskItem.userId === userId
    })

    return tasks.map((task) => {
      return {...{id: task.taskId}, ...{data:task.data}}
    });
  }

  public async findTaskById(taskId: string,userId:string): Promise<IResTask> {
    let taskItem: ITaskItem = this.tasks.filter((taskItem)=>{
      return taskItem.userId === userId && taskItem.taskId === taskId
    })[0]
    if (isEmpty(taskItem)) {
      throw new HttpException(400, "You're not taskData getTaskById");
    }
    return {...{id: taskItem.taskId}, ...{data:taskItem.data}};
  }

  public async createTask(userId:string,taskData: ITask): Promise<IResTask[]>{
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");

    let newItemTask = <ITaskItem>{
      userId:userId,
      taskId:new Date().getTime().toString(),
      data:taskData,
    }
    this.tasks = [...this.tasks, newItemTask];
    return this.tasks.map((task) => {
      return {...{id: task.taskId}, ...{data:task.data}}
    });
  }

  public async updateTask(taskData:ITaskItem): Promise<IResTask> {
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");

    let taskItem: ITaskItem = this.tasks.filter((taskItem)=>{
      return taskItem.userId === taskData.userId && taskItem.taskId === taskData.taskId
    })[0];
    if (!taskItem) throw new HttpException(400, "You're not task");

    taskItem.data = taskData.data

    return {...{id: taskItem.taskId}, ...{data:taskItem.data}}
  }

  public async deleteTask(taskId: string,userId:string,taskParentId:string): Promise<IResTask[]> {
    if (isEmpty(taskId)) throw new HttpException(400, "You're not taskData");

    let tasks = []
    let subTaskIdsArr:string[] = [];
    await this.getTaskChildrenIds(taskId,userId,subTaskIdsArr);

    for(const taskItem of this.tasks){
      let taskParent = await this.findTaskById(taskParentId,userId)
     
      taskParent.data.children = taskParent.data.children.filter((childId)=>{
        return !childId.includes(taskId)
      });
      if(!subTaskIdsArr.includes(taskItem.taskId)){
        tasks.push(taskItem)
      }
    }
    this.tasks = tasks;

    return await this.getAllTasks(userId);
  }

  private async getTaskChildrenIds(taskId: string,userId:string,subTaskIdsArr:string[]){
    let task = await this.findTaskById(taskId,userId);
    if(task){
      subTaskIdsArr.push(task.id);        
           
      for(const childId of task.data.children) {
        this.getTaskChildrenIds(childId,userId,subTaskIdsArr)
      };
    }
  } 

  public async addSubTask(task:IResTask,userId:string,taskId:string): Promise<IResTask[]>{
    if (isEmpty(task)) throw new HttpException(400, "You're not taskData");
    let parentTask = await this.findTaskById(task.data.parentId,userId);

    this.tasks = [...this.tasks, {
      userId:userId,
      taskId:taskId,
      data:task.data
    }];
    parentTask.data.children = [...parentTask.data.children,task.id];
    return this.tasks.map((task) => {
      return {...{id: task.taskId}, ...{data:task.data}}
    });
  }

  public async removeLabelFromTasks(labelId:string,userId:string): Promise<IResTask[]>{
    if (isEmpty(labelId)) throw new HttpException(400, "You're not taskData");

    let tasks:IResTask[] = await this.getAllTasks(userId);
    
    for(const task of tasks) {
        task.data.labels = task.data.labels.filter((id:string)=>{
          return id !== labelId
        })
    };

    return tasks;
  }

  public async addTaskLabels(labelsIdArr:string[],userId:string,taskId:string): Promise<IResTask[]>{
    if (isEmpty(labelsIdArr )) throw new HttpException(400, "You're not taskData");

    let task:IResTask = await this.findTaskById(taskId,userId);

    for (const labelId of labelsIdArr) {
      if(!(task).data.labels.includes(labelId)){
        task.data.labels.push(labelId);
      }
    };

    return await this.getAllTasks(userId);
  }

  public async duplicateTask(task:IResTask,userId:string,taskId:string): Promise<IResTask[]>{
    if (isEmpty(task)) throw new HttpException(400, "You're not taskData");
    let subtasksIds:string[] = [];
    await this.getTaskChildrenIds(taskId,userId, subtasksIds);

    for (const subTaskId of subtasksIds) {
      let subTask = await this.findUserTaskById(userId,subTaskId);
      let copySubTask:ITaskItem = JSON.parse(JSON.stringify(subTask));

      copySubTask.taskId = copySubTask.taskId + "_1"

      if(copySubTask.data.parentId !== "-1"){
        copySubTask.data.parentId = copySubTask.data.parentId + "_1";
      };
      let children = JSON.parse(JSON.stringify(copySubTask.data.children));
      copySubTask.data.children = [];

      for (const childId of children) {
        let newChildId = childId + "_1";
        copySubTask.data.children = [...copySubTask.data.children,newChildId];
      };
      this.tasks.push(copySubTask);
    };
    
    return await this.getAllTasks(userId);
  }

  private async findUserTaskById(userId:string,taskId:string): Promise<ITaskItem>{
    let taskItem: ITaskItem = this.tasks.filter((taskItem)=>{
      return taskItem.userId === userId && taskItem.taskId === taskId
    })[0]
    if (isEmpty(taskItem)) {
      throw new HttpException(400, "You're not taskData getTaskById");
    }
    return taskItem
  }
  
  public async editTask(taks:IResTask,userId:string): Promise<IResTask[]>{
    if (isEmpty(taks)) throw new HttpException(400, "You're not taskData");

    let task = await this.findUserTaskById(userId,taks.id);
    task.data = taks.data
   
    return await this.getAllTasks(userId);
  }

  public async finishTask(taskId:string,userId:string): Promise<IResTask[]>{
    if (isEmpty(taskId)) throw new HttpException(400, "You're not taskData");

    let task = await this.findTaskById(taskId,userId);
    task.data.isfinished = true
   
    return await this.getAllTasks(userId);
  }

}//

export default TaskService;
