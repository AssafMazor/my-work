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

    //https://todoist.com/8/tasks
    //https://todoist.com/8/tasks/5
    //https://todoist.com/8/lables


    this.router.get(`/:userId(\\d+)/tasks`, this.tasksController.getTasks);
    this.router.get(`/:userId(\\d+)/tasks/:taskId(\\d+)`, this.tasksController.getTask);
    this.router.post(`/:userId(\\d+)/addTask/:taskId`,this.tasksController.createTask);
    this.router.post(`/:userId(\\d+)/subTask/:taskId(\\d+)`, this.tasksController.addSubTask);
    this.router.put(`${this.path}/:userId(\\d+)/:taskId(\\d+)`, this.tasksController.updateTask);
    this.router.delete(`${this.path}/:userId(\\d+)/:taskId(\\d+)`, this.tasksController.deleteTask);
  }
}

export default TasksRoute;
