import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { interval } from 'rxjs';
import 'leaflet.animatedmarker/src/AnimatedMarker';
import { animatedMarker, polyline } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private map;

  private aircraft: any;

  logtext: string[] = [];
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;

  greenIcon = L.icon({
    iconUrl: './assets/f-16-friendly.png',
    iconColor: "#fff",
    iconSize:     [50, 50],
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76],
    id: "wolf"
});

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    let darkMap = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    let openMap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tiles = L.tileLayer(darkMap, {
      maxZoom: 18,
      minZoom: 3
    });

    tiles.addTo(this.map);

    let lat = 23;
    let long = 40;

    var PopupClass = {
      'className': 'class-popup'
    }
    var TooltipClass = {
      'className': 'class-tooltip'
    }

    this.aircraft = L.marker([lat, long], {icon: this.greenIcon})
    .addTo(this.map).
    bindPopup("hello").
    bindTooltip("VIPER-1", { permanent: true, direction: 'right', offset: [-65,-100], ...TooltipClass});
    this.map.flyTo([lat, long], 6);
  }

  move(e) {
    let long = this.aircraft.getLatLng();
   // console.log(this.aircraft.options.icon.options.id);
    for (var i=0;i<=5;i++) {
          setTimeout(() => {
            this.aircraft.setLatLng([23, long.lng + .5])
            long = this.aircraft.getLatLng();
          }, 500 + (1000 * i));
      ;
   }
  }

  constructor() {
    this.addLog("hello")
   }

  ngAfterViewInit(): void {
    this.initMap();

    interval(2000).subscribe(x => {
    //  this.addLog("hello");
  });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
  }

  addLog(item) {
    this.logtext.push(item);
  }
}

