import * as THREE from 'three';

export function createBerylliumElectronProtonInteraction() {
  const group = new THREE.Group();
  
  const nucGeo = new THREE.SphereGeometry(0.3, 32, 32);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  const electronGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  
  const electrons = [];
  
  // Create force lines
  const lineMat = new THREE.LineDashedMaterial({ 
      color: 0xff00ff, 
      dashSize: 0.2, 
      gapSize: 0.1, 
      transparent: true, 
      opacity: 0.6 
  });

  for(let i=0; i<4; i++) {
      const el = new THREE.Mesh(electronGeo, electronMat);
      
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
      const line = new THREE.Line(geo, lineMat);
      
      group.add(el);
      group.add(line);
      
      electrons.push({
          mesh: el,
          line: line,
          angle1: Math.random() * Math.PI * 2,
          angle2: Math.random() * Math.PI * 2,
          radius: 2 + i*0.5,
          speed: 1 + Math.random()
      });
  }

  // Potential well grid
  const gridHelper = new THREE.PolarGridHelper(5, 16, 8, 64, 0x0000ff, 0x000044);
  gridHelper.position.y = -2;
  // Warp grid down in center to show gravity/coulomb well
  const pos = gridHelper.geometry.attributes.position;
  for(let i=0; i<pos.count; i++) {
      const x = pos.array[i*3];
      const z = pos.array[i*3+2];
      const r = Math.sqrt(x*x + z*z);
      if(r > 0.1) {
          pos.array[i*3+1] = -3 / r; // -1/r potential
      } else {
          pos.array[i*3+1] = -30;
      }
  }
  gridHelper.geometry.computeVertexNormals();
  group.add(gridHelper);

  group.userData.animate = function(delta, time) {
      electrons.forEach(e => {
          e.angle1 += delta * e.speed * 0.5;
          e.angle2 += delta * e.speed * 0.3;
          
          const x = Math.sin(e.angle1) * Math.cos(e.angle2) * e.radius;
          const y = Math.sin(e.angle1) * Math.sin(e.angle2) * e.radius;
          const z = Math.cos(e.angle1) * e.radius;
          
          e.mesh.position.set(x, y, z);
          
          // Update force line
          const positions = e.line.geometry.attributes.position.array;
          positions[3] = x;
          positions[4] = y;
          positions[5] = z;
          e.line.geometry.attributes.position.needsUpdate = true;
          e.line.computeLineDistances();
      });
      gridHelper.rotation.y += delta * 0.1;
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Atomic Mass": "9.0122 u",
    "Electronic Configuration": "1s² 2s²",
    "Quantum Information": "Describes the wave-like behavior of electrons. The 1s and 2s orbitals are spherical, but the 2s orbital has a radial node where probability drops to zero.",
    "Orbitals": "Contains fully filled 1s and 2s subshells.",
    "Probability Density (|ψ|²)": "Highest near the nucleus for 1s, with a secondary peak further out for 2s.",
    "Electron-Proton Force": "Attractive Coulomb force governs the potential well holding the 4 electrons to the nucleus (Z=4).",
    "Schrödinger Equation Relevance": "The time-independent Schrödinger equation Hψ = Eψ defines these orbital states."
  };

  return group;
}
