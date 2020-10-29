import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {

  values : any;
  constructor(private http: HttpClient) { }      // The dependency injection property is utilized.

  ngOnInit() {
    this.getValues();
  }

  getValues(){
    this.http.get('http://localhost:5000/api/values').subscribe(response =>{
      this.values = response;
    }, error => {
      console. log(error);
    });
  }

}
