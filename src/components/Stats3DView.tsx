
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Stats3DView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f5ff);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(30, 30, 0xaaaaaa, 0xe0e0e0);
    scene.add(gridHelper);
    
    // Create warehouse floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create warehouse racks function
    const createRack = (x: number, z: number, items: number) => {
      const rackGroup = new THREE.Group();
      
      // Create rack structure
      const rackGeometry = new THREE.BoxGeometry(3, 5, 1);
      const rackMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
      const rack = new THREE.Mesh(rackGeometry, rackMaterial);
      rack.position.set(x, 2.5, z);
      rack.castShadow = true;
      rack.receiveShadow = true;
      rackGroup.add(rack);
      
      // Add items to rack based on count
      for (let i = 0; i < items; i++) {
        const itemGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        
        // Random color for each item
        const hue = Math.random() * 0.2 + 0.5; // Range between 0.5 and 0.7 (blue to purple)
        const itemMaterial = new THREE.MeshStandardMaterial({ 
          color: new THREE.Color().setHSL(hue, 0.7, 0.5),
          roughness: 0.3,
          metalness: 0.2,
        });
        
        const item = new THREE.Mesh(itemGeometry, itemMaterial);
        
        // Position within rack (x: -1 to 1, y: 0 to 4, z: front of rack)
        const itemX = x + (Math.random() * 2 - 1);
        const itemY = 1 + Math.floor(i / 3);
        const itemZ = z - 0.1;
        
        item.position.set(itemX, itemY, itemZ);
        item.castShadow = true;
        rackGroup.add(item);
      }
      
      scene.add(rackGroup);
      return rackGroup;
    };
    
    // Create warehouse with multiple racks
    const racks = [];
    const positions = [
      { x: -8, z: -8, items: 5 },
      { x: -8, z: -4, items: 8 },
      { x: -8, z: 0, items: 3 },
      { x: -8, z: 4, items: 7 },
      { x: -8, z: 8, items: 9 },
      
      { x: -3, z: -8, items: 4 },
      { x: -3, z: -4, items: 6 },
      { x: -3, z: 0, items: 2 },
      { x: -3, z: 4, items: 9 },
      { x: -3, z: 8, items: 5 },
      
      { x: 3, z: -8, items: 7 },
      { x: 3, z: -4, items: 3 },
      { x: 3, z: 0, items: 8 },
      { x: 3, z: 4, items: 2 },
      { x: 3, z: 8, items: 6 },
      
      { x: 8, z: -8, items: 9 },
      { x: 8, z: -4, items: 5 },
      { x: 8, z: 0, items: 3 },
      { x: 8, z: 4, items: 7 },
      { x: 8, z: 8, items: 4 },
    ];
    
    positions.forEach(pos => {
      racks.push(createRack(pos.x, pos.z, pos.items));
    });
    
    // Animation loop
    let frameId: number;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
    };
  }, []);
  
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Visualização 3D do Armazém</h2>
      <div 
        ref={containerRef} 
        className="flex-1 w-full rounded-lg overflow-hidden shadow-md"
      />
    </div>
  );
};

export default Stats3DView;
