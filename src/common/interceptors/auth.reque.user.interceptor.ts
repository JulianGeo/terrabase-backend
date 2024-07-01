import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {

    constructor(private readonly cls: ClsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && user.id) {
            const userId = Number(user.id);
            if (!isNaN(userId)) {
                this.cls.set('user', userId);
            } else {
                throw new Error('User.id is not a number');
            }
        } else {
            throw new Error('User or user.id is not defined');
        }
        return next.handle().pipe(tap(() => { }));
    }
}