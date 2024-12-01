import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Toread } from './types';

interface ThreeBookshelfProps {
  books: Toread[];
}

const ThreeBookshelf: React.FC<ThreeBookshelfProps> = ({ books }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;


    // Lights
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const texture_side = textureLoader.load('/images/6.jpg', () => {
      setTextureLoaded(true);
    });
    const texture = textureLoader.load('/images/4.jpeg', () => {
      setTextureLoaded(true);
    });

    const booksArray: THREE.Mesh[] = [];

    books.forEach((book, index) => {
      const geometry = new THREE.BoxGeometry(3, 4, 0.3); // Same size as original book
      const materials = [
        new THREE.MeshStandardMaterial({ map: texture_side, roughness: 0.5, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ map: texture_side, roughness: 0.5, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ map: texture_side, roughness: 0.5, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 0.5 }),
      ];

      const bookMesh = new THREE.Mesh(geometry, materials);

      // Position books vertically (in a column)
      bookMesh.position.x = 0;
      bookMesh.position.y = index * 5 - (books.length * 5) / 2; // Stack books with a gap
      bookMesh.position.z = 0;

      scene.add(bookMesh);
      booksArray.push(bookMesh);
    });

    const onScroll = () => {
      if (textureLoaded) {
        const scrollY = window.scrollY;
        const rotationSpeed = 0.01;
        booksArray.forEach((book) => {
          book.rotation.y = scrollY * rotationSpeed;
        });
      }
    };

    window.addEventListener('scroll', onScroll);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', onScroll);
      controls.dispose();
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [books, textureLoaded]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
  );
};

export default ThreeBookshelf;
