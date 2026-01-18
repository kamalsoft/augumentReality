'use client';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Stage, Float, MeshDistortMaterial } from '@react-three/drei';

interface ModelProps {
  color: string;
}

function PlaceholderModel({ color }: ModelProps) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial 
          color={color} 
          speed={2} 
          distort={0.3} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
    </Float>
  );
}

export default function ModelView({ color }: { color: string }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
        <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
          <Stage environment="city" intensity={0.6}>
            <PlaceholderModel color={color} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </div>
  );
}