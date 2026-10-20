import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Character } from '../types/character';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Sparkles, Sun } from 'lucide-react';

interface CharacterVoxelStageProps {
  character: Character;
  archetypeMode?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export const CharacterVoxelStage: React.FC<CharacterVoxelStageProps> = ({
  character,
  archetypeMode = false,
  fullScreen = true,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // References to keep Three.js animation and scene state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainStageGroupRef = useRef<THREE.Group | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const pedestalGroupRef = useRef<THREE.Group | null>(null);
  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const spotlightRef = useRef<THREE.SpotLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const starPointsRef = useRef<THREE.Points | null>(null);

  // Rotation and momentum tracking
  const rotationVelocityRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);
  autoRotateRef.current = autoRotate;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (_) {
      setWebglSupported(false);
      return;
    }

    const width = fullScreen ? window.innerWidth : (container.clientWidth || 400);
    const height = fullScreen ? window.innerHeight : (container.clientHeight || 500);

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Subtle cosmic void fog
    scene.fog = new THREE.FogExp2('#0B0914', 0.035);

    // 2. Camera: Framed with golden ratio padding
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 12.0);
    camera.lookAt(0, 1.10, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Helper: Compute X position for rightmost stage anchoring
    const computeTargetX = (w: number, h: number) => {
      if (!fullScreen || w < 1024) return 0;
      const aspect = w / h;
      const visibleHalfWidth = Math.tan((36 * Math.PI) / 360) * 12.0 * aspect;
      return visibleHalfWidth * 0.36; // ~68% screen horizontal position
    };

    const initialTargetX = computeTargetX(width, height);

    // 4. Main Stage Parent Group (Contains pedestal, character, shadow plane)
    const mainStageGroup = new THREE.Group();
    mainStageGroup.position.x = initialTargetX;
    if (fullScreen) {
      mainStageGroup.scale.set(0.74, 0.74, 0.74);
    }
    scene.add(mainStageGroup);
    mainStageGroupRef.current = mainStageGroup;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight('#2A2244', 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#FFFFFF', 2.0);
    dirLight.position.set(initialTargetX + 4, 7, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Top dramatic spotlight on character
    const spotlight = new THREE.SpotLight('#FFF8E7', 3.5);
    spotlight.position.set(initialTargetX, 7.5, 3);
    spotlight.target.position.set(initialTargetX, 1.10, 0);
    scene.add(spotlight.target);
    spotlight.angle = Math.PI / 5;
    spotlight.penumbra = 0.8;
    spotlight.castShadow = true;
    scene.add(spotlight);
    spotlightRef.current = spotlight;

    // Back rim light (tinted to character accent)
    const rimLight = new THREE.PointLight(character.palette.accentSecondary, 3.0, 10);
    rimLight.position.set(initialTargetX, 2.5, -3.5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Background cosmic drifting starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 180;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 35;
      starPositions[i + 1] = Math.random() * 20 - 4;
      starPositions[i + 2] = (Math.random() - 0.5) * 22;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: '#82AAFF',
      transparent: true,
      opacity: 0.55,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);
    starPointsRef.current = starPoints;

    // 6. Build Pedestal (Minecraft Bedrock dressing room style obsidian & rune platform)
    const pedestalGroup = new THREE.Group();
    pedestalGroupRef.current = pedestalGroup;
    mainStageGroup.add(pedestalGroup);

    // Base cylinder
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.4, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: '#120E24',
      roughness: 0.6,
      metalness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Glowing Rune Ring on Pedestal Top
    const ringGeo = new THREE.RingGeometry(1.6, 1.9, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: character.palette.accentGold,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.01;
    pedestalGroup.add(ringMesh);
    ringMeshRef.current = ringMesh;

    // Subtle shadow receiver plane on the floor
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.41;
    shadowPlane.receiveShadow = true;
    mainStageGroup.add(shadowPlane);

    // 7. Character Group Container
    const charGroup = new THREE.Group();
    charGroup.position.y = 0.0;
    mainStageGroup.add(charGroup);
    characterGroupRef.current = charGroup;

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = fullScreen ? window.innerWidth : (container.clientWidth || 400);
      const h = fullScreen ? window.innerHeight : (container.clientHeight || 500);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const tx = computeTargetX(w, h);
      if (mainStageGroupRef.current) {
        mainStageGroupRef.current.position.x = tx;
      }
      if (spotlightRef.current) {
        spotlightRef.current.position.x = tx;
        spotlightRef.current.target.position.set(tx, 1.10, 0);
        spotlightRef.current.target.updateMatrixWorld();
      }
      if (rimLightRef.current) {
        rimLightRef.current.position.x = tx;
      }
      if (dirLightRef.current) {
        dirLightRef.current.position.x = tx + 4;
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Background stars rotation
      if (starPointsRef.current) {
        starPointsRef.current.rotation.y = elapsed * 0.015;
      }

      // Apply rotation & momentum
      if (charGroup) {
        if (autoRotateRef.current) {
          charGroup.rotation.y += 0.012;
        } else if (Math.abs(rotationVelocityRef.current) > 0.0001) {
          charGroup.rotation.y += rotationVelocityRef.current;
          rotationVelocityRef.current *= 0.94; // friction
        }

        // Idle breathing and subtle bobbing animation
        const breath = Math.sin(elapsed * 2.2) * 0.03;
        charGroup.position.y = breath;

        // Subtle arm/limb breathing movement
        const leftArm = charGroup.getObjectByName('leftArm');
        const rightArm = charGroup.getObjectByName('rightArm');
        const head = charGroup.getObjectByName('head');
        const cape = charGroup.getObjectByName('cape');

        if (leftArm) leftArm.rotation.x = Math.sin(elapsed * 1.8) * 0.08;
        if (rightArm) rightArm.rotation.x = -Math.sin(elapsed * 1.8) * 0.08;
        if (head) head.rotation.y = Math.sin(elapsed * 0.8) * 0.06;
        if (cape) cape.rotation.x = 0.2 + Math.sin(elapsed * 2.5) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Character Model whenever `character` prop changes
  useEffect(() => {
    const charGroup = characterGroupRef.current;
    if (!charGroup || !sceneRef.current) return;

    // Clear previous character meshes
    while (charGroup.children.length > 0) {
      const obj = charGroup.children[0];
      charGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    // Update Rim Light color to character's secondary accent
    if (rimLightRef.current) {
      rimLightRef.current.color.set(character.palette.accentSecondary);
    }

    // Update Rune Ring on pedestal
    if (ringMeshRef.current) {
      (ringMeshRef.current.material as THREE.MeshBasicMaterial).color.set(character.palette.accentGold);
    }

    // Build the Voxel Rig for this character
    buildVoxelCharacter(charGroup, character);
  }, [character]);

  // Adjust Camera Zoom
  useEffect(() => {
    if (cameraRef.current) {
      const baseZ = fullScreen ? 12.0 : 7.5;
      cameraRef.current.position.z = baseZ / zoomLevel;
    }
  }, [zoomLevel, fullScreen]);

  // Pointer / Touch Drag handlers for 360 degree rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    lastPointerXRef.current = e.clientX;
    rotationVelocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !characterGroupRef.current) return;
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    const rotSpeed = 0.01;
    characterGroupRef.current.rotation.y += deltaX * rotSpeed;
    rotationVelocityRef.current = deltaX * rotSpeed;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const resetFront = () => {
    setAutoRotate(false);
    rotationVelocityRef.current = 0;
    if (characterGroupRef.current) {
      characterGroupRef.current.rotation.y = 0;
    }
  };

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 w-screen h-screen z-0 overflow-hidden select-none pointer-events-auto bg-[#090714] ${className}`}>
        {/* 3D WebGL Canvas Container */}
        {webglSupported ? (
          <div
            ref={mountRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          />
        ) : (
          /* 2D High-Fidelity Fallback if WebGL is disabled */
          <div className="flex flex-col items-center justify-center p-6 text-center h-full">
            <div
              className="w-48 h-64 border-4 p-4 flex items-center justify-center mb-4 shadow-pixel"
              style={{
                borderColor: character.palette.borderPrimary,
                backgroundColor: character.palette.bgVoid,
              }}
            >
              <div className="font-pixel text-4xl text-arcade-gold animate-bounce">
                {character.name.charAt(0)}
              </div>
            </div>
            <span className="text-xs font-mono text-arcade-gold uppercase font-bold">
              {character.name} // 2D STAGE PREVIEW
            </span>
          </div>
        )}

        {/* Atmospheric Stage Vignette & Top Light Cone */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(245,194,66,0.06)_0%,transparent_65%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom,transparent_45%,rgba(11,9,20,0.65)_100%)]" />

        {/* Floating Camera Controls Pill in bottom-right corner above footer */}
        <div className="fixed bottom-10 right-4 sm:right-6 z-20 flex items-center gap-1.5 backdrop-blur-md bg-[#0E0B1C]/90 border-2 border-[#3E356B] p-1.5 shadow-[4px_4px_0px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 text-[10px] font-mono font-bold flex items-center gap-1 border transition-all ${
              autoRotate
                ? 'border-arcade-gold bg-arcade-gold/20 text-arcade-gold'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
            title="Toggle Auto 360° Spin"
          >
            <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{autoRotate ? 'AUTO-SPIN ON' : 'SPIN'}</span>
          </button>

          <button
            onClick={resetFront}
            className="pixel-btn px-2 py-1 text-[10px] font-mono text-gray-300 hover:text-arcade-gold"
            title="Reset Front View"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">FRONT</span>
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            className="pixel-btn p-1 text-gray-300 hover:text-arcade-cyan"
            title="Zoom In"
          >
            <ZoomIn size={12} />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
            className="pixel-btn p-1 text-gray-300 hover:text-arcade-cyan"
            title="Zoom Out"
          >
            <ZoomOut size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[320px] sm:h-[420px] md:h-[520px] flex items-center justify-center select-none overflow-hidden rounded-none border-2 border-arcade-border bg-[#0B0818] shadow-pixel ${className}`}>
      {/* 3D WebGL Canvas Container */}
      {webglSupported ? (
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />
      ) : (
        /* 2D High-Fidelity Fallback if WebGL is disabled */
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div
            className="w-48 h-64 border-4 p-4 flex items-center justify-center mb-4 shadow-pixel"
            style={{
              borderColor: character.palette.borderPrimary,
              backgroundColor: character.palette.bgVoid,
            }}
          >
            <div className="font-pixel text-4xl text-arcade-gold animate-bounce">
              {character.name.charAt(0)}
            </div>
          </div>
          <span className="text-xs font-mono text-arcade-gold uppercase font-bold">
            {character.name} // 2D STAGE PREVIEW
          </span>
        </div>
      )}

      {/* Atmospheric Stage Vignette & Top Light Cone */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(245,194,66,0.15)_0%,transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom,transparent_40%,rgba(11,9,20,0.8)_100%)]" />

      {/* Stage Interactive Floating Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-void-darkest/90 border border-arcade-border p-1 shadow-pixel z-20">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2 py-1 text-[10px] font-mono font-bold flex items-center gap-1 border transition-all ${
            autoRotate
              ? 'border-arcade-gold bg-arcade-gold/20 text-arcade-gold'
              : 'border-arcade-border text-gray-400 hover:text-white'
          }`}
          title="Toggle Auto 360° Spin"
        >
          <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{autoRotate ? 'AUTO-SPIN ON' : 'SPIN'}</span>
        </button>

        <button
          onClick={resetFront}
          className="pixel-btn px-2 py-1 text-[10px] font-mono text-gray-300 hover:text-arcade-gold"
          title="Reset Front View"
        >
          <RotateCcw size={12} />
          <span className="hidden sm:inline">FRONT</span>
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
          className="pixel-btn p-1 text-gray-300 hover:text-arcade-cyan"
          title="Zoom In"
        >
          <ZoomIn size={12} />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
          className="pixel-btn p-1 text-gray-300 hover:text-arcade-cyan"
          title="Zoom Out"
        >
          <ZoomOut size={12} />
        </button>
      </div>
    </div>
  );
};

/**
 * Procedural Voxel Character Generator
 * Builds an authentic, articulated Minecraft Bedrock style voxel avatar
 * styled precisely to each of the 20 character universes!
 */
function buildVoxelCharacter(parentGroup: THREE.Group, char: Character) {
  const p1 = char.palette.borderPrimary;
  const p2 = char.palette.accentGold;
  const p3 = char.palette.accentSecondary;
  const isAnimal = char.id === 'purring-window-cat' || char.id === 'loyal-fireplace-dog';

  // Handle Cat / Dog Quadruped Models
  if (isAnimal) {
    buildQuadrupedVoxel(parentGroup, char);
    return;
  }

  // --- 1. HEAD ---
  // Standard biped head: 1.4 x 1.4 x 1.4
  const headGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  const headTex = createHeadTexture(char);
  const headMat = new THREE.MeshStandardMaterial({
    map: headTex,
    roughness: 0.7,
    metalness: char.id === 'tony-stark' ? 0.6 : 0.1,
  });
  const headMesh = new THREE.Mesh(headGeo, headMat);
  headMesh.name = 'head';
  headMesh.position.set(0, 3.4, 0);
  headMesh.castShadow = true;
  parentGroup.add(headMesh);

  // Hair / Cowl / Hat 2nd Layer (Bedrock skin outer layer style)
  const hairGeo = new THREE.BoxGeometry(1.52, 1.52, 1.52);
  const hairTex = createHairTexture(char);
  const hairMat = new THREE.MeshStandardMaterial({
    map: hairTex,
    transparent: true,
    alphaTest: 0.1,
    roughness: 0.8,
  });
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  headMesh.add(hairMesh);

  // Character-specific head details:
  if (char.id === 'naruto-uzumaki') {
    // Hidden leaf headband metal plate
    const plateGeo = new THREE.BoxGeometry(0.7, 0.35, 0.06);
    const plateMat = new THREE.MeshStandardMaterial({ color: '#CAD2C5', metalness: 0.8, roughness: 0.3 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, 0.25, 0.73);
    headMesh.add(plate);
  } else if (char.id === 'gojo-satoru') {
    // Dark blindfold
    const blindfoldGeo = new THREE.BoxGeometry(1.46, 0.45, 1.46);
    const blindfoldMat = new THREE.MeshStandardMaterial({ color: '#100D22', roughness: 0.9 });
    const blindfold = new THREE.Mesh(blindfoldGeo, blindfoldMat);
    blindfold.position.set(0, 0.1, 0);
    headMesh.add(blindfold);
  } else if (char.id === 'bruce-wayne') {
    // Bat ears
    const earGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const earMat = new THREE.MeshStandardMaterial({ color: '#161B22', roughness: 0.5 });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.55, 0.85, 0);
    const rightEar = leftEar.clone();
    rightEar.position.x = 0.55;
    headMesh.add(leftEar);
    headMesh.add(rightEar);
  }

  // --- 2. TORSO ---
  // Standard biped torso: 1.5 x 2.0 x 0.85
  const torsoGeo = new THREE.BoxGeometry(1.5, 2.0, 0.85);
  const torsoTex = createTorsoTexture(char);
  const torsoMat = new THREE.MeshStandardMaterial({
    map: torsoTex,
    roughness: 0.6,
    metalness: char.id === 'tony-stark' ? 0.7 : 0.15,
  });
  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.position.set(0, 1.7, 0);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  parentGroup.add(torsoMesh);

  // Iron Man glowing Arc Reactor
  if (char.id === 'tony-stark') {
    const reactorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 12);
    const reactorMat = new THREE.MeshBasicMaterial({ color: '#00F5D4' });
    const reactor = new THREE.Mesh(reactorGeo, reactorMat);
    reactor.rotation.x = Math.PI / 2;
    reactor.position.set(0, 0.35, 0.44);
    torsoMesh.add(reactor);
  }

  // Cape for Batman, Elsa, or Levi
  if (char.id === 'bruce-wayne' || char.id === 'elsa' || char.id === 'levi-ackerman') {
    const capeGeo = new THREE.BoxGeometry(1.4, 2.6, 0.08);
    const capeColor =
      char.id === 'elsa' ? '#C2E9FB' : char.id === 'levi-ackerman' ? '#3B5349' : '#0B0D12';
    const capeMat = new THREE.MeshStandardMaterial({
      color: capeColor,
      roughness: 0.8,
      transparent: char.id === 'elsa',
      opacity: char.id === 'elsa' ? 0.8 : 1.0,
      side: THREE.DoubleSide,
    });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.name = 'cape';
    cape.position.set(0, 0.9, -0.48);
    cape.rotation.x = 0.15;
    cape.castShadow = true;
    torsoMesh.add(cape);
  }

  // --- 3. ARMS ---
  const armGeo = new THREE.BoxGeometry(0.65, 2.0, 0.7);
  const armTex = createLimbTexture(char, true);
  const armMat = new THREE.MeshStandardMaterial({
    map: armTex,
    roughness: 0.6,
  });

  // Left Arm
  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.name = 'leftArm';
  leftArm.position.set(-1.15, 1.7, 0);
  leftArm.castShadow = true;
  parentGroup.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.name = 'rightArm';
  rightArm.position.set(1.15, 1.7, 0);
  rightArm.castShadow = true;
  parentGroup.add(rightArm);

  // Special weapon/accessory in hand
  if (char.id === 'hermione-granger') {
    // Magic wand
    const wandGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.2, 8);
    const wandMat = new THREE.MeshStandardMaterial({ color: '#5A3D28' });
    const wand = new THREE.Mesh(wandGeo, wandMat);
    wand.position.set(0, -0.8, 0.4);
    wand.rotation.x = Math.PI / 4;
    rightArm.add(wand);
  } else if (char.id === 'gojo-satoru') {
    // Floating Hollow Purple orb
    const orbGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: '#7209B7' });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(0, -0.7, 0.5);
    rightArm.add(orb);
  } else if (char.id === 'levi-ackerman') {
    // Dual scout blades
    const bladeGeo = new THREE.BoxGeometry(0.06, 1.6, 0.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: '#E0E1DD', metalness: 0.85, roughness: 0.2 });
    const leftBlade = new THREE.Mesh(bladeGeo, bladeMat);
    leftBlade.position.set(0, -0.7, 0.4);
    leftBlade.rotation.x = Math.PI / 3;
    leftArm.add(leftBlade);

    const rightBlade = leftBlade.clone();
    rightArm.add(rightBlade);
  }

  // --- 4. LEGS ---
  const legGeo = new THREE.BoxGeometry(0.7, 1.9, 0.75);
  const legTex = createLimbTexture(char, false);
  const legMat = new THREE.MeshStandardMaterial({
    map: legTex,
    roughness: 0.7,
  });

  // Left Leg
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.38, 0.35, 0);
  leftLeg.castShadow = true;
  parentGroup.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.38, 0.35, 0);
  rightLeg.castShadow = true;
  parentGroup.add(rightLeg);
}

/**
 * Builds custom quadruped voxel model for Cat & Dog
 */
function buildQuadrupedVoxel(parentGroup: THREE.Group, char: Character) {
  const isCat = char.id === 'purring-window-cat';
  const mainColor = isCat ? '#E07A5F' : '#D4A373';
  const underColor = isCat ? '#F4F1DE' : '#FAEDCD';

  // Body: horizontal box
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.0, 2.0);
  const bodyMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.8 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 1.2, 0);
  body.castShadow = true;
  parentGroup.add(body);

