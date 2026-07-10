export function createMicroarrayScanner(THREE) {
  const group = new THREE.Group();

  // 1. Scanner Housing
  const houseGeo = new THREE.BoxGeometry(6, 3, 5);
  const houseMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.3 });
  const housing = new THREE.Mesh(houseGeo, houseMat);
  housing.position.y = 1.5;
  group.add(housing);
  housing.userData = { id: 'scanner_housing', name: 'Scanner Chassis', description: 'Light-tight enclosure preventing ambient light from ruining the scan.' };

  // 2. Microarray Slide
  const slideGeo = new THREE.BoxGeometry(2, 0.05, 4);
  const slideMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5, roughness: 0 });
  const slide = new THREE.Mesh(slideGeo, slideMat);
  slide.position.set(0, 1.6, 1);
  group.add(slide);
  slide.userData = { id: 'dna_microarray', name: 'DNA Microarray Slide', description: 'Contains tens of thousands of microscopic DNA spots (probes).' };

  // 3. DNA Spots (Grid)
  const spotsGroup = new THREE.Group();
  const spotGeo = new THREE.PlaneGeometry(0.05, 0.05);
  const cMat1 = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Cy5
  const cMat2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Cy3
  const cMat3 = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Both
  const cMat4 = new THREE.MeshBasicMaterial({ color: 0x222222 }); // None
  const mats = [cMat1, cMat2, cMat3, cMat4];
  
  for(let x=-0.8; x<=0.8; x+=0.1) {
    for(let z=-1.8; z<=1.8; z+=0.1) {
      const spot = new THREE.Mesh(spotGeo, mats[Math.floor(Math.random()*4)]);
      spot.position.set(x, 1.63, z+1);
      spot.rotation.x = -Math.PI / 2;
      spotsGroup.add(spot);
    }
  }
  group.add(spotsGroup);
  spotsGroup.children[0].userData = { id: 'probes', name: 'Oligonucleotide Probes', description: 'Each spot tests for the expression of a specific gene.' };

  // 4. Cy3 Laser (Green)
  const greenLaserGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
  const greenLaserMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
  const greenLaser = new THREE.Mesh(greenLaserGeo, greenLaserMat);
  greenLaser.position.set(-1, 2.5, -1);
  greenLaser.rotation.x = Math.PI / 4;
  group.add(greenLaser);
  greenLaser.userData = { id: 'laser_cy3', name: '532nm Green Laser', description: 'Excites the Cy3 fluorophore (typically the control sample).' };

  // 5. Cy5 Laser (Red)
  const redLaserGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
  const redLaserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
  const redLaser = new THREE.Mesh(redLaserGeo, redLaserMat);
  redLaser.position.set(1, 2.5, -1);
  redLaser.rotation.x = Math.PI / 4;
  group.add(redLaser);
  redLaser.userData = { id: 'laser_cy5', name: '633nm Red Laser', description: 'Excites the Cy5 fluorophore (typically the experimental sample).' };

  // 6. Photomultiplier Tube (PMT)
  const pmtGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
  const pmtMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const pmt = new THREE.Mesh(pmtGeo, pmtMat);
  pmt.position.set(0, 3.5, 1);
  group.add(pmt);
  pmt.userData = { id: 'pmt', name: 'Photomultiplier Tube (PMT)', description: 'Extremely sensitive light detector that converts weak fluorescence into electrical signals.' };

  // 7. Dichroic Mirror
  const mirrorGeo = new THREE.PlaneGeometry(1, 1);
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
  mirror.position.set(0, 2.5, 0.5);
  mirror.rotation.x = Math.PI / 4;
  group.add(mirror);
  mirror.userData = { id: 'dichroic_mirror', name: 'Dichroic Beamsplitter', description: 'Reflects laser light onto the slide but lets emitted fluorescent light pass up to the PMT.' };

  // 8. Scanning Stage (XY Translation)
  const stageGeo = new THREE.BoxGeometry(3, 0.2, 5);
  const stageMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const stage = new THREE.Mesh(stageGeo, stageMat);
  stage.position.set(0, 1.4, 1);
  group.add(stage);
  stage.userData = { id: 'xy_stage', name: 'Precision XY Stage', description: 'Moves the slide at micron-level precision to scan every spot.' };

  // 9. Data Output Cable
  const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const cable = new THREE.Mesh(cableGeo, cableMat);
  cable.position.set(3, 1.5, -2);
  cable.rotation.z = Math.PI / 2;
  group.add(cable);
  cable.userData = { id: 'data_cable', name: 'Data Cable', description: 'Sends millions of pixel intensities to the bioinformatics workstation.' };

  // 10. Target cDNA sample
  const dnaGeo = new THREE.TorusKnotGeometry(0.2, 0.05, 16, 8);
  const dnaMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const sample = new THREE.Mesh(dnaGeo, dnaMat);
  sample.position.set(-2, 2.5, 3);
  group.add(sample);
  sample.userData = { id: 'cdna', name: 'Fluorescent cDNA', description: 'Reverse-transcribed from mRNA extracted from the patient cells.' };

  group.userData.animate = function(delta) {
    // XY stage scanning motion
    const t = Date.now() * 0.002;
    stage.position.z = 1 + Math.sin(t) * 0.5;
    slide.position.z = 1 + Math.sin(t) * 0.5;
    spotsGroup.position.z = Math.sin(t) * 0.5;
  };

  group.userData.quiz = [
    { question: "What does a yellow spot on a two-color microarray typically mean?", options: ["The gene is mutated", "The gene is expressed equally in both normal and diseased cells", "The spot failed to hybridize"], answer: 1 },
    { question: "What is the primary purpose of a DNA Microarray?", options: ["To sequence an entire genome", "To measure the expression levels of thousands of genes simultaneously", "To edit genes"], answer: 1 }
  ];

  return group;
}
