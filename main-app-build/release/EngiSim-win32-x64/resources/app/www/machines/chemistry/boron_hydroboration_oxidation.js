import * as THREE from 'three';
export function createHydroboration() {
  const group = new THREE.Group();
  
  // Hydroboration-Oxidation (Anti-Markovnikov addition)
  
  // Let's visualize the transition state where Borane (BH3) attacks an Alkene double bond
  
  // The Alkene (Propene)
  const cMat = new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.8, roughness: 0.2});
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8});
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const propene = new THREE.Group();
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32,32), cMat); c1.position.set(-1.5, 0, 0); // CH3
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32,32), cMat); c2.position.set(0, 0, 0);   // CH
  const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32,32), cMat); c3.position.set(1.5, 0, 0); // CH2
  propene.add(c1, c2, c3);
  
  // Single bond
  const sb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), bondMat);
  sb.position.set(-0.75, 0, 0); sb.rotation.z = Math.PI/2;
  propene.add(sb);
  
  // Double bond (Pi bond represented as two curved tubes)
  const db1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16), bondMat); db1.position.set(0.75, 0.15, 0); db1.rotation.z = Math.PI/2;
  const db2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16), bondMat); db2.position.set(0.75, -0.15, 0); db2.rotation.z = Math.PI/2;
  propene.add(db1, db2);
  group.add(propene);
  
  // The attacking Borane (BH3)
  const borane = new THREE.Group();
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff});
  const bAtom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32,32), bMat);
  bAtom.position.set(0, 0, 0);
  borane.add(bAtom);
  
  // H's on Borane
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32,32), hMat); h1.position.set(-1, -1, 0);
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32,32), hMat); h2.position.set(1, -1, 0);
  const h3 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32,32), hMat); h3.position.set(0, 1, 0); // the one transferring
  borane.add(h1, h2, h3);
  borane.position.set(0.75, 2.5, 0); // Hovering above the double bond
  group.add(borane);

  // The 4-centered cyclic transition state (Dashed lines forming)
  const tsBox = new THREE.Group();
  const dashMat = new THREE.LineDashedMaterial({color: 0x00ff00, linewidth: 2, dashSize: 0.1, gapSize: 0.1});
  
  const drawDash = (p1, p2) => {
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(geo, dashMat);
      line.computeLineDistances();
      tsBox.add(line);
  };
  
  // Boron to C3
  drawDash(new THREE.Vector3(1.5, 2.5, 0), new THREE.Vector3(1.5, 0, 0));
  // Boron's Hydrogen to C2
  drawDash(new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(0, 0, 0));
  
  group.add(tsBox);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.2)*0.4;
      group.rotation.x = Math.cos(time*speed*0.1)*0.2;
      
      // Animate Borane attacking the double bond
      const cycle = (time * speed) % 4;
      
      if (cycle < 2) {
          // Attacking
          const t = cycle / 2;
          borane.position.y = 2.5 - t * 1.5;
          tsBox.children.forEach(c => c.material.opacity = t);
      } else {
          // Resetting
          borane.position.y = 1.0;
          tsBox.children.forEach(c => c.material.opacity = 1);
      }
  };

  return {
    group: group,
    description: "Hydroboration-Oxidation (Organic Chemistry). If you want to turn a carbon double-bond into an alcohol, you use Boron! Look at the carbon chain: the left side is crowded with atoms, while the right side is open. Borane (BH3) acts like a clumsy spaceship. Because Boron is a relatively large atom, it physically cannot fit into the crowded left side (Steric Hindrance). Therefore, the Boron is FORCED to attach to the open, less-crowded right side. This is called 'Anti-Markovnikov' addition, and it gives chemists perfect control over exactly where a reaction takes place!",
    parts: [
      { name: "Black Spheres", material: "Carbon Alkene", function: "The target double bond." },
      { name: "Cyan Sphere", material: "Borane (BH3)", function: "The bulky reactant looking for an open parking spot." },
      { name: "Green Dashed Box", material: "Transition State", function: "The 4-atom square where the atoms swap partners." }
    ],
    quizQuestions: [
      { question: "Why does the Boron atom attach exclusively to the right side of the molecule in Hydroboration?", options: ["Because Boron is magnetic", "Because the left side of the molecule is too physically crowded with other atoms (Steric Hindrance), forcing the bulky Boron into the open space on the right.", "Because the left side is too hot", "Because Boron hates Carbon"], correct: 1, explanation: "In chemistry, 'Steric Hindrance' just means 'fat atoms bumping into each other'. Borane is too fat to fit in the crowded area, so it always attacks the open area!" }
    ]
  };
}