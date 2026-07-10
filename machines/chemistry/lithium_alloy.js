import * as THREE from 'three';
export function createLithiumAlloy() {
  const group = new THREE.Group();
  
  // Aerospace Lithium-Aluminum Alloy (Remastered)
  
  const meshGroup = new THREE.Group();
  
  // Aluminum atoms (Silver, heavy)
  const alMat = new THREE.MeshPhysicalMaterial({color: 0xaaaaaa, metalness: 0.9, roughness: 0.2});
  // Lithium atoms (Magenta, incredibly light)
  const liMat = new THREE.MeshPhysicalMaterial({color: 0xff00ff, metalness: 0.8, roughness: 0.3});
  
  // Build a crystal lattice
  for(let x=-2; x<=2; x++) {
      for(let y=-2; y<=2; y++) {
          for(let z=-2; z<=2; z++) {
              // 80% Aluminum, 20% Lithium
              const isLithium = Math.random() > 0.8;
              const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), isLithium ? liMat : alMat);
              sphere.position.set(x, y, z);
              meshGroup.add(sphere);
          }
      }
  }
  
  group.add(meshGroup);
  
  // Holographic airplane wireframe surrounding it
  const planeGeo = new THREE.ConeGeometry(5, 10, 4);
  const plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.2, wireframe: true})
  );
  plane.rotation.x = Math.PI/2;
  group.add(plane);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      plane.rotation.z += delta * speed * 0.5;
  };

  return {
    group: group,
    description: "Aerospace Aluminum-Lithium Alloy (Remastered). Why do we put Lithium in airplanes? Aluminum is strong, but heavy. By replacing some of the heavy Aluminum atoms (silver) with ultra-light Lithium atoms (magenta) inside the metal's crystal lattice, metallurgists create an alloy that is significantly lighter! Even better, the differing atom sizes lock the crystal planes in place, making the metal stiffer and stronger than pure aluminum! For every 1% of Lithium added, the density of the metal drops by 3% and the stiffness increases by 5%. This is why modern rockets and fighter jets are built out of Al-Li alloys!",
    parts: [
      { name: "Silver Spheres", material: "Aluminum Atoms", function: "Provides the bulk strength of the metal." },
      { name: "Magenta Spheres", material: "Lithium Atoms", function: "Reduces the weight of the metal and increases stiffness." },
      { name: "Cyan Wireframe", material: "Aerospace Application", function: "Used to build fighter jets and SpaceX rockets." }
    ],
    quizQuestions: [
      { question: "What is the primary benefit of alloying Aluminum with Lithium for aerospace applications?", options: ["It makes the plane fireproof", "It makes the metal significantly lighter and stiffer, saving massive amounts of jet fuel.", "It conducts electricity better", "It looks cooler"], correct: 1, explanation: "Weight is everything in aerospace! A lighter plane uses less fuel, carries more cargo, and flies further." }
    ]
  };
}