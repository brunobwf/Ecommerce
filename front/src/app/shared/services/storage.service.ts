import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public getLocalUser() : Usuario{
    let user = localStorage.getItem('localUser');
    if(user){
      return JSON.parse(user);
    }else{
      return null;
    }
  }

  public setLocalUser(obj){
    if(obj == null){
      localStorage.removeItem('localUser');
    }else{
      localStorage.setItem('localUser', JSON.stringify(obj));
    }
  }
}