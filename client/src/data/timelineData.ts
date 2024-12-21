export const timelineEras: TimelineEra[] = [
  {
    id: '1970s',
    title: 'The Birth of Gaming',
    yearStart: 1970,
    yearEnd: 1979,
    description: 'The dawn of video gaming marked by groundbreaking arcade games and the first home consoles. This era laid the foundation for the entire gaming industry with simple yet addictive gameplay mechanics.',
    color: '#FF6B6B',
    coverImage: '/assets/eras/1970s.jpg',
    keyEvents: [
      '1971: First arcade game "Computer Space" released',
      '1972: Atari founded and Pong released',
      '1975: Atari Home Pong launches',
      '1977: Atari 2600 revolutionizes home gaming',
      '1978: Space Invaders creates arcade boom',
      '1979: Asteroids becomes Atari\'s best seller'
    ],
    majorPlatforms: [
      {
        id: '27',
        name: 'Arcade',
        manufacturer: 'Various',
        releaseYear: 1971,
        image: '/assets/platforms/arcade.jpg',
        description: 'The original gaming platform that started it all'
      },
      {
        id: '7',
        name: 'Atari 2600',
        manufacturer: 'Atari',
        releaseYear: 1977,
        image: '/assets/platforms/atari-2600.jpg',
        description: 'First widely successful home video game console'
      },
      {
        id: '28',
        name: 'Magnavox Odyssey',
        manufacturer: 'Magnavox',
        releaseYear: 1972,
        image: '/assets/platforms/odyssey.jpg',
        description: 'The first home video game console'
      }
    ],
    query: {
      dates: '1970-01-01,1979-12-31',
      platforms: '7,27,28',
      ordering: '-rating',
      page_size: 20
    }
  },
  {
    id: '1980s',
    title: 'The Golden Age',
    yearStart: 1980,
    yearEnd: 1989,
    description: 'Known as the golden age of arcade gaming and the rise of Nintendo. This era saw the establishment of many iconic franchises and the revival of the gaming industry after the crash of 1983.',
    color: '#4ECDC4',
    coverImage: '/assets/eras/1980s.jpg',
    keyEvents: [
      '1980: Pac-Man debuts',
      '1981: Donkey Kong introduces Mario',
      '1983: Nintendo launches the Famicom in Japan',
      '1985: Super Mario Bros. and NES launch in US',
      '1986: The Legend of Zelda debuts',
      '1989: Game Boy launches with Tetris'
    ],
    majorPlatforms: [
      {
        id: '49',
        name: 'NES',
        manufacturer: 'Nintendo',
        releaseYear: 1985,
        image: '/assets/platforms/nes.jpg',
        description: 'Revived the gaming industry in North America'
      },
      {
        id: '26',
        name: 'Game Boy',
        manufacturer: 'Nintendo',
        releaseYear: 1989,
        image: '/assets/platforms/gameboy.jpg',
        description: 'Revolutionary handheld gaming device'
      },
      {
        id: '28',
        name: 'Arcade (Golden Age)',
        manufacturer: 'Various',
        releaseYear: 1980,
        image: '/assets/platforms/arcade-80s.jpg',
        description: 'Peak of arcade gaming culture'
      }
    ],
    query: {
      dates: '1980-01-01,1989-12-31',
      platforms: '49,26,28',
      ordering: '-rating',
      page_size: 20
    }
  },
  {
    id: '1990s',
    title: 'The 3D Revolution',
    yearStart: 1990,
    yearEnd: 1999,
    description: 'A transformative decade that brought 3D graphics, CD-ROM gaming, and fierce console competition. This era saw gaming evolve from pixels to polygons, creating new genres and possibilities.',
    color: '#FFD93D',
    coverImage: '/assets/eras/1990s.jpg',
    keyEvents: [
      '1991: Sonic the Hedgehog and SNES launch',
      '1993: DOOM defines FPS genre',
      '1994: PlayStation launches in Japan',
      '1996: Nintendo 64 introduces analog stick',
      '1997: Final Fantasy VII sets new RPG standard',
      '1998: Pokemon becomes global phenomenon'
    ],
    majorPlatforms: [
      {
        id: '79',
        name: 'SNES',
        manufacturer: 'Nintendo',
        releaseYear: 1991,
        image: '/assets/platforms/snes.jpg',
        description: '16-bit era powerhouse'
      },
      {
        id: '187',
        name: 'PlayStation',
        manufacturer: 'Sony',
        releaseYear: 1994,
        image: '/assets/platforms/ps1.jpg',
        description: 'Revolutionary CD-based console'
      },
      {
        id: '83',
        name: 'Nintendo 64',
        manufacturer: 'Nintendo',
        releaseYear: 1996,
        image: '/assets/platforms/n64.jpg',
        description: 'Pioneered 3D console gaming'
      }
    ],
    query: {
      dates: '1990-01-01,1999-12-31',
      platforms: '79,187,83',
      ordering: '-rating',
      page_size: 20
    }
  },
  {
    id: '2000s',
    title: 'Online Gaming Era',
    yearStart: 2000,
    yearEnd: 2009,
    description: 'The rise of online gaming, HD graphics, and motion controls. This decade saw gaming become more social and accessible while pushing technical boundaries.',
    color: '#6C5CE7',
    coverImage: '/assets/eras/2000s.jpg',
    keyEvents: [
      '2000: PlayStation 2 launches',
      '2001: Xbox enters console market',
      '2004: World of Warcraft launches',
      '2005: Xbox 360 begins HD era',
      '2006: Nintendo Wii revolutionizes controls',
      '2007: iPhone changes mobile gaming'
    ],
    majorPlatforms: [
      {
        id: '15',
        name: 'PlayStation 2',
        manufacturer: 'Sony',
        releaseYear: 2000,
        image: '/assets/platforms/ps2.jpg',
        description: 'Best-selling console of all time'
      },
      {
        id: '80',
        name: 'Xbox',
        manufacturer: 'Microsoft',
        releaseYear: 2001,
        image: '/assets/platforms/xbox.jpg',
        description: 'Microsoft\'s gaming debut'
      },
      {
        id: '11',
        name: 'Wii',
        manufacturer: 'Nintendo',
        releaseYear: 2006,
        image: '/assets/platforms/wii.jpg',
        description: 'Motion control revolution'
      }
    ],
    query: {
      dates: '2000-01-01,2009-12-31',
      platforms: '15,80,11',
      ordering: '-rating',
      page_size: 20
    }
  },
  {
    id: '2010s',
    title: 'Digital & Mobile Revolution',
    yearStart: 2010,
    yearEnd: 2019,
    description: 'The era of digital distribution, mobile gaming, and live services. Gaming became more accessible than ever while pushing technical and artistic boundaries.',
    color: '#A8E6CF',
    coverImage: '/assets/eras/2010s.jpg',
    keyEvents: [
      '2011: Dark Souls defines a new genre',
      '2013: PS4 and Xbox One launch',
      '2015: The Witcher 3 sets new RPG standard',
      '2016: Pokemon GO becomes global phenomenon',
      '2017: Nintendo Switch debuts',
      '2018: Fortnite transforms gaming culture'
    ],
    majorPlatforms: [
      {
        id: '18',
        name: 'PlayStation 4',
        manufacturer: 'Sony',
        releaseYear: 2013,
        image: '/assets/platforms/ps4.jpg',
        description: 'Dominant force in console gaming'
      },
      {
        id: '1',
        name: 'Xbox One',
        manufacturer: 'Microsoft',
        releaseYear: 2013,
        image: '/assets/platforms/xboxone.jpg',
        description: 'All-in-one entertainment system'
      },
      {
        id: '7',
        name: 'Nintendo Switch',
        manufacturer: 'Nintendo',
        releaseYear: 2017,
        image: '/assets/platforms/switch.jpg',
        description: 'Hybrid console innovation'
      }
    ],
    query: {
      dates: '2010-01-01,2019-12-31',
      platforms: '18,1,7',
      ordering: '-rating',
      page_size: 20
    }
  },
  {
    id: '2020s',
    title: 'Next-Gen Gaming',
    yearStart: 2020,
    yearEnd: 2024,
    description: 'The current era of gaming featuring ray tracing, ultra-fast loading, and cloud gaming. Gaming continues to push technical boundaries while becoming more accessible.',
    color: '#FF9A8B',
    coverImage: '/assets/eras/2020s.jpg',
    keyEvents: [
      '2020: PS5 and Xbox Series X launch',
      '2021: Steam Deck announced',
      '2022: Microsoft acquires Activision Blizzard',
      '2023: PSVR2 launches',
      '2024: Cloud gaming expansion'
    ],
    majorPlatforms: [
      {
        id: '187',
        name: 'PlayStation 5',
        manufacturer: 'Sony',
        releaseYear: 2020,
        image: '/assets/platforms/ps5.jpg',
        description: 'Next-gen gaming powerhouse'
      },
      {
        id: '186',
        name: 'Xbox Series X/S',
        manufacturer: 'Microsoft',
        releaseYear: 2020,
        image: '/assets/platforms/xboxseriesx.jpg',
        description: 'Most powerful Xbox ever'
      },
      {
        id: '188',
        name: 'Steam Deck',
        manufacturer: 'Valve',
        releaseYear: 2022,
        image: '/assets/platforms/steamdeck.jpg',
        description: 'PC gaming goes portable'
      }
    ],
    query: {
      dates: '2020-01-01,2024-12-31',
      platforms: '187,186,188',
      ordering: '-rating',
      page_size: 20
    }
  }
];

// Types for Timeline Data
export interface TimelineEra {
  id: string;
  title: string;
  yearStart: number;
  yearEnd: number;
  description: string;
  color: string;
  coverImage: string;
  keyEvents: string[];
  majorPlatforms: Platform[];
  query: GameQueryParams;
}

export interface Platform {
  id: string;
  name: string;
  manufacturer: string;
  releaseYear: number;
  image: string;
  description: string;
}

export interface GameQueryParams {
  dates: string;
  platforms?: string;
  ordering: string;
  page_size: number;
}

// Helper functions for timeline data
export const getEraByYear = (year: number) => {
  return timelineEras.find(era => year >= era.yearStart && year <= era.yearEnd);
};

export const getEraById = (id: string) => {
  return timelineEras.find(era => era.id === id);
};

export const getNextEra = (currentId: string) => {
  const currentIndex = timelineEras.findIndex(era => era.id === currentId);
  return timelineEras[currentIndex + 1];
};

export const getPreviousEra = (currentId: string) => {
  const currentIndex = timelineEras.findIndex(era => era.id === currentId);
  return timelineEras[currentIndex - 1];
};