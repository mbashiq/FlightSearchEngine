import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.less']
})
export class SearchFormComponent implements OnInit {

  constructor() { }

  isOneWayTicket: boolean = true;

  origin: string = "PNQ";
  destination: string = "DEL";
  departure_date: string = "2013/01/01";
  arrival_date: string = "2013/01/05";
  passengers: number = 1;

  hideForm: true;

  //Passing data from child to parent component
  @Output() sendFlightResults: EventEmitter<any>= new EventEmitter();
  @Output() sendJourneyType: EventEmitter<any>= new EventEmitter();


  ngOnInit() {

  }

  //Load data from JSON and pass it to filter search preferences
  searchFlight(){
    var self = this;
    $.ajax({
      type: "GET",
      url: "assets/flight_data.json",
      dataType: "json",
      success: function(data) {
        self.filterSearch(data);
      },
      error: function(){
        alert("json not found");
      }
    });
  }

  //Get formatted date from timestamp
  getFormattedDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
  }

  //Get formatted time from timestamp
  getFormattedTime(date) {
    var t = new Date(date),
        hours = '' + (t.getHours()),
        minutes = '' + t.getMinutes();

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    return [hours, minutes].join(':');
  }


  filterSearch(flightData){
    var self = this;
    var returnFlightList = [];
    var oneWayFlightList = [];
    var finalFlightList = [];

    oneWayFlightList = this.getFlightList(flightData, true);
    if(!self.isOneWayTicket){
      returnFlightList = this.getFlightList(flightData, false);
    }
    console.log(oneWayFlightList);

    if(!this.isOneWayTicket){

      for(var oneWayFlight of oneWayFlightList){
        for(var returnFlight of returnFlightList){
          if(oneWayFlight.airlineCode == returnFlight.airlineCode){
            var obj = Object.assign({}, oneWayFlight);
            obj.returnDepartureTime = returnFlight.departureTime;
            obj.returnArrivalTime = returnFlight.arrivalTime;
            obj.price = oneWayFlight.price + returnFlight.price;
            obj["returnFlightNumber"] = returnFlight.flightNumber;
            finalFlightList.push(obj);
          }
        }
      }

    }else{
      finalFlightList = oneWayFlightList;
    }

    console.log(finalFlightList); //Final FLights List to be displayed

    //Send Flight Data to Results page via child-parent-child heirarchy
    this.sendFlightResults.emit(finalFlightList);
    var journeyDetails = {
      isOneWayTicket: this.isOneWayTicket,
      departure_date: this.departure_date,
      arrival_date: this.arrival_date,
      origin: this.origin,
      destination: this.destination
    };
    this.sendJourneyType.emit(journeyDetails);
  }


  //Function for OneWay and Return Flights
  getFlightList(flightData, isOneWay){
    var self = this;
    var flightList = $(flightData).filter(function (index, arr){
      arr.departureTime = self.getFormattedTime(arr.departure);
      arr.arrivalTime = self.getFormattedTime(arr.arrival);
      if(isOneWay){
        return (
          self.getFormattedDate(arr.departure) == self.departure_date &&
          arr.origin == self.origin &&
          arr.destination == self.destination &&
          arr.availableSeats >= self.passengers
        );
      }else{
        return (
          self.getFormattedDate(arr.departure) == self.arrival_date &&
          arr.origin == self.destination &&
          arr.destination == self.origin &&
          arr.availableSeats >= self.passengers
        );
      }
    });
    return flightList;
  }



}
