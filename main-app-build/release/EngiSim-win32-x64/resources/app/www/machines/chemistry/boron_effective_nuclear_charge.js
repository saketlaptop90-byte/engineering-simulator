import * as THREE from 'three';
export function createBoronEffectiveNuclearCharge() {
  const group = new THREE.Group();
  
  // Z_eff = Z - S
  // For Boron: Z = 5 (protons), S = 2 (core electrons). Z_eff = +3
  
  const nucleus = new THREE.Group();
  const nucMesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000}));
  nucleus.add(nucMesh);
  
  const zText = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  zText.position.z = 0.85;
  nucleus.add(zText); // "Z = +5"
  
  group.add(nucleus);

  // Core electrons (Shield)
  const shield = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({color: 0x0044ff, transparent: true, opacity: 0.5}));
  group.add(shield);
  const sText = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  sText.position.set(2.2, 0, 0);
  group.add(sText); // "S = 2"

  // Valence electron feeling the pull
  const valE = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  valE.position.set(-4, 0, 0);
  group.add(valE);
  
  // The effective pull arrow
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(-4,0,0), 1.5, 0xff00ff, 0.5, 0.5);
  group.add(arrow);
  const zeText = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  zeText.position.set(-3, 0.5, 0);
  group.add(zeText); // "Zeff = +3"

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.5)*0.2; // Slight pan
      
      // Pulse the shield
      shield.scale.setScalar(1 + Math.sin(time*speed*3)*0.02);
      
      // Jiggle the valence electron to show it is held less tightly than it "should" be
      valE.position.y = Math.sin(time*speed*10)*0.05;
      valE.position.z = Math.cos(time*speed*12)*0.05;
  };

  return {
    group: group,
    description: "Effective Nuclear Charge (Z_eff). Boron has 5 protons (a charge of +5). You might think its outer electrons feel a pull of +5. But they don't! The 2 inner 'core' electrons act like a wall (a shield) blocking the nucleus. The 3 outer electrons look at the nucleus, but 2 of the positive charges are canceled out by the 2 negative core electrons in the way. So, the outer electrons only feel a net pull of +3. This +3 is the 'Effective Nuclear Charge'.",
    parts: [
      { name: "Red Core", material: "Nucleus (Z = 5)", function: "The raw pulling power of the 5 protons." },
      { name: "Blue Shield", material: "Core Electrons (S = 2)", function: "The 2 inner electrons blocking the view." },
      { name: "Magenta Arrow", material: "Effective Pull (Z_eff = +3)", function: "The actual magnetic force felt by the outer electrons." }
    ],
    quizQuestions: [
      { question: "If Boron has 5 protons, why do its outer electrons only feel a pull of +3?", options: ["Because 2 of the protons are broken", "Because gravity cancels them out", "Because the 2 inner 'core' electrons shield the nucleus, canceling out 2 of the positive charges", "Because it is spinning too fast"], correct: 2, explanation: "This concept (Z_eff = Z - S) explains almost every trend on the periodic table! The outer electrons are shielded by the inner electrons, so they don't feel the full force of the nucleus." }
    ]
  };
}