import { Router } from 'express';
import LabelsController from '@controllers/labels.controller';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class TasksRoute implements Routes {
  public path = '/labels';
  public router = Router();
  public labelsController = new LabelsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/:userId(\\d+)/labels`, this.labelsController.getLabels);

    this.router.post(`/:userId(\\d+)/createLabel/:labelId`,this.labelsController.createLabel);

    this.router.put(`/:userId(\\d+)/editLabel/:labelId`,this.labelsController.editLabel);

    // this.router.delete(`/:userId(\\d+)/editLabel/:labelId`,this.labelsController.deleteLabel);
  }
}

export default TasksRoute;
