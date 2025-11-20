import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import { payload } from '../dto/user.dto';

dotenv.config();

const { JWT_SECRET = '' } = process.env;

export class encrypt {
  static async encryptPassword(password: string) {
    return bcrypt.hash(password, bcrypt.genSaltSync(8));
  }

  static comparePassword(hashPassword: string, password: string) {
    return bcrypt.compare(hashPassword, password);
  }

  static generateToken(payload: payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  }
}
