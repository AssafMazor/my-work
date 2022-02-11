

export class DataService {
    private static _instance: DataService;

    constructor(){ 
    }

    public static get Instance(){
      return this._instance || (this._instance = new this());
    }
}