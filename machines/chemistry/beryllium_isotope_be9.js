import * as THREE from 'three';
export function createBeryllium9() {
  const group = new THREE.Group();
  
  // Be-9: 4 Protons, 5 Neutrons (The ONLY stable isotope)
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
  
  // 5 Neutrons (Blue)
  nucleus.add(createNuc(0x0000ff, 0, 0.4, 0));
  nucleus.add(createNuc(0x0000ff, 0.4, 0, 0));
  nucleus.add(createNuc(0x0000ff, 0, -0.4, 0));
  nucleus.add(createNuc(0x0000ff, -0.4, 0, 0));
  nucleus.add(createNuc(0x0000ff, 0, 0, 0.4));
  
  group.add(nucleus);
  
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 16), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(cloud);

  // Perfectly calm and stable
  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.1;
  };

  return {
    group: group,
    description: "Beryllium-9 (Isotope). This is Beryllium's ONLY stable isotope. It makes up 100% of all naturally occurring Beryllium on Earth. It has 4 Protons and exactly 5 Neutrons. This specific ratio provides the perfect amount of Strong Nuclear Force to perfectly balance the electromagnetic repulsion of the protons. It will remain stable forever.",
    parts: [
      { name: "4 Red Spheres", material: "Protons", function: "Provides the +4 charge." },
      { name: "5 Blue Spheres", material: "Neutrons", function: "The perfect amount of nuclear glue." },
      { name: "Calm Rotation", material: "Stability", function: "It is not radioactive." }
    ],
    quizQuestions: [
      { question: "If you dig up a chunk of Beryllium from the Earth, what percentage of it will be the Beryllium-9 isotope?", options: ["50%", "25%", "100%", "0%"], correct: 2, explanation: "Beryllium-9 is the only stable isotope of Beryllium. Any other isotopes created in stars decayed away billions of years ago. 100% of natural Beryllium is Be-9." }
    ]
  };
}