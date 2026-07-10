import * as THREE from 'three';
export function createHeliumArcWelding() {
  const group = new THREE.Group();
  
  // Welding Torch
  const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), new THREE.MeshStandardMaterial({color: 0x333333}));
  torch.rotation.z = Math.PI / 4;
  torch.position.set(-1, 2, 0);
  group.add(torch);

  // Arc
  const arc = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), new THREE.MeshBasicMaterial({color: 0xffffff}));
  arc.position.set(0, 0.5, 0);
  group.add(arc);

  // Helium Shielding Gas
  const gas = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, transmission: 0.5}));
  gas.position.set(0, 1, 0);
  group.add(gas);

  // Metal plates
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 2), new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness:0.8}));
  p1.position.set(-2, 0, 0);
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 2), new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness:0.8}));
  p2.position.set(2, 0, 0);
  group.add(p1); group.add(p2);

  group.userData.animate = function(delta, time, speed) {
      // Arc flickering
      arc.material.opacity = 0.5 + Math.random() * 0.5;
      arc.material.transparent = true;
      gas.scale.set(1 + Math.sin(time*speed*10)*0.05, 1, 1 + Math.cos(time*speed*10)*0.05);
  };

  return {
    group: group,
    description: "TIG Welding Shielding Gas. Helium (often mixed with Argon) is used as a shielding gas in arc welding. Because it is completely unreactive, it protects the molten weld pool from oxygen and nitrogen in the atmosphere.",
    parts: [
      { name: "Tungsten Electrode / Arc", material: "Plasma", function: "Generates the heat to melt the metal." },
      { name: "Helium Shield", material: "Inert Gas Cloud", function: "Pushes atmospheric gases away, preventing oxidation and porosity in the weld." }
    ],
    quizQuestions: [
      { question: "Why is Helium used as a shielding gas in arc welding?", options: ["It is highly flammable, adding heat to the weld", "It is inert, preventing oxygen and nitrogen from reacting with the molten metal", "It acts as a flux to clean the metal", "It changes the color of the metal"], correct: 1, explanation: "Helium is chemically inert, meaning it will not react with the hot, molten metal. It forms a protective barrier displacing reactive atmospheric gases like Oxygen." }
    ]
  };
}
