import { Request } from 'express';

import pool from '../db';
import { IAdmin } from '../types';

export const getUserFromWhiteList = async (req: Request): Promise<IAdmin | undefined> => {
  let ipHeader = req.headers['x-forwarded-for'];

  if (ipHeader && Array.isArray(ipHeader)) {
    ipHeader = ipHeader[0];
  }

  const ip = ipHeader || req.ip || req.socket.remoteAddress || '';

  const sliced = ip.replace(/^::ffff:/, '');

  const admins: IAdmin[] = (await pool.query('SELECT * FROM admins')).rows;

  const user = admins.find(adminData => adminData.admin_ip === sliced);

  return user;
};
