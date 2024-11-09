import React, { useState, useRef, useCallback } from 'react';
import { AlertCircle, Upload, FileUp } from 'lucide-react';


interface Game {
  id: string;
  title: string;
  system: string;
  romUrl: string;
  coverImage: string;
  core: string;
}

const games: Game[] = [
  {
    id: '1',
    title: 'Super Mario Bros',
    system: 'NES',
    romUrl: '/roms/mario.nes',
    coverImage: 'https://media.rawg.io/media/resize/420/-/games/154/154fea9689109f26c49c6a2db6263ef9.jpg',
    core: 'nes'
  },
  {
    id: '2', 
    title: 'Sonic the Hedgehog',
    system: 'SEGA',
    romUrl: '/roms/sonic.md',
    coverImage: 'https://media.rawg.io/media/resize/420/-/games/373/373a9a1f664de6e4c31f08644729e2db.jpg',  
    core: 'segaMD'
  },
  {
    id: '3', 
    title: 'Sonic the Hedgehog',
    system: 'SEGA',
    romUrl: '/roms/sonic.md',
    coverImage: '/api/placeholder/320/240',  
    core: 'segaMD'
  },

  // Add more games 
];

const ArcadePage = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emulatorContainerRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  const startEmulator = (game: Game) => {
    if (!emulatorContainerRef.current) return;
    
    // Update global EmulatorJS config
    window.EJS_gameUrl = game.romUrl;
    window.EJS_core = game.core;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/latest/data/';
    window.EJS_startOnLoaded = true;
    
    // Reset container
    emulatorContainerRef.current.innerHTML = '';
    const gameElement = document.createElement('div');
    gameElement.id = 'game';
    emulatorContainerRef.current.appendChild(gameElement);

    try {
      // @ts-ignore - EmulatorJS is loaded globally
      new window.EmulatorJS(gameElement, {});
      setSelectedGame(game);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to load game emulator');
      console.error(error);
    }
  };

  const detectCore = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const coreMap: {[key: string]: string} = {
      'nes': 'nes',
      'smc': 'snes',
      'sfc': 'snes',
      'md': 'segaMD',
      'bin': 'segaMD',
      'gb': 'gb',
      'gbc': 'gb',
      'gba': 'gba',
      'n64': 'n64',
    };
    return coreMap[ext || ''] || 'nes';
  };

  const handleFile = (file: File) => {
    const uploadedGame: Game = {
      id: 'custom',
      title: file.name,
      system: 'Custom',
      romUrl: URL.createObjectURL(file),
      coverImage: '/api/placeholder/320/240',
      core: detectCore(file.name)
    };

    startEmulator(uploadedGame);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Retro Arcade</h1>
{/*       
      {errorMessage && ( 
        // <Alert variant="destructive" className="mb-4">*/}
          <AlertCircle className="h-4 w-4" />
          {/* <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert> */}
      {/* )} */}

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Upload ROM</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload ROM
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".nes,.smc,.sfc,.md,.gb,.gbc,.gba,.n64"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <p className="text-sm text-gray-600">
          Supported formats: NES, SNES, SEGA Genesis/MD, GameBoy, GameBoy Color, GameBoy Advance, Nintendo 64
        </p>
      </div>

      <div 
        ref={emulatorContainerRef} 
        className={`relative mb-8 w-full aspect-video bg-gray-900 rounded-lg overflow-hidden
          ${isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!selectedGame && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <FileUp className={`h-16 w-16 mb-4 ${isDragging ? 'text-blue-500 animate-bounce' : ''}`} />
            <p className="text-lg">
              {isDragging 
                ? 'Drop ROM file to start playing'
                : 'Select a game or drop a ROM file here'
              }
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => startEmulator(game)}
          >
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
              <p className="text-sm text-gray-600">{game.system}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArcadePage;