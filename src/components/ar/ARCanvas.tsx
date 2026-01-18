'use client';
import { Suspense, useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, ContactShadows, Line, useTexture, Grid } from '@react-three/drei';
import { Camera, Sun, RotateCw, Moon, RefreshCcw, Ruler, Play, Pause, HelpCircle, Layers, X, MousePointer2, SplitSquareHorizontal, Video, Square, Scan, Palette, Gamepad2, Save, List, Trash2, Aperture, SlidersHorizontal, Mic, MicOff, CloudRain, Snowflake, Image as ImageIcon, Clock, Feather, Upload, Film, Box, Zap, ArrowUp } from 'lucide-react';
import * as THREE from 'three';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { useStore } from '@/lib/store';
import { scenes, products } from '@/lib/data';

const ARModel = forwardRef<THREE.Mesh, { color: string, imageUrl: string, roughness: number, metalness: number, customTexture?: string | null, position?: [number, number, number] }>(({ color, imageUrl, roughness, metalness, customTexture, position = [0, 0.75, 0] }, ref) => {
  const texture = useTexture(customTexture || imageUrl);
  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial 
        color={color} 
        map={texture}
        roughness={roughness} 
        metalness={metalness}
        envMapIntensity={1}
      />
    </mesh>
  );
});
ARModel.displayName = 'ARModel';

function PhysicsProduct(props: any) {
  const [ref] = useBox<THREE.Mesh>(() => ({ mass: 1, position: [0, 5, 0], args: [1.5, 1.5, 1.5] }));
  return <ARModel ref={ref} position={[0, 0, 0]} {...props} />;
}

function PhysicsFloor() {
  const [ref] = usePlane<THREE.Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }));
  return <mesh ref={ref} visible={false} />;
}

function Floor({ type }: { type: string }) {
  if (type === 'none') return null;

  const getMaterialProps = () => {
    switch (type) {
      case 'wood': return { color: '#5d4037', roughness: 0.6, metalness: 0 };
      case 'concrete': return { color: '#808080', roughness: 0.9, metalness: 0 };
      case 'tile': return { color: '#e0e0e0', roughness: 0.1, metalness: 0.1 };
      default: return { color: 'white' };
    }
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial {...getMaterialProps()} />
    </mesh>
  );
}

function WeatherSystem({ type }: { type: 'rain' | 'snow' }) {
  const count = type === 'rain' ? 1000 : 500;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 20,
        speed: type === 'rain' ? 0.5 + Math.random() * 0.5 : 0.05 + Math.random() * 0.05,
        drift: (Math.random() - 0.5) * 0.02
      });
    }
    return temp;
  }, [type, count]);

  useFrame(() => {
    if (!mesh.current) return;
    const instance = mesh.current;
    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      if (type === 'snow') particle.x += particle.drift;
      
      if (particle.y < -5) {
        particle.y = 15;
        particle.x = (Math.random() - 0.5) * 20;
        particle.z = (Math.random() - 0.5) * 20;
      }
      
      dummy.position.set(particle.x, particle.y, particle.z);
      if (type === 'rain') dummy.scale.set(0.02, 0.4, 0.02);
      else dummy.scale.set(0.1, 0.1, 0.1);
      
      dummy.updateMatrix();
      instance.setMatrixAt(i, dummy.matrix);
    });
    instance.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {type === 'rain' ? <boxGeometry /> : <sphereGeometry args={[0.5, 8, 8]} />}
      <meshBasicMaterial color={type === 'rain' ? '#aaccff' : '#ffffff'} transparent opacity={0.6} />
    </instancedMesh>
  );
}

