import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// users 레파지토리를 사용해야하기 때문에 class형으로 사용
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
  }
}

/* export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}
*/
