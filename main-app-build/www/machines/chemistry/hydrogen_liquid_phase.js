import * as THREE from 'three';
export function createHydrogenLiquidPhase() {
  const group = new THREE.Group();
  
  // Liquid pool of H2 molecules
  const mat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, transmission: 0.9, roughness: 0.1 });
  const count = 50;
  
  const molecules = [];
  for(let i=0; i<count; i++) {
      const mol = new THREE.Group();
      const a1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), mat); a1.position.x = -0.3;
      const a2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), mat); a2.position.x = 0.3;
      mol.add(a1); mol.add(a2);
      
      mol.position.set((Math.random()-0.5)*6, (Math.random()-0.5)*4, (Math.random()-0.5)*6);
      mol.userData = {
          vel: new THREE.Vector3((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2),
          rotSpeed: (Math.random()-0.5)*5
      };
      molecules.push(mol);
      group.add(mol);
  }

  // Bounding box
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6.5, 4.5, 6.5)), new THREE.LineBasicMaterial({color: 0xffffff, transparent:true, opacity:0.2}));
  group.add(box);

  group.userData.animate = function(delta, time, speed) {
      molecules.forEach(m => {
          m.position.addScaledVector(m.userData.vel, delta * speed);
          m.rotation.z += m.userData.rotSpeed * delta * speed;
          
          // Bounce
          if(Math.abs(m.position.x) > 3) m.userData.vel.x *= -1;
          if(Math.abs(m.position.y) > 2) m.userData.vel.y *= -1;
          if(Math.abs(m.position.z) > 3) m.userData.vel.z *= -1;
      });
  };

  return {
    group: group,
    description: "Liquid Hydrogen (LH2). At temperatures below 20.28 K (-252.87 °C), hydrogen condenses into a liquid, characterized by high density relative to gas, making it ideal for rocket fuel.",
    parts: [
      { name: "H2 Molecules", material: "Cryogenic Liquid", function: "Move freely but remain close due to weak dispersion forces." },
      { name: "Low Temperature", material: "Environment", function: "Maintained below 20 K." }
    ]
  };
}
