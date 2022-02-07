import { NextFunction, Request, Response } from 'express';
import { IResLabel , ILabel , ILabelItem } from '@interfaces/labels.interface';
import  labelsService from '@services/labels.service';

class LabelsController {
  public taskService = new labelsService();

  public getLabels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string = req.params.userId;
      let labels: IResLabel[] = await this.taskService.getAllLabels(userId);
      res.status(200).json(labels);
    } catch (error) {
      next(error);
    }
  };
  
  public createLabel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string = req.params.userId;
      let label: IResLabel = JSON.parse(req.body.data);
      let labels: IResLabel[] = await this.taskService.createLabel(label,userId);

      res.status(200).json(labels);
    } catch (error) {
      next(error);
    }
  };

  public editLabel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string = req.params.userId;
      let labelId:string = req.params.labelId;
      let labelName: string = req.body.data;
      let labels: IResLabel[] = await this.taskService.editLabel(labelName,labelId,userId);

      res.status(200).json(labels);
    } catch (error) {
      next(error);
    }
  };

  // public deleteLabel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     let userId:string = req.params.userId;
  //     let labelId:string = req.params.labelId;
  //     let labels: IResLabel[] = await this.taskService.deleteLabel(labelId,userId);

  //     res.status(200).json(labels);
  //   } catch (error) {
  //     next(error);
  //   }
  // };


}//
export default LabelsController;
