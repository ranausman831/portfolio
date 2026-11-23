import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HERO_PROFILE } from '../data/portfolioData';
import { samplePortraitVoxels, type VoxelSample } from '../utils/voxelPortraitMath';
import type { ThemeMode } from '../utils/theme';
import { PixelCompanionSprite } from './PixelCompanionSprite';

export type PortraitMode = 'voxel3d' | 'pixel2d' | 'studio';

interface VoxelPortraitStageProps {
  theme?: ThemeMode;
}

const GRID_SIZE = 54;
const PARTICLE_COUNT = 96;

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function VoxelPortraitStage({ theme = 'dark' }: VoxelPortraitStageProps) {
  const [mode, setMode] = useState<PortraitMode>('voxel3d');
  const [webglReady, setWebglReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [voxels, setVoxels] = useState<VoxelSample[]>([]);
  const [imageReady, setImageReady] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const threeMountRef = useRef<HTMLDivElement | null>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const plateMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const forceRenderRef = useRef<(() => void) | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const modeRef = useRef<PortraitMode>(mode);
  modeRef.current = mode;
  const themeRef = useRef<ThemeMode>(theme);
  themeRef.current = theme;

  // Step 1: Load the user's real photograph once and sample its exact RGB pixels into a voxel grid
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = HERO_PROFILE.portraitPath;

    img.onload = () => {
      if (cancelled) return;
      const offscreen = document.createElement('canvas');
      const sampleRes = 108;
      offscreen.width = sampleRes;
      offscreen.height = sampleRes;
      const ctx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setImageReady(true);
        return;
      }

      // Cover-crop square centered slightly higher to keep full head + shoulders crisp
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - minDim) * 0.5;
      const sy = Math.max(0, (img.naturalHeight - minDim) * 0.25);
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, sampleRes, sampleRes);

      const imageData = ctx.getImageData(0, 0, sampleRes, sampleRes);
      const sampled = samplePortraitVoxels(
        imageData.data,
        sampleRes,
        sampleRes,
        GRID_SIZE,
        3.25,
        0.52
      );
      setVoxels(sampled);
      setImageReady(true);
    };

    img.onerror = () => {
      if (!cancelled) {
        setWebglFailed(true);
        setImageReady(true);
      }
    };

    return () => {
      cancelled = true;
    };
  }, []);

  // Step 2: Mount the 3D Voxel Three.js scene once when voxels are ready
  useEffect(() => {
    const mountEl = threeMountRef.current;
    if (!mountEl || voxels.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;

    const width = mountEl.clientWidth || 440;
    const height = mountEl.clientHeight || 480;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();

    // Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0.04, 6.35);
    camera.lookAt(0, 0, 0);

    // Calibrated three-point studio lighting rig (preserves rich natural skin tones)
    const hemiLight = new THREE.HemisphereLight(0xeef2ff, 0x16141a, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.05);
    keyLight.position.set(2.8, 3.6, 5.4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff5a1f, 0.85);
    rimLight.position.set(-3.6, -1.0, 2.4);
    scene.add(rimLight);

    // Main 3D Voxel Portrait Group
    const portraitGroup = new THREE.Group();
    scene.add(portraitGroup);

    const cellSize = 3.25 / GRID_SIZE;
    const boxGeo = new THREE.BoxGeometry(cellSize * 0.99, cellSize * 0.99, cellSize * 1.85);
    const voxelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.68,
      metalness: 0.05,
    });

    const instancedMesh = new THREE.InstancedMesh(boxGeo, voxelMaterial, voxels.length);
    instancedMesh.frustumCulled = false;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < voxels.length; i++) {
      const v = voxels[i];
      dummy.position.set(v.x, v.y, v.zDepth);
      dummy.scale.set(1, 1, 0.8 + v.luminance * 1.15);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      // Preserve exact sRGB facial tones while subtly highlighting architectural corner ticks
      if (v.isEdgeAccent) {
        color.setHex(0xff5a1f);
      } else {
        color.setRGB(v.r, v.g, v.b, THREE.SRGBColorSpace);
      }
      instancedMesh.setColorAt(i, color);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }
    instancedMesh.computeBoundingSphere();
    portraitGroup.add(instancedMesh);

    // Subtle backing plate matching active theme so no gaps bleed harsh background light
    const plateGeo = new THREE.PlaneGeometry(3.26, 3.26);
    const plateMat = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'light' ? 0xeff3f8 : 0x0b0b0f,
      roughness: 0.85,
      metalness: 0.1,
    });
    plateMatRef.current = plateMat;
    const backPlate = new THREE.Mesh(plateGeo, plateMat);
    backPlate.position.z = -0.08;
    portraitGroup.add(backPlate);

    // Ambient Pixel Particle Aura around the portrait
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particlePhases = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = 1.85 + (i % 7) * 0.14;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius * 0.95;
      particlePositions[i * 3 + 2] = ((i % 5) - 2) * 0.25;
      particlePhases[i] = i * 0.43;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff6a33,
      size: 0.055,
      transparent: true,
      opacity: 0.72,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    setWebglReady(true);

    // Animation state (zero allocations inside tick)
    let frameId = 0;
    let disposed = false;
    const startTimeMs = performance.now();
    let currentRotX = 0;
    let currentRotY = 0;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const renderFrame = () => {
      if (disposed) return;

      // Only run 3D updates when voxel3d tab is visible
      if (modeRef.current !== 'voxel3d') {
        if (isSoftwareGl) afterDraw(renderFrame);
        else frameId = requestAnimationFrame(renderFrame);
        return;
      }

      const elapsed = (performance.now() - startTimeMs) * 0.001;
      const targetRotY = pointerRef.current.active
        ? pointerRef.current.x * 0.22
        : Math.sin(elapsed * 0.6) * 0.08;
      const targetRotX = pointerRef.current.active
        ? -pointerRef.current.y * 0.14
        : Math.cos(elapsed * 0.45) * 0.04;

      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      portraitGroup.rotation.y = currentRotY;
      portraitGroup.rotation.x = currentRotX;

      // Subtle living depth pulse on edge/foreground voxels without blurring identity
      if (!prefersReducedMotion) {
        const pointerWorldX = pointerRef.current.x * 1.6;
        const pointerWorldY = pointerRef.current.y * 1.6;

        for (let i = 0; i < voxels.length; i++) {
          const v = voxels[i];
          let wave = 0;
          if (pointerRef.current.active) {
            const dx = v.x - pointerWorldX;
            const dy = v.y - pointerWorldY;
            const distSq = dx * dx + dy * dy;
            if (distSq < 0.72) {
              wave = (1 - distSq / 0.72) * 0.16;
            }
          } else {
            wave = Math.sin(elapsed * 1.4 + v.gx * 0.12 + v.gy * 0.12) * 0.018;
          }

          dummy.position.set(v.x, v.y, v.zDepth + wave);
          dummy.scale.set(1, 1, 0.75 + v.luminance * 1.35);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;

        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const phase = particlePhases[i];
          const baseAngle = (i / PARTICLE_COUNT) * Math.PI * 2 + elapsed * 0.08;
          const radius = 1.88 + (i % 7) * 0.13 + Math.sin(elapsed + phase) * 0.04;
          posAttr.setXYZ(
            i,
            Math.cos(baseAngle) * radius,
            Math.sin(baseAngle) * radius * 0.95,
            Math.sin(elapsed * 0.7 + phase) * 0.28
          );
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) {
        return; // Single crisp frame on reduced motion
      }
      if (isSoftwareGl) {
        afterDraw(renderFrame);
      } else {
        frameId = requestAnimationFrame(renderFrame);
      }
    };

    forceRenderRef.current = () => {
      if (!disposed) {
        renderer.render(scene, camera);
      }
    };
    renderFrame();

    const handleResize = () => {
      if (!mountEl || disposed) return;
      const w = mountEl.clientWidth || 440;
      const h = mountEl.clientHeight || 480;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => handleResize())
        : null;
    resizeObserver?.observe(mountEl);
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      forceRenderRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      plateMatRef.current = null;
      boxGeo.dispose();
      voxelMaterial.dispose();
      plateGeo.dispose();
      plateMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
    };
  }, [voxels]);

  useEffect(() => {
    if (plateMatRef.current) {
      plateMatRef.current.color.setHex(theme === 'light' ? 0xeff3f8 : 0x0b0b0f);
      forceRenderRef.current?.();
    }
  }, [theme]);

  // Step 3: Render crisp 2D Pixel-Art Matrix Canvas when in pixel2d mode
  useEffect(() => {
    if (mode !== 'pixel2d' || voxels.length === 0) return;
    const canvas = pixelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 432;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = theme === 'light' ? '#EFF3F8' : '#0B0B0F';
    ctx.fillRect(0, 0, size, size);

    const cellPx = size / GRID_SIZE;
    for (let i = 0; i < voxels.length; i++) {
      const v = voxels[i];
      const px = v.gx * cellPx;
      const py = v.gy * cellPx;
      const r = Math.round(v.r * 255);
      const g = Math.round(v.g * 255);
      const b = Math.round(v.b * 255);

      ctx.fillStyle = v.isEdgeAccent ? '#FF5A1F' : `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(px + 0.5, py + 0.5, cellPx - 1, cellPx - 1);
    }
  }, [mode, voxels, theme]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current = { x: nx, y: ny, active: true };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0, y: 0, active: false };
  };

  return (
    <div
      data-testid="voxel-portrait-stage"
      data-mode={mode}
      className="relative flex flex-col items-center"
    >
      {/* Portrait Architectural Frame */}
      <div
        ref={stageRef}
        data-cursor="portrait"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative aspect-square w-full max-w-[430px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[var(--shadow-elevated)] transition-colors duration-200 lg:rounded-sm dark:border-white/15 dark:bg-[#0D0D12]"
      >
        {/* Subtle Pixel Grid Frame Backdrop */}
        <div className="pixel-grid-dense pointer-events-none absolute inset-0 opacity-45" />

        {/* Architectural Pixel Corner Ticks */}
        <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 z-20 h-3 w-3 border-t-2 border-l-2 border-[#F97316] sm:top-3 sm:left-3 dark:border-[#FF5A1F]" />
        <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 z-20 h-3 w-3 border-t-2 border-r-2 border-[#F97316] sm:top-3 sm:right-3 dark:border-[#FF5A1F]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 h-3 w-3 border-b-2 border-l-2 border-[#F97316] sm:bottom-3 sm:left-3 dark:border-[#FF5A1F]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 h-3 w-3 border-b-2 border-r-2 border-[#F97316] sm:bottom-3 sm:right-3 dark:border-[#FF5A1F]" />

        {/* Base Real Photo Layer (always mounted as instant fallback / studio mode) */}
        <img
          src={HERO_PROFILE.portraitPath}
          alt="Muhammad Usman — Agentic AI Engineer"
          referrerPolicy="no-referrer"
          decoding="async"
          fetchPriority="high"
          className={`h-full w-full object-cover object-top transition-opacity duration-300 ${
            mode === 'studio' || webglFailed || !webglReady
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Subtle pixel scanline overlay on studio mode */}
        {mode === 'studio' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-transparent dark:from-[#070709]/80"
          />
        )}

        {/* 3D Three.js Voxel Canvas Mount */}
        <div
          ref={threeMountRef}
          aria-hidden={mode !== 'voxel3d'}
          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
            mode === 'voxel3d' && webglReady && !webglFailed
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* 2D Pixel Matrix Canvas */}
        <canvas
          ref={pixelCanvasRef}
          aria-label="Muhammad Usman Pixel Matrix Portrait"
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-300 ${
            mode === 'pixel2d' && imageReady
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Bottom Caption Bar inside Frame */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 border-t border-[#E2E8F0] bg-white/92 px-3 py-2 backdrop-blur-xs sm:px-4 sm:py-2.5 dark:border-white/10 dark:bg-[#070709]/85">
          <span className="truncate font-mono text-[11px] font-medium text-[#172033] sm:text-xs dark:text-zinc-300">
            {mode === 'voxel3d'
              ? '3D Voxel Relief'
              : mode === 'pixel2d'
              ? 'Pixel Matrix'
              : 'Studio Portrait'}
          </span>
          <span className="shrink-0 font-mono text-[10px] font-medium text-[#C2410C] sm:text-[11px] dark:text-[#FF8C42]">
            {GRID_SIZE}×{GRID_SIZE} Grid
          </span>
        </div>
      </div>

      {/* Dribbble-Inspired Interactive Pixel Companion perched cleanly inside frame on narrow screens */}
      <div className="absolute right-2 top-2 z-30 scale-90 origin-top-right sm:-right-5 sm:top-10 sm:scale-100">
        <PixelCompanionSprite />
      </div>

      {/* Interactive Mode Switcher (Clean Segmented Control) */}
      <div
        role="group"
        aria-label="Portrait rendering mode"
        className="mt-3.5 inline-flex max-w-full items-center gap-1 rounded-md border border-[#E2E8F0] bg-white p-1 shadow-[var(--shadow-card)] sm:mt-4 sm:rounded-sm dark:border-white/10 dark:bg-[#111116]"
      >
        {(
          [
            { id: 'voxel3d', label: '3D Voxel' },
            { id: 'pixel2d', label: 'Pixel Art' },
            { id: 'studio', label: 'Original' },
          ] as const
        ).map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              aria-pressed={active}
              className={`min-h-[38px] rounded-sm px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors sm:min-h-[36px] sm:px-3.5 sm:text-xs cursor-pointer ${
                active
                  ? 'bg-[#F97316] text-[#172033] font-semibold dark:bg-[#FF5A1F] dark:text-[#070709]'
                  : 'text-[#64748B] hover:text-[#172033] dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
