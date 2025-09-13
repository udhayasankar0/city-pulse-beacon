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
    location: ["RS Puram", "641002"],
    geo: { lat: 11.0156, lng: 76.9558 },
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400&h=300&fit=crop",
    status: "Reported",
    source: "app",
    reportedAt: "2025-09-11T10:00:00+05:30"
  },
  {
    id: "r2",
    title: "Streetlight Not Working Near Market",
    description: "No lights at night along the market street, making it unsafe for pedestrians and causing security concerns for local businesses.",
    type: "Streetlight",
    location: ["Gandhipuram", "641012"],
    geo: { lat: 11.0168, lng: 76.9558 },
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    status: "In Progress",
    source: "social",
    reportedAt: "2025-09-10T08:30:00+05:30"
  },
  {
    id: "r3",
    title: "Large Pothole on Main Road",
    description: "Deep pothole causing vehicle damage and traffic slowdowns. Multiple complaints from commuters about the dangerous road condition.",
    type: "Pothole",
    location: ["Peelamedu", "641004"],
    geo: { lat: 11.0296, lng: 77.0266 },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    status: "Resolved",
    source: "app",
    reportedAt: "2025-09-09T14:15:00+05:30"
  },
  {
    id: "r4",
    title: "Overflowing Garbage Bin",
    description: "Waste bin overflowing for several days, creating unsanitary conditions and attracting stray animals in the residential area.",
    type: "Garbage",
    location: ["Saibaba Colony", "641011"],
    geo: { lat: 11.0510, lng: 76.9698 },
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
    status: "Reported",
    source: "app",
    reportedAt: "2025-09-08T16:45:00+05:30"
  },
  {
    id: "r5",
    title: "Water Pipe Leak on Sidewalk",
    description: "Continuous water leak creating puddles and making the sidewalk slippery. Residents concerned about water wastage and safety.",
    type: "Water Leak",
    location: ["Singanallur", "641005"],
    geo: { lat: 11.0937, lng: 77.0293 },
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    status: "In Progress",
    source: "social",
    reportedAt: "2025-09-07T09:20:00+05:30"
  },
  {
    id: "r6",
    title: "Broken Traffic Signal at Junction",
    description: "Traffic light malfunctioning causing confusion and near-miss accidents. Urgent repair needed to prevent major incidents.",
    type: "Traffic",
    location: ["Ramanathapuram", "641045"],
    geo: { lat: 11.0732, lng: 77.0092 },
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    status: "Reported",
    source: "app",
    reportedAt: "2025-09-06T12:30:00+05:30"
  },
  {
    id: "r7",
    title: "Damaged Bus Stop Shelter",
    description: "Bus stop roof collapsed after heavy rains. Commuters have no protection from weather while waiting for buses.",
    type: "Infrastructure",
    location: ["Vadavalli", "641041"],
    geo: { lat: 11.0214, lng: 76.9214 },
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
    status: "In Progress",
    source: "social",
    reportedAt: "2025-09-05T15:45:00+05:30"
  },
  {
    id: "r8",
    title: "Illegal Dumping in Park Area",
    description: "Construction waste dumped illegally in children's park. Health hazard and environmental concern for the community.",
    type: "Garbage",
    location: ["Podanur", "641023"],
    geo: { lat: 10.9854, lng: 76.9721 },
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop",
    status: "Reported",
    source: "app",
    reportedAt: "2025-09-04T11:20:00+05:30"
  },
  {
    id: "r9",
    title: "Manhole Cover Missing",
    description: "Open manhole without cover poses serious safety risk to pedestrians and vehicles, especially during night hours.",
    type: "Safety",
    location: ["Kuniyamuthur", "641008"],
    geo: { lat: 11.0458, lng: 76.9378 },
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    status: "In Progress",
    source: "app",
    reportedAt: "2025-09-03T18:10:00+05:30"
  },
  {
    id: "r10",
    title: "Stray Dogs Menacing Residents",
    description: "Pack of aggressive stray dogs in residential area causing fear among children and elderly. Animal control needed urgently.",
    type: "Safety",
    location: ["Thudiyalur", "641034"],
    geo: { lat: 11.0845, lng: 76.9456 },
    image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
    status: "Reported",
    source: "social",
    reportedAt: "2025-09-02T07:30:00+05:30"
  },
  {
    id: "r11",
    title: "Broken Footpath Near School",
    description: "Cracked and uneven footpath creating difficulty for students and parents. Risk of trips and falls during school hours.",
    type: "Infrastructure",
    location: ["Saravanampatty", "641035"],
    geo: { lat: 11.0712, lng: 76.9234 },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    status: "Resolved",
    source: "app",
    reportedAt: "2025-09-01T13:45:00+05:30"
  },
  {
    id: "r12",
    title: "Flooding Due to Blocked Drain",
    description: "Heavy waterlogging during monsoon due to clogged storm drain. Affecting multiple houses and causing property damage.",
    type: "Water Leak",
    location: ["Kalapatti", "641048"],
    geo: { lat: 11.0234, lng: 77.0456 },
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
    status: "In Progress",
    source: "app",
    reportedAt: "2025-08-31T16:20:00+05:30"
  },
  {
    id: "r13",
    title: "Vandalized Public Bench",
    description: "Park bench damaged by vandals with graffiti and broken slats. Community requests repair to maintain park aesthetics.",
    type: "Infrastructure",
    location: ["Sulur", "641402"],
    geo: { lat: 11.0234, lng: 77.1234 },
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    status: "Reported",
    source: "social",
    reportedAt: "2025-08-30T10:15:00+05:30"
  },
  {
    id: "r14",
    title: "Overgrown Vegetation Blocking View",
    description: "Untrimmed bushes and trees blocking road signs and creating blind spots for drivers at intersection.",
    type: "Tree Fall",
    location: ["Mettupalayam Road", "641029"],
    geo: { lat: 10.9876, lng: 76.8934 },
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    status: "Reported",
    source: "app",
    reportedAt: "2025-08-29T14:50:00+05:30"
  },
  {
    id: "r15",
    title: "Faulty Speed Breaker",
    description: "Damaged speed breaker causing vehicle damage and creating safety hazard. Multiple complaints from daily commuters.",
    type: "Traffic",
    location: ["Hopes College", "641108"],
    geo: { lat: 11.1234, lng: 76.8756 },
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    status: "In Progress",
    source: "app",
    reportedAt: "2025-08-28T09:25:00+05:30"
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