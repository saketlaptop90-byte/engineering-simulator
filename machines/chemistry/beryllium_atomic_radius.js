import * as THREE from 'three';

export function createBerylliumAtomicRadius() {
  const group = new THREE.Group();
  
  // Visualizing the scale of 105 pm
  const shell = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 64), new THREE.MeshPhysicalMaterial({color: 0x0088ff, transparent: true, opacity: 0.3, transmission: 0.8, side: THREE.DoubleSide}));
  group.add(shell);
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);

  // Measurement tool (Ruler)
  const rulerGroup = new THREE.Group();
  const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(3,0,0)]);
  const lineMat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2});
  rulerGroup.add(new THREE.Line(lineGeo, lineMat));
  
  // End caps
  const capGeo = new THREE.BoxGeometry(0.05, 0.5, 0.5);
  const capMat = new THREE.MeshBasicMaterial({color: 0xffffff});
  const cap1 = new THREE.Mesh(capGeo, capMat); cap1.position.set(0,0,0);
  const cap2 = new THREE.Mesh(capGeo, capMat); cap2.position.set(3,0,0);
  rulerGroup.add(cap1); rulerGroup.add(cap2);
  
  // "105 pm" visual indicator (we use a pulsing box since text is hard without textures)
  const labelBox = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  labelBox.position.set(1.5, 0.4, 0);
  rulerGroup.add(labelBox);
  
  group.add(rulerGroup);

  group.userData.animate = function(delta, time) {
      shell.rotation.y += delta * 0.1;
      
      // Sweep the ruler around to show it measures the radius uniformly
      rulerGroup.rotation.y = Math.sin(time * 0.5) * Math.PI;
      
      // Pulse label
      labelBox.scale.setScalar(1 + Math.sin(time*5)*0.1);
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Orbital Filling Sequence": "Follows the Aufbau principle: 1s -> 2s. The 1s subshell fills completely with 2 electrons before the 2s subshell begins filling.",
    "Valence Electrons": "2 electrons in the outermost 2s shell. These participate in chemical bonding.",
    "Core Electrons": "2 electrons tightly bound in the 1s shell. They do not participate in bonding and strongly shield the nucleus.",
    "Atomic Radius": "105 pm (Empirical). The distance from the center of the nucleus to the boundary of the surrounding electron cloud.",
    "Ionic Radius": "45 pm (for Be2+). When Beryllium loses its 2 valence electrons, the remaining 1s shell is pulled much closer by the +4 nuclear charge, shrinking the radius dramatically."
  };

  return group;
}
