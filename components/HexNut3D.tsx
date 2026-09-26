"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function HexNut3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Metal at high metalness/low roughness needs something to reflect —
    // direct lights alone only produce small highlights, not overall
    // brightness. A procedural room environment gives it that.
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x888888, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 6, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(-4, 2, 6);
    scene.add(fill);
    const backFill = new THREE.DirectionalLight(0xffffff, 0.6);
    backFill.position.set(0, -4, -3);
    scene.add(backFill);
    const rim = new THREE.PointLight(0x38bdf8, 1.2, 20);
    rim.position.set(-5, -2, 4);
    scene.add(rim);
    const highlight = new THREE.PointLight(0xffffff, 1.0, 15);
    highlight.position.set(2, 4, 5);
    scene.add(highlight);

    // tiltGroup holds the viewing angle (fixed + mouse parallax). The model
    // is a child of it and only spins around its OWN local Z axis (the bore
    // axis) — like a nut turning while being threaded onto a bolt, not
    // swiveling side to side around the world vertical axis.
    const tiltGroup = new THREE.Group();
    scene.add(tiltGroup);

    let model: THREE.Object3D | null = null;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.load("/models/hex-nut.glb", (gltf) => {
      if (disposed) return;
      model = gltf.scene;
      // The model plugs the bore with a thin dark disc (the only dark material). Hide it so the
      // hole is see-through: the page background shows through the thread.
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        const material = mesh.isMesh ? (mesh.material as THREE.MeshStandardMaterial) : null;
        if (material?.color && material.color.r + material.color.g + material.color.b < 0.6) {
          mesh.visible = false;
        }
      });
      tiltGroup.add(model);
    });

    // Base pose: tilted like the reference photo — looking down into the
    // bore from a slight elevated angle, not dead flat-on. Mouse movement
    // adds a small offset on top of that base tilt.
    const baseTiltX = -0.28;
    let targetTiltX = baseTiltX;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetTiltX = baseTiltX + ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;
    };
    container.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (model) {
        model.rotation.z += 0.02; // spin around the bore's own axis
      }
      tiltGroup.rotation.x += (targetTiltX - tiltGroup.rotation.x) * 0.05;
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
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ cursor: "grab" }} />;
}
