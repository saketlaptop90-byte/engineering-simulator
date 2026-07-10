import { redAccent, blueAccent, darkSteel, ghostMaterial, glass } from '../utils/materials.js';

const elementData = [
  "H,Hydrogen", "He,Helium", "Li,Lithium", "Be,Beryllium", "B,Boron", "C,Carbon", "N,Nitrogen", "O,Oxygen", "F,Fluorine", "Ne,Neon",
  "Na,Sodium", "Mg,Magnesium", "Al,Aluminum", "Si,Silicon", "P,Phosphorus", "S,Sulfur", "Cl,Chlorine", "Ar,Argon",
  "K,Potassium", "Ca,Calcium", "Sc,Scandium", "Ti,Titanium", "V,Vanadium", "Cr,Chromium", "Mn,Manganese", "Fe,Iron", "Co,Cobalt", "Ni,Nickel", "Cu,Copper", "Zn,Zinc", "Ga,Gallium", "Ge,Germanium", "As,Arsenic", "Se,Selenium", "Br,Bromine", "Kr,Krypton",
  "Rb,Rubidium", "Sr,Strontium", "Y,Yttrium", "Zr,Zirconium", "Nb,Niobium", "Mo,Molybdenum", "Tc,Technetium", "Ru,Ruthenium", "Rh,Rhodium", "Pd,Palladium", "Ag,Silver", "Cd,Cadmium", "In,Indium", "Sn,Tin", "Sb,Antimony", "Te,Tellurium", "I,Iodine", "Xe,Xenon",
  "Cs,Cesium", "Ba,Barium", "La,Lanthanum", "Ce,Cerium", "Pr,Praseodymium", "Nd,Neodymium", "Pm,Promethium", "Sm,Samarium", "Eu,Europium", "Gd,Gadolinium", "Tb,Terbium", "Dy,Dysprosium", "Ho,Holmium", "Er,Erbium", "Tm,Thulium", "Yb,Ytterbium", "Lu,Lutetium",
  "Hf,Hafnium", "Ta,Tantalum", "W,Tungsten", "Re,Rhenium", "Os,Osmium", "Ir,Iridium", "Pt,Platinum", "Au,Gold", "Hg,Mercury", "Tl,Thallium", "Pb,Lead", "Bi,Bismuth", "Po,Polonium", "At,Astatine", "Rn,Radon",
  "Fr,Francium", "Ra,Radium", "Ac,Actinium", "Th,Thorium", "Pa,Protactinium", "U,Uranium", "Np,Neptunium", "Pu,Plutonium", "Am,Americium", "Cm,Curium", "Bk,Berkelium", "Cf,Californium", "Es,Einsteinium", "Fm,Fermium", "Md,Mendelevium", "No,Nobelium", "Lr,Lawrencium",
  "Rf,Rutherfordium", "Db,Dubnium", "Sg,Seaborgium", "Bh,Bohrium", "Hs,Hassium", "Mt,Meitnerium", "Ds,Darmstadtium", "Rg,Roentgenium", "Cn,Copernicium", "Nh,Nihonium", "Fl,Flerovium", "Mc,Moscovium", "Lv,Livermorium", "Ts,Tennessine", "Og,Oganesson"
];

// Layout logic for Standard Periodic Table
function getGridPosition(Z) {
  // Periods: 1-7
  // Groups: 1-18
  if (Z === 1) return {x: 1, y: 1};
  if (Z === 2) return {x: 18, y: 1};
  
  if (Z >= 3 && Z <= 4) return {x: Z-2, y: 2};
  if (Z >= 5 && Z <= 10) return {x: Z+8, y: 2};
  
  if (Z >= 11 && Z <= 12) return {x: Z-10, y: 3};
  if (Z >= 13 && Z <= 18) return {x: Z, y: 3};
  
  if (Z >= 19 && Z <= 36) return {x: Z-18, y: 4};
  
  if (Z >= 37 && Z <= 54) return {x: Z-36, y: 5};
  
  if (Z >= 55 && Z <= 56) return {x: Z-54, y: 6};
  if (Z >= 57 && Z <= 71) return {x: Z-53, y: 8}; // Lanthanides (offset down)
  if (Z >= 72 && Z <= 86) return {x: Z-68, y: 6};
  
  if (Z >= 87 && Z <= 88) return {x: Z-86, y: 7};
  if (Z >= 89 && Z <= 103) return {x: Z-85, y: 9}; // Actinides (offset down)
  if (Z >= 104 && Z <= 118) return {x: Z-100, y: 7};
  
  return {x: 0, y: 0};
}

