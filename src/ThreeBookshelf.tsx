import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Toread } from './types';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'; // Import FontLoader
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'; // Import TextGeometry

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
      const geometry = new THREE.BoxGeometry(1, 2, 0.5);
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

      // Create 3D text for the book title
      const fontLoader = new FontLoader();
      fontLoader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', // Font URL
        (font) => {
          const textGeometry = new TextGeometry(book.text, {
            font: font,
            size: 0.2,
            depth: 0.02, // This controls the thickness of the text
          });

          const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          // Compute the bounding box of the text geometry
          textGeometry.computeBoundingBox();

          // Ensure the bounding box is defined before accessing
          if (textGeometry.boundingBox) {
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            const offsetX = -textWidth / 2; // Offset to center the text horizontally

            // Position the text on the cover of the book (front face)
            textMesh.position.set(
              cube.position.x + offsetX,               // Center text horizontally on the cube
              cube.position.y,                          // Align with the cube's y position (center vertically)
              cube.position.z + 0.5                    // Adjust Z position so text is in front of the book
            );
          }

          scene.add(textMesh);
        }
      );
      scene.add(cube);
      booksArray.push(cube);
    });

    const maxWidth = 800;
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

    const animate = () => {
      requestAnimationFrame(animate);

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
