import { Component, OnInit, Input } from '@angular/core';

import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})

export class SearchResultsComponent implements OnInit {

  //Intercepting data from parent component
  @Input() flightResults;
  @Input() journeyDetails;

  constructor() {

  }

  ngOnInit() {

  }

}
