import { Router } from 'express';
import TasksController from '@controllers/tasks.controller';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class TasksRoute implements Routes {
  public path = '/tasks';
  public router = Router();
  public tasksController = new TasksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:userId(\\d+)`, this.tasksController.getTasks);
    this.router.get(`${this.path}/:userId(\\d+)/:taskId(\\d+)`, this.tasksController.getTask);
    this.router.post(`${this.path}/:userId(\\d+)`, this.tasksController.createTask);
    this.router.post(`${this.path}/:userId(\\d+)/:taskId(\\d+)`, this.tasksController.updateTask);
    this.router.delete(`${this.path}/:userId(\\d+)/:taskId(\\d+)`, this.tasksController.deleteTask);
    this.router.post(`${this.path}/:userId(\\d+)/:taskId(\\d+)`, this.tasksController.addSubTask);
  }
}

export default TasksRoute;
