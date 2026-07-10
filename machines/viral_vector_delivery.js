export function createViralVectorDelivery(THREE) {
  const group = new THREE.Group();

  // 1. Adeno-Associated Virus (AAV) Capsid
  const capsidGeo = new THREE.IcosahedronGeometry(2, 1);
  const capsidMat = new THREE.MeshStandardMaterial({ color: 0x8844ff, wireframe: true });
  const capsid = new THREE.Mesh(capsidGeo, capsidMat);
  capsid.userData = { id: 'capsid', name: 'AAV Capsid Shell', description: 'Non-pathogenic viral protein shell used to sneak genes into human cells.' };
  group.add(capsid);

  // 2. Therapeutic Transgene (DNA)
  const dnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, -1, 0),
    new THREE.Vector3(0, 0, 1)
  ], true);
  const dnaGeo = new THREE.TubeGeometry(dnaCurve, 32, 0.2, 8, false);
  const dnaMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const transgene = new THREE.Mesh(dnaGeo, dnaMat);
  group.add(transgene);
  transgene.userData = { id: 'transgene', name: 'Therapeutic Transgene', description: 'A healthy copy of a gene (e.g., for hemophilia or SMA).' };

  // 3. Promoter Sequence
  const promGeo = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
  const promMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const promoter = new THREE.Mesh(promGeo, promMat);
  promoter.position.set(-1, 0, 0);
  group.add(promoter);
  promoter.userData = { id: 'promoter', name: 'Tissue-Specific Promoter', description: 'Ensures the gene only turns on in the correct organ (like the liver).' };

  // 4. Inverted Terminal Repeats (ITRs)
  const itrGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const itrMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const itr1 = new THREE.Mesh(itrGeo, itrMat);
  itr1.position.set(-1.2, 0.2, 0);
  const itr2 = new THREE.Mesh(itrGeo, itrMat);
  itr2.position.set(0, 0, 1.2);
  group.add(itr1, itr2);
  itr1.userData = { id: 'itr', name: 'Inverted Terminal Repeats (ITR)', description: 'T-shaped DNA loops capping the ends; required for viral packaging.' };

  // 5. Host Cell Membrane Receptor
  const recGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 16);
  const recMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
  const receptor = new THREE.Mesh(recGeo, recMat);
  receptor.position.set(0, -3.5, 0);
  group.add(receptor);
  receptor.userData = { id: 'receptor', name: 'Cell Surface Receptor', description: 'The "lock" that the AAV capsid "key" binds to for entry.' };

  // 6. Cell Membrane Layer
  const memGeo = new THREE.PlaneGeometry(10, 10);
  const memMat = new THREE.MeshBasicMaterial({ color: 0x002244, transparent: true, opacity: 0.5 });
  const membrane = new THREE.Mesh(memGeo, memMat);
  membrane.position.set(0, -4, 0);
  membrane.rotation.x = -Math.PI / 2;
  group.add(membrane);
  membrane.userData = { id: 'membrane', name: 'Host Cell Membrane', description: 'The boundary of the patient\'s cell.' };

  // 7. Endosome Vesicle
  const endoGeo = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI, 0, Math.PI);
  const endoMat = new THREE.MeshBasicMaterial({ color: 0xaa22ff, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
  const endosome = new THREE.Mesh(endoGeo, endoMat);
  endosome.position.set(0, -5, 0);
  endosome.rotation.x = Math.PI / 2;
  group.add(endosome);
  endosome.userData = { id: 'endosome', name: 'Endosome', description: 'A cellular bubble that swallows the virus. The virus must escape this to survive.' };

  // 8. Nuclear Pore
  const poreGeo = new THREE.TorusGeometry(1, 0.2, 16, 32);
  const poreMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const pore = new THREE.Mesh(poreGeo, poreMat);
  pore.position.set(0, -9, 0);
  pore.rotation.x = Math.PI / 2;
  group.add(pore);
  pore.userData = { id: 'nuclear_pore', name: 'Nuclear Pore', description: 'The gateway into the cell nucleus where the DNA will be deposited.' };

  // 9. Uncoating Enzyme
  const enzGeo = new THREE.SphereGeometry(0.4, 8, 8);
  const enzMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const enzyme = new THREE.Mesh(enzGeo, enzMat);
  enzyme.position.set(2, -6, 0);
  group.add(enzyme);
  enzyme.userData = { id: 'proteasome', name: 'Proteasome', description: 'Degrades the capsid, releasing the therapeutic DNA.' };

  // 10. Episomal DNA Ring (Final State)
  const epiGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 32);
  const epiMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const episome = new THREE.Mesh(epiGeo, epiMat);
  episome.position.set(0, -11, 0);
  episome.rotation.x = Math.PI / 2;
  group.add(episome);
  episome.userData = { id: 'episome', name: 'Episomal DNA', description: 'The transgene forms a stable circular ring in the nucleus without altering the host genome.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    // Virus hovering above receptor
    capsid.position.y = Math.sin(t*2) * 0.3;
    transgene.position.y = capsid.position.y;
    itr1.position.y = 0.2 + capsid.position.y;
    itr2.position.y = capsid.position.y;
    promoter.position.y = capsid.position.y;
    
    // Capsid spinning slowly
    capsid.rotation.y += 0.01;
    transgene.rotation.y += 0.01;
  };

  group.userData.quiz = [
    { question: "Why is AAV widely used in gene therapy?", options: ["It kills cancer cells", "It is non-pathogenic and doesn't integrate into the host DNA, making it safe", "It multiplies rapidly inside the body"], answer: 1 },
    { question: "What prevents the therapeutic gene from being turned on in the wrong organ?", options: ["The immune system", "A tissue-specific Promoter sequence", "The AAV capsid shell"], answer: 1 }
  ];

  return group;
}
