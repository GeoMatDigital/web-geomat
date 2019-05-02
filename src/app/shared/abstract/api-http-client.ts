import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

type RelativeUrl = string | number | (number | string)[] | undefined;

export interface Options {
  urlFromRoot?: boolean
}

export abstract class ApiHttpClient {
  private readonly _baseUrl: string;

  protected constructor(
    private _http: HttpClient,
    baseUrl: string | number | (number | string)[],
  ) {
    if (Array.isArray(baseUrl)) {
      this._baseUrl = baseUrl.reduce<string>((url, part) => `${url}/${part.toString()}`, environment.apiUrl);
    } else {
      this._baseUrl = `${environment.apiUrl}/${baseUrl.toString}`;
    }
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) { // client side error
      console.error('[ApiHttpClient] Client error:', error.error.message);
    } else { // request error
      console.error(`[ApiHttpClient] Server error (${error.status}):`, error.error);
    }
    return throwError('Network request failed');
  }

  protected get<T>(relativeUrl?: RelativeUrl, options?: Options): Observable<T> {
    const url = this.generateUrl(relativeUrl, options);
    return this._http.get<T>(url).pipe(
      catchError(ApiHttpClient.handleError),
    );
  }

  protected list<T>(relativeUrl?: RelativeUrl, options?: Options): Observable<T[]> {
    return this.get<T[]>(relativeUrl, options);
  }

  private generateUrl(relativeUrl: RelativeUrl, options?: Options) {
    let baseUrl = this._baseUrl;
    if (options && options.urlFromRoot) {
      baseUrl = environment.apiUrl;
    }
    if (!relativeUrl) {
      return baseUrl;
    } else if (Array.isArray(relativeUrl)) {
      return relativeUrl.reduce<string>((url, part) => `${url}/${part.toString()}`, baseUrl);
    } else {
      return `${baseUrl}/${relativeUrl.toString()}`;
    }
  }

  protected post<T>(body: any, relativeUrl?: string): Observable<T> {
    const url = relativeUrl ? `${this._baseUrl}/${relativeUrl}` : this._baseUrl;
    return this._http.post<T>(url, body).pipe(
      catchError(ApiHttpClient.handleError)
    );
  }
}
