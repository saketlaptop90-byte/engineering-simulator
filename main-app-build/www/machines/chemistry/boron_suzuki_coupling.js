import * as THREE from 'three';
export function createBoronSuzukiCoupling() {
  const group = new THREE.Group();
  
  // Suzuki-Miyaura Cross Coupling (Nobel Prize in Chemistry)
  
  // Central Palladium Catalyst (The Matchmaker)
  const pdMat = new THREE.MeshPhysicalMaterial({color: 0xaaaaaa, metalness: 1.0, roughness: 0.1, clearcoat: 1.0});
  const pd = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), pdMat);
  group.add(pd);
  
  // Molecule 1: Boronic Acid (R-B(OH)2)
  const boronicAcid = new THREE.Group();
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshPhysicalMaterial({color: 0x00ff00})); // Carbon chain 1
  r1.position.x = -0.8;
  const bAtom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff})); // Boron
  bAtom.position.x = 0.4;
  boronicAcid.add(r1, bAtom);
  boronicAcid.position.set(-4, 0, 0);
  group.add(boronicAcid);
  
  // Molecule 2: Organohalide (R-X)
  const halideGrp = new THREE.Group();
  const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshPhysicalMaterial({color: 0xff00ff})); // Carbon chain 2
  r2.position.x = 0.8;
  const xAtom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xffff00})); // Halogen (e.g. Bromine)
  xAtom.position.x = -0.4;
  halideGrp.add(r2, xAtom);
  halideGrp.position.set(4, 0, 0);
  group.add(halideGrp);
  
  // The product (R1-R2)
  const product = new THREE.Group();
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshPhysicalMaterial({color: 0x00ff00}));
  p1.position.x = -0.4;
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshPhysicalMaterial({color: 0xff00ff}));
  p2.position.x = 0.4;
  product.add(p1, p2);
  product.position.set(0, 4, 0);
  product.visible = false;
  group.add(product);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 0, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed * 0.8) % 5;
      
      if (cycle < 1) {
          // Reset
          boronicAcid.position.set(-4, 0, 0); boronicAcid.visible = true;
          halideGrp.position.set(4, 0, 0); halideGrp.visible = true;
          product.visible = false;
          product.position.set(0, 4, 0);
          
          pd.material.color.setHex(0xaaaaaa); // normal Pd
      } else if (cycle < 2) {
          // Oxidative Addition (Halide binds to Pd)
          const t = cycle - 1;
          halideGrp.position.x = 4 - t*3.5;
          halideGrp.rotation.y = t * Math.PI/2;
      } else if (cycle < 3) {
          // Transmetalation (Boron hands its carbon chain to Pd)
          const t = cycle - 2;
          boronicAcid.position.x = -4 + t*3.5;
          boronicAcid.rotation.y = -t * Math.PI/2;
          
          pd.material.color.setHex(0xffffaa); // Pd excited
      } else if (cycle < 4) {
          // Reductive Elimination (Pd merges the two carbon chains and kicks them out)
          const t = cycle - 3;
          boronicAcid.visible = false;
          halideGrp.visible = false;
          product.visible = true;
          
          product.position.y = t * 4; // floats up
          product.rotation.z = t * Math.PI;
          
          pd.material.color.setHex(0xaaaaaa); // Pd returns to normal
      } else {
          // Product floats away
          product.position.y = 4 + (cycle-4)*2;
      }
  };

  return {
    group: group,
    description: "Suzuki-Miyaura Cross Coupling (Nobel Prize in Chemistry, 2010). Connecting two carbon atoms together is incredibly difficult. Akira Suzuki won the Nobel Prize for discovering that if you attach Boron to one carbon (the green box) and a Halogen to another carbon (the magenta box), a Palladium atom (the silver sphere) will act as a perfect matchmaker! The Palladium grabs both boxes, snaps the Boron and Halogen off, clicks the two carbon boxes perfectly together, and releases them. This reaction revolutionized modern medicine and is used to synthesize countless life-saving drugs today!",
    parts: [
      { name: "Silver Sphere", material: "Palladium Catalyst (Pd)", function: "The chemical matchmaker that brings the molecules together." },
      { name: "Cyan/Green", material: "Boronic Acid", function: "Boron acting as a perfect 'handle' for Palladium to grab." },
      { name: "Green/Magenta Block", material: "The Final Product", function: "Two carbon frameworks successfully glued together." }
    ],
    quizQuestions: [
      { question: "Why did the Suzuki Cross Coupling reaction win a Nobel Prize?", options: ["It turns lead into gold", "It gave chemists a reliable, safe way to glue two complex Carbon frameworks together, which is essential for building complex modern medicines.", "It creates infinite energy", "It makes Boron magnetic"], correct: 1, explanation: "Before this, stitching carbon atoms together required toxic, unstable, or highly explosive chemicals. Suzuki's Boron method is safe, stable, and works in water!" }
    ]
  };
}