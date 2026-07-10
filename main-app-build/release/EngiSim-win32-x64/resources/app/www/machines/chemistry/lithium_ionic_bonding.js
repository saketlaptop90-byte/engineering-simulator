import * as THREE from 'three';
export function createLithiumIonicBonding() {
  const group = new THREE.Group();
  
  // Ionic Bonding (Li + F -> LiF) (Remastered)
  
  // Lithium Atom (Left)
  const li = new THREE.Group();
  const liNuc = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  const liShell = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.2}));
  li.add(liNuc, liShell);
  li.position.x = -4;
  group.add(li);
  
  // Fluorine Atom (Right)
  const f = new THREE.Group();
  const fNuc = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshPhysicalMaterial({color: 0x0000ff}));
  const fShell = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.2}));
  f.add(fNuc, fShell);
  f.position.x = 4;
  group.add(f);
  
  // The Valence Electron being transferred
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e);
  
  // Electrostatic lightning/force field
  const lightning = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 5, 16),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5, wireframe: true})
  );
  lightning.rotation.z = Math.PI/2;
  lightning.visible = false;
  group.add(lightning);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      const cycle = (time * speed * 0.5) % 6;
      
      if (cycle < 2) {
          // Pre-transfer: Electron orbits Li
          liShell.material.color.setHex(0xff00ff);
          fShell.material.color.setHex(0x00ffff);
          lightning.visible = false;
          
          li.position.x = -4;
          f.position.x = 4;
          
          e.position.set(-4 + Math.cos(time*speed*5)*2.5, Math.sin(time*speed*5)*2.5, 0);
          
      } else if (cycle < 3) {
          // Transfer! Electron flies from Li to F
          const t = cycle - 2; // 0 to 1
          const startX = -4 + Math.cos(time*speed*5)*2.5;
          const startY = Math.sin(time*speed*5)*2.5;
          
          const targetX = 4;
          const targetY = 3; // roughly F's shell radius
          
          e.position.x = THREE.MathUtils.lerp(startX, targetX, t);
          e.position.y = THREE.MathUtils.lerp(startY, targetY, t);
          
      } else {
          // Post-transfer: Electrostatic attraction!
          // Li is now positive (red), F is negative (blue)
          liShell.material.color.setHex(0xff0000);
          fShell.material.color.setHex(0x0000ff);
          
          // Electron orbits F
          e.position.set(4 + Math.cos(time*speed*5)*3, Math.sin(time*speed*5)*3, 0);
          
          // They pull together due to opposite charges
          li.position.x = -3.5 + Math.sin(time*speed*5)*0.1;
          f.position.x = 3.5 - Math.sin(time*speed*5)*0.1;
          
          lightning.visible = true;
          lightning.scale.set(1 + Math.random()*0.2, 1, 1 + Math.random()*0.2);
      }
  };

  return {
    group: group,
    description: "Ionic Bonding (Remastered). When Lithium meets an extremely greedy non-metal like Fluorine, they don't share nicely! Because Fluorine's nucleus is highly attractive, it completely RIPS the valence electron away from Lithium. This total transfer of an electron is called an 'Ionic Bond'. Without its negative electron, Lithium becomes a positive cation (Li+). With an extra negative electron, Fluorine becomes a negative anion (F-). Because opposites attract, the two resulting ions slam together like powerful magnets, forming an incredibly strong crystalline bond (like table salt) held together by pure electrostatic force!",
    parts: [
      { name: "White Sphere", material: "Valence Electron", function: "Completely transferred from Lithium to Fluorine." },
      { name: "Red Shell", material: "Li+ Cation", function: "Becomes positive after losing the electron." },
      { name: "Blue Shell", material: "F- Anion", function: "Becomes negative after gaining the electron." },
      { name: "Glowing Cylinder", material: "Electrostatic Attraction", function: "The magnetic-like pull that binds the positive and negative ions together." }
    ],
    quizQuestions: [
      { question: "What defines an Ionic Bond?", options: ["Equal sharing of electrons", "The complete transfer of one or more valence electrons from one atom to another, resulting in oppositely charged ions that attract.", "A sea of free-flowing electrons", "Protons merging"], correct: 1, explanation: "Ionic bonds are formed through pure, brutal theft! One atom steals the electron, resulting in opposite magnetic charges that lock them together." }
    ]
  };
}