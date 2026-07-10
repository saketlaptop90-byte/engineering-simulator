import * as THREE from 'three';
export function createLithiumBccLattice() {
  const group = new THREE.Group();
  
  // Body-Centered Cubic (BCC) Lattice (Remastered)
  
  const atomMat = new THREE.MeshPhysicalMaterial({color: 0xcccccc, metalness: 0.9, roughness: 0.3, clearcoat: 0.5}); // Silver Lithium metal
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2});
  
  const atoms = [];
  const size = 3;
  const gridGroup = new THREE.Group();
  
  // A 2x2x2 unit cell grid of BCC
  for(let x=-1; x<=1; x++) {
      for(let y=-1; y<=1; y++) {
          for(let z=-1; z<=1; z++) {
              // The corner atoms
              const corner = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), atomMat);
              const pC = new THREE.Vector3(x*size, y*size, z*size);
              corner.position.copy(pC);
              gridGroup.add(corner);
              atoms.push({pos: pC});
              
              // The body-center atoms (offset by half size)
              if (x < 1 && y < 1 && z < 1) {
                  const center = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), atomMat);
                  const pB = new THREE.Vector3(x*size + size/2, y*size + size/2, z*size + size/2);
                  center.position.copy(pB);
                  gridGroup.add(center);
                  atoms.push({pos: pB});
              }
          }
      }
  }
  
  // Draw bonds to show the crystal structure
  for(let i=0; i<atoms.length; i++) {
      for(let j=i+1; j<atoms.length; j++) {
          const dist = atoms[i].pos.distanceTo(atoms[j].pos);
          // Bond length in BCC is sqrt(3)/2 * size (center to corner) or just size (corner to corner)
          if (dist < size * 1.1) {
              const line = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
              line.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
              line.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
              gridGroup.add(line);
          }
      }
  }
  
  // Center the grid
  gridGroup.position.set(-size/2, -size/2, -size/2);
  group.add(gridGroup);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.2;
      group.rotation.z = Math.cos(time*speed*0.1)*0.1;
  };

  return {
    group: group,
    description: "Lithium Body-Centered Cubic (BCC) Lattice. How do Lithium atoms stack together to form solid metal? They arrange themselves in a 'BCC' crystal lattice. Imagine a cube of 8 atoms at the corners, and exactly ONE atom floating right in the dead center of the body. Because it only has 8 direct neighbors (a coordination number of 8), the atoms are not packed very tightly together. This empty space makes solid Lithium incredibly lightweight! In fact, it has a density of only 0.53 g/cm³, which means a solid chunk of Lithium metal will literally float on water!",
    parts: [
      { name: "Silver Spheres", material: "Lithium Atoms", function: "Metallic bonding sharing a sea of electrons." },
      { name: "Cubic Structure", material: "BCC Lattice", function: "A relatively 'loose' crystal packing structure." }
    ],
    quizQuestions: [
      { question: "Why is solid Lithium metal light enough to float on water?", options: ["Because it is filled with helium gas", "Because its atoms stack in a Body-Centered Cubic (BCC) lattice, which leaves a lot of empty space between the atoms, resulting in a very low density.", "Because it repels water magnetically", "Because it is liquid"], correct: 1, explanation: "Metals like Gold stack in a 'Face-Centered Cubic' (FCC) lattice, packing atoms as tightly as physically possible, making them extremely dense and heavy. Lithium's BCC packing is much looser!" }
    ]
  };
}