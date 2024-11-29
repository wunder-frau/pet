import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Toread } from './types';

interface ThreeBookshelfProps {
  books: Toread[];
}

const ThreeBookshelf: React.FC<ThreeBookshelfProps> = ({ books }) => {
  const mountRef = useRef<HTMLDivElement>(null);

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
    controls.enableDamping = true; // Smooth movement
    controls.dampingFactor = 0.05;

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const booksArray: THREE.Mesh[] = [];
    books.forEach((book, index) => {
      const geometry = new THREE.BoxGeometry(1, 1.5, 0.3);
      const material = new THREE.MeshStandardMaterial({
        color: book.completed ? 0x00ff00 : 0xff0000,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (index % 5) * 2 - 4;
      cube.position.y = Math.floor(index / 5) * 2 - 2;
      cube.userData = {
        className: 'book',
        completed: book.completed,
      };

      scene.add(cube);
      booksArray.push(cube);
    });

    const maxWidth = 600;
    const maxHeight = 600;

    const onWindowResize = () => {
      const width = Math.min(window.innerWidth, maxWidth);
      const height = Math.min(window.innerHeight, maxHeight);

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize);
    const gravity = -0.1;
    let velocities = booksArray.map(() => 0); // Array to store velocities for each book
    const groundLevel = -5; // Y position for the ground

    const animate = () => {
      requestAnimationFrame(animate);

      booksArray.forEach((cube, index) => {
        if (cube.position.y > groundLevel) {
          velocities[index] += gravity; // Update velocity for each book
          cube.position.y += velocities[index]; // Apply velocity to position
        } else {
          velocities[index] = 0; // Stop falling once the book hits the ground
          cube.position.y = groundLevel; // Ensure cube doesn't fall through the ground
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [books]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default ThreeBookshelf;