  // Head
  const headGeo = new THREE.BoxGeometry(1.1, 1.0, 1.1);
  const headMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.8 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.name = 'head';
  head.position.set(0, 1.8, 1.2);
  head.castShadow = true;
  parentGroup.add(head);

  // Ears
  const earGeo = new THREE.BoxGeometry(0.3, 0.35, 0.15);
  const earMat = new THREE.MeshStandardMaterial({ color: isCat ? '#F2CC8F' : '#BC6C25' });
  const leftEar = new THREE.Mesh(earGeo, earMat);
  leftEar.position.set(-0.35, 0.55, 0.1);
  const rightEar = leftEar.clone();
  rightEar.position.x = 0.35;
  head.add(leftEar);
  head.add(rightEar);

  // Snout
  const snoutGeo = new THREE.BoxGeometry(0.5, 0.35, 0.4);
  const snoutMat = new THREE.MeshStandardMaterial({ color: underColor });
  const snout = new THREE.Mesh(snoutGeo, snoutMat);
  snout.position.set(0, -0.2, 0.6);
  head.add(snout);

  // 4 Legs
  const legGeo = new THREE.BoxGeometry(0.35, 1.1, 0.35);
  const legMat = new THREE.MeshStandardMaterial({ color: mainColor });
  const positions = [
    [-0.45, 0.35, 0.7],
    [0.45, 0.35, 0.7],
    [-0.45, 0.35, -0.7],
    [0.45, 0.35, -0.7],
  ];

