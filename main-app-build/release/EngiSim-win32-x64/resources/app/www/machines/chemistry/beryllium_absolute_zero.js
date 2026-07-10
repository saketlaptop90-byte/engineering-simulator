import * as THREE from 'three';
export function createBerylliumAbsoluteZero() {
  const group = new THREE.Group();
  
  // A perfectly frozen HCP crystal of Beryllium
  
  const createAtom = (x, y, z) => {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x88ccff, metalness: 0.9, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1}));
      atom.position.set(x, y, z);
      
      // Ice crystals on the surface
      const iceGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
      const iceMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.7});
      for(let i=0; i<3; i++) {
          const ice = new THREE.Mesh(iceGeo, iceMat);
          ice.position.set((Math.random()-0.5)*0.5, 0.5, (Math.random()-0.5)*0.5);
          ice.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
          atom.add(ice);
      }
      return atom;
  };
  
  const hcp = new THREE.Group();
  
  for (let i=0; i<6; i++) {
      hcp.add(createAtom(Math.cos(i*Math.PI/3)*1.2, -1, Math.sin(i*Math.PI/3)*1.2));
  }
  hcp.add(createAtom(0, -1, 0));
  
  for (let i=0; i<3; i++) {
      hcp.add(createAtom(Math.cos(i*Math.PI*2/3 + Math.PI/6)*1.2, 0, Math.sin(i*Math.PI*2/3 + Math.PI/6)*1.2));
  }
  
  for (let i=0; i<6; i++) {
      hcp.add(createAtom(Math.cos(i*Math.PI/3)*1.2, 1, Math.sin(i*Math.PI/3)*1.2));
  }
  hcp.add(createAtom(0, 1, 0));

  group.add(hcp);
  
  const temp = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  temp.position.set(0, -2.5, 0);
  group.add(temp); // "0 Kelvin (-273.15 °C)"

  group.userData.animate = function(delta, time, speed) {
      // It is completely frozen. NO SHAKING.
      group.rotation.y = time * speed * 0.05; // Just slow camera pan
  };

  return {
    group: group,
    description: "Absolute Zero (0 Kelvin). Temperature is simply a measurement of how fast atoms are vibrating. If you freeze Beryllium down to 0 Kelvin (-273.15 °C), you remove 100% of its thermal energy. The atoms completely stop moving. Because Beryllium's metallic bonds are already so strong, freezing it to Absolute Zero makes it one of the most perfectly rigid and dimensionally stable materials in the universe.",
    parts: [
      { name: "Frozen Spheres", material: "Beryllium Atoms", function: "Completely motionless. No thermal vibration whatsoever." },
      { name: "Cyan Ice", material: "Zero Point Energy", function: "Only quantum mechanical 'zero-point' jiggling remains, but macroscopic movement is dead." }
    ],
    quizQuestions: [
      { question: "What actually happens to the atoms in a block of Beryllium when it reaches Absolute Zero?", options: ["They explode", "They completely stop vibrating and lock into perfect, motionless stillness", "They turn into water", "They start spinning faster"], correct: 1, explanation: "Heat IS motion. Therefore, if you remove all the heat (Absolute Zero), you remove all the motion. The atoms freeze perfectly in place." }
    ]
  };
}