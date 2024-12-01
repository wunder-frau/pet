import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Book: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [textureLoaded, setTextureLoaded] = useState(false); // Track texture loading state
  const bookRef = useRef<THREE.Mesh | null>(null); // Reference to the book mesh

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

    // Load texture and set loading state
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      '/images/4.jpeg',
      () => {
        // Texture loaded successfully, update state
        setTextureLoaded(true);
      },
      undefined, // Optional progress function
      (error) => {
        console.error("Texture loading failed", error);
      }
    );

    // Geometry & Materials for Book (only use texture when it's fully loaded)
    const geometry = new THREE.BoxGeometry(3, 4, 0.3);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xff6347, roughness: 0.8, metalness: 0.1 }), // Back cover
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.2 }), // Edges
      new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5, metalness: 0.2 }), // Top
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),    // Front cover
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
    ];
    const book = new THREE.Mesh(geometry, materials);
    bookRef.current = book;
    scene.add(book);

    // Scroll event handler
    const onScroll = () => {
      if (textureLoaded) {
        const scrollY = window.scrollY; // Get the scroll position
        const rotationSpeed = 0.01; // Adjust this to control the rotation speed
        if (bookRef.current) {
          // Rotate the book based on scroll position
          bookRef.current.rotation.y = scrollY * rotationSpeed; 
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', onScroll);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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
      window.removeEventListener('scroll', onScroll);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [textureLoaded]);

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
