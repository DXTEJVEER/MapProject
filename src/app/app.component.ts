import { Component, OnInit } from '@angular/core';
import { LocationService } from './services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public menuToggle: boolean = false;
  public selectedSport: string = 'basketball';

  constructor(private service: LocationService) {}
  public basketballDetails: any = [];
  public badmintonDetails: any = [];
  public boxingDetails: any = [];
  public baseballDetails: any = [];
  public footballDetails: any = [];
  public swimmingDetails: any = [];
  public jetskiDetails: any = [];
  public golfDetails: any = [];
  public cyclingDetails: any = [];
  public billiardDetails: any = [];
  public tennisDetails: any = [];

  public isDark = false;
  ngOnInit() {
    this.basketballDetails = this.service.getBasketballDetails();
    this.badmintonDetails = this.service.getBadmintonDetails();
    this.boxingDetails = this.service.getBoxingDetails();
    this.baseballDetails = this.service.getBaseballDetails();
    this.footballDetails = this.service.getFootballDetails();
    this.swimmingDetails = this.service.getSwimmingDetails();
    this.jetskiDetails = this.service.getJetskiDetails();
    this.golfDetails = this.service.getGolfDetails();
    this.cyclingDetails = this.service.getCyclingDetails();
    this.billiardDetails = this.service.getBilliardDetails();
    this.tennisDetails = this.service.getTennisDetails();

    try{
      if(localStorage.getItem('mode') === 'dark'){
        this.isDark = true;
        console.log('dark mode applied')
      }
      else{
        this.isDark = false;
        console.log('light mode applied')
      }
    }
    catch (e){
      console.log('could not get mode.default light mode loaded.')
    }
  }

  selectSports(sport: any) {
    this.selectedSport = sport;
    this.menuToggle = true;
  }
  change() {
    window.location.reload();
  }
  storeLight() {
    localStorage.setItem('mode', 'light');
    console.log('changed mode to ', localStorage.getItem('mode'));
    this.change();
  }
  storeDark() {
    localStorage.setItem('mode', 'dark');
    console.log('changed mode to ', localStorage.getItem('mode'));
    this.change();
  }
  onCheckboxChange(evt:any){
    if (evt.target.checked) {
      console.log('checked');
      this.storeDark();
    } else {
      console.log('unchecked');
      this.storeLight();
    }
  }
}
