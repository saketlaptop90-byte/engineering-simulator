import { redAccent, blueAccent, darkSteel, glass, ghostMaterial } from '../utils/materials.js';
import * as THREE from 'three';

export function createAtoms(THREE_arg) {
  const group = new THREE.Group();
  const parts = [];

  const protonMat = redAccent.clone();
  const neutronMat = darkSteel.clone();
  const electronMat = blueAccent.clone();
  electronMat.emissive.setHex(0x2244ff);
  electronMat.emissiveIntensity = 0.5;

  const orbitMat = ghostMaterial.clone();
  orbitMat.opacity = 0.2;

  function makeAtom(protons, neutrons, shellsArr, xOffset) {
    const atomG = new THREE.Group();
    atomG.position.x = xOffset;
    
    // Nucleus
    const nucG = new THREE.Group();
    const rad = 0.05 * Math.pow(protons + neutrons, 1/3);
    for(let i=0; i<protons; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), protonMat);
      p.position.set((Math.random()-0.5)*rad, (Math.random()-0.5)*rad, (Math.random()-0.5)*rad);
      nucG.add(p);
    }
    for(let i=0; i<neutrons; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), neutronMat);
      n.position.set((Math.random()-0.5)*rad, (Math.random()-0.5)*rad, (Math.random()-0.5)*rad);
      nucG.add(n);
    }
    atomG.add(nucG);

    // Shells
    const shellsG = new THREE.Group();
    shellsArr.forEach((numElectrons, shellIdx) => {
      const shellRad = 0.4 + (shellIdx * 0.4);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(shellRad, 0.01, 8, 32), orbitMat);
      ring.rotation.x = Math.PI / 2;
      shellsG.add(ring);
      
      const elG = new THREE.Group();
      for(let e=0; e<numElectrons; e++) {
        const el = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), electronMat);
        const angle = (e / numElectrons) * Math.PI * 2;
        el.position.set(Math.cos(angle)*shellRad, 0, Math.sin(angle)*shellRad);
        elG.add(el);
      }
      shellsG.add(elG);
    });
    atomG.add(shellsG);
    
    return atomG;
  }

  // 1. Hydrogen (1p, 1e)
  const hAtom = makeAtom(1, 0, [1], -6);
  group.add(hAtom);
  parts.push({
    name: 'Hydrogen Atom', description: 'Atomic Number 1. 1 proton, 1 electron. The most abundant element.', material: 'Protons/Electrons', function: 'Basic atomic building block', assemblyOrder: 1, connections: [], failureEffect: 'Ionization', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 2. Helium (2p, 2n, 2e)
  const heAtom = makeAtom(2, 2, [2], -4);
  group.add(heAtom);
  parts.push({
    name: 'Helium Atom', description: 'Atomic Number 2. Full K-shell, noble gas.', material: 'Protons/Neutrons/Electrons', function: 'Stable, non-reactive', assemblyOrder: 2, connections: [], failureEffect: 'Alpha decay (if isotope)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 3. Carbon (6p, 6n, 2e, 4e)
  const cAtom = makeAtom(6, 6, [2, 4], -2);
  group.add(cAtom);
  parts.push({
    name: 'Carbon Atom', description: 'Atomic Number 6. 4 valence electrons allows complex bonding.', material: 'Protons/Neutrons/Electrons', function: 'Basis of organic chemistry', assemblyOrder: 3, connections: [], failureEffect: 'Isotope decay (C-14)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 4. Nitrogen (7p, 7n, 2e, 5e)
  const nAtom = makeAtom(7, 7, [2, 5], 0);
  group.add(nAtom);
  parts.push({
    name: 'Nitrogen Atom', description: 'Atomic Number 7. Forms strong triple bonds.', material: 'Protons/Neutrons/Electrons', function: '78% of Earth\'s atmosphere', assemblyOrder: 4, connections: [], failureEffect: '', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 5. Oxygen (8p, 8n, 2e, 6e)
  const oAtom = makeAtom(8, 8, [2, 6], 2);
  group.add(oAtom);
  parts.push({
    name: 'Oxygen Atom', description: 'Atomic Number 8. Highly electronegative, drives combustion.', material: 'Protons/Neutrons/Electrons', function: 'Oxidation / Respiration', assemblyOrder: 5, connections: [], failureEffect: '', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 6. Sodium (11p, 12n, 2e, 8e, 1e)
  const naAtom = makeAtom(11, 12, [2, 8, 1], 4);
  group.add(naAtom);
  parts.push({
    name: 'Sodium Atom', description: 'Atomic Number 11. Highly reactive alkali metal with 1 valence electron.', material: 'Protons/Neutrons/Electrons', function: 'Readily forms Na+ ion', assemblyOrder: 6, connections: [], failureEffect: 'Explosive reaction with water', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 7. Chlorine (17p, 18n, 2e, 8e, 7e)
  const clAtom = makeAtom(17, 18, [2, 8, 7], 6);
  group.add(clAtom);
  parts.push({
    name: 'Chlorine Atom', description: 'Atomic Number 17. Halogen needing 1 electron for full shell.', material: 'Protons/Neutrons/Electrons', function: 'Readily forms Cl- ion', assemblyOrder: 7, connections: [], failureEffect: '', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 8. Iron (26p, 30n, 2e, 8e, 14e, 2e)
  const feAtom = makeAtom(26, 30, [2, 8, 14, 2], 8);
  group.add(feAtom);
  parts.push({
    name: 'Iron Atom', description: 'Atomic Number 26. Transition metal, magnetic.', material: 'Protons/Neutrons/Electrons', function: 'Structural metal, blood oxygen transport', assemblyOrder: 8, connections: [], failureEffect: 'Oxidation (Rust)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 9. Periodic Table (Simplified Rep)
  const ptableG = new THREE.Group();
  const pt = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 0.1), glass.clone());
  pt.position.set(0, -3, 0);
  ptableG.add(pt);
  group.add(ptableG);
  parts.push({
    name: 'Periodic Table', description: 'Organization of all elements by atomic number.', material: 'Concept', function: 'Predict chemical behavior', assemblyOrder: 9, connections: [], failureEffect: '', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-4, z:0}
  });

  // 10. Nucleus Forces
  const strongForceG = new THREE.Group();
  const sf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), glass.clone());
  sf.position.set(-6, 0, 0); // Overlay on Hydrogen roughly
  strongForceG.add(sf);
  group.add(strongForceG);
  parts.push({
    name: 'Strong Nuclear Force', description: 'Force holding protons and neutrons together.', material: 'Force', function: 'Overcomes electromagnetic repulsion', assemblyOrder: 10, connections: [], failureEffect: 'Nuclear fission', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-6, y:0, z:2}
  });

  const quizQuestions = [
    { question: 'What defines the atomic number of an element?', options: ['Number of neutrons', 'Number of protons', 'Atomic weight', 'Number of electrons'], correct: 1, explanation: 'The number of protons determines the element\'s identity.', difficulty: 'basic' },
    { question: 'Why are noble gases like Helium and Neon unreactive?', options: ['They are too heavy', 'Their outermost electron shells are full', 'They have no protons', 'They are gases'], correct: 1, explanation: 'Atoms react to fill their valence shells. Noble gases already have full valence shells, making them stable.', difficulty: 'basic' },
    { question: 'Carbon-12 and Carbon-14 are examples of:', options: ['Isotopes', 'Ions', 'Molecules', 'Compounds'], correct: 0, explanation: 'Isotopes have the same number of protons but different numbers of neutrons.', difficulty: 'advanced' },
    { question: 'Which force holds the nucleus together despite the repulsion of positively charged protons?', options: ['Gravity', 'Electromagnetism', 'Strong Nuclear Force', 'Weak Nuclear Force'], correct: 2, explanation: 'The strong nuclear force acts over very short distances to bind nucleons together.', difficulty: 'expert' },
    { question: 'An atom that has lost an electron is called a:', options: ['Isotope', 'Molecule', 'Cation (Positive Ion)', 'Anion (Negative Ion)'], correct: 2, explanation: 'Losing a negatively charged electron leaves the atom with a net positive charge (Cation).', difficulty: 'basic' },
    { question: 'What is the maximum number of electrons the K shell (innermost shell) can hold?', options: ['8', '2', '18', '32'], correct: 1, explanation: 'The first shell (1s orbital) can only hold 2 electrons.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'Atomic models of fundamental elements.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Animate electron shells rotating
      meshes.forEach(m => {
        if(m && m.group.children.length > 1) { // It's an atom
          const shells = m.group.children[1].children;
          for(let i=0; i<shells.length; i+=2) { // Every other is the elG
             if(shells[i+1]) {
                 shells[i+1].rotation.y = t * (5 - (i*0.5));
                 shells[i+1].rotation.x = Math.sin(t + i) * 0.2;
             }
          }
          // Nucleus jiggle
          m.group.children[0].position.y = Math.sin(t*10) * 0.02;
        }
      });
    }
  };
}
