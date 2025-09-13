export interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  location: [string, string]; // [City, PIN]
  geo: { lat: number; lng: number };
  image: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  source: 'app' | 'social';
  reportedAt: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  reportId: string;
  read?: boolean;
}

export const dummyReports: Report[] = [
  {
    id: "r1",
    title: "Tree Fall Blocks Road in RS Puram",
    description: "Large tree blocking main road after storm, causing severe traffic disruption. Emergency vehicles unable to pass through the area.",
    type: "Tree Fall",
    location: ["Coimbatore", "641001"],
    geo: { lat: 11.0156, lng: 76.9558 },
    image: "/placeholder.svg",
    status: "Reported",
    source: "app",
    reportedAt: "2025-09-11T10:00:00+05:30"
  },
  {
    id: "r2",
    title: "Streetlight Not Working Near Market",
    description: "No lights at night along the market street, making it unsafe for pedestrians and causing security concerns for local businesses.",
    type: "Streetlight",
    location: ["Coimbatore", "641002"],
    geo: { lat: 11.0182, lng: 76.9530 },
    image: "/placeholder.svg",
    status: "In Progress",
    source: "social",
    reportedAt: "2025-09-10T08:30:00+05:30"
  },
  {
    id: "r3",
    title: "Large Pothole on Main Road",
    description: "Deep pothole causing vehicle damage and traffic slowdowns. Multiple complaints from commuters about the dangerous road condition.",
    type: "Pothole",
    location: ["Coimbatore", "641003"],
    geo: { lat: 11.0124, lng: 76.9600 },
    image: "/placeholder.svg",
    status: "Resolved",
    source: "app",
    reportedAt: "2025-09-09T14:15:00+05:30"
  },
  {
    id: "r4",
    title: "Overflowing Garbage Bin",
    description: "Waste bin overflowing for several days, creating unsanitary conditions and attracting stray animals in the residential area.",
    type: "Garbage",
    location: ["Coimbatore", "641004"],
    geo: { lat: 11.0098, lng: 76.9521 },
    image: "/placeholder.svg",
    status: "Reported",
    source: "app",
    reportedAt: "2025-09-08T16:45:00+05:30"
  },
  {
    id: "r5",
    title: "Water Pipe Leak on Sidewalk",
    description: "Continuous water leak creating puddles and making the sidewalk slippery. Residents concerned about water wastage and safety.",
    type: "Water Leak",
    location: ["Coimbatore", "641005"],
    geo: { lat: 11.0203, lng: 76.9485 },
    image: "/placeholder.svg",
    status: "In Progress",
    source: "social",
    reportedAt: "2025-09-07T09:20:00+05:30"
  }
];

export const dummyNotifications: Notification[] = [
  { 
    id: "n1", 
    text: "Your report 'Tree Fall Blocks Road' has been received and assigned tracking number #CR001.", 
    time: "2025-09-11T10:01:00+05:30", 
    reportId: "r1",
    read: false
  },
  { 
    id: "n2", 
    text: "Report 'Streetlight Not Working' has been assigned to maintenance crew and work will begin tomorrow.", 
    time: "2025-09-10T09:00:00+05:30", 
    reportId: "r2",
    read: false
  },
  { 
    id: "n3", 
    text: "Great news! The pothole on Main Road has been successfully repaired. Thank you for reporting.", 
    time: "2025-09-09T17:30:00+05:30", 
    reportId: "r3",
    read: true
  }
];