import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Route } from "@angular/compiler/src/core";
import { Router } from "@angular/router";

const AUTH_SIGNUP_URL = environment.authSignupUrl;
const AUTH_LOGIN_URL = environment.authLoginUrl;

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string = null;

  constructor( private http: HttpClient, private router: Router ) {}

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(AUTH_SIGNUP_URL,
      {
        email : email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError),
    tap( resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(AUTH_LOGIN_URL,
      {
        email : email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
      tap( resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
}

  private handleError(error: HttpErrorResponse){
    let errorMessage = 'An error occured!';

      if(!error.error || !error.error.error){
        return throwError(errorMessage);
      }

      switch(error.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exists.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'Password Incorrect.';
          break;
      }

      return throwError(errorMessage);
  }
}
