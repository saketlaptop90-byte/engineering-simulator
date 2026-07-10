import * as THREE from 'three';

export function createBerylliumOxidationReduction() {
  const group = new THREE.Group();
  
  // Be atom transferring electrons to an Oxidizer (e.g., Oxygen atom)
  
  const beGroup = new THREE.Group();
  const beCore = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.8}));
  beGroup.add(beCore);
  const beLabel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  beLabel.position.y = 1.5; beGroup.add(beLabel);
  beGroup.position.x = -2.5;
  group.add(beGroup);
  
  const oxGroup = new THREE.Group();
  const oxCore = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, transparent: true, opacity: 0.8}));
  oxGroup.add(oxCore);
  const oxLabel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  oxLabel.position.y = 2.0; oxGroup.add(oxLabel);
  oxGroup.position.x = 2.5;
  group.add(oxGroup);

  // Electrons moving
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(e1); group.add(e2);
  
  // Transfer track
  const trackGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.5, 0, 0), new THREE.Vector3(2.5, 0, 0)]);
  const track = new THREE.Line(trackGeo, new THREE.LineDashedMaterial({color: 0x555555, dashSize: 0.2, gapSize: 0.2}));
  track.computeLineDistances();
  group.add(track);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light = new THREE.PointLight(0xffffff, 1, 20);
  light.position.set(0, 5, 5);
  group.add(light);

  group.userData.animate = function(delta, time) {
      const t = time % 4; // 4s loop
      
      if(t < 1) {
          // Resting on Be
          e1.position.set(-2.5, 1, 0);
          e2.position.set(-2.5, -1, 0);
          beCore.material.color.setHex(0x00aaff); // Neutral Be
          oxCore.material.color.setHex(0xff0000); // Neutral O
      } else if (t < 3) {
          // Transferring (Oxidation of Be, Reduction of O)
          const prog = (t - 1) / 2; // 0 to 1
          e1.position.x = -2.5 + prog * 5;
          e1.position.y = 1 - prog; // arc down slightly
          e2.position.x = -2.5 + prog * 5;
          e2.position.y = -1 + prog; // arc up slightly
          
          // Color changes!
          // Be becomes oxidized (Be2+) -> shift color towards gold/grey
          beCore.material.color.setHex(0x00aaff).lerp(new THREE.Color(0xffaa00), prog);
          // O becomes reduced (O2-) -> shift color darker red/purple
          oxCore.material.color.setHex(0xff0000).lerp(new THREE.Color(0xaa00aa), prog);
      } else {
          // Finished transfer
          e1.position.set(2.5, 0, 1);
          e2.position.set(2.5, 0, -1);
          
          // Pulse the new ions
          beCore.scale.setScalar(1.0 + Math.sin(time*10)*0.02);
          oxCore.scale.setScalar(1.0 + Math.sin(time*10)*0.02);
      }
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Hydrogen Bonding": "While Be itself doesn't form H-bonds, [Be(H2O)4]2+ complexes have highly polarized O-H bonds that form extraordinarily strong hydrogen bonds with surrounding water.",
    "van der Waals Interactions": "Weak induced dipole-dipole interactions. Only relevant in Beryllium vapor at extreme temperatures where Be atoms interact without bonding.",
    "Dipole Interactions": "In asymmetric complexes (e.g., BeClF), differences in electronegativity create permanent dipole moments across the Beryllium atom.",
    "Ion Formation": "Be has a high ionization energy for a metal. It loses 2s electrons to form Be2+, leaving a highly charge-dense 1s core.",
    "Oxidation and Reduction": "Beryllium acts as a reducing agent (is oxidized from Be to Be2+ by losing electrons) but is less reactive than other alkaline earth metals due to a passivating oxide layer."
  };

  return group;
}
