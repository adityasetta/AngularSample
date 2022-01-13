import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, retry, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Route } from "@angular/compiler/src/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import * as fromApp from '../store/app.reducer';
import * as AuthAction from './store/auth.action';

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
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor( private http: HttpClient, 
    private router: Router, 
    private store: Store<fromApp.AppState> ) {}

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
    // this.user.next(null);
    this.store.dispatch(new AuthAction.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      // this.user.next(loadedUser);
      this.store.dispatch(new AuthAction.Login({ email: loadedUser.email, 
        userId: loadedUser.id, 
        token: loadedUser.token, 
        expirationDate: new Date(userData._tokenExpirationDate)}));

      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    // this.user.next(user);
    this.store.dispatch(new AuthAction.Login({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate
    }));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
