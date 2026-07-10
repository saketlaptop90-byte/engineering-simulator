// ============================================================================
// Modern Hydraulic Pile Driver – Ultra High-Tech THREE.js Model
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {

  const group = new THREE.Group();
  const meshes = {};

  // ── Custom Materials ──────────────────────────────────────────────────────
  const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.35 });
  const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00cccc, emissiveIntensity: 0.85, metalness: 0.5, roughness: 0.2 });
  const neonRed = new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff0000, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.25 });
  const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00dd66, emissiveIntensity: 0.75, metalness: 0.4, roughness: 0.2 });
  const warningYellow = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.5, metalness: 0.2, roughness: 0.4 });
  const hydraulicRed = new THREE.MeshStandardMaterial({ color: 0xcc2200, emissive: 0x881100, emissiveIntensity: 0.35, metalness: 0.6, roughness: 0.3 });
  const heavyGray = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.85, roughness: 0.25 });
  const paintBlue = new THREE.MeshStandardMaterial({ color: 0x1155cc, metalness: 0.45, roughness: 0.35 });
  const paintBlueLight = new THREE.MeshStandardMaterial({ color: 0x3388ee, metalness: 0.4, roughness: 0.4 });
  const exhaustDark = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 });
  const plasmaCore = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 1.0, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.85 });
  const gridMetal = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.15, wireframe: true });

  // ── Helper Functions ──────────────────────────────────────────────────────
  function createTube(path, radius, segments, mat) {
    const curve = new THREE.CatmullRomCurve3(path.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.TubeGeometry(curve, segments || 20, radius || 0.03, 8, false);
    return new THREE.Mesh(geo, mat);
  }

  function createRivetRing(radius, count, y, mat) {
    const g = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mat);
      rivet.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
      g.add(rivet);
    }
    return g;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: CRAWLER TRACK BASE (Two Tracks + Central Hull)
  // ═══════════════════════════════════════════════════════════════════════════
  const baseGroup = new THREE.Group();

  // -- Central Hull Body --
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-1.4, 0);
  hullShape.lineTo(1.4, 0);
  hullShape.lineTo(1.3, 0.5);
  hullShape.lineTo(1.1, 0.65);
  hullShape.lineTo(-1.1, 0.65);
  hullShape.lineTo(-1.3, 0.5);
  hullShape.closePath();
  const hullExtrudeSettings = { depth: 1.6, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, hullExtrudeSettings);
  hullGeo.center();
  const hull = new THREE.Mesh(hullGeo, paintBlue);
  hull.position.y = 0.55;
  baseGroup.add(hull);
  meshes.hull = hull;

  // -- Hull Top Deck Plates --
  const deckPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 1.4), darkSteel);
  deckPlate.position.y = 0.9;
  baseGroup.add(deckPlate);

  // -- Anti-Slip Diamond Plate Texture (rows of small bumps) --
  for (let ix = -5; ix <= 5; ix++) {
    for (let iz = -3; iz <= 3; iz++) {
      const bump = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.06), heavyGray);
      bump.position.set(ix * 0.2, 0.935, iz * 0.18);
      bump.rotation.y = Math.PI / 4;
      baseGroup.add(bump);
    }
  }

  // ── Crawler Track Function ─────────────────────────────────────────────
  function createCrawlerTrack(side) {
    const trackGroup = new THREE.Group();
    const xOffset = side === 'left' ? -1.15 : 1.15;

    // -- Track Frame Rail --
    const frameGeo = new THREE.BoxGeometry(0.25, 0.35, 3.2);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.set(xOffset, 0.35, 0);
    trackGroup.add(frame);

    // -- Drive Sprocket (front) --
    const sprocketGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 16);
    const sprocket = new THREE.Mesh(sprocketGeo, chrome);
    sprocket.rotation.z = Math.PI / 2;
    sprocket.position.set(xOffset, 0.35, 1.45);
    trackGroup.add(sprocket);

    // Sprocket Teeth
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.06), steel);
      tooth.position.set(xOffset, 0.35 + Math.sin(a) * 0.32, 1.45 + Math.cos(a) * 0.32);
      tooth.rotation.x = a;
      trackGroup.add(tooth);
    }

    // -- Idler Wheel (rear) --
    const idlerGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.26, 16);
    const idler = new THREE.Mesh(idlerGeo, chrome);
    idler.rotation.z = Math.PI / 2;
    idler.position.set(xOffset, 0.35, -1.45);
    trackGroup.add(idler);

    // -- Road Wheels (bottom rollers) --
    for (let i = 0; i < 5; i++) {
      const zPos = -1.0 + i * 0.5;
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.22, 12), steel);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(xOffset, 0.18, zPos);
      trackGroup.add(wheel);

      // Wheel hub
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8), chrome);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(xOffset, 0.18, zPos);
      trackGroup.add(hub);
    }

    // -- Track Links (realistic segmented track) --
    const linkCount = 48;
    const trackRadius = 0.32;
    const trackLength = 3.0;

    for (let i = 0; i < linkCount; i++) {
      const t = i / linkCount;
      let lx = xOffset, ly, lz, rotX = 0;

      // Approximate track path: bottom straight, front curve, top straight, rear curve
      if (t < 0.35) {
        // Bottom straight
        lz = -1.4 + (t / 0.35) * trackLength;
        ly = 0.03;
      } else if (t < 0.45) {
        // Front curve
        const a = ((t - 0.35) / 0.10) * Math.PI;
        lz = 1.45 + Math.sin(a) * trackRadius;
        ly = 0.35 - Math.cos(a) * trackRadius + 0.02;
        rotX = a;
      } else if (t < 0.80) {
        // Top straight
        lz = 1.45 - ((t - 0.45) / 0.35) * trackLength;
        ly = 0.67;
      } else {
        // Rear curve
        const a = ((t - 0.80) / 0.20) * Math.PI;
        lz = -1.45 - Math.sin(a) * trackRadius;
        ly = 0.35 + Math.cos(a) * trackRadius + 0.02;
        rotX = Math.PI + a;
      }

      // Individual link shoe
      const link = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.12), rubber);
      link.position.set(lx, ly, lz);
      link.rotation.x = rotX;
      trackGroup.add(link);

      // Tread lug on each link
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.04), rubber);
      lug.position.set(lx, ly - 0.035, lz);
      lug.rotation.x = rotX;
      trackGroup.add(lug);

      // Link pin
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 6), steel);
      pin.rotation.z = Math.PI / 2;
      pin.position.set(lx, ly, lz);
      trackGroup.add(pin);
    }

    // -- Track Guard / Fender --
    const guardShape = new THREE.Shape();
    guardShape.moveTo(-1.6, 0);
    guardShape.lineTo(1.6, 0);
    guardShape.lineTo(1.5, 0.08);
    guardShape.lineTo(-1.5, 0.08);
    guardShape.closePath();
    const guardGeo = new THREE.ExtrudeGeometry(guardShape, { depth: 0.35, bevelEnabled: false });
    const guard = new THREE.Mesh(guardGeo, paintBlue);
    guard.position.set(xOffset - 0.175, 0.7, -1.6);
    trackGroup.add(guard);

    return trackGroup;
  }

  const leftTrack = createCrawlerTrack('left');
  const rightTrack = createCrawlerTrack('right');
  baseGroup.add(leftTrack);
  baseGroup.add(rightTrack);
  meshes.leftTrack = leftTrack;
  meshes.rightTrack = rightTrack;

  group.add(baseGroup);
  meshes.baseGroup = baseGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: TURNTABLE / SLEW RING
  // ═══════════════════════════════════════════════════════════════════════════
  const turntableGroup = new THREE.Group();
  turntableGroup.position.y = 0.95;

  // Slew ring bearing
  const slewRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.06, 12, 32), chrome);
  slewRing.rotation.x = Math.PI / 2;
  turntableGroup.add(slewRing);

  // Slew ring bolts
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6), steel);
    bolt.position.set(Math.cos(a) * 0.65, 0, Math.sin(a) * 0.65);
    turntableGroup.add(bolt);
  }

  // Turntable platform
  const turntablePlatform = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.12, 24), darkSteel);
  turntablePlatform.position.y = 0.06;
  turntableGroup.add(turntablePlatform);

  baseGroup.add(turntableGroup);
  meshes.turntableGroup = turntableGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: UPPER STRUCTURE / SUPERSTRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════
  const upperGroup = new THREE.Group();
  upperGroup.position.y = 1.12;

  // Engine housing / machinery deck
  const engineHousing = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.8, 1.4),
    paintBlue
  );
  engineHousing.position.set(0, 0.4, -0.2);
  upperGroup.add(engineHousing);

  // Engine housing beveled edges
  const engineTopTrim = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.04, 1.45), chrome);
  engineTopTrim.position.set(0, 0.8, -0.2);
  upperGroup.add(engineTopTrim);

  // Side panel lines (detail cuts)
  for (let i = 0; i < 6; i++) {
    const panelLine = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.6, 0.01), heavyGray);
    panelLine.position.set(-0.9, 0.4, -0.6 + i * 0.2);
    upperGroup.add(panelLine);
    const panelLine2 = panelLine.clone();
    panelLine2.position.x = 0.9;
    upperGroup.add(panelLine2);
  }

  // ── Engine Grille Vents ──
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 8; i++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.35), exhaustDark);
      vent.position.set(side * 0.91, 0.25 + i * 0.06, -0.5);
      upperGroup.add(vent);
    }
  }

  // ── Exhaust Stack ──
  const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.6, 12), exhaustDark);
  exhaustPipe.position.set(0.7, 1.1, -0.7);
  upperGroup.add(exhaustPipe);

  const exhaustCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.08, 12), steel);
  exhaustCap.position.set(0.7, 1.42, -0.7);
  upperGroup.add(exhaustCap);

  // Exhaust rain cap
  const rainCap = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.06, 12), steel);
  rainCap.position.set(0.7, 1.5, -0.7);
  upperGroup.add(rainCap);

  // ── Exhaust Heat Shimmer Ring (neon) ──
  const exhaustGlow = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 8, 16), neonOrange);
  exhaustGlow.rotation.x = Math.PI / 2;
  exhaustGlow.position.set(0.7, 1.43, -0.7);
  upperGroup.add(exhaustGlow);
  meshes.exhaustGlow = exhaustGlow;

  // ── Hydraulic Pump Housing ──
  const pumpHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.4, 16), steel);
  pumpHousing.position.set(-0.5, 0.2, -0.6);
  upperGroup.add(pumpHousing);
  meshes.pumpHousing = pumpHousing;

  // Pump indicator ring
  const pumpRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.015, 8, 16), neonCyan);
  pumpRing.rotation.x = Math.PI / 2;
  pumpRing.position.set(-0.5, 0.25, -0.6);
  upperGroup.add(pumpRing);
  meshes.pumpRing = pumpRing;

  // Hydraulic lines from pump
  const hLine1 = createTube([[-0.5, 0.4, -0.6], [-0.5, 0.8, -0.3], [-0.3, 1.2, 0.1]], 0.025, 16, hydraulicRed);
  upperGroup.add(hLine1);
  const hLine2 = createTube([[-0.5, 0.4, -0.6], [-0.6, 0.6, -0.4], [-0.6, 1.0, 0.0], [-0.4, 1.5, 0.3]], 0.025, 16, hydraulicRed);
  upperGroup.add(hLine2);
  const hLine3 = createTube([[0.5, 0.3, -0.5], [0.4, 0.7, -0.2], [0.2, 1.1, 0.2]], 0.02, 16, copper);
  upperGroup.add(hLine3);

  // ── Fuel Tank ──
  const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12), paintBlueLight);
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(0.55, 0.2, -0.6);
  upperGroup.add(fuelTank);

  const fuelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8), chrome);
  fuelCap.position.set(0.55, 0.36, -0.6);
  upperGroup.add(fuelCap);

  group.add(upperGroup);
  meshes.upperGroup = upperGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: COUNTERWEIGHT
  // ═══════════════════════════════════════════════════════════════════════════
  const counterweightGroup = new THREE.Group();
  counterweightGroup.position.set(0, 1.4, -0.85);

  // Main counterweight block with rounded shape
  const cwPoints = [];
  for (let i = 0; i <= 10; i++) {
    const a = (i / 10) * Math.PI;
    cwPoints.push(new THREE.Vector2(Math.sin(a) * 0.75 + 0.01, (i / 10) * 0.55 - 0.275));
  }
  const cwGeo = new THREE.LatheGeometry(cwPoints, 12, 0, Math.PI);
  const counterweight = new THREE.Mesh(cwGeo, heavyGray);
  counterweight.rotation.y = Math.PI / 2;
  counterweightGroup.add(counterweight);

  // Counterweight ribs
  for (let i = 0; i < 5; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 0.05), darkSteel);
    rib.position.set(0, -0.2 + i * 0.12, -0.15);
    counterweightGroup.add(rib);
  }

  // CW warning stripes
  for (let i = 0; i < 4; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.02), warningYellow);
    stripe.position.set(-0.5 + i * 0.35, 0, -0.3);
    counterweightGroup.add(stripe);
  }

  // Lifting lugs on counterweight
  for (let side = -1; side <= 1; side += 2) {
    const lug = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 12), steel);
    lug.position.set(side * 0.5, 0.3, -0.2);
    counterweightGroup.add(lug);
  }

  upperGroup.add(counterweightGroup);
  meshes.counterweight = counterweightGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: OPERATOR CAB
  // ═══════════════════════════════════════════════════════════════════════════
  const cabGroup = new THREE.Group();
  cabGroup.position.set(-0.65, 1.12, 0.45);

  // Cab body – rounded using multiple geometries
  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.9), paintBlue);
  cabBody.position.set(0, 0.45, 0);
  cabGroup.add(cabBody);

  // Cab roof (slightly larger)
  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 0.96), darkSteel);
  cabRoof.position.set(0, 0.92, 0);
  cabGroup.add(cabRoof);

  // Cab floor
  const cabFloor = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.04, 0.92), darkSteel);
  cabFloor.position.set(0, 0, 0);
  cabGroup.add(cabFloor);

  // ── Cab Windows (tinted glass) ──
  // Front windshield
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.55, 0.02), tinted);
  windshield.position.set(0, 0.5, 0.46);
  cabGroup.add(windshield);

  // Side windows
  const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.55, 0.7), tinted);
  sideWindow.position.set(0.43, 0.5, 0);
  cabGroup.add(sideWindow);
  const sideWindow2 = sideWindow.clone();
  sideWindow2.position.x = -0.43;
  cabGroup.add(sideWindow2);

  // Rear window
  const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.02), tinted);
  rearWindow.position.set(0, 0.55, -0.46);
  cabGroup.add(rearWindow);

  // ── Window Frames ──
  const frameMat = exhaustDark;
  // Front frame
  const fFrameTop = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.03), frameMat);
  fFrameTop.position.set(0, 0.78, 0.46);
  cabGroup.add(fFrameTop);
  const fFrameBot = fFrameTop.clone();
  fFrameBot.position.y = 0.22;
  cabGroup.add(fFrameBot);
  const fFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.56, 0.03), frameMat);
  fFrameL.position.set(-0.39, 0.5, 0.46);
  cabGroup.add(fFrameL);
  const fFrameR = fFrameL.clone();
  fFrameR.position.x = 0.39;
  cabGroup.add(fFrameR);

  // ── Door ──
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.72, 0.5), paintBlueLight);
  door.position.set(0.44, 0.38, 0.1);
  cabGroup.add(door);

  const doorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.12), chrome);
  doorHandle.position.set(0.46, 0.45, 0.15);
  cabGroup.add(doorHandle);

  // ── Entry Steps / Ladder ──
  for (let i = 0; i < 3; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.15), darkSteel);
    step.position.set(0.5, -0.08 - i * 0.22, 0.3);
    cabGroup.add(step);

    // Anti-slip treads
    for (let j = 0; j < 4; j++) {
      const tread = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.12), rubber);
      tread.position.set(0.38 + j * 0.06, -0.06 - i * 0.22, 0.3);
      cabGroup.add(tread);
    }
  }

  // Handrail
  const handrailTube = createTube([[0.65, 0.9, 0.5], [0.65, 0.5, 0.5], [0.65, -0.1, 0.3], [0.65, -0.5, 0.3]], 0.015, 12, warningYellow);
  cabGroup.add(handrailTube);

  // ── Interior Details ──
  // Operator seat
  const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.3), exhaustDark);
  seatBase.position.set(-0.05, 0.12, -0.05);
  cabGroup.add(seatBase);
  const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.06), exhaustDark);
  seatBack.position.set(-0.05, 0.33, -0.18);
  cabGroup.add(seatBack);

  // Control panel
  const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.06), darkSteel);
  controlPanel.position.set(0, 0.25, 0.38);
  controlPanel.rotation.x = -0.3;
  cabGroup.add(controlPanel);

  // Control panel buttons/indicators
  for (let i = 0; i < 5; i++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8),
      i === 0 ? neonGreen : i === 1 ? neonRed : i === 2 ? neonCyan : neonOrange);
    btn.position.set(-0.12 + i * 0.06, 0.3, 0.37);
    cabGroup.add(btn);
  }

  // Joystick controls
  for (let side = -1; side <= 1; side += 2) {
    const stickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.03, 8), darkSteel);
    stickBase.position.set(side * 0.2, 0.2, 0.15);
    cabGroup.add(stickBase);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.12, 8), rubber);
    stick.position.set(side * 0.2, 0.28, 0.15);
    cabGroup.add(stick);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), rubber);
    knob.position.set(side * 0.2, 0.34, 0.15);
    cabGroup.add(knob);
  }

  // ── Cab Lights ──
  // Work lights on roof
  for (let i = 0; i < 3; i++) {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.04), glass);
    light.position.set(-0.2 + i * 0.2, 0.97, 0.45);
    cabGroup.add(light);
    const lightGlow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), neonCyan);
    lightGlow.position.set(-0.2 + i * 0.2, 0.97, 0.47);
    cabGroup.add(lightGlow);
  }

  // Rear lights
  for (let i = 0; i < 2; i++) {
    const rLight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), neonRed);
    rLight.position.set(-0.15 + i * 0.3, 0.3, -0.47);
    cabGroup.add(rLight);
  }

  // ── Side Mirror ──
  const mirrorArm = createTube([[0.44, 0.7, 0.45], [0.62, 0.7, 0.55], [0.68, 0.7, 0.6]], 0.008, 8, steel);
  cabGroup.add(mirrorArm);
  const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.01), chrome);
  mirror.position.set(0.68, 0.7, 0.61);
  cabGroup.add(mirror);

  upperGroup.add(cabGroup);
  meshes.cabGroup = cabGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: VERTICAL LEADER / MAST
  // ═══════════════════════════════════════════════════════════════════════════
  const mastGroup = new THREE.Group();
  mastGroup.position.set(0.15, 1.12, 0.6);

  const mastHeight = 6.5;

  // ── Main Leader Rails (two parallel I-beam style) ──
  for (let side = -1; side <= 1; side += 2) {
    // Front flange
    const frontFlange = new THREE.Mesh(new THREE.BoxGeometry(0.08, mastHeight, 0.02), steel);
    frontFlange.position.set(side * 0.22, mastHeight / 2, 0.06);
    mastGroup.add(frontFlange);

    // Rear flange
    const rearFlange = new THREE.Mesh(new THREE.BoxGeometry(0.08, mastHeight, 0.02), steel);
    rearFlange.position.set(side * 0.22, mastHeight / 2, -0.06);
    mastGroup.add(rearFlange);

    // Web
    const web = new THREE.Mesh(new THREE.BoxGeometry(0.02, mastHeight, 0.1), steel);
    web.position.set(side * 0.22, mastHeight / 2, 0);
    mastGroup.add(web);
  }

  // ── Cross Bracing (lattice pattern) ──
  const braceCount = 18;
  for (let i = 0; i < braceCount; i++) {
    const y = 0.3 + (i / braceCount) * (mastHeight - 0.6);

    // Horizontal cross member
    const crossBar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.025, 0.025), darkSteel);
    crossBar.position.set(0, y, 0);
    mastGroup.add(crossBar);

    // Diagonal braces (alternating X pattern)
    if (i < braceCount - 1) {
      const nextY = 0.3 + ((i + 1) / braceCount) * (mastHeight - 0.6);
      const diag1 = createTube(
        [[-0.2, y, 0], [0.2, nextY, 0]],
        0.008, 4, darkSteel
      );
      mastGroup.add(diag1);
      const diag2 = createTube(
        [[0.2, y, 0], [-0.2, nextY, 0]],
        0.008, 4, darkSteel
      );
      mastGroup.add(diag2);
    }
  }

  // ── Leader Guide Rails (inner channels for hammer travel) ──
  for (let side = -1; side <= 1; side += 2) {
    const guideRail = new THREE.Mesh(new THREE.BoxGeometry(0.03, mastHeight, 0.04), chrome);
    guideRail.position.set(side * 0.12, mastHeight / 2, 0.04);
    mastGroup.add(guideRail);
  }

  // ── Mast Top Sheave / Pulley ──
  const sheave = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 12, 16), chrome);
  sheave.position.set(0, mastHeight + 0.05, 0);
  mastGroup.add(sheave);
  meshes.sheave = sheave;

  const sheaveAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8), steel);
  sheaveAxle.rotation.z = Math.PI / 2;
  sheaveAxle.position.set(0, mastHeight + 0.05, 0);
  mastGroup.add(sheaveAxle);

  // ── Mast Top Warning Light (aviation beacon) ──
  const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), neonRed);
  beaconLight.position.set(0, mastHeight + 0.25, 0);
  mastGroup.add(beaconLight);
  meshes.beaconLight = beaconLight;

  // ── Hoist Cable (wire rope) ──
  const cablePoints = [];
  for (let i = 0; i <= 20; i++) {
    cablePoints.push([0, mastHeight + 0.05 - i * 0.25, 0.12]);
  }
  const hoistCable = createTube(cablePoints, 0.008, 24, darkSteel);
  mastGroup.add(hoistCable);

  // ── Mast Scale Markings ──
  for (let i = 0; i < 12; i++) {
    const markY = 0.5 + i * 0.5;
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.005, 0.005), warningYellow);
    mark.position.set(-0.25, markY, 0);
    mastGroup.add(mark);
  }

  // ── Neon Status Strip along mast ──
  const neonStrip = new THREE.Mesh(new THREE.BoxGeometry(0.015, mastHeight * 0.9, 0.015), neonCyan);
  neonStrip.position.set(0.3, mastHeight * 0.5, 0);
  mastGroup.add(neonStrip);
  meshes.neonStrip = neonStrip;

  // ── Mast Base Pivot / Hinge Assembly ──
  const pivotBlock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.3), darkSteel);
  pivotBlock.position.set(0, 0, 0);
  mastGroup.add(pivotBlock);

  const pivotPin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12), chrome);
  pivotPin.rotation.z = Math.PI / 2;
  pivotPin.position.set(0, 0, 0);
  mastGroup.add(pivotPin);

  // Mast stabilizer braces to upper structure
  const stabBrace1 = createTube([[0.3, 0.3, -0.15], [0.5, -0.2, -0.6], [0.5, -0.4, -0.8]], 0.025, 12, steel);
  mastGroup.add(stabBrace1);
  const stabBrace2 = createTube([[-0.3, 0.3, -0.15], [-0.5, -0.2, -0.6], [-0.5, -0.4, -0.8]], 0.025, 12, steel);
  mastGroup.add(stabBrace2);

  upperGroup.add(mastGroup);
  meshes.mastGroup = mastGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: HYDRAULIC HAMMER MECHANISM
  // ═══════════════════════════════════════════════════════════════════════════
  const hammerGroup = new THREE.Group();
  hammerGroup.position.set(0, 3.2, 0); // Starts midway up mast

  // ── Main Hammer Housing ──
  const hammerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 1.0, 16),
    heavyGray
  );
  hammerBody.position.y = 0;
  hammerGroup.add(hammerBody);

  // Hammer housing reinforcement rings
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.015, 8, 16), steel);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.35 + i * 0.25;
    hammerGroup.add(ring);
  }

  // ── Impact Ram (inner piston visible at bottom) ──
  const ram = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12),
    chrome
  );
  ram.position.y = -0.7;
  hammerGroup.add(ram);
  meshes.ram = ram;

  // Ram strike plate
  const strikePlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.06, 12),
    darkSteel
  );
  strikePlate.position.y = -0.95;
  hammerGroup.add(strikePlate);
  meshes.strikePlate = strikePlate;

  // ── Hammer Hydraulic Cylinders (twin) ──
  for (let side = -1; side <= 1; side += 2) {
    const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 10), hydraulicRed);
    cylBody.position.set(side * 0.15, 0.1, 0.12);
    hammerGroup.add(cylBody);

    const cylRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), chrome);
    cylRod.position.set(side * 0.15, -0.3, 0.12);
    hammerGroup.add(cylRod);

    // Cylinder end caps
    const endCap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), steel);
    endCap.position.set(side * 0.15, 0.46, 0.12);
    hammerGroup.add(endCap);
  }

  // ── Hydraulic Hoses to Hammer ──
  const hammerHose1 = createTube([[0.15, 0.45, 0.12], [0.2, 0.8, 0.15], [0.18, 1.2, 0.1]], 0.015, 12, rubber);
  hammerGroup.add(hammerHose1);
  const hammerHose2 = createTube([[-0.15, 0.45, 0.12], [-0.2, 0.8, 0.15], [-0.18, 1.2, 0.1]], 0.015, 12, rubber);
  hammerGroup.add(hammerHose2);

  // ── Hammer Slider Guides ──
  for (let side = -1; side <= 1; side += 2) {
    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.04), aluminum);
    slider.position.set(side * 0.12, 0.45, 0.04);
    hammerGroup.add(slider);
  }

  // ── Energy Transfer Cushion (shock pad) ──
  const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 12), rubber);
  cushion.position.y = -0.5;
  hammerGroup.add(cushion);

  // ── Plasma Energy Core (futuristic glow inside hammer) ──
  const plasmaSphere = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), plasmaCore);
  plasmaSphere.position.y = 0.1;
  hammerGroup.add(plasmaSphere);
  meshes.plasmaSphere = plasmaSphere;

  // Rotating energy rings around core
  for (let i = 0; i < 3; i++) {
    const eRing = new THREE.Mesh(new THREE.TorusGeometry(0.1 + i * 0.02, 0.005, 8, 24), neonCyan);
    eRing.position.y = 0.1;
    eRing.rotation.x = (i / 3) * Math.PI;
    eRing.rotation.z = (i / 3) * Math.PI * 0.5;
    hammerGroup.add(eRing);
    meshes[`energyRing${i}`] = eRing;
  }

  mastGroup.add(hammerGroup);
  meshes.hammerGroup = hammerGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: PILE GRIPPING JAWS / PILE GATE
  // ═══════════════════════════════════════════════════════════════════════════
  const jawGroup = new THREE.Group();
  jawGroup.position.set(0, 0.5, 0); // Near bottom of mast

  // ── Jaw Frame ──
  const jawFrame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.3), darkSteel);
  jawFrame.position.y = 0;
  jawGroup.add(jawFrame);

  // ── Left Jaw ──
  const leftJaw = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.25), steel);
  leftJaw.position.set(-0.18, -0.2, 0);
  jawGroup.add(leftJaw);
  meshes.leftJaw = leftJaw;

  // Jaw teeth (gripping serrations)
  for (let i = 0; i < 5; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.02), chrome);
    tooth.position.set(-0.14, -0.1 - i * 0.06, 0);
    jawGroup.add(tooth);
  }

  // ── Right Jaw ──
  const rightJaw = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.25), steel);
  rightJaw.position.set(0.18, -0.2, 0);
  jawGroup.add(rightJaw);
  meshes.rightJaw = rightJaw;

  // Jaw teeth
  for (let i = 0; i < 5; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.02), chrome);
    tooth.position.set(0.14, -0.1 - i * 0.06, 0);
    jawGroup.add(tooth);
  }

  // ── Jaw Hydraulic Cylinders ──
  for (let side = -1; side <= 1; side += 2) {
    const jawCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8), hydraulicRed);
    jawCyl.rotation.z = Math.PI / 2;
    jawCyl.position.set(side * 0.12, 0.05, 0.12);
    jawGroup.add(jawCyl);

    const jawRod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8), chrome);
    jawRod.rotation.z = Math.PI / 2;
    jawRod.position.set(side * 0.06, 0.05, 0.12);
    jawGroup.add(jawRod);
  }

  // ── The Pile (currently being driven) ──
  const pile = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 2.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x8B7355, metalness: 0.3, roughness: 0.6 })
  );
  pile.position.y = -1.5;
  jawGroup.add(pile);
  meshes.pile = pile;

  // Pile tip (pointed)
  const pileTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.25, 12),
    steel
  );
  pileTip.position.y = -2.8;
  jawGroup.add(pileTip);

  // ── Jaw Status LEDs ──
  for (let i = 0; i < 3; i++) {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), neonGreen);
    led.position.set(-0.2 + i * 0.2, 0.1, 0.16);
    jawGroup.add(led);
    meshes[`jawLed${i}`] = led;
  }

  mastGroup.add(jawGroup);
  meshes.jawGroup = jawGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9: SPOTTER / GROUND LEVEL DETAILS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Spud (ground spud / anchor) ──
  for (let side = -1; side <= 1; side += 2) {
    const spud = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.5, 10), darkSteel);
    spud.position.set(side * 1.5, 0.25, 0.8);
    baseGroup.add(spud);

    const spudPlate = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.35), steel);
    spudPlate.position.set(side * 1.5, 0, 0.8);
    baseGroup.add(spudPlate);

    // Spud hydraulic cylinder
    const spudCyl = createTube(
      [[side * 1.3, 0.5, 0.6], [side * 1.45, 0.35, 0.75]],
      0.02, 6, hydraulicRed
    );
    baseGroup.add(spudCyl);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: ADDITIONAL DETAILS – Rivets, Labels, Sensors
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Rivet Rows along hull ──
  for (let i = 0; i < 12; i++) {
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), steel);
    rivet.position.set(-1.0 + i * 0.18, 0.88, 0.82);
    baseGroup.add(rivet);
    const rivet2 = rivet.clone();
    rivet2.position.z = -0.82;
    baseGroup.add(rivet2);
  }

  // ── Sensor Array on Mast ──
  const sensorBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.06), aluminum);
  sensorBox.position.set(0.3, 5.0, 0.1);
  mastGroup.add(sensorBox);
  const sensorLens = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), glass);
  sensorLens.position.set(0.3, 5.0, 0.14);
  mastGroup.add(sensorLens);
  meshes.sensorLens = sensorLens;

  // ── GPS Antenna on Cab Roof ──
  const gpsAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 6), steel);
  gpsAntenna.position.set(0, 1.05, 0);
  cabGroup.add(gpsAntenna);
  const gpsDome = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), plastic);
  gpsDome.position.set(0, 1.17, 0);
  cabGroup.add(gpsDome);

  // ── Winch Drum (on upper structure) ──
  const winchDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16), steel);
  winchDrum.rotation.z = Math.PI / 2;
  winchDrum.position.set(0.5, 0.5, 0.1);
  upperGroup.add(winchDrum);
  meshes.winchDrum = winchDrum;

  // Cable wraps on drum
  for (let i = 0; i < 6; i++) {
    const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.006, 6, 24), darkSteel);
    wrap.position.set(0.42 + i * 0.03, 0.5, 0.1);
    upperGroup.add(wrap);
  }

  // ── Winch Motor ──
  const winchMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), heavyGray);
  winchMotor.rotation.z = Math.PI / 2;
  winchMotor.position.set(0.7, 0.5, 0.1);
  upperGroup.add(winchMotor);

  // ── Power Distribution Box ──
  const pdBox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.12), warningYellow);
  pdBox.position.set(-0.7, 0.5, 0.2);
  upperGroup.add(pdBox);

  // PD Box indicator
  const pdIndicator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.01), neonGreen);
  pdIndicator.position.set(-0.7, 0.52, 0.27);
  upperGroup.add(pdIndicator);
  meshes.pdIndicator = pdIndicator;

  // ══ Additional Hydraulic Hose Routing ══
  const mainHose = createTube(
    [[0.2, 1.1, 0.2], [0.15, 2.0, 0.5], [0.15, 3.5, 0.6], [0.15, 4.5, 0.6]],
    0.02, 24, rubber
  );
  upperGroup.add(mainHose);

  const returnHose = createTube(
    [[-0.2, 1.1, 0.2], [-0.15, 2.0, 0.5], [-0.15, 3.5, 0.6], [-0.15, 4.5, 0.6]],
    0.02, 24, hydraulicRed
  );
  upperGroup.add(returnHose);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 11: FUTURISTIC HOLOGRAPHIC DISPLAY (on mast)
  // ═══════════════════════════════════════════════════════════════════════════
  const holoGroup = new THREE.Group();
  holoGroup.position.set(0.35, 4.5, 0.15);

  const holoScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.2),
    new THREE.MeshStandardMaterial({
      color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.4, side: THREE.DoubleSide
    })
  );
  holoGroup.add(holoScreen);
  meshes.holoScreen = holoScreen;

  // Holo frame
  const holoFrame = new THREE.Mesh(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.31, 0.21, 0.005)),
    new THREE.LineBasicMaterial({ color: 0x00ffcc })
  );
  // Use line segments for frame
  const holoFrameLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.31, 0.21, 0.005)),
    new THREE.LineBasicMaterial({ color: 0x00ffcc })
  );
  holoGroup.add(holoFrameLines);

  // Holo data bars
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.02 + Math.random() * 0.08, 0.002),
      new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ddaa, emissiveIntensity: 0.8, transparent: true, opacity: 0.6 })
    );
    bar.position.set(-0.1 + i * 0.05, -0.05, 0.005);
    holoGroup.add(bar);
    meshes[`holoBar${i}`] = bar;
  }

  mastGroup.add(holoGroup);
  meshes.holoGroup = holoGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // PARTS ARRAY
  // ═══════════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Crawler Track Base',
      mesh: 'baseGroup',
      description: 'Twin crawler track undercarriage providing stable ground support and mobility on rough terrain. Features individual track links with tread lugs, drive sprockets, idler wheels, and road roller assemblies.',
      material: 'Steel track links with rubber pads, hardened steel sprockets and rollers',
      function: 'Provides stable platform and mobility on unprepared ground; distributes machine weight to minimize ground pressure.',
      assemblyOrder: 1,
      connections: ['Slew Ring/Turntable', 'Ground Spuds'],
      failureEffect: 'Machine becomes immobile; uneven track wear causes alignment issues during driving.',
      cascadeFailures: ['Slew Ring misalignment', 'Mast verticality compromised'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -2.0, z: 0 }
    },
    {
      name: 'Turntable / Slew Ring',
      mesh: 'turntableGroup',
      description: 'Heavy-duty slewing bearing that enables 360° rotation of the upper structure relative to the track base. Precision-machined ring gear with roller bearing.',
      material: 'Case-hardened alloy steel bearing, chrome-plated races',
      function: 'Allows full rotation of the mast and cab assembly for pile positioning without repositioning the tracks.',
      assemblyOrder: 2,
      connections: ['Crawler Track Base', 'Upper Structure'],
      failureEffect: 'Loss of swing capability; operator cannot position mast over pile locations.',
      cascadeFailures: ['Upper Structure locked in position', 'Reduced operational reach'],
      originalPosition: { x: 0, y: 0.95, z: 0 },
      explodedPosition: { x: 0, y: -0.5, z: 0 }
    },
    {
      name: 'Upper Structure / Engine Deck',
      mesh: 'upperGroup',
      description: 'Main machinery platform housing diesel engine, hydraulic pump, fuel tank, winch system, and power distribution. Includes ventilation grilles, exhaust system, and hydraulic routing.',
      material: 'Welded structural steel frame with painted steel panels, copper hydraulic fittings',
      function: 'Houses all power generation and hydraulic components; provides mounting for mast, cab, and counterweight.',
      assemblyOrder: 3,
      connections: ['Turntable', 'Mast Assembly', 'Cab', 'Counterweight', 'Hydraulic Hammer'],
      failureEffect: 'Total loss of hydraulic power; hammer cannot operate; machine shutdown.',
      cascadeFailures: ['Hammer inoperative', 'Winch failure', 'Cab systems offline'],
      originalPosition: { x: 0, y: 1.12, z: 0 },
      explodedPosition: { x: 0, y: 1.5, z: -2.0 }
    },
    {
      name: 'Counterweight Assembly',
      mesh: 'counterweight',
      description: 'Massive ballast block at the rear of the upper structure to balance the forward moment created by the mast, hammer, and pile during driving operations.',
      material: 'Cast iron / steel plates with lifting lugs',
      function: 'Prevents the machine from tipping forward under mast load; maintains stability during high-energy hammer strikes.',
      assemblyOrder: 4,
      connections: ['Upper Structure'],
      failureEffect: 'Machine instability; risk of forward tipping especially during driving on slopes.',
      cascadeFailures: ['Structural stress on slew ring', 'Track base overloading'],
      originalPosition: { x: 0, y: 1.4, z: -0.85 },
      explodedPosition: { x: 0, y: 1.5, z: -3.5 }
    },
    {
      name: 'Operator Cab',
      mesh: 'cabGroup',
      description: 'ROPS/FOPS certified enclosed operator cabin with tinted safety glass, ergonomic seat, dual joystick controls, instrument panel with real-time driving data, work lights, mirrors, and climate control.',
      material: 'Welded steel frame, laminated tinted safety glass, rubber vibration mounts',
      function: 'Provides safe, comfortable operating environment with full visibility of the mast and pile; houses all machine controls and monitoring systems.',
      assemblyOrder: 5,
      connections: ['Upper Structure', 'Control Systems'],
      failureEffect: 'Operator exposed to noise/vibration; loss of instrumentation data; reduced safety.',
      cascadeFailures: ['Control system access lost', 'No monitoring feedback'],
      originalPosition: { x: -0.65, y: 1.12, z: 0.45 },
      explodedPosition: { x: -3.0, y: 2.0, z: 1.5 }
    },
    {
      name: 'Vertical Leader / Mast',
      mesh: 'mastGroup',
      description: 'Full-length lattice leader mast providing vertical guide rails for the hydraulic hammer. Features I-beam rails, cross-bracing, sheave pulley, hoist cable, sensor array, and aviation warning beacon.',
      material: 'High-strength structural steel with chrome guide rails',
      function: 'Guides the hammer vertically during the driving stroke; maintains pile alignment; supports hoist system for hammer positioning.',
      assemblyOrder: 6,
      connections: ['Upper Structure', 'Hydraulic Hammer', 'Pile Gripping Jaws', 'Hoist Cable'],
      failureEffect: 'Hammer cannot travel vertically; pile driving accuracy lost; structural collapse risk.',
      cascadeFailures: ['Hammer jammed', 'Pile misalignment', 'Cable derailment'],
      originalPosition: { x: 0.15, y: 1.12, z: 0.6 },
      explodedPosition: { x: 1.5, y: 3.0, z: 2.0 }
    },
    {
      name: 'Hydraulic Hammer',
      mesh: 'hammerGroup',
      description: 'High-energy hydraulic impact hammer with twin hydraulic cylinders, impact ram, energy transfer cushion, and slider guides. Features integrated energy monitoring with plasma core visualization.',
      material: 'Forged alloy steel housing, hardened chrome ram, rubber shock cushion',
      function: 'Delivers repeated high-energy strikes to the pile head, driving it into the ground. Hydraulic cylinders lift and release the ram for each blow cycle.',
      assemblyOrder: 7,
      connections: ['Mast Guide Rails', 'Hydraulic System', 'Hoist Cable'],
      failureEffect: 'Cannot drive piles; project halted. Ram misalignment can damage pile heads.',
      cascadeFailures: ['Pile head damage', 'Cushion degradation', 'Hydraulic line rupture'],
      originalPosition: { x: 0, y: 3.2, z: 0 },
      explodedPosition: { x: 2.5, y: 5.0, z: 1.0 }
    },
    {
      name: 'Pile Gripping Jaws',
      mesh: 'jawGroup',
      description: 'Hydraulically actuated clamping jaws at the mast base that grip and align the pile during driving. Features serrated gripping teeth and status monitoring LEDs.',
      material: 'Hardened steel jaws with chrome-plated teeth, hydraulic cylinders',
      function: 'Securely holds the pile in vertical alignment during driving; prevents lateral movement or rotation of the pile.',
      assemblyOrder: 8,
      connections: ['Mast Base', 'Hydraulic System', 'Pile'],
      failureEffect: 'Pile slips or rotates during driving; misalignment causes structural defects in foundation.',
      cascadeFailures: ['Pile deviation', 'Hammer strikes off-center', 'Jaw cylinder seal failure'],
      originalPosition: { x: 0, y: 0.5, z: 0 },
      explodedPosition: { x: 2.5, y: -1.0, z: 1.0 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary function of the leader/mast on a hydraulic pile driver?',
      options: [
        'To lift the entire machine off the ground',
        'To guide the hydraulic hammer vertically and maintain pile alignment',
        'To act as a crane for loading materials',
        'To serve as a radio communications tower'
      ],
      correct: 1,
      explanation: 'The leader (mast) provides vertical guide rails for the hydraulic hammer to travel along during its strike cycle. It ensures the hammer hits the pile squarely and that the pile is driven truly vertical, which is critical for foundation integrity.',
      difficulty: 'easy'
    },
    {
      question: 'Why does a hydraulic pile driver have a large counterweight at the rear?',
      options: [
        'To increase the driving force of the hammer',
        'To power the hydraulic system through gravitational energy',
        'To balance the forward moment from the mast, hammer, and pile to prevent tipping',
        'To anchor the machine permanently to the ground'
      ],
      correct: 2,
      explanation: 'The tall vertical mast and heavy hammer create a significant forward overturning moment. The counterweight at the rear balances this moment, preventing the machine from tipping forward, especially during high-energy driving operations.',
      difficulty: 'medium'
    },
    {
      question: 'What is the purpose of the energy transfer cushion located between the hammer ram and the pile head?',
      options: [
        'To increase the impact force beyond the hammer\'s rated energy',
        'To absorb and distribute the impact force evenly, protecting both the ram and pile from damage',
        'To generate heat for cold-weather operation',
        'To act as a spring to bounce the hammer back up after each strike'
      ],
      correct: 1,
      explanation: 'The cushion (typically made of hardwood, plastic, or specialized composites) sits between the ram and the pile helmet. It distributes the impact force over a slightly longer duration and larger area, preventing localized damage to the pile head (brooming/mushrooming) and reducing stress on the hammer components.',
      difficulty: 'hard'
    },
    {
      question: 'What would happen if the pile gripping jaws failed during a driving operation?',
      options: [
        'The pile would be driven faster due to reduced friction',
        'The hydraulic hammer would automatically stop',
        'The pile could slip, rotate, or deviate from vertical alignment, causing structural defects',
        'The counterweight would need to be increased'
      ],
      correct: 2,
      explanation: 'The pile gripping jaws hold the pile in proper alignment during driving. If they fail, the pile can shift laterally, rotate, or deviate from the design verticality. This would result in an improperly placed foundation element, which is a serious structural defect that may require pile extraction and re-driving.',
      difficulty: 'medium'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════
  const description = `Modern Hydraulic Pile Driver – A heavy-duty construction machine used to drive 
structural piles (steel, concrete, or timber) deep into the ground to form building foundations, 
bridge supports, and retaining walls. This model features twin crawler tracks for site mobility, 
a 360° slewing turntable, a full-height lattice leader mast with guide rails, a high-energy 
hydraulic impact hammer with twin hydraulic cylinders and chrome ram, hydraulically actuated pile 
gripping jaws, an enclosed ROPS/FOPS operator cab with dual joystick controls and instrument panel, 
a heavy rear counterweight for stability, diesel engine with hydraulic pump system, winch drum with 
hoist cable, and comprehensive safety/monitoring systems including aviation beacon, GPS, and sensors. 
The hydraulic hammer delivers repeated high-energy blows to drive piles to design depth and bearing capacity.`;

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATE FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════
  function animate(time, speed, ms) {
    const t = time * speed;
    const m = ms || meshes;

    // ── Hammer Driving Cycle (rapid up-down piston action) ──
    if (m.hammerGroup) {
      // Hammer lifts then drops sharply (asymmetric sawtooth)
      const cycle = (t * 3.0) % 1.0;
      const hammerY = cycle < 0.7
        ? 3.2 + cycle / 0.7 * 0.8   // Slow lift
        : 3.2 + 0.8 - ((cycle - 0.7) / 0.3) * 0.8;  // Fast drop
      m.hammerGroup.position.y = hammerY;
    }

    // ── Ram piston extension on impact ──
    if (m.ram) {
      const cycle = (t * 3.0) % 1.0;
      const ramExtend = cycle > 0.9 ? (cycle - 0.9) / 0.1 * 0.15 : 0;
      m.ram.position.y = -0.7 - ramExtend;
    }

    // ── Strike plate impact flash ──
    if (m.strikePlate) {
      const cycle = (t * 3.0) % 1.0;
      const impactFlash = cycle > 0.95 ? 1.0 : 0.0;
      m.strikePlate.material = impactFlash > 0.5 ? neonOrange : darkSteel;
    }

    // ── Plasma Core Pulse ──
    if (m.plasmaSphere) {
      m.plasmaSphere.material.emissiveIntensity = 0.5 + Math.sin(t * 8) * 0.5;
      m.plasmaSphere.material.opacity = 0.6 + Math.sin(t * 6) * 0.25;
      m.plasmaSphere.scale.setScalar(0.9 + Math.sin(t * 10) * 0.15);
    }

    // ── Energy Rings Rotation ──
    for (let i = 0; i < 3; i++) {
      const ring = m[`energyRing${i}`];
      if (ring) {
        ring.rotation.x += 0.03 * (i + 1) * speed;
        ring.rotation.y += 0.02 * (i + 1) * speed;
        ring.rotation.z += 0.015 * (i + 1) * speed;
      }
    }

    // ── Beacon Light Flash ──
    if (m.beaconLight) {
      m.beaconLight.material.emissiveIntensity = Math.sin(t * 4) > 0 ? 1.2 : 0.1;
    }

    // ── Exhaust Glow Pulse ──
    if (m.exhaustGlow) {
      m.exhaustGlow.material.emissiveIntensity = 0.4 + Math.sin(t * 5) * 0.35;
    }

    // ── Pump Ring Spin ──
    if (m.pumpRing) {
      m.pumpRing.rotation.z += 0.02 * speed;
    }

    // ── Pump Housing vibration ──
    if (m.pumpHousing) {
      m.pumpHousing.position.x = -0.5 + Math.sin(t * 25) * 0.003;
      m.pumpHousing.position.z = -0.6 + Math.cos(t * 30) * 0.003;
    }

    // ── Winch Drum rotation (cable spooling) ──
    if (m.winchDrum) {
      m.winchDrum.rotation.x += 0.01 * speed;
    }

    // ── Sheave Pulley rotation ──
    if (m.sheave) {
      m.sheave.rotation.y += 0.015 * speed;
    }

    // ── Jaw LED blink pattern ──
    for (let i = 0; i < 3; i++) {
      const led = m[`jawLed${i}`];
      if (led) {
        const phase = t * 2 + i * 0.5;
        led.material.emissiveIntensity = Math.sin(phase) > 0.3 ? 1.0 : 0.15;
      }
    }

    // ── Jaw gripping animation (slight open/close) ──
    if (m.leftJaw && m.rightJaw) {
      const jawOpen = Math.sin(t * 0.5) * 0.015;
      m.leftJaw.position.x = -0.18 - jawOpen;
      m.rightJaw.position.x = 0.18 + jawOpen;
    }

    // ── Holo Screen flicker ──
    if (m.holoScreen) {
      m.holoScreen.material.opacity = 0.3 + Math.random() * 0.15;
    }

    // ── Holo Bars data animation ──
    for (let i = 0; i < 5; i++) {
      const bar = m[`holoBar${i}`];
      if (bar) {
        const newH = 0.02 + Math.abs(Math.sin(t * 2 + i * 1.2)) * 0.08;
        bar.scale.y = newH / 0.05;
      }
    }

    // ── Neon Strip pulse ──
    if (m.neonStrip) {
      m.neonStrip.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.35;
    }

    // ── PD Box indicator blink ──
    if (m.pdIndicator) {
      m.pdIndicator.material.emissiveIntensity = Math.sin(t * 6) > 0 ? 1.0 : 0.2;
    }

    // ── Sensor lens flicker ──
    if (m.sensorLens) {
      m.sensorLens.material.emissiveIntensity = 0.3 + Math.sin(t * 8) * 0.3;
    }

    // ── Pile slowly sinking (very subtle) ──
    if (m.pile) {
      const sinkCycle = (t * 3.0) % 1.0;
      if (sinkCycle > 0.95) {
        m.pile.position.y -= 0.0005;
      }
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