function calculateShells(Z) {
  // Madelung rule approximation for shell occupation [K, L, M, N, O, P, Q]
  const shells = [0,0,0,0,0,0,0];
  let e = Z;
  const max = [2, 8, 18, 32, 32, 18, 8];
  
  // Very simplified Aufbau filling order approximation for visual display
  let currentShell = 0;
  while(e > 0) {
      if (shells[currentShell] < max[currentShell]) {
          shells[currentShell]++;
          e--;
          if (shells[currentShell] === 2 && currentShell === 0) currentShell++;
          else if (shells[currentShell] === 8 && currentShell === 1) currentShell++;
          else if (shells[currentShell] === 18 && currentShell === 2 && Z > 28) currentShell++;
          // simplified rough jump
      } else {
          currentShell++;
      }
      if (currentShell > 6) currentShell = 0; // fallback loop
  }
  // Trim empty outer shells
  return shells.filter(s => s > 0);
}

export function createPeriodicTable(THREE) {
  const group = new THREE.Group();
  const parts = [];

  const protonMat = redAccent.clone();
  const neutronMat = darkSteel.clone();
  const electronMat = blueAccent.clone();
  electronMat.emissive.setHex(0x2244ff);
  electronMat.emissiveIntensity = 0.8;
  
  const orbitMat = ghostMaterial.clone();
  orbitMat.opacity = 0.1;

  // We group them so we can spin them
  const allAtomsG = new THREE.Group();
  group.add(allAtomsG);

  for (let z = 1; z <= 118; z++) {
    const data = elementData[z-1].split(',');
    const symbol = data[0];
    const name = data[1];
    const pos = getGridPosition(z);
    
    // Scale everything down so 118 atoms fit in the scene
    const xPos = (pos.x - 9) * 2.5; // Group 1-18 mapped to roughly -20 to +20
    const yPos = -(pos.y - 4) * 2.5; // Period 1-9 mapped to roughly +10 to -10

    const atomG = new THREE.Group();
    atomG.position.set(xPos, yPos, 0);

    // 1. Nucleus (Protons & Neutrons)
    // For visual performance, we don't render 294 individual spheres for Oganesson.
    // Instead we render a representative clump that scales with Z.
    const nucG = new THREE.Group();
    const neutrons = Math.round(z * 1.5); // approximate atomic weight
    const renderCount = Math.min(z + neutrons, 60); // Cap max spheres for browser performance
    const nucRadius = 0.1 * Math.pow(z, 1/3);
    
    for(let i=0; i<renderCount; i++) {
        const isProton = (i % 2 === 0);
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 24, 24), isProton ? protonMat : neutronMat);
        p.position.set(
            (Math.random()-0.5)*nucRadius, 
            (Math.random()-0.5)*nucRadius, 
            (Math.random()-0.5)*nucRadius
        );
        nucG.add(p);
    }
    atomG.add(nucG);

    // 2. Electron Shells (Bohr Model representation)
    const shellsArr = calculateShells(z);
    const shellsG = new THREE.Group();
    
    shellsArr.forEach((numElectrons, shellIdx) => {
        const shellRad = 0.3 + (shellIdx * 0.25);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(shellRad, 0.005, 4, 24), orbitMat);
        
        // Tilt the rings randomly to look like electron clouds instead of flat solar systems
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        // Add electrons to this ring
        for(let e=0; e<numElectrons; e++) {
            const el = new THREE.Mesh(new THREE.SphereGeometry(0.02, 24, 24), electronMat);
            const angle = (e / numElectrons) * Math.PI * 2;
            el.position.set(Math.cos(angle)*shellRad, Math.sin(angle)*shellRad, 0);
            ring.add(el);
        }
        shellsG.add(ring);
    });
    atomG.add(shellsG);
    
    allAtomsG.add(atomG);

    // Register as an interactive part
    parts.push({
      name: `${z}. ${name} (${symbol})`, 
      description: `Atomic Number: ${z}. Protons: ${z}, Neutrons: ~${neutrons}, Electrons: ${z}. Shell configuration: [${shellsArr.join(', ')}].`, 
      material: 'Subatomic Particles', 
      function: 'Fundamental element of the universe', 
      assemblyOrder: z, 
      connections: [], 
      failureEffect: 'Nuclear Fission / Radioactive Decay', 
      cascadeFailures: [], 
      originalPosition: {x: xPos, y: yPos, z: 0}, 
      explodedPosition: {x: xPos, y: yPos, z: z*0.1} // explode them out in Z
    });
  }

  const quizQuestions = [
    { question: "What defines an element's Atomic Number?", options: ["The number of neutrons", "The total weight of the atom", "The number of protons in its nucleus", "The number of electron shells"], correct: 2, explanation: "The number of protons (Atomic Number) defines the chemical element. If you change the number of protons, you physically change the element into a different one.", difficulty: "basic" },
    { question: "What are Isotopes?", options: ["Atoms missing electrons", "Atoms with the same number of protons but a different number of neutrons", "Radioactive electrons", "Molecules made of two atoms"], correct: 1, explanation: "Carbon-12 has 6 protons and 6 neutrons. Carbon-14 has 6 protons and 8 neutrons. They are both Carbon, but C-14 is a heavier, radioactive isotope.", difficulty: "basic" },
    { question: "What determines the chemical reactivity of an element?", options: ["The size of the nucleus", "The number of neutrons", "The number of valence (outermost) electrons", "The temperature of the atom"], correct: 2, explanation: "Elements \"want\" to have a full outer shell (usually 8 electrons). Sodium has 1 extra, Chlorine is missing 1. Therefore, they react violently together to form stable NaCl (salt).", difficulty: "advanced" },
    { question: "What holds the positively charged protons together in the nucleus without them repelling each other?", options: ["Gravity", "Magnetism", "The Strong Nuclear Force", "Electromagnetic Force"], correct: 2, explanation: "The Strong Nuclear Force is 137 times stronger than electromagnetism, but it only works at incredibly tiny distances (femtometers), binding protons and neutrons together.", difficulty: "expert" },
    { question: "Which elements are in the \"noble gas\" group?", options: ["Group 1", "Group 17", "Group 18", "Period 1"], correct: 2, explanation: "Group 18 contains the noble gases (Helium, Neon, Argon, etc.), which have full outer electron shells and are chemically inert.", difficulty: "advanced" },
  ];

  return {
    group, parts, description: 'The Complete Periodic Table. 118 procedurally generated 3D atomic models.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Animate the electron shells
      // allAtomsG is the first child of the main group
      if (group.children[0]) {
          const atoms = group.children[0].children;
          for(let i=0; i<atoms.length; i++) {
              const atom = atoms[i];
              // shellsG is the 2nd child of the atomG
              if (atom.children[1]) {
                  const shells = atom.children[1].children;
                  for(let s=0; s<shells.length; s++) {
                      // spin the ring, which carries the electrons
                      // Inner shells spin faster, outer spin slower
                      const spinSpeed = (5 - s) * 2; 
                      shells[s].rotation.z += 0.02 * spinSpeed * speed;
                  }
              }
          }
      }
    }
  };
}
