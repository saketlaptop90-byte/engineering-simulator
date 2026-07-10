import * as THREE from 'three';

export function createBerylliumBindingEnergy() {
  const group = new THREE.Group();
  
  // Visualize Strong Force vs Electrostatic Repulsion
  // Protons push apart (red arrows), but Strong Force (green tension lines) holds them
  
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0xff0000}));
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0xff0000}));
  p1.position.x = -0.8;
  p2.position.x = 0.8;
  group.add(p1); group.add(p2);
  
  // Neutrons mediate the force
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  n1.position.set(0, 0.8, 0);
  group.add(n1);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  n2.position.set(0, -0.8, 0);
  group.add(n2);
  
  // Repulsion arrows (red)
  const repMat = new THREE.MeshBasicMaterial({color: 0xff0000});
  const arrowL = new THREE.Group();
  arrowL.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), repMat));
  const headL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4), repMat); headL.position.y = 0.5; arrowL.add(headL);
  arrowL.rotation.z = Math.PI/2;
  arrowL.position.x = -1.5;
  group.add(arrowL);
  
  const arrowR = new THREE.Group();
  arrowR.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), repMat));
  const headR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4), repMat); headR.position.y = 0.5; arrowR.add(headR);
  arrowR.rotation.z = -Math.PI/2;
  arrowR.position.x = 1.5;
  group.add(arrowR);
  
  // Strong force tension lines (green) connecting everything
  const createTension = (v1, v2) => {
      const geo = new THREE.BufferGeometry().setFromPoints([v1, v2]);
      const mat = new THREE.LineDashedMaterial({color: 0x00ff00, dashSize: 0.1, gapSize: 0.1, linewidth: 2});
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      return line;
  };
  
  const t1 = createTension(p1.position, n1.position); group.add(t1);
  const t2 = createTension(p2.position, n1.position); group.add(t2);
  const t3 = createTension(p1.position, n2.position); group.add(t3);
  const t4 = createTension(p2.position, n2.position); group.add(t4);
  const t5 = createTension(p1.position, p2.position); group.add(t5);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      group.rotation.y = Math.sin(time*0.5)*0.5;
      
      // Protons try to push away
      const push = 0.8 + Math.sin(time*10)*0.1; // rapid vibration
      p1.position.x = -push;
      p2.position.x = push;
      
      arrowL.position.x = -push - 0.7;
      arrowR.position.x = push + 0.7;
      
      // Update tension lines to stretch!
      t1.geometry.setFromPoints([p1.position, n1.position]); t1.computeLineDistances();
      t2.geometry.setFromPoints([p2.position, n1.position]); t2.computeLineDistances();
      t3.geometry.setFromPoints([p1.position, n2.position]); t3.computeLineDistances();
      t4.geometry.setFromPoints([p2.position, n2.position]); t4.computeLineDistances();
      t5.geometry.setFromPoints([p1.position, p2.position]); t5.computeLineDistances();
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
