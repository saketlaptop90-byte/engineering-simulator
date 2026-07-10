import * as THREE from 'three';
export function createHydrogenBohrModel() {
  const group = new THREE.Group();
  
  // Nucleus
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Orbits n=1, n=2, n=3
  const orbits = [];
  for(let i=1; i<=3; i++) {
    const radius = i * 1.5;
    const orbitCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2*Math.PI, false, 0);
    const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(64)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
    orbitLine.rotation.x = Math.PI / 2;
    group.add(orbitLine);
    orbits.push({radius: radius});
  }

  // Electron
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888 }));
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      // Simulate jumping between orbits for educational purposes
      const currentN = Math.floor((time * speed * 0.5) % 3) + 1; 
      const radius = currentN * 1.5;
      const angle = time * speed * 3;
      electron.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  };

  return {
    group: group,
    description: "The Bohr Model of Hydrogen showing quantized energy levels (n=1, n=2, n=3).",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Central positive charge." },
      { name: "n=1 Orbit (Ground State)", material: "Energy Level", function: "Lowest energy state for the electron." },
      { name: "n=2 Orbit (Excited)", material: "Energy Level", function: "First excited state." },
      { name: "n=3 Orbit (Excited)", material: "Energy Level", function: "Second excited state." },
      { name: "Electron", material: "Particle", function: "Jumps between quantized orbits absorbing/emitting photons." }
    ]
  };
}