function GalleryModal({ screenshots, onClose }: { screenshots: string[], onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel max-w-4xl w-full p-6 rounded-2xl relative animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ImageIcon className="text-primary" /> Snapshot Gallery
        </h2>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pr-2">
          {screenshots.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-8">No snapshots taken yet.</p>
          ) : (
            screenshots.map((src, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img src={src} alt={`Snapshot ${i + 1}`} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={src} download={`snapshot-${i}.png`} className="p-2 bg-primary text-black rounded-full hover:bg-cyan-300 transition-colors">
                    <Save size={16} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SavedDesignsModal({ onClose }: { onClose: () => void }) {
  const { savedDesigns, removeDesign, setArProduct, setScene, setCompareProduct } = useStore();

  const loadDesign = (design: any) => {
    const product = products.find((p: any) => p.id === design.productId);
    if (product) {
      setArProduct({ ...product, color: design.color });
      setScene(design.scene);
      setCompareProduct(null);
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-2xl relative animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <List className="text-primary" /> Saved Designs
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {savedDesigns.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No saved designs yet.</p>
          ) : (
            savedDesigns.map((design) => (
              <div key={design.id} className="bg-white/5 p-3 rounded-xl flex gap-4 items-center group">
                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={design.productImage} alt={design.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{design.productName}</h3>
                  <p className="text-xs text-gray-400 capitalize">{design.scene} • {new Date(design.timestamp).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: design.color }} />
                    <span className="text-xs text-gray-500 uppercase">{design.color}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => loadDesign(design)}
                    className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-black transition-colors"
                    title="Load Design"
                  >
                    <Play size={14} />
                  </button>
                  <button 
                    onClick={() => removeDesign(design.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const maxDist = rect.width / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }

    setPosition({ x: dx, y: dy });
    onMove(dx / maxDist, dy / maxDist);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 touch-none z-50"
      onPointerDown={(e) => {
        setActive(true);
        (e.target as Element).setPointerCapture(e.pointerId);
        handleMove(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (active) handleMove(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        setActive(false);
        setPosition({ x: 0, y: 0 });
        onMove(0, 0);
        (e.target as Element).releasePointerCapture(e.pointerId);
      }}
    >
      <div 
        className="absolute w-12 h-12 rounded-full bg-primary shadow-[0_0_15px_rgba(0,212,255,0.5)] top-1/2 left-1/2 -ml-6 -mt-6 pointer-events-none transition-transform duration-75"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      />
    </div>
  );
}

function PlayerController({ moveRef, controlsRef, isRunning, jumpCount }: { moveRef: React.MutableRefObject<{x:number, y:number}>, controlsRef: any, isRunning: boolean, jumpCount: number }) {
  const { camera } = useThree();
  
  const playCollisionSound = useMemo(() => {
    let audioCtx: AudioContext | null = null;
    return (impact: number) => {
      if (typeof window === 'undefined') return;
      // Initialize AudioContext on first user interaction (collision)
      if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Synthesize a "thud" sound
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(100 + (impact * 10), audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      const vol = Math.min(impact / 10, 0.5);
      gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    };
  }, []);

  const [ref, api] = useSphere<THREE.Mesh>(() => ({ 
    mass: 1, 
    type: 'Dynamic', 
    position: [0, 2, 6], 
    args: [0.5], 
    fixedRotation: true,
    linearDamping: 0.95,
    onCollide: (e) => {
      if (e.contact.impactVelocity > 1.5) {
        playCollisionSound(e.contact.impactVelocity);
      }
    }
  }));
  
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);
  
  const pos = useRef([0, 2, 6]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const moveVector = useMemo(() => new THREE.Vector3(), []);
  const prevPos = useRef(new THREE.Vector3(0, 2, 6));

  useEffect(() => {
    if (jumpCount > 0) {
      // Only jump if relatively close to the ground (y < 2.0)
      if (pos.current[1] < 2.0) {
        api.velocity.set(velocity.current[0], 5, velocity.current[2]);
      }
    }
  }, [jumpCount, api]);

  useFrame(() => {
    if (!ref.current) return;

    const { x, y } = moveRef.current;
    const speed = isRunning ? 8 : 4;

    // Sync Camera to Physics Body
    const currentPos = new THREE.Vector3(...pos.current);
    const deltaPos = currentPos.clone().sub(prevPos.current);
    
    if (deltaPos.lengthSq() > 0.000001) {
      camera.position.add(deltaPos);
      if (controlsRef.current) {
        controlsRef.current.target.add(deltaPos);
      }
      prevPos.current.copy(currentPos);
    }

    // Movement Logic
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();

    moveVector.set(0, 0, 0);
    if (x !== 0 || y !== 0) {
      moveVector.addScaledVector(right, x);
      moveVector.addScaledVector(forward, -y);
      moveVector.normalize().multiplyScalar(speed);
    }
    
    api.velocity.set(moveVector.x, velocity.current[1], moveVector.z);
  });

  return <mesh ref={ref} />;
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="text-primary" /> AR Controls
        </h2>
        <ul className="space-y-4 text-gray-300">
          <li className="flex items-start gap-3">
            <MousePointer2 size={20} className="mt-1 text-primary" />
            <div>
              <span className="font-bold text-white block">Interact</span>
              <span className="text-sm text-gray-400">Drag to rotate. Pinch/Scroll to zoom.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Sun size={20} className="mt-1 text-primary" />
            <div>
              <span className="font-bold text-white block">Lighting</span>
              <span className="text-sm text-gray-400">Adjust intensity and direction. Toggle Night mode.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Layers size={20} className="mt-1 text-primary" />
            <div>
              <span className="font-bold text-white block">Environment</span>
              <span className="text-sm text-gray-400">Change floor material or room scene.</span>
            </div>
          </li>
        </ul>
        <button 
          onClick={onClose}
          className="w-full mt-8 bg-primary text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function DimensionsOverlay() {
  const xRight = 0.75;
  const xLeft = -0.75;
  const yTop = 1.5;
  const zFront = 0.75;
  const zBack = -0.75;

  return (
    <group>
      {/* Width (Front Bottom) */}
      <Line points={[[xLeft, 0.05, zFront + 0.1], [xRight, 0.05, zFront + 0.1]]} color="white" lineWidth={2} />
      <Html position={[0, 0.05, zFront + 0.1]} center>
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap">1.5m</div>
      </Html>

      {/* Height (Right Front) */}
      <Line points={[[xRight + 0.1, 0, zFront], [xRight + 0.1, yTop, zFront]]} color="white" lineWidth={2} />
      <Html position={[xRight + 0.1, 0.75, zFront]} center>
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap">1.5m</div>
      </Html>

      {/* Depth (Right Bottom) */}
      <Line points={[[xRight + 0.1, 0.05, zFront], [xRight + 0.1, 0.05, zBack]]} color="white" lineWidth={2} />
      <Html position={[xRight + 0.1, 0.05, 0]} center>
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap">1.5m</div>
      </Html>
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 whitespace-nowrap">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-gray-300">{progress.toFixed(0)}% loaded</span>
      </div>
    </Html>
  );
}

function ScreenshotButton({ onCapture }: { onCapture: (url: string) => void }) {
  const { gl, scene, camera } = useThree();

  const handleScreenshot = async () => {
    // 1. Render the 3D scene to ensure buffer is up to date
    gl.render(scene, camera);
    const modelData = gl.domElement.toDataURL('image/png');

    // 2. Create a composite canvas
    const canvas = document.createElement('canvas');
    canvas.width = gl.domElement.width;
    canvas.height = gl.domElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 3. Draw 3D model
    const modelImg = new Image();
    modelImg.src = modelData;
    await new Promise<void>((resolve) => { modelImg.onload = () => resolve(); });
    ctx.drawImage(modelImg, 0, 0);
    // Note: Background image compositing removed for simplicity in gallery, or can be re-added. 
    // For gallery, capturing just the 3D context is often cleaner, or we can keep the full composite logic.
    // Keeping it simple: just the WebGL context for now to avoid cross-origin taint issues with external images in some browsers.
    
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);

    // Optional: Auto-download
    // const link = document.createElement('a');
    // link.download = `ar-view-${Date.now()}.png`;
    // link.href = dataUrl;
    // link.click();
  };

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div className="absolute top-6 right-24 z-50 pointer-events-auto">
        <button 
          onClick={handleScreenshot} 
          className="p-3 glass-panel rounded-full hover:bg-white/10 text-white transition-colors"
          title="Capture Screenshot"
        >
          <Camera size={24} />
        </button>
      </div>
    </Html>
  );
}

function VideoRecorder() {
  const { gl } = useThree();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    const stream = (gl.domElement as any).captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ar-recording-${Date.now()}.webm`;
      a.click();
      chunksRef.current = [];
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div className="absolute top-20 right-24 z-50 pointer-events-auto">
        <button 
          onClick={recording ? stopRecording : startRecording} 
          className={`p-3 rounded-full transition-colors ${recording ? 'bg-red-500 hover:bg-red-600' : 'glass-panel hover:bg-white/10'}`}
          title={recording ? "Stop Recording" : "Record Video"}
        >
          {recording ? <Square size={24} fill="white" className="text-white" /> : <Video size={24} className="text-white" />}
        </button>
      </div>
    </Html>
  );
}

function LightController({ lightRef }: { lightRef: React.RefObject<THREE.SpotLight> }) {
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.target.updateMatrixWorld();
    }
  });
  return null;
}

export default function ARCanvas() {
  const { activeArProduct, activeScene, setArProduct, compareProduct, setCompareProduct, saveDesign, savedDesigns } = useStore();
  const bgImage = scenes[activeScene];
  const controlsRef = useRef<any>(null);
  const moveRef = useRef({ x: 0, y: 0 });

  // Lighting State
  const [intensity, setIntensity] = useState(1.5);
  const [lightAngle, setLightAngle] = useState(45);
  const [isNightMode, setIsNightMode] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [floorType, setFloorType] = useState('none');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [productColor, setProductColor] = useState('#ffffff');
  const [isScanning, setIsScanning] = useState(false);
  const [isWalkMode, setIsWalkMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const [showSavedDesigns, setShowSavedDesigns] = useState(false);
  const [roughness, setRoughness] = useState(0.15);
  const [metalness, setMetalness] = useState(0.6);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showMaterialEditor, setShowMaterialEditor] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [weatherType, setWeatherType] = useState<'none' | 'rain' | 'snow'>('none');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isDayNightCycle, setIsDayNightCycle] = useState(false);
  const [shadowSoftness, setShadowSoftness] = useState(1);
  const [customTexture, setCustomTexture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPhysicsMode, setIsPhysicsMode] = useState(false);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const lightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (activeArProduct) {
      setProductColor(activeArProduct.color);
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeArProduct]);

  useEffect(() => {
    if (!isListening || typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();
      
      if (transcript.includes('rotate') || transcript.includes('spin')) setAutoRotate(true);
      else if (transcript.includes('stop')) setAutoRotate(false);
      else if (transcript.includes('red')) setProductColor('#ff0000');
      else if (transcript.includes('blue')) setProductColor('#0000ff');
      else if (transcript.includes('green')) setProductColor('#00ff00');
      else if (transcript.includes('white')) setProductColor('#ffffff');
      else if (transcript.includes('black')) setProductColor('#000000');
      else if (transcript.includes('rain')) setWeatherType('rain');
      else if (transcript.includes('snow')) setWeatherType('snow');
      else if (transcript.includes('clear')) setWeatherType('none');
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();

    return () => recognition.stop();
  }, [isListening]);

  useEffect(() => {
    if (!isDayNightCycle) return;
    let lastTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setLightAngle(prev => {
        const next = (prev + 10 * delta) % 360; // 10 degrees per second
        const isNight = next > 180;
        if (isNight !== isNightMode) setIsNightMode(isNight);
        return next;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDayNightCycle, isNightMode]);

  const lightX = Math.sin(lightAngle * (Math.PI / 180)) * 10;
  const lightZ = Math.cos(lightAngle * (Math.PI / 180)) * 10;

  const handleReset = () => {
    setIntensity(1.5);
    setLightAngle(45);
    setIsNightMode(false);
    setShowDimensions(false);
    setAutoRotate(false);
    setFloorType('none');
    setIsCompareMode(false);
    setCompareProduct(null);
    if (activeArProduct) setProductColor(activeArProduct.color);
    setIsWalkMode(false);
    setIsRunning(false);
    setJumpCount(0);
    setRoughness(0.15);
    setMetalness(0.6);
    setIsFocusMode(false);
    setShowMaterialEditor(false);
    setWeatherType('none');
    setIsListening(false);
    setIsDayNightCycle(false);
    setShadowSoftness(1);
    setCustomTexture(null);
    setCinematicMode(false);
    setIsPhysicsMode(false);
    controlsRef.current?.reset();
  };

  const cycleFloor = () => {
    const types = ['none', 'wood', 'concrete', 'tile'];
    const currentIndex = types.indexOf(floorType);
    setFloorType(types[(currentIndex + 1) % types.length]);
  };

  const handleSaveDesign = () => {
    if (!activeArProduct) return;
    saveDesign({
      id: Date.now().toString(),
      productId: activeArProduct.id,
      productName: activeArProduct.name,
      productImage: activeArProduct.image,
      color: productColor,
      scene: activeScene,
      timestamp: Date.now()
    });
  };

  const cycleWeather = () => {
    if (weatherType === 'none') setWeatherType('rain');
    else if (weatherType === 'rain') setWeatherType('snow');
    else setWeatherType('none');
  };

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomTexture(url);
    }
  };

  const { isCinematicMode, setCinematicMode } = useStore();

  return (
    <div className="relative w-full h-screen bg-black" onClick={() => isCinematicMode && setCinematicMode(false)}>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showSavedDesigns && <SavedDesignsModal onClose={() => setShowSavedDesigns(false)} />}
      {showGallery && <GalleryModal screenshots={screenshots} onClose={() => setShowGallery(false)} />}
      
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="glass-panel px-8 py-4 rounded-full flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
            <Scan size={32} className="text-primary animate-pulse" />
            <span className="text-lg font-bold tracking-widest">SCANNING ROOM</span>
          </div>
        </div>
      )}

      {isWalkMode && (
        <Joystick onMove={(x, y) => { moveRef.current = { x, y }; }} />
      )}
      
      {isWalkMode && (
        <button
          className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center active:bg-primary/40 transition-colors z-50 touch-none"
          onPointerDown={(e) => {
            e.preventDefault();
            setJumpCount(c => c + 1);
          }}
        >
          <ArrowUp size={32} className="text-white" />
        </button>
      )}

      {/* Simulated Camera Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: [
            isNightMode ? 'brightness(0.3) contrast(1.2) hue-rotate(-10deg)' : '',
            isFocusMode ? 'blur(5px)' : ''
          ].filter(Boolean).join(' ') || 'none'
        }}
      />
      
      {isCinematicMode && (
        <div className="absolute bottom-10 left-0 right-0 text-center z-50 pointer-events-none">
          <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm animate-pulse">Click anywhere to exit Cinematic Mode</span>
        </div>
      )}

      {/* Lighting Controls */}
      {!isCinematicMode && <div className="absolute top-24 right-6 z-30 w-48">
        <div className="glass-panel p-4 rounded-xl space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
              <div className="flex items-center gap-1"><Sun size={14} /> Intensity</div>
              <span>{intensity.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="20" step="0.1" 
              value={intensity} 
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
              <div className="flex items-center gap-1"><RotateCw size={14} /> Direction</div>
              <span>{lightAngle}°</span>
            </div>
            <input 
              type="range" min="0" max="360" step="1" 
              value={lightAngle} 
              onChange={(e) => setLightAngle(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
              <div className="flex items-center gap-1"><Feather size={14} /> Softness</div>
              <span>{shadowSoftness.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05" 
              value={shadowSoftness} 
              onChange={(e) => setShadowSoftness(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
              <div className="flex items-center gap-1"><Palette size={14} /> Color</div>
              <span className="uppercase">{productColor}</span>
            </div>
            <input 
              type="color" 
              value={productColor} 
              onChange={(e) => setProductColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10"
            />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleTextureUpload} 
          />

          {showMaterialEditor && (
            <div className="pt-2 border-t border-white/10 space-y-2 animate-in slide-in-from-top-2">
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Roughness</span>
                  <span>{roughness.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={roughness} 
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Metalness</span>
                  <span>{metalness.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={metalness} 
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isNightMode ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Toggle Night Mode"
            >
              <Moon size={14} />
              <span className="text-[10px] font-bold uppercase">Night</span>
            </button>
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${showDimensions ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Toggle Dimensions"
            >
              <Ruler size={14} />
              <span className="text-[10px] font-bold uppercase">Dims</span>
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${autoRotate ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Auto Rotate"
            >
              {autoRotate ? <Pause size={14} /> : <Play size={14} />}
              <span className="text-[10px] font-bold uppercase">Auto</span>
            </button>
            <button
              onClick={cycleFloor}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${floorType !== 'none' ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Change Floor Material"
            >
              <Layers size={14} />
              <span className="text-[10px] font-bold uppercase">{floorType === 'none' ? 'Floor' : floorType}</span>
            </button>
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isCompareMode ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Compare Products"
            >
              <SplitSquareHorizontal size={14} />
              <span className="text-[10px] font-bold uppercase">Compare</span>
            </button>
            <button
              onClick={() => setIsWalkMode(!isWalkMode)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isWalkMode ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Walk Mode"
            >
              <Gamepad2 size={14} />
              <span className="text-[10px] font-bold uppercase">Walk</span>
            </button>
            {isWalkMode && (
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isRunning ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
                title="Run Modifier"
              >
                <Zap size={14} />
                <span className="text-[10px] font-bold uppercase">Run</span>
              </button>
            )}
            <button
              onClick={() => setShowMaterialEditor(!showMaterialEditor)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${showMaterialEditor ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Material Editor"
            >
              <SlidersHorizontal size={14} />
              <span className="text-[10px] font-bold uppercase">Mat</span>
            </button>
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isFocusMode ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Focus Mode"
            >
              <Aperture size={14} />
              <span className="text-[10px] font-bold uppercase">Focus</span>
            </button>
            <button
              onClick={() => setIsListening(!isListening)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isListening ? 'bg-red-500/80 text-white animate-pulse' : 'bg-white/5 hover:bg-white/10'}`}
              title="Voice Control"
            >
              {isListening ? <Mic size={14} /> : <MicOff size={14} />}
              <span className="text-[10px] font-bold uppercase">Voice</span>
            </button>
            <button
              onClick={cycleWeather}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${weatherType !== 'none' ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Weather"
            >
              {weatherType === 'snow' ? <Snowflake size={14} /> : <CloudRain size={14} />}
              <span className="text-[10px] font-bold uppercase">{weatherType === 'none' ? 'Clear' : weatherType}</span>
            </button>
            <button
              onClick={() => setIsDayNightCycle(!isDayNightCycle)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isDayNightCycle ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Day/Night Cycle"
            >
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase">Cycle</span>
            </button>
            <button
              onClick={() => setShowGallery(true)}
              className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
              title="Snapshot Gallery"
            >
              <ImageIcon size={14} />
              <span className="text-[10px] font-bold uppercase">Gallery</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${customTexture ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Upload Texture"
            >
              <Upload size={14} />
              <span className="text-[10px] font-bold uppercase">Texture</span>
            </button>
            <button
              onClick={() => setCinematicMode(true)}
              className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
              title="Cinematic Mode"
            >
              <Film size={14} />
              <span className="text-[10px] font-bold uppercase">Cinema</span>
            </button>
            <button
              onClick={() => setIsPhysicsMode(!isPhysicsMode)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isPhysicsMode ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
              title="Physics Mode"
            >
              <Box size={14} />
              <span className="text-[10px] font-bold uppercase">Physics</span>
            </button>
          </div>
          
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setShowHelp(true)}
              className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <HelpCircle size={14} />
              <span className="text-[10px] font-bold uppercase">Help</span>
            </button>
            <button
              onClick={() => setShowSavedDesigns(true)}
              className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <List size={14} />
              <span className="text-[10px] font-bold uppercase">Saved</span>
            </button>
            <button
              onClick={handleSaveDesign}
              className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Save size={14} />
              <span className="text-[10px] font-bold uppercase">Save</span>
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
              title="Reset View"
            >
              <RefreshCcw size={14} />
              <span className="text-[10px] font-bold uppercase">Reset</span>
            </button>
          </div>
        </div>
      </div>}

      {/* Product Swapper */}
      {!isCinematicMode && <div className="absolute bottom-32 left-0 right-0 flex justify-center z-30 pointer-events-none">
         <div className="glass-panel p-2 rounded-2xl flex gap-2 pointer-events-auto overflow-x-auto max-w-[90vw]">
            {products.map(p => (
               <button
                  key={p.id}
                  onClick={() => isCompareMode ? setCompareProduct(p) : setArProduct(p)}
                  className={`
                    relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 
                    ${(activeArProduct?.id === p.id && !isCompareMode) || (compareProduct?.id === p.id && isCompareMode) 
                      ? 'border-primary' 
                      : 'border-transparent opacity-60 hover:opacity-100'}
                    ${isCompareMode && activeArProduct?.id === p.id ? 'border-white/50' : ''}
                  `}
               >
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
               </button>
            ))}
         </div>
      </div>}

      {/* 3D Overlay */}
      <div className="absolute inset-0 z-10">
        <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 2, 6], fov: 45 }}>
          <Suspense fallback={<Loader />}>
            <Environment preset={isNightMode ? "night" : "city"} />
            <ambientLight intensity={isNightMode ? 0.1 : 0.2} />
            <primitive object={lightTarget} position={[0, 0, 0]} />
            <LightController lightRef={lightRef} />
            <spotLight 
              ref={lightRef}
              position={[lightX, 10, lightZ]} 
              target={lightTarget}
              angle={0.3} 
              penumbra={shadowSoftness} 
              intensity={isNightMode ? intensity * 0.4 : intensity} 
              color={isNightMode ? "#aaccff" : "#ffffff"}
              castShadow 
              shadow-bias={-0.001}
              shadow-mapSize={[shadowSoftness < 0.5 ? 2048 : 1024, shadowSoftness < 0.5 ? 2048 : 1024]}
            />
            
            {activeArProduct && (
              <OrbitControls 
                ref={controlsRef}
                makeDefault 
                autoRotate={autoRotate || isCinematicMode}
                autoRotateSpeed={isCinematicMode ? 0.5 : 2}
                enablePan={false} 
                enableZoom={true} 
                enableRotate={true}
                enableDamping={true}
                dampingFactor={0.05}
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 2 - 0.05} 
                enabled={!isWalkMode || true} // Keep enabled for looking around, WalkLogic handles movement
              />
            )}
            
            {isScanning && (
               <Grid 
                 position={[0, -1.01, 0]} 
                 args={[10, 10]} 
                 cellColor="#00d4ff" 
                 sectionColor="#ffffff" 
                 sectionThickness={1.5} 
                 cellThickness={0.6} 
                 fadeDistance={20} 
                 infiniteGrid 
               />
            )}
            
            {!isScanning && activeArProduct && (
               <Physics gravity={[0, -9.81, 0]} isPaused={!isPhysicsMode && !isWalkMode}>
                 <group position={compareProduct && isCompareMode ? [-0.8, -1, 0] : [0, -1, 0]}>
                    {isPhysicsMode || isWalkMode ? (
                      <>
                        <PhysicsProduct color={productColor} imageUrl={activeArProduct.image} roughness={roughness} metalness={metalness} customTexture={customTexture} />
                        <PhysicsFloor />
                      </>
                    ) : (
                      <ARModel color={productColor} imageUrl={activeArProduct.image} roughness={roughness} metalness={metalness} customTexture={customTexture} />
                    )}
                    <Floor type={floorType} />
                    <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
                    {showDimensions && <DimensionsOverlay />}
                    {isWalkMode && <PlayerController moveRef={moveRef} controlsRef={controlsRef} isRunning={isRunning} jumpCount={jumpCount} />}
                 </group>
               </Physics>
            )}
            
            {!isScanning && compareProduct && isCompareMode && (
               <group position={[0.8, -1, 0]}>
                  <ARModel color={compareProduct.color} imageUrl={compareProduct.image} roughness={roughness} metalness={metalness} />
                  <Floor type={floorType} />
                  <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
                  {showDimensions && <DimensionsOverlay />}
               </group>
            )}

            {weatherType !== 'none' && <WeatherSystem type={weatherType} />}

            {!isCinematicMode && <ScreenshotButton onCapture={(url) => setScreenshots(prev => [...prev, url])} />}
            {!isCinematicMode && <VideoRecorder />}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}