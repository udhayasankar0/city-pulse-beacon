
export interface Incident {
  id: string;
  title: string;
  description: string;
  shortSummary: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  image: string;
  type: 'traffic' | 'weather' | 'infrastructure' | 'safety' | 'other';
}
