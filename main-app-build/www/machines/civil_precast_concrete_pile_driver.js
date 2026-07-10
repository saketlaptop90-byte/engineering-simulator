import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── CUSTOM MATERIALS ─────────────────────────────────────────────────────────
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.8,
    metalness: 0.3, roughness: 0.4
  });
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffee, emissive: 0x00ccbb, emissiveIntensity: 1.0,
    metalness: 0.5, roughness: 0.2, transparent: true, opacity: 0.85
  });
  const neonYellow = new THREE.MeshStandardMaterial({
    color: 0xffee00, emissive: 0xddcc00, emissiveIntensity: 0.7,
    metalness: 0.2, roughness: 0.3
  });
  const warningStripe = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0x552200, emissiveIntensity: 0.3,
    metalness: 0.4, roughness: 0.5
  });
  const hydraulicRed = new THREE.MeshStandardMaterial({
    color: 0xcc2222, emissive: 0x661111, emissiveIntensity: 0.4,
    metalness: 0.6, roughness: 0.3
  });
  const heavyYellow = new THREE.MeshStandardMaterial({
    color: 0xf0c030, emissive: 0x443300, emissiveIntensity: 0.15,
    metalness: 0.35, roughness: 0.55
  });
  const cableBlack = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.1, roughness: 0.9
  });
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, metalness: 0.05, roughness: 0.95
  });
  const pilotLight = new THREE.MeshStandardMaterial({
    color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.9
  });
  const exhaustMat = new THREE.MeshStandardMaterial({
    color: 0x333333, metalness: 0.7, roughness: 0.4
  });

  const meshes = {};

  // ─── HELPER: Create a tread lug ───────────────────────────────────────────────
  function createTreadLug(w, h, d) {
    const geo = new THREE.BoxGeometry(w, h, d);
    return geo;
  }

  // ─── TRACKED BASE (CRAWLER UNDERCARRIAGE) ─────────────────────────────────────
  const baseGroup = new THREE.Group();
  group.add(baseGroup);

  // Main chassis frame
  const chassisGeo = new THREE.BoxGeometry(3.8, 0.5, 2.0);
  const chassis = new THREE.Mesh(chassisGeo, heavyYellow);
  chassis.position.set(0, 0.8, 0);
  chassis.castShadow = true;
  baseGroup.add(chassis);
  meshes.chassis = chassis;

  // Chassis reinforcement ribs
  for (let i = -1.5; i <= 1.5; i += 0.5) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 2.05), darkSteel);
    rib.position.set(i, 0.8, 0);
    baseGroup.add(rib);
  }

  // Undercarriage beams
  for (let side = -1; side <= 1; side += 2) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 0.35), darkSteel);
    beam.position.set(0, 0.35, side * 1.15);
    beam.castShadow = true;
    baseGroup.add(beam);
  }

  // ─── CRAWLER TRACKS (REALISTIC) ──────────────────────────────────────────────
  function createCrawlerTrack(zPos) {
    const trackGroup = new THREE.Group();

    // Drive sprocket (front)
    const sprocketGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
    const sprocketFront = new THREE.Mesh(sprocketGeo, darkSteel);
    sprocketFront.rotation.x = Math.PI / 2;
    sprocketFront.position.set(1.9, 0.35, 0);
    trackGroup.add(sprocketFront);

    // Sprocket teeth
    for (let t = 0; t < 10; t++) {
      const angle = (t / 10) * Math.PI * 2;
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.32), steel);
      tooth.position.set(1.9 + Math.cos(angle) * 0.35, 0.35 + Math.sin(angle) * 0.35, 0);
      tooth.rotation.z = angle;
      trackGroup.add(tooth);
    }

    // Idler wheel (rear)
    const idlerGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.28, 16);
    const idler = new THREE.Mesh(idlerGeo, darkSteel);
    idler.rotation.x = Math.PI / 2;
    idler.position.set(-1.9, 0.3, 0);
    trackGroup.add(idler);

    // Track rollers (bottom)
    for (let r = -1.3; r <= 1.3; r += 0.52) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12), steel);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(r, 0.12, 0);
      trackGroup.add(roller);
    }

    // Top carrier rollers
    for (let r = -0.8; r <= 0.8; r += 0.8) {
      const carrier = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 10), steel);
      carrier.rotation.x = Math.PI / 2;
      carrier.position.set(r, 0.6, 0);
      trackGroup.add(carrier);
    }

    // Track links (chain pads) – realistic tread pattern
    const linkCount = 44;
    const trackPath = [];
    // Build track path: bottom straight, front curve, top straight, rear curve
    // Bottom
    for (let i = 0; i <= 16; i++) {
      trackPath.push(new THREE.Vector3(-1.9 + (i / 16) * 3.8, 0.0, 0));
    }
    // Front curve
    for (let i = 1; i <= 6; i++) {
      const a = -Math.PI / 2 + (i / 6) * Math.PI;
      trackPath.push(new THREE.Vector3(1.9 + Math.cos(a) * 0.35, 0.35 + Math.sin(a) * 0.35, 0));
    }
    // Top
    for (let i = 0; i <= 16; i++) {
      trackPath.push(new THREE.Vector3(1.9 - (i / 16) * 3.8, 0.7, 0));
    }
    // Rear curve
    for (let i = 1; i <= 5; i++) {
      const a = Math.PI / 2 + (i / 5) * Math.PI;
      trackPath.push(new THREE.Vector3(-1.9 + Math.cos(a) * 0.3, 0.3 + Math.sin(a) * 0.3, 0));
    }

    // Place track pads along path
    for (let i = 0; i < linkCount && i < trackPath.length; i++) {
      const idx = Math.floor((i / linkCount) * trackPath.length);
      const pos = trackPath[idx];
      if (!pos) continue;

      // Track pad
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.06, 0.34), rubber);
      pad.position.copy(pos);
      trackGroup.add(pad);

      // Tread lugs (grouser bars)
      const lug = new THREE.Mesh(createTreadLug(0.15, 0.03, 0.04), darkSteel);
      lug.position.set(pos.x, pos.y - 0.04, pos.z);
      trackGroup.add(lug);
    }

    // Track guard / cover plate
    const guard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.05, 0.38), heavyYellow);
    guard.position.set(0, 0.73, 0);
    trackGroup.add(guard);

    trackGroup.position.set(0, 0, zPos);
    return trackGroup;
  }

  const leftTrack = createCrawlerTrack(-1.15);
  const rightTrack = createCrawlerTrack(1.15);
  baseGroup.add(leftTrack);
  baseGroup.add(rightTrack);
  meshes.leftTrack = leftTrack;
  meshes.rightTrack = rightTrack;

  // ─── SUPERSTRUCTURE / UPPER BODY ──────────────────────────────────────────────
  const upperGroup = new THREE.Group();
  upperGroup.position.set(0, 1.05, 0);
  group.add(upperGroup);

  // Turntable / slew ring
  const slewRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.08, 12, 32),
    chrome
  );
  slewRing.rotation.x = Math.PI / 2;
  slewRing.position.set(0, 0, 0);
  upperGroup.add(slewRing);
  meshes.slewRing = slewRing;

  // Engine compartment
  const engineBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.6), heavyYellow);
  engineBox.position.set(-0.8, 0.5, 0);
  engineBox.castShadow = true;
  upperGroup.add(engineBox);
  meshes.engineBox = engineBox;

  // Engine louvers
  for (let lv = -0.5; lv <= 0.5; lv += 0.12) {
    const louver = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 1.2), darkSteel);
    louver.position.set(-1.69, 0.5 + lv, 0);
    upperGroup.add(louver);
  }

  // Exhaust stack
  const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.2, 12), exhaustMat);
  exhaustPipe.position.set(-1.2, 1.2, 0.5);
  upperGroup.add(exhaustPipe);
  const exhaustCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.1, 12), darkSteel);
  exhaustCap.position.set(-1.2, 1.8, 0.5);
  upperGroup.add(exhaustCap);
  meshes.exhaustPipe = exhaustPipe;

  // Counterweight
  const counterweightShape = new THREE.Shape();
  counterweightShape.moveTo(-0.8, 0);
  counterweightShape.lineTo(0.8, 0);
  counterweightShape.lineTo(0.7, 0.6);
  counterweightShape.lineTo(-0.7, 0.6);
  counterweightShape.closePath();
  const cwExtrudeSettings = { depth: 0.7, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 };
  const counterweight = new THREE.Mesh(
    new THREE.ExtrudeGeometry(counterweightShape, cwExtrudeSettings),
    darkSteel
  );
  counterweight.position.set(-1.3, 0.0, -0.35);
  counterweight.rotation.y = Math.PI / 2;
  counterGroup_addToUpper(counterweight, upperGroup);
  meshes.counterweight = counterweight;

  function counterGroup_addToUpper(mesh, parent) {
    parent.add(mesh);
  }

  // ─── OPERATOR CABIN ───────────────────────────────────────────────────────────
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(0.6, 0.0, -0.5);
  upperGroup.add(cabinGroup);

  // Cabin frame
  const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.0), heavyYellow);
  cabinBase.position.set(0, 0.05, 0);
  cabinGroup.add(cabinBase);

  // Cabin body with rounded edges (LatheGeometry-inspired box)
  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.2, 0.95), heavyYellow);
  cabBody.position.set(0, 0.7, 0);
  cabBody.castShadow = true;
  cabinGroup.add(cabBody);

  // Cabin roof
  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.05), darkSteel);
  cabRoof.position.set(0, 1.33, 0);
  cabinGroup.add(cabRoof);

  // Tinted windows
  const windowFront = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.7), tinted);
  windowFront.position.set(0.56, 0.85, 0);
  windowFront.rotation.y = Math.PI / 2;
  cabinGroup.add(windowFront);

  const windowSide1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.7), tinted);
  windowSide1.position.set(0, 0.85, 0.481);
  cabinGroup.add(windowSide1);

  const windowSide2 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.7), tinted);
  windowSide2.position.set(0, 0.85, -0.481);
  windowSide2.rotation.y = Math.PI;
  cabinGroup.add(windowSide2);

  // Door handle
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.15), chrome);
  handle.position.set(0.57, 0.55, 0.2);
  cabinGroup.add(handle);

  // Steps / ladder to cabin
  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.4), darkSteel);
    step.position.set(0.75, -0.1 + s * 0.25, 0.2);
    cabinGroup.add(step);
    // Step brackets
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), steel);
    bracket.position.set(0.75, -0.1 + s * 0.25, 0.42);
    cabinGroup.add(bracket);
  }

  // Side mirror
  const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 0.02), chrome);
  mirrorArm.position.set(0.7, 1.15, -0.5);
  cabinGroup.add(mirrorArm);
  const mirrorFace = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.1), glass);
  mirrorFace.position.set(0.83, 1.15, -0.5);
  mirrorFace.rotation.y = Math.PI / 2;
  cabinGroup.add(mirrorFace);

  meshes.cabin = cabinGroup;

  // ─── HEADLIGHTS ───────────────────────────────────────────────────────────────
  for (let hl = -1; hl <= 1; hl += 2) {
    const headlightHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.06, 16), darkSteel);
    headlightHousing.rotation.z = Math.PI / 2;
    headlightHousing.position.set(1.15, 0.85, hl * 0.55);
    upperGroup.add(headlightHousing);

    const headlightLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffcc, emissiveIntensity: 1.2, transparent: true, opacity: 0.9 })
    );
    headlightLens.rotation.y = Math.PI / 2;
    headlightLens.position.set(1.18, 0.85, hl * 0.55);
    upperGroup.add(headlightLens);
  }

  // ─── VERTICAL LEADS (MAST / LEADER) ──────────────────────────────────────────
  const mastGroup = new THREE.Group();
  mastGroup.position.set(1.0, 1.05, 0);
  group.add(mastGroup);
  meshes.mastGroup = mastGroup;

  const mastHeight = 8.0;

  // Main lead rails (H-section beams)
  for (let side = -1; side <= 1; side += 2) {
    // Front flange
    const flangeF = new THREE.Mesh(new THREE.BoxGeometry(0.08, mastHeight, 0.25), steel);
    flangeF.position.set(0.05, mastHeight / 2, side * 0.3);
    flangeF.castShadow = true;
    mastGroup.add(flangeF);

    // Rear flange
    const flangeR = new THREE.Mesh(new THREE.BoxGeometry(0.08, mastHeight, 0.25), steel);
    flangeR.position.set(-0.15, mastHeight / 2, side * 0.3);
    flangeR.castShadow = true;
    mastGroup.add(flangeR);

    // Web connecting flanges
    const web = new THREE.Mesh(new THREE.BoxGeometry(0.2, mastHeight, 0.04), steel);
    web.position.set(-0.05, mastHeight / 2, side * 0.3);
    mastGroup.add(web);
  }

  // Cross bracing on leads
  for (let h = 0.5; h < mastHeight; h += 0.8) {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.56), steel);
    brace.position.set(-0.05, h, 0);
    mastGroup.add(brace);

    // Diagonal braces (X-pattern)
    if (h < mastHeight - 1) {
      const diagGeo = new THREE.BoxGeometry(0.02, 1.0, 0.02);
      const diag1 = new THREE.Mesh(diagGeo, steel);
      diag1.position.set(-0.05, h + 0.4, 0.15);
      diag1.rotation.x = 0.5;
      mastGroup.add(diag1);
      const diag2 = new THREE.Mesh(diagGeo, steel);
      diag2.position.set(-0.05, h + 0.4, -0.15);
      diag2.rotation.x = -0.5;
      mastGroup.add(diag2);
    }
  }

  // Top sheave assembly
  const topSheaveHousing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.7), darkSteel);
  topSheaveHousing.position.set(-0.05, mastHeight + 0.12, 0);
  mastGroup.add(topSheaveHousing);

  const topSheave = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), chrome);
  topSheave.rotation.y = Math.PI / 2;
  topSheave.position.set(-0.05, mastHeight + 0.12, 0);
  mastGroup.add(topSheave);
  meshes.topSheave = topSheave;

  // Warning light on top
  const warningLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff3300, emissiveIntensity: 1.5, transparent: true, opacity: 0.9 })
  );
  warningLight.position.set(-0.05, mastHeight + 0.4, 0);
  mastGroup.add(warningLight);
  meshes.warningLight = warningLight;

  // ─── MAST SUPPORT STRUTS (A-frame backstay) ───────────────────────────────────
  for (let side = -1; side <= 1; side += 2) {
    // Rear stay from top of mast to superstructure
    const stayLen = 5.5;
    const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, stayLen, 8), steel);
    stay.position.set(-1.5, 4.5, side * 0.4);
    stay.rotation.z = 0.55;
    group.add(stay);

    // Hydraulic mast adjust cylinder
    const hydCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.8, 10), hydraulicRed);
    hydCyl.position.set(0.3, 3.0, side * 0.55);
    hydCyl.rotation.z = 0.12;
    group.add(hydCyl);

    const hydRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 8), chrome);
    hydRod.position.set(0.35, 4.8, side * 0.55);
    hydRod.rotation.z = 0.12;
    group.add(hydRod);
  }

  // ─── DROP HAMMER ──────────────────────────────────────────────────────────────
  const hammerGroup = new THREE.Group();
  hammerGroup.position.set(1.0, 3.5, 0);
  group.add(hammerGroup);
  meshes.hammerGroup = hammerGroup;

  // Hammer body (heavy steel block)
  const hammerBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 1.2, 0.45),
    darkSteel
  );
  hammerBody.position.set(-0.05, 0, 0);
  hammerBody.castShadow = true;
  hammerGroup.add(hammerBody);

  // Hammer weight rings
  for (let r = -0.4; r <= 0.4; r += 0.2) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 16), steel);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-0.05, r, 0);
    hammerGroup.add(ring);
  }

  // Hammer guide shoes (slide on leads)
  for (let side = -1; side <= 1; side += 2) {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.08), chrome);
    shoe.position.set(-0.05, 0.45, side * 0.3);
    hammerGroup.add(shoe);
    const shoe2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.08), chrome);
    shoe2.position.set(-0.05, -0.45, side * 0.3);
    hammerGroup.add(shoe2);
  }

  // Impact plate (bottom of hammer)
  const impactPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), chrome);
  impactPlate.position.set(-0.05, -0.64, 0);
  hammerGroup.add(impactPlate);

  // Neon indicator strips on hammer
  for (let ns = -0.3; ns <= 0.3; ns += 0.3) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.46), neonOrange);
    strip.position.set(-0.05, ns, 0);
    hammerGroup.add(strip);
  }

  // ─── PILE HELMET / DRIVE CAP ──────────────────────────────────────────────────
  const helmetGroup = new THREE.Group();
  helmetGroup.position.set(1.0, 1.8, 0);
  group.add(helmetGroup);
  meshes.helmetGroup = helmetGroup;

  // Helmet outer shell
  const helmetOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.5, 16), darkSteel);
  helmetOuter.position.set(-0.05, 0, 0);
  helmetOuter.castShadow = true;
  helmetGroup.add(helmetOuter);

  // Cushion pad (inside helmet)
  const cushionPad = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16), rubber);
  cushionPad.position.set(-0.05, 0.2, 0);
  helmetGroup.add(cushionPad);

  // Guide collar
  const guideCollar = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 20), steel);
  guideCollar.position.set(-0.05, 0.15, 0);
  helmetGroup.add(guideCollar);

  // Helmet glow ring
  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.015, 8, 24),
    neonCyan
  );
  glowRing.position.set(-0.05, -0.1, 0);
  helmetGroup.add(glowRing);
  meshes.glowRing = glowRing;

  // ─── PRECAST CONCRETE PILE ────────────────────────────────────────────────────
  const pileGroup = new THREE.Group();
  pileGroup.position.set(1.0, 0, 0);
  group.add(pileGroup);
  meshes.pileGroup = pileGroup;

  // Square precast pile
  const pileGeo = new THREE.BoxGeometry(0.35, 3.0, 0.35);
  const pile = new THREE.Mesh(pileGeo, concreteMat);
  pile.position.set(-0.05, -0.3, 0);
  pile.castShadow = true;
  pileGroup.add(pile);

  // Rebar ends visible at top
  for (let rx = -0.1; rx <= 0.1; rx += 0.2) {
    for (let rz = -0.1; rz <= 0.1; rz += 0.2) {
      const rebar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), steel);
      rebar.position.set(-0.05 + rx, 1.24, rz);
      pileGroup.add(rebar);
    }
  }

  // Pile point (shoe)
  const pilePoint = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.4, 4),
    steel
  );
  pilePoint.rotation.y = Math.PI / 4;
  pilePoint.position.set(-0.05, -2.0, 0);
  pileGroup.add(pilePoint);

  // ─── WINCH DRUMS ──────────────────────────────────────────────────────────────
  const winchGroup = new THREE.Group();
  winchGroup.position.set(-0.5, 1.55, 0);
  upperGroup.add(winchGroup);
  meshes.winchGroup = winchGroup;

  function createWinchDrum(xPos, zPos) {
    const drumGroup = new THREE.Group();

    // Drum cylinder
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 16), steel);
    drum.rotation.x = Math.PI / 2;
    drum.position.set(0, 0, 0);
    drumGroup.add(drum);

    // Drum flanges
    for (let f = -1; f <= 1; f += 2) {
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16), darkSteel);
      flange.rotation.x = Math.PI / 2;
      flange.position.set(0, 0, f * 0.18);
      drumGroup.add(flange);
    }

    // Cable wound around drum
    for (let c = -0.12; c <= 0.12; c += 0.03) {
      const cableWrap = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.012, 6, 20), cableBlack);
      cableWrap.rotation.y = Math.PI / 2;
      cableWrap.position.set(0, 0, c);
      drumGroup.add(cableWrap);
    }

    // Brake band
    const brakeBand = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.008, 6, 20), hydraulicRed);
    brakeBand.rotation.y = Math.PI / 2;
    brakeBand.position.set(0, 0, 0.2);
    drumGroup.add(brakeBand);

    drumGroup.position.set(xPos, 0, zPos);
    return drumGroup;
  }

  const mainWinch = createWinchDrum(0, -0.35);
  const auxWinch = createWinchDrum(0, 0.35);
  winchGroup.add(mainWinch);
  winchGroup.add(auxWinch);
  meshes.mainWinch = mainWinch;
  meshes.auxWinch = auxWinch;

  // Winch motor housing
  const winchMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12), darkSteel);
  winchMotor.rotation.x = Math.PI / 2;
  winchMotor.position.set(-0.3, 0, 0);
  winchGroup.add(winchMotor);

  // ─── WIRE ROPES (From winch to top sheave to hammer) ──────────────────────────
  const ropePath = [
    new THREE.Vector3(-0.5, 1.55 + 1.05, -0.35),
    new THREE.Vector3(0.5, 4.0, -0.2),
    new THREE.Vector3(1.0, mastHeight + 1.05 + 0.12, 0),
  ];
  const ropeCurve = new THREE.CatmullRomCurve3(ropePath);
  const ropeGeo = new THREE.TubeGeometry(ropeCurve, 20, 0.012, 6, false);
  const rope = new THREE.Mesh(ropeGeo, cableBlack);
  group.add(rope);

  // Second rope to hammer
  const ropePath2 = [
    new THREE.Vector3(1.0, mastHeight + 1.05 + 0.12, 0),
    new THREE.Vector3(1.0, 4.5, 0),
  ];
  const ropeCurve2 = new THREE.CatmullRomCurve3(ropePath2);
  const ropeGeo2 = new THREE.TubeGeometry(ropeCurve2, 10, 0.012, 6, false);
  const rope2 = new THREE.Mesh(ropeGeo2, cableBlack);
  group.add(rope2);

  // ─── HYDRAULIC LINES (TubeGeometry) ───────────────────────────────────────────
  function createHydraulicLine(points, radius, mat) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 16, radius || 0.015, 6, false);
    const mesh = new THREE.Mesh(geo, mat || hydraulicRed);
    group.add(mesh);
    return mesh;
  }

  // Line from engine to winch
  createHydraulicLine([
    new THREE.Vector3(-0.3, 1.7, 0.4),
    new THREE.Vector3(-0.1, 2.0, 0.3),
    new THREE.Vector3(-0.3, 2.4, 0.1),
  ]);

  // Line from engine to mast hydraulic cylinder
  createHydraulicLine([
    new THREE.Vector3(-0.5, 1.6, -0.5),
    new THREE.Vector3(0.0, 2.5, -0.55),
    new THREE.Vector3(0.3, 3.5, -0.55),
  ]);

  // Fuel line
  createHydraulicLine([
    new THREE.Vector3(-1.2, 1.3, -0.3),
    new THREE.Vector3(-1.0, 1.2, -0.5),
    new THREE.Vector3(-0.7, 1.4, -0.6),
  ], 0.01, copper);

  // ─── SPOTTER PLATFORM ─────────────────────────────────────────────────────────
  const spotterGroup = new THREE.Group();
  spotterGroup.position.set(1.0, 1.3, 0);
  group.add(spotterGroup);
  meshes.spotterGroup = spotterGroup;

  // Platform deck
  const spotDeck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 1.0), steel);
  spotDeck.position.set(0.4, 0, 0);
  spotterGroup.add(spotDeck);

  // Diamond plate texture (visual rivets)
  for (let dx = -0.3; dx <= 0.3; dx += 0.15) {
    for (let dz = -0.4; dz <= 0.4; dz += 0.15) {
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), darkSteel);
      rivet.position.set(0.4 + dx, 0.025, dz);
      spotterGroup.add(rivet);
    }
  }

  // Safety railing
  const railHeight = 0.6;
  // Posts
  const railPositions = [
    [0.0, 0.5], [0.0, -0.5], [0.8, 0.5], [0.8, -0.5], [0.4, 0.5], [0.4, -0.5]
  ];
  railPositions.forEach(([rx, rz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, railHeight, 8), neonYellow);
    post.position.set(rx, railHeight / 2, rz);
    spotterGroup.add(post);
  });

  // Horizontal rails
  for (let rh = 0.3; rh <= 0.6; rh += 0.3) {
    // Side rails
    for (let sz = -1; sz <= 1; sz += 2) {
      const hRail = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.02), neonYellow);
      hRail.position.set(0.4, rh, sz * 0.5);
      spotterGroup.add(hRail);
    }
    // Front rail
    const fRail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 1.0), neonYellow);
    fRail.position.set(0.8, rh, 0);
    spotterGroup.add(fRail);
  }

  // Toe board
  const toeBoard = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.08, 0.02), neonYellow);
  toeBoard.position.set(0.4, 0.04, 0.5);
  spotterGroup.add(toeBoard);
  const toeBoard2 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.08, 0.02), neonYellow);
  toeBoard2.position.set(0.4, 0.04, -0.5);
  spotterGroup.add(toeBoard2);

  // ─── PANEL LINES & RIVETS ON ENGINE BOX ───────────────────────────────────────
  for (let px = -0.6; px <= 0.6; px += 0.4) {
    const panelLine = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.9, 1.62), darkSteel);
    panelLine.position.set(-0.8 + px * 0.5, 1.55, 0);
    upperGroup.add(panelLine);
  }

  // Rivets along chassis
  for (let rv = -1.7; rv <= 1.7; rv += 0.3) {
    for (let side = -1; side <= 1; side += 2) {
      const rivetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), chrome);
      rivetMesh.position.set(rv, 0.95, side * 1.0);
      baseGroup.add(rivetMesh);
    }
  }

  // ─── FUEL TANK ────────────────────────────────────────────────────────────────
  const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12), darkSteel);
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(-1.0, 0.35, 0.65);
  upperGroup.add(fuelTank);
  // Fuel cap
  const fuelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8), chrome);
  fuelCap.position.set(-1.0, 0.5, 0.65);
  upperGroup.add(fuelCap);

  // ─── CONTROL PANEL (NEON DETAILS) ─────────────────────────────────────────────
  const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.02), darkSteel);
  controlPanel.position.set(0.3, 0.7, -0.97);
  cabinGroup.add(controlPanel);

  // Indicator lights
  const indicatorColors = [pilotLight, neonOrange, neonCyan];
  indicatorColors.forEach((mat, idx) => {
    const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), mat);
    indicator.position.set(0.2 + idx * 0.08, 0.75, -0.98);
    cabinGroup.add(indicator);
  });

  // ─── NEON ACCENT STRIPS ───────────────────────────────────────────────────────
  // Chassis neon underglow
  for (let side = -1; side <= 1; side += 2) {
    const neonStrip = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.015, 0.02), neonCyan);
    neonStrip.position.set(0, 0.55, side * 1.01);
    baseGroup.add(neonStrip);
  }

  // Mast neon guide strips
  for (let side = -1; side <= 1; side += 2) {
    const mastNeon = new THREE.Mesh(new THREE.BoxGeometry(0.01, mastHeight, 0.01), neonOrange);
    mastNeon.position.set(0.1, mastHeight / 2, side * 0.42);
    mastGroup.add(mastNeon);
  }

  // ─── SAFETY DECALS / WARNING STRIPES ──────────────────────────────────────────
  for (let ws = 0; ws < 4; ws++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.01), warningStripe);
    stripe.position.set(-0.05, 0.5 + ws * 0.25, 0.24);
    hammerGroup.add(stripe);
  }

  // ─── Ground reference plane (soil) ────────────────────────────────────────────
  const groundPlane = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 2.5, 24),
    new THREE.MeshStandardMaterial({ color: 0x665533, roughness: 0.9, metalness: 0.05, side: THREE.DoubleSide })
  );
  groundPlane.rotation.x = -Math.PI / 2;
  groundPlane.position.set(1.0, -1.8, 0);
  group.add(groundPlane);

  // ─── PARTS CATALOG ────────────────────────────────────────────────────────────
  const parts = [
    {
      name: 'Crawler Track Assembly',
      description: 'Dual crawler tracks providing stable ground contact and mobility on soft soils during piling operations.',
      material: 'Manganese steel track links, hardened steel sprockets, rubber track pads',
      function: 'Distributes machine weight over large area to prevent sinking; enables repositioning between pile locations',
      assemblyOrder: 1,
      connections: ['Undercarriage frame', 'Drive sprockets', 'Hydraulic travel motors'],
      failureEffect: 'Machine becomes immobile; cannot reposition between pile points',
      cascadeFailures: ['Travel hydraulic circuit', 'Drive sprocket bearings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -2, z: 0 }
    },
    {
      name: 'Vertical Leads (Mast/Leader)',
      description: 'Tall H-section steel guide rails that constrain hammer travel and ensure vertical pile alignment.',
      material: 'High-strength structural steel (S355), cross-braced lattice construction',
      function: 'Guides the hammer and pile cap precisely along the vertical axis; maintains pile plumbness during driving',
      assemblyOrder: 3,
      connections: ['Superstructure pivot', 'Backstay struts', 'Top sheave assembly', 'Hammer guide shoes'],
      failureEffect: 'Hammer cannot track properly; pile driven out of plumb causing structural rejection',
      cascadeFailures: ['Hammer alignment', 'Pile integrity', 'Sheave assembly'],
      originalPosition: { x: 1.0, y: 1.05, z: 0 },
      explodedPosition: { x: 3.5, y: 1.05, z: 0 }
    },
    {
      name: 'Drop Hammer',
      description: 'Heavy steel mass raised by winch cable and released to impact pile helmet via gravity free-fall.',
      material: 'Cast steel body with chrome guide shoes, typical mass 3,000–7,000 kg',
      function: 'Converts potential energy to kinetic impact energy upon free-fall; drives pile into ground through repeated blows',
      assemblyOrder: 5,
      connections: ['Wire rope (winch)', 'Lead guide shoes', 'Pile helmet impact plate'],
      failureEffect: 'No driving force; piling operation halted completely',
      cascadeFailures: ['Wire rope integrity', 'Pile helmet cushion', 'Lead rail alignment'],
      originalPosition: { x: 1.0, y: 3.5, z: 0 },
      explodedPosition: { x: 1.0, y: 7.0, z: 0 }
    },
    {
      name: 'Pile Helmet / Drive Cap',
      description: 'Steel cap placed over pile head to distribute hammer impact evenly and protect pile from spalling.',
      material: 'Hardened steel shell with plywood/Micarta cushion pad',
      function: 'Distributes concentrated hammer blow across entire pile cross-section; absorbs stress waves to prevent pile head damage',
      assemblyOrder: 6,
      connections: ['Drop hammer (impact plate)', 'Pile head', 'Lead guide collar'],
      failureEffect: 'Direct hammer-to-pile contact causes spalling, brooming, and pile head destruction',
      cascadeFailures: ['Precast pile integrity', 'Hammer impact plate'],
      originalPosition: { x: 1.0, y: 1.8, z: 0 },
      explodedPosition: { x: 1.0, y: 5.5, z: 1.5 }
    },
    {
      name: 'Winch Drum Assembly',
      description: 'Dual hydraulic winch drums for hoisting hammer and handling/pitching piles.',
      material: 'Machined steel drums, multi-layer wire rope, hydraulic motor with band brake',
      function: 'Main winch raises drop hammer for each blow cycle; auxiliary winch lifts and positions piles from storage',
      assemblyOrder: 4,
      connections: ['Hydraulic power unit', 'Wire ropes', 'Top sheave', 'Brake system'],
      failureEffect: 'Cannot lift hammer or piles; complete operational shutdown',
      cascadeFailures: ['Hammer drop cycle', 'Pile handling', 'Brake system overload'],
      originalPosition: { x: -0.5, y: 2.6, z: 0 },
      explodedPosition: { x: -3.5, y: 2.6, z: 0 }
    },
    {
      name: 'Spotter Platform',
      description: 'Steel work platform with safety railings for crew to guide piles into leads and monitor driving.',
      material: 'Diamond plate steel deck, tubular safety railing with toe boards',
      function: 'Provides safe elevated working area for banksmen to position pile into leads and monitor plumbness',
      assemblyOrder: 7,
      connections: ['Lead base', 'Superstructure mounting', 'Safety railing system'],
      failureEffect: 'Workers cannot safely guide piles; increased risk of injury and misaligned piles',
      cascadeFailures: ['Worker safety', 'Pile positioning accuracy'],
      originalPosition: { x: 1.0, y: 1.3, z: 0 },
      explodedPosition: { x: 3.5, y: 0.0, z: 2.0 }
    },
    {
      name: 'Operator Cabin',
      description: 'Enclosed ROPS/FOPS cabin with tinted safety glass, climate control, and machine controls.',
      material: 'Welded steel frame, laminated tinted safety glass, vibration-damped mounts',
      function: 'Houses operator with full visibility of pile driving operation; contains hydraulic joysticks, winch controls, and monitoring displays',
      assemblyOrder: 2,
      connections: ['Superstructure', 'Control hydraulics', 'Electrical systems'],
      failureEffect: 'Operator exposed to elements and noise; cannot safely control machine',
      cascadeFailures: ['Control systems access', 'Operator safety'],
      originalPosition: { x: 0.6, y: 1.05, z: -0.5 },
      explodedPosition: { x: 0.6, y: 1.05, z: -3.5 }
    },
    {
      name: 'Precast Concrete Pile',
      description: 'Reinforced precast concrete pile with steel driving shoe and protruding rebar at the head.',
      material: 'High-strength precast concrete (C50/60) with 4-bar reinforcement cage, steel point shoe',
      function: 'Structural foundation element driven into soil to transfer building loads to competent bearing stratum',
      assemblyOrder: 8,
      connections: ['Pile helmet', 'Ground/soil', 'Lead guides'],
      failureEffect: 'No foundation support; building cannot be constructed',
      cascadeFailures: ['Structural loading path', 'Pile cap connection'],
      originalPosition: { x: 1.0, y: 0, z: 0 },
      explodedPosition: { x: 1.0, y: -4.0, z: 0 }
    }
  ];

  // ─── QUIZ QUESTIONS ───────────────────────────────────────────────────────────
  const quizQuestions = [
    {
      question: 'What is the primary function of the pile helmet (drive cap) during impact piling?',
      options: [
        'To increase the weight of the hammer',
        'To distribute the hammer blow evenly and protect the pile head from damage',
        'To guide the pile into the correct position in the leads',
        'To connect the pile to the building foundation'
      ],
      correct: 1,
      explanation: 'The pile helmet sits between the hammer and pile head, containing a cushion pad that distributes the concentrated impact force across the entire pile cross-section. Without it, the localized stress would cause spalling and brooming of the concrete pile head.',
      difficulty: 'medium'
    },
    {
      question: 'Why does a pile driver use crawler tracks instead of wheeled undercarriage?',
      options: [
        'Crawlers are cheaper to manufacture',
        'Crawlers distribute the heavy machine weight over a larger area, preventing sinking in soft construction soils',
        'Crawlers allow faster travel speed on highways',
        'Crawlers are required by safety regulations for all construction equipment'
      ],
      correct: 1,
      explanation: 'Pile drivers are extremely heavy machines operating on construction sites with often poor ground conditions. Crawler tracks distribute the machine\'s weight (often 40-80 tonnes) over a much larger surface area than wheels, dramatically reducing ground bearing pressure and preventing the machine from sinking.',
      difficulty: 'easy'
    },
    {
      question: 'In a drop hammer system, what determines the energy delivered per blow to the pile?',
      options: [
        'The speed at which the winch drum rotates',
        'The weight of the hammer multiplied by its free-fall drop height (E = mgh)',
        'The thickness of the pile helmet cushion',
        'The diameter of the wire rope'
      ],
      correct: 1,
      explanation: 'Drop hammer energy is purely gravitational potential energy converted to kinetic energy: E = mgh, where m is hammer mass, g is gravitational acceleration, and h is drop height. Operators control energy by adjusting the drop height via the winch. Typical energies range from 30-200 kJ per blow.',
      difficulty: 'medium'
    },
    {
      question: 'What is "pile set" and why is it critical during driving?',
      options: [
        'The concrete curing time required before driving begins',
        'The permanent penetration of the pile per hammer blow, used to determine when bearing capacity is achieved',
        'The alignment angle of the vertical leads',
        'The arrangement of piles in the foundation layout plan'
      ],
      correct: 1,
      explanation: 'Pile set is the net downward movement per blow (typically measured over the last 10 blows). As the pile reaches competent bearing stratum, set decreases. Engineers use dynamic pile driving formulae (like Hiley or ENR) relating hammer energy, set, and pile properties to verify that design bearing capacity has been achieved. "Refusal" is when set becomes negligibly small.',
      difficulty: 'hard'
    }
  ];

  // ─── DESCRIPTION ──────────────────────────────────────────────────────────────
  const description = `A Modern Precast Concrete Pile Driver is a heavy civil engineering machine used to drive prefabricated reinforced concrete piles into the ground for deep foundation construction. The machine features a crawler-mounted base for stability on construction sites, a diesel/hydraulic power unit, and tall vertical leads (leader/mast) that guide both the drop hammer and pile along a precise vertical path. The hammer is hoisted by a wire rope winch system, raised to a specified height, and released in free-fall to deliver impact energy through a cushioned pile helmet onto the pile head. Key components include dual winch drums (main hoist for hammer, auxiliary for pile handling), a spotter platform with safety railings for ground crew, hydraulic mast-positioning cylinders, and an enclosed ROPS/FOPS operator cabin. Driving continues until the pile achieves the required "set" (penetration per blow) confirming adequate bearing capacity per the structural engineer's specifications.`;

  // ─── ANIMATE ──────────────────────────────────────────────────────────────────
  function animate(time, speed, meshRefs) {
    const t = time * speed;

    // Hammer drop cycle (raise and drop periodically)
    if (meshRefs.hammerGroup) {
      // Create a sawtooth-like pattern: slow rise, quick drop
      const cycle = (t * 0.3) % 1.0;
      let hammerY;
      if (cycle < 0.7) {
        // Rising phase (70% of cycle)
        hammerY = 3.5 + (cycle / 0.7) * 3.5;
      } else {
        // Drop phase (30% of cycle) — fast fall
        const dropProgress = (cycle - 0.7) / 0.3;
        hammerY = 7.0 - dropProgress * 3.5;
      }
      meshRefs.hammerGroup.position.y = hammerY;
    }

    // Pile slowly sinking
    if (meshRefs.pileGroup) {
      const sinkAmount = Math.sin(t * 0.15) * 0.3 - 0.2;
      meshRefs.pileGroup.position.y = sinkAmount;
    }

    // Winch drums rotating
    if (meshRefs.mainWinch) {
      meshRefs.mainWinch.rotation.z = t * 2.0;
    }
    if (meshRefs.auxWinch) {
      meshRefs.auxWinch.rotation.z = -t * 1.5;
    }

    // Warning light pulsing
    if (meshRefs.warningLight) {
      const pulse = Math.sin(t * 8) * 0.5 + 0.5;
      meshRefs.warningLight.material.emissiveIntensity = 0.5 + pulse * 2.0;
      meshRefs.warningLight.material.opacity = 0.5 + pulse * 0.5;
    }

    // Glow ring on helmet pulsing
    if (meshRefs.glowRing) {
      const glowPulse = Math.sin(t * 3) * 0.5 + 0.5;
      meshRefs.glowRing.material.emissiveIntensity = 0.3 + glowPulse * 1.5;
      meshRefs.glowRing.material.opacity = 0.5 + glowPulse * 0.4;
    }

    // Top sheave spinning
    if (meshRefs.topSheave) {
      meshRefs.topSheave.rotation.x = t * 3.0;
    }

    // Slight engine vibration on the engine box
    if (meshRefs.engineBox) {
      meshRefs.engineBox.position.y = 0.5 + Math.sin(t * 25) * 0.003;
      meshRefs.engineBox.position.x = -0.8 + Math.cos(t * 30) * 0.002;
    }

    // Exhaust pipe slight heat shimmer (scale oscillation)
    if (meshRefs.exhaustPipe) {
      const shimmer = 1.0 + Math.sin(t * 12) * 0.02;
      meshRefs.exhaustPipe.scale.set(shimmer, 1, shimmer);
    }

    // Mast very slight sway (realism)
    if (meshRefs.mastGroup) {
      meshRefs.mastGroup.rotation.z = Math.sin(t * 0.8) * 0.003;
    }

    // Spotter platform subtle vibration during impact
    if (meshRefs.spotterGroup) {
      const cycle2 = (t * 0.3) % 1.0;
      if (cycle2 > 0.95) {
        meshRefs.spotterGroup.position.y = 1.3 + Math.sin(t * 40) * 0.01;
      } else {
        meshRefs.spotterGroup.position.y = 1.3;
      }
    }
  }

  return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createPrecastConcretePileDriver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
