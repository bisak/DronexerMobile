import { Injectable } from '@angular/core';

@Injectable()
export class StaticDataProvider {

  constructor() {
  }

  readonly dronesArray = [
    'DJI Phantom 3 Std',
    'DJI Phantom 3 4K',
    'DJI Phantom 3 SE',
    'DJI Phantom 3 Adv',
    'DJI Phantom 3 Pro',
    'DJI Phantom 4',
    'DJI Phantom 4 Adv',
    'DJI Phantom 4 Pro',
    'DJI Mavic Pro',
    'DJI Spark',
    'DJI Inspire 1',
    'DJI Inspire 1 Pro',
    'DJI Inspire 2',
    'Parrot',
    'Yuneec',
    '3DR',
    'Racing/FPV',
    'Other/Unspecified'
  ];

  getDronesArray() {
    return this.dronesArray;
  }
}
