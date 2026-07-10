import * as THREE from 'three';
export function createBerylliumQuarksProton() {
  const group = new THREE.Group();
  
  // Zooming inside ONE of Beryllium's protons
  // Proton = 2 Up Quarks, 1 Down Quark
  
  const proton = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.2, wireframe: true}));
  group.add(proton);

  // Quarks
  const up1 = new THREE.Group();
  up1.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}))); // White/Color charge
  up1.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}))); // Label UP (+2/3)
  up1.position.set(0, 1, 0);
  
  const up2 = new THREE.Group();
  up2.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})));
  up2.position.set(-1, -0.5, 0.5);
  
  const down1 = new THREE.Group();
  down1.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0x444444}))); // Label DOWN (-1/3)
  down1.position.set(1, -0.5, -0.5);

  group.add(up1, up2, down1);

  // Springs holding them together (Strong Force)
  const createSpring = (p1, p2) => {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1.position, p2.position]), new THREE.LineBasicMaterial({color: 0xffaa00}));
      group.add(line);
      return line;
  };
  const s1 = createSpring(up1, up2);
  const s2 = createSpring(up2, down1);
  const s3 = createSpring(down1, up1);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.5;
      group.rotation.x = time * speed * 0.2;
      
      // Quarks bubbling inside
      up1.position.y = 1 + Math.sin(time*speed*5)*0.2;
      up2.position.x = -1 + Math.cos(time*speed*4)*0.2;
      down1.position.z = -0.5 + Math.sin(time*speed*6)*0.2;
      
      // Update springs
      s1.geometry.setFromPoints([up1.position, up2.position]);
      s2.geometry.setFromPoints([up2.position, down1.position]);
      s3.geometry.setFromPoints([down1.position, up1.position]);
  };

  return {
    group: group,
    description: "Quarks inside a Proton. If you zoom in 100,000 times deeper than the Beryllium atom, you reach the nucleus. If you zoom inside one of the 4 red Protons, you will find it is actually just a bag containing 3 smaller particles called Quarks! A proton is made of 2 'Up' quarks (each with a +2/3 electrical charge) and 1 'Down' quark (with a -1/3 charge). Add those up: (+2/3) + (+2/3) + (-1/3) = exactly +1! That is where the proton gets its positive charge.",
    parts: [
      { name: "White Spheres", material: "Up Quarks (+2/3)", function: "Fundamental particles of matter." },
      { name: "Grey Sphere", material: "Down Quark (-1/3)", function: "Fundamental particle of matter." },
      { name: "Orange Strings", material: "Strong Nuclear Force", function: "Gluons locking the quarks together." }
    ],
    quizQuestions: [
      { question: "What combination of Quarks makes a Proton?", options: ["3 Down Quarks", "2 Up Quarks and 1 Down Quark", "1 Up Quark and 2 Down Quarks", "Protons are not made of quarks"], correct: 1, explanation: "An Up quark is +2/3. A Down quark is -1/3. To get a total charge of +1, you must combine exactly two Up quarks and one Down quark." }
    ]
  };
}