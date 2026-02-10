import { Component, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import * as L from 'leaflet';

// Fix Leaflet default marker icon path issue with Angular/webpack
const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

let mapIdCounter = 0;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Output() location = new EventEmitter<{ lat: number; lng: number }>();
  @Input() lat: number = 24.7136; // Default: Riyadh
  @Input() lng: number = 46.6753;
  @Input() readonly: boolean = false;
  @Input() autoLocate: boolean = true;

  mapId = `map-${++mapIdCounter}`;
  locating = false;
  private map!: L.Map;
  private marker!: L.Marker;
  private initialized = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const hasInputCoords = this.lat && this.lng &&
        Number(this.lat) !== 24.7136 && Number(this.lng) !== 46.6753 &&
        Number(this.lat) !== 0 && Number(this.lng) !== 0;

      if (hasInputCoords) {
        // Use provided coordinates (Edit/View mode)
        this.initMap(Number(this.lat), Number(this.lng), 15);
      } else if (this.autoLocate) {
        // Auto-detect location (Add mode)
        this.detectAndInitMap();
      } else {
        this.initMap(24.7136, 46.6753, 6);
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) return;

    const latChanged = changes['lat'] && !changes['lat'].firstChange;
    const lngChanged = changes['lng'] && !changes['lng'].firstChange;

    if (latChanged || lngChanged) {
      const newLat = Number(this.lat);
      const newLng = Number(this.lng);
      if (!isNaN(newLat) && !isNaN(newLng) && newLat !== 0 && newLng !== 0) {
        this.updateMarkerPosition(newLat, newLng);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  /** Detect user's current GPS location and init the map */
  private detectAndInitMap(): void {
    if (!navigator.geolocation) {
      this.initMap(24.7136, 46.6753, 6);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.initMap(lat, lng, 15);
        this.location.emit({ lat, lng });
      },
      () => {
        this.initMap(24.7136, 46.6753, 6);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  /** Button click: go to my current location */
  goToMyLocation(): void {
    if (!navigator.geolocation) return;

    this.locating = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.updateMarkerPosition(lat, lng, 15);
        this.location.emit({ lat, lng });
        this.locating = false;
      },
      () => {
        this.locating = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private initMap(lat: number, lng: number, zoom: number): void {
    const mapElement = document.getElementById(this.mapId);
    if (!mapElement) return;

    this.map = L.map(this.mapId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Add draggable marker
    this.marker = L.marker([lat, lng], {
      draggable: !this.readonly
    }).addTo(this.map);

    if (!this.readonly) {
      // Emit location on marker drag
      this.marker.on('dragend', () => {
        const position = this.marker.getLatLng();
        this.location.emit({ lat: position.lat, lng: position.lng });
      });

      // Click on map to move marker
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.marker.setLatLng(e.latlng);
        this.map.panTo(e.latlng);
        this.location.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    // Fix map rendering inside hidden containers (steppers, tabs, etc.)
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);

    this.initialized = true;
  }

  private updateMarkerPosition(lat: number, lng: number, zoom?: number): void {
    if (this.marker && this.map) {
      const latlng = L.latLng(lat, lng);
      this.marker.setLatLng(latlng);
      this.map.setView(latlng, zoom ?? this.map.getZoom());
    }
  }
}
