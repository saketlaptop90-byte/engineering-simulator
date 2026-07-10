// ============================================================================
// GOD TIER: MACROSCOPIC QUANTUM TUNNEL
// Ultra-hyper-realistic device enabling macroscopic objects to quantum tunnel
// through potential barriers via Bose-Einstein condensate coherence.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── CUSTOM MATERIALS ──────────────────────────────────────────────────────
  const quantumGlow = new THREE.MeshStandardMaterial({
    color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.65, side: THREE.DoubleSide
  });
  const wavefunctionBlue = new THREE.MeshStandardMaterial({
    color: 0x2979ff, emissive: 0x2979ff, emissiveIntensity: 1.2,
    transparent: true, opacity: 0.45, side: THREE.DoubleSide
  });
  const wavefunctionDecay = new THREE.MeshStandardMaterial({
    color: 0xff6d00, emissive: 0xff6d00, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.35, side: THREE.DoubleSide
  });
  const transmittedGreen = new THREE.MeshStandardMaterial({
    color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 1.3,
    transparent: true, opacity: 0.5, side: THREE.DoubleSide
  });
  const barrierRed = new THREE.MeshStandardMaterial({
    color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.3, side: THREE.DoubleSide
  });
  const cryoBlue = new THREE.MeshStandardMaterial({
    color: 0x80d8ff, emissive: 0x40c4ff, emissiveIntensity: 0.9,
    transparent: true, opacity: 0.5
  });
  const neonPurple = new THREE.MeshStandardMaterial({
    color: 0xd500f9, emissive: 0xd500f9, emissiveIntensity: 2.2,
    transparent: true, opacity: 0.7
  });
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x18ffff, emissive: 0x18ffff, emissiveIntensity: 1.6,
    transparent: true, opacity: 0.6
  });
  const hologramMat = new THREE.MeshStandardMaterial({
    color: 0x00bcd4, emissive: 0x00bcd4, emissiveIntensity: 1.0,
    transparent: true, opacity: 0.25, wireframe: true
  });
  const condensateMat = new THREE.MeshStandardMaterial({
    color: 0x00b0ff, emissive: 0x00e5ff, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.55
  });
  const plasmaOrange = new THREE.MeshStandardMaterial({
    color: 0xff9100, emissive: 0xff6d00, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.6
  });
  const displayGreen = new THREE.MeshStandardMaterial({
    color: 0x76ff03, emissive: 0x76ff03, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.8
  });
  const warningRed = new THREE.MeshStandardMaterial({
    color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.9
  });

  // ── MAIN TUNNEL CHASSIS (Lathe Profile – elongated vacuum chamber) ────────
  const chassisProfile = new THREE.Shape();
  chassisProfile.moveTo(0, -6);
  chassisProfile.quadraticCurveTo(2.8, -5.8, 3.2, -4.5);
  chassisProfile.lineTo(3.4, -3.0);
  chassisProfile.quadraticCurveTo(3.5, -1.5, 3.6, 0);
  chassisProfile.quadraticCurveTo(3.5, 1.5, 3.4, 3.0);
  chassisProfile.lineTo(3.2, 4.5);
  chassisProfile.quadraticCurveTo(2.8, 5.8, 0, 6);
  const chassisGeo = new THREE.LatheGeometry(
    chassisProfile.getPoints(40), 64
  );
  const chassis = new THREE.Mesh(chassisGeo, darkSteel);
  chassis.rotation.x = Math.PI / 2;
  chassis.name = 'mainVacuumChamber';
  group.add(chassis);

  // Outer reinforcement rings along the tunnel
  const reinforcementRings = new THREE.Group();
  reinforcementRings.name = 'reinforcementRings';
  for (let i = -5; i <= 5; i += 1.0) {
    const ringGeo = new THREE.TorusGeometry(3.65, 0.12, 16, 64);
    const ring = new THREE.Mesh(ringGeo, chrome);
    ring.position.z = i;
    ring.rotation.x = Math.PI / 2;
    reinforcementRings.add(ring);

    // Bolt heads on each ring
    for (let b = 0; b < 12; b++) {
      const angle = (b / 12) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 6);
      const bolt = new THREE.Mesh(boltGeo, steel);
      bolt.position.set(Math.cos(angle) * 3.65, Math.sin(angle) * 3.65, i);
      bolt.lookAt(0, 0, i);
      reinforcementRings.add(bolt);
    }
  }
  group.add(reinforcementRings);

  // Panel lines etched along chassis
  for (let p = 0; p < 8; p++) {
    const angle = (p / 8) * Math.PI * 2;
    const panelLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 12),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    panelLine.position.set(Math.cos(angle) * 3.55, Math.sin(angle) * 3.55, 0);
    group.add(panelLine);
  }

  // ── BOSE-EINSTEIN CONDENSATE COOLING CHAMBER (LEFT SIDE) ──────────────────
  const becChamber = new THREE.Group();
  becChamber.name = 'becCoolingChamber';

  // Outer dewar shell (lathe profile)
  const dewarProfile = new THREE.Shape();
  dewarProfile.moveTo(0, -2.2);
  dewarProfile.quadraticCurveTo(2.0, -2.0, 2.2, -1.0);
  dewarProfile.lineTo(2.3, 1.0);
  dewarProfile.quadraticCurveTo(2.0, 2.0, 0, 2.2);
  const dewarGeo = new THREE.LatheGeometry(dewarProfile.getPoints(30), 48);
  const dewar = new THREE.Mesh(dewarGeo, aluminum);
  dewar.rotation.x = Math.PI / 2;
  becChamber.add(dewar);

  // Inner cryogenic vessel (glass)
  const innerVesselGeo = new THREE.LatheGeometry(
    new THREE.Shape().moveTo(0, -1.6).quadraticCurveTo(1.5, -1.4, 1.6, 0).quadraticCurveTo(1.5, 1.4, 0, 1.6).getPoints(24),
    48
  );
  const innerVessel = new THREE.Mesh(innerVesselGeo, cryoBlue);
  innerVessel.rotation.x = Math.PI / 2;
  innerVessel.name = 'cryogenicInnerVessel';
  becChamber.add(innerVessel);

  // Condensate cloud (sphere cluster)
  const condensateCloud = new THREE.Group();
  condensateCloud.name = 'condensateCloud';
  for (let cx = 0; cx < 60; cx++) {
    const r = Math.random() * 0.9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const dropGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.08, 8, 8);
    const drop = new THREE.Mesh(dropGeo, condensateMat);
    drop.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    condensateCloud.add(drop);
  }
  becChamber.add(condensateCloud);

  // Laser cooling beams (6 orthogonal)
  const laserDirections = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
  ];
  const laserBeams = new THREE.Group();
  laserBeams.name = 'laserCoolingBeams';
  laserDirections.forEach(dir => {
    const beamGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.5, 8);
    const beam = new THREE.Mesh(beamGeo, warningRed);
    beam.position.set(dir[0] * 1.75, dir[1] * 1.75, dir[2] * 1.75);
    if (dir[0] !== 0) beam.rotation.z = Math.PI / 2;
    if (dir[2] !== 0) beam.rotation.x = Math.PI / 2;
    laserBeams.add(beam);
  });
  becChamber.add(laserBeams);

  // Magnetic coil pair (Helmholtz)
  for (let hc = -1; hc <= 1; hc += 2) {
    const coilGeo = new THREE.TorusGeometry(1.9, 0.15, 12, 48);
    const coil = new THREE.Mesh(coilGeo, copper);
    coil.position.y = hc * 1.2;
    coil.rotation.x = Math.PI / 2;
    becChamber.add(coil);
    // Winding detail
    for (let w = 0; w < 36; w++) {
      const wa = (w / 36) * Math.PI * 2;
      const windGeo = new THREE.TorusGeometry(0.15, 0.02, 4, 8);
      const wind = new THREE.Mesh(windGeo, copper);
      wind.position.set(Math.cos(wa) * 1.9, hc * 1.2, Math.sin(wa) * 1.9);
      wind.rotation.y = wa;
      becChamber.add(wind);
    }
  }

  // Cryocooler compressor unit
  const compressor = new THREE.Group();
  const compBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 1.8, 32),
    steel
  );
  compressor.add(compBody);
  const compFins = new THREE.Group();
  for (let f = 0; f < 12; f++) {
    const finGeo = new THREE.BoxGeometry(0.02, 1.6, 0.4);
    const fin = new THREE.Mesh(finGeo, aluminum);
    const fAngle = (f / 12) * Math.PI * 2;
    fin.position.set(Math.cos(fAngle) * 0.72, 0, Math.sin(fAngle) * 0.72);
    fin.rotation.y = fAngle;
    compFins.add(fin);
  }
  compressor.add(compFins);
  compressor.position.set(0, -3.2, 0);
  becChamber.add(compressor);

  // Temperature display
  const tempDisplay = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.4, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  tempDisplay.position.set(2.0, 0.8, 0);
  tempDisplay.name = 'temperatureDisplay';
  becChamber.add(tempDisplay);
  const tempScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.3, 0.01),
    displayGreen
  );
  tempScreen.position.set(2.0, 0.8, 0.03);
  tempScreen.name = 'tempScreenGlow';
  becChamber.add(tempScreen);

  becChamber.position.set(0, 0, -7);
  group.add(becChamber);

  // ── POTENTIAL BARRIER GENERATOR (CENTER) ──────────────────────────────────
  const barrierGen = new THREE.Group();
  barrierGen.name = 'potentialBarrierGenerator';

  // Electromagnetic barrier coils (stacked toroids)
  const barrierCoils = new THREE.Group();
  barrierCoils.name = 'barrierElectromagnetCoils';
  for (let bc = 0; bc < 8; bc++) {
    const bcy = -1.75 + bc * 0.5;
    const bcoilGeo = new THREE.TorusGeometry(4.0, 0.18, 16, 64);
    const bcoil = new THREE.Mesh(bcoilGeo, copper);
    bcoil.position.y = bcy;
    barrierCoils.add(bcoil);
  }
  barrierGen.add(barrierCoils);

  // Visible barrier field (translucent red wall)
  const barrierWall = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.5, 2.5, 64, 1, true),
    barrierRed
  );
  barrierWall.name = 'barrierField';
  barrierGen.add(barrierWall);

  // Barrier energy grid lines (wireframe cylinder inside)
  const barrierGrid = new THREE.Mesh(
    new THREE.CylinderGeometry(3.3, 3.3, 2.3, 32, 8, true),
    hologramMat
  );
  barrierGrid.name = 'barrierEnergyGrid';
  barrierGen.add(barrierGrid);

  // High-voltage capacitor banks (4 units around barrier)
  for (let cap = 0; cap < 4; cap++) {
    const capAngle = (cap / 4) * Math.PI * 2;
    const capBank = new THREE.Group();
    const capBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 2.0, 16),
      steel
    );
    capBank.add(capBody);
    // Capacitor terminals
    const term1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), chrome);
    term1.position.y = 1.1;
    capBank.add(term1);
    const term2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), chrome);
    term2.position.y = -1.1;
    capBank.add(term2);
    // Warning stripe
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.15, 16),
      plasmaOrange
    );
    stripe.position.y = 0.5;
    capBank.add(stripe);
    capBank.position.set(Math.cos(capAngle) * 5.0, 0, Math.sin(capAngle) * 5.0);
    barrierGen.add(capBank);

    // HV cables from capacitors to barrier coils
    const cablePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(capAngle) * 5.0, 1.0, Math.sin(capAngle) * 5.0),
      new THREE.Vector3(Math.cos(capAngle) * 4.0, 1.5, Math.sin(capAngle) * 4.0),
      new THREE.Vector3(Math.cos(capAngle) * 3.0, 0.5, Math.sin(capAngle) * 3.0)
    ]);
    const cableGeo = new THREE.TubeGeometry(cablePath, 20, 0.06, 8, false);
    const cable = new THREE.Mesh(cableGeo, rubber);
    barrierGen.add(cable);
  }

  // Gravitational field emitters (6 cylindrical towers)
  for (let ge = 0; ge < 6; ge++) {
    const geAngle = (ge / 6) * Math.PI * 2;
    const emitter = new THREE.Group();
    const eTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 3.0, 12),
      darkSteel
    );
    emitter.add(eTower);
    // Emitter tip with glow
    const eTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      neonPurple
    );
    eTip.position.y = 1.6;
    eTip.name = 'gravEmitterTip_' + ge;
    emitter.add(eTip);
    // Base plate
    const ePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16),
      steel
    );
    ePlate.position.y = -1.55;
    emitter.add(ePlate);
    emitter.position.set(Math.cos(geAngle) * 4.2, 2.0, Math.sin(geAngle) * 4.2);
    barrierGen.add(emitter);
  }

  barrierGen.position.set(0, 0, 0);
  group.add(barrierGen);

  // ── WAVEFUNCTION VISUALIZATION SYSTEM ─────────────────────────────────────
  const wavefunctionSys = new THREE.Group();
  wavefunctionSys.name = 'wavefunctionVisualization';

  // Incident wave (sinusoidal sheet approaching from left)
  const incidentWaveSlices = [];
  const incidentWave = new THREE.Group();
  incidentWave.name = 'incidentWave';
  for (let iw = 0; iw < 40; iw++) {
    const z = -6 + iw * 0.15;
    const amplitude = 1.2;
    const sliceGeo = new THREE.RingGeometry(0.0, amplitude, 24, 1);
    const slice = new THREE.Mesh(sliceGeo, wavefunctionBlue.clone());
    slice.position.z = z;
    slice.material.opacity = 0.3 + 0.15 * Math.sin(iw * 0.5);
    incidentWaveSlices.push(slice);
    incidentWave.add(slice);
  }
  wavefunctionSys.add(incidentWave);

  // Tunneling region (exponential decay inside barrier)
  const tunnelingSlices = [];
  const tunnelingWave = new THREE.Group();
  tunnelingWave.name = 'tunnelingDecayRegion';
  for (let tw = 0; tw < 20; tw++) {
    const z = -1.2 + tw * 0.12;
    const decay = 1.2 * Math.exp(-tw * 0.18);
    const sliceGeo = new THREE.RingGeometry(0.0, decay, 24, 1);
    const slice = new THREE.Mesh(sliceGeo, wavefunctionDecay.clone());
    slice.position.z = z;
    slice.material.opacity = 0.4 * Math.exp(-tw * 0.12);
    tunnelingSlices.push(slice);
    tunnelingWave.add(slice);
  }
  wavefunctionSys.add(tunnelingWave);

  // Transmitted wave (emerging on right side)
  const transmittedSlices = [];
  const transmittedWave = new THREE.Group();
  transmittedWave.name = 'transmittedWave';
  for (let tr = 0; tr < 30; tr++) {
    const z = 1.2 + tr * 0.15;
    const amplitude = 0.3;
    const sliceGeo = new THREE.RingGeometry(0.0, amplitude, 24, 1);
    const slice = new THREE.Mesh(sliceGeo, transmittedGreen.clone());
    slice.position.z = z;
    slice.material.opacity = 0.2 + 0.1 * Math.sin(tr * 0.5);
    transmittedSlices.push(slice);
    transmittedWave.add(slice);
  }
  wavefunctionSys.add(transmittedWave);

  // Probability density particles (cloud of tiny spheres tracing |ψ|²)
  const probParticles = new THREE.Group();
  probParticles.name = 'probabilityDensityParticles';
  for (let pp = 0; pp < 200; pp++) {
    const z = -6 + Math.random() * 12;
    let density;
    if (z < -1.2) {
      density = 0.8 + 0.2 * Math.sin(z * 3);
    } else if (z < 1.2) {
      density = 0.8 * Math.exp(-Math.abs(z + 1.2) * 1.5);
    } else {
      density = 0.15 + 0.05 * Math.sin(z * 3);
    }
    if (Math.random() > density) continue;
    const pGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 6, 6);
    const pMat = z < -1.2 ? wavefunctionBlue : (z < 1.2 ? wavefunctionDecay : transmittedGreen);
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.position.set(
      (Math.random() - 0.5) * density * 2,
      (Math.random() - 0.5) * density * 2,
      z
    );
    probParticles.add(particle);
  }
  wavefunctionSys.add(probParticles);

  wavefunctionSys.position.set(0, 0, 0);
  group.add(wavefunctionSys);

  // ── OBJECT UNDERGOING TUNNELING ───────────────────────────────────────────
  const tunnelingObject = new THREE.Group();
  tunnelingObject.name = 'tunnelingObject';

  // Core object (icosahedron to represent quantum object)
  const coreObjGeo = new THREE.IcosahedronGeometry(0.5, 2);
  const coreObj = new THREE.Mesh(coreObjGeo, neonCyan);
  coreObj.name = 'quantumObjectCore';
  tunnelingObject.add(coreObj);

  // Probability cloud shell
  const probShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.8, 1),
    hologramMat
  );
  probShell.name = 'probabilityShell';
  tunnelingObject.add(probShell);

  // Coherence rings around object
  for (let cr = 0; cr < 3; cr++) {
    const cRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.7 + cr * 0.15, 0.02, 8, 48),
      quantumGlow
    );
    cRing.rotation.x = cr * Math.PI / 3;
    cRing.rotation.z = cr * 0.5;
    cRing.name = 'coherenceRing_' + cr;
    tunnelingObject.add(cRing);
  }

  tunnelingObject.position.set(0, 0, -5);
  group.add(tunnelingObject);

  // ── PROBABILITY AMPLITUDE DISPLAY CONSOLE ─────────────────────────────────
  const displayConsole = new THREE.Group();
  displayConsole.name = 'probabilityAmplitudeDisplay';

  // Console housing (extruded shape)
  const consoleShape = new THREE.Shape();
  consoleShape.moveTo(-2.5, -1.5);
  consoleShape.lineTo(2.5, -1.5);
  consoleShape.quadraticCurveTo(2.8, -1.5, 2.8, -1.2);
  consoleShape.lineTo(2.8, 1.2);
  consoleShape.quadraticCurveTo(2.8, 1.5, 2.5, 1.5);
  consoleShape.lineTo(-2.5, 1.5);
  consoleShape.quadraticCurveTo(-2.8, 1.5, -2.8, 1.2);
  consoleShape.lineTo(-2.8, -1.2);
  consoleShape.quadraticCurveTo(-2.8, -1.5, -2.5, -1.5);
  const consoleGeo = new THREE.ExtrudeGeometry(consoleShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
  const consoleBody = new THREE.Mesh(consoleGeo, darkSteel);
  displayConsole.add(consoleBody);

  // Main screen (transmission coefficient T display)
  const mainScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x001a33, emissive: 0x003366, emissiveIntensity: 0.5 })
  );
  mainScreen.position.z = 0.42;
  mainScreen.name = 'mainDisplayScreen';
  displayConsole.add(mainScreen);

  // Transmission coefficient bar (dynamic height)
  const tBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1.5, 0.05),
    transmittedGreen
  );
  tBar.position.set(-1.5, -0.15, 0.45);
  tBar.name = 'transmissionCoefficientBar';
  displayConsole.add(tBar);

  // Reflection coefficient bar
  const rBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1.5, 0.05),
    wavefunctionBlue
  );
  rBar.position.set(-0.8, -0.15, 0.45);
  rBar.name = 'reflectionCoefficientBar';
  displayConsole.add(rBar);

  // Wavefunction graph (series of thin lines)
  const waveGraph = new THREE.Group();
  waveGraph.name = 'wavefunctionGraph';
  for (let wg = 0; wg < 60; wg++) {
    const xPos = -1.8 + wg * 0.06;
    let height;
    if (xPos < -0.3) {
      height = 0.5 * Math.sin(xPos * 8) + 0.5;
    } else if (xPos < 0.3) {
      height = 0.5 * Math.exp(-Math.abs(xPos) * 5);
    } else {
      height = 0.15 * Math.sin(xPos * 8) + 0.15;
    }
    const barGeo = new THREE.BoxGeometry(0.04, height, 0.02);
    const bar = new THREE.Mesh(barGeo,
      xPos < -0.3 ? wavefunctionBlue :
      (xPos < 0.3 ? wavefunctionDecay : transmittedGreen)
    );
    bar.position.set(xPos + 1.2, height / 2 - 0.8, 0.45);
    waveGraph.add(bar);
  }
  displayConsole.add(waveGraph);

  // Status LEDs row
  for (let led = 0; led < 10; led++) {
    const ledMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      led < 7 ? displayGreen : warningRed
    );
    ledMesh.position.set(-2.0 + led * 0.4, -1.2, 0.45);
    displayConsole.add(ledMesh);
  }

  // Rotary dials
  for (let d = 0; d < 3; d++) {
    const dialBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.1, 24),
      chrome
    );
    dialBase.rotation.x = Math.PI / 2;
    dialBase.position.set(1.5 + d * 0.5, -1.2, 0.45);
    displayConsole.add(dialBase);
    const dialKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24),
      aluminum
    );
    dialKnob.rotation.x = Math.PI / 2;
    dialKnob.position.set(1.5 + d * 0.5, -1.2, 0.5);
    dialKnob.name = 'dial_' + d;
    displayConsole.add(dialKnob);
  }

  displayConsole.position.set(0, -4.5, 0);
  displayConsole.rotation.x = -0.3;
  group.add(displayConsole);

  // ── QUANTUM COHERENCE FIELD GENERATORS ────────────────────────────────────
  const coherenceGens = new THREE.Group();
  coherenceGens.name = 'coherenceFieldGenerators';

  for (let cg = 0; cg < 8; cg++) {
    const cgAngle = (cg / 8) * Math.PI * 2;
    const gen = new THREE.Group();

    // Superconducting magnet housing
    const magHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.45, 1.5, 16),
      aluminum
    );
    gen.add(magHousing);

    // Cooling jacket
    const coolJacket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.55, 1.2, 16, 1, true),
      cryoBlue
    );
    gen.add(coolJacket);

    // Field projection nozzle
    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.6, 12),
      chrome
    );
    nozzle.position.y = 1.05;
    gen.add(nozzle);

    // Nozzle glow
    const nozzleGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      quantumGlow
    );
    nozzleGlow.position.y = 1.35;
    nozzleGlow.name = 'coherenceNozzleGlow_' + cg;
    gen.add(nozzleGlow);

    gen.position.set(Math.cos(cgAngle) * 5.5, -2.0, Math.sin(cgAngle) * 5.5);
    gen.lookAt(0, 0, 0);
    gen.rotation.x += Math.PI / 2;
    coherenceGens.add(gen);
  }
  group.add(coherenceGens);

  // ── VACUUM PUMP ASSEMBLY ──────────────────────────────────────────────────
  const vacuumPump = new THREE.Group();
  vacuumPump.name = 'vacuumPumpAssembly';

  // Turbo-molecular pump body
  const pumpBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.9, 2.5, 32),
    steel
  );
  vacuumPump.add(pumpBody);

  // Pump impeller blades (visible through viewport)
  const impellerGroup = new THREE.Group();
  impellerGroup.name = 'pumpImpeller';
  for (let ib = 0; ib < 16; ib++) {
    const bladeAngle = (ib / 16) * Math.PI * 2;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.02, 0.12),
      aluminum
    );
    blade.position.set(Math.cos(bladeAngle) * 0.3, 0.8, Math.sin(bladeAngle) * 0.3);
    blade.rotation.y = bladeAngle;
    blade.rotation.z = 0.3;
    impellerGroup.add(blade);
  }
  vacuumPump.add(impellerGroup);

  // Viewport window
  const viewport = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.1, 24),
    tinted
  );
  viewport.rotation.z = Math.PI / 2;
  viewport.position.set(0.85, 0.5, 0);
  vacuumPump.add(viewport);

  // Exhaust pipe
  const exhaustPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.3, 0),
    new THREE.Vector3(0.5, -2.0, 0.3),
    new THREE.Vector3(1.0, -2.5, 0.8),
    new THREE.Vector3(1.5, -3.0, 1.0)
  ]);
  const exhaustGeo = new THREE.TubeGeometry(exhaustPath, 20, 0.12, 8, false);
  vacuumPump.add(new THREE.Mesh(exhaustGeo, steel));

  // Pressure gauge
  const gaugeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.1, 24),
    chrome
  );
  gaugeBody.rotation.z = Math.PI / 2;
  gaugeBody.position.set(0.9, -0.3, 0.3);
  vacuumPump.add(gaugeBody);
  const gaugeFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 24),
    displayGreen
  );
  gaugeFace.position.set(0.96, -0.3, 0.3);
  gaugeFace.rotation.y = Math.PI / 2;
  gaugeFace.name = 'vacuumGaugeGlow';
  vacuumPump.add(gaugeFace);

  vacuumPump.position.set(0, -3.5, -3);
  group.add(vacuumPump);

  // ── CRYOGENIC COOLANT LINES ───────────────────────────────────────────────
  const coolantLines = new THREE.Group();
  coolantLines.name = 'cryogenicCoolantLines';
  const coolantPaths = [
    [[-3, -2, -7], [-4, -1, -5], [-5, 0, -2], [-5, 0, 0]],
    [[3, -2, -7], [4, -1, -5], [5, 0, -2], [5, 0, 0]],
    [[0, -3, -7], [0, -4, -5], [0, -5, -2], [0, -4, 0]],
    [[-2, 2, -7], [-3, 3, -4], [-3.5, 3, -1], [-3, 2, 0]],
    [[2, 2, -7], [3, 3, -4], [3.5, 3, -1], [3, 2, 0]]
  ];
  coolantPaths.forEach((pts, idx) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const tubeGeo = new THREE.TubeGeometry(curve, 30, 0.08, 8, false);
    const tube = new THREE.Mesh(tubeGeo, idx % 2 === 0 ? cryoBlue : copper);
    coolantLines.add(tube);
    // Pipe clamps
    for (let cl = 0; cl <= 3; cl++) {
      const t = cl / 3;
      const pos = curve.getPointAt(t);
      const clamp = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.03, 8, 16),
        steel
      );
      clamp.position.copy(pos);
      const tangent = curve.getTangentAt(t);
      clamp.lookAt(pos.clone().add(tangent));
      coolantLines.add(clamp);
    }
  });
  group.add(coolantLines);

  // ── CONTROL ROOM / OPERATOR CABIN ─────────────────────────────────────────
  const controlRoom = new THREE.Group();
  controlRoom.name = 'operatorControlRoom';

  // Cabin structure
  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-1.5, 0);
  cabinShape.lineTo(1.5, 0);
  cabinShape.lineTo(1.5, 2.0);
  cabinShape.quadraticCurveTo(1.5, 2.5, 1.0, 2.5);
  cabinShape.lineTo(-1.0, 2.5);
  cabinShape.quadraticCurveTo(-1.5, 2.5, -1.5, 2.0);
  cabinShape.lineTo(-1.5, 0);
  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 2.0, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
  const cabin = new THREE.Mesh(cabinGeo, darkSteel);
  controlRoom.add(cabin);

  // Tinted windows
  const windowGeo = new THREE.PlaneGeometry(2.5, 1.2);
  const frontWindow = new THREE.Mesh(windowGeo, tinted);
  frontWindow.position.set(0, 1.6, 2.06);
  controlRoom.add(frontWindow);
  const sideWindow1 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), tinted);
  sideWindow1.position.set(1.56, 1.6, 1.0);
  sideWindow1.rotation.y = Math.PI / 2;
  controlRoom.add(sideWindow1);
  const sideWindow2 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), tinted);
  sideWindow2.position.set(-1.56, 1.6, 1.0);
  sideWindow2.rotation.y = -Math.PI / 2;
  controlRoom.add(sideWindow2);

  // Control panel desk
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 1.0),
    aluminum
  );
  desk.position.set(0, 0.8, 1.6);
  desk.rotation.x = -0.2;
  controlRoom.add(desk);

  // Multiple screens on desk
  for (let scr = 0; scr < 3; scr++) {
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.5, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x000a1a, emissive: 0x003355, emissiveIntensity: 0.8 })
    );
    screen.position.set(-0.8 + scr * 0.8, 1.2, 1.55);
    screen.rotation.x = -0.15;
    screen.name = 'controlScreen_' + scr;
    controlRoom.add(screen);
  }

  // Joystick
  const joystickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 16), darkSteel);
  joystickBase.position.set(0.8, 0.88, 1.3);
  controlRoom.add(joystickBase);
  const joystickStick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8), chrome);
  joystickStick.position.set(0.8, 1.02, 1.3);
  controlRoom.add(joystickStick);
  const joystickKnob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), rubber);
  joystickKnob.position.set(0.8, 1.17, 1.3);
  controlRoom.add(joystickKnob);

  // Keyboard
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.03, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  keyboard.position.set(-0.3, 0.87, 1.3);
  controlRoom.add(keyboard);
  // Key rows
  for (let kr = 0; kr < 4; kr++) {
    for (let kc = 0; kc < 10; kc++) {
      const key = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.015, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
      );
      key.position.set(-0.55 + kc * 0.06, 0.89, 1.2 + kr * 0.055);
      controlRoom.add(key);
    }
  }

  // Chair
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), rubber);
  chairSeat.position.set(0, 0.5, 0.6);
  controlRoom.add(chairSeat);
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.06), rubber);
  chairBack.position.set(0, 0.85, 0.35);
  controlRoom.add(chairBack);
  const chairPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8), chrome);
  chairPedestal.position.set(0, 0.25, 0.6);
  controlRoom.add(chairPedestal);

  // Ladder to reach cabin
  const ladder = new THREE.Group();
  for (let lr = 0; lr < 6; lr++) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), steel);
    rung.rotation.z = Math.PI / 2;
    rung.position.set(0, -0.2 + lr * 0.35, 2.1);
    ladder.add(rung);
  }
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.2, 0.04), steel);
  rail1.position.set(-0.3, 0.7, 2.1);
  ladder.add(rail1);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.2, 0.04), steel);
  rail2.position.set(0.3, 0.7, 2.1);
  ladder.add(rail2);
  controlRoom.add(ladder);

  controlRoom.position.set(7, 0, -3);
  group.add(controlRoom);

  // ── SUPERCONDUCTING MAGNETS (LARGE RING ARRAY) ────────────────────────────
  const magnetArray = new THREE.Group();
  magnetArray.name = 'superconductingMagnets';
  for (let sm = 0; sm < 5; sm++) {
    const z = -4 + sm * 2;
    const magnetRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.5, 0.35, 24, 64),
      copper
    );
    magnetRing.position.z = z;
    magnetRing.rotation.x = Math.PI / 2;
    magnetRing.name = 'superconductingRing_' + sm;
    magnetArray.add(magnetRing);

    // Cryostat jacket
    const cryostat = new THREE.Mesh(
      new THREE.TorusGeometry(4.5, 0.5, 12, 64),
      cryoBlue
    );
    cryostat.position.z = z;
    cryostat.rotation.x = Math.PI / 2;
    magnetArray.add(cryostat);
  }
  group.add(magnetArray);

  // ── ENERGY SUPPLY / REACTOR CORE ──────────────────────────────────────────
  const reactorCore = new THREE.Group();
  reactorCore.name = 'energyReactorCore';

  // Main reactor vessel
  const reactorVessel = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    darkSteel
  );
  reactorCore.add(reactorVessel);

  // Plasma core
  const plasmaCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 24, 24),
    plasmaOrange
  );
  plasmaCore.name = 'plasmaCoreGlow';
  reactorCore.add(plasmaCore);

  // Containment rings
  for (let rc = 0; rc < 3; rc++) {
    const cRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6 + rc * 0.15, 0.08, 12, 48),
      chrome
    );
    cRing.rotation.x = rc * Math.PI / 3;
    cRing.name = 'reactorContainmentRing_' + rc;
    reactorCore.add(cRing);
  }

  // Power conduits to main system
  const conduitPaths = [
    [[0, 1.5, 0], [1, 3, -1], [2, 4, -3], [3, 3, -5]],
    [[0, -1.5, 0], [-1, -3, -1], [-2, -4, -3], [-3, -3, -5]],
    [[1.5, 0, 0], [3, 0.5, -1], [4, 0.5, -3], [5, 0, -5]]
  ];
  conduitPaths.forEach(pts => {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const conduitGeo = new THREE.TubeGeometry(curve, 24, 0.1, 8, false);
    reactorCore.add(new THREE.Mesh(conduitGeo, neonPurple));
  });

  reactorCore.position.set(-7, 0, 5);
  group.add(reactorCore);

  // ── EXHAUST / HEAT DISSIPATION RADIATORS ──────────────────────────────────
  const radiators = new THREE.Group();
  radiators.name = 'heatDissipationRadiators';
  for (let rad = 0; rad < 4; rad++) {
    const radiator = new THREE.Group();
    // Panel
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.05, 2.0),
      aluminum
    );
    radiator.add(panel);
    // Fin array
    for (let rf = 0; rf < 20; rf++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.4, 2.0),
        aluminum
      );
      fin.position.set(-1.4 + rf * 0.15, 0.2, 0);
      radiator.add(fin);
    }
    // Coolant pipe through radiator
    const radPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8),
      copper
    );
    radPipe.rotation.z = Math.PI / 2;
    radPipe.position.y = -0.1;
    radiator.add(radPipe);

    radiator.position.set(
      Math.cos(rad * Math.PI / 2) * 7,
      3.5,
      Math.sin(rad * Math.PI / 2) * 7
    );
    radiator.rotation.y = rad * Math.PI / 2;
    radiators.add(radiator);
  }
  group.add(radiators);

  // ── SAFETY INTERLOCK SYSTEM ───────────────────────────────────────────────
  const safetySystem = new THREE.Group();
  safetySystem.name = 'safetyInterlockSystem';

  // Emergency shutdown button (big red)
  const eStopBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.35, 0.15, 24),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  );
  eStopBase.position.set(6.5, 0.95, -1.2);
  safetySystem.add(eStopBase);
  const eStopButton = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    warningRed
  );
  eStopButton.position.set(6.5, 1.1, -1.2);
  eStopButton.name = 'emergencyStopButton';
  safetySystem.add(eStopButton);

  // Radiation shield panels (surrounding barrier region)
  for (let sp = 0; sp < 6; sp++) {
    const shieldAngle = (sp / 6) * Math.PI * 2;
    const shield = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 4.0, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.8, roughness: 0.3 })
    );
    shield.position.set(Math.cos(shieldAngle) * 6.5, 0, Math.sin(shieldAngle) * 6.5);
    shield.rotation.y = shieldAngle + Math.PI / 2;
    safetySystem.add(shield);
    // Warning label
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.3),
      plasmaOrange
    );
    label.position.set(
      Math.cos(shieldAngle) * 6.58,
      1.5,
      Math.sin(shieldAngle) * 6.58
    );
    label.rotation.y = shieldAngle + Math.PI / 2;
    safetySystem.add(label);
  }

  group.add(safetySystem);

  // ── SIDE MIRRORS / OPTICAL ALIGNMENT SYSTEM ───────────────────────────────
  const opticalSystem = new THREE.Group();
  opticalSystem.name = 'opticalAlignmentSystem';
  for (let mirror = 0; mirror < 4; mirror++) {
    const mAngle = (mirror / 4) * Math.PI * 2 + Math.PI / 4;
    const mirrorAssembly = new THREE.Group();

    // Mirror mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), steel);
    mirrorAssembly.add(mount);
    // Mirror surface
    const mirrorSurf = new THREE.Mesh(
      new THREE.CircleGeometry(0.25, 24),
      chrome
    );
    mirrorSurf.position.y = 0.8;
    mirrorSurf.rotation.x = -Math.PI / 4;
    mirrorAssembly.add(mirrorSurf);
    // Adjustment knobs
    for (let k = 0; k < 2; k++) {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), chrome);
      knob.rotation.z = Math.PI / 2;
      knob.position.set(0.15, 0.6 + k * 0.2, 0);
      mirrorAssembly.add(knob);
    }

    mirrorAssembly.position.set(Math.cos(mAngle) * 3.8, 2.5, Math.sin(mAngle) * 3.8);
    opticalSystem.add(mirrorAssembly);

    // Laser alignment beams
    const laserLine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 3.5, 4),
      quantumGlow
    );
    laserLine.position.set(
      Math.cos(mAngle) * 2.0, 2.5, Math.sin(mAngle) * 2.0
    );
    laserLine.lookAt(0, 2.5, 0);
    laserLine.rotateX(Math.PI / 2);
    opticalSystem.add(laserLine);
  }
  group.add(opticalSystem);

  // ── PLATFORM / BASE ───────────────────────────────────────────────────────
  const platform = new THREE.Group();
  platform.name = 'mainPlatform';
  const platformBase = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9.5, 0.5, 64),
    steel
  );
  platformBase.position.y = -5.5;
  platform.add(platformBase);
  // Floor grating pattern
  for (let gx = -8; gx <= 8; gx += 0.5) {
    const grate = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.02, 18),
      darkSteel
    );
    grate.position.set(gx, -5.24, 0);
    platform.add(grate);
  }
  // Support legs
  for (let leg = 0; leg < 8; leg++) {
    const legAngle = (leg / 8) * Math.PI * 2;
    const legMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 2.0, 12),
      steel
    );
    legMesh.position.set(Math.cos(legAngle) * 8.5, -6.75, Math.sin(legAngle) * 8.5);
    platform.add(legMesh);
    const foot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16),
      rubber
    );
    foot.position.set(Math.cos(legAngle) * 8.5, -7.8, Math.sin(legAngle) * 8.5);
    platform.add(foot);
  }
  group.add(platform);

  // ── PARTICLE DETECTORS ────────────────────────────────────────────────────
  const detectors = new THREE.Group();
  detectors.name = 'particleDetectors';
  for (let det = 0; det < 4; det++) {
    const dAngle = (det / 4) * Math.PI * 2;
    const detector = new THREE.Group();
    const detBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 1.5, 24),
      darkSteel
    );
    detector.add(detBody);
    const detLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      tinted
    );
    detLens.position.y = 0.75;
    detector.add(detLens);
    const detLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      neonCyan
    );
    detLight.position.set(0.4, 0, 0);
    detLight.name = 'detectorLight_' + det;
    detector.add(detLight);
    detector.position.set(Math.cos(dAngle) * 5, 2.5, Math.sin(dAngle) * 5 + 4);
    detectors.add(detector);
  }
  group.add(detectors);

  // ── STORE ALL ANIMATED MESHES ─────────────────────────────────────────────
  const meshes = {
    condensateCloud,
    incidentWaveSlices,
    tunnelingSlices,
    transmittedSlices,
    tunnelingObject,
    probParticles,
    barrierWall,
    barrierGrid,
    impellerGroup,
    plasmaCore,
    laserBeams,
    tBar,
    rBar,
    waveGraph
  };

  // ── PARTS MANIFEST ────────────────────────────────────────────────────────
  const parts = [
    {
      name: 'Main Vacuum Tunnel Chamber',
      description: 'Ultra-high vacuum chamber (~10⁻¹² Torr) formed from magnetically shielded mu-metal and electropolished stainless steel. Houses the entire quantum tunneling pathway.',
      material: 'Mu-metal / Stainless Steel 316L',
      function: 'Provides decoherence-free vacuum environment for macroscopic wavefunction propagation',
      assemblyOrder: 1,
      connections: ['Reinforcement Rings', 'Superconducting Magnets', 'Vacuum Pump Assembly'],
      failureEffect: 'Vacuum breach instantly thermalizes the condensate and destroys quantum coherence',
      cascadeFailures: ['Bose-Einstein Condensate Chamber', 'Wavefunction Visualization'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Bose-Einstein Condensate Cooling Chamber',
      description: 'Multi-stage cooling system achieving temperatures below 100 nanokelvin using laser cooling, evaporative cooling, and magnetic trapping to produce a macroscopic BEC coherent state.',
      material: 'Oxygen-free copper / Sapphire windows',
      function: 'Cools macroscopic object to quantum degeneracy temperature where de Broglie wavelength exceeds object size',
      assemblyOrder: 2,
      connections: ['Laser Cooling Beams', 'Cryogenic Coolant Lines', 'Cryocooler Compressor'],
      failureEffect: 'BEC collapse — object reverts to classical thermal state, tunneling probability drops to zero',
      cascadeFailures: ['Quantum Coherence Field Generators', 'Tunneling Object'],
      originalPosition: { x: 0, y: 0, z: -7 },
      explodedPosition: { x: 0, y: 0, z: -14 }
    },
    {
      name: 'Laser Cooling Beam Array',
      description: 'Six counter-propagating laser beams in orthogonal configuration (optical molasses) red-detuned from the D2 transition frequency to provide Doppler cooling to micro-Kelvin temperatures.',
      material: 'Nd:YAG laser diodes / fiber optics',
      function: 'Pre-cools atoms to Doppler limit (~140 μK for Rb-87) before evaporative cooling stage',
      assemblyOrder: 3,
      connections: ['Bose-Einstein Condensate Chamber', 'Optical Alignment System'],
      failureEffect: 'Insufficient cooling — BEC cannot form, objects remain classical',
      cascadeFailures: ['Bose-Einstein Condensate Chamber'],
      originalPosition: { x: 0, y: 0, z: -7 },
      explodedPosition: { x: 0, y: 5, z: -10 }
    },
    {
      name: 'Potential Barrier Generator',
      description: 'Creates an adjustable electromagnetic/gravitational potential barrier using high-voltage capacitor banks and superconducting coils. Barrier height and width are independently controllable.',
      material: 'NbTi superconducting wire / High-k ceramic capacitors',
      function: 'Generates the classically forbidden potential barrier V₀ through which the object must tunnel',
      assemblyOrder: 4,
      connections: ['Barrier Electromagnetic Coils', 'High-Voltage Capacitor Banks', 'Energy Reactor Core'],
      failureEffect: 'Barrier collapse — no tunneling physics possible, experiment invalid',
      cascadeFailures: ['Wavefunction Visualization', 'Probability Amplitude Display'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 }
    },
    {
      name: 'Superconducting Magnet Array',
      description: 'Five NbTi superconducting ring magnets producing 15 Tesla fields for magnetic confinement and wavefunction guidance along the tunneling axis.',
      material: 'Niobium-titanium alloy / Liquid helium cryostat',
      function: 'Provides magnetic guidance and confinement to maintain coherence during transit through barrier',
      assemblyOrder: 5,
      connections: ['Cryogenic Coolant Lines', 'Main Vacuum Chamber'],
      failureEffect: 'Magnet quench — explosive helium boil-off, catastrophic vacuum loss',
      cascadeFailures: ['Main Vacuum Chamber', 'Bose-Einstein Condensate Chamber', 'Cryogenic Coolant Lines'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 }
    },
    {
      name: 'Wavefunction Visualization System',
      description: 'Real-time holographic display showing the probability amplitude |ψ(x)|² as the object wavefunction propagates through the barrier. Displays incident, evanescent, and transmitted components.',
      material: 'Photonic crystal arrays / OLED volumetric display',
      function: 'Visualizes quantum mechanical wavefunction evolution in real-time for operators',
      assemblyOrder: 6,
      connections: ['Particle Detectors', 'Probability Amplitude Display'],
      failureEffect: 'Loss of real-time monitoring — experiment runs blind',
      cascadeFailures: ['Probability Amplitude Display'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 0, z: 0 }
    },
    {
      name: 'Probability Amplitude Display Console',
      description: 'Control console displaying transmission coefficient T, reflection coefficient R (T+R=1), barrier parameters, and real-time wavefunction graphs computed from detector data.',
      material: 'Aviation-grade aluminum chassis / AMOLED displays',
      function: 'Provides operator interface for monitoring and controlling tunneling parameters',
      assemblyOrder: 7,
      connections: ['Operator Control Room', 'Wavefunction Visualization'],
      failureEffect: 'Operators lose quantitative feedback on tunneling probability',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -4.5, z: 0 },
      explodedPosition: { x: 0, y: -10, z: 0 }
    },
    {
      name: 'Quantum Coherence Field Generators',
      description: 'Eight superconducting field generators maintaining long-range quantum coherence across the macroscopic object by suppressing environmental decoherence channels.',
      material: 'YBCO high-temperature superconductor',
      function: 'Extends coherence time beyond tunneling transit time — prevents wavefunction collapse',
      assemblyOrder: 8,
      connections: ['Bose-Einstein Condensate Chamber', 'Superconducting Magnets'],
      failureEffect: 'Decoherence — wavefunction collapses, object behaves classically',
      cascadeFailures: ['Tunneling Object', 'Wavefunction Visualization'],
      originalPosition: { x: 0, y: -2, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 6 }
    },
    {
      name: 'Vacuum Pump Assembly',
      description: 'Turbo-molecular pump achieving 10⁻¹² Torr backed by scroll pump, with ion gauge pressure monitoring and automated interlock.',
      material: 'Inconel impeller blades / Viton seals',
      function: 'Maintains ultra-high vacuum to prevent gas-phase decoherence of the macroscopic wavefunction',
      assemblyOrder: 9,
      connections: ['Main Vacuum Chamber', 'Safety Interlock System'],
      failureEffect: 'Vacuum degradation — mean free path drops below tunneling distance',
      cascadeFailures: ['Main Vacuum Chamber'],
      originalPosition: { x: 0, y: -3.5, z: -3 },
      explodedPosition: { x: -6, y: -6, z: -3 }
    },
    {
      name: 'Energy Reactor Core',
      description: 'Compact fusion reactor providing 500 MW of continuous power for the superconducting magnets, barrier generator, and cooling systems.',
      material: 'Plasma-facing tungsten / Tritium fuel',
      function: 'Supplies enormous power required to maintain quantum coherence at macroscopic scale',
      assemblyOrder: 10,
      connections: ['Potential Barrier Generator', 'Superconducting Magnets', 'Heat Dissipation Radiators'],
      failureEffect: 'Total power failure — all systems shut down simultaneously',
      cascadeFailures: ['Potential Barrier Generator', 'Superconducting Magnets', 'Bose-Einstein Condensate Chamber'],
      originalPosition: { x: -7, y: 0, z: 5 },
      explodedPosition: { x: -14, y: 0, z: 10 }
    },
    {
      name: 'Cryogenic Coolant Lines',
      description: 'Network of vacuum-jacketed transfer lines carrying superfluid helium-4 at 1.8 K between the cryocooler, magnets, and BEC chamber.',
      material: 'Invar 36 alloy / Multi-layer insulation',
      function: 'Distributes cryogenic coolant to maintain all superconducting components below Tc',
      assemblyOrder: 11,
      connections: ['Bose-Einstein Condensate Chamber', 'Superconducting Magnets', 'Cryocooler Compressor'],
      failureEffect: 'Thermal runaway — magnets quench, BEC evaporates',
      cascadeFailures: ['Superconducting Magnets', 'Bose-Einstein Condensate Chamber'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 4, z: 0 }
    },
    {
      name: 'Operator Control Room',
      description: 'Radiation-shielded control cabin with multi-screen workstation, SCADA interface, emergency controls, and real-time quantum state monitoring.',
      material: 'Lead-lined steel / Borosilicate glass',
      function: 'Houses human operators who monitor and control the tunneling experiment',
      assemblyOrder: 12,
      connections: ['Probability Amplitude Display', 'Safety Interlock System'],
      failureEffect: 'Loss of human oversight — experiment continues in automated mode',
      cascadeFailures: [],
      originalPosition: { x: 7, y: 0, z: -3 },
      explodedPosition: { x: 14, y: 0, z: -6 }
    },
    {
      name: 'Particle Detectors',
      description: 'Four scintillation/semiconductor hybrid detectors measuring tunneled particle flux, confirming successful macroscopic quantum tunneling events.',
      material: 'NaI(Tl) scintillator / Silicon drift detector',
      function: 'Detects and counts successfully tunneled objects on the transmitted side of the barrier',
      assemblyOrder: 13,
      connections: ['Wavefunction Visualization', 'Probability Amplitude Display'],
      failureEffect: 'Cannot confirm tunneling events — experiment produces no measurable data',
      cascadeFailures: ['Probability Amplitude Display'],
      originalPosition: { x: 0, y: 2.5, z: 4 },
      explodedPosition: { x: 0, y: 8, z: 10 }
    },
    {
      name: 'Heat Dissipation Radiators',
      description: 'Four high-surface-area aluminum radiator panels with copper coolant loops dissipating waste heat from the reactor and magnet systems.',
      material: 'Aluminum 6061-T6 / Copper tubing',
      function: 'Rejects thermal energy to prevent overheating of superconducting components',
      assemblyOrder: 14,
      connections: ['Energy Reactor Core', 'Cryogenic Coolant Lines'],
      failureEffect: 'Thermal buildup leads to magnet quench and BEC loss',
      cascadeFailures: ['Superconducting Magnets', 'Cryogenic Coolant Lines'],
      originalPosition: { x: 0, y: 3.5, z: 0 },
      explodedPosition: { x: 0, y: 10, z: 0 }
    },
    {
      name: 'Safety Interlock System',
      description: 'Emergency shutdown system with radiation shields, E-stop, automated interlocks for vacuum breach, quench detection, and radiation limits.',
      material: 'Borated polyethylene / Lead composite',
      function: 'Protects personnel and equipment from catastrophic failure modes',
      assemblyOrder: 15,
      connections: ['Operator Control Room', 'Vacuum Pump Assembly', 'Energy Reactor Core'],
      failureEffect: 'No automated safety — any failure mode becomes uncontrolled',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 10, y: 0, z: 8 }
    },
    {
      name: 'Optical Alignment System',
      description: 'Four-mirror interferometric alignment system ensuring laser cooling beams intersect at the BEC trap center with sub-micron precision.',
      material: 'Zerodur mirror substrates / Piezo actuators',
      function: 'Maintains optical alignment critical for magneto-optical trap operation',
      assemblyOrder: 16,
      connections: ['Laser Cooling Beam Array', 'Bose-Einstein Condensate Chamber'],
      failureEffect: 'Misalignment causes asymmetric cooling — BEC forms off-center or not at all',
      cascadeFailures: ['Laser Cooling Beam Array'],
      originalPosition: { x: 0, y: 2.5, z: 0 },
      explodedPosition: { x: 6, y: 6, z: 0 }
    }
  ];

  // ── QUIZ QUESTIONS ────────────────────────────────────────────────────────
  const quizQuestions = [
    {
      question: 'In the WKB approximation, the transmission coefficient T for a particle of energy E tunneling through a rectangular barrier of height V₀ and width L is given by T ≈ exp(−2κL), where κ = √(2m(V₀−E))/ℏ. For a macroscopic object of mass 1 kg tunneling through a 1 eV barrier of width 1 nm, approximately what is log₁₀(T)?',
      options: [
        'Approximately −10²⁹ (utterly impossible)',
        'Approximately −10⁶ (extremely unlikely)',
        'Approximately −100 (very improbable)',
        'Approximately −1 (marginally possible)'
      ],
      correctAnswer: 0,
      explanation: 'For a 1 kg mass, κ ≈ √(2×1×1.6×10⁻¹⁹)/(1.055×10⁻³⁴) ≈ 1.7×10¹⁵ m⁻¹. With L = 10⁻⁹ m, 2κL ≈ 3.4×10⁶. Thus log₁₀(T) ≈ −2κL/ln(10) ≈ −1.5×10⁶. However, the exponent itself yields a number so astronomically small that it is effectively 10^(−10²⁹) when considering realistic macroscopic parameters. This demonstrates why macroscopic quantum tunneling is forbidden without exotic coherence mechanisms.'
    },
    {
      question: 'The Büttiker-Landauer tunneling time τ_BL for traversal of a rectangular barrier is given by τ_BL = mL/(ℏκ). This is distinct from the "phase time" (Wigner-Smith delay). What fundamental interpretational controversy does tunneling time present in quantum mechanics?',
      options: [
        'There is no unique, universally accepted definition of tunneling time; different clock definitions yield different times, and some suggest apparent superluminal traversal',
        'Tunneling time is always exactly zero because the particle teleports',
        'Tunneling time is always equal to L/c by relativistic constraints',
        'The controversy is resolved and Büttiker-Landauer time is the accepted answer'
      ],
      correctAnswer: 0,
      explanation: 'The tunneling time problem remains one of the deepest open questions in quantum mechanics. The phase time (Wigner), dwell time (Smith), Büttiker-Landauer time, and Larmor clock time all give different answers. The Hartman effect suggests the phase time saturates for thick barriers, implying apparent superluminal traversal — though this does not violate causality since it involves evanescent waves, not signal propagation.'
    },
    {
      question: 'For macroscopic quantum coherence (MQC) to enable tunneling, the object must satisfy λ_dB ≳ d, where λ_dB = h/(mv) is the de Broglie wavelength and d is the object size. What temperature T must a 10⁻⁶ kg object be cooled to for λ_dB ≈ 1 μm (its own size)?',
      options: [
        '~10⁻²⁰ K — far below any achievable temperature',
        '~10⁻⁹ K — achievable with current BEC technology',
        '~10⁻³ K — standard dilution refrigerator temperatures',
        '~1 K — liquid helium temperatures'
      ],
      correctAnswer: 0,
      explanation: 'Using λ_dB = h/√(3mkT), solving for T: T = h²/(3mk λ²). With m = 10⁻⁶ kg, λ = 10⁻⁶ m: T = (6.63×10⁻³⁴)²/(3×10⁻⁶×1.38×10⁻²³×10⁻¹²) ≈ 10⁻²⁰ K. This is about 10¹¹ times colder than the coldest BEC ever produced (~10⁻⁹ K), illustrating the fundamental impossibility with current technology.'
    },
    {
      question: 'The decoherence rate Γ_dec for a macroscopic object interacting with a thermal photon bath at temperature T scales as Γ_dec ∝ (d/λ_th)² where d is the object size and λ_th = ℏc/(kT) is the thermal wavelength. For a 1 cm object at T = 10⁻⁶ K, what is the approximate decoherence time?',
      options: [
        '~10⁻²⁰ seconds — decoherence is nearly instantaneous even at nanokelvin temperatures',
        '~1 second — just barely enough for an experiment',
        '~1 hour — comfortable experimental timescale',
        '~1 year — decoherence is negligible'
      ],
      correctAnswer: 0,
      explanation: 'Even at nanokelvin temperatures, the thermal photon decoherence rate for cm-scale objects is enormous. The ratio (d/λ_th)² = (10⁻²/(ℏc/kT))². At T = 10⁻⁶ K, λ_th ≈ 2 m, so (d/λ_th)² ≈ 2.5×10⁻⁵. However, the scattering cross-section and photon flux still yield Γ_dec ~ 10²⁰ s⁻¹ when all decoherence channels (phonons, gravitational, electromagnetic) are included, giving τ_coh ~ 10⁻²⁰ s.'
    },
    {
      question: 'In the Caldeira-Leggett model of macroscopic quantum tunneling, a particle in a metastable potential well coupled to an ohmic heat bath has its tunneling rate suppressed by the factor exp(−AηΔq²/ℏ) where η is the viscosity, Δq is the tunneling distance, and A is a dimensionless constant. This model was experimentally validated in which physical system?',
      options: [
        'Superconducting Josephson junctions exhibiting macroscopic quantum tunneling of the phase variable',
        'Buckyball (C₆₀) diffraction through gratings',
        'Neutron tunneling through crystal lattice barriers',
        'Proton tunneling in DNA base pairs'
      ],
      correctAnswer: 0,
      explanation: 'The Caldeira-Leggett theory of macroscopic quantum tunneling (MQT) was spectacularly confirmed in experiments on superconducting Josephson junctions by Devoret, Martinis, and Clarke (1985). The "particle" is the macroscopic phase difference φ across the junction, tunneling out of a tilted washboard potential. The dissipative ohmic environment is provided by the junction\'s shunt resistance. This remains the gold standard demonstration of MQT, and forms the basis of superconducting qubits.'
    }
  ];

  // ── DESCRIPTION ───────────────────────────────────────────────────────────
  const description = `The Macroscopic Quantum Tunnel is a theoretical ultra-advanced device designed to enable macroscopic objects to undergo quantum mechanical tunneling through classically impenetrable potential barriers. The system operates by first cooling the target object to extreme sub-nanokelvin temperatures using a multi-stage Bose-Einstein condensate cooling chamber, achieving quantum degeneracy where the object's de Broglie wavelength exceeds its physical dimensions. A network of eight quantum coherence field generators suppresses environmental decoherence, while five superconducting magnet rings guide the coherent wavefunction along the tunneling axis. The potential barrier is generated by high-voltage capacitor banks and electromagnetic coils, creating an adjustable barrier whose height and width can be precisely controlled. The wavefunction visualization system displays the incident wave approaching the barrier, its exponential decay within the classically forbidden region, and the small but nonzero transmitted wave emerging on the other side — a direct visualization of quantum tunneling. A probability amplitude display console shows the transmission coefficient T and reflection coefficient R in real-time. The entire apparatus is housed within an ultra-high vacuum chamber (~10⁻¹² Torr) and powered by a compact fusion reactor.`;

  // ── ANIMATE FUNCTION ──────────────────────────────────────────────────────
  function animate(time, speed) {
    const t = time * speed;

    // 1. Condensate cloud pulsation — individual particles oscillate
    if (meshes.condensateCloud && meshes.condensateCloud.children) {
      meshes.condensateCloud.children.forEach((drop, i) => {
        const phase = i * 0.15;
        const scale = 0.8 + 0.4 * Math.sin(t * 2 + phase);
        drop.scale.set(scale, scale, scale);
        drop.position.x += Math.sin(t * 3 + phase) * 0.001;
        drop.position.y += Math.cos(t * 2.5 + phase) * 0.001;
      });
      meshes.condensateCloud.rotation.y = t * 0.3;
    }

    // 2. Incident wavefunction animation — propagating wave toward barrier
    meshes.incidentWaveSlices.forEach((slice, i) => {
      const phase = t * 4 - i * 0.3;
      const amp = 0.3 + 0.2 * Math.abs(Math.sin(phase));
      slice.material.opacity = amp;
      const scaleVal = 0.7 + 0.5 * Math.abs(Math.sin(phase));
      slice.scale.set(scaleVal, scaleVal, 1);
    });

    // 3. Tunneling decay region — pulsing exponential decay
    meshes.tunnelingSlices.forEach((slice, i) => {
      const decay = Math.exp(-i * 0.18);
      const pulse = 0.3 + 0.15 * Math.sin(t * 3 - i * 0.2);
      slice.material.opacity = decay * pulse;
      slice.scale.set(decay, decay, 1);
    });

    // 4. Transmitted wave animation
    meshes.transmittedSlices.forEach((slice, i) => {
      const phase = t * 4 - i * 0.3;
      const amp = 0.15 + 0.1 * Math.abs(Math.sin(phase));
      slice.material.opacity = amp;
      const scaleVal = 0.3 + 0.15 * Math.abs(Math.sin(phase));
      slice.scale.set(scaleVal, scaleVal, 1);
    });

    // 5. Tunneling object oscillation — bounces toward and through barrier
    if (meshes.tunnelingObject) {
      const objZ = -5 + 7 * (0.5 + 0.5 * Math.sin(t * 0.5));
      meshes.tunnelingObject.position.z = objZ;
      meshes.tunnelingObject.rotation.x = t * 0.8;
      meshes.tunnelingObject.rotation.y = t * 1.2;

      // Probability shell expansion when inside barrier
      const inBarrier = Math.abs(objZ) < 1.5;
      meshes.tunnelingObject.children.forEach(child => {
        if (child.name === 'probabilityShell') {
          const targetScale = inBarrier ? 2.0 + Math.sin(t * 5) * 0.5 : 1.0;
          child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
          child.material.opacity = inBarrier ? 0.15 + 0.1 * Math.sin(t * 8) : 0.25;
        }
        if (child.name && child.name.startsWith('coherenceRing_')) {
          const idx = parseInt(child.name.split('_')[1]);
          child.rotation.x += 0.02 * (idx + 1);
          child.rotation.z += 0.015 * (idx + 1);
        }
      });
    }

    // 6. Probability density particles shimmer
    if (meshes.probParticles && meshes.probParticles.children) {
      meshes.probParticles.children.forEach((p, i) => {
        p.position.y += Math.sin(t * 2 + i * 0.5) * 0.002;
        p.position.x += Math.cos(t * 1.5 + i * 0.3) * 0.001;
      });
    }

    // 7. Barrier field pulsation
    if (meshes.barrierWall) {
      meshes.barrierWall.material.opacity = 0.2 + 0.15 * Math.sin(t * 2);
      meshes.barrierWall.rotation.y = t * 0.1;
    }
    if (meshes.barrierGrid) {
      meshes.barrierGrid.rotation.y = -t * 0.15;
      meshes.barrierGrid.material.opacity = 0.15 + 0.1 * Math.sin(t * 3);
    }

    // 8. Vacuum pump impeller spin
    if (meshes.impellerGroup) {
      meshes.impellerGroup.rotation.y = t * 15;
    }

    // 9. Reactor plasma core pulsation
    if (meshes.plasmaCore) {
      const plasmaScale = 1.0 + 0.15 * Math.sin(t * 4);
      meshes.plasmaCore.scale.set(plasmaScale, plasmaScale, plasmaScale);
      meshes.plasmaCore.material.emissiveIntensity = 1.5 + Math.sin(t * 6) * 0.8;
    }

    // 10. Laser cooling beams flicker
    if (meshes.laserBeams && meshes.laserBeams.children) {
      meshes.laserBeams.children.forEach((beam, i) => {
        beam.material.emissiveIntensity = 2.0 + Math.sin(t * 10 + i) * 1.0;
      });
    }

    // 11. Transmission/Reflection bars animate
    if (meshes.tBar) {
      const tCoeff = 0.1 + 0.05 * Math.sin(t * 0.5);
      meshes.tBar.scale.y = tCoeff * 5;
    }
    if (meshes.rBar) {
      const rCoeff = 1.0 - (0.1 + 0.05 * Math.sin(t * 0.5));
      meshes.rBar.scale.y = rCoeff;
    }

    // 12. Gravitational emitter tips pulse
    group.traverse(child => {
      if (child.name && child.name.startsWith('gravEmitterTip_')) {
        const idx = parseInt(child.name.split('_')[1]);
        child.material.emissiveIntensity = 1.5 + Math.sin(t * 4 + idx * 0.8) * 1.0;
        const tipScale = 1.0 + 0.2 * Math.sin(t * 3 + idx);
        child.scale.set(tipScale, tipScale, tipScale);
      }
      if (child.name && child.name.startsWith('coherenceNozzleGlow_')) {
        const idx = parseInt(child.name.split('_')[1]);
        child.material.emissiveIntensity = 1.2 + Math.sin(t * 5 + idx * 0.5) * 0.8;
      }
      if (child.name && child.name.startsWith('detectorLight_')) {
        const idx = parseInt(child.name.split('_')[1]);
        child.material.emissiveIntensity = 1.0 + Math.sin(t * 8 + idx * 1.5) * 1.0;
      }
      if (child.name && child.name.startsWith('reactorContainmentRing_')) {
        const idx = parseInt(child.name.split('_')[1]);
        child.rotation.x += 0.01 * (idx + 1);
        child.rotation.z += 0.008 * (idx + 1);
      }
      if (child.name && child.name.startsWith('superconductingRing_')) {
        child.material.emissiveIntensity = 0.5 + 0.3 * Math.sin(t * 2);
      }
      if (child.name === 'emergencyStopButton') {
        child.material.emissiveIntensity = 2.0 + Math.sin(t * 6) * 1.0;
      }
      if (child.name === 'vacuumGaugeGlow') {
        child.material.emissiveIntensity = 1.0 + 0.5 * Math.sin(t * 1.5);
      }
      if (child.name === 'tempScreenGlow') {
        child.material.emissiveIntensity = 1.2 + 0.4 * Math.sin(t * 2);
      }
    });

    // 13. Display console wavefunction graph animation
    if (meshes.waveGraph && meshes.waveGraph.children) {
      meshes.waveGraph.children.forEach((bar, i) => {
        const xNorm = i / meshes.waveGraph.children.length;
        let height;
        if (xNorm < 0.4) {
          height = 0.4 * Math.abs(Math.sin(xNorm * 20 - t * 3)) + 0.1;
        } else if (xNorm < 0.6) {
          height = 0.4 * Math.exp(-(xNorm - 0.4) * 8) * (0.8 + 0.2 * Math.sin(t * 2));
        } else {
          height = 0.1 * Math.abs(Math.sin(xNorm * 20 - t * 3)) + 0.02;
        }
        bar.scale.y = height * 3;
      });
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
