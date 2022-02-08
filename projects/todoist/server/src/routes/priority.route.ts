import { Router } from 'express';
import  PrioritysController from '@controllers/prioritys.controller';
import { Routes } from '@interfaces/routes.interface';

class PriorityRouter implements Routes {
  public path = '/labels';
  public router = Router();
  public prioritysController = new PrioritysController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/:userId(\\d+)/priorities`, this.prioritysController.getPriorities);
  }
}//

export default PriorityRouter;
