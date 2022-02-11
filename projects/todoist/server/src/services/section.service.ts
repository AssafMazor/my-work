import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { IResSection,ISectionItem } from '@interfaces/sections.interface';
import SectionModel from '@models/sections.model';
import { isEmpty } from '@utils/util';

class SectionService {
  public sections = SectionModel; 

  public async getAllSections(userId:string): Promise<IResSection[]> {
    let sections = this.sections.filter((priority)=>{
      return priority.userId === userId
    })

    return sections.map((section) => {
      return {...{id: section.sectionId}, ...{name:section.sectionName}}
    });
  }
}//

export default SectionService;
