import 'dotenv/config';
import '@/index';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import TasksRoute from './routes/tasks.route';
import labelsRoute from './routes/labels.route';
import PriorityRouter from './routes/priority.route';
import SectionRouter from './routes/section.route';

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(),new TasksRoute(),new labelsRoute(),new PriorityRouter(),new SectionRouter()]);

app.listen();
