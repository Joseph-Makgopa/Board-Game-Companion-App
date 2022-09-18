import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { alert } from '../../models/alert/alert';


@Injectable()
export class AlertService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.api = "http://localhost:3333/api/";
    //this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
  }

  getAllUserMessages():Observable<alert[]>{
    let param = new HttpParams();
    param = param.set("name",sessionStorage.getItem("name") as string);
    param = param.set("email",sessionStorage.getItem("email") as string);

    return this.httpClient.get<alert[]>(this.api + "alerts/retreive-all-alerts",{params: param});
  }

  markAsRead(id:string):Observable<alert>{
      return this.httpClient.put<alert>(this.api + "alerts/mark-as-read",{id: id});
  }
}
