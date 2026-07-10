import * as THREE from 'three';
export function createFerroboron() {
  const group = new THREE.Group();
  
  // Ferroboron (FeB) - Interstitial Alloy
  
  const feMat = new THREE.MeshPhysicalMaterial({color: 0xcccccc, metalness: 1.0, roughness: 0.3}); // Iron (Silver)
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron (Cyan)
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.1}); // Subtle lattice lines
  
  // Create an Iron BCC (Body Centered Cubic) lattice
  const atoms = [];
  const size = 3;
  const gridGroup = new THREE.Group();
  
  // Iron Corners
  for(let x=-1; x<=1; x+=2) {
      for(let y=-1; y<=1; y+=2) {
          for(let z=-1; z<=1; z+=2) {
              const fe = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), feMat);
              const pos = new THREE.Vector3(x*size/2, y*size/2, z*size/2);
              fe.position.copy(pos);
              gridGroup.add(fe);
              atoms.push({pos});
          }
      }
  }
  // Iron Center
  const centerFe = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), feMat);
  centerFe.position.set(0,0,0);
  gridGroup.add(centerFe);
  atoms.push({pos: new THREE.Vector3(0,0,0)});
  
  // Add Boron into the Interstitial Spaces (the gaps between the big Iron atoms)
  const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), bMat); b1.position.set(size/2, 0, 0); gridGroup.add(b1);
  const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), bMat); b2.position.set(-size/2, 0, 0); gridGroup.add(b2);
  const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), bMat); b3.position.set(0, size/2, 0); gridGroup.add(b3);
  
  // Visual lines to show it's a solid crystal
  for(let i=0; i<atoms.length; i++) {
      for(let j=i+1; j<atoms.length; j++) {
          const dist = atoms[i].pos.distanceTo(atoms[j].pos);
          if (dist < size) {
              const line = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
              line.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
              line.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
              gridGroup.add(line);
          }
      }
  }
  
  group.add(gridGroup);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.2;
  };

  return {
    group: group,
    description: "Ferroboron (FeB). Boron is frequently added to steel to drastically increase its hardness! Because Boron atoms (cyan) are significantly smaller than Iron atoms (silver), they don't replace the iron. Instead, they squeeze into the tiny empty gaps (interstitial spaces) between the iron atoms. This acts like jamming sand into the gears of a machine—it completely locks the iron lattice in place, preventing the layers from sliding past each other. This 'Interstitial Alloying' creates an incredibly hard, wear-resistant steel used in military armor and heavy machinery!",
    parts: [
      { name: "Silver Spheres", material: "Iron Lattice", function: "The primary metal structure." },
      { name: "Cyan Spheres", material: "Boron Atoms", function: "Squeezed into the empty gaps to physically lock the metal from bending or denting." }
    ],
    quizQuestions: [
      { question: "How does adding Boron to Iron create a harder steel alloy?", options: ["It turns the iron into diamond", "Because Boron is smaller, it wedges itself into the empty gaps between the Iron atoms. This jams the crystal lattice, physically preventing the metal layers from sliding and bending.", "It makes the iron colder", "It removes the rust from iron"], correct: 1, explanation: "Metals bend because their atomic layers easily slide past each other. Interstitial atoms like Carbon and Boron act like microscopic speed bumps that stop the sliding!" }
    ]
  };
}