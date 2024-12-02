import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Toread } from './types';

interface ThreeBookshelfProps {
  books: Toread[];
}

const ThreeBookshelf: React.FC<ThreeBookshelfProps> = ({ books }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(2); // Initial count of visible books

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30); // Set a better initial camera position to view all books

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mountNode.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();

    // Declare variables to be used across the effect
    let booksArray: THREE.Mesh[] = [];
    let animationFrameId: number;

    const loadTexture = (url: string) => {
      return new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          url,
          (texture) => resolve(texture),
          undefined,
          (err) => reject(err)
        );
      });
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const rotationSpeed = 0.01;
      booksArray.forEach((book) => {
        book.rotation.y = scrollY * rotationSpeed;
      });
    };

    const onWindowResize = () => {
      const width = mountNode.clientWidth;
      const height = mountNode.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // Load textures and set up the scene
    Promise.all([
      loadTexture('/images/6.jpg'),
      loadTexture('/images/4.jpeg'),
    ])
      .then(([texture_side, texture]) => {
        const visibleBooks = books.slice(0, visibleCount);

        visibleBooks.forEach((book, index) => {
          const geometry = new THREE.BoxGeometry(3, 4, 0.3);
          const materials = [
            new THREE.MeshStandardMaterial({
              map: texture_side.clone(),
              roughness: 0.5,
              metalness: 0.5,
            }),
            new THREE.MeshStandardMaterial({
              map: texture.clone(),
              roughness: 0.5,
              metalness: 0.5,
            }),
            new THREE.MeshStandardMaterial({
              map: texture_side.clone(),
              roughness: 0.5,
              metalness: 0.5,
            }),
            new THREE.MeshStandardMaterial({
              map: texture_side.clone(),
              roughness: 0.5,
              metalness: 0.5,
            }),
            new THREE.MeshStandardMaterial({
              map: texture.clone(),
              roughness: 0.5,
              metalness: 0.5,
            }),
            new THREE.MeshStandardMaterial({
              map: texture.clone(),
              roughness: 0.5,
              metalness: 0.5,
            }),
          ];

          const bookMesh = new THREE.Mesh(geometry, materials);

          // Arrange books in a grid (two columns)
          const row = Math.floor(index / 2); // Calculate row
          const col = index % 2; // Calculate column

          bookMesh.position.x = col * 5 - 2.5; // Space horizontally
          bookMesh.position.y = -row * 6; // Space vertically
          bookMesh.position.z = 0;

          // Add the book to the scene
          scene.add(bookMesh);
          booksArray.push(bookMesh);

          // Add a colorful border to visualize the grid
          const borderGeometry = new THREE.BoxGeometry(3.2, 4.2, 0.5); // Slightly larger than the book
          const borderMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`hsl(${(index * 30) % 360}, 100%, 50%)`), // Unique color for each book
            linewidth: 1,
          });
          const borderEdges = new THREE.EdgesGeometry(borderGeometry); // Edges of the border geometry
          const borderMesh = new THREE.LineSegments(borderEdges, borderMaterial);
          borderMesh.position.copy(bookMesh.position); // Align the border with the book

          // Add the border to the scene
          scene.add(borderMesh);

          // If the book is completed, add a red highlight
          if (book.completed) {
            const completedEdges = new THREE.EdgesGeometry(geometry);
            const completedMaterial = new THREE.LineBasicMaterial({
              color: 0xff0000,
              linewidth: 3,
            });
            const completedMesh = new THREE.LineSegments(
              completedEdges,
              completedMaterial
            );
            bookMesh.add(completedMesh);
          }
        });

        // Start the animation after the textures and scene are set up
        animate();
      })
      .catch((err) => {
        console.error('Error loading textures:', err);
      });

    // Add event listeners
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onWindowResize);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onWindowResize);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [books, visibleCount]);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 2, books.length)); // Show 2 more books
  };

  const handleShowLess = () => {
    setVisibleCount((prevCount) => Math.max(prevCount - 2, 2)); // Show 2 fewer books but at least 2
  };

  return (
    <div className="app-container">
      <div
        ref={mountRef}
        style={{ width: '900px', height: '200vh', overflow: 'visible' }}
      />
      <div>
        {visibleCount < books.length && (
          <button
            onClick={handleShowMore}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#AACB73',
              color: '#FFFFFF',
              border: '1px solid red',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Show More
          </button>
        )}

        {visibleCount > 2 && (
          <button
            onClick={handleShowLess}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#FF5733',
              color: '#FFFFFF',
              border: '1px solid red',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
};

export default ThreeBookshelf;
