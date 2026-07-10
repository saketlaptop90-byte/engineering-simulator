import * as THREE from 'three';

export function createBerylliumEffectiveNuclearCharge() {
  const group = new THREE.Group();
  
  // Z=4 Nucleus Text / Core
  const nucGeo = new THREE.SphereGeometry(1, 32, 32);
  const nucMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  // Using a visual "Gauge" or "Beam" to represent Z_eff = +1.95 for valence
  const beamGeo = new THREE.CylinderGeometry(0.1, 0.5, 4, 16);
  beamGeo.translate(0, 2, 0);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.6 });
  
  const beams = [];
  for(let i=0; i<2; i++) { // For the 2 valence electrons
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.x = Math.PI / 2;
      
      const pivot = new THREE.Group();
      pivot.rotation.y = i * Math.PI;
      pivot.add(beam);
      group.add(pivot);
      
      const el = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      el.position.set(0, 0, 4);
      pivot.add(el);
      
      beams.push(pivot);
  }

  // Floating text sprite would be ideal, but we'll use a glowing aura to represent the Z_eff strength
  const auraGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const auraMat = new THREE.MeshBasicMaterial({ color: 0xff5555, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
  const aura = new THREE.Mesh(auraGeo, auraMat);
  group.add(aura);

  const light = new THREE.PointLight(0xffffff, 1, 10);
  group.add(light);

  group.userData.animate = function(delta, time) {
      beams.forEach(b => {
          b.rotation.y += delta * 0.5;
      });
      // The aura pulses representing the +1.95 effective charge felt by the electrons
      aura.scale.setScalar(1 + Math.sin(time*5)*0.05);
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
