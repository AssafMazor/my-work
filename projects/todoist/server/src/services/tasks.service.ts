import { hash } from 'bcrypt';
import { CreateTaskDto } from '@dtos/tasks.dto';
import { HttpException } from '@exceptions/HttpException';
import { ITask } from '@interfaces/tasks.interface';
import taskModel from '@models/tasks.models';
import { isEmpty } from '@utils/util';

class TaskService {
  public tasks = taskModel;

  public async findAllTasks(): Promise<ITask[]> {
    const tasks: ITask[] = this.tasks;
    return tasks;
  }

  public async findTaskById(taskId: string): Promise<ITask> {
    const findTask: ITask = this.tasks.find(task => task.id === taskId);
    if (!findTask) throw new HttpException(409, "You're not task");

    return findTask;
  }

  public async createTask(taskData: any): Promise<ITask> {
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");

    taskData.id = new Date().getTime().toString();
    this.tasks = [...this.tasks, {taskData}];

    return taskData;
  }

  public async updateTask(taskId: string, taskData: any): Promise<ITask[]> {
    if (isEmpty(taskData)) throw new HttpException(400, "You're not taskData");

    const findTask: ITask = this.tasks.find(task => task.id === taskId);
    if (!findTask) throw new HttpException(409, "You're not task");

    const updateTaskData: ITask[] = this.tasks.map((task: ITask) => {
      if (task.id === findTask.id) {
        task.data = taskData
      }
      return task;
    });

    return updateTaskData;
  }

  public async deleteTask(taskId: string): Promise<ITask[]> {
    const findTask: ITask = this.tasks.find(task => task.id === taskId);
    if (!findTask) throw new HttpException(409, "You're not task");

    const deleteTaskData: ITask[] = this.tasks.filter(task => task.id !== findTask.id);
    return deleteTaskData;
  }
}

export default TaskService;
