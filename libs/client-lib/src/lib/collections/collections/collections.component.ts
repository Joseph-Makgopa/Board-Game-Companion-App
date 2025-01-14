import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';


@Component({
  selector: 'board-game-companion-app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private router:Router) {}

  collections: collectionList[] = new Array<collectionList>();

  // eslint-disable-next-line @typescript-eslint/ban-types
  viewCollection(n:String)
  {
    //
    this.router.navigate(['viewCollection', {my_object: n}] )
  }

  ngOnInit(): void {

    //get collections

    //get images for things in collection

    if(localStorage.getItem("collections") === null ||localStorage.getItem("collections") == "[]")
    {
      //there are no collections
    }
    else
    {
      const  names:string[] = JSON.parse(localStorage.getItem("collections")||"");

      for(let i=0; i<names.length;i++)
      {
        //get the 
        const ids:string[] = JSON.parse(localStorage.getItem(names[i])||"");
        const urls:string[] = new Array<string>();
        for(let j=0; j<ids.length&&j<3;j++)
        {
          if(ids[j]!=null)
          {
            this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+ids[j])
                .subscribe(
                  data=>{
                  const result:string = data.toString();
                  const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                  parseXml.querySelectorAll("thumbnail").forEach(imgUrl=>{
                    urls.push(imgUrl.innerHTML);
                });


          });
          }
        }

        this.collections.push(new collectionList(names[i],urls));
      }
    }
    console.log(this.collections)
  }
}
class collectionList
{
    public name = "";
    public imgUrls:string[] = [];

    constructor( n:string, i:string[])
    {
      this.name=n;
      this.imgUrls = i;
    }
}