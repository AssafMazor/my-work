import { IsEmail, IsString } from 'class-validator';

export class CreateTaskDto {
  public name: string;
  public title: string;
  public parentId: string;
  public isToday: boolean;
  public sentTime: number;
  public labels: number[];
  public title: string;
  public isfinished: boolean;
  public priority: number;
  public category: number;
  public id: string;
  public children: string[];
  public sectionId:string;
}
