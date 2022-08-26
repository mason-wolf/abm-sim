import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { interval } from 'rxjs';
import 'leaflet.animatedmarker/src/AnimatedMarker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private map;

  aircraftList: any[] = [];
  enemyList: any[] = [];

  logtext: any[] = [];
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;

  f16Icon = L.icon({
    iconUrl: './assets/f-16-friendly-east.png',
    iconColor: "#fff",
    iconSize:     [50, 50],
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76],
    id: ""
});

  migIcon = L.icon({
    iconUrl: './assets/bogey-east.png',
    iconColor: "#fff",
    iconSize:     [50, 50],
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76],
    id: ""
  });
  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

  var dropdownMenu = document.getElementsByClassName('dropdown-toggle')

  for (var i = 0; i < dropdownMenu.length; i++) {
      dropdownMenu[i].addEventListener('click', function () {
      var el = this.nextElementSibling;
      el.style.display = el.style.display == 'block' ? 'none' : 'block';
  });
  }

    let darkMap = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    let openMap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tiles = L.tileLayer(openMap, {
      maxZoom: 18,
      minZoom: 3
    });

    tiles.addTo(this.map);

    let lat = 23;
    let long = 40;

    var TooltipClass = {
      'className': 'class-tooltip'
    }

    let squadron = [
      { "id" : "VIPER-1", "location" : [23, 40]},
      { "id" : "VIPER-2", "location" : [21, 38]},
      { "id" : "VIPER-3", "location" : [25, 38]},
      { "id" : "VIPER-4", "location" : [26, 35]},
      { "id" : "VIPER-5", "location" : [20, 32]},
      { "id" : "VIPER-6", "location" : [20, 35]},
      { "id" : "BOGEY-1", "location" : [30, 60]},
      { "id" : "BOGEY-2", "location" : [45, 55]},
      { "id" : "BOGEY-3", "location" : [50, 42]},
    ]


    for (var aircraft in squadron) {
      let lat = squadron[aircraft]["location"][0];
      let long = squadron[aircraft]["location"][1];
      let newAircraft: any;

      if (squadron[aircraft]["id"].includes("BOGEY")) {
        newAircraft = L.marker([lat, long], {icon: this.migIcon})
        .addTo(this.map)
        newAircraft.id = squadron[aircraft]["id"];
        this.enemyList.push(newAircraft);
      }
      else {
        newAircraft = L.marker([lat, long], {icon: this.f16Icon})
        .addTo(this.map).
        bindPopup(`STATUS: OK`).
        bindTooltip(squadron[aircraft]["id"], { permanent: true, direction: 'right', offset: [-65,-100], ...TooltipClass})
        newAircraft.id = squadron[aircraft]["id"];
        this.aircraftList.push(newAircraft);
      }
    }

     this.map.flyTo([lat, long], 6);
  }

  changeDirection(e, direction) {
    let newIconUrl = '';
    switch(direction) {
      case("north"): {
        if (e.id.includes("BOGEY")) {
          newIconUrl = './assets/bogey-north.png';
        }
        else {
          newIconUrl = './assets/f-16-friendly-north.png';
        }
        break;
      }
      case("east"): {
        if (e.id.includes("BOGEY")) {
          newIconUrl = './assets/bogey-east.png';
        }
        else {
          newIconUrl = './assets/f-16-friendly-east.png';
        }
        break;
      }
      case("west"): {
        if (e.id.includes("BOGEY")) {
          newIconUrl = './assets/bogey-west.png';
        }
        else {
          newIconUrl = './assets/f-16-friendly-west.png';
        }
        break;
      }
      case("south"): {
        if (e.id.includes("BOGEY")) {
          newIconUrl = './assets/bogey-south.png';
        }
        else {
          newIconUrl = './assets/f-16-friendly-south.png';
        }
        break;
      }
    }

    let greenIcon = L.icon({
      iconUrl: newIconUrl,
      iconColor: "#fff",
      iconSize:     [50, 50],
      iconAnchor:   [22, 94],
      popupAnchor:  [-3, -76],
  });
    e.setIcon(greenIcon)
  }

  move(e, direction) {
    let location = e.getLatLng();
    let speed = .25;
    switch (direction) {
        case ('east'):
          if (e.id.includes("BOGEY")) {
            this.addLog("BANDIT IDENT " + location.lat + " LAT " + location.lng + " LONG", "warning");
          }
          else {
            this.addLog(e.id + " PROCEEDING EAST", "info");
          }
          this.changeDirection(e, "east");
            for (var i = 0; i <= 5; i++) {
                setTimeout(() => {
                    e.setLatLng([location.lat, location.lng + speed])
                    location = e.getLatLng();
                }, 500 + (1000 * i));;
            }
        break;
        case ('north'):
          if (e.id.includes("BOGEY")) {
            this.addLog("BANDIT IDENT " + location.lat + " LAT " + location.lng + " LONG", "warning");
          }
          else {
            this.addLog(e.id + " PROCEEDING NORTH", "info");
          }
          this.changeDirection(e, "north");
          for (var i = 0; i <= 5; i++) {
            setTimeout(() => {
                e.setLatLng([location.lat + speed, location.lng])
                location = e.getLatLng();
            }, 500 + (1000 * i));;
        }
        break;
        case ('west'):
          if (e.id.includes("BOGEY")) {
            this.addLog("BANDIT IDENT " + location.lat + " LAT " + location.lng + " LONG", "warning");
          }
          else {
            this.addLog(e.id + " PROCEEDING WEST", "info");
          }
          this.changeDirection(e, "west");
          for (var i = 0; i <= 5; i++) {
            setTimeout(() => {
                e.setLatLng([location.lat, location.lng - speed])
                location = e.getLatLng();
            }, 500 + (1000 * i));;
        }
        break;
        case ('south'):
          if (e.id.includes("BOGEY")) {
            this.addLog("BANDIT IDENT " + location.lat + " LAT " + location.lng + " LONG", "warning");
          }
          else {
            this.addLog(e.id + " PROCEEDING SOUTH", "info");
          }
          this.changeDirection(e, "south");
          for (var i = 0; i <= 5; i++) {
            setTimeout(() => {
                e.setLatLng([location.lat - speed, location.lng])
                location = e.getLatLng();
            }, 500 + (1000 * i));;
        }
        break;
    }
}


moveAll(direction) {
  switch (direction) {
      case ('east'):
        this.aircraftList.forEach(unit => {
          this.move(unit, "east");
        });
      break;
      case ('north'):
        this.aircraftList.forEach(unit => {
          this.move(unit, "north");
        });
      break;
        case ('west'):
          this.aircraftList.forEach(unit => {
            this.move(unit, "west");
          });
      break;
  }
}
  constructor() {
   }

  ngAfterViewInit(): void {
    this.initMap();

    interval(4000).subscribe(x => {
      this.addLog("NO INFO", "info");
    });

    this.enemyList.forEach(enemy=> {
      if (enemy.id=="BOGEY-1") {
        interval(15000).subscribe(x => {
          this.move(enemy, "west");
        });
      }
      if (enemy.id=="BOGEY-2") {
        interval(10000).subscribe(x => {
          this.move(enemy, "east");
        });
      }
      if (enemy.id=="BOGEY-3") {
        interval(5000).subscribe(x => {
          this.move(enemy, "south");
        });
      }
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
  }

  addLog(item, type) {
    let msg = {
      messageType: type,
      message: new Date().toISOString() + "--" + item
    }
    this.logtext.push(msg);
  }
}

