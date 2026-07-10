import * as THREE from 'three';
export function createBoronShielding() {
  const group = new THREE.Group();
  
  // Deep dive into how shielding actually works mechanically
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Core electron rapidly orbiting, creating a blurry shield
  const coreGrp = new THREE.Group();
  for(let i=0; i<8; i++) {
      const trail = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.6, 32), new THREE.MeshBasicMaterial({color: 0x0044ff, transparent: true, opacity: 0.2, side: THREE.DoubleSide}));
      trail.rotation.x = Math.random() * Math.PI;
      trail.rotation.y = Math.random() * Math.PI;
      coreGrp.add(trail);
  }
  const eCore1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({color: 0x00ffff})); eCore1.position.set(1.5, 0, 0); coreGrp.add(eCore1);
  const eCore2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({color: 0x00ffff})); eCore2.position.set(-1.5, 0, 0); coreGrp.add(eCore2);
  group.add(coreGrp);

  // Valence electron
  const valGrp = new THREE.Group();
  const eVal = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  eVal.position.set(3.5, 0, 0);
  valGrp.add(eVal);
  group.add(valGrp);

  // Attraction arrow (Red, pulling in)
  const attract = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(3.3, 0, 0), 1.5, 0xff0000, 0.3, 0.3);
  group.add(attract);

  // Repulsion arrow (Blue, pushing out)
  const repel = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(3.7, 0, 0), 0.8, 0x0044ff, 0.3, 0.3);
  group.add(repel);

  group.userData.animate = function(delta, time, speed) {
      coreGrp.rotation.y = time * speed * 5; // Spin incredibly fast to form a "wall"
      coreGrp.rotation.z = time * speed * 3;
      
      valGrp.rotation.y = time * speed * 1; // Slower outer orbit
      
      // Update arrows to follow valence electron
      const valWorld = new THREE.Vector3();
      eVal.getWorldPosition(valWorld);
      
      const dirAttract = new THREE.Vector3(0,0,0).sub(valWorld).normalize();
      attract.position.copy(valWorld).add(dirAttract.clone().multiplyScalar(0.2));
      attract.setDirection(dirAttract);
      
      repel.position.copy(valWorld).sub(dirAttract.clone().multiplyScalar(0.2));
      repel.setDirection(dirAttract.clone().negate());
  };

  return {
    group: group,
    description: "Electron Shielding (The Mechanics). Why do the core electrons 'shield' the nucleus? It's a tug-of-war. The outer green electron is being pulled IN by the red nucleus. However, it is also being pushed OUT by the blue core electrons, because negative charges repel each other! Because the core electrons are moving incredibly fast, they form a blurry, solid 'wall' of negative charge that constantly pushes the outer electron away, severely weakening the nucleus's grip on it.",
    parts: [
      { name: "Red Arrow", material: "Nuclear Attraction", function: "The nucleus trying to pull the green electron in." },
      { name: "Blue Arrow", material: "Electron Repulsion", function: "The fast-moving core electrons actively pushing the green electron away." },
      { name: "Blurry Blue Shell", material: "The Shield", function: "Created by just 2 electrons moving at a fraction of the speed of light." }
    ],
    quizQuestions: [
      { question: "What is physically causing the 'shielding' effect?", options: ["Gravity from the core electrons", "The core electrons emitting light", "The negative charge of the core electrons actively pushing the negative valence electrons away", "The nucleus shrinking"], correct: 2, explanation: "Like charges repel. The outer electrons want to get to the nucleus, but the inner electrons are in the way and physically repel them backward." }
    ]
  };
}