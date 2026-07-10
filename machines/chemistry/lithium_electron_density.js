import * as THREE from 'three';
export function createLithiumElectronDensity() {
  const group = new THREE.Group();
  
  // Electron Density Isosurfaces (Remastered)
  
  // We represent the 3D density as layered, transparent glass spheres (Isosurfaces)
  // The inner sphere contains 90% of the 1s electron density.
  // The outer sphere contains 90% of the 2s electron density.
  
  const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.6, 
      transmission: 0.9, 
      roughness: 0.1, 
      ior: 1.5,
      side: THREE.DoubleSide
  });
  
  const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0xff00ff, 
      transparent: true, 
      opacity: 0.2, 
      transmission: 0.9, 
      roughness: 0.1, 
      ior: 1.2,
      side: THREE.DoubleSide
  });
  
  // Cut the spheres in half to see inside
  const cutMat = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
  
  // Inner 1s isosurface
  const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI), innerMat);
  group.add(innerSphere);
  
  // Outer 2s isosurface
  const outerSphere = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 32, 0, Math.PI), outerMat);
  group.add(outerSphere);
  
  // The nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);
  
  // Planes to cap the cut halves
  const plane1 = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), cutMat);
  const plane2 = new THREE.Mesh(new THREE.CircleGeometry(4.5, 32), cutMat);
  // group.add(plane1, plane2);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Pulse the isosurfaces slightly to show it's a probability boundary, not a solid wall
      innerSphere.scale.setScalar(1 + Math.sin(time*speed*3)*0.05);
      outerSphere.scale.setScalar(1 + Math.cos(time*speed*2)*0.02);
  };

  return {
    group: group,
    description: "Lithium Electron Density Isosurfaces (Remastered). Because probability clouds are fuzzy and never truly end, chemists use 'Isosurfaces' to draw boundaries. An isosurface is a 3D shell drawn at a specific boundary where there is a 90% probability of finding the electron inside it. By cutting these glass-like shells in half, we can clearly see the structure of Lithium: A tiny, dense 1s shell (cyan) containing two core electrons, safely tucked away inside a massive, diffuse 2s shell (magenta) containing the single valence electron!",
    parts: [
      { name: "Cyan Glass Shell", material: "1s Isosurface", function: "Contains 90% of the 1s electron probability density." },
      { name: "Magenta Glass Shell", material: "2s Isosurface", function: "Contains 90% of the 2s electron probability density." },
      { name: "Red Dot", material: "Nucleus", function: "The center of the atom." }
    ],
    quizQuestions: [
      { question: "What is an 'Isosurface' in chemistry?", options: ["A solid wall of electrons", "A 3D boundary line drawn to show where there is a 90% probability of finding an electron.", "A type of mirror", "A laser beam"], correct: 1, explanation: "Because the wave equation technically stretches to infinity, we have to draw a 'cutoff' boundary to visualize the atom as a solid shape!" }
    ]
  };
}