  positions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    parentGroup.add(leg);
  });

  // Tail
  const tailGeo = new THREE.BoxGeometry(0.2, 0.9, 0.2);
  const tailMat = new THREE.MeshStandardMaterial({ color: mainColor });
  const tail = new THREE.Mesh(tailGeo, tailMat);
  tail.position.set(0, 1.2, -1.1);
  tail.rotation.x = -Math.PI / 4;
  parentGroup.add(tail);
}

// --- Procedural Canvas Pixel Texture Generators ---
function createHeadTexture(char: Character): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Skin base
  ctx.fillStyle = '#FFDFC4';
  if (char.id === 'peter-parker' || char.id === 'miles-morales') {
    ctx.fillStyle = char.palette.borderPrimary; // Masked
  } else if (char.id === 'bruce-wayne') {
    ctx.fillStyle = '#0D1117'; // Bat cowl
  } else if (char.id === 'tony-stark') {
    ctx.fillStyle = '#B85A32'; // Gold/Crimson faceplate
  }
  ctx.fillRect(0, 0, 64, 64);

  // Eyes
  if (char.id === 'peter-parker' || char.id === 'miles-morales') {
    // Big triangular white spider-eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(14, 24, 12, 10);
    ctx.fillRect(38, 24, 12, 10);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 24, 12, 10);
    ctx.strokeRect(38, 24, 12, 10);
  } else if (char.id === 'bruce-wayne') {
    // White glowing cowl slits
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(18, 26, 8, 4);
    ctx.fillRect(38, 26, 8, 4);
    // Lower chin exposed
    ctx.fillStyle = '#FFDFC4';
    ctx.fillRect(22, 42, 20, 12);
  } else {
    // Stylized pixel anime/hero eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(16, 26, 10, 8);
    ctx.fillRect(38, 26, 10, 8);
    ctx.fillStyle = char.palette.accentSecondary;
    ctx.fillRect(20, 28, 6, 6);
    ctx.fillRect(42, 28, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(22, 30, 3, 3);
    ctx.fillRect(44, 30, 3, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createHairTexture(char: Character): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 64, 64);

  // Hair color mapping
  let hairColor = '#3E2723'; // brown default
  if (char.id === 'naruto-uzumaki' || char.id === 'rapunzel') hairColor = '#F5C242'; // bright blond
  if (char.id === 'elsa' || char.id === 'gojo-satoru') hairColor = '#F8F9FA'; // silver/white
  if (char.id === 'wednesday-addams' || char.id === 'neo' || char.id === 'l-lawliet') hairColor = '#100D1A'; // midnight black
  if (char.id === 'hermione-granger') hairColor = '#6A4423';
  if (char.id === 'gwen-stacy') hairColor = '#F9E076';

  ctx.fillStyle = hairColor;
  // Top & sides of hair
  ctx.fillRect(0, 0, 64, 22);
  ctx.fillRect(0, 20, 14, 28);
  ctx.fillRect(50, 20, 14, 28);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createTorsoTexture(char: Character): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Torso base outfit
  ctx.fillStyle = char.palette.borderPrimary;
  ctx.fillRect(0, 0, 64, 64);

  // Character-specific emblems & details:
  if (char.id === 'peter-parker' || char.id === 'miles-morales') {
    // Web patterns & Spider emblem
    ctx.strokeStyle = char.id === 'miles-morales' ? '#FF2A85' : '#0B0914';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, 10); ctx.lineTo(32, 54);
    ctx.moveTo(12, 32); ctx.lineTo(52, 32);
    ctx.moveTo(18, 18); ctx.lineTo(46, 46);
    ctx.moveTo(18, 46); ctx.lineTo(46, 18);
    ctx.stroke();

    // Central spider logo
    ctx.fillStyle = char.id === 'miles-morales' ? '#FF2A85' : '#000000';
    ctx.fillRect(28, 26, 8, 12);
  } else if (char.id === 'bruce-wayne') {
    // Bat chest insignia
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(20, 22, 24, 14);
    ctx.fillStyle = char.palette.accentSecondary;
    ctx.fillRect(28, 26, 8, 6);
    // Gold utility belt
    ctx.fillStyle = '#F5C242';
    ctx.fillRect(0, 50, 64, 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(28, 50, 8, 8);
  } else if (char.id === 'tony-stark') {
    // High-tech armor plate seams
    ctx.fillStyle = '#F5C242';
    ctx.fillRect(16, 12, 32, 36);
    ctx.fillStyle = '#B85A32';
    ctx.fillRect(22, 18, 20, 24);
  } else if (char.id === 'wednesday-addams') {
    // White pointed collar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(22, 0); ctx.lineTo(32, 16); ctx.lineTo(42, 0);
    ctx.fill();
    // Buttons down front
    ctx.fillRect(30, 24, 4, 4);
    ctx.fillRect(30, 36, 4, 4);
    ctx.fillRect(30, 48, 4, 4);
  } else if (char.id === 'hermione-granger') {
    // Gryffindor red & gold striped tie
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(26, 0, 12, 12); // white shirt collar
    ctx.fillStyle = '#7A283B';
    ctx.fillRect(29, 10, 6, 32);
    ctx.fillStyle = '#F5C242';
    ctx.fillRect(29, 16, 6, 4);
    ctx.fillRect(29, 28, 6, 4);
  } else if (char.id === 'neo') {
    // Matrix phosphor code streams on dark coat
    ctx.fillStyle = '#050A06';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#00FF66';
    ctx.fillRect(20, 14, 2, 8);
    ctx.fillRect(42, 24, 2, 10);
    ctx.fillRect(32, 36, 2, 8);
  } else {
    // Elegant accent stripe & waistline
    ctx.fillStyle = char.palette.accentSecondary;
    ctx.fillRect(24, 18, 16, 16);
    ctx.fillStyle = char.palette.accentGold;
    ctx.fillRect(0, 48, 64, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createLimbTexture(char: Character, isArm: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = char.palette.borderPrimary;
  ctx.fillRect(0, 0, 32, 64);

  // Gloves or boots
  ctx.fillStyle = char.palette.accentSecondary;
  ctx.fillRect(0, 40, 32, 24);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}
