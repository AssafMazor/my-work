import { NextFunction, Request, Response } from 'express';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { ITask,ITaskItem , IResTask } from '@interfaces/tasks.interface';
import  TaskService from '@services/tasks.service';
import { allColors } from 'winston/lib/winston/config';

class TasksController {
  public taskService = new TaskService();

  public getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string = req.params.userId;
      let findAllUTasksData: IResTask[] = await this.taskService.getAllTasks(userId);
      res.status(200).json(findAllUTasksData);
    } catch (error) {
      next(error);
    }
  };

  public getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId:string = String(req.params.userId);
      const taskId = String(req.params.id);
      const taskData: IResTask = await this.taskService.findTaskById(taskId,userId);

      res.status(200).json({ data: taskData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let taskData: IResTask = JSON.parse(req.body.data);

      console.log(JSON.stringify(taskData));

      //let tasks:IResTask[] = await this.taskService.createTask(userId,taskData);
      res.status(200);

    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateTaskData: IResTask = await this.taskService.updateTask(req.body);
      res.status(200).json({ data: updateTaskData });
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = String(req.params.id);
      const userId = String(req.params.userId);
      await this.taskService.deleteTask(taskId,userId);

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
  
  public addSubTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData = String(req.body);
      let tasks = await this.taskService.addSubTask(taskData);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };
}
export default TasksController;
