import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stored = localStorage.getItem('insurai_auth');
  let token = null;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      token = parsed.token;
    } catch {
      token = stored;
    }
  }

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

