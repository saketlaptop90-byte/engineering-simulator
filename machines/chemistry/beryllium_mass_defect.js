import * as THREE from 'three';

export function createBerylliumMassDefect() {
  const group = new THREE.Group();
  
  // A literal scale comparing the mass of 4 free Protons + 5 free Neutrons vs a bound Be-9 nucleus
  
  // The Scale
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 0.2, 32), new THREE.MeshStandardMaterial({color: 0x555555}));
  base.position.y = -3;
  group.add(base);
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
  pillar.position.y = -1;
  group.add(pillar);
  
  const balanceArm = new THREE.Group();
  balanceArm.position.y = 1;
  const armMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 0.5), new THREE.MeshStandardMaterial({color: 0x888888}));
  balanceArm.add(armMesh);
  group.add(balanceArm);
  
  const plateGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
  const plateMat = new THREE.MeshStandardMaterial({color: 0xdddddd});
  const leftPlate = new THREE.Mesh(plateGeo, plateMat); leftPlate.position.set(-2.8, -2, 0); group.add(leftPlate);
  const rightPlate = new THREE.Mesh(plateGeo, plateMat); rightPlate.position.set(2.8, -2, 0); group.add(rightPlate);
  
  // Connectors
  const connMat = new THREE.LineBasicMaterial({color: 0xffffff});
  const lConn = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.8, 0, 0), new THREE.Vector3(-2.8, -2, 0)]), connMat);
  const rConn = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2.8, 0, 0), new THREE.Vector3(2.8, -2, 0)]), connMat);
  balanceArm.add(lConn); balanceArm.add(rConn); // attached to arm so they tilt

  // Left side: Free Nucleons (Heavier!)
  const freeGroup = new THREE.Group();
  for(let i=0; i<9; i++) {
      const isP = i < 4;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: isP ? 0xff0000 : 0x0000ff}));
      m.position.set((Math.random()-0.5)*1.5, 0.2 + (Math.random()*0.5), (Math.random()-0.5)*1.5);
      freeGroup.add(m);
  }
  leftPlate.add(freeGroup);
  
  // Right side: Bound Be-9 Nucleus (Lighter!)
  const boundGroup = new THREE.Group();
  for(let i=0; i<9; i++) {
      const isP = i < 4;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: isP ? 0xff0000 : 0x0000ff}));
      m.position.set((Math.random()-0.5)*0.5, 0.4 + (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5);
      boundGroup.add(m);
  }
  rightPlate.add(boundGroup);

  // E=mc^2 Energy escaping from right side
  const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.5}));
  rightPlate.add(eMesh);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      group.rotation.y = Math.sin(time*0.5)*0.2;
      
      // The scale tilts to the left because free nucleons have MORE MASS
      balanceArm.rotation.z = Math.PI / 16; // tilted left
      
      // Fix plate positions based on tilt
      leftPlate.position.y = 1 + Math.sin(balanceArm.rotation.z) * -2.8 - 2;
      rightPlate.position.y = 1 + Math.sin(balanceArm.rotation.z) * 2.8 - 2;
      
      // Energy floating away from the bound nucleus
      eMesh.position.y = 0.5 + (time % 2)*2;
      eMesh.scale.setScalar(1 - ((time%2)/2));
      eMesh.material.opacity = 1 - ((time%2)/2);
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Gamma Decay": "After alpha or beta decay, the daughter nucleus is often left in an excited state. It relaxes by emitting a high-energy Gamma photon.",
    "Nuclear Fission": "While not fissile like Uranium, striking Be-9 with high-energy neutrons or alpha particles can cause it to break apart (often yielding neutrons, used as a neutron source).",
    "Nuclear Fusion": "In stars, Beryllium is formed via the Triple-Alpha process (He + He -> Be-8), though Be-8 is highly unstable and must immediately fuse with a third He to make Carbon.",
    "Binding Energy": "The strong nuclear force binds protons and neutrons together, overcoming the immense electrostatic repulsion of the protons.",
    "Mass Defect": "The mass of a Be nucleus is strictly LESS than the sum of its individual protons and neutrons. The missing mass was converted to binding energy (E=mc^2)!"
  };

  return group;
}
