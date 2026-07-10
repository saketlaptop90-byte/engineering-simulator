import * as THREE from 'three';
export function createBerylliumQuarksNeutron() {
  const group = new THREE.Group();
  
  // Zooming inside ONE of Beryllium's neutrons
  // Neutron = 1 Up Quark, 2 Down Quarks
  
  const neutron = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.2, wireframe: true}));
  group.add(neutron);

  // Quarks
  const up1 = new THREE.Group();
  up1.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}))); // UP (+2/3)
  up1.position.set(0, 1, 0);
  
  const down1 = new THREE.Group();
  down1.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0x444444}))); // DOWN (-1/3)
  down1.position.set(-1, -0.5, 0.5);
  
  const down2 = new THREE.Group();
  down2.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0x444444}))); // DOWN (-1/3)
  down2.position.set(1, -0.5, -0.5);

  group.add(up1, down1, down2);

  const createSpring = (p1, p2) => {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1.position, p2.position]), new THREE.LineBasicMaterial({color: 0xffaa00}));
      group.add(line);
      return line;
  };
  const s1 = createSpring(up1, down1);
  const s2 = createSpring(down1, down2);
  const s3 = createSpring(down2, up1);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = -time * speed * 0.5;
      group.rotation.x = -time * speed * 0.2;
      
      up1.position.y = 1 + Math.cos(time*speed*5)*0.2;
      down1.position.x = -1 + Math.sin(time*speed*4)*0.2;
      down2.position.z = -0.5 + Math.cos(time*speed*6)*0.2;
      
      s1.geometry.setFromPoints([up1.position, down1.position]);
      s2.geometry.setFromPoints([down1.position, down2.position]);
      s3.geometry.setFromPoints([down2.position, up1.position]);
  };

  return {
    group: group,
    description: "Quarks inside a Neutron. If you zoom inside one of Beryllium's 5 blue Neutrons, you find a different arrangement of Quarks. A neutron is made of 1 'Up' quark (+2/3 charge) and 2 'Down' quarks (each -1/3 charge). Add those up: (+2/3) + (-1/3) + (-1/3) = exactly 0! This perfectly explains why a neutron has absolutely no electrical charge.",
    parts: [
      { name: "White Sphere", material: "Up Quark (+2/3)", function: "Fundamental particle." },
      { name: "Grey Spheres", material: "Down Quarks (-1/3)", function: "Fundamental particles." },
      { name: "Total Charge", material: "Zero", function: "The math perfectly cancels out." }
    ],
    quizQuestions: [
      { question: "What combination of Quarks makes a Neutron?", options: ["2 Up, 1 Down", "3 Up Quarks", "1 Up Quark and 2 Down Quarks", "Neutrons are solid blocks of matter"], correct: 2, explanation: "To get a charge of exactly zero, you need one +2/3 quark (Up) and two -1/3 quarks (Down)." }
    ]
  };
}