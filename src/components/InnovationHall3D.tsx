import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Booth, InnovationTopic, Theme } from '../types/innovation';

const colors: Record<Theme, string> = {
  'Data / Security': '#2b7de9',
  'Emerging Trends': '#7a35e8',
  'Engineering Efficiency & Enhancements': '#08a66a',
  'Modernization and Transformation': '#2457b8',
  'Tech 4 Business': '#eb7717',
  'Tech 4 Tech': '#0aa8b6'
};
const positions: [number, number, number][] = [
  [-7, 0, -6.5], [0, 0, -6.5], [7, 0, -6.5],
  [-7.2, 0, 0.5], [0, 0, 0.5], [7.2, 0, 0.5],
  [-7.7, 0, 7.4], [0, 0, 7.4], [7.7, 0, 7.4]
];

type HallProps = {
  booths: Booth[];
  selected: Booth | null;
  onSelect: (booth: Booth) => void;
  matching: (booth: Booth) => boolean;
  activeBoard: (booth: Booth) => InnovationTopic | null;
};

type SceneProps = HallProps;

export default function InnovationHall3D(props: HallProps) {
  return <div className="three-hall"><Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}><Scene {...props} /></Canvas></div>;
}

function Scene({ booths, selected, onSelect, matching, activeBoard }: SceneProps) {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const controls = useRef<any>(null);
  const targetPosition = useRef(new THREE.Vector3(10, 10, 16));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, 0));

  useEffect(() => {
    const index = selected ? booths.findIndex((booth) => booth.id === selected.id) : -1;
    if (index < 0) {
      targetPosition.current.set(10, 10, 16);
      targetLookAt.current.set(0, 1.5, 0);
      return;
    }
    const [x, , z] = positions[index];
    targetPosition.current.set(x + 4.8, 5.8, z + 7.5);
    targetLookAt.current.set(x, 1.5, z);
  }, [booths, selected]);

  useFrame(() => {
    if (!camera.current || !controls.current) return;
    camera.current.position.lerp(targetPosition.current, 0.045);
    controls.current.target.lerp(targetLookAt.current, 0.06);
    controls.current.update();
  });

  return <>
    <PerspectiveCamera ref={camera} makeDefault position={[10, 10, 16]} fov={42} near={0.1} far={1000} />
    <color attach="background" args={['#b8ccd4']} />
    <fog attach="fog" args={['#b8ccd4', 35, 90]} />
    <ambientLight intensity={1.4} color="#fff5e8" />
    <hemisphereLight intensity={1.6} color="#eaf7ff" groundColor="#9c8e80" />
    <directionalLight castShadow position={[5, 18, 8]} intensity={2.8} color="#fff0d1" shadow-mapSize={[2048, 2048]} shadow-camera-left={-28} shadow-camera-right={28} shadow-camera-top={28} shadow-camera-bottom={-28} />
    <pointLight position={[-12, 9, -8]} intensity={40} distance={30} color="#fff2d5" />
    <pointLight position={[12, 9, -8]} intensity={40} distance={30} color="#fff2d5" />
    <HallArchitecture />
    {booths.map((booth, index) => <Booth3D key={booth.id} booth={booth} index={index} selected={selected?.id === booth.id} dim={!matching(booth)} topic={activeBoard(booth)} onSelect={onSelect} />)}
    <OrbitControls ref={controls} enableDamping dampingFactor={0.08} minDistance={9} maxDistance={38} minPolarAngle={0.55} maxPolarAngle={1.35} target={[0, 1.5, 0]} />
  </>;
}

