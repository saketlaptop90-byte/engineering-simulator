import * as THREE from 'three';
export function createBorophene() {
  const group = new THREE.Group();
  
  // Borophene - The 2D Allotrope of Boron (The Grand Finale of Boron)
  
  const bMat = new THREE.MeshPhysicalMaterial({
      color: 0x00aaff, 
      metalness: 0.8, 
      roughness: 0.1, 
      clearcoat: 1.0,
      emissive: 0x002255
  }); 
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
  
  const sheet = new THREE.Group();
  const atoms = [];
  
  // Borophene is NOT just simple hexagons like Graphene.
  // Because Boron has 3 valence electrons, it forms a mix of triangles and hexagons (a buckled triangular lattice).
  // We will build a triangular lattice where some atoms are slightly raised/lowered (buckled).
  
  const spacing = 1.0;
  
  for(let x=-4; x<=4; x++) {
      for(let z=-4; z<=4; z++) {
          // Offset odd rows to make triangles
          const px = x * spacing + (Math.abs(z)%2===1 ? spacing/2 : 0);
          const pz = z * spacing * 0.866; // sqrt(3)/2
          
          // Only create a circle to make it look elegant
          if (Math.sqrt(px*px + pz*pz) > 4) continue;
          
          // Buckling effect (some atoms are pushed up, some down)
          const py = Math.sin(x*2 + z*2) * 0.2; 
          
          const pos = new THREE.Vector3(px, py, pz);
          atoms.push({pos});
          
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), bMat);
          b.position.copy(pos);
          sheet.add(b);
      }
  }
  
  // Draw the triangular bonds
  for(let i=0; i<atoms.length; i++) {
      for(let j=i+1; j<atoms.length; j++) {
          const dist = atoms[i].pos.distanceTo(atoms[j].pos);
          if (dist < spacing * 1.1) {
              const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, dist, 8), bondMat);
              b.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
              b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
              sheet.add(b);
          }
      }
  }
  
  group.add(sheet);
  
  // Add a beautiful pulsing scanline to show it is a high-tech metamaterial
  const scanline = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.1, 10),
      new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending})
  );
  group.add(scanline);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.4; // Tilted to see the 2D plane
      
      // Animate the buckled sheet rippling (flexibility)
      atoms.forEach((a, idx) => {
          const mesh = sheet.children[idx];
          mesh.position.y = a.pos.y + Math.sin(time*speed*2 + a.pos.x)*0.1;
      });
      // also update bonds? (Too expensive for realtime here, the atoms bobbing looks cool enough)
      
      // Animate scanline
      scanline.position.y = Math.sin(time*speed) * 2;
  };

  return {
    group: group,
    description: "Borophene (The 2D Wonder Material). For our grand finale of Boron: Borophene! Everyone has heard of Graphene (a 2D sheet of Carbon). Borophene is a 2D sheet of pure Boron, and it is theoretically stronger, lighter, and far more flexible than Graphene! Because Boron has fewer electrons than Carbon, it cannot form perfect flat hexagons. Instead, it forms a 'buckled triangular lattice' (notice how the sheet has a wavy, corrugated texture). This unique structure allows it to conduct electricity beautifully in one direction, making it the holy grail for future flexible electronics, super-batteries, and quantum computers!",
    parts: [
      { name: "Cyan Atoms", material: "Pure Boron", function: "Forming a 2-Dimensional sheet only 1 atom thick." },
      { name: "Wavy Texture", material: "Buckled Lattice", function: "Provides the material with immense structural flexibility." }
    ],
    quizQuestions: [
      { question: "Why is Borophene's structure 'buckled' and wavy compared to the perfectly flat hexagons of Graphene?", options: ["Because it is melting", "Because Boron has fewer electrons than Carbon, forcing it to form a mixed triangular lattice that puckers out of a perfect 2D plane to remain stable.", "Because it is heavier than carbon", "Because it is magnetic"], correct: 1, explanation: "This buckling is exactly what gives Borophene its legendary flexibility, acting almost like an atomic accordion!" }
    ]
  };
}