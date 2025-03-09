import { Component, AfterViewInit, output, EventEmitter, Output, Input } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @Output()location=new EventEmitter()
  private map!: L.Map;
  private marker!: L.Marker;
  @Input()lat: any = 0;
  @Input()lng: any = 0;

  ngOnInit(){
    console.log('ggg',this.lng)
    console.log('ggg',this.lat)

  }
  ngAfterViewInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = this.lat==0?position.coords.latitude:this.lat;
          this.lng = this.lng==0?position.coords.longitude:this.lng;
          console.log("MapComponent  ngAfterViewInit   this.lng:",  this.lng)
          this.initMap(); // Initialize map after getting location
        },
        () => {
          console.error('Geolocation permission denied or unavailable.');
          // this.lat = 30.0444; // Default Cairo, Egypt
          // this.lng = 31.2357;
          this.initMap();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // this.lat = 30.0444;
      // this.lng = 31.2357;
      this.initMap();
    }
  
  }

  private initMap(): void {
    this.map = L.map('map').setView([this.lat, this.lng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    // Add a draggable marker
    this.marker = L.marker([this.lat, this.lng], { draggable: true })
      .addTo(this.map)
      // .bindPopup('Drag me!')
      .openPopup();
      console.log('ggg',this.lng)
      console.log('ggg',this.lat)
    // Update lat/lng when dragged
    this.marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      this.lat = position.lat;
      console.log("MapComponent  this.marker.on   this.lat:",  this.lat)
      this.lng = position.lng;
      console.log("MapComponent  this.marker.on   this.lng:",  this.lng)
      this.location.emit({lat:this.lat,lng:this.lng})
    });
    console.log('ggg',this.lng)
    console.log('ggg',this.lat)
  }
}