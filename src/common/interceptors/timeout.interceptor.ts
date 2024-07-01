import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { Observable, TimeoutError, catchError, throwError, timeout } from "rxjs";
import { MAX_TIME_REQUEST } from "../constants/constants";


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            timeout(MAX_TIME_REQUEST),
            catchError(error => {
                if (error instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException());
                }
                return throwError(() => error);
            })
        );
    }

}