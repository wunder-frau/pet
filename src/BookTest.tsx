import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Book: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false); // Track rotation state
  const bookRef = useRef<THREE.Mesh | null>(null); // Reference to the book mesh
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster()); // Raycaster reference
  const mouse = useRef(new THREE.Vector2()); // Mouse position reference

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Ensure the background is transparent

    // Camera
    const camera = new THREE.PerspectiveCamera(60, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mountNode.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    // Load local texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/images/4.jpeg', (tex) => {
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });

    // Geometry & Materials for Book
    const geometry = new THREE.BoxGeometry(3, 4, 0.3);
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff6347, roughness: 0.8, metalness: 0.1 }), // Back cover
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
        // new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.1 }), // Spine
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.2 }), // Edges
        new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5, metalness: 0.2 }), // Top
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),    // Front cover
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
        //new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.1 }), // Bottom
      ];
    const book = new THREE.Mesh(geometry, materials);
    bookRef.current = book;
    scene.add(book);

    // Mouse click event handler
    const onMouseClick = (event: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with mouse position and camera
      raycaster.current.setFromCamera(mouse.current, camera);

      // Check for intersections with the book
      const intersects = raycaster.current.intersectObject(book);

      if (intersects.length > 0) {
        setIsRotating(true); // Start rotation when the book is clicked
      }
    };

    // Add mouse click event listener
    window.addEventListener('click', onMouseClick);

    // Animation loop
    let rotationAmount = 0; // Track the rotation progress
    const animate = () => {
      requestAnimationFrame(animate);

      if (isRotating) {
        if (rotationAmount < Math.PI * 2) {
          // Rotate the book 360 degrees
          if (bookRef.current) {
            bookRef.current.rotation.y += 0.02; // Slow rotation speed
          }
          rotationAmount += 0.05;
        } else {
          setIsRotating(false); // Stop rotation after 360 degrees
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resizing
    const onResize = () => {
      const { clientWidth, clientHeight } = mountNode;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);
    onResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onMouseClick);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        ref={mountRef}
        style={{
          flex: '1',
          maxHeight: '800px',
        }}
      ></div>
    </div>
  );
};

export default Book;
