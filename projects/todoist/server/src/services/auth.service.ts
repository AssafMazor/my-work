import { hash, compare } from 'bcrypt';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = userModel;

  public async signup(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const user: User = this.users.find(user => user.email === userData.email);
    if (user) throw new HttpException(409, `You're email ${userData.email} already exists`);

    let newUser = <User>{
      id:userData.id,
      email:userData.email,
      password:userData.password
    };
    this.users.push(newUser);
    return newUser;
  }

  public async login(userData): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const user: User = this.users.find(user => user.email === userData.email && user.password === userData.password);
    console.log(this.users)
    if (!user) throw new HttpException(409, `You're email ${userData.email} not found`);

    return user 
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = this.users.find(user => user.email === userData.email && user.password === userData.password);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
