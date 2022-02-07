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
    this.router.get(`/:userId(\\d+)/tasks`, this.tasksController.getTasks);
    this.router.get(`/:userId(\\d+)/tasks/:taskId(\\d+)`, this.tasksController.getTask);

    this.router.post(`/:userId(\\d+)/addTask/:taskId`,this.tasksController.createTask);
    this.router.post(`/:userId(\\d+)/subTask/:taskId(\\d+)`, this.tasksController.addSubTask);
    this.router.post(`/:userId(\\d+)/addLabel/:taskId(\\d+)`, this.tasksController.addTaskLabels);
    this.router.post(`/:userId(\\d+)/duplicateTask/:taskId(\\d+)`, this.tasksController.duplicateTask);
    this.router.post(`/:userId(\\d+)/:removeLabel(\\d+)`, this.tasksController.deleteLabel);

    this.router.put(`/:userId(\\d+)/editTask/:taskId(\\d+)`, this.tasksController.editTask);
    this.router.put(`/:userId(\\d+)/finishTask/:taskId(\\d+)`, this.tasksController.finishTask);

    this.router.delete(`/:userId(\\d+)/deleteTask/:taskId(\\d+)`, this.tasksController.deleteTask);
  }
}

export default TasksRoute;
