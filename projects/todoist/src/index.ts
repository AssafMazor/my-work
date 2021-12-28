import './style.scss';
import { MainComponents } from"./components/main/mainComponent/mainComponent";
import { LabelsService } from"./services/labels.service";


function init() {
  new LabelsService();
  new MainComponents();
}

init();
