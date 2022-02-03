import { NextFunction, Request, Response } from 'express';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { ITask,ITaskItem , IResTask } from '@interfaces/tasks.interface';
import  TaskService from '@services/tasks.service';

class TasksController {
  public taskService = new TaskService();

  public getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId:string = String(req.params.userId);
      const findAllUTasksData: IResTask[] = await this.taskService.findAllTasks(userId);
      res.status(200).json({ data: findAllUTasksData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };


//   {userId: "",
//   taskId,
//   data:
// }




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
      const userId:string = String(req.params.userId);
      const taskData: ITask = req.body;
      await this.taskService.createTask(taskData,userId);
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateTaskData: IResTask = await this.taskService.updateTask(req.body);

      res.status(200).json({ data: updateTaskData, message: 'updated' });
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
      await this.taskService.addSubTask(taskData);

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}
export default TasksController;
