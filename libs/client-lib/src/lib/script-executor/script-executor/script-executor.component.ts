import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { Router } from '@angular/router';
import { script } from '../../shared/models/scripts/script';
import { neuralnetwork } from '../../shared/models/neuralnetwork/neuralnetwork';
import { BggSearchService } from '../../board-game-search/bgg-search-service/bgg-search.service';
import * as tf from '@tensorflow/tfjs'
import { entity } from '../../shared/models/editor/entity';
import { inputParameters } from '../../shared/models/scripts/inputParameters';
import { StorageService } from '../../shared/services/storage/storage.service';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  current:script;
  code = "";
  replay = false;
  folder = "42a58303-990e-4230-94c6-a9f5dd629500"
  hours = "hours";
  h = 0;
  min = "min";
  m = 0;
  s = 0;
  sec = "sec";
  gameName = ""
  showInput = false;
  showOutput = false;
  inputBlock = false;
  outputBlock = false;
  inputResult:any[] = [];
  parameters:inputParameters[] = [];
  outputMessage = "";
  statusMessages:string[] = [];
  warningMessages:string[] = [];
  programStructure!:entity;
  count = 0;



  constructor(private readonly searchService:BggSearchService, private readonly scriptService:ScriptService, private router:Router,private readonly storageService: StorageService) {
    this.current = this.router.getCurrentNavigation()?.extras.state?.['value'];
    this.searchService.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.current.boardgame)
            .subscribe(
              
              data=>{
                
                
                const result:string = data.toString();

                const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                parseXml.querySelectorAll("name").forEach(n=>{
                    
                    this.gameName = n.getAttribute("value") || "";
                 
                });
              })
  }

  
  back()
  {
    //Timer
    if(localStorage.getItem("sessions") !== null)
    {
      let c = JSON.parse(localStorage.getItem("sessions")||"")
      let name = "#" + (c.length + 1);
      c.push(name);
      localStorage.setItem("sessions", JSON.stringify(c))
      let session = []
      session.push(this.gameName)
      session.push(this.current.name)
      session.push("2")
      session.push("N/A")
      this.hours = this.h + this.hours + " "
      this.min = this.m + this.min + " "
      this.sec = this.s + this.sec 
      session.push(this.hours + this.min + this.sec)
      session.push("Win")
      const now = new Date();
      session.push(now.toLocaleDateString())
      session.push(this.current.boardgame)
      localStorage.setItem(name, JSON.stringify(session))
    }
    else
    {
      let c = [];
      let name = "#1";
      c.push(name);
      localStorage.setItem("sessions", JSON.stringify(c))
      let session = []
      session.push(this.gameName)
      session.push(this.current.name)
      session.push("2")
      session.push("N/A")
      this.hours = this.h + this.hours + " "
      this.min = this.m + this.min + " "
      this.sec = this.s + this.sec
      session.push(this.hours + this.min + this.sec)
      session.push("Win")
      const now = new Date();
      session.push(now.toLocaleDateString())
      session.push(this.current.boardgame)
      localStorage.setItem(name, JSON.stringify(session))
    }

    //this.router.navigate(['scripts']);
  }
  
  ngOnInit(): void {

    setInterval(() => {
      this.s++
      if(this.s === 60)
      {
        
        this.m++
      }
      if(this.m == 60)
      {
        this.h++
      }
    }, 1000);

      this.scriptService.getFileData(this.current.build.location).subscribe({
        next:(val)=>{
          
           this.code = val;
           this.interpreter(val);  
        },
        error:(e)=>{
          console.log(e)
        },
        complete:()=>{
          console.log("complete")
          this.back()
        }  
      })
  }
  async neuralnetworks():Promise<any>{
    return (async(name:string,input:number[])=>{
      const info = await this.storageService.getByIndex("networks","name",name);

      if(info.name == undefined)
        return "";

      const model = await tf.loadLayersModel(`indexeddb://${info.name}`);
      const min = tf.tensor(info.min);
      const max = tf.tensor(info.max);

      const inputTensor = tf.tensor2d(input,[1,input.length]);
      const normalizedInput = inputTensor.sub(min).div(max).sub(min);
      const tensorResult = model.predict(normalizedInput) as tf.Tensor;
      //tensorResult.print();
      const index = Array.from(tf.argMax(tensorResult,1).dataSync())[0];
      return info.labels[index];
    })
}
  async play(): Promise<void>{
    this.replay = false;
    const code = new Function("model",this.code);
    const model =  await this.neuralnetworks();
    code(model);
    this.replay = true;
  }
  output(){
    return (async(value:string) => {
      this.outputBlock = true;
      this.showOutput = true;
      this.outputMessage = value;
      
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.outputBlock){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
    })
  }

  input(){
    
    return (async(prompt:string,type:string,options?:string[])=>{
      this.inputBlock = true;
      this.showInput = true;
      this.parameters = [{
        prompt:prompt,
        type:type,
        options:options
      }]
      const elem = document.getElementById("TextOutput");
      if(elem)
        elem.innerHTML += prompt;
      
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
  
      return this.inputResult[0];
    })
  }


  inputGroup(){
    return (async(parameters:inputParameters[])=>{
      console.log(parameters);
      
      this.inputBlock = true;
      this.showInput = true;
      this.parameters = parameters;
  
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
  
      return this.inputResult;
    })
  }

  submitInput(value:any[]): void{
    this.inputResult = value;
    this.showInput = false;
    this.inputBlock = false;
  }

  okayOutput(): void{
    this.showOutput = false;
    this.outputBlock = false;
  }
  async getSandBox():Promise<any>{
    return {
      
      model: await this.neuralnetworks(),
      input: this.input(),
      inputGroup: this.inputGroup(),
      output: this.output()

    }
  }

  async interpreter(source:string){
    const strCode = 'with (sandbox) { ' + source + '}';
    const code = new Function('sandbox', strCode);
    const sandbox = await this.getSandBox();

    const proxy = new Proxy(sandbox,{
      has:(target:any,key:any)=>{
        return true;
      },
      get:(target:any,key:symbol)=>{
        if(target[key] === undefined && key != Symbol.unscopables){
          if(Object.keys(window).includes(String(key)) || String(key) === "document"){
            this.warningMessages.push("Access to " + String(key) + " is not allowed.");
          }
          console.log(key)
          return ()=>{return "Access to " + String(key) + " is not allowed."};
        }

        return target[key];            
      }     
    })

    this.warningMessages = [];
    code(proxy);
  }
}
