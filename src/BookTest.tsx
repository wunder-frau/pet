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
    const camera = new THREE.PerspectiveCamera(60, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);

    //const camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    console.log('Camera initial position:', camera.position);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialiasing for smoother edges
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mountNode.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-3, 5, 5);
    scene.add(directionalLight);
    // Load local texture (from the public directory)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/images/5.jpg', (tex) => {
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
          maxHeight: '800px', // You can limit the height if needed
        }}
      ></div>
    </div>
  );
};

export default Book;
