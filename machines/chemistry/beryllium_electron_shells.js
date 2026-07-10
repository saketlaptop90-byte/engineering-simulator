import * as THREE from 'three';

export function createBerylliumElectronShells() {
  const group = new THREE.Group();
  
  const nucGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  group.add(new THREE.Mesh(nucGeo, nucMat));

  // Solid translucent spheres for n=1 and n=2 shells
  const shellMat1 = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false });
  const shellMat2 = new THREE.MeshPhysicalMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });

  const shell1 = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), shellMat1);
  const shell2 = new THREE.Mesh(new THREE.SphereGeometry(4, 64, 64), shellMat2);
  
  group.add(shell1);
  group.add(shell2);

  // Add grid lines on the shells for better 3D depth perception
  const wire1 = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00aaff, wireframe: true, transparent: true, opacity: 0.1}));
  const wire2 = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffaa, wireframe: true, transparent: true, opacity: 0.05}));
  group.add(wire1);
  group.add(wire2);

  const elGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const elMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  const electrons = [
      { mesh: new THREE.Mesh(elGeo, elMat), radius: 2, angle: 0, tilt: 0, speed: 1.5 },
      { mesh: new THREE.Mesh(elGeo, elMat), radius: 2, angle: Math.PI, tilt: Math.PI/2, speed: 1.5 },
      { mesh: new THREE.Mesh(elGeo, elMat), radius: 4, angle: 0, tilt: Math.PI/4, speed: 0.8 },
      { mesh: new THREE.Mesh(elGeo, elMat), radius: 4, angle: Math.PI, tilt: -Math.PI/4, speed: 0.8 }
  ];

  electrons.forEach(e => {
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.x = e.tilt;
      orbitGroup.add(e.mesh);
      group.add(orbitGroup);
      e.orbitGroup = orbitGroup;
  });

  group.userData.animate = function(delta, time) {
      shell1.rotation.y += delta * 0.1;
      shell2.rotation.y -= delta * 0.05;
      wire1.rotation.y += delta * 0.1;
      wire2.rotation.y -= delta * 0.05;

      electrons.forEach(e => {
          e.angle += delta * e.speed;
          e.mesh.position.set(Math.cos(e.angle)*e.radius, 0, Math.sin(e.angle)*e.radius);
      });
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
