import * as THREE from 'three';
export function createBeryllium7() {
  const group = new THREE.Group();
  
  // Be-7: 4 Protons, 3 Neutrons (Highly unstable)
  const nucleus = new THREE.Group();
  const createNuc = (c, x, y, z) => {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: c}));
      p.position.set(x, y, z);
      return p;
  };
  
  // 4 Protons (Red)
  nucleus.add(createNuc(0xff0000, 0.2, 0.2, 0.2));
  nucleus.add(createNuc(0xff0000, -0.2, -0.2, 0.2));
  nucleus.add(createNuc(0xff0000, 0.2, -0.2, -0.2));
  nucleus.add(createNuc(0xff0000, -0.2, 0.2, -0.2));
  
  // 3 Neutrons (Blue) - ONE MISSING!
  nucleus.add(createNuc(0x0000ff, 0, 0.4, 0));
  nucleus.add(createNuc(0x0000ff, 0.4, 0, 0));
  nucleus.add(createNuc(0x0000ff, 0, -0.4, 0));
  
  group.add(nucleus);
  
  // Electron cloud
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 16), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(cloud);

  // Unstable shaking
  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      // Violent shaking because it is unstable
      nucleus.position.x = (Math.random()-0.5)*0.1 * speed;
      nucleus.position.y = (Math.random()-0.5)*0.1 * speed;
  };

  return {
    group: group,
    description: "Beryllium-7 (Isotope). Isotopes are versions of an element with different numbers of neutrons. The '7' means 7 total particles in the nucleus (4 Protons + 3 Neutrons). This isotope is highly unstable (radioactive). Without a 4th neutron acting as 'glue', the 4 positive protons repel each other too strongly. Be-7 has a half-life of 53 days before it undergoes radioactive decay.",
    parts: [
      { name: "4 Red Spheres", material: "Protons", function: "Defines the atom as Beryllium (+4)." },
      { name: "3 Blue Spheres", material: "Neutrons", function: "Not enough nuclear glue." },
      { name: "Violent Shaking", material: "Instability", function: "The strong nuclear force struggling to hold the repelling protons together." }
    ],
    quizQuestions: [
      { question: "Why is Beryllium-7 radioactive (unstable)?", options: ["Because it has too many electrons", "Because it is missing a neutron, meaning there isn't enough Strong Nuclear Force to overcome the electromagnetic repulsion of the 4 protons", "Because it is too hot", "Because it's a gas"], correct: 1, explanation: "Protons hate each other. Neutrons act as the 'glue' (providing Strong Nuclear Force without adding electrical repulsion). Without enough neutrons, the nucleus eventually rips itself apart." }
    ]
  };
}