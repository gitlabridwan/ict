import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RegionId } from '../../types/game';
import { REGIONS_META } from '../../data/materials';
import { createBitRobot, detectSoftwareGl } from './threeHelpers';

interface CityHub3DProps {
  completedRegions: Record<RegionId, boolean>;
  onSelectRegion: (regionId: RegionId) => void;
  graphicsQuality: 'high' | 'medium' | 'low';
}

export const CityHub3D: React.FC<CityHub3DProps> = ({
  completedRegions,
  onSelectRegion,
  graphicsQuality
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const onSelectRegionRef = useRef(onSelectRegion);
  onSelectRegionRef.current = onSelectRegion;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const isSoftware = detectSoftwareGl() || graphicsQuality === 'low';

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 clean cyber backdrop
    scene.fog = new THREE.FogExp2(0x0f172a, 0.025);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(15, 13, 17);
    camera.lookAt(0, 0.5, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware && graphicsQuality === 'high',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftware && graphicsQuality === 'high';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Lighting (Rich warm-cool studio lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x334155, 1.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(12, 20, 10);
    dirLight.castShadow = !isSoftware && graphicsQuality === 'high';
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    // Central glow light
    const centerPointLight = new THREE.PointLight(0x06b6d4, 3, 15);
    centerPointLight.position.set(0, 3, 0);
    scene.add(centerPointLight);

    // 4. Ground: Low-Poly Floating Island
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Island Top Surface (Cyber Hexagonal/Curved platform)
    const platformGeo = new THREE.CylinderGeometry(10, 8.5, 1.5, 12);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.2
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.75;
    platform.receiveShadow = true;
    islandGroup.add(platform);

    // Center Plaza
    const plazaGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 16);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.6
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.y = 0.05;
    islandGroup.add(plaza);

    // Plaza Glowing Ring
    const ringGeo = new THREE.RingGeometry(3.2, 3.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.16;
    islandGroup.add(ring);

    // Island Underbelly (Crystal rocks hanging down)
    const rockGeo = new THREE.ConeGeometry(8.5, 5, 8);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1
    });
    const underbelly = new THREE.Mesh(rockGeo, rockMat);
    underbelly.rotation.x = Math.PI;
    underbelly.position.y = -4;
    islandGroup.add(underbelly);

    // 5. BIT Robot standing in Central Plaza
    const bitRobot = createBitRobot();
    bitRobot.position.set(0, 0.15, 0);
    bitRobot.scale.set(1.4, 1.4, 1.4);
    scene.add(bitRobot);

    // 6. Connecting Pathways to the 4 Portals
    const createPathway = (angle: number, length: number, colorHex: number) => {
      const pathGeo = new THREE.BoxGeometry(1.4, 0.08, length);
      const pathMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.4
      });
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.y = angle;
      const dist = length / 2 + 1.5;
      path.position.set(Math.sin(angle) * dist, 0.06, Math.cos(angle) * dist);
      islandGroup.add(path);

      // Neon strip down the middle
      const stripGeo = new THREE.BoxGeometry(0.2, 0.09, length);
      const stripMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.rotation.y = angle;
      strip.position.set(Math.sin(angle) * dist, 0.08, Math.cos(angle) * dist);
      islandGroup.add(strip);
    };

    // 7. Interactive Portals & Districts
    interface PortalInfo {
      id: RegionId;
      name: string;
      position: THREE.Vector3;
      color: number;
      meshGroup: THREE.Group;
    }

    const portals: PortalInfo[] = [];

    // Portal 1: Lab Komputer (North-West)
    const labGroup = new THREE.Group();
    labGroup.position.set(-6, 0, -6);

    // Lab building: Giant Cyber Computer monitor & tower
    const compCaseGeo = new THREE.BoxGeometry(1.6, 2.4, 1.6);
    const compCaseMat = new THREE.MeshStandardMaterial({
      color: completedRegions.lab ? 0x2563eb : 0x475569,
      roughness: 0.3,
      metalness: 0.7
    });
    const compCase = new THREE.Mesh(compCaseGeo, compCaseMat);
    compCase.position.y = 1.2;
    compCase.castShadow = true;
    labGroup.add(compCase);

    const compScreenGeo = new THREE.BoxGeometry(1.4, 1.4, 0.1);
    const compScreenMat = new THREE.MeshBasicMaterial({
      color: completedRegions.lab ? 0x60a5fa : 0x1e3a8a
    });
    const compScreen = new THREE.Mesh(compScreenGeo, compScreenMat);
    compScreen.position.set(0, 1.4, 0.82);
    labGroup.add(compScreen);

    islandGroup.add(labGroup);
    portals.push({
      id: 'lab',
      name: REGIONS_META.lab.name,
      position: labGroup.position,
      color: 0x3b82f6,
      meshGroup: labGroup
    });
    createPathway(Math.atan2(-6, -6), 5, 0x3b82f6);

    // Portal 2: Taman Algoritma (North-East)
    const algoGroup = new THREE.Group();
    algoGroup.position.set(6, 0, -6);

    // Logic Gate Arch / Crystal Grid Trees
    const archPillarGeo = new THREE.BoxGeometry(0.4, 2.6, 0.4);
    const algoMat = new THREE.MeshStandardMaterial({
      color: completedRegions.algorithm ? 0x059669 : 0x475569,
      roughness: 0.4
    });
    const pillar1 = new THREE.Mesh(archPillarGeo, algoMat);
    pillar1.position.set(-0.8, 1.3, 0);
    algoGroup.add(pillar1);

    const pillar2 = new THREE.Mesh(archPillarGeo, algoMat);
    pillar2.position.set(0.8, 1.3, 0);
    algoGroup.add(pillar2);

    const archTopGeo = new THREE.BoxGeometry(2.2, 0.4, 0.4);
    const archTop = new THREE.Mesh(archTopGeo, algoMat);
    archTop.position.set(0, 2.6, 0);
    algoGroup.add(archTop);

    // Floating diamond crystal in center of gate
    const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x10b981,
      emissiveIntensity: completedRegions.algorithm ? 0.7 : 0.2
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(0, 1.5, 0);
    algoGroup.add(crystal);

    islandGroup.add(algoGroup);
    portals.push({
      id: 'algorithm',
      name: REGIONS_META.algorithm.name,
      position: algoGroup.position,
      color: 0x10b981,
      meshGroup: algoGroup
    });
    createPathway(Math.atan2(6, -6), 5, 0x10b981);

    // Portal 3: Pusat Jaringan (South-East)
    const netGroup = new THREE.Group();
    netGroup.position.set(6, 0, 6);

    // Transmission Tower
    const towerGeo = new THREE.CylinderGeometry(0.2, 0.7, 3, 6);
    const netMat = new THREE.MeshStandardMaterial({
      color: completedRegions.network ? 0x7c3aed : 0x475569,
      roughness: 0.3,
      metalness: 0.8
    });
    const tower = new THREE.Mesh(towerGeo, netMat);
    tower.position.y = 1.5;
    tower.castShadow = true;
    netGroup.add(tower);

    // Broadcast pulse rings
    const netRingGeo = new THREE.TorusGeometry(0.8, 0.08, 8, 16);
    const netRingMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const netRing = new THREE.Mesh(netRingGeo, netRingMat);
    netRing.rotation.x = Math.PI / 2;
    netRing.position.y = 2.4;
    netGroup.add(netRing);

    islandGroup.add(netGroup);
    portals.push({
      id: 'network',
      name: REGIONS_META.network.name,
      position: netGroup.position,
      color: 0x8b5cf6,
      meshGroup: netGroup
    });
    createPathway(Math.atan2(6, 6), 5, 0x8b5cf6);

    // Portal 4: Benteng Keamanan (South-West)
    const secGroup = new THREE.Group();
    secGroup.position.set(-6, 0, 6);

    // Cyber Fortress Tower & Shield
    const fortressGeo = new THREE.CylinderGeometry(1.2, 1.4, 2.2, 6);
    const secMat = new THREE.MeshStandardMaterial({
      color: completedRegions.security ? 0xd97706 : 0x475569,
      roughness: 0.4,
      metalness: 0.6
    });
    const fortress = new THREE.Mesh(fortressGeo, secMat);
    fortress.position.y = 1.1;
    fortress.castShadow = true;
    secGroup.add(fortress);

    // Shield Emblem
    const shieldGeo = new THREE.BoxGeometry(0.8, 1.0, 0.2);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xf59e0b,
      emissiveIntensity: completedRegions.security ? 0.6 : 0.2
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 1.4, 1.25);
    secGroup.add(shield);

    islandGroup.add(secGroup);
    portals.push({
      id: 'security',
      name: REGIONS_META.security.name,
      position: secGroup.position,
      color: 0xf59e0b,
      meshGroup: secGroup
    });
    createPathway(Math.atan2(-6, 6), 5, 0xf59e0b);

    // Status beacon markers above portals
    const portalMarkers: THREE.Mesh[] = [];
    portals.forEach(portal => {
      const markerGeo = new THREE.ConeGeometry(0.35, 0.7, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: completedRegions[portal.id] ? 0x22c55e : portal.color
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.rotation.x = Math.PI; // point downward
      marker.position.set(portal.position.x, 3.8, portal.position.z);
      scene.add(marker);
      portalMarkers.push(marker);
    });

    // 8. Mouse / Raycasting interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredPortal: RegionId | null = null;
    let isDragging = false;
    let previousMouseX = 0;
    let rotationVelocity = 0.002;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      previousMouseX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - previousMouseX;
        islandGroup.rotation.y += deltaX * 0.008;
        previousMouseX = clientX;
        rotationVelocity = 0;
      }

      // Check raycasting for hover
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const checkObjects = portals.map(p => p.meshGroup);
      const intersects = raycaster.intersectObjects(checkObjects, true);

      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && parent !== scene) {
          const matched = portals.find(p => p.meshGroup === parent);
          if (matched) {
            hoveredPortal = matched.id;
            renderer.domElement.style.cursor = 'pointer';
            return;
          }
          parent = parent.parent;
        }
      }
      hoveredPortal = null;
      renderer.domElement.style.cursor = 'grab';
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      isDragging = false;
      rotationVelocity = 0.001; // subtle auto drift

      // If clicked on a portal
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const checkObjects = portals.map(p => p.meshGroup);
      const intersects = raycaster.intersectObjects(checkObjects, true);

      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && parent !== scene) {
          const matched = portals.find(p => p.meshGroup === parent);
          if (matched) {
            onSelectRegionRef.current(matched.id);
            return;
          }
          parent = parent.parent;
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 9. Animation loop with software WebGL pacing
    let animId: number = 0;
    let clock = new THREE.Clock();

    const tick = () => {
      const elapsed = clock.getElapsedTime();

      // Idle robot float and head bob
      bitRobot.position.y = 0.2 + Math.sin(elapsed * 2) * 0.08;
      const head = bitRobot.getObjectByName('Head');
      if (head) {
        head.rotation.y = Math.sin(elapsed * 1.2) * 0.2;
      }

      // Rotate crystals & rings
      crystal.rotation.y = elapsed * 1.5;
      netRing.rotation.z = elapsed * 2;

      // Animate beacon markers
      portalMarkers.forEach((marker, idx) => {
        marker.position.y = 3.6 + Math.sin(elapsed * 3 + idx) * 0.15;
        marker.rotation.y = elapsed * 2;
      });

      // Island slow drift if not dragging
      if (!isDragging) {
        islandGroup.rotation.y += rotationVelocity;
      }

      renderer.render(scene, camera);

      if (isSoftware) {
        // Paced software render loop to prevent browser starvation
        animId = window.setTimeout(tick, 80);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    tick();

    // 10. Handle window resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (isSoftware) {
        clearTimeout(animId);
      } else {
        cancelAnimationFrame(animId);
      }
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [completedRegions, graphicsQuality]);

  return (
    <div className="relative w-full h-full min-h-[460px] select-none">
      <div ref={mountRef} className="w-full h-full min-h-[460px]" />

      {/* Floating Region Portal Direct Selection Overlay for accessibility & touch */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-center gap-2 pointer-events-none">
        {(Object.keys(REGIONS_META) as RegionId[]).map(rId => {
          const meta = REGIONS_META[rId];
          const isDone = completedRegions[rId];
          return (
            <button
              key={rId}
              onClick={() => onSelectRegion(rId)}
              className={`pointer-events-auto px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all shadow-lg backdrop-blur-md flex items-center gap-2 ${
                isDone
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/90'
                  : 'bg-slate-900/85 border-slate-700/70 text-slate-200 hover:bg-slate-800 hover:border-slate-500'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: isDone ? '#10b981' : meta.themeColor }}
              />
              <span className="font-semibold">{meta.name.split(':')[0]}</span>
              {isDone && <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 rounded">PULIH</span>}
            </button>
          );
        })}
      </div>

      {/* Helpful hint at bottom-center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] sm:text-xs text-slate-400 pointer-events-none flex items-center gap-2">
        <span className="text-cyan-400">💡 Tips:</span>
        <span>Klik atau sentuh gedung wilayah untuk mulai menjelajah. Geser untuk memutar pulau.</span>
      </div>
    </div>
  );
};
