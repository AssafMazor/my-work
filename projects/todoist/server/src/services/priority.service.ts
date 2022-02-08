import { hash } from 'bcrypt';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { HttpException } from '@exceptions/HttpException';
import { IResPriority,IPriorityItem } from '@interfaces/prioritys.interface';
import priorityModel from '@models/priority.model';
import { isEmpty } from '@utils/util';

class PrioritiesService {
  public priorities = priorityModel; 

  public async getAllPriorities(userId:string): Promise<IResPriority[]> {
    let priorities = this.priorities.filter((priority)=>{
      return priority.userId === userId
    })

    return priorities.map((priority) => {
      return {...{id: priority.priorityId}, ...{name:priority.priorityName}}
    });
  }
  
}//

export default PrioritiesService;
