import os

target_dir = r"C:\Users\Saket\OneDrive\Desktop\engineering-simulator\machines\chemistry"
os.makedirs(target_dir, exist_ok=True)

models = {
    "hydrogen_atomic_structure": """import * as THREE from 'three';
export function createHydrogenAtomicStructure() {
  const group = new THREE.Group();
  
  // Nucleus (Proton)
  const protonGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const protonMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.4 });
  const proton = new THREE.Mesh(protonGeo, protonMat);
  group.add(proton);

  // Electron
  const electronGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const electronMat = new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x1111aa });
  const electron = new THREE.Mesh(electronGeo, electronMat);
  electron.position.set(3, 0, 0);
  
  // Electron Orbit Path
  const orbitCurve = new THREE.EllipseCurve(0, 0, 3, 3, 0, 2 * Math.PI, false, 0);
  const points = orbitCurve.getPoints(50);
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
  const orbitLine = new THREE.Line(orbitGeo, orbitMat);
  orbitLine.rotation.x = Math.PI / 2;
  
  const orbitGroup = new THREE.Group();
  orbitGroup.add(orbitLine);
  orbitGroup.add(electron);
  group.add(orbitGroup);

  // Animation function attached to the group
  group.userData.animate = function(delta, time, speed) {
      orbitGroup.rotation.y += delta * speed * 2;
  };

  return {
    model: group,
    description: "The basic atomic structure of Hydrogen (1H) consisting of a single proton nucleus and one orbiting electron.",
    parts: [
      { name: "Proton (Nucleus)", material: "Hadron", function: "Provides the positive charge and nearly all the mass of the atom." },
      { name: "Electron", material: "Lepton", function: "Negatively charged particle orbiting the nucleus." },
      { name: "Electron Orbit", material: "Space", function: "The classical trajectory of the electron." }
    ]
  };
}""",

    "hydrogen_bohr_model": """import * as THREE from 'three';
export function createHydrogenBohrModel() {
  const group = new THREE.Group();
  
  // Nucleus
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Orbits n=1, n=2, n=3
  const orbits = [];
  for(let i=1; i<=3; i++) {
    const radius = i * 1.5;
    const orbitCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2*Math.PI, false, 0);
    const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(64)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
    orbitLine.rotation.x = Math.PI / 2;
    group.add(orbitLine);
    orbits.push({radius: radius});
  }

  // Electron
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888 }));
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      // Simulate jumping between orbits for educational purposes
      const currentN = Math.floor((time * speed * 0.5) % 3) + 1; 
      const radius = currentN * 1.5;
      const angle = time * speed * 3;
      electron.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  };

  return {
    model: group,
    description: "The Bohr Model of Hydrogen showing quantized energy levels (n=1, n=2, n=3).",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Central positive charge." },
      { name: "n=1 Orbit (Ground State)", material: "Energy Level", function: "Lowest energy state for the electron." },
      { name: "n=2 Orbit (Excited)", material: "Energy Level", function: "First excited state." },
      { name: "n=3 Orbit (Excited)", material: "Energy Level", function: "Second excited state." },
      { name: "Electron", material: "Particle", function: "Jumps between quantized orbits absorbing/emitting photons." }
    ]
  };
}""",

    "hydrogen_quantum_model": """import * as THREE from 'three';
export function createHydrogenQuantumModel() {
  const group = new THREE.Group();
  
  // Nucleus
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Quantum probability cloud (Particles)
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Generate points heavily concentrated at the center (exponential decay simulating 1s orbital probability)
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = -Math.log(Math.random()) * 1.5; // simple approximation of exponential decay radial probability

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    
    colors[i*3] = 0.2;
    colors[i*3+1] = 0.5;
    colors[i*3+2] = 1.0;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
  const cloud = new THREE.Points(geometry, material);
  group.add(cloud);

  group.userData.animate = function(delta, time, speed) {
      cloud.rotation.y += delta * speed * 0.1;
      cloud.rotation.z += delta * speed * 0.05;
  };

  return {
    model: group,
    description: "Quantum Mechanical Model of Hydrogen. Instead of orbits, the electron exists in a probability cloud.",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Center of the atom." },
      { name: "Probability Cloud (1s)", material: "Wavefunction", function: "Defines the probability of finding the electron at a given location." }
    ]
  };
}""",

    "hydrogen_electron_cloud": """import * as THREE from 'three';
export function createHydrogenElectronCloud() {
  const group = new THREE.Group();
  
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Volumetric cloud representation using layered transparent spheres
  const cloudGroup = new THREE.Group();
  for(let i=1; i<=10; i++) {
     const radius = i * 0.4;
     const opacity = 0.3 * Math.exp(-i/2); // Density decreases outwards
     const geo = new THREE.SphereGeometry(radius, 32, 32);
     const mat = new THREE.MeshPhysicalMaterial({ color: 0x4488ff, transparent: true, opacity: opacity, transmission: 0.9, roughness: 0.1 });
     cloudGroup.add(new THREE.Mesh(geo, mat));
  }
  group.add(cloudGroup);

  return {
    model: group,
    description: "Electron Cloud visualization showing the electron density gradient of Hydrogen.",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Center of the atom." },
      { name: "Electron Density", material: "Cloud", function: "Darker/denser regions represent higher probability of finding the electron." }
    ]
  };
}""",

    "hydrogen_s_orbital": """import * as THREE from 'three';
export function createHydrogenSOrbital() {
  const group = new THREE.Group();
  
  const axesHelper = new THREE.AxesHelper(3);
  group.add(axesHelper);

  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  const orbitalGeo = new THREE.SphereGeometry(2, 64, 64);
  const orbitalMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5, transmission: 0.5, roughness: 0.4, side: THREE.DoubleSide });
  const orbital = new THREE.Mesh(orbitalGeo, orbitalMat);
  group.add(orbital);

  return {
    model: group,
    description: "The 1s Orbital of Hydrogen. It is perfectly spherical, indicating no angular dependence in probability.",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Center" },
      { name: "1s Orbital Boundary", material: "Mathematical Surface", function: "Encloses 90% of the electron probability." },
      { name: "XYZ Axes", material: "Reference", function: "Shows spherical symmetry." }
    ]
  };
}""",

    "hydrogen_energy_levels": """import * as THREE from 'three';
export function createHydrogenEnergyLevels() {
  const group = new THREE.Group();
  
  // Draw an energy level diagram in 3D
  const levels = [-13.6, -3.4, -1.51, -0.85, -0.54]; // eV
  
  levels.forEach((energy, i) => {
    const n = i + 1;
    // Map energy to Y position (shift up for visibility)
    const yPos = (energy + 14) * 0.5; 
    
    const planeGeo = new THREE.PlaneGeometry(4, 4);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = yPos;
    
    // Add rings to represent the orbit size roughly
    const ringGeo = new THREE.RingGeometry(n*0.5, n*0.5+0.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yPos;
    
    group.add(plane);
    group.add(ring);
  });

  return {
    model: group,
    description: "Hydrogen Energy Levels (n=1 to n=5) showing the convergence of levels as energy approaches 0 eV.",
    parts: [
      { name: "Ground State (n=1)", material: "Level", function: "Energy = -13.6 eV" },
      { name: "n=2 Level", material: "Level", function: "Energy = -3.4 eV" },
      { name: "n=3 Level", material: "Level", function: "Energy = -1.51 eV" },
      { name: "Higher Levels", material: "Level", function: "Converging towards 0 eV (ionization limit)." }
    ]
  };
}""",

    "hydrogen_electron_spin": """import * as THREE from 'three';
export function createHydrogenElectronSpin() {
  const group = new THREE.Group();
  
  const electronGeo = new THREE.SphereGeometry(1, 32, 32);
  const electronMat = new THREE.MeshStandardMaterial({ color: 0x3333ff, metalness: 0.5 });
  const electron = new THREE.Mesh(electronGeo, electronMat);
  group.add(electron);

  // Spin axis arrow
  const dir = new THREE.Vector3(0, 1, 0);
  const origin = new THREE.Vector3(0, -1.5, 0);
  const length = 3;
  const hex = 0xff0000;
  const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 0.5, 0.5);
  group.add(arrowHelper);

  // Magnetic field lines (Torus)
  const torusGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 64);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = Math.PI / 2;
  group.add(torus);

  group.userData.animate = function(delta, time, speed) {
      electron.rotation.y += delta * speed * 5; // fast spin
  };

  return {
    model: group,
    description: "Electron Spin visualization. The intrinsic angular momentum (spin) of the electron creates a tiny magnetic dipole.",
    parts: [
      { name: "Electron", material: "Lepton", function: "Possesses spin +1/2 or -1/2." },
      { name: "Spin Axis", material: "Vector", function: "Direction of angular momentum." },
      { name: "Magnetic Dipole", material: "Field", function: "Generated by the spinning charge." }
    ]
  };
}""",

    "hydrogen_isotopes": """import * as THREE from 'three';
export function createHydrogenIsotopes() {
  const group = new THREE.Group();
  
  const createNucleus = (protons, neutrons, xOffset) => {
      const nGroup = new THREE.Group();
      for(let i=0; i<protons; i++){
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshStandardMaterial({color: 0xff0000}));
          p.position.set(Math.random()*0.2, Math.random()*0.2, Math.random()*0.2);
          nGroup.add(p);
      }
      for(let i=0; i<neutrons; i++){
          const n = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshStandardMaterial({color: 0xcccccc}));
          n.position.set(Math.random()*0.4 - 0.2, Math.random()*0.4 - 0.2, Math.random()*0.4 - 0.2);
          nGroup.add(n);
      }
      
      const orbitCurve = new THREE.EllipseCurve(0, 0, 2, 2, 0, 2 * Math.PI, false, 0);
      const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(50)), new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 }));
      orbitLine.rotation.x = Math.PI / 2;
      
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
      e.position.set(2, 0, 0);
      
      nGroup.add(orbitLine);
      nGroup.add(e);
      
      nGroup.position.x = xOffset;
      return nGroup;
  };

  const protium = createNucleus(1, 0, -4);
  const deuterium = createNucleus(1, 1, 0);
  const tritium = createNucleus(1, 2, 4);

  group.add(protium);
  group.add(deuterium);
  group.add(tritium);

  return {
    model: group,
    description: "The three isotopes of Hydrogen: Protium (1H), Deuterium (2H), and Tritium (3H).",
    parts: [
      { name: "Protium (Left)", material: "1 Proton", function: "Most common isotope." },
      { name: "Deuterium (Center)", material: "1 Proton, 1 Neutron", function: "Stable isotope, used in heavy water." },
      { name: "Tritium (Right)", material: "1 Proton, 2 Neutrons", function: "Radioactive isotope." }
    ]
  };
}""",

    "hydrogen_covalent_bonding": """import * as THREE from 'three';
export function createHydrogenCovalentBonding() {
  const group = new THREE.Group();
  
  // H2 Molecule
  const atom1Geo = new THREE.SphereGeometry(1, 32, 32);
  const atomMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, transmission: 0.5 });
  
  const atom1 = new THREE.Mesh(atom1Geo, atomMat);
  atom1.position.x = -0.7;
  group.add(atom1);

  const atom2 = new THREE.Mesh(atom1Geo, atomMat);
  atom2.position.x = 0.7;
  group.add(atom2);

  // Nuclei
  const nucleusMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), nucleusMat);
  n1.position.x = -0.7;
  group.add(n1);
  
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), nucleusMat);
  n2.position.x = 0.7;
  group.add(n2);

  // Electron cloud overlap (Bond)
  const bondGeo = new THREE.CapsuleGeometry(0.8, 1.4, 16, 32);
  const bondMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
  const bond = new THREE.Mesh(bondGeo, bondMat);
  bond.rotation.z = Math.PI / 2;
  group.add(bond);

  return {
    model: group,
    description: "Covalent Bonding in H2. Two hydrogen atoms share their electrons to form a stable molecule.",
    parts: [
      { name: "Hydrogen Atom 1", material: "Proton + Cloud", function: "Shares 1 electron." },
      { name: "Hydrogen Atom 2", material: "Proton + Cloud", function: "Shares 1 electron." },
      { name: "Covalent Bond Overlap", material: "Electron Cloud", function: "High electron density region holding the nuclei together." }
    ]
  };
}""",

    "hydrogen_van_der_waals": """import * as THREE from 'three';
export function createHydrogenVanDerWaals() {
  const group = new THREE.Group();
  
  // Two H2 molecules
  const createH2 = (x, y) => {
      const h2 = new THREE.Group();
      const atomMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
      const a1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16,16), atomMat);
      a1.position.x = -0.6;
      const a2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16,16), atomMat);
      a2.position.x = 0.6;
      h2.add(a1); h2.add(a2);
      h2.position.set(x, y, 0);
      return h2;
  };

  const mol1 = createH2(-2, 0);
  const mol2 = createH2(2, 0);
  mol2.rotation.z = Math.PI / 4;
  group.add(mol1);
  group.add(mol2);

  // VDW force indication (dotted lines)
  const points = [new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.2 });
  const line = new THREE.Line(lineGeo, lineMat);
  line.computeLineDistances();
  group.add(line);

  return {
    model: group,
    description: "Van der Waals interactions between non-polar Hydrogen (H2) molecules.",
    parts: [
      { name: "H2 Molecule 1", material: "Gas", function: "Non-polar molecule." },
      { name: "H2 Molecule 2", material: "Gas", function: "Non-polar molecule." },
      { name: "London Dispersion Force", material: "Interaction", function: "Weak temporary dipole attraction." }
    ]
  };
}""",

    "hydrogen_emission_spectrum": """import * as THREE from 'three';
export function createHydrogenEmissionSpectrum() {
  const group = new THREE.Group();
  
  // Prism/Diffraction
  const prismGeo = new THREE.CylinderGeometry(0, 1.5, 3, 3);
  const prismMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  prism.rotation.z = Math.PI / 2;
  prism.position.x = -2;
  group.add(prism);

  // Spectral lines (Balmer series)
  const lines = [
      { color: 0xff0000, pos: 1, name: "656 nm (Red)" }, // H-alpha
      { color: 0x00ffff, pos: 2, name: "486 nm (Cyan)" }, // H-beta
      { color: 0x0000ff, pos: 3, name: "434 nm (Blue)" }, // H-gamma
      { color: 0x4b0082, pos: 3.5, name: "410 nm (Violet)" } // H-delta
  ];

  lines.forEach(l => {
      const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: l.color });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.z = Math.PI / 2 - (l.pos * 0.1);
      beam.position.set(0.5, l.pos - 2, 0);
      group.add(beam);
  });

  return {
    model: group,
    description: "The emission spectrum of Hydrogen (Balmer series) created by electrons dropping to the n=2 level.",
    parts: [
      { name: "Dispersion Element", material: "Prism/Grating", function: "Splits emitted light into components." },
      { name: "H-alpha (Red)", material: "Photon (656 nm)", function: "n=3 to n=2 transition." },
      { name: "H-beta (Cyan)", material: "Photon (486 nm)", function: "n=4 to n=2 transition." },
      { name: "H-gamma (Blue)", material: "Photon (434 nm)", function: "n=5 to n=2 transition." }
    ]
  };
}""",

    "hydrogen_ion_formation": """import * as THREE from 'three';
export function createHydrogenIonFormation() {
  const group = new THREE.Group();
  
  // H atom losing electron
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  proton.position.x = -2;
  group.add(proton);

  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const electron = new THREE.Mesh(eGeo, eMat);
  group.add(electron);

  // Arrow
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 2, 0xffffff);
  group.add(arrow);

  group.userData.animate = function(delta, time, speed) {
      // Electron flies away
      electron.position.x = -1 + (time * speed) % 5;
  };

  return {
    model: group,
    description: "Formation of a Hydrogen ion (H+), which is simply a bare proton.",
    parts: [
      { name: "Proton (H+ Ion)", material: "Nucleus", function: "Remains after ionization." },
      { name: "Ejected Electron", material: "Particle", function: "Removed via ionization energy (13.6 eV)." },
      { name: "Ionization Process", material: "Action", function: "Energy absorbed causes electron escape." }
    ]
  };
}"""
}

for name, content in models.items():
    filepath = os.path.join(target_dir, f"{name}.js")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Created {len(models)} hydrogen model files.")
