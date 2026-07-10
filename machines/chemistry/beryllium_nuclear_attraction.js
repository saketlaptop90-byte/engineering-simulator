import * as THREE from 'three';

export function createBerylliumNuclearAttraction() {
  const group = new THREE.Group();
  
  // Specifically focusing on the strong nuclear force holding the 4 protons and 5 neutrons together
  const nucleonGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const protonMat = new THREE.MeshPhysicalMaterial({ color: 0xff0000, clearcoat: 1.0 });
  const neutronMat = new THREE.MeshPhysicalMaterial({ color: 0x0000ff, clearcoat: 1.0 });

  const nucleons = [];
  const positions = [
    [0.3, 0.3, 0.3], [-0.3, -0.3, 0.3], [0.3, -0.3, -0.3], [-0.3, 0.3, -0.3], // 4 Protons
    [0, 0, 0.4], [0, 0.4, 0], [0.4, 0, 0], [-0.4, -0.2, 0], [0, -0.4, -0.2] // 5 Neutrons
  ];
  
  positions.forEach((pos, i) => {
    const isProton = i < 4;
    const mesh = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);
    mesh.position.set(...pos);
    group.add(mesh);
    nucleons.push({ mesh, isProton, basePos: mesh.position.clone() });
  });

  // Visualize the Strong Nuclear Force as "springs" or "glue" (Gluons/Meson exchange)
  const glueMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const gluons = [];

  for(let i=0; i<nucleons.length; i++) {
      for(let j=i+1; j<nucleons.length; j++) {
          if (nucleons[i].basePos.distanceTo(nucleons[j].basePos) < 0.8) {
              const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
              const line = new THREE.Line(geo, glueMat);
              group.add(line);
              gluons.push({ n1: nucleons[i], n2: nucleons[j], line: line });
          }
      }
  }

  const light = new THREE.PointLight(0xffffff, 2, 10);
  light.position.set(2, 2, 2);
  group.add(light);
  group.add(new THREE.AmbientLight(0x404040));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      group.rotation.x += delta * 0.1;

      // Nucleons jiggle due to zero-point energy, but strong force keeps them bound
      nucleons.forEach(n => {
          n.mesh.position.copy(n.basePos);
          n.mesh.position.x += (Math.random() - 0.5) * 0.05;
          n.mesh.position.y += (Math.random() - 0.5) * 0.05;
          n.mesh.position.z += (Math.random() - 0.5) * 0.05;
      });

      gluons.forEach(g => {
          const p1 = g.n1.mesh.position;
          const p2 = g.n2.mesh.position;
          g.line.geometry.attributes.position.array[0] = p1.x;
          g.line.geometry.attributes.position.array[1] = p1.y;
          g.line.geometry.attributes.position.array[2] = p1.z;
          g.line.geometry.attributes.position.array[3] = p2.x;
          g.line.geometry.attributes.position.array[4] = p2.y;
          g.line.geometry.attributes.position.array[5] = p2.z;
          g.line.geometry.attributes.position.needsUpdate = true;
          // Pulse the glue opacity
          g.line.material.opacity = 0.5 + Math.sin(time * 10 + g.line.id) * 0.5;
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
