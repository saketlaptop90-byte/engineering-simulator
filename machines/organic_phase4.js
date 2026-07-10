import { darkSteel, whitePlastic, redAccent, blueAccent, ghostMaterial, tinted, orangeAccent, yellowAccent, greenAccent, purpleAccent, steel } from '../utils/materials.js';

export function createOrganicPhase4(THREE, machineId) {
  const group = new THREE.Group();
  const parts = [];

  const cMat = darkSteel.clone();
  const hMat = whitePlastic.clone();
  const oMat = redAccent.clone();
  const nMat = blueAccent.clone();
  const bondMat = ghostMaterial.clone();
  bondMat.opacity = 0.6;

  // Simple string hasher for deterministic procedural generation
  function hashString(str) {
      let hash = 0;
      if (!str || str.length === 0) return hash;
      for (let i = 0; i < str.length; i++) {
          let char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
      }
      return Math.abs(hash);
  }

  const hash = hashString(machineId || "Molecule");
  // Seed random with hash
  let seed = hash;
  function random() {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
  }

  // Determine complexity based on name
  const numAtoms = 5 + Math.floor(random() * 20); 
  const atoms = [];

  function createAtom(mat, rad, pos, role) {
      const a = new THREE.Mesh(new THREE.SphereGeometry(rad, 16, 16), mat);
      a.position.copy(pos);
      group.add(a);
      atoms.push({mesh: a, pos: pos, role: role, radius: rad});
      parts.push({
          name: role, description: 'Atom in ' + (machineId||'molecule'), material: 'Element', function: 'Chemical Structure', assemblyOrder: parts.length + 1, connections: [], failureEffect: 'Bond Breakage', cascadeFailures: [], originalPosition: {x: pos.x, y: pos.y, z: pos.z}, explodedPosition: {x: pos.x * 2, y: pos.y * 2, z: pos.z * 2}
      });
      return a;
  }

  function createBond(p1, p2) {
      const dist = p1.distanceTo(p2);
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, dist, 8), bondMat);
      cyl.position.copy(p1).lerp(p2, 0.5);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      group.add(cyl);
  }

  // 3D Random Walk Generation
  let currentPos = new THREE.Vector3(0, 5, 0);
  const elements = [
      {mat: cMat, rad: 0.4, name: 'Carbon'},
      {mat: oMat, rad: 0.35, name: 'Oxygen'},
      {mat: nMat, rad: 0.35, name: 'Nitrogen'},
      {mat: hMat, rad: 0.2, name: 'Hydrogen'}
  ];

  for(let i=0; i<numAtoms; i++) {
      let elemIdx = 0; // Default Carbon
      if (random() > 0.6) elemIdx = Math.floor(random() * elements.length);
      let el = elements[elemIdx];
      
      let newPos = currentPos.clone().add(new THREE.Vector3((random()-0.5)*2, (random()-0.5)*2, (random()-0.5)*2).normalize().multiplyScalar(1.2));
      createAtom(el.mat, el.rad, newPos, el.name);
      
      // Bond to previous
      if (i > 0) {
          createBond(currentPos, newPos);
          // 20% chance to branch
          if (random() > 0.8) {
              currentPos = atoms[Math.floor(random() * atoms.length)].pos.clone();
          } else {
              currentPos = newPos;
          }
      } else {
          currentPos = newPos;
      }
  }

  return { group, parts, name: machineId || 'Procedural Molecule' };
}
export const organicMachines = [];
for(let i=1; i<=2000; i++) {
    const prefixes = ['Methyl', 'Ethyl', 'Propyl', 'Butyl', 'Phenyl', 'Amino', 'Hydroxy', 'Cyano', 'Chloro', 'Fluoro'];
    const roots = ['methane', 'ethane', 'propane', 'butane', 'pentane', 'hexane', 'heptane', 'octane', 'benzene', 'phenol'];
    const suffixes = ['oic acid', 'ol', 'al', 'one', 'amine', 'amide', 'ate', 'ene', 'yne', 'ether'];
    
    let name = prefixes[i%10] + ' ' + roots[(i/10)%10] + ' ' + suffixes[(i/100)%10] + ' (Reaction ' + i + ')';
    organicMachines.push({
        id: 'org_' + i,
        name: name,
        icon: '??',
        category: 'chemistry',
        create: (THREE, id) => createOrganicPhase4(THREE, name)
    });
}
