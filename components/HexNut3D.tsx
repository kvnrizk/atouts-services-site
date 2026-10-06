"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/** Near-chrome polished steel: very low roughness so the faces mirror the studio sharply */
function steelMaterial(source: THREE.MeshStandardMaterial) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xeceef1,
    metalness: 1,
    roughness: 0.07,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.5,
    // Keep any surface detail baked into the model
    normalMap: source.normalMap,
    roughnessMap: source.roughnessMap,
    metalnessMap: source.metalnessMap,
  });
}

/**
 * Product-photography studio for the reflections, as for steel shot on a white table:
 * a light-grey room, softboxes, and two black "flags". Flat metal faces mirror their
 * surroundings, so the flags are what draw the dark bands that make steel read as steel;
 * a uniformly bright room just turns the faces white.
 */
function studioScene() {
  const scene = new THREE.Scene();
  // Room shaded bright at the top to dark at the floor, so the faces pick up a light-to-dark sweep
  const roomGeometry = new THREE.SphereGeometry(10, 32, 16);
  const top = new THREE.Color(0xf2f3f5);
  const bottom = new THREE.Color(0x101113);
  const positions = roomGeometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    const c = bottom.clone().lerp(top, (positions.getY(i) / 10 + 1) / 2);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  roomGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  scene.add(new THREE.Mesh(roomGeometry, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));

  // Big softbox behind the camera striped with diagonal light and dark bands (a chrome-shot trick):
  // the face turned towards the viewer mirrors a few bands at once, and they sweep across it as it turns
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  const bands = 5;
  for (let b = 0; b < bands; b++) {
    const start = b / bands;
    gradient.addColorStop(start, "#ffffff");
    gradient.addColorStop(start + 0.35 / bands, "#c9ccd0");
    gradient.addColorStop(start + 0.55 / bands, "#16181a");
    gradient.addColorStop(start + 0.9 / bands, "#5d6166");
  }
  gradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  const sweepTexture = new THREE.CanvasTexture(canvas);
  sweepTexture.colorSpace = THREE.SRGBColorSpace;
  const sweep = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshBasicMaterial({ map: sweepTexture, color: new THREE.Color(1.8, 1.8, 1.8) }),
  );
  sweep.position.set(0, 1, 8);
  sweep.lookAt(0, 0, 0);
  scene.add(sweep);

  const panel = (w: number, h: number, intensity: number, color: number, pos: [number, number, number]) => {
    const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    material.color.multiplyScalar(intensity); // > 1: brighter than white, like a real light source
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    mesh.position.set(...pos);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  };
  panel(8, 3, 7, 0xffffff, [0, 7, 3]); // softbox: large key above
  panel(1.5, 8, 4, 0xffffff, [-7, 0, 2]); // softbox: vertical strip, left
  panel(1.5, 8, 2, 0x38bdf8, [7, -1, -2]); // softbox: brand-blue strip, right-back
  panel(4, 9, 1, 0x0a0a0a, [5, 0, 5]); // flag: dark band, front right
  panel(2, 9, 1, 0x0a0a0a, [-5, 0, -5]); // flag: dark band, back left, so every face gets contrast
  panel(9, 3, 1, 0x0a0a0a, [0, -7, 2]); // flag: dark floor reflection
  return scene;
}

export function HexNut3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Filmic tone mapping rolls off the highlights the way a camera does: the main
    // difference between "plastic CG" and photographed metal
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Metal is mostly what it reflects: see studioScene()
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const studio = studioScene();
    const envTexture = pmremGenerator.fromScene(studio, 0.02).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();
    studio.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        (mesh.material as THREE.MeshBasicMaterial).map?.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    });

    // Studio lighting: a warm-white key from above, a soft fill, and a sky-blue rim
    // (the brand colour) that outlines the nut against the black section
    const key = new THREE.DirectionalLight(0xfff7ed, 1.6);
    key.position.set(3, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.25);
    fill.position.set(-5, 1, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x38bdf8, 2.4);
    rim.position.set(-3, -2, -4);
    scene.add(rim);

    // tiltGroup holds the viewing angle (fixed + mouse parallax). The model only spins around
    // its OWN bore axis, like a nut being threaded onto a bolt.
    const tiltGroup = new THREE.Group();
    scene.add(tiltGroup);

    let model: THREE.Object3D | null = null;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.load("/models/hex-nut.glb", (gltf) => {
      if (disposed) return;
      model = gltf.scene;
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const material = mesh.material as THREE.MeshStandardMaterial;
        // The model plugs the bore with a thin dark disc (the only dark material). Hide it so the
        // hole is see-through: the page background shows through the thread.
        if (material?.color && material.color.r + material.color.g + material.color.b < 0.6) {
          mesh.visible = false;
          return;
        }
        mesh.material = steelMaterial(material);
        material.dispose();
      });
      tiltGroup.add(model);
    });

    // Base pose: looking slightly down into the bore. The mouse adds a small offset on both axes.
    const baseTiltX = -0.28;
    let targetTiltX = baseTiltX;
    let targetTiltY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetTiltX = baseTiltX + ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;
      targetTiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.35;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Only render while the section is on screen
    let onScreen = true;
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(container);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!onScreen) return;
      if (model && !reducedMotion) {
        model.rotation.z += 0.006; // slow, showroom-turntable pace
      }
      tiltGroup.rotation.x += (targetTiltX - tiltGroup.rotation.x) * 0.05;
      tiltGroup.rotation.y += (targetTiltY - tiltGroup.rotation.y) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      visibility.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      model?.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        }
      });
      envTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
