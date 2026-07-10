import * as THREE from 'three';
export function createBeryllium10() {
  const group = new THREE.Group();
  
  // Be-10: 4 Protons, 6 Neutrons (Radioactive, used for dating)
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
  
  // 6 Neutrons (Blue) - TOO MANY
  nucleus.add(createNuc(0x0000ff, 0, 0.4, 0));
  nucleus.add(createNuc(0x0000ff, 0.4, 0, 0));
  nucleus.add(createNuc(0x0000ff, 0, -0.4, 0));
  nucleus.add(createNuc(0x0000ff, -0.4, 0, 0));
  nucleus.add(createNuc(0x0000ff, 0, 0, 0.4));
  nucleus.add(createNuc(0x0000ff, 0, 0, -0.4));
  
  group.add(nucleus);
  
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 16), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(cloud);

  // Swelling/pulsing
  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Pulse to show instability from being too bloated
      nucleus.scale.setScalar(1 + Math.sin(time*speed*3)*0.05);
  };

  return {
    group: group,
    description: "Beryllium-10 (Isotope). Be-10 has 4 Protons and 6 Neutrons. Now we have the opposite problem from Be-7: there are TOO MANY neutrons! The nucleus is bloated and unstable. However, it takes a long time to decay. Its half-life is 1.39 million years. Because of this, scientists use Be-10 found in ice cores to measure what the Earth's climate and solar activity were like millions of years ago!",
    parts: [
      { name: "4 Red Spheres", material: "Protons", function: "Provides the +4 charge." },
      { name: "6 Blue Spheres", material: "Neutrons", function: "Too much nuclear glue, causing bloat." },
      { name: "Pulsing", material: "Instability", function: "Slowly preparing to decay over 1.39 million years." }
    ],
    quizQuestions: [
      { question: "What is the primary scientific use of the Beryllium-10 isotope on Earth?", options: ["Making bombs", "As a radioactive 'clock' in ice cores to measure solar activity and climate from millions of years ago", "Making airplanes", "Curing cancer"], correct: 1, explanation: "Because Be-10 is created in the atmosphere by cosmic rays and has a very long half-life, it slowly rains down and gets trapped in ice. By measuring it, we can see how much solar radiation hit Earth millions of years ago." }
    ]
  };
}