import * as THREE from 'three';
export function createHeliumIsotopes() {
  const group = new THREE.Group();
  
  const createNucleus = (protons, neutrons, xOffset) => {
      const nGroup = new THREE.Group();
      for(let i=0; i<protons; i++){
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshStandardMaterial({color: 0xff0000}));
          p.position.set(Math.random()*0.3, Math.random()*0.3, Math.random()*0.3);
          nGroup.add(p);
      }
      for(let i=0; i<neutrons; i++){
          const n = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshStandardMaterial({color: 0xcccccc}));
          n.position.set(Math.random()*0.5 - 0.25, Math.random()*0.5 - 0.25, Math.random()*0.5 - 0.25);
          nGroup.add(n);
      }
      nGroup.position.x = xOffset;
      return nGroup;
  };

  const he3 = createNucleus(2, 1, -2);
  const he4 = createNucleus(2, 2, 2);

  group.add(he3);
  group.add(he4);

  return {
    group: group,
    description: "Helium Isotopes. Helium-4 is extremely abundant and stable, while Helium-3 (1 neutron) is rare on Earth but sought after for future nuclear fusion.",
    parts: [
      { name: "Helium-3 (Left)", material: "2 Protons, 1 Neutron", function: "Rare stable isotope, potential fusion fuel." },
      { name: "Helium-4 (Right)", material: "2 Protons, 2 Neutrons", function: "Makes up 99.9998% of natural helium. Double magic nucleus." }
    ],
    quizQuestions: [
      { question: "Why is Helium-3 considered highly valuable for future technology?", options: ["It is used to inflate balloons", "It is a potential fuel for aneutronic nuclear fusion", "It is highly radioactive", "It is the heaviest element"], correct: 1, explanation: "Helium-3 can undergo fusion with Deuterium to produce energy without releasing dangerous high-energy neutrons, making it a clean fusion fuel candidate." }
    ]
  };
}
