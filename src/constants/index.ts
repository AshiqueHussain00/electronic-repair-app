/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'ac',
    name: 'Air Conditioner Repair',
    description: 'Expert deep cleaning, gas charging, and compressor fault resolution for all AC brands.',
    icon: 'Wind',
    basePrice: 80,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fridge',
    name: 'Refrigerator Repair',
    description: 'Fix cooling issues, thermostat calibration, sensor replacements, and gas refilling.',
    icon: 'IceCream',
    basePrice: 70,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'washer',
    name: 'Washing Machine Repair',
    description: 'Drum repair, motor fixing, drain pump issues, and control board troubleshooting.',
    icon: 'WashingMachine',
    basePrice: 65,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'tv',
    name: 'LED/Smart TV Repair',
    description: 'Screen repairs, panel replacement, sound issues, power supply board fixing, and software bugs.',
    icon: 'Tv',
    basePrice: 90,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'microwave',
    name: 'Microwave Oven Repair',
    description: 'Magnetron replacement, touchpad repair, heating failures, and internal wiring fixing.',
    icon: 'Microwave',
    basePrice: 50,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'induction',
    name: 'Induction Cooktop Repair',
    description: 'IGBT replacement, error code resolution, sensor failure, and main circuit repair.',
    icon: 'Flame',
    basePrice: 40,
    image: 'https://images.unsplash.com/photo-1604335399105-a0c5e5fd90f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'water-pump',
    name: 'Water Pump Service',
    description: 'Winding repair, bearing noise reduction, pressure switch fixing, and complete motor servicing.',
    icon: 'Droplet',
    basePrice: 75,
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fan-light',
    name: 'Fan & Smart Light Installation',
    description: 'Installation, wiring, speed regulator repair, and high-tech modular electrical setups.',
    icon: 'Fan',
    basePrice: 30,
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80',
  },
];

export const WORK_HOURS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];
