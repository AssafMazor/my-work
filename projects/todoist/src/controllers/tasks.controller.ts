import { NextFunction, Request, Response } from 'express';
import { CreateTaskDto } from '@dtos/tasks.dto';
import { ITask } from '@interfaces/tasks.interface';
import  TaskService from '@services/tasks.service';

class TasksController {
  public taskService = new TaskService();

  public getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUTasksData: ITask[] = await this.taskService.findAllTasks();

      res.status(200).json({ data: findAllUTasksData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = String(req.params.id);
      const findOneTaskData: ITask = await this.taskService.findTaskById(taskId);

      res.status(200).json({ data: findOneTaskData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskDto = req.body;
      const createTaskData: ITask = await this.taskService.createTask(taskData);

      res.status(201).json({ data: createTaskData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = String(req.params.id);
      const taskData: CreateTaskDto = req.body;
      const updateTaskData: ITask[] = await this.taskService.updateTask(taskId, taskData);

      res.status(200).json({ data: updateTaskData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = String(req.params.id);
      const deleteTaskData: ITask[] = await this.taskService.deleteTask(taskId);

      res.status(200).json({ data: deleteTaskData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TasksController;
