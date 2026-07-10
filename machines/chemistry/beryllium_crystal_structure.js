import * as THREE from 'three';

export function createBerylliumCrystalStructure() {
  const group = new THREE.Group();
  
  // Hexagonal Close-Packed (HCP) structure for Alpha-Beryllium
  
  const atomGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const atomMat = new THREE.MeshStandardMaterial({
      color: 0x88aaff,
      metalness: 0.8,
      roughness: 0.2
  });

  const atoms = [];
  const addAtom = (x,y,z) => {
      const a = new THREE.Mesh(atomGeo, atomMat);
      a.position.set(x,y,z);
      group.add(a);
      atoms.push(a);
  };
  
  const a = 1.5; // lattice parameter a
  const c = 2.4; // lattice parameter c (HCP is usually c = 1.633a, Be is tightly packed on c-axis)

  // Bottom Hexagonal Layer
  for(let i=0; i<6; i++) {
      const angle = (Math.PI / 3) * i;
      addAtom(Math.cos(angle)*a, -c/2, Math.sin(angle)*a);
  }
  addAtom(0, -c/2, 0); // center

  // Middle Triangular Layer
  addAtom(Math.cos(0)*a*(1/Math.sqrt(3)), 0, Math.sin(0)*a*(1/Math.sqrt(3)));
  addAtom(Math.cos(Math.PI*2/3)*a*(1/Math.sqrt(3)), 0, Math.sin(Math.PI*2/3)*a*(1/Math.sqrt(3)));
  addAtom(Math.cos(Math.PI*4/3)*a*(1/Math.sqrt(3)), 0, Math.sin(Math.PI*4/3)*a*(1/Math.sqrt(3)));

  // Top Hexagonal Layer
  for(let i=0; i<6; i++) {
      const angle = (Math.PI / 3) * i;
      addAtom(Math.cos(angle)*a, c/2, Math.sin(angle)*a);
  }
  addAtom(0, c/2, 0); // center
  
  // Connective bonds to show the HCP unit cell outline
  const lineMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
  
  // Connect top hex
  for(let i=0; i<6; i++) {
      const p1 = atoms[10+i].position;
      const p2 = atoms[10+((i+1)%6)].position;
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p2]), lineMat));
  }
  // Connect bottom hex
  for(let i=0; i<6; i++) {
      const p1 = atoms[i].position;
      const p2 = atoms[(i+1)%6].position;
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p2]), lineMat));
  }
  // Connect top to bottom
  for(let i=0; i<6; i++) {
      const p1 = atoms[i].position;
      const p2 = atoms[10+i].position;
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p2]), lineMat));
  }

  group.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(5, 5, 5);
  group.add(light);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.3;
      group.rotation.x = Math.sin(time*0.5)*0.2;
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Crystal Structure": "Beryllium crystallizes in a Hexagonal Close-Packed (HCP) structure at room temperature. It has an unusually low c/a ratio, making it highly anisotropic.",
    "Allotropes": "Alpha-Beryllium (HCP) is stable up to 1250°C. Above this, it transitions to Beta-Beryllium, which has a Body-Centered Cubic (BCC) structure before melting at 1287°C.",
    "Heat Capacity": "Beryllium has the highest specific heat capacity of any metal (1825 J/(kg·K)), making it an excellent heat sink for aerospace applications.",
    "Thermal Conductivity": "It is an excellent conductor of heat (216 W/(m·K)), rivaling aluminum, despite being much lighter and stronger.",
    "Young's Modulus": "Beryllium is incredibly stiff! Its Young's modulus is 287 GPa, which is 50% higher than steel but at one-quarter of the weight."
  };

  return group;
}
