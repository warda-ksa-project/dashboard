import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  login<T>(body: any): Observable<T> {
    return this.http.post<T>(`${baseUrl}Auth/Login`, body);
  }

  post<T>(apiName: string, body: any): Observable<T> {
    return this.http.post<T>(`${baseUrl}${apiName}`, body);
  }

  get<T>(apiName: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T>(`${baseUrl}${apiName}`, { params: httpParams });
  }

  put<T>(apiName: string, body: any): Observable<T> {
    return this.http.put<T>(`${baseUrl}${apiName}`, body);
  }

  delete<T>(apiName: string, id: string): Observable<T> {
    return this.http.delete<T>(`${baseUrl}${apiName}=${id}`);
  }
}
