import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

function mapPaginationParams(params: Record<string, unknown>): Record<string, unknown> {
  if (!params) return {};
  const out: Record<string, unknown> = { ...params };
  if (out['sortingExpression'] !== undefined) {
    out['sortBy'] = out['sortingExpression'];
    delete out['sortingExpression'];
  }
  if (out['sortingDirection'] !== undefined) {
    out['sortDirection'] = (out['sortingDirection'] === 1 || out['sortingDirection'] === '1') ? 'desc' : 'asc';
    delete out['sortingDirection'];
  }
  if (out['enName'] !== undefined || out['arName'] !== undefined || out['titleEn'] !== undefined || out['titleAr'] !== undefined || out['enTitle'] !== undefined || out['arTitle'] !== undefined || out['searchTerm'] !== undefined) {
    out['searchTerm'] = out['searchTerm'] || out['enName'] || out['arName'] || out['titleEn'] || out['titleAr'] || out['enTitle'] || out['arTitle'] || '';
    delete out['enName']; delete out['arName']; delete out['titleEn']; delete out['titleAr']; delete out['enTitle']; delete out['arTitle'];
  }
  if (out['storeName'] !== undefined) {
    out['searchTerm'] = out['searchTerm'] || out['storeName'];
    delete out['storeName'];
  }
  return out;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  post<T>(apiName: string, body: any): Observable<T> {
    return this.http.post<T>(`${baseUrl}${apiName}`, body);
  }

  get<T>(apiName: string, params?: Record<string, unknown>): Observable<T> {
    let httpParams = new HttpParams();
    const mapped = params ? mapPaginationParams(params) : {};

    Object.keys(mapped).forEach(key => {
      const v = mapped[key];
      if (v !== null && v !== undefined) {
        httpParams = httpParams.set(key, String(v));
      }
    });

    return this.http.get<T>(`${baseUrl}${apiName}`, { params: httpParams });
  }

  put<T>(apiName: string, body: any): Observable<T> {
    return this.http.put<T>(`${baseUrl}${apiName}`, body);
  }

  delete<T>(apiName: string, id: string): Observable<T> {
    return this.http.delete<T>(`${baseUrl}${apiName}/${id}`);
  }

  /** PUT with ID in URL (e.g. Traders/approve/123) */
  putWithId<T>(apiName: string, id: string | number, body?: any): Observable<T> {
    return this.http.put<T>(`${baseUrl}${apiName}/${id}`, body ?? null);
  }
}
