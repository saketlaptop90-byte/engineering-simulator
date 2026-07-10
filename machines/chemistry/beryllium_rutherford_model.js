import * as THREE from 'three';

export function createBerylliumRutherfordModel() {
  const group = new THREE.Group();
  
  // Dense, tiny nucleus
  const nucGeo = new THREE.SphereGeometry(0.2, 32, 32);
  const nucMat = new THREE.MeshPhysicalMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5 });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  // Large electron cloud volume (random orbits)
  const electronGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const electronMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  
  const electrons = [];
  for(let i=0; i<4; i++) {
      const el = new THREE.Mesh(electronGeo, electronMat);
      
      const orbitGeo = new THREE.TorusGeometry(3 + Math.random()*2, 0.005, 8, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.2 });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      tiltGroup.add(orbit);
      tiltGroup.add(el);
      group.add(tiltGroup);
      
      electrons.push({ mesh: el, radius: orbitGeo.parameters.radius, angle: Math.random()*Math.PI*2, speed: 1 + Math.random()*2 });
  }

  // Alpha particles
  const alphaGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const alphaMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const alphas = [];
  
  for(let i=0; i<20; i++) {
      const alpha = new THREE.Mesh(alphaGeo, alphaMat);
      alpha.position.set(-10, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
      group.add(alpha);
      alphas.push({ mesh: alpha, start: alpha.position.clone(), active: true, deflected: false, deflectAngle: 0 });
  }

  group.userData.animate = function(delta, time) {
      electrons.forEach(e => {
          e.angle += delta * e.speed;
          e.mesh.position.set(Math.cos(e.angle)*e.radius, Math.sin(e.angle)*e.radius, 0);
      });
      
      alphas.forEach(a => {
          if(!a.deflected) {
              a.mesh.position.x += delta * 15;
              const dist = a.mesh.position.length();
              if(dist < 0.8 && a.mesh.position.x < 0) {
                  a.deflected = true;
                  a.deflectAngle = (Math.random() > 0.5 ? 1 : -1) * (Math.PI/4 + Math.random()*Math.PI/2);
              }
              if(a.mesh.position.x > 10) a.mesh.position.copy(a.start);
          } else {
              a.mesh.position.x += Math.cos(a.deflectAngle) * delta * 15;
              a.mesh.position.y += Math.sin(a.deflectAngle) * delta * 15;
              if(a.mesh.position.length() > 10) {
                  a.deflected = false;
                  a.mesh.position.copy(a.start);
              }
          }
      });
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Atomic Mass": "9.0122 u",
    "Group": "2 (Alkaline Earth Metals)",
    "Period": "2",
    "Block": "s-block",
    "Electronic Configuration": "1s² 2s²",
    "Shell Configuration": "2, 2",
    "Valence Electrons": "2",
    "Core Electrons": "2",
    "Electronegativity": "1.57 (Pauling scale)",
    "Electron Affinity": "-50 kJ/mol (Calculated)",
    "Ionization Energies": "1st: 899.5 kJ/mol, 2nd: 1757.1 kJ/mol",
    "Atomic Radius": "105 pm",
    "Ionic Radius": "45 pm (Be2+)",
    "Density": "1.85 g/cm³",
    "Melting Point": "1560 K (1287 °C)",
    "Boiling Point": "2742 K (2469 °C)",
    "Phase": "Solid",
    "Color": "Lead-gray",
    "Magnetic Properties": "Diamagnetic",
    "Oxidation States": "+2, +1",
    "Nature": "Metallic (Alkaline Earth)",
    "Biological Importance": "Highly toxic, causes berylliosis. No known biological role.",
    "Industrial Uses": "Aerospace components, X-ray windows, beryllium-copper alloys (non-sparking tools), nuclear reactors (neutron reflector)."
  };

  return group;
}
