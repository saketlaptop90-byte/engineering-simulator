export function createSchrodingerCat(THREE) {
  const group = new THREE.Group();

  // 1. The Box (Transparent for visualization)
  const boxGeo = new THREE.BoxGeometry(6, 4, 4);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x885533, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const box = new THREE.Mesh(boxGeo, boxMat);
  group.add(box);
  box.userData = { id: 'steel_box', name: 'Opaque Steel Chamber', description: 'Isolates the quantum system from the environment (no observation).' };

  // 2. Radioactive Atom (The Quantum Superposition source)
  const atomGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const atomMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
  const atom = new THREE.Mesh(atomGeo, atomMat);
  atom.position.set(-2, -1, -1);
  group.add(atom);
  atom.userData = { id: 'radioactive_atom', name: 'Radioactive Atom', description: 'Has a 50/50 chance of decaying in an hour. Before measurement, it is in a superposition of Decayed AND Not Decayed.' };

  // 3. Geiger Counter
  const geigerGeo = new THREE.BoxGeometry(1, 0.5, 0.5);
  const geigerMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const geiger = new THREE.Mesh(geigerGeo, geigerMat);
  geiger.position.set(-1, -1, -1);
  group.add(geiger);
  geiger.userData = { id: 'geiger_counter', name: 'Geiger Counter', description: 'Detects if the atom decays.' };

  // 4. Relay Mechanism / Hammer
  const relayGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
  const relayMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const hammer = new THREE.Mesh(relayGeo, relayMat);
  hammer.position.set(0, -0.5, -1);
  hammer.rotation.z = Math.PI / 4;
  group.add(hammer);
  hammer.userData = { id: 'hammer_relay', name: 'Hammer Relay', description: 'Triggered by the Geiger counter to smash the flask.' };

  // 5. Poison Flask (Hydrocyanic Acid)
  const flaskGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 16);
  const flaskMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
  const flask = new THREE.Mesh(flaskGeo, flaskMat);
  flask.position.set(1, -1.1, -1);
  group.add(flask);
  flask.userData = { id: 'poison_flask', name: 'Flask of Poison', description: 'Released if the hammer strikes.' };

  // 6. The Cat (Superposition Representation)
  
  // Alive Cat (Yellow/Orange)
  const aliveCatGeo = new THREE.BoxGeometry(1.5, 1, 0.8);
  const aliveCatMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 0.5 });
  const aliveCat = new THREE.Mesh(aliveCatGeo, aliveCatMat);
  aliveCat.position.set(1, -1, 1);
  group.add(aliveCat);
  aliveCat.userData = { id: 'cat_alive', name: 'Cat (|Alive>)', description: 'State of the cat if no decay occurs.' };

  // Dead Cat (Grey/Lying down)
  const deadCatGeo = new THREE.BoxGeometry(1.5, 0.5, 1);
  const deadCatMat = new THREE.MeshStandardMaterial({ color: 0x666666, transparent: true, opacity: 0.5 });
  const deadCat = new THREE.Mesh(deadCatGeo, deadCatMat);
  deadCat.position.set(1, -1.25, 1);
  group.add(deadCat);
  deadCat.userData = { id: 'cat_dead', name: 'Cat (|Dead>)', description: 'State of the cat if decay occurs.' };

  // 7. Observer's Eye (Measurement)
  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(0, 0, 5);
  group.add(eyeGroup);
  
  const scleraGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const scleraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sclera = new THREE.Mesh(scleraGeo, scleraMat);
  eyeGroup.add(sclera);
  
  const pupilGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  pupil.position.set(0, 0, 0.4);
  eyeGroup.add(pupil);
  eyeGroup.userData = { id: 'observer', name: 'The Observer', description: 'Looking inside the box forces the wavefunction to collapse into a single definite state.' };

  let state = 'superposition'; // 'superposition', 'alive', 'dead'
  let timer = 0;

  group.userData.animate = function(delta) {
    timer += 1;
    
    if (timer < 200) {
      state = 'superposition';
      // Pulse between the two states
      const t = Date.now() * 0.005;
      aliveCat.material.opacity = 0.5 + Math.sin(t)*0.2;
      deadCat.material.opacity = 0.5 - Math.sin(t)*0.2;
      
      aliveCat.visible = true;
      deadCat.visible = true;
      eyeGroup.visible = false;
      box.material.opacity = 0.8; // Box is closed
    } else if (timer === 200) {
      // Wavefunction collapse (Observation)
      state = Math.random() > 0.5 ? 'alive' : 'dead';
      eyeGroup.visible = true;
      box.material.opacity = 0.2; // Box opened
      
      if (state === 'alive') {
        aliveCat.material.opacity = 1;
        aliveCat.visible = true;
        deadCat.visible = false;
      } else {
        deadCat.material.opacity = 1;
        deadCat.visible = true;
        aliveCat.visible = false;
        // animate hammer
        hammer.rotation.z = Math.PI / 2;
        // flask green gas
        flask.material.color.setHex(0x00ff00);
      }
    } else if (timer > 400) {
      timer = 0; // reset experiment
      hammer.rotation.z = Math.PI / 4;
      flask.material.color.setHex(0x00ffff);
    }
  };

  group.userData.quiz = [
    { question: "What concept did Erwin Schrödinger intend to highlight with this thought experiment?", options: ["That cats are immune to radiation", "The absurdity of applying quantum superposition to macroscopic, everyday objects", "That poison is bad for pets"], answer: 1 },
    { question: "According to the Copenhagen interpretation, when is the fate of the cat decided?", options: ["When the atom actually decays", "When the box is opened and the system is observed/measured", "Before the experiment even begins"], answer: 1 }
  ];

  return group;
}
