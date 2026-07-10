import * as THREE from 'three';
export function createHeliumStellarNucleosynthesis() {
  const group = new THREE.Group();
  
  // Representing mass fraction of universe: 75% H, 24% He, 1% Metals
  const pie = new THREE.Group();
  
  const createSlice = (start, length, color, radius) => {
      const geo = new THREE.CylinderGeometry(radius, radius, 0.5, 32, 1, false, start, length);
      return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color: color}));
  };

  const hSlice = createSlice(0, Math.PI * 2 * 0.75, 0x4444ff, 3);
  const heSlice = createSlice(Math.PI * 2 * 0.75, Math.PI * 2 * 0.24, 0x00ffff, 3.1); // slightly popped out
  const metalSlice = createSlice(Math.PI * 2 * 0.99, Math.PI * 2 * 0.01, 0xaaaaaa, 3);
  
  pie.add(hSlice, heSlice, metalSlice);
  pie.rotation.x = -Math.PI / 4;
  group.add(pie);

  return {
    group: group,
    description: "Cosmic Abundance. Helium is the second most abundant element in the observable universe, accounting for roughly 24% of all elemental mass, most of which was created during the Big Bang.",
    parts: [
      { name: "Hydrogen (~75%)", material: "Blue Slice", function: "Primary cosmic element." },
      { name: "Helium (~24%)", material: "Cyan Slice", function: "Created primarily in the first 3 minutes of the universe (Big Bang Nucleosynthesis)." },
      { name: "Heavy Elements (~1%)", material: "Grey Slice", function: "Everything heavier than Helium." }
    ],
    quizQuestions: [
      { question: "When was the vast majority of the Helium in the universe created?", options: ["In modern stars over the last billion years", "During the Big Bang nucleosynthesis, in the first 3 minutes of the universe", "Inside black holes", "By radioactive decay in planets"], correct: 1, explanation: "While stars do fuse Hydrogen into Helium, roughly 75% of the Helium present today was formed during the initial hot phase of the Big Bang, just minutes after the universe began." }
    ]
  };
}
