import * as THREE from 'three';
export function createBoronBananaBond() {
  const group = new THREE.Group();
  
  // Diborane (B2H6) - The famous "Banana Bond"
  // 3-Center-2-Electron bond
  
  const atomMatB = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.6, roughness: 0.3});
  const atomMatH = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.2, roughness: 0.5});
  
  // 2 Boron atoms
  const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), atomMatB); b1.position.set(-1.5, 0, 0); group.add(b1);
  const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), atomMatB); b2.position.set(1.5, 0, 0); group.add(b2);
  
  // 4 Terminal Hydrogens (Normal covalent bonds)
  const createTerminal = (bx, by, bz, hx, hy, hz) => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), atomMatH);
      h.position.set(hx, hy, hz);
      
      const p1 = new THREE.Vector3(bx, by, bz);
      const p2 = new THREE.Vector3(hx, hy, hz);
      const dist = p1.distanceTo(p2);
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, dist, 16), new THREE.MeshBasicMaterial({color: 0x888888}));
      bond.position.copy(p1).add(p2).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
      
      group.add(h, bond);
  };
  
  createTerminal(-1.5, 0, 0, -2.5, 0, 1.2);
  createTerminal(-1.5, 0, 0, -2.5, 0, -1.2);
  createTerminal(1.5, 0, 0, 2.5, 0, 1.2);
  createTerminal(1.5, 0, 0, 2.5, 0, -1.2);

  // 2 Bridging Hydrogens (Banana Bonds!)
  const hTop = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), atomMatH); hTop.position.set(0, 1.5, 0); group.add(hTop);
  const hBot = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), atomMatH); hBot.position.set(0, -1.5, 0); group.add(hBot);

  // The Banana Bond Tubes (Electron Clouds)
  const createBanana = (ySign) => {
      const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.5, 0, 0),
          new THREE.Vector3(0, 1.5 * ySign, 0),
          new THREE.Vector3(1.5, 0, 0)
      ]);
      const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 32, 0.3, 16, false),
          new THREE.MeshPhysicalMaterial({color: 0x00ffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5, side: THREE.DoubleSide})
      );
      group.add(tube);
      
      // 2 Electrons flying inside the banana
      const eGrp = new THREE.Group();
      const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
      const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
      eGrp.add(e1, e2);
      group.add(eGrp);
      
      return {curve, e1, e2};
  };

  const topBanana = createBanana(1);
  const botBanana = createBanana(-1);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.3;
      group.rotation.x = time * speed * 0.1;
      
      const animateElectrons = (banana, offset) => {
          // Move electrons along the curve path
          const t1 = (time * speed * 0.5 + offset) % 1;
          const t2 = (time * speed * 0.5 + offset + 0.5) % 1;
          
          banana.curve.getPointAt(t1, banana.e1.position);
          banana.curve.getPointAt(t2, banana.e2.position);
          
          // Jiggle them slightly inside the tube
          banana.e1.position.z += Math.sin(time*speed*20)*0.1;
          banana.e2.position.z += Math.cos(time*speed*20)*0.1;
      };
      
      animateElectrons(topBanana, 0);
      animateElectrons(botBanana, 0.25);
  };

  return {
    group: group,
    description: "The 'Banana Bond' (3-Center-2-Electron Bond). Welcome to one of the weirdest molecules in chemistry: Diborane (B2H6). A normal chemical bond requires 2 electrons shared between 2 atoms. But Boron is 'electron-deficient'—it doesn't have enough electrons to make normal bonds with all these hydrogens! To survive, it bends the rules of physics. It creates a 'Banana Bond': a single pair of 2 electrons smeared out over 3 different atoms (Boron-Hydrogen-Boron)! Notice the glowing curved tubes connecting the top and bottom hydrogens.",
    parts: [
      { name: "Cyan/Blue Spheres", material: "Boron Atoms", function: "Desperate for electrons to complete their octet." },
      { name: "White Spheres", material: "Hydrogen Atoms", function: "Bridging the gap between the Borons." },
      { name: "Curved Glassy Tubes", material: "The Banana Bonds", function: "A quantum probability cloud where just 2 electrons are shared across 3 atoms simultaneously." }
    ],
    quizQuestions: [
      { question: "Why is the bond between the two Boron atoms and the bridging Hydrogens called a '3-Center-2-Electron' bond?", options: ["Because it has 3 electrons", "Because exactly 2 electrons are delocalized (smeared out) and shared simultaneously across 3 different atomic centers (nuclei)", "Because it forms a perfect triangle", "Because it is radioactive"], correct: 1, explanation: "Normal bonds are 2-Center-2-Electron (2 atoms sharing 2 electrons). Boron forces 3 atoms to share a single pair of electrons, creating the curved 'banana' shape." }
    ]
  };
}