import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let authReq = req;

  if (localStorage.getItem('token')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `bearer ${localStorage.getItem('token')}`,
        'Accept-Language': localStorage.getItem('lang') === 'ar' ? 'ar' : 'en',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }else{
    authReq = req.clone({
      setHeaders: {

        'Accept-Language': localStorage.getItem('lang') === 'ar' ? 'ar' : 'en',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }

  return next(authReq);
};
