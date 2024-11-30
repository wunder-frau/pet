import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Book: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Ensure the background is transparent
    console.log('Scene:', scene);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    console.log('Camera initial position:', camera.position);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountNode.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    // Load local texture (from the public directory)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/images/2Taschen_TH.jpg');  // Path relative to the public folder

    // Geometry & Materials for Book
    const geometry = new THREE.BoxGeometry(3, 4, 0.2);
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff6347 }), // Back cover
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // Spine
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // Edges
        new THREE.MeshStandardMaterial({ color: 0x555555 }), // Top
        new THREE.MeshStandardMaterial({ map: texture }), // Front cover (with texture)
      new THREE.MeshStandardMaterial({ color: 0xffffff }), // Bottom
    ];
    const book = new THREE.Mesh(geometry, materials);
    scene.add(book);
    console.log('Book mesh:', book);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      book.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const onResize = () => {
      const { clientWidth, clientHeight } = mountNode;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      console.log('Window resized. New dimensions:', { width: clientWidth, height: clientHeight });
    };

    window.addEventListener('resize', onResize);
    onResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      console.log('Component unmounted and resources cleaned up.');
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        ref={mountRef}
        style={{
          flex: '1',  // Makes the Three.js container take the remaining height
          maxHeight: '600px', // You can limit the height if needed
        }}
      ></div>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        {/* Add content here for the rest of the app */}
        <h2>Rest of the App</h2>
        <p>This is where the rest of your app will go, below the 3D Book.</p>
      </div>
    </div>
  );
};

export default Book;
