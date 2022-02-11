import { NextFunction, Request, Response } from 'express';
import { IPriorityItem  , IResPriority } from '@interfaces/prioritys.interface';
import  PrioritiesService from '@services/priority.service';

class PrioritiesController {
  public prioritiesService = new PrioritiesService();

  public getPriorities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string = req.params.userId;
      let priorities: IResPriority[] = await this.prioritiesService.getAllPriorities(userId);
      res.status(200).json(priorities);
    } catch (error) {
      next(error);
    }
  };
}//
export default PrioritiesController;
