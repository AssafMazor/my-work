import { hash } from 'bcrypt';
// import { CreateTaskDto } from '@dtos/tasks.dto';
import { HttpException } from '@exceptions/HttpException';
import { ILabel , IResLabel,ILabelItem } from '@interfaces/labels.interface';
import labelModel from '@models/labels.model';
import { isEmpty } from '@utils/util';

class LabelsService {
  public labels = labelModel; 

  public async getAllLabels(userId:string): Promise<IResLabel[]> {
    let labels: ILabelItem[] = this.labels.filter((label)=>{
      return label.userId === userId
    })

    return labels.map((label) => {
      return {...{id: label.labelId}, ...{data:label.data}}
    });
  }

  private async findLabelById(labelId:string,userId:string): Promise<IResLabel> {
    let labelItem: ILabelItem = this.labels.filter((labelItem)=>{
      return labelItem.userId === userId && labelItem.labelId === labelId
    })[0]
    if (isEmpty(labelItem)) {
      throw new HttpException(400, "You're not taskData getTaskById");
    }
    return {...{id: labelItem.labelId}, ...{data:labelItem.data}};
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
}//deleteLabel

export default LabelsService;
