import { hash } from 'bcrypt';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { HttpException } from '@exceptions/HttpException';
import { ILabel , IResLabel,ILabelItem } from '@interfaces/labels.interface';
import labelModel from '@models/labels.model';
import { isEmpty } from '@utils/util';
import TaskService from './tasks.service';

class LabelsService {
  public labels = labelModel; 
  public taskService = new TaskService();

  public async getAllLabels(userId:string): Promise<IResLabel[]> {
    let labels: ILabelItem[] = this.labels.filter((label)=>{
      return label.userId === userId
    })

    return labels.map((label) => {
      return {...{id: label.labelId}, ...{data:label.data}}
    });
  }

  private async findLabelById(labelId:string,userId:string): Promise<ILabelItem> {
    let labelItem: ILabelItem = this.labels.filter((labelItem)=>{
      return labelItem.userId === userId && labelItem.labelId === labelId
    })[0]
    if (isEmpty(labelItem)) {
      throw new HttpException(400, "You're not taskData getTaskById");
    }
    return labelItem
  }

  public async createLabel(label:IResLabel,userId:string): Promise<IResLabel[]> {
    if (isEmpty(label)) throw new HttpException(400, "You're not label");

    let newLabelItem = <ILabelItem>{
      userId:userId,
      labelId:label.id,
      data:label.data,
    }
    this.labels = [...this.labels, newLabelItem];
    return this.labels.map((label) => {
      return {...{id: label.labelId}, ...{data:label.data}}
    });
  }

  public async editLabel(labelName:string,labelId:string,userId:string): Promise<IResLabel[]> {
    if (isEmpty(labelId)) throw new HttpException(400, "You're not label");

    let label = await this.findLabelById(labelId,userId);
    label.data.name = labelName
    return await this.getAllLabels(userId);
  }
  
  public async deleteLabel(labelId:string,userId:string): Promise<object> {
    if (isEmpty(labelId)) throw new HttpException(400, "You're not label");
    let labels:ILabelItem[] = []
    for(const label of this.labels){
      if(label.labelId !== labelId){
        labels.push(label);
      }
    }
    this.labels = labels
    let taskList = await this.taskService.removeLabelFromTasks(labelId,userId)
    let labelList = await this.getAllLabels(userId);
    return {labels:labelList,tasks:taskList}
  }
   
  public async toggleFavoriteLabel(labelId:string,userId:string): Promise<IResLabel[]> {
    if (isEmpty(labelId)) throw new HttpException(400, "You're not label");
    let label:ILabelItem = await this.findLabelById(labelId,userId);
    label.data.favorite = ! label.data.favorite
   
   return await this.getAllLabels(userId)
  }
}//

export default LabelsService;
