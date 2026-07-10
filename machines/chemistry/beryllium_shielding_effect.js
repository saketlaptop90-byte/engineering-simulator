import * as THREE from 'three';

export function createBerylliumShieldingEffect() {
  const group = new THREE.Group();
  
  // Nucleus +4
  const nucGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  // Core Shield (1s shell)
  const shieldGeo = new THREE.SphereGeometry(2, 64, 64);
  const shieldMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x00aaff, transparent: true, opacity: 0.5, 
      transmission: 0.5, roughness: 0.2, side: THREE.DoubleSide 
  });
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  group.add(shield);
  
  // Inner core electrons
  const electronGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const core1 = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({color: 0x0000ff}));
  const core2 = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({color: 0x0000ff}));
  group.add(core1); group.add(core2);

  // Valence electrons (2s)
  const val1 = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const val2 = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({color: 0x00ffff}));
  val1.position.set(5, 0, 0);
  val2.position.set(-5, 0, 0);
  group.add(val1); group.add(val2);

  // Attractive lines from nucleus to valence
  const lineMatFull = new THREE.LineDashedMaterial({ color: 0xff0000, dashSize: 0.1, gapSize: 0.1 });
  const lineMatWeak = new THREE.LineDashedMaterial({ color: 0xffaaaa, dashSize: 0.1, gapSize: 0.1, transparent: true, opacity: 0.4 });
  
  // Create line inside shield (strong) and outside shield (weak)
  const geo1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(2,0,0)]);
  const geo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2,0,0), new THREE.Vector3(5,0,0)]);
  
  const innerLine = new THREE.Line(geo1, lineMatFull); innerLine.computeLineDistances();
  const outerLine = new THREE.Line(geo2, lineMatWeak); outerLine.computeLineDistances();
  const innerLine2 = new THREE.Line(geo1, lineMatFull); innerLine2.computeLineDistances();
  const outerLine2 = new THREE.Line(geo2, lineMatWeak); outerLine2.computeLineDistances();
  
  innerLine2.rotation.y = Math.PI; outerLine2.rotation.y = Math.PI;
  group.add(innerLine); group.add(outerLine);
  group.add(innerLine2); group.add(outerLine2);

  group.userData.animate = function(delta, time) {
      core1.position.set(Math.cos(time*2)*1.8, Math.sin(time*2)*1.8, 0);
      core2.position.set(Math.cos(time*2 + Math.PI)*1.8, Math.sin(time*2 + Math.PI)*1.8, 0);
      
      // Pulse shield to emphasize it blocking the nuclear charge
      shield.material.opacity = 0.4 + Math.sin(time * 3) * 0.1;
      
      // Rotate valence electrons slowly
      const angle = time * 0.5;
      val1.position.set(Math.cos(angle)*5, 0, Math.sin(angle)*5);
      val2.position.set(Math.cos(angle+Math.PI)*5, 0, Math.sin(angle+Math.PI)*5);
      
      innerLine.rotation.y = -angle; outerLine.rotation.y = -angle;
      innerLine2.rotation.y = -(angle + Math.PI); outerLine2.rotation.y = -(angle + Math.PI);
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Core Electrons": "2 (1s²)",
    "Valence Electrons": "2 (2s²)",
    "Shielding Effect": "The two inner 1s electrons strongly shield the two outer 2s electrons from the full +4 nuclear charge.",
    "Effective Nuclear Charge (Z_eff)": "Calculated via Slater's rules: Z_eff = Z - S ≈ 4 - 2.05 = +1.95 for the 2s valence electrons.",
    "Nuclear Attraction": "The Strong Nuclear Force binds the 4 protons and 5 neutrons (Be-9) together tightly, overcoming proton-proton electrostatic repulsion.",
    "Electron Repulsion": "Valence electrons (2s) repel each other and are repelled by the core electrons (1s)."
  };

  return group;
}
