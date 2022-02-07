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

      res.status(200).json(taskData);
    } catch (error) {
      next(error);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let taskData: ITask = JSON.parse(req.body.data);

      let tasks:IResTask[] = await this.taskService.createTask(userId,taskData);
      res.status(200).json(tasks);

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
      const taskId:string = req.params.taskId;
      const userId:string = req.params.userId;
      const taskParentId:string = req.body.data
      let tasks:IResTask[] = await this.taskService.deleteTask(taskId,userId,taskParentId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };
  
  public addSubTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let task: IResTask = JSON.parse(req.body.task);
      let taskId:string =  req.params.taskId;
      let tasks = await this.taskService.addSubTask(task,userId,taskId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public deleteLabel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let labelId: string = req.body.labelId
      let tasks = await this.taskService.removeLabelFromTasks(labelId,userId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public addTaskLabels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let taskId:string =  req.params.taskId;
      let labelsIdArr: string[] = req.body.labels;
      let tasks = await this.taskService.addTaskLabels(labelsIdArr,userId,taskId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };
  
  public duplicateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let taskId:string =  req.params.taskId;
      let taks: IResTask = JSON.parse(req.body.data);
      let tasks:IResTask[] = await this.taskService.duplicateTask(taks,userId,taskId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public editTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let taks: IResTask = JSON.parse(req.body.data);
      let tasks:IResTask[] = await this.taskService.editTask(taks,userId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public finishTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string =  req.params.userId;
      let taskId:string =  req.params.taskId;

      let tasks:IResTask[] = await this.taskService.finishTask(taskId,userId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

}//
export default TasksController;
