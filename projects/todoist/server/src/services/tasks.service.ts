import { hash } from 'bcrypt';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { HttpException } from '@exceptions/HttpException';
import { ITask
  ,ITaskItem, IResTask } from '@interfaces/tasks.interface';
import tasksModel from '@models/tasks.model';
import { isEmpty } from '@utils/util';

class TaskService {
  public tasks = tasksModel;

  public async findAllTasks(userId:string): Promise<IResTask[]> {
    let tasks: ITaskItem[] = this.tasks.filter((taskItem)=>{
      return taskItem.userId === userId
    })
    
    return tasks.map((task) => {
      return {...{id: task.taskId}, ...task.data}
    });
  }

  public async findTaskById(taskId: string,userId:string): Promise<IResTask> {
    let taskItem: ITaskItem = this.tasks.filter((taskItem)=>{
      return taskItem.userId === userId && taskItem.taskId === taskId
    })[0]

    if (isEmpty(taskItem)) {
      throw new HttpException(400, "You're not taskData");
    }
    return {...{id: taskItem.taskId}, ...taskItem.data}
  }

  public async createTask(taskData: ITask,userId:string){
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");

    this.tasks = [...this.tasks, {
      userId:userId,
      taskId:new Date().getTime().toString(),
      data:taskData
    }];
  }

  public async updateTask(taskData:ITaskItem): Promise<IResTask> {
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");

    let taskItem: ITaskItem = this.tasks.filter((taskItem)=>{
      return taskItem.userId === taskData.userId && taskItem.taskId === taskData.taskId
    })[0];
    if (!taskItem) throw new HttpException(400, "You're not task");

    taskItem.data = taskData.data

    return {...{id: taskItem.taskId}, ...taskItem.data}
  }

  public async deleteTask(taskId: string,userId:string): Promise<ITaskItem[]> {
    let subTaskIdsArr:string[] = [];
    this.getTaskChildrenIds(taskId,userId,subTaskIdsArr);
    
    this.tasks = this.tasks.filter((taskItem) => {
      return !subTaskIdsArr.includes(taskItem.taskId)
    })

    return this.tasks;
  }

  public async getTaskChildrenIds(taskId: string,userId:string,subTaskIdsArr:string[]){
    let task = await this.findTaskById(taskId,userId);
    if(task){
        subTaskIdsArr.push(task.id);        

        task.children.forEach((childId:string) => {
            this.getTaskChildrenIds(childId,userId,subTaskIdsArr)
        })
    }
  }

  public async addSubTask(taskData){
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");
    let parentTask = await this.findTaskById(taskData.data.parentId,taskData.userId);

    this.tasks = [...this.tasks, {
      userId:taskData.userId,
      taskId:new Date().getTime().toString(),
      data:taskData.data
    }];
    parentTask.children = [parentTask.children,taskData.taskId];
  }
}

export default TaskService;
