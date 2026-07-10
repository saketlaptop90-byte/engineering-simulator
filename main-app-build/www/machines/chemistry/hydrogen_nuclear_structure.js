import * as THREE from 'three';
export function createHydrogenNuclearStructure() {
  const group = new THREE.Group();
  
  // The Proton bag
  const proton = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, transparent: true, opacity: 0.2, wireframe: true}));
  group.add(proton);

  // Quarks
  const up1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00})); // Up = +2/3
  const up2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00})); // Up = +2/3
  const down = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff})); // Down = -1/3
  
  up1.position.set(0, 1, 0);
  up2.position.set(-0.8, -0.8, 0);
  down.position.set(0.8, -0.8, 0);
  group.add(up1, up2, down);

  // Gluon flux tubes (Springs connecting them)
  const createSpring = (p1, p2) => {
      const line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: 0xffff00}));
      return line;
  };
  const g1 = createSpring(); const g2 = createSpring(); const g3 = createSpring();
  group.add(g1, g2, g3);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed;
      group.rotation.x = time * speed * 0.5;
      
      // Quarks jittering (quantum confinement)
      up1.position.set(0 + Math.sin(time*speed*10)*0.2, 1 + Math.cos(time*speed*12)*0.2, 0);
      up2.position.set(-0.8 + Math.cos(time*speed*11)*0.2, -0.8 + Math.sin(time*speed*9)*0.2, 0);
      down.position.set(0.8 + Math.sin(time*speed*13)*0.2, -0.8 + Math.cos(time*speed*8)*0.2, 0);
      
      const updateSpring = (spring, v1, v2) => {
          const pts = [v1, new THREE.Vector3().lerpVectors(v1, v2, 0.5).add(new THREE.Vector3(Math.sin(time*speed*20)*0.3,0,0)), v2];
          spring.geometry.setFromPoints(pts);
      };
      updateSpring(g1, up1.position, up2.position);
      updateSpring(g2, up2.position, down.position);
      updateSpring(g3, down.position, up1.position);
  };

  return {
    group: group,
    description: "Nuclear Structure (Inside the Proton). The nucleus of a Hydrogen atom is a single proton. However, a proton is not fundamental. It is composed of three elementary particles called Quarks (two 'Up' quarks and one 'Down' quark) bound together by the Strong Nuclear Force via Gluons.",
    parts: [
      { name: "Up Quarks (Green)", material: "Fermion", function: "Each carries a fractional electric charge of +2/3." },
      { name: "Down Quark (Blue)", material: "Fermion", function: "Carries a fractional electric charge of -1/3." },
      { name: "Gluons (Yellow lines)", material: "Boson", function: "Carriers of the Strong Force, confining the quarks inside the proton." }
    ],
    quizQuestions: [
      { question: "How does the quark composition of a proton (Two Up quarks, One Down quark) equal an electric charge of +1?", options: ["The math doesn't work, it's a mystery", "Up (+2/3) + Up (+2/3) + Down (-1/3) = +3/3 = +1", "Quarks have no charge", "Up = +1, Down = 0"], correct: 1, explanation: "Elementary quarks have fractional electric charges. Two Up quarks (+2/3 each) and one Down quark (-1/3) perfectly sum up to a net charge of +1." }
    ]
  };
}