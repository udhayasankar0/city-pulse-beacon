
import { Incident } from '@/types/incident';

export const sampleIncidents: Incident[] = [
  {
    id: '1',
    title: 'Heavy Traffic on Gandhipuram Flyover',
    description: 'Severe traffic congestion reported on Gandhipuram flyover due to ongoing construction work. Traffic is moving very slowly in both directions. Alternative routes recommended via Avinashi Road.',
    shortSummary: 'Severe traffic congestion due to construction work',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    location: {
      lat: 11.0185,
      lng: 76.9649,
      name: 'Gandhipuram Flyover'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    type: 'traffic'
  },
  {
    id: '2',
    title: 'Tree Fall Blocks Road in RS Puram',
    description: 'A large tree has fallen across the main road in RS Puram after yesterday evening\'s thunderstorm. Local authorities have been notified and cleanup crews are on the way. Traffic is being diverted through side streets.',
    shortSummary: 'Large tree blocking main road after storm',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    location: {
      lat: 11.0049,
      lng: 76.9581,
      name: 'RS Puram Main Road'
    },
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
    type: 'weather'
  },
  {
    id: '3',
    title: 'Waterlogging Near Town Hall',
    description: 'Significant waterlogging reported near Town Hall area due to poor drainage system. Water level is approximately 2 feet deep. Motorists are advised to avoid this route and use alternative paths.',
    shortSummary: 'Waterlogging causing traffic disruption',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    location: {
      lat: 11.0015,
      lng: 76.9709,
      name: 'Town Hall Junction'
    },
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
    type: 'infrastructure'
  },
  {
    id: '4',
    title: 'Street Light Outage on Trichy Road',
    description: 'Multiple street lights are not working along a 2km stretch of Trichy Road near Singanallur. This has created visibility issues for night-time commuters. Electricity board has been informed.',
    shortSummary: 'Street lights not working, visibility poor at night',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    location: {
      lat: 11.0510,
      lng: 77.0206,
      name: 'Trichy Road, Singanallur'
    },
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    type: 'infrastructure'
  },
  {
    id: '5',
    title: 'Pothole Causing Vehicle Damage',
    description: 'A large pothole has formed on Avinashi Road near Peelamedu. Several vehicles have reported tire damage. The pothole is approximately 3 feet wide and 1 foot deep. Immediate repair needed.',
    shortSummary: 'Large pothole causing vehicle damage',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    location: {
      lat: 11.0302,
      lng: 76.9347,
      name: 'Avinashi Road, Peelamedu'
    },
    image: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=400&h=300&fit=crop',
    type: 'infrastructure'
  }
];
