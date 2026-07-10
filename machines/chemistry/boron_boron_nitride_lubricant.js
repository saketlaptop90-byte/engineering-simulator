import * as THREE from 'three';
export function createBNLubricant() {
  const group = new THREE.Group();
  
  // Hexagonal Boron Nitride (h-BN) - "White Graphite" dry lubricant
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.5, roughness: 0.2}); // Nitrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff});
  
  const createSheet = (yOffset) => {
      const sheet = new THREE.Group();
      const atoms = [];
      const hexRadius = 1.0;
      
      for(let q=-2; q<=2; q++) {
          for(let r=-2; r<=2; r++) {
              if (Math.abs(q+r) > 2) continue;
              
              const cx = 1.5 * hexRadius * q;
              const cz = Math.sqrt(3) * hexRadius * (r + q/2);
              
              for(let i=0; i<6; i++) {
                  const angle = Math.PI / 3 * i;
                  const x = cx + Math.cos(angle)*hexRadius*0.577;
                  const z = cz + Math.sin(angle)*hexRadius*0.577;
                  
                  let duplicate = false;
                  atoms.forEach(a => { if(a.pos.distanceTo(new THREE.Vector3(x,0,z)) < 0.1) duplicate = true; });
                  if(duplicate) continue;
                  
                  const pos = new THREE.Vector3(x, yOffset, z);
                  const isBoron = (i % 2 === 0); // Alternate B and N
                  atoms.push({pos, isBoron});
                  
                  const atom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), isBoron ? bMat : nMat);
                  atom.position.copy(pos);
                  sheet.add(atom);
              }
          }
      }
      
      for(let i=0; i<atoms.length; i++) {
          for(let j=i+1; j<atoms.length; j++) {
              const dist = atoms[i].pos.distanceTo(atoms[j].pos);
              if (dist < 0.7) {
                  const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
                  bond.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
                  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
                  sheet.add(bond);
              }
          }
      }
      return sheet;
  };
  
  const topSheet = createSheet(0.8);
  const midSheet = createSheet(0);
  const botSheet = createSheet(-0.8);
  
  group.add(topSheet, midSheet, botSheet);
  
  // Two heavy metal blocks compressing them (The engine parts)
  const metalMat = new THREE.MeshPhysicalMaterial({color: 0x888888, metalness: 1.0, roughness: 0.3});
  const topGear = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), metalMat); topGear.position.y = 2; group.add(topGear);
  const botGear = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), metalMat); botGear.position.y = -2; group.add(botGear);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.2;
      group.rotation.z = Math.sin(time*speed*0.1)*0.1;
      
      // Simulate extreme sliding friction
      const slide = Math.sin(time * speed * 2) * 1.5;
      
      // The metal blocks move aggressively
      topGear.position.x = slide;
      botGear.position.x = -slide;
      
      // The h-BN sheets effortlessly slide over each other to absorb the friction
      topSheet.position.x = slide * 0.8;
      midSheet.position.x = slide * 0.2;
      botSheet.position.x = -slide * 0.5;
      
      // Heat generation (blocks get red hot, but h-BN doesn't care)
      topGear.material.color.setHex(0x888888).lerp(new THREE.Color(0xff4400), Math.abs(slide)/1.5);
      botGear.material.color.setHex(0x888888).lerp(new THREE.Color(0xff4400), Math.abs(slide)/1.5);
  };

  return {
    group: group,
    description: "Hexagonal Boron Nitride (h-BN) Dry Lubricant. Known in the industry as 'White Graphite'. Just like Carbon forms flat sheets of graphene, alternating Boron and Nitrogen atoms form perfect flat hexagonal sheets! In an engine or a spacecraft, if two metal gears grind against each other without oil, they will seize up and melt. But oil burns up at extreme temperatures. So, aerospace engineers pack the gears with h-BN powder. The impossibly smooth sheets effortlessly slide over each other, absorbing all the friction without catching fire, even at 1000°C!",
    parts: [
      { name: "Cyan/Blue Honeycomb", material: "h-BN Sheets", function: "Perfectly flat layers with zero chemical bonds between them, allowing them to slide freely." },
      { name: "Heavy Grey Blocks", material: "Metal Machinery", function: "Grinding together under extreme pressure and heat." }
    ],
    quizQuestions: [
      { question: "Why is Hexagonal Boron Nitride (h-BN) used as a lubricant in space shuttles instead of normal oil?", options: ["Because it smells better", "Because oil evaporates in a vacuum and burns at high temperatures. h-BN is a solid dry powder that survives extreme heat and space vacuums while providing flawless lubrication.", "Because it is liquid at absolute zero", "Because Boron is very heavy"], correct: 1, explanation: "Normal lubricants fail in extreme environments. Solid lubricants like h-BN rely on their sliding crystal lattice to reduce friction!" }
    ]
  };
}