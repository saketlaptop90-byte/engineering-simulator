import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── CUSTOM MATERIALS ───
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.7,
    metalness: 0.3, roughness: 0.4
  });
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00e5ff, emissive: 0x00ccff, emissiveIntensity: 0.9,
    metalness: 0.5, roughness: 0.2, transparent: true, opacity: 0.85
  });
  const glowRed = new THREE.MeshStandardMaterial({
    color: 0xff2020, emissive: 0xff0000, emissiveIntensity: 1.0,
    metalness: 0.2, roughness: 0.3
  });
  const glowGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff44, emissiveIntensity: 0.8,
    metalness: 0.3, roughness: 0.3
  });
  const glowWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.2,
    metalness: 0.1, roughness: 0.2
  });
  const deepOrange = new THREE.MeshStandardMaterial({
    color: 0xcc4400, metalness: 0.4, roughness: 0.5
  });
  const carbideMat = new THREE.MeshStandardMaterial({
    color: 0x888899, emissive: 0x334455, emissiveIntensity: 0.25,
    metalness: 0.95, roughness: 0.15
  });
  const hydraulicMat = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.85, roughness: 0.2
  });
  const chainMat = new THREE.MeshStandardMaterial({
    color: 0x333333, metalness: 0.9, roughness: 0.25
  });
  const panelOrange = new THREE.MeshStandardMaterial({
    color: 0xe65100, metalness: 0.35, roughness: 0.55
  });
  const gaugeGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff, emissive: 0x2288cc, emissiveIntensity: 0.4,
    transparent: true, opacity: 0.5, metalness: 0.1, roughness: 0.05
  });
  const exhaustMat = new THREE.MeshStandardMaterial({
    color: 0x555555, metalness: 0.8, roughness: 0.3
  });
  const seatMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.1, roughness: 0.85
  });
  const decalWhite = new THREE.MeshStandardMaterial({
    color: 0xeeeeee, metalness: 0.1, roughness: 0.6
  });

  const meshes = {};

  // ═══════════════════════════════════════════════════
  // 1. TRACKED BASE / UNDERCARRIAGE
  // ═══════════════════════════════════════════════════
  const trackBaseGroup = new THREE.Group();

  // Main chassis frame
  const chassisGeo = new THREE.BoxGeometry(3.2, 0.35, 1.4);
  const chassis = new THREE.Mesh(chassisGeo, darkSteel);
  chassis.position.set(0, 0.55, 0);
  trackBaseGroup.add(chassis);
  meshes.chassis = chassis;

  // Cross-members
  for (let i = -1.2; i <= 1.2; i += 0.6) {
    const crossGeo = new THREE.BoxGeometry(0.08, 0.12, 1.5);
    const cross = new THREE.Mesh(crossGeo, steel);
    cross.position.set(i, 0.45, 0);
    trackBaseGroup.add(cross);
  }

  // Build realistic tracks (left and right)
  function createTrackAssembly(side) {
    const trackGroup = new THREE.Group();
    const zPos = side * 0.85;

    // Track frame / side plate
    const framePath = new THREE.Shape();
    framePath.moveTo(-1.6, 0.15);
    framePath.lineTo(1.6, 0.15);
    framePath.quadraticCurveTo(1.85, 0.15, 1.85, 0.4);
    framePath.lineTo(1.85, 0.55);
    framePath.quadraticCurveTo(1.85, 0.8, 1.6, 0.8);
    framePath.lineTo(-1.6, 0.8);
    framePath.quadraticCurveTo(-1.85, 0.8, -1.85, 0.55);
    framePath.lineTo(-1.85, 0.4);
    framePath.quadraticCurveTo(-1.85, 0.15, -1.6, 0.15);

    const frameExt = new THREE.ExtrudeGeometry(framePath, { depth: 0.06, bevelEnabled: false });
    const outerPlate = new THREE.Mesh(frameExt, darkSteel);
    outerPlate.position.set(0, 0, zPos + side * 0.12);
    outerPlate.rotation.y = Math.PI / 2;
    outerPlate.rotation.x = Math.PI / 2;
    outerPlate.rotation.z = Math.PI / 2;
    trackGroup.add(outerPlate);

    // Drive sprocket (rear)
    const sprocketGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.14, 16);
    const sprocket = new THREE.Mesh(sprocketGeo, chrome);
    sprocket.rotation.x = Math.PI / 2;
    sprocket.position.set(-1.45, 0.48, zPos);
    trackGroup.add(sprocket);

    // Sprocket teeth
    for (let t = 0; t < 12; t++) {
      const angle = (t / 12) * Math.PI * 2;
      const toothGeo = new THREE.BoxGeometry(0.04, 0.08, 0.12);
      const tooth = new THREE.Mesh(toothGeo, steel);
      tooth.position.set(
        -1.45 + Math.cos(angle) * 0.3,
        0.48 + Math.sin(angle) * 0.3,
        zPos
      );
      tooth.rotation.z = angle;
      trackGroup.add(tooth);
    }

    // Idler (front)
    const idlerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 16);
    const idler = new THREE.Mesh(idlerGeo, chrome);
    idler.rotation.x = Math.PI / 2;
    idler.position.set(1.45, 0.48, zPos);
    trackGroup.add(idler);

    // Road wheels (bottom rollers)
    for (let w = -1.0; w <= 1.0; w += 0.5) {
      const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12);
      const wheel = new THREE.Mesh(wheelGeo, darkSteel);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(w, 0.22, zPos);
      trackGroup.add(wheel);
    }

    // Top roller
    const topRollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 10);
    const topRoller = new THREE.Mesh(topRollerGeo, darkSteel);
    topRoller.rotation.x = Math.PI / 2;
    topRoller.position.set(0, 0.72, zPos);
    trackGroup.add(topRoller);

    // Individual track links (pads)
    const totalLinks = 52;
    for (let i = 0; i < totalLinks; i++) {
      const t = i / totalLinks;
      let px, py, rot;

      // Approximate track path around sprocket-idler
      if (t < 0.35) {
        // bottom straight
        const lt = t / 0.35;
        px = -1.45 + lt * 2.9;
        py = 0.08;
        rot = 0;
      } else if (t < 0.5) {
        // front curve around idler
        const lt = (t - 0.35) / 0.15;
        const angle = -Math.PI / 2 + lt * Math.PI;
        px = 1.45 + Math.cos(angle) * 0.28;
        py = 0.48 + Math.sin(angle) * 0.28;
        rot = angle + Math.PI / 2;
      } else if (t < 0.85) {
        // top straight
        const lt = (t - 0.5) / 0.35;
        px = 1.45 - lt * 2.9;
        py = 0.82;
        rot = Math.PI;
      } else {
        // rear curve around sprocket
        const lt = (t - 0.85) / 0.15;
        const angle = Math.PI / 2 + lt * Math.PI;
        px = -1.45 + Math.cos(angle) * 0.28;
        py = 0.48 + Math.sin(angle) * 0.28;
        rot = angle + Math.PI / 2;
      }

      const linkGeo = new THREE.BoxGeometry(0.16, 0.06, 0.18);
      const link = new THREE.Mesh(linkGeo, rubber);
      link.position.set(px, py, zPos);
      link.rotation.z = rot;
      trackGroup.add(link);

      // Track grouser (tread lug)
      const grouserGeo = new THREE.BoxGeometry(0.12, 0.03, 0.2);
      const grouser = new THREE.Mesh(grouserGeo, darkSteel);
      grouser.position.set(
        px - Math.sin(rot) * 0.045,
        py + Math.cos(rot) * 0.045,
        zPos
      );
      grouser.rotation.z = rot;
      trackGroup.add(grouser);
    }

    return trackGroup;
  }

  const leftTrack = createTrackAssembly(1);
  const rightTrack = createTrackAssembly(-1);
  trackBaseGroup.add(leftTrack);
  trackBaseGroup.add(rightTrack);
  meshes.leftTrack = leftTrack;
  meshes.rightTrack = rightTrack;

  group.add(trackBaseGroup);
  meshes.trackBase = trackBaseGroup;

  // ═══════════════════════════════════════════════════
  // 2. ENGINE COMPARTMENT (rear section)
  // ═══════════════════════════════════════════════════
  const engineGroup = new THREE.Group();

  // Main engine housing - rounded shape via LatheGeometry cross-section
  const engineBodyGeo = new THREE.BoxGeometry(1.2, 0.9, 1.2);
  const edges = 0.05;
  const engineBody = new THREE.Mesh(engineBodyGeo, panelOrange);
  engineBody.position.set(-0.8, 1.25, 0);
  engineGroup.add(engineBody);
  meshes.engineBody = engineBody;

  // Engine hood top with slight curve
  const hoodPts = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    hoodPts.push(new THREE.Vector2(t * 1.2 - 0.6, Math.sin(t * Math.PI) * 0.06));
  }
  const hoodCurve = new THREE.LatheGeometry(hoodPts, 1, 0, Math.PI);
  // Alternative: shaped box
  const hoodGeo = new THREE.BoxGeometry(1.22, 0.04, 1.22);
  const hood = new THREE.Mesh(hoodGeo, panelOrange);
  hood.position.set(-0.8, 1.72, 0);
  engineGroup.add(hood);

  // Ventilation louvers on engine housing sides
  for (let i = 0; i < 6; i++) {
    const louverGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
    const louver = new THREE.Mesh(louverGeo, darkSteel);
    louver.position.set(-0.8, 1.1 + i * 0.09, 0.62);
    engineGroup.add(louver);
    // Mirror side
    const louver2 = louver.clone();
    louver2.position.z = -0.62;
    engineGroup.add(louver2);
  }

  // Radiator grille (front of engine)
  const grilleGeo = new THREE.BoxGeometry(0.04, 0.5, 0.9);
  const grille = new THREE.Mesh(grilleGeo, darkSteel);
  grille.position.set(-0.18, 1.15, 0);
  engineGroup.add(grille);

  // Grille bars
  for (let i = 0; i < 8; i++) {
    const barGeo = new THREE.BoxGeometry(0.05, 0.04, 0.85);
    const bar = new THREE.Mesh(barGeo, steel);
    bar.position.set(-0.17, 0.95 + i * 0.06, 0);
    engineGroup.add(bar);
  }

  // Exhaust stack
  const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.6, 12);
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.position.set(-1.1, 1.95, 0.35);
  engineGroup.add(exhaust);
  meshes.exhaust = exhaust;

  // Exhaust cap
  const exhaustCapGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.04, 12);
  const exhaustCap = new THREE.Mesh(exhaustCapGeo, chrome);
  exhaustCap.position.set(-1.1, 2.28, 0.35);
  engineGroup.add(exhaustCap);

  // Exhaust heat shimmer ring (animated glow)
  const exhaustRingGeo = new THREE.TorusGeometry(0.07, 0.015, 8, 16);
  const exhaustRing = new THREE.Mesh(exhaustRingGeo, glowRed);
  exhaustRing.position.set(-1.1, 2.3, 0.35);
  exhaustRing.rotation.x = Math.PI / 2;
  engineGroup.add(exhaustRing);
  meshes.exhaustRing = exhaustRing;

  // Muffler
  const mufflerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.35, 12);
  const muffler = new THREE.Mesh(mufflerGeo, exhaustMat);
  muffler.position.set(-1.2, 1.5, 0.35);
  muffler.rotation.z = Math.PI / 2;
  engineGroup.add(muffler);

  // Internal engine block visible through grille
  const blockGeo = new THREE.BoxGeometry(0.6, 0.45, 0.6);
  const block = new THREE.Mesh(blockGeo, aluminum);
  block.position.set(-0.75, 1.05, 0);
  engineGroup.add(block);

  // Cylinder head
  const cylHeadGeo = new THREE.BoxGeometry(0.55, 0.12, 0.5);
  const cylHead = new THREE.Mesh(cylHeadGeo, aluminum);
  cylHead.position.set(-0.75, 1.33, 0);
  engineGroup.add(cylHead);

  // Alternator
  const altGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12);
  const alt = new THREE.Mesh(altGeo, chrome);
  alt.rotation.x = Math.PI / 2;
  alt.position.set(-0.55, 1.0, 0.35);
  engineGroup.add(alt);

  // Fuel tank
  const fuelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 12);
  const fuelTank = new THREE.Mesh(fuelGeo, darkSteel);
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(-1.1, 1.0, -0.3);
  engineGroup.add(fuelTank);

  // Fuel cap
  const fuelCapGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8);
  const fuelCap = new THREE.Mesh(fuelCapGeo, chrome);
  fuelCap.position.set(-1.35, 1.0, -0.3);
  fuelCap.rotation.z = Math.PI / 2;
  engineGroup.add(fuelCap);

  group.add(engineGroup);
  meshes.engineGroup = engineGroup;

  // ═══════════════════════════════════════════════════
  // 3. OPERATOR PLATFORM / STATION
  // ═══════════════════════════════════════════════════
  const operatorGroup = new THREE.Group();

  // Platform deck
  const deckGeo = new THREE.BoxGeometry(1.4, 0.08, 1.3);
  const deck = new THREE.Mesh(deckGeo, darkSteel);
  deck.position.set(0.4, 0.82, 0);
  operatorGroup.add(deck);

  // Anti-slip tread pattern on deck
  for (let x = -0.5; x <= 0.5; x += 0.15) {
    for (let z = -0.5; z <= 0.5; z += 0.15) {
      const treadGeo = new THREE.BoxGeometry(0.1, 0.01, 0.1);
      const tread = new THREE.Mesh(treadGeo, steel);
      tread.position.set(0.4 + x, 0.87, z);
      tread.rotation.y = Math.PI / 4;
      operatorGroup.add(tread);
    }
  }

  // Control console / dash panel
  const consoleGeo = new THREE.BoxGeometry(0.5, 0.55, 0.8);
  const consoleMesh = new THREE.Mesh(consoleGeo, panelOrange);
  consoleMesh.position.set(0.85, 1.2, 0);
  operatorGroup.add(consoleMesh);

  // Instrument cluster (digital display)
  const displayGeo = new THREE.BoxGeometry(0.02, 0.2, 0.35);
  const display = new THREE.Mesh(displayGeo, neonCyan);
  display.position.set(0.59, 1.35, 0);
  operatorGroup.add(display);
  meshes.display = display;

  // Control levers (left and right)
  for (let side = -1; side <= 1; side += 2) {
    const leverBaseGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.04, 8);
    const leverBase = new THREE.Mesh(leverBaseGeo, darkSteel);
    leverBase.position.set(0.6, 0.88, side * 0.3);
    operatorGroup.add(leverBase);

    const leverGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);
    const lever = new THREE.Mesh(leverGeo, chrome);
    lever.position.set(0.6, 1.1, side * 0.3);
    lever.rotation.x = side * 0.15;
    operatorGroup.add(lever);

    // Grip
    const gripGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const grip = new THREE.Mesh(gripGeo, rubber);
    grip.position.set(0.6, 1.33, side * 0.3 + side * 0.03);
    operatorGroup.add(grip);

    if (side === -1) meshes.leverLeft = lever;
    else meshes.leverRight = lever;
  }

  // Operator seat
  const seatBaseGeo = new THREE.BoxGeometry(0.35, 0.08, 0.35);
  const seatBase = new THREE.Mesh(seatBaseGeo, seatMat);
  seatBase.position.set(0.35, 1.05, 0);
  operatorGroup.add(seatBase);

  // Seat cushion (contoured)
  const seatCushionGeo = new THREE.BoxGeometry(0.32, 0.1, 0.32);
  const seatCushion = new THREE.Mesh(seatCushionGeo, seatMat);
  seatCushion.position.set(0.35, 1.14, 0);
  operatorGroup.add(seatCushion);

  // Seat back
  const seatBackGeo = new THREE.BoxGeometry(0.32, 0.4, 0.08);
  const seatBack = new THREE.Mesh(seatBackGeo, seatMat);
  seatBack.position.set(0.35, 1.4, -0.15);
  seatBack.rotation.x = -0.15;
  operatorGroup.add(seatBack);

  // Armrests
  for (let s = -1; s <= 1; s += 2) {
    const armGeo = new THREE.BoxGeometry(0.22, 0.04, 0.06);
    const arm = new THREE.Mesh(armGeo, rubber);
    arm.position.set(0.35, 1.3, s * 0.2);
    operatorGroup.add(arm);
  }

  // Seat pedestal / suspension
  const pedestalGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.18, 8);
  const pedestal = new THREE.Mesh(pedestalGeo, chrome);
  pedestal.position.set(0.35, 0.93, 0);
  operatorGroup.add(pedestal);

  // ROPS (Roll Over Protection Structure) – tubular frame
  const ropsMat = panelOrange;
  const ropsGeo1 = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);

  // Vertical posts
  for (let s = -1; s <= 1; s += 2) {
    const post = new THREE.Mesh(ropsGeo1, ropsMat);
    post.position.set(0.15, 1.7, s * 0.55);
    operatorGroup.add(post);

    const postRear = new THREE.Mesh(ropsGeo1.clone(), ropsMat);
    postRear.position.set(0.75, 1.7, s * 0.55);
    operatorGroup.add(postRear);
  }

  // Top crossbar
  const topBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8);
  const topBar = new THREE.Mesh(topBarGeo, ropsMat);
  topBar.rotation.x = Math.PI / 2;
  topBar.position.set(0.15, 2.45, 0);
  operatorGroup.add(topBar);

  const topBar2 = topBar.clone();
  topBar2.position.set(0.75, 2.45, 0);
  operatorGroup.add(topBar2);

  // Longitudinal bars
  const longBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
  for (let s = -1; s <= 1; s += 2) {
    const lb = new THREE.Mesh(longBarGeo, ropsMat);
    lb.rotation.z = Math.PI / 2;
    lb.position.set(0.45, 2.45, s * 0.55);
    operatorGroup.add(lb);
  }

  // Sun canopy
  const canopyGeo = new THREE.BoxGeometry(0.8, 0.03, 1.2);
  const canopy = new THREE.Mesh(canopyGeo, panelOrange);
  canopy.position.set(0.45, 2.48, 0);
  operatorGroup.add(canopy);

  // Step / footrest
  const stepGeo = new THREE.BoxGeometry(0.3, 0.04, 0.5);
  const step = new THREE.Mesh(stepGeo, darkSteel);
  step.position.set(0.9, 0.78, 0);
  operatorGroup.add(step);

  group.add(operatorGroup);
  meshes.operatorGroup = operatorGroup;

  // ═══════════════════════════════════════════════════
  // 4. DIGGING BOOM WITH CHAIN AND CARBIDE TEETH
  // ═══════════════════════════════════════════════════
  const boomGroup = new THREE.Group();

  // Boom arm main structure - tapered box
  const boomLength = 3.0;
  const boomGeo = new THREE.BoxGeometry(0.2, boomLength, 0.12);
  const boomArm = new THREE.Mesh(boomGeo, deepOrange);
  boomArm.position.set(0, -boomLength / 2 + 0.8, 0);
  boomGroup.add(boomArm);
  meshes.boomArm = boomArm;

  // Boom side plates
  for (let s = -1; s <= 1; s += 2) {
    const plateGeo = new THREE.BoxGeometry(0.22, boomLength, 0.02);
    const plate = new THREE.Mesh(plateGeo, panelOrange);
    plate.position.set(0, -boomLength / 2 + 0.8, s * 0.07);
    boomGroup.add(plate);
  }

  // Boom reinforcement ribs
  for (let r = 0; r < 6; r++) {
    const ribGeo = new THREE.BoxGeometry(0.24, 0.04, 0.14);
    const rib = new THREE.Mesh(ribGeo, steel);
    rib.position.set(0, 0.5 - r * 0.5, 0);
    boomGroup.add(rib);
  }

  // Upper sprocket (drive) at boom top
  const upperSprocketGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.15, 16);
  const upperSprocket = new THREE.Mesh(upperSprocketGeo, chrome);
  upperSprocket.rotation.x = Math.PI / 2;
  upperSprocket.position.set(0, 0.8, 0);
  boomGroup.add(upperSprocket);
  meshes.upperSprocket = upperSprocket;

  // Upper sprocket teeth
  for (let t = 0; t < 10; t++) {
    const angle = (t / 10) * Math.PI * 2;
    const stGeo = new THREE.BoxGeometry(0.03, 0.06, 0.13);
    const st = new THREE.Mesh(stGeo, steel);
    st.position.set(
      Math.cos(angle) * 0.16,
      0.8 + Math.sin(angle) * 0.16,
      0
    );
    st.rotation.z = angle;
    boomGroup.add(st);
  }

  // Lower sprocket (idler) at boom tip
  const lowerSprocketGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.13, 16);
  const lowerSprocket = new THREE.Mesh(lowerSprocketGeo, chrome);
  lowerSprocket.rotation.x = Math.PI / 2;
  lowerSprocket.position.set(0, -boomLength + 0.8 + 0.15, 0);
  boomGroup.add(lowerSprocket);

  // ── DIGGING CHAIN with CARBIDE TEETH ──
  const chainGroup = new THREE.Group();
  const chainTeethCount = 36;
  const chainPath = boomLength - 0.3;
  const sprocketRadius = 0.14;

  for (let i = 0; i < chainTeethCount; i++) {
    const t = i / chainTeethCount;
    let cx, cy;

    if (t < 0.4) {
      // Down front side
      const lt = t / 0.4;
      cx = 0.16;
      cy = 0.8 - lt * chainPath;
    } else if (t < 0.5) {
      // Around bottom sprocket
      const lt = (t - 0.4) / 0.1;
      const angle = -Math.PI / 2 + lt * Math.PI;
      cx = Math.cos(angle) * 0.13;
      cy = (-boomLength + 0.8 + 0.15) + Math.sin(angle) * 0.13;
    } else if (t < 0.9) {
      // Up back side
      const lt = (t - 0.5) / 0.4;
      cx = -0.16;
      cy = (-boomLength + 0.8 + 0.15) + lt * chainPath;
    } else {
      // Around top sprocket
      const lt = (t - 0.9) / 0.1;
      const angle = Math.PI / 2 + lt * Math.PI;
      cx = Math.cos(angle) * 0.16;
      cy = 0.8 + Math.sin(angle) * 0.16;
    }

    // Chain link
    const linkGeo = new THREE.BoxGeometry(0.04, 0.06, 0.14);
    const link = new THREE.Mesh(linkGeo, chainMat);
    link.position.set(cx, cy, 0);
    chainGroup.add(link);

    // Carbide cutting tooth (every 3rd link on front side)
    if (i % 3 === 0 && t < 0.4) {
      const toothGroup = new THREE.Group();

      // Tooth body - pointed wedge shape
      const toothShape = new THREE.Shape();
      toothShape.moveTo(-0.02, 0);
      toothShape.lineTo(0.02, 0);
      toothShape.lineTo(0.015, 0.06);
      toothShape.lineTo(0, 0.08);
      toothShape.lineTo(-0.015, 0.06);
      toothShape.closePath();

      const toothExtGeo = new THREE.ExtrudeGeometry(toothShape, {
        depth: 0.04, bevelEnabled: true, bevelThickness: 0.005,
        bevelSize: 0.005, bevelSegments: 2
      });
      const toothMesh = new THREE.Mesh(toothExtGeo, carbideMat);
      toothMesh.position.set(cx + 0.04, cy, -0.02);
      toothGroup.add(toothMesh);

      // Carbide tip (tungsten carbide insert)
      const tipGeo = new THREE.ConeGeometry(0.012, 0.035, 6);
      const tip = new THREE.Mesh(tipGeo, carbideMat);
      tip.position.set(cx + 0.07, cy, 0);
      tip.rotation.z = -Math.PI / 2;
      toothGroup.add(tip);

      // Glow indicator on active teeth
      const glowGeo = new THREE.SphereGeometry(0.008, 6, 6);
      const glow = new THREE.Mesh(glowGeo, neonCyan);
      glow.position.set(cx + 0.08, cy, 0);
      toothGroup.add(glow);

      chainGroup.add(toothGroup);
    }

    // Side cutters (at specific intervals)
    if (i % 6 === 3 && t < 0.4) {
      for (let s = -1; s <= 1; s += 2) {
        const cutterGeo = new THREE.BoxGeometry(0.03, 0.04, 0.025);
        const cutter = new THREE.Mesh(cutterGeo, carbideMat);
        cutter.position.set(cx + 0.03, cy, s * 0.08);
        chainGroup.add(cutter);
      }
    }
  }

  boomGroup.add(chainGroup);
  meshes.chainGroup = chainGroup;

  // Boom pivot mount
  const pivotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12);
  const pivot = new THREE.Mesh(pivotGeo, chrome);
  pivot.rotation.x = Math.PI / 2;
  pivot.position.set(0, 0.8, 0);
  boomGroup.add(pivot);

  // Position boom at rear of machine, angled
  boomGroup.position.set(-0.15, 1.5, 0);
  boomGroup.rotation.z = 0.6; // tilted dig angle
  group.add(boomGroup);
  meshes.boomGroup = boomGroup;

  // ═══════════════════════════════════════════════════
  // 5. BOOM HYDRAULIC LIFT CYLINDER
  // ═══════════════════════════════════════════════════
  const hydraulicGroup = new THREE.Group();

  // Main lift cylinder body
  const cylBodyGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 12);
  const cylBody = new THREE.Mesh(cylBodyGeo, hydraulicMat);
  cylBody.position.set(-0.4, 1.7, 0.25);
  cylBody.rotation.z = 0.4;
  hydraulicGroup.add(cylBody);
  meshes.liftCylinder = cylBody;

  // Cylinder rod (chrome piston)
  const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 10);
  const rod = new THREE.Mesh(rodGeo, chrome);
  rod.position.set(-0.65, 1.3, 0.25);
  rod.rotation.z = 0.4;
  hydraulicGroup.add(rod);
  meshes.liftRod = rod;

  // Cylinder end caps
  for (let e = -1; e <= 1; e += 2) {
    const capGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.03, 12);
    const cap = new THREE.Mesh(capGeo, chrome);
    cap.position.set(
      -0.4 + e * Math.cos(0.4) * 0.45,
      1.7 + e * Math.sin(0.4) * 0.45 * (e === 1 ? 1 : -1),
      0.25
    );
    cap.rotation.z = 0.4;
    hydraulicGroup.add(cap);
  }

  // Second cylinder (mirror side)
  const cylBody2 = cylBody.clone();
  cylBody2.position.z = -0.25;
  hydraulicGroup.add(cylBody2);

  const rod2 = rod.clone();
  rod2.position.z = -0.25;
  hydraulicGroup.add(rod2);

  // Hydraulic lines (flexible hoses)
  function createHydraulicLine(startPt, endPt, midOffset) {
    const mid = new THREE.Vector3(
      (startPt.x + endPt.x) / 2 + midOffset.x,
      (startPt.y + endPt.y) / 2 + midOffset.y,
      (startPt.z + endPt.z) / 2 + midOffset.z
    );
    const curve = new THREE.QuadraticBezierCurve3(startPt, mid, endPt);
    const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.015, 8, false);
    return new THREE.Mesh(tubeGeo, rubber);
  }

  const hose1 = createHydraulicLine(
    new THREE.Vector3(-0.3, 1.2, 0.32),
    new THREE.Vector3(-0.7, 0.8, 0.4),
    new THREE.Vector3(-0.2, -0.1, 0.1)
  );
  hydraulicGroup.add(hose1);

  const hose2 = createHydraulicLine(
    new THREE.Vector3(-0.3, 1.2, -0.32),
    new THREE.Vector3(-0.7, 0.8, -0.4),
    new THREE.Vector3(-0.2, -0.1, -0.1)
  );
  hydraulicGroup.add(hose2);

  // Hydraulic fittings (small chrome connectors)
  const fittingPositions = [
    [-0.3, 1.2, 0.32], [-0.7, 0.8, 0.4],
    [-0.3, 1.2, -0.32], [-0.7, 0.8, -0.4]
  ];
  fittingPositions.forEach(pos => {
    const fGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8);
    const fitting = new THREE.Mesh(fGeo, chrome);
    fitting.position.set(...pos);
    hydraulicGroup.add(fitting);
  });

  group.add(hydraulicGroup);
  meshes.hydraulicGroup = hydraulicGroup;

  // ═══════════════════════════════════════════════════
  // 6. CRUMBER (soil cleanout shoe at boom base)
  // ═══════════════════════════════════════════════════
  const crumberGroup = new THREE.Group();

  // Main crumber plate - follows chain contour
  const crumberShape = new THREE.Shape();
  crumberShape.moveTo(-0.1, 0);
  crumberShape.lineTo(0.1, 0);
  crumberShape.lineTo(0.12, 0.15);
  crumberShape.lineTo(0.08, 0.45);
  crumberShape.lineTo(-0.08, 0.45);
  crumberShape.lineTo(-0.12, 0.15);
  crumberShape.closePath();

  const crumberExtGeo = new THREE.ExtrudeGeometry(crumberShape, {
    depth: 0.16, bevelEnabled: true, bevelThickness: 0.01,
    bevelSize: 0.01, bevelSegments: 2
  });
  const crumberPlate = new THREE.Mesh(crumberExtGeo, steel);
  crumberPlate.position.set(-0.08, -1.6, -0.08);
  crumberPlate.rotation.z = 0.6;
  crumberGroup.add(crumberPlate);
  meshes.crumberPlate = crumberPlate;

  // Crumber wear edge (hardened steel strip)
  const wearEdgeGeo = new THREE.BoxGeometry(0.22, 0.03, 0.18);
  const wearEdge = new THREE.Mesh(wearEdgeGeo, carbideMat);
  wearEdge.position.set(-0.45, -1.25, 0);
  wearEdge.rotation.z = 0.6;
  crumberGroup.add(wearEdge);

  // Crumber mounting bracket
  const bracketGeo = new THREE.BoxGeometry(0.06, 0.2, 0.04);
  const bracket = new THREE.Mesh(bracketGeo, darkSteel);
  bracket.position.set(-0.2, -1.3, 0.1);
  bracket.rotation.z = 0.6;
  crumberGroup.add(bracket);

  const bracket2 = bracket.clone();
  bracket2.position.z = -0.1;
  crumberGroup.add(bracket2);

  // Adjusting bolt (for crumber clearance)
  const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6);
  const bolt = new THREE.Mesh(boltGeo, chrome);
  bolt.position.set(-0.2, -1.15, 0.1);
  bolt.rotation.x = Math.PI / 2;
  crumberGroup.add(bolt);

  group.add(crumberGroup);
  meshes.crumberGroup = crumberGroup;

  // ═══════════════════════════════════════════════════
  // 7. DEPTH GAUGE SYSTEM
  // ═══════════════════════════════════════════════════
  const depthGaugeGroup = new THREE.Group();

  // Gauge mounting pole
  const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.0, 8);
  const pole = new THREE.Mesh(poleGeo, chrome);
  pole.position.set(-0.25, 1.8, 0.5);
  depthGaugeGroup.add(pole);

  // Graduated scale (marks)
  for (let d = 0; d < 10; d++) {
    const markGeo = new THREE.BoxGeometry(0.04, 0.003, 0.008);
    const markMat = d % 5 === 0 ? glowRed : decalWhite;
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.position.set(-0.25, 1.35 + d * 0.09, 0.52);
    depthGaugeGroup.add(mark);
  }

  // Depth indicator (slider)
  const sliderGeo = new THREE.BoxGeometry(0.06, 0.02, 0.02);
  const slider = new THREE.Mesh(sliderGeo, neonOrange);
  slider.position.set(-0.25, 1.6, 0.52);
  depthGaugeGroup.add(slider);
  meshes.depthSlider = slider;

  // Digital depth readout
  const readoutGeo = new THREE.BoxGeometry(0.1, 0.06, 0.03);
  const readout = new THREE.Mesh(readoutGeo, neonCyan);
  readout.position.set(-0.25, 2.32, 0.5);
  depthGaugeGroup.add(readout);
  meshes.depthReadout = readout;

  // Gauge housing
  const gaugeHouseGeo = new THREE.BoxGeometry(0.14, 0.1, 0.04);
  const gaugeHouse = new THREE.Mesh(gaugeHouseGeo, darkSteel);
  gaugeHouse.position.set(-0.25, 2.32, 0.48);
  depthGaugeGroup.add(gaugeHouse);

  group.add(depthGaugeGroup);
  meshes.depthGaugeGroup = depthGaugeGroup;

  // ═══════════════════════════════════════════════════
  // 8. LIGHTING SYSTEM
  // ═══════════════════════════════════════════════════

  // Front work lights
  for (let s = -1; s <= 1; s += 2) {
    const lightHousingGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.06, 10);
    const lightHousing = new THREE.Mesh(lightHousingGeo, darkSteel);
    lightHousing.rotation.z = Math.PI / 2;
    lightHousing.position.set(1.05, 1.5, s * 0.4);
    group.add(lightHousing);

    const lensGeo = new THREE.CircleGeometry(0.048, 12);
    const lens = new THREE.Mesh(lensGeo, glowWhite);
    lens.position.set(1.09, 1.5, s * 0.4);
    lens.rotation.y = Math.PI / 2;
    group.add(lens);
    if (s === 1) meshes.frontLightL = lens;
    else meshes.frontLightR = lens;
  }

  // Rear safety light (amber beacon)
  const beaconBaseGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.04, 10);
  const beaconBase = new THREE.Mesh(beaconBaseGeo, darkSteel);
  beaconBase.position.set(-0.8, 2.52, 0);
  group.add(beaconBase);

  const beaconGeo = new THREE.SphereGeometry(0.06, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const beacon = new THREE.Mesh(beaconGeo, neonOrange);
  beacon.position.set(-0.8, 2.55, 0);
  group.add(beacon);
  meshes.beacon = beacon;

  // ═══════════════════════════════════════════════════
  // 9. ADDITIONAL DETAILS - Rivets, Decals, Panels
  // ═══════════════════════════════════════════════════

  // Panel line details on engine housing
  for (let i = 0; i < 3; i++) {
    const lineGeo = new THREE.BoxGeometry(0.005, 0.85, 0.005);
    const line = new THREE.Mesh(lineGeo, darkSteel);
    line.position.set(-0.8, 1.25, 0.61 - i * 0.3);
    line.rotation.y = Math.PI / 2;
    group.add(line);
  }

  // Rivets on chassis
  const rivetGeo = new THREE.SphereGeometry(0.012, 6, 6);
  const rivetPositions = [
    [1.4, 0.55, 0.72], [0.8, 0.55, 0.72], [0, 0.55, 0.72], [-0.8, 0.55, 0.72],
    [1.4, 0.55, -0.72], [0.8, 0.55, -0.72], [0, 0.55, -0.72], [-0.8, 0.55, -0.72],
  ];
  rivetPositions.forEach(pos => {
    const rivet = new THREE.Mesh(rivetGeo, chrome);
    rivet.position.set(...pos);
    group.add(rivet);
  });

  // Tow hook (front)
  const hookGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 12, Math.PI);
  const hook = new THREE.Mesh(hookGeo, darkSteel);
  hook.position.set(1.65, 0.4, 0);
  hook.rotation.y = Math.PI / 2;
  group.add(hook);

  // ═══════════════════════════════════════════════════
  // 10. NEON ACCENT STRIPS (futuristic flair)
  // ═══════════════════════════════════════════════════
  const accentPositions = [
    { pos: [0.0, 0.05, 0.95], size: [2.8, 0.02, 0.02] },
    { pos: [0.0, 0.05, -0.95], size: [2.8, 0.02, 0.02] },
    { pos: [0.0, 0.9, 0.72], size: [3.0, 0.015, 0.015] },
    { pos: [0.0, 0.9, -0.72], size: [3.0, 0.015, 0.015] },
  ];
  accentPositions.forEach((a, idx) => {
    const accentGeo = new THREE.BoxGeometry(...a.size);
    const mat = idx < 2 ? neonOrange : neonCyan;
    const accent = new THREE.Mesh(accentGeo, mat);
    accent.position.set(...a.pos);
    group.add(accent);
  });

  // Ground contact frame glow
  const frameGlowGeo = new THREE.BoxGeometry(3.5, 0.008, 0.008);
  const frameGlow = new THREE.Mesh(frameGlowGeo, glowGreen);
  frameGlow.position.set(0, 0.02, 0);
  group.add(frameGlow);
  meshes.frameGlow = frameGlow;

  // ═══════════════════════════════════════════════════
  // 11. HYDRAULIC PUMP UNIT (visible detail)
  // ═══════════════════════════════════════════════════
  const pumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 10);
  const pump = new THREE.Mesh(pumpGeo, aluminum);
  pump.rotation.x = Math.PI / 2;
  pump.position.set(-0.5, 0.95, 0.4);
  group.add(pump);

  const pumpCapGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.02, 10);
  const pumpCap = new THREE.Mesh(pumpCapGeo, chrome);
  pumpCap.rotation.x = Math.PI / 2;
  pumpCap.position.set(-0.5, 0.95, 0.51);
  group.add(pumpCap);

  // Pump pressure lines
  const pLine1 = createHydraulicLine(
    new THREE.Vector3(-0.5, 0.95, 0.52),
    new THREE.Vector3(-0.4, 1.6, 0.3),
    new THREE.Vector3(-0.15, 0.3, 0.15)
  );
  group.add(pLine1);

  // ═══════════════════════════════════════════════════
  // FINAL POSITION
  // ═══════════════════════════════════════════════════
  group.position.y = -0.5;

  // ─── PARTS MANIFEST ───
  const parts = [
    {
      name: 'Tracked Undercarriage',
      description: 'Dual rubber track system with drive sprockets, idlers, and road wheels providing stable ground contact and low ground pressure for trench work.',
      material: 'Rubber tracks on steel frames with hardened sprocket teeth',
      function: 'Provides propulsion and stability on varied terrain including soft soil and gravel',
      assemblyOrder: 1,
      connections: ['Chassis Frame', 'Hydraulic Drive Motors'],
      failureEffect: 'Complete loss of mobility; machine cannot traverse to dig site',
      cascadeFailures: ['Hydraulic Drive Motors', 'Track Tensioner'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -1.5, z: 0 }
    },
    {
      name: 'Diesel Engine Assembly',
      description: 'Compact multi-cylinder diesel engine with radiator, alternator, fuel tank, exhaust system, and air filtration providing primary power.',
      material: 'Cast aluminum block with steel cylinder liners, copper radiator core',
      function: 'Generates mechanical power to drive hydraulic pumps for all machine functions',
      assemblyOrder: 2,
      connections: ['Hydraulic Pump', 'Fuel Tank', 'Exhaust System', 'Alternator'],
      failureEffect: 'Total power loss; all machine functions cease immediately',
      cascadeFailures: ['Hydraulic Pump', 'Digging Chain', 'Track Drive'],
      originalPosition: { x: -0.8, y: 1.25, z: 0 },
      explodedPosition: { x: -3.0, y: 1.25, z: 0 }
    },
    {
      name: 'Digging Boom Assembly',
      description: 'Reinforced steel boom arm housing the chain drive sprockets, adjustable from vertical to angled positions for various trench depths.',
      material: 'High-strength structural steel with wear-resistant coating',
      function: 'Supports and guides the digging chain at the correct angle and depth for trenching operations',
      assemblyOrder: 4,
      connections: ['Hydraulic Lift Cylinder', 'Digging Chain', 'Upper Drive Sprocket', 'Lower Idler'],
      failureEffect: 'Cannot maintain trench alignment; trench walls may collapse',
      cascadeFailures: ['Digging Chain', 'Crumber', 'Depth Gauge'],
      originalPosition: { x: -0.15, y: 1.5, z: 0 },
      explodedPosition: { x: -0.15, y: 3.5, z: 2.0 }
    },
    {
      name: 'Digging Chain with Carbide Teeth',
      description: 'Continuous roller chain fitted with tungsten carbide-tipped cutting teeth and side cutters for efficient soil and rock excavation.',
      material: 'Alloy steel chain links with brazed tungsten carbide inserts',
      function: 'Excavates soil by rotating around the boom, cutting teeth break ground while side cutters maintain trench width',
      assemblyOrder: 5,
      connections: ['Upper Drive Sprocket', 'Lower Idler Sprocket', 'Boom Assembly'],
      failureEffect: 'Trenching capability completely lost; broken chain can damage boom',
      cascadeFailures: ['Upper Drive Sprocket', 'Boom Assembly'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 2.0, y: 0, z: 2.0 }
    },
    {
      name: 'Crumber Assembly',
      description: 'Spring-loaded soil cleanout shoe positioned behind the digging chain that removes loose material from the trench bottom.',
      material: 'Hardened steel plate with replaceable carbide wear edge',
      function: 'Maintains clean trench bottom by scraping loose soil off the chain path and trench floor',
      assemblyOrder: 6,
      connections: ['Boom Assembly', 'Adjustment Bolts'],
      failureEffect: 'Trench bottom becomes uneven with accumulated loose soil, reducing trench quality',
      cascadeFailures: ['Trench Quality'],
      originalPosition: { x: -0.2, y: -1.3, z: 0 },
      explodedPosition: { x: -2.5, y: -1.3, z: 1.5 }
    },
    {
      name: 'Hydraulic Lift System',
      description: 'Dual hydraulic cylinders with chrome-plated rods and reinforced hoses controlling boom elevation and digging depth.',
      material: 'Precision-ground chrome cylinder rods, hardened steel cylinder bodies, reinforced rubber hoses',
      function: 'Raises and lowers the digging boom to control trench depth from surface level to maximum capacity',
      assemblyOrder: 3,
      connections: ['Hydraulic Pump', 'Boom Assembly', 'Control Levers'],
      failureEffect: 'Boom drops uncontrolled or cannot be raised; potential safety hazard',
      cascadeFailures: ['Boom Assembly', 'Depth Control'],
      originalPosition: { x: -0.4, y: 1.7, z: 0 },
      explodedPosition: { x: -0.4, y: 3.0, z: -2.0 }
    },
    {
      name: 'Operator Control Station',
      description: 'Ergonomic platform with cushioned seat, ROPS frame, dual control levers, digital instrument display, and sun canopy.',
      material: 'Tubular steel ROPS frame, vinyl cushion seat, polycarbonate display panel',
      function: 'Provides operator with controls for machine travel, boom position, chain speed, and real-time operational feedback',
      assemblyOrder: 7,
      connections: ['Chassis Frame', 'Hydraulic Controls', 'Engine Throttle'],
      failureEffect: 'Operator unable to control machine functions safely',
      cascadeFailures: ['All Machine Functions'],
      originalPosition: { x: 0.4, y: 0.82, z: 0 },
      explodedPosition: { x: 3.0, y: 1.5, z: 0 }
    },
    {
      name: 'Depth Gauge System',
      description: 'Mechanical and digital depth measurement system with graduated scale, sliding indicator, and electronic readout display.',
      material: 'Chrome-plated steel scale rod, LED digital display module',
      function: 'Provides real-time trench depth measurement so operator can maintain consistent depth throughout the trench run',
      assemblyOrder: 8,
      connections: ['Boom Assembly', 'Digital Display', 'Control Console'],
      failureEffect: 'Operator loses depth reference; trench may have inconsistent depth',
      cascadeFailures: ['Trench Accuracy'],
      originalPosition: { x: -0.25, y: 1.8, z: 0.5 },
      explodedPosition: { x: -0.25, y: 3.5, z: 2.5 }
    }
  ];

  // ─── QUIZ QUESTIONS ───
  const quizQuestions = [
    {
      question: 'What is the primary function of the crumber on a ride-on trencher?',
      options: [
        'To sharpen the cutting teeth during operation',
        'To clean loose soil from the trench bottom behind the chain',
        'To measure the depth of the trench being dug',
        'To tension the digging chain around the boom'
      ],
      correct: 1,
      explanation: 'The crumber (also called a cleanout shoe) is positioned behind the digging chain on the boom. It scrapes loose soil off the trench bottom as the machine moves forward, ensuring a clean and even trench floor for pipe or cable laying.',
      difficulty: 'medium'
    },
    {
      question: 'Why are tungsten carbide inserts used on trencher cutting teeth instead of standard steel?',
      options: [
        'Carbide is lighter, reducing chain weight and fuel consumption',
        'Carbide is magnetic, helping collect buried metal objects',
        'Carbide has extreme hardness and wear resistance for cutting rock and compacted soil',
        'Carbide conducts electricity better for sensing underground utilities'
      ],
      correct: 2,
      explanation: 'Tungsten carbide is one of the hardest materials available commercially. Its extreme hardness (9-9.5 on the Mohs scale) allows the cutting teeth to penetrate hard clay, shale, soft rock, and frozen ground while maintaining their cutting edge far longer than tool steel alternatives.',
      difficulty: 'hard'
    },
    {
      question: 'What type of drive system do modern ride-on trenchers like the RT125 use for their tracks?',
      options: [
        'Direct mechanical drive from the engine via gearbox',
        'Electric motors powered by onboard batteries',
        'Hydrostatic drive using variable-displacement hydraulic motors',
        'Pneumatic air motors driven by an onboard compressor'
      ],
      correct: 2,
      explanation: 'Modern ride-on trenchers use hydrostatic drive systems where the engine powers hydraulic pumps, which send pressurized fluid to variable-displacement hydraulic motors at each track. This provides infinitely variable speed control and independent track steering without a mechanical transmission.',
      difficulty: 'hard'
    },
    {
      question: 'What is the purpose of the ROPS (Roll Over Protection Structure) on the operator station?',
      options: [
        'To provide shade for the operator during hot weather',
        'To protect the operator from falling objects and rollover incidents',
        'To mount communication antennas and GPS receivers',
        'To reduce engine noise reaching the operator'
      ],
      correct: 1,
      explanation: 'ROPS is a mandatory safety structure designed to maintain a protective zone around the operator if the machine tips over. It absorbs rollover energy and prevents the machine from crushing the operator. ROPS certification requires passing destructive testing standards (SAE J1040 / ISO 3471).',
      difficulty: 'easy'
    }
  ];

  // ─── DESCRIPTION ───
  const description = `A Modern Ride-On Trencher (Ditch Witch RT125 style) is a compact, track-mounted construction machine designed for digging narrow trenches for utility installations including water lines, gas pipes, electrical conduits, fiber optic cables, and irrigation systems. The machine features a powerful diesel engine driving a hydrostatic track system for precise maneuvering, with a hydraulically-controlled digging boom that carries a continuous chain fitted with tungsten carbide cutting teeth. The boom can be angled and lowered to excavate trenches up to 48 inches deep and 6 inches wide. A crumber shoe behind the chain ensures clean trench bottoms, while the depth gauge system provides real-time excavation depth feedback. The operator platform includes ergonomic controls, a padded seat with armrests, and a certified ROPS/FOPS protective canopy.`;

  // ─── ANIMATE FUNCTION ───
  function animate(time, speed, meshes) {
    const t = time * speed;

    // 1. Chain group oscillation (simulated chain rotation)
    if (meshes.chainGroup) {
      meshes.chainGroup.children.forEach((child, idx) => {
        if (child.isMesh) {
          child.position.y += Math.sin(t * 4 + idx * 0.3) * 0.0003;
        }
      });
    }

    // 2. Boom subtle oscillation (digging vibration)
    if (meshes.boomGroup) {
      meshes.boomGroup.rotation.z = 0.6 + Math.sin(t * 1.5) * 0.04;
    }

    // 3. Exhaust ring pulse
    if (meshes.exhaustRing) {
      const pulse = 0.6 + Math.sin(t * 6) * 0.4;
      meshes.exhaustRing.material.emissiveIntensity = pulse;
      meshes.exhaustRing.scale.setScalar(0.9 + Math.sin(t * 8) * 0.15);
    }

    // 4. Beacon rotation (amber safety light)
    if (meshes.beacon) {
      meshes.beacon.rotation.y = t * 3;
      meshes.beacon.material.emissiveIntensity = 0.4 + Math.sin(t * 5) * 0.35;
    }

    // 5. Display flicker (instrument panel)
    if (meshes.display) {
      meshes.display.material.emissiveIntensity = 0.7 + Math.sin(t * 10) * 0.2;
    }

    // 6. Depth slider movement (simulated depth adjustment)
    if (meshes.depthSlider) {
      meshes.depthSlider.position.y = 1.5 + Math.sin(t * 0.8) * 0.15;
    }

    // 7. Depth readout glow
    if (meshes.depthReadout) {
      meshes.depthReadout.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3;
    }

    // 8. Front lights subtle pulse
    if (meshes.frontLightL) {
      const lightPulse = 1.0 + Math.sin(t * 2) * 0.2;
      meshes.frontLightL.material.emissiveIntensity = lightPulse;
    }
    if (meshes.frontLightR) {
      meshes.frontLightR.material.emissiveIntensity = 1.0 + Math.sin(t * 2 + 0.5) * 0.2;
    }

    // 9. Frame glow pulsation
    if (meshes.frameGlow) {
      meshes.frameGlow.material.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;
    }

    // 10. Control levers gentle sway (operator input simulation)
    if (meshes.leverLeft) {
      meshes.leverLeft.rotation.x = -0.15 + Math.sin(t * 1.2) * 0.08;
    }
    if (meshes.leverRight) {
      meshes.leverRight.rotation.x = 0.15 + Math.sin(t * 1.2 + Math.PI) * 0.08;
    }

    // 11. Upper sprocket rotation (chain drive)
    if (meshes.upperSprocket) {
      meshes.upperSprocket.rotation.z += speed * 0.06;
    }

    // 12. Hydraulic rod piston motion
    if (meshes.liftRod) {
      const pistonOffset = Math.sin(t * 1.5) * 0.05;
      meshes.liftRod.position.y = 1.3 + pistonOffset;
    }

    // 13. Engine body micro-vibration
    if (meshes.engineBody) {
      meshes.engineBody.position.x = -0.8 + Math.sin(t * 25) * 0.002;
      meshes.engineBody.position.y = 1.25 + Math.sin(t * 30) * 0.001;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
