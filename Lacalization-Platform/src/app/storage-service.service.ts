import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  constructor() {}

  setitem(name: string, data: any){
    window.localStorage.setItem(name, data);
  }
  
  getitem(key: string){
    return window.localStorage.getItem(key);
  }
}
