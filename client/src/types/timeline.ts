export interface Platform {
    id: string;
    name: string;
    manufacturer: string;
    releaseYear: number;
    image: string;
    description: string;
  }
  
  export interface TimelineEra {
    id: string;
    title: string;
    description: string;
    yearStart: number;
    yearEnd: number;
    color: string;
    coverImage: string;
    keyEvents: string[];
    majorPlatforms: Platform[];
    query: {
      dates: string;
      platforms?: string;
      ordering: string;
      page_size: number;
    };
  }