function HallArchitecture() {
  const skyline = useMemo(() => Array.from({ length: 18 }, (_, index) => ({ x: -19 + index * 2.15, height: 2.2 + ((index * 7) % 5) * 0.7 })), []);
  return <group>
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}><planeGeometry args={[52, 52]} /><meshStandardMaterial color="#dedbd4" roughness={0.28} metalness={0.12} /></mesh>
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[48, 48]} /><meshStandardMaterial color="#b8bdbe" roughness={0.22} metalness={0.25} /></mesh>
    <mesh position={[0, 5, -15]} receiveShadow><boxGeometry args={[42, 10, 0.55]} /><meshStandardMaterial color="#f1f2ef" roughness={0.8} /></mesh>
    <mesh position={[0, 4.1, -14.55]}><boxGeometry args={[18, 6.4, 0.3]} /><meshStandardMaterial color="#920b1c" roughness={0.62} /></mesh>
    <Text position={[0, 5.7, -14.35]} fontSize={0.8} color="white" anchorX="center" anchorY="middle" maxWidth={13}>INNOVATION SHOWCASE</Text>
    <Text position={[0, 4.8, -14.35]} fontSize={0.34} color="#ffd8d9" anchorX="center" anchorY="middle">Ideas Today. Impact Tomorrow.</Text>
    <mesh position={[0, 7.4, -14.1]}><boxGeometry args={[1.4, 0.9, 0.18]} /><meshStandardMaterial color="#e21a35" emissive="#72000f" emissiveIntensity={0.35} /></mesh>
    <Text position={[0, 7.43, -14]} fontSize={0.16} color="white" anchorX="center" anchorY="middle">WELLS FARGO</Text>
    <mesh position={[-15, 5, -14.2]}><boxGeometry args={[10, 8, 0.18]} /><meshStandardMaterial color="#9fc4d4" transparent opacity={0.32} roughness={0.12} metalness={0.28} /></mesh>
    <mesh position={[15, 5, -14.2]}><boxGeometry args={[10, 8, 0.18]} /><meshStandardMaterial color="#9fc4d4" transparent opacity={0.32} roughness={0.12} metalness={0.28} /></mesh>
    {skyline.map((building) => <mesh key={building.x} position={[building.x, building.height / 2, -13.9]}><boxGeometry args={[1.25, building.height, 0.12]} /><meshStandardMaterial color="#557585" transparent opacity={0.42} /></mesh>)}
    {[-19, -13, 13, 19].map((x) => <mesh key={x} castShadow position={[x, 4, -13.6]}><boxGeometry args={[0.7, 8, 0.7]} /><meshStandardMaterial color="#9d8b78" roughness={0.7} /></mesh>)}
    {[-12, -6, 0, 6, 12].map((x) => <mesh key={x} position={[x, 9.4, -4]}><boxGeometry args={[3.8, 0.12, 0.5]} /><meshStandardMaterial color="#f6d08b" emissive="#e59b3c" emissiveIntensity={2.2} /></mesh>)}
    <StagePlant position={[-9.8, 0, -13.2]} /><StagePlant position={[9.8, 0, -13.2]} />
    <Reception position={[-15, 0, 12]} /><Lounge position={[15, 0, 11]} />
  </group>;
}

function Booth3D({ booth, index, selected, dim, topic, onSelect }: { booth: Booth; index: number; selected: boolean; dim: boolean; topic: InnovationTopic | null; onSelect: (booth: Booth) => void }) {
  const [x, , z] = positions[index];
  const theme = (topic?.themes[0] || 'Data / Security') as Theme;
  const accent = colors[theme];
  const width = booth.size === '6x8' ? 5.8 : 4.6;
  const depth = booth.size === '6x8' ? 4.5 : 4;
  const rotation = index % 3 === 1 ? -0.025 : index % 3 === 2 ? 0.025 : 0;
  return <group position={[x, 0, z]} rotation={[0, rotation, 0]} onClick={(event) => { event.stopPropagation(); onSelect(booth); }}>
    <mesh receiveShadow position={[0, 0.04, 0]}><boxGeometry args={[width + 0.7, 0.08, depth + 0.7]} /><meshStandardMaterial color="#b40b24" roughness={0.7} transparent opacity={dim ? 0.42 : 1} /></mesh>
    <mesh castShadow position={[0, 2.5, -depth / 2]}><boxGeometry args={[width, 5, 0.18]} /><meshStandardMaterial color="#f8f8f5" roughness={0.72} transparent opacity={dim ? 0.48 : 1} /></mesh>
    <mesh castShadow position={[-width / 2, 2.5, 0]}><boxGeometry args={[0.18, 5, depth]} /><meshStandardMaterial color="#eceee9" roughness={0.72} transparent opacity={dim ? 0.48 : 1} /></mesh>
    <mesh castShadow position={[width / 2, 2.5, 0]}><boxGeometry args={[0.18, 5, depth]} /><meshStandardMaterial color="#eceee9" roughness={0.72} transparent opacity={dim ? 0.48 : 1} /></mesh>
    <mesh castShadow position={[0, 5.08, -depth / 2 + 0.06]}><boxGeometry args={[width + 0.16, 0.64, 0.32]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={dim ? 0.05 : 0.22} transparent opacity={dim ? 0.45 : 1} /></mesh>
    <Text position={[0, 5.1, -depth / 2 + 0.25]} fontSize={0.2} color="white" anchorX="center" anchorY="middle" maxWidth={width - 0.4}>{theme.toUpperCase()}</Text>
    <DigitalBoard topic={topic} width={Math.min(width - 0.8, 4.6)} accent={accent} dim={dim} position={[0, 3.25, -depth / 2 + 0.16]} />
    <mesh castShadow position={[0, 0.62, 0.3]}><boxGeometry args={[1.8, 1.15, 0.8]} /><meshStandardMaterial color="#f8f7f3" roughness={0.5} /></mesh>
    <mesh position={[0, 0.64, -0.13]}><boxGeometry args={[1.82, 0.1, 0.04]} /><meshStandardMaterial color="#c4152d" emissive="#56000a" emissiveIntensity={0.35} /></mesh>
    <BrandMark position={[0, 0.65, 0.72]} />
    <Chair position={[-Math.min(1.3, width / 3), 0.38, 1.1]} /><Chair position={[Math.min(1.3, width / 3), 0.38, 1.1]} />
    <Plant position={[-width / 2 + 0.42, 0, 0.9]} /><Plant position={[width / 2 - 0.42, 0, 0.9]} />
    {booth.teams === 2 && <><Text position={[-width / 4, 0.17, 1.35]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.14} color="#7b1b27" anchorX="center">LEFT TEAM</Text><Text position={[width / 4, 0.17, 1.35]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.14} color="#7b1b27" anchorX="center">RIGHT TEAM</Text></>}
    <Text position={[width / 2 - 0.18, 0.26, depth / 2 + 0.08]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color="#ffffff" anchorX="right">{booth.id}</Text>
    {selected && <pointLight position={[0, 3, 0]} color={accent} intensity={45} distance={7} />}
  </group>;
}

function DigitalBoard({ topic, width, accent, dim, position }: { topic: InnovationTopic | null; width: number; accent: string; dim: boolean; position: [number, number, number] }) {
  return <group position={position}>
    <mesh castShadow><boxGeometry args={[width, 1.65, 0.12]} /><meshStandardMaterial color="#1c2f3d" roughness={0.32} metalness={0.3} emissive={dim ? '#091016' : '#0b2334'} emissiveIntensity={0.7} /></mesh>
    <mesh position={[0, 0, 0.08]}><planeGeometry args={[width - 0.16, 1.49]} /><meshStandardMaterial color="#0d2c49" emissive={accent} emissiveIntensity={dim ? 0.18 : 0.55} transparent opacity={dim ? 0.5 : 0.94} /></mesh>
    {topic && <><Text position={[-width / 2 + 0.2, 0.52, 0.16]} fontSize={0.13} color={accent} anchorX="left" anchorY="middle" maxWidth={width - 0.4}>{topic.themes[0].toUpperCase()}</Text><Text position={[-width / 2 + 0.2, 0.18, 0.16]} fontSize={0.22} color="white" anchorX="left" anchorY="middle" maxWidth={width - 0.4}>{topic.topicName}</Text><Text position={[-width / 2 + 0.2, -0.2, 0.16]} fontSize={0.12} color="#bed2df" anchorX="left" anchorY="middle" maxWidth={width - 0.4}>{topic.spocName} · {topic.status} · {topic.score}</Text><Text position={[-width / 2 + 0.2, -0.48, 0.16]} fontSize={0.1} color="#d5e1e7" anchorX="left" anchorY="middle" maxWidth={width - 0.4}>{topic.innovativeApproach}</Text></>}
  </group>;
}

function BrandMark({ position }: { position: [number, number, number] }) { return <group position={position}><mesh><boxGeometry args={[0.48, 0.42, 0.04]} /><meshStandardMaterial color="#df1734" emissive="#70000d" emissiveIntensity={0.4} /></mesh><Text position={[0, 0, 0.04]} fontSize={0.08} color="white" anchorX="center" anchorY="middle">WF</Text></group>; }
function Chair({ position }: { position: [number, number, number] }) { return <group position={position}><mesh castShadow position={[0, 0.3, 0]}><cylinderGeometry args={[0.28, 0.28, 0.08, 16]} /><meshStandardMaterial color="#a6afb3" /></mesh><mesh castShadow position={[0, 0.62, 0.12]}><boxGeometry args={[0.42, 0.55, 0.08]} /><meshStandardMaterial color="#68777f" /></mesh><mesh castShadow position={[0, 0.18, 0]}><cylinderGeometry args={[0.04, 0.04, 0.32, 8]} /><meshStandardMaterial color="#38444a" /></mesh></group>; }
function Plant({ position }: { position: [number, number, number] }) { return <group position={position}><mesh castShadow position={[0, 0.35, 0]}><cylinderGeometry args={[0.18, 0.23, 0.45, 12]} /><meshStandardMaterial color="#d9d7cf" /></mesh><mesh castShadow position={[0, 1.03, 0]}><dodecahedronGeometry args={[0.55, 1]} /><meshStandardMaterial color="#2c875b" roughness={0.8} /></mesh></group>; }
function StagePlant({ position }: { position: [number, number, number] }) { return <group position={position} scale={1.7}><Plant position={[0, 0, 0]} /></group>; }
function Reception({ position }: { position: [number, number, number] }) { return <group position={position}><mesh castShadow position={[0, 0.55, 0]}><cylinderGeometry args={[2.2, 2.5, 1.1, 32, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#f5f5f0" roughness={0.42} /></mesh><Text position={[0, 0.7, 0.3]} rotation={[0, Math.PI, 0]} fontSize={0.22} color="#9b0b20" anchorX="center">INNOVATION SHOWCASE</Text></group>; }
function Lounge({ position }: { position: [number, number, number] }) { return <group position={position}><mesh castShadow position={[-1.3, 0.42, 0]}><boxGeometry args={[2.4, 0.45, 0.9]} /><meshStandardMaterial color="#7b8490" /></mesh><mesh castShadow position={[1.3, 0.42, 0]}><boxGeometry args={[2.4, 0.45, 0.9]} /><meshStandardMaterial color="#9e1d30" /></mesh><mesh castShadow position={[0, 0.32, -1.05]}><cylinderGeometry args={[0.7, 0.7, 0.12, 24]} /><meshStandardMaterial color="#272f35" metalness={0.5} /></mesh><Plant position={[2.4, 0, -1]} /></group>; }
