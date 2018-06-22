import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  flightList = null;
  isOneWayTicket = true;

  journeyDetails = {
    isOneWayTicket: true,
    departure_date: "N/A",
    arrival_date: "N/A",
    origin: "N/A",
    destination: "N/A"
  };

  //Functions to get value from child component to be sent to other child components
  getFlightResults(flightResults){
    this.flightList = flightResults;
  }

  getJourneyType(obj){
    this.journeyDetails = obj;
  }
}
