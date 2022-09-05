import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { script } from '../../models/scripts/script';
import { rating } from '../../models/scripts/rating';
import { user } from '../../models/general/user';
import { User } from 'aws-sdk/clients/budgets';
import { entity } from '../../models/editor/entity';
import { myScript } from '../../models/scripts/my-script';
import { oldScript } from '../../models/scripts/old-script';
import { version } from '../../models/scripts/version';
import { automataScript } from '../../models/scripts/automata-script';
import { downloadScript } from '../../models/scripts/download-script';

@Injectable()
export class ScriptService {
  private url = "";
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.url = "https://api.geekdo.com/xmlapi2/"
    this.api = "http://localhost:3333/api/";
    //this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
  }
 
  // createScript(name:string,boardgame:string,files:string[])

  getApiUrl():string{
    return this.api;
  }

  getBbgUrl():string{
    return this.url;
  }

  getBoardGameByName(name:string,exact:boolean):Observable<any>{

    return this.httpClient.get(this.url + "search?query="+name+"&type=boardgame" + (exact ? "&exact=1":""),{responseType: 'text'})
  }

  getScriptById(id:string):Observable<script>{
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.get<script>(this.api + "scripts/retrieve/byid",{params:param});
  }

  checkName(name:string):Observable<boolean>{
    let param = new HttpParams();
    param = param.set("name",name);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);
    param = param.set("userName",sessionStorage.getItem("name") as string);

    return this.httpClient.get<boolean>(this.api + "my-scripts/check-name",{params:param});
  }

  saveScript(formData:FormData):Observable<myScript>{
    return this.httpClient.post<myScript>(this.api + "my-scripts/create-script",formData);
  }

  alreadyDownloaded(author:user,name:string,version:version):Observable<boolean>{
    let param = new HttpParams();
    param = param.set("authorName",author.name);
    param = param.set("authorEmail",author.email);
    param = param.set("ownerEmail",sessionStorage.getItem("email") as string);
    param = param.set("ownerName",sessionStorage.getItem("name") as string);
    param = param.set("name",name);
    param = param.set("vMajor",version.major);
    param = param.set("vMinor",version.minor);
    param = param.set("vPatch",version.patch);

    return this.httpClient.get<boolean>(this.api + "downloads/already-downloaded",{params: param})
  }

  download(id:string):Observable<downloadScript>{
    let param = new HttpParams();
    param = param.set("id",id);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);
    param = param.set("userName",sessionStorage.getItem("name") as string);

    return this.httpClient.get<downloadScript>(this.api + "automata-scripts/download",{params: param});
  }

  getScriptsCreatedByMe():Observable<myScript[]>{
    let param = new HttpParams();
    param = param.set("userName",sessionStorage.getItem("name") as string);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);

    return this.httpClient.get<myScript[]>(this.api + "my-scripts/all-my-script",{params:param});
  }

  update(id:string,exp:boolean,description:string): Observable<myScript>{
    return this.httpClient.put<myScript>(this.api + "my-scripts/update",{id:id,export:exp,description:description});
  }

  release(id:string,version:version): Observable<{success:boolean,message?:string,content?:automataScript}>{
    let param = new HttpParams();
    param = param.set("id",id);
    param = param.set("vMajor",version.major);
    param = param.set("vMinor",version.minor);
    param = param.set("vPatch",version.patch);

    return this.httpClient.get<{success:boolean,message?:string,content?:automataScript}>(this.api + "my-scripts/release",{params:param});
  }

  getAutomataScripts():Observable<automataScript[]>{
    return this.httpClient.get<automataScript[]>(this.api + "automata-scripts/retreive-all");
  }

  getOldVersions(name:string,author:user):Observable<oldScript[]>{
    let param = new HttpParams();
    param = param.set("name",name);
    param = param.set("userName",author.name);
    param = param.set("userEmail",author.email);

    return this.httpClient.get<oldScript[]>(this.api + "automata-scripts/old-versions",{params: param});
  }

  getScriptsDownloadedByMe(owner:user):Observable<script[]>{
    let param = new HttpParams();
    param = param.set("ownerName",owner.name);
    param = param.set("ownerEmail",owner.email);

    return this.httpClient.get<script[]>(this.api + "scripts/retrieve/downloadedByMe",{params:param});
  }

  getOther(owner:user):Observable<script[]>{
    let param = new HttpParams();
    param = param.set("ownerName",owner.name);
    param = param.set("ownerEmail",owner.email);

    return this.httpClient.get<script[]>(this.api + "scripts/retrieve/other",{params:param});
  }

  addComment(scriptId:string,commentId:string):void{
    this.httpClient.put(this.api + "automata-scripts/add-comment",{scriptId:scriptId,commentId:commentId}).subscribe();
  }

  removeScript(id:string):Observable<void>{
    return this.httpClient.delete<void>(this.api + "scripts/remove/" + id);
  }

  updateScriptInfo(data:any):Observable<script>{
    return this.httpClient.post<script>(this.api + "scripts/update",data);
  }

  updateStatus(id:string,value:number,message:string):Observable<script>{
    return this.httpClient.put<script>(this.api + "scripts/update/status",{id:id,value:value,message:message});
  }

  retrieveAllScript():Observable<script[]>{
    return this.httpClient.get<script[]>(this.api + "scripts/retrieve/all");
  }

  getFileData(file:string):Observable<any>{
    return this.httpClient.get(file,{responseType:'text'});
  }

  updateFile(id:string,content:string):Observable<{status:string,message:string,programStructure:entity}>{
    return this.httpClient.put<{status:string,message:string,programStructure:entity}>(this.api + "scripts/update-file",{id:id,content:content});
  }

  rate(user:user,script:string,value:number):Observable<rating>{
    return this.httpClient.post<rating>(this.api + "automata-scripts/rate",{user:user,script:script,value:value});
  }

  getRating(user:user,script:string):Observable<rating>{
    let param = new HttpParams();
    param = param.set("userName",user.name);
    param = param.set("userEmail",user.email);
    param = param.set("script",script);
    
    return this.httpClient.get<rating>(this.api + "automata-scripts/retrieve-rating",{params:param});
  }

  countRating(script:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("script",script);

    return this.httpClient.get<number>(this.api + "automata-scripts/count-rating",{params:param});
  }

  averageRating(script:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("script",script);

    return this.httpClient.get<number>(this.api + "automata-scripts/average-rating",{params:param});
  }

  updateScriptModels(script:string,networks:string[]):Observable<script>{
    return this.httpClient.put<script>(this.api + "scripts/update-models",{script:script,networks:networks});
  }


}
