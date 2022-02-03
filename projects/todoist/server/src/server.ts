import 'dotenv/config';
import '@/index';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import TasksRoute from './routes/tasks.route';

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(),new TasksRoute()]);
console.log("dfgjgfodjhigdfo[pgih diydcgvofj gyokyh rekpey,j mertegpnmhdip[yio")

app.listen();
