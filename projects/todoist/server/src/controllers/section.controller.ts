import { NextFunction, Request, Response } from 'express';
import { ISectionItem  , IResSection } from '@interfaces/sections.interface';
import  SectionService from '@services/section.service';

class SectionsController {
  public sectionService = new SectionService();

  public getSections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let userId:string = req.params.userId;
      let priorities: IResSection[] = await this.sectionService.getAllSections(userId);
      res.status(200).json(priorities);
    } catch (error) {
      next(error);
    }
  };
}//
export default SectionsController;
