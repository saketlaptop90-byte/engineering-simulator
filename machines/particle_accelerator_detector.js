export function createParticleAcceleratorDetector(THREE) {
  const group = new THREE.Group();

  // 1. Beam Pipe (Where particles collide)
  const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 12, 16);
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });
  const pipe = new THREE.Mesh(pipeGeo, pipeMat);
  pipe.rotation.x = Math.PI / 2;
  group.add(pipe);
  pipe.userData = { id: 'beam_pipe', name: 'Ultra-High Vacuum Beam Pipe', description: 'Where bunches of protons traveling at 99.999999% the speed of light collide.' };

  // 2. Silicon Pixel Tracker (Inner Layer)
  const trackerGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
  const trackerMat = new THREE.MeshStandardMaterial({ color: 0xddaa00, wireframe: true });
  const tracker = new THREE.Mesh(trackerGeo, trackerMat);
  tracker.rotation.x = Math.PI / 2;
  group.add(tracker);
  tracker.userData = { id: 'tracker', name: 'Silicon Pixel Detector', description: 'Reconstructs the exact trajectories of charged particles born from the collision.' };

  // 3. Electromagnetic Calorimeter (ECAL)
  const ecalGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 32, 1, true);
  const ecalMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const ecal = new THREE.Mesh(ecalGeo, ecalMat);
  ecal.rotation.x = Math.PI / 2;
  group.add(ecal);
  ecal.userData = { id: 'ecal', name: 'Electromagnetic Calorimeter', description: 'Measures the energy of electrons and photons as they are completely absorbed by dense crystals (e.g., Lead Tungstate).' };

  // 4. Hadron Calorimeter (HCAL)
  const hcalGeo = new THREE.CylinderGeometry(2.5, 2.5, 7, 32, 1, true);
  const hcalMat = new THREE.MeshStandardMaterial({ color: 0xff8800, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  const hcal = new THREE.Mesh(hcalGeo, hcalMat);
  hcal.rotation.x = Math.PI / 2;
  group.add(hcal);
  hcal.userData = { id: 'hcal', name: 'Hadron Calorimeter', description: 'Stops and measures the energy of hadrons (protons, neutrons, pions).' };

  // 5. Superconducting Solenoid Magnet
  const magnetGeo = new THREE.CylinderGeometry(3, 3, 7.5, 32, 1, true);
  const magnetMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, side: THREE.DoubleSide });
  const magnet = new THREE.Mesh(magnetGeo, magnetMat);
  magnet.rotation.x = Math.PI / 2;
  group.add(magnet);
  magnet.userData = { id: 'solenoid', name: 'Superconducting Solenoid', description: 'Generates a massive 4 Tesla magnetic field to bend the paths of charged particles.' };

  // 6. Muon Chambers (Outer Layer)
  const muonGeo = new THREE.CylinderGeometry(4.5, 4.5, 9, 16, 1, true);
  const muonMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.3, wireframe: true });
  const muon = new THREE.Mesh(muonGeo, muonMat);
  muon.rotation.x = Math.PI / 2;
  group.add(muon);
  muon.userData = { id: 'muon_chambers', name: 'Muon Detectors', description: 'Muons are the only charged particles that can punch through the inner layers to reach here.' };

  // 7. Particle Collision Event (Visualized tracks)
  const tracksGroup = new THREE.Group();
  group.add(tracksGroup);
  
  const trackColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
  const tracks = [];
  
  for(let i=0; i<50; i++) {
    // Generate curved tracks (curving due to magnetic field)
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0,0,0),
      new THREE.Vector3((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3),
      new THREE.Vector3((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8)
    );
    const trackGeo = new THREE.TubeGeometry(curve, 10, 0.02, 4, false);
    const trackMat = new THREE.MeshBasicMaterial({ color: trackColors[Math.floor(Math.random()*trackColors.length)], transparent: true, opacity: 0 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    tracksGroup.add(track);
    tracks.push({ mesh: track, speed: 0.05 + Math.random()*0.1, progress: 0 });
  }
  
  tracksGroup.children[0].userData = { id: 'collision_event', name: 'Proton-Proton Collision', description: 'The collision energy converts into mass (E=mc²), birthing a shower of new, exotic particles like the Higgs Boson.' };

  // 8. Incoming Proton Bunches
  const protonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), protonMat);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), protonMat);
  group.add(p1, p2);

  let collisionTimer = 0;

  group.userData.animate = function(delta) {
    collisionTimer += 1;
    
    if (collisionTimer < 30) {
      // Protons approaching
      p1.position.set(0, 0, -6 + (collisionTimer * 0.2));
      p2.position.set(0, 0, 6 - (collisionTimer * 0.2));
      p1.visible = true;
      p2.visible = true;
      
      // Hide tracks
      tracks.forEach(t => {
        t.progress = 0;
        t.mesh.material.opacity = 0;
      });
    } else if (collisionTimer === 30) {
      // Collision frame
      p1.visible = false;
      p2.visible = false;
    } else {
      // Tracks exploding outward
      tracks.forEach(t => {
        t.progress += t.speed;
        if (t.progress < 1) {
          t.mesh.material.opacity = 1 - Math.pow(t.progress, 2);
          // Scale up geometry to simulate outward movement
          t.mesh.scale.setScalar(t.progress * 5);
        } else {
          t.mesh.material.opacity = 0;
        }
      });
      
      if (collisionTimer > 100) {
        collisionTimer = 0; // reset
      }
    }
  };

  group.userData.quiz = [
    { question: "How does a particle detector measure the momentum of a charged particle?", options: ["By weighing it on a microscopic scale", "By observing how much its path bends in a strong magnetic field", "By measuring its temperature"], answer: 1 },
    { question: "Which particle famously took a massive detector like this (ATLAS/CMS) to discover in 2012?", options: ["The Electron", "The Quark", "The Higgs Boson"], answer: 2 }
  ];

  return group;
}
