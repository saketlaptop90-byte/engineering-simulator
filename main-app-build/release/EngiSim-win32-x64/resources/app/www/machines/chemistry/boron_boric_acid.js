import * as THREE from 'three';
export function createBoronBoricAcid() {
  const group = new THREE.Group();
  
  // Boric Acid (H3BO3) - Flat sheets held by hydrogen bonds
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.5}); // Oxygen
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const createMolecule = (x, y, z, rotationY) => {
      const mol = new THREE.Group();
      
      // Central Boron (Trigonal Planar)
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), bMat);
      mol.add(b);
      
      const os = [];
      const hs = [];
      
      for(let i=0; i<3; i++) {
          const angle = i * Math.PI * 2 / 3;
          
          // Oxygen
          const o = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), oMat);
          const oPos = new THREE.Vector3(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5);
          o.position.copy(oPos);
          mol.add(o);
          os.push(oPos);
          
          // B-O Bond
          const boBond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), bondMat);
          boBond.position.copy(oPos).multiplyScalar(0.5);
          boBond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), oPos.clone().normalize());
          mol.add(boBond);
          
          // Hydrogen (Bent geometry off oxygen)
          const hAngle = angle + 0.5; // Bend
          const h = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), hMat);
          const hPos = new THREE.Vector3(oPos.x + Math.cos(hAngle)*1, 0, oPos.z + Math.sin(hAngle)*1);
          h.position.copy(hPos);
          mol.add(h);
          hs.push(hPos);
          
          // O-H Bond
          const ohDist = oPos.distanceTo(hPos);
          const ohBond = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, ohDist, 16), bondMat);
          ohBond.position.copy(oPos).add(hPos).multiplyScalar(0.5);
          ohBond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), hPos.clone().sub(oPos).normalize());
          mol.add(ohBond);
      }
      
      mol.position.set(x, y, z);
      mol.rotation.y = rotationY;
      return {grp: mol, os, hs};
  };
  
  const m1 = createMolecule(0, 0, 0, 0);
  const m2 = createMolecule(4, 0, 0, Math.PI); // flipped to interlock
  group.add(m1.grp, m2.grp);
  
  // Hydrogen bonds (dashed lines)
  const hBondMat = new THREE.LineDashedMaterial({
      color: 0x00ff00,
      linewidth: 2,
      scale: 1,
      dashSize: 0.2,
      gapSize: 0.2,
  });
  
  // Draw an H-bond from m1's Hydrogen to m2's Oxygen
  const p1 = new THREE.Vector3().copy(m1.hs[0]);
  const p2 = new THREE.Vector3().copy(m2.os[1]).add(new THREE.Vector3(4,0,0)); // adjust for m2's world pos
  p2.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI); // apply m2's rotation to the point? No, m2.os is local.
  
  // Let's do it simply by world coords
  const m2WorldOs = m2.os.map(o => o.clone().applyEuler(new THREE.Euler(0, Math.PI, 0)).add(new THREE.Vector3(4,0,0)));
  const m2WorldHs = m2.hs.map(h => h.clone().applyEuler(new THREE.Euler(0, Math.PI, 0)).add(new THREE.Vector3(4,0,0)));
  
  const drawHBond = (start, end) => {
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const line = new THREE.Line(geo, hBondMat);
      line.computeLineDistances();
      group.add(line);
      return line;
  };
  
  drawHBond(m1.hs[0], m2WorldOs[1]);
  drawHBond(m2WorldHs[1], m1.os[0]);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.2)*0.2;
      group.rotation.x = 0.5 + Math.sin(time*speed*0.1)*0.1;
  };

  return {
    group: group,
    description: "Boric Acid (H3BO3). Boric acid is a common antiseptic, insecticide, and neutron absorber in nuclear power plants! Notice how the molecule is perfectly flat (Trigonal Planar). In solid form, millions of these flat molecules stack together into massive sheets. The sheets are held together by 'Hydrogen Bonds' (the dashed green lines), where the positive hydrogen of one molecule is magnetically attracted to the negative oxygen of another molecule. This layered sheet structure makes Boric acid incredibly slippery, which is why it is used as a dry lubricant!",
    parts: [
      { name: "Cyan Sphere", material: "Boron Atom", function: "The central hub." },
      { name: "White/Red Ends", material: "Hydroxyl Groups (OH)", function: "Highly polar edges." },
      { name: "Dashed Green Lines", material: "Hydrogen Bonds", function: "Weak magnetic attractions holding the flat molecules together like sheets of paper." }
    ],
    quizQuestions: [
      { question: "Why is solid Boric Acid extremely slippery?", options: ["Because it is wet", "Because it forms flat 2D sheets held together by weak hydrogen bonds. These sheets easily slide and slip past each other when you touch them.", "Because it destroys your skin", "Because it is spherical"], correct: 1, explanation: "Just like Graphite (pencil lead), Boric acid's flat sheet structure makes it an excellent dry lubricant!" }
    ]
  };
}