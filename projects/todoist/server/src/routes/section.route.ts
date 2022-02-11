import { Router } from 'express';
import  SectionsController from '@controllers/section.controller';
import { Routes } from '@interfaces/routes.interface';

class SectionRouter implements Routes {
  public path = '/labels';
  public router = Router();
  public sectionsController = new SectionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/:userId(\\d+)/sections`, this.sectionsController.getSections);
  }
}//

export default SectionRouter;
