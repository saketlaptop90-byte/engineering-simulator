import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ───────────────────────── Custom Materials ─────────────────────────
  const hopperMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.35, metalness: 0.6 });
  const hopperAccent = new THREE.MeshStandardMaterial({ color: 0x991111, roughness: 0.3, metalness: 0.65 });
  const augerTubeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.25, metalness: 0.85 });
  const augerFlightMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.7 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.8 });
  const hydraulicMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.9 });
  const hydraulicRodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.1, metalness: 0.95 });
  const tarpMat = new THREE.MeshStandardMaterial({ color: 0x1a3a1a, roughness: 0.85, metalness: 0.05, side: THREE.DoubleSide });
  const neonGreenGlow = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.3 });
  const neonBlueGlow = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.3 });
  const scaleLEDMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.2, roughness: 0.1, metalness: 0.2 });
  const orangeReflector = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.4, roughness: 0.3, metalness: 0.2 });
  const redTailLight = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8, roughness: 0.15, metalness: 0.2 });
  const decalWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });
  const weldMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6, metalness: 0.7 });
  const grainMat = new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.9, metalness: 0.05 });
  const loadCellMat = new THREE.MeshStandardMaterial({ color: 0x4488cc, emissive: 0x224466, emissiveIntensity: 0.3, roughness: 0.3, metalness: 0.8 });

  // ═══════════════════════════════════════════════════════════════════
  //  MAIN FRAME / CHASSIS
  // ═══════════════════════════════════════════════════════════════════
  const frameGroup = new THREE.Group();

  // Main longitudinal beams (I-beam style)
  for (let side = -1; side <= 1; side += 2) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 0.25, 0.15),
      frameMat
    );
    beam.position.set(0, -0.8, side * 0.9);
    beam.castShadow = true;
    frameGroup.add(beam);

    // Flanges (top and bottom of I-beam)
    for (let fb = -1; fb <= 1; fb += 2) {
      const flange = new THREE.Mesh(
        new THREE.BoxGeometry(6.0, 0.04, 0.25),
        frameMat
      );
      flange.position.set(0, -0.8 + fb * 0.125, side * 0.9);
      frameGroup.add(flange);
    }
  }

  // Cross members
  for (let i = -2.5; i <= 2.5; i += 1.0) {
    const cross = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.2, 2.0),
      frameMat
    );
    cross.position.set(i, -0.8, 0);
    cross.castShadow = true;
    frameGroup.add(cross);
  }

  // Gusset plates at intersections
  for (let i = -2.5; i <= 2.5; i += 1.0) {
    for (let side = -1; side <= 1; side += 2) {
      const gusset = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 0.15),
        weldMat
      );
      gusset.position.set(i, -0.7, side * 0.9);
      frameGroup.add(gusset);
    }
  }

  meshes.frame = frameGroup;
  group.add(frameGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  HOPPER BODY (Tapered V-bottom shape)
  // ═══════════════════════════════════════════════════════════════════
  const hopperGroup = new THREE.Group();

  // Main hopper body using custom shape (tapered trapezoid cross section)
  const hopperShape = new THREE.Shape();
  hopperShape.moveTo(-1.4, 0);
  hopperShape.lineTo(-1.8, 2.2);
  hopperShape.lineTo(1.8, 2.2);
  hopperShape.lineTo(1.4, 0);
  hopperShape.closePath();

  const extrudeSettings = { depth: 4.5, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 };
  const hopperGeo = new THREE.ExtrudeGeometry(hopperShape, extrudeSettings);
  hopperGeo.rotateY(Math.PI / 2);
  hopperGeo.translate(2.25, -0.55, 0);

  const hopperBody = new THREE.Mesh(hopperGeo, hopperMat);
  hopperBody.castShadow = true;
  hopperBody.receiveShadow = true;
  hopperGroup.add(hopperBody);

  // Hopper top rim / lip (reinforcement rail)
  const rimCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.25, 1.65, -1.83),
    new THREE.Vector3(-2.25, 1.65, 1.83),
    new THREE.Vector3(2.25, 1.65, 1.83),
    new THREE.Vector3(2.25, 1.65, -1.83),
    new THREE.Vector3(-2.25, 1.65, -1.83)
  ]);
  const rimGeo = new THREE.TubeGeometry(rimCurve, 64, 0.05, 8, false);
  const rim = new THREE.Mesh(rimGeo, chrome);
  hopperGroup.add(rim);

  // Vertical ribs / stiffeners on hopper walls
  for (let i = -2.0; i <= 2.0; i += 0.8) {
    for (let side = -1; side <= 1; side += 2) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 2.1, 0.06),
        hopperAccent
      );
      rib.position.set(i, 0.55, side * (1.5 + Math.abs(i) * 0.04));
      hopperGroup.add(rib);
    }
  }

  // Horizontal reinforcement bands
  for (let h = 0.3; h <= 1.5; h += 0.6) {
    for (let side = -1; side <= 1; side += 2) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 0.06, 0.04),
        hopperAccent
      );
      band.position.set(0, h, side * 1.65);
      hopperGroup.add(band);
    }
  }

  // Bottom discharge gate (V-bottom)
  const gateGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 8);
  const gate = new THREE.Mesh(gateGeo, darkSteel);
  gate.rotation.x = Math.PI / 2;
  gate.position.set(-0.5, -0.55, 0);
  hopperGroup.add(gate);

  // Gate actuator (hydraulic slide)
  const gateActuator = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8),
    hydraulicRodMat
  );
  gateActuator.position.set(-0.5, -0.35, 0.2);
  gateActuator.rotation.z = Math.PI / 4;
  hopperGroup.add(gateActuator);

  // Grain inside hopper (visible mound)
  const grainMound = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.5),
    grainMat
  );
  grainMound.position.set(0, 1.2, 0);
  grainMound.scale.set(1.4, 0.5, 1.0);
  meshes.grainMound = grainMound;
  hopperGroup.add(grainMound);

  meshes.hopper = hopperGroup;
  group.add(hopperGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  TARP COVER SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  const tarpGroup = new THREE.Group();

  // Tarp bows / ribs (arched supports)
  const bowPositions = [-1.8, -0.6, 0.6, 1.8];
  bowPositions.forEach(xPos => {
    const bowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -1.85),
      new THREE.Vector3(0, 0.45, -1.2),
      new THREE.Vector3(0, 0.6, 0),
      new THREE.Vector3(0, 0.45, 1.2),
      new THREE.Vector3(0, 0, 1.85)
    ]);
    const bowGeo = new THREE.TubeGeometry(bowCurve, 20, 0.025, 6, false);
    const bow = new THREE.Mesh(bowGeo, aluminum);
    bow.position.set(xPos, 1.65, 0);
    tarpGroup.add(bow);
  });

  // Tarp fabric (curved surface)
  const tarpGeo = new THREE.PlaneGeometry(4.2, 4.0, 20, 12);
  const tarpPositions = tarpGeo.attributes.position;
  for (let i = 0; i < tarpPositions.count; i++) {
    const x = tarpPositions.getX(i);
    const y = tarpPositions.getY(i);
    const arch = 0.6 * Math.cos((y / 4.0) * Math.PI);
    tarpPositions.setZ(i, arch);
  }
  tarpGeo.computeVertexNormals();
  const tarpMesh = new THREE.Mesh(tarpGeo, tarpMat);
  tarpMesh.rotation.x = -Math.PI / 2;
  tarpMesh.position.set(0, 2.05, 0);
  meshes.tarp = tarpMesh;
  tarpGroup.add(tarpMesh);

  // Tarp tie-down straps
  for (let i = -1.5; i <= 1.5; i += 1.0) {
    for (let side = -1; side <= 1; side += 2) {
      const strap = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.5, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 })
      );
      strap.position.set(i, 1.5, side * 1.88);
      tarpGroup.add(strap);
    }
  }

  group.add(tarpGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  UNLOADING AUGER ARM (Swing & Rotate)
  // ═══════════════════════════════════════════════════════════════════
  const augerPivot = new THREE.Group();
  augerPivot.position.set(1.8, 0.6, -1.0);

  // Auger pivot base (turntable)
  const pivotBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.3, 0.2, 16),
    darkSteel
  );
  augerPivot.add(pivotBase);

  // Pivot bearing ring
  const bearingRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.27, 0.03, 8, 24),
    chrome
  );
  bearingRing.rotation.x = Math.PI / 2;
  bearingRing.position.y = 0.1;
  augerPivot.add(bearingRing);

  // Vertical riser section
  const riser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 1.2, 12),
    augerTubeMat
  );
  riser.position.set(0, 0.7, 0);
  augerPivot.add(riser);

  // Main auger tube (horizontal boom)
  const augerBoomGroup = new THREE.Group();
  augerBoomGroup.position.set(0, 1.3, 0);

  const augerTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 4.5, 16),
    augerTubeMat
  );
  augerTube.rotation.z = Math.PI / 2 + 0.25;
  augerTube.position.set(-1.8, 0.9, 0);
  augerBoomGroup.add(augerTube);

  // Auger flighting (spiral inside tube - visible at discharge end)
  const flightCount = 20;
  for (let f = 0; f < flightCount; f++) {
    const flightAngle = (f / flightCount) * Math.PI * 8;
    const flightT = f / flightCount;
    const flightX = -3.8 + flightT * 4.2;
    const flightY = 0.35 + flightT * 2.1;
    const flight = new THREE.Mesh(
      new THREE.RingGeometry(0.06, 0.11, 8),
      augerFlightMat
    );
    flight.position.set(flightX, flightY, Math.sin(flightAngle) * 0.02);
    flight.rotation.y = flightAngle;
    flight.rotation.z = 0.25;
    augerBoomGroup.add(flight);
  }

  // Discharge spout at auger end
  const spout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.1, 0.4, 12),
    darkSteel
  );
  spout.position.set(-3.8, 0.3, 0);
  spout.rotation.z = -0.2;
  augerBoomGroup.add(spout);

  // Spout deflector
  const deflector = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.02, 0.25),
    steel
  );
  deflector.position.set(-3.8, 0.08, 0);
  deflector.rotation.z = 0.3;
  augerBoomGroup.add(deflector);

  // Auger support braces (truss structure)
  for (let b = 0; b < 5; b++) {
    const t = b / 4;
    const bx = -3.5 + t * 3.8;
    const by = 0.5 + t * 1.6;
    // Diagonal brace
    const brace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6),
      frameMat
    );
    brace.position.set(bx, by - 0.2, 0.1);
    brace.rotation.z = 0.8;
    augerBoomGroup.add(brace);

    const brace2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6),
      frameMat
    );
    brace2.position.set(bx, by - 0.2, -0.1);
    brace2.rotation.z = -0.8;
    augerBoomGroup.add(brace2);
  }

  meshes.augerBoom = augerBoomGroup;
  augerPivot.add(augerBoomGroup);

  // Hydraulic cylinder for auger swing
  const augerHydCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
    hydraulicMat
  );
  augerHydCyl.position.set(0.3, 0.5, 0.3);
  augerHydCyl.rotation.z = 0.6;
  augerPivot.add(augerHydCyl);

  const augerHydRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8),
    hydraulicRodMat
  );
  augerHydRod.position.set(0.6, 0.9, 0.3);
  augerHydRod.rotation.z = 0.6;
  meshes.augerHydRod = augerHydRod;
  augerPivot.add(augerHydRod);

  meshes.augerPivot = augerPivot;
  group.add(augerPivot);

  // ═══════════════════════════════════════════════════════════════════
  //  TRACTOR HITCH / TONGUE
  // ═══════════════════════════════════════════════════════════════════
  const hitchGroup = new THREE.Group();

  // Main tongue beam (tapers forward)
  const tongueCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.6, -0.6, 0),
    new THREE.Vector3(3.5, -0.55, 0),
    new THREE.Vector3(4.5, -0.4, 0),
    new THREE.Vector3(5.2, -0.3, 0)
  ]);
  const tongueGeo = new THREE.TubeGeometry(tongueCurve, 20, 0.08, 8, false);
  const tongue = new THREE.Mesh(tongueGeo, frameMat);
  tongue.castShadow = true;
  hitchGroup.add(tongue);

  // Second tongue beam (V-hitch)
  const tongueCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.6, -0.6, 0.6),
    new THREE.Vector3(3.5, -0.55, 0.35),
    new THREE.Vector3(4.5, -0.4, 0.1),
    new THREE.Vector3(5.2, -0.3, 0)
  ]);
  const tongueGeo2 = new THREE.TubeGeometry(tongueCurve2, 20, 0.06, 8, false);
  hitchGroup.add(new THREE.Mesh(tongueGeo2, frameMat));

  const tongueCurve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.6, -0.6, -0.6),
    new THREE.Vector3(3.5, -0.55, -0.35),
    new THREE.Vector3(4.5, -0.4, -0.1),
    new THREE.Vector3(5.2, -0.3, 0)
  ]);
  const tongueGeo3 = new THREE.TubeGeometry(tongueCurve3, 20, 0.06, 8, false);
  hitchGroup.add(new THREE.Mesh(tongueGeo3, frameMat));

  // Clevis hitch ring
  const hitchRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.03, 8, 16),
    chrome
  );
  hitchRing.position.set(5.2, -0.3, 0);
  hitchRing.rotation.y = Math.PI / 2;
  hitchGroup.add(hitchRing);

  // Hitch pin
  const hitchPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8),
    chrome
  );
  hitchPin.position.set(5.2, -0.3, 0);
  hitchGroup.add(hitchPin);

  // Safety chains
  for (let side = -1; side <= 1; side += 2) {
    const chainLinks = 12;
    for (let c = 0; c < chainLinks; c++) {
      const link = new THREE.Mesh(
        new THREE.TorusGeometry(0.025, 0.006, 6, 8),
        chrome
      );
      const t = c / chainLinks;
      link.position.set(
        4.5 + t * 0.6,
        -0.5 + Math.sin(t * Math.PI) * 0.15,
        side * (0.15 + t * 0.02)
      );
      link.rotation.x = c % 2 === 0 ? 0 : Math.PI / 2;
      hitchGroup.add(link);
    }
  }

  // Hydraulic hose connectors at tongue
  for (let h = 0; h < 3; h++) {
    const hoseEnd = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8),
      hydraulicMat
    );
    hoseEnd.position.set(4.8, -0.2, -0.15 + h * 0.15);
    hoseEnd.rotation.z = Math.PI / 2;
    hitchGroup.add(hoseEnd);
  }

  // PTO/Power coupler
  const ptoCoupler = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12),
    steel
  );
  ptoCoupler.position.set(4.9, -0.15, 0.3);
  ptoCoupler.rotation.z = Math.PI / 2;
  hitchGroup.add(ptoCoupler);

  // Jack stand (retracted)
  const jackTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8),
    frameMat
  );
  jackTube.position.set(4.2, -0.9, 0);
  hitchGroup.add(jackTube);

  const jackFoot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.04, 8),
    rubber
  );
  jackFoot.position.set(4.2, -1.25, 0);
  hitchGroup.add(jackFoot);

  const jackCrank = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.04, 0.04),
    steel
  );
  jackCrank.position.set(4.2, -0.55, 0.06);
  hitchGroup.add(jackCrank);

  meshes.hitch = hitchGroup;
  group.add(hitchGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  FLOTATION TIRES WITH TREAD PATTERNS & RIMS
  // ═══════════════════════════════════════════════════════════════════

  function createFlotationTire(radius, tubeRadius) {
    const tireGroup = new THREE.Group();

    // Main tire body (torus)
    const tireBody = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tubeRadius, 24, 48),
      rubber
    );
    tireBody.castShadow = true;
    tireBody.receiveShadow = true;
    tireGroup.add(tireBody);

    // Deeply carved tread lugs - chevron pattern
    const lugCount = 36;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      // Center row lugs
      const lug = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.04, tubeRadius * 0.7),
        rubber
      );
      lug.position.set(
        Math.cos(angle) * (radius + tubeRadius * 0.98),
        Math.sin(angle) * (radius + tubeRadius * 0.98),
        0
      );
      lug.rotation.z = angle;
      lug.rotation.y = 0.35 * (i % 2 === 0 ? 1 : -1); // Chevron angle
      tireGroup.add(lug);

      // Shoulder lugs (offset)
      for (let shoulder = -1; shoulder <= 1; shoulder += 2) {
        const sLug = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.035, tubeRadius * 0.35),
          rubber
        );
        const sAngle = angle + (Math.PI / lugCount) * 0.5;
        sLug.position.set(
          Math.cos(sAngle) * (radius + tubeRadius * 0.92),
          Math.sin(sAngle) * (radius + tubeRadius * 0.92),
          shoulder * tubeRadius * 0.5
        );
        sLug.rotation.z = sAngle;
        sLug.rotation.y = 0.4 * shoulder;
        tireGroup.add(sLug);
      }
    }

    // Sidewall text ridges (simulated)
    const sidewallCount = 16;
    for (let sw = 0; sw < sidewallCount; sw++) {
      const swAngle = (sw / sidewallCount) * Math.PI * 2;
      for (let side = -1; side <= 1; side += 2) {
        const swRib = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.015, 0.02),
          rubber
        );
        swRib.position.set(
          Math.cos(swAngle) * (radius + tubeRadius * 0.3),
          Math.sin(swAngle) * (radius + tubeRadius * 0.3),
          side * (tubeRadius * 0.85)
        );
        swRib.rotation.z = swAngle;
        tireGroup.add(swRib);
      }
    }

    // Multi-piece rim
    const rimGroup = new THREE.Group();

    // Rim outer barrel
    const rimBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, tubeRadius * 1.4, 24, 1, true),
      aluminum
    );
    rimBarrel.rotation.x = Math.PI / 2;
    rimGroup.add(rimBarrel);

    // Rim center disc
    const rimDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, 0.04, 24),
      aluminum
    );
    rimDisc.rotation.x = Math.PI / 2;
    rimGroup.add(rimDisc);

    // Rim spokes
    const spokeCount = 8;
    for (let s = 0; s < spokeCount; s++) {
      const sAngle = (s / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 0.6, 0.06, 0.05),
        chrome
      );
      spoke.position.set(
        Math.cos(sAngle) * radius * 0.25,
        Math.sin(sAngle) * radius * 0.25,
        0
      );
      spoke.rotation.z = sAngle;
      rimGroup.add(spoke);
    }

    // Hub center cap
    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12),
      chrome
    );
    hubCap.rotation.x = Math.PI / 2;
    hubCap.position.z = 0.04;
    rimGroup.add(hubCap);

    // Lug nuts
    const lugNutCount = 8;
    for (let ln = 0; ln < lugNutCount; ln++) {
      const lnAngle = (ln / lugNutCount) * Math.PI * 2;
      const lugNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6),
        chrome
      );
      lugNut.position.set(
        Math.cos(lnAngle) * 0.12,
        Math.sin(lnAngle) * 0.12,
        0.04
      );
      lugNut.rotation.x = Math.PI / 2;
      rimGroup.add(lugNut);
    }

    // Valve stem
    const valve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6),
      rubber
    );
    valve.position.set(radius * 0.55, 0, tubeRadius * 0.5);
    valve.rotation.x = Math.PI / 4;
    tireGroup.add(valve);

    tireGroup.add(rimGroup);
    return tireGroup;
  }

  // Create and position tires (dual rear axle setup)
  const tirePositions = [
    // Front single tires
    { x: 1.5, z: 1.7, dual: false },
    { x: 1.5, z: -1.7, dual: false },
    // Rear dual tires
    { x: -1.5, z: 1.6, dual: true },
    { x: -1.5, z: -1.6, dual: true },
  ];

  const tireMeshes = [];
  tirePositions.forEach((tp, idx) => {
    const tire = createFlotationTire(0.55, 0.22);
    tire.rotation.y = Math.PI / 2;
    tire.position.set(tp.x, -0.55, tp.z);
    tire.castShadow = true;
    tireMeshes.push(tire);
    group.add(tire);

    if (tp.dual) {
      const dualTire = createFlotationTire(0.55, 0.22);
      dualTire.rotation.y = Math.PI / 2;
      dualTire.position.set(tp.x, -0.55, tp.z + (tp.z > 0 ? 0.55 : -0.55));
      dualTire.castShadow = true;
      tireMeshes.push(dualTire);
      group.add(dualTire);
    }
  });
  meshes.tires = tireMeshes;

  // Axle housings
  for (let ax = -1; ax <= 1; ax += 2) {
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 4.2, 12),
      darkSteel
    );
    axle.rotation.x = Math.PI / 2;
    axle.position.set(ax * 1.5, -0.55, 0);
    group.add(axle);

    // Axle spindle nuts
    for (let side = -1; side <= 1; side += 2) {
      const nut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.05, 6),
        chrome
      );
      nut.rotation.x = Math.PI / 2;
      nut.position.set(ax * 1.5, -0.55, side * 2.1);
      group.add(nut);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SCALE / WEIGH SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  const scaleGroup = new THREE.Group();

  // Load cells (4 positions under hopper)
  const loadCellPositions = [
    { x: -1.5, z: -0.7 }, { x: -1.5, z: 0.7 },
    { x: 1.5, z: -0.7 }, { x: 1.5, z: 0.7 }
  ];
  loadCellPositions.forEach(lcp => {
    // Load cell body
    const cellBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.12),
      loadCellMat
    );
    cellBody.position.set(lcp.x, -0.65, lcp.z);
    scaleGroup.add(cellBody);

    // Strain gauge indicator (glowing)
    const gauge = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.02, 0.06),
      neonGreenGlow
    );
    gauge.position.set(lcp.x, -0.59, lcp.z);
    scaleGroup.add(gauge);

    // Wiring from load cell
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(lcp.x, -0.63, lcp.z),
      new THREE.Vector3(lcp.x + 0.3, -0.7, lcp.z),
      new THREE.Vector3(2.0, -0.65, 1.0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 12, 0.008, 6, false);
    const wire = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({ color: 0x222288, roughness: 0.6 }));
    scaleGroup.add(wire);
  });

  // Digital display unit (mounted on side)
  const displayBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.25, 0.08),
    darkSteel
  );
  displayBox.position.set(2.2, 0.8, 1.75);
  scaleGroup.add(displayBox);

  // Display screen
  const displayScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.28, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x001100, emissive: 0x002200, emissiveIntensity: 0.3 })
  );
  displayScreen.position.set(2.2, 0.82, 1.795);
  scaleGroup.add(displayScreen);

  // LED weight readout digits
  const digitPositions = [-0.08, -0.03, 0.02, 0.07];
  digitPositions.forEach(dx => {
    const digit = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 0.08),
      scaleLEDMat
    );
    digit.position.set(2.2 + dx, 0.82, 1.8);
    scaleGroup.add(digit);
  });

  // Unit label
  const unitLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.06, 0.03),
    neonGreenGlow
  );
  unitLabel.position.set(2.27, 0.77, 1.8);
  scaleGroup.add(unitLabel);

  // Display mounting bracket
  const displayBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.3, 0.06),
    frameMat
  );
  displayBracket.position.set(2.2, 0.65, 1.72);
  scaleGroup.add(displayBracket);

  // Printer / ticket output (small box below display)
  const printer = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.12, 0.06),
    plastic
  );
  printer.position.set(2.2, 0.55, 1.75);
  scaleGroup.add(printer);

  // Printer paper slot
  const paperSlot = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.01, 0.02),
    decalWhite
  );
  paperSlot.position.set(2.2, 0.5, 1.78);
  scaleGroup.add(paperSlot);

  meshes.scaleSystem = scaleGroup;
  group.add(scaleGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  HYDRAULIC LINES & SYSTEMS
  // ═══════════════════════════════════════════════════════════════════
  const hydraulicGroup = new THREE.Group();

  // Main hydraulic lines running along frame
  const hoseRoutes = [
    [
      new THREE.Vector3(4.5, -0.4, 0.15),
      new THREE.Vector3(3.0, -0.5, 0.2),
      new THREE.Vector3(1.5, -0.55, 0.5),
      new THREE.Vector3(0.5, -0.5, 0.8),
      new THREE.Vector3(-0.5, -0.3, 1.0)
    ],
    [
      new THREE.Vector3(4.5, -0.4, -0.05),
      new THREE.Vector3(3.0, -0.5, -0.1),
      new THREE.Vector3(1.5, -0.55, -0.3),
      new THREE.Vector3(1.0, -0.3, -0.8),
      new THREE.Vector3(1.8, 0.2, -1.0)
    ],
    [
      new THREE.Vector3(4.5, -0.4, 0.05),
      new THREE.Vector3(3.0, -0.5, 0.05),
      new THREE.Vector3(1.0, -0.5, 0.0),
      new THREE.Vector3(-0.5, -0.55, 0.0)
    ]
  ];
  const hoseColors = [0x111111, 0x0a0a3a, 0x111111];
  hoseRoutes.forEach((route, idx) => {
    const curve = new THREE.CatmullRomCurve3(route);
    const hoseGeo = new THREE.TubeGeometry(curve, 24, 0.018, 8, false);
    const hoseMat = new THREE.MeshStandardMaterial({ color: hoseColors[idx], roughness: 0.7, metalness: 0.1 });
    const hose = new THREE.Mesh(hoseGeo, hoseMat);
    hydraulicGroup.add(hose);

    // Hose fittings at ends
    [0, route.length - 1].forEach(ri => {
      const fitting = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.02, 0.06, 8),
        chrome
      );
      fitting.position.copy(route[ri]);
      hydraulicGroup.add(fitting);
    });
  });

  // Gate hydraulic cylinder
  const gateCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.6, 8),
    hydraulicMat
  );
  gateCyl.position.set(-0.3, -0.3, 0.8);
  gateCyl.rotation.x = Math.PI / 4;
  hydraulicGroup.add(gateCyl);

  const gateRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8),
    hydraulicRodMat
  );
  gateRod.position.set(-0.5, -0.5, 1.0);
  gateRod.rotation.x = Math.PI / 4;
  meshes.gateRod = gateRod;
  hydraulicGroup.add(gateRod);

  group.add(hydraulicGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  LIGHTING & SAFETY EQUIPMENT
  // ═══════════════════════════════════════════════════════════════════

  // Rear tail lights
  for (let side = -1; side <= 1; side += 2) {
    const tailLightHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.05),
      frameMat
    );
    tailLightHousing.position.set(-2.35, 0.5, side * 1.7);
    group.add(tailLightHousing);

    const tailLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 0.1),
      redTailLight
    );
    tailLens.position.set(-2.36, 0.5, side * 1.7);
    tailLens.rotation.y = Math.PI;
    meshes[`tailLight${side}`] = tailLens;
    group.add(tailLens);

    // Turn signal (amber)
    const turnSignal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 0.05),
      orangeReflector
    );
    turnSignal.position.set(-2.36, 0.38, side * 1.7);
    turnSignal.rotation.y = Math.PI;
    group.add(turnSignal);
  }

  // SMV (Slow Moving Vehicle) triangle
  const smvShape = new THREE.Shape();
  smvShape.moveTo(0, 0.18);
  smvShape.lineTo(-0.15, -0.08);
  smvShape.lineTo(0.15, -0.08);
  smvShape.closePath();
  const smvGeo = new THREE.ShapeGeometry(smvShape);
  const smv = new THREE.Mesh(smvGeo, orangeReflector);
  smv.position.set(-2.36, 1.0, 0);
  smv.rotation.y = Math.PI;
  group.add(smv);

  // Reflective tape strips
  for (let side = -1; side <= 1; side += 2) {
    const tape = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.04, 0.01),
      orangeReflector
    );
    tape.position.set(0, 0.1, side * 1.82);
    group.add(tape);
  }

  // Fenders over tires
  tirePositions.forEach((tp) => {
    const fenderGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.55, 16, 1, true, -Math.PI / 2, Math.PI);
    const fender = new THREE.Mesh(fenderGeo, hopperMat);
    fender.rotation.z = Math.PI / 2;
    fender.rotation.y = Math.PI / 2;
    fender.position.set(tp.x, -0.15, tp.z);
    group.add(fender);
  });

  // ═══════════════════════════════════════════════════════════════════
  //  FUTURISTIC NEON ACCENTS & TECH DETAILS
  // ═══════════════════════════════════════════════════════════════════

  // Neon underglow strip
  const underglowCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, -1.0, 0),
    new THREE.Vector3(-1.0, -1.0, 0),
    new THREE.Vector3(0, -1.0, 0),
    new THREE.Vector3(1.0, -1.0, 0),
    new THREE.Vector3(2.2, -1.0, 0)
  ]);
  const underglowGeo = new THREE.TubeGeometry(underglowCurve, 30, 0.015, 6, false);
  const underglow = new THREE.Mesh(underglowGeo, neonBlueGlow);
  meshes.underglow = underglow;
  group.add(underglow);

  // Tech panel on hopper side
  const techPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0x111122,
      emissive: 0x0033ff,
      emissiveIntensity: 0.15,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    })
  );
  techPanel.position.set(0, 1.0, 1.82);
  group.add(techPanel);

  // Circuit-trace lines on tech panel
  for (let tl = 0; tl < 5; tl++) {
    const traceLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.005, 0.002),
      neonBlueGlow
    );
    traceLine.position.set(0, 0.85 + tl * 0.07, 1.825);
    group.add(traceLine);
  }

  // Sensor dome on hopper top (yield monitor)
  const sensorDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.6, transparent: true, opacity: 0.7 })
  );
  sensorDome.position.set(1.5, 2.25, 0);
  group.add(sensorDome);

  const sensorLED = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 8, 8),
    neonGreenGlow
  );
  sensorLED.position.set(1.5, 2.33, 0);
  meshes.sensorLED = sensorLED;
  group.add(sensorLED);

  // GPS antenna mast
  const gpsMast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
    aluminum
  );
  gpsMast.position.set(-1.8, 2.0, 0.5);
  group.add(gpsMast);

  const gpsDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.3, metalness: 0.5 })
  );
  gpsDisc.position.set(-1.8, 2.26, 0.5);
  group.add(gpsDisc);

  // Camera mount (rear view)
  const cameraMt = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.04, 0.04),
    darkSteel
  );
  cameraMt.position.set(-2.3, 1.7, 0);
  group.add(cameraMt);

  const cameraLens = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 8, 8),
    glass
  );
  cameraLens.position.set(-2.34, 1.7, 0);
  group.add(cameraLens);

  // ═══════════════════════════════════════════════════════════════════
  //  LADDER / ACCESS STEPS
  // ═══════════════════════════════════════════════════════════════════
  const ladderGroup = new THREE.Group();
  // Two rails
  for (let side = -1; side <= 1; side += 2) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 1.6, 0.03),
      steel
    );
    rail.position.set(2.3, 0.5, 1.55 + side * 0.15);
    ladderGroup.add(rail);
  }
  // Rungs
  for (let r = 0; r < 4; r++) {
    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8),
      steel
    );
    rung.rotation.x = Math.PI / 2;
    rung.position.set(2.3, -0.1 + r * 0.45, 1.55);
    ladderGroup.add(rung);
  }
  // Hand grab rail at top
  const grabRail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
    chrome
  );
  grabRail.position.set(2.2, 1.5, 1.55);
  grabRail.rotation.x = Math.PI / 2;
  ladderGroup.add(grabRail);
  group.add(ladderGroup);

  // ═══════════════════════════════════════════════════════════════════
  //  DECALS & BRANDING
  // ═══════════════════════════════════════════════════════════════════
  // Model number stripe
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.08, 0.005),
    decalWhite
  );
  stripe.position.set(0, 1.3, -1.82);
  group.add(stripe);

  const stripe2 = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.08, 0.005),
    decalWhite
  );
  stripe2.position.set(0, 1.3, 1.82);
  group.add(stripe2);

  // Capacity badge
  const badge = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0xccaa00, roughness: 0.3, metalness: 0.7 })
  );
  badge.position.set(-2.0, 1.2, 1.82);
  group.add(badge);

  // ═══════════════════════════════════════════════════════════════════
  //  PARTS MANIFEST
  // ═══════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Hopper Body',
      description: 'Large-volume tapered V-bottom grain hopper constructed from high-strength steel with reinforced ribs and stiffeners.',
      material: 'High-tensile steel plate',
      function: 'Stores harvested grain during field transfer operations; V-bottom ensures complete gravity discharge.',
      assemblyOrder: 1,
      connections: ['Main Frame', 'Load Cells', 'Discharge Gate', 'Tarp Cover System'],
      failureEffect: 'Structural compromise allows grain spillage, reduces payload capacity.',
      cascadeFailures: ['Load Cells', 'Discharge Gate'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 2.5, z: 0 }
    },
    {
      name: 'Unloading Auger Assembly',
      description: 'Hydraulically-actuated swing auger with 14-inch diameter tube, helical flighting, pivot turntable, and discharge spout.',
      material: 'Steel tube, hardened auger flights',
      function: 'Transfers grain from hopper to trucks or storage; swings 120° from transport to unload position via hydraulic cylinder.',
      assemblyOrder: 3,
      connections: ['Hopper Body', 'Hydraulic System', 'PTO Drive'],
      failureEffect: 'Inability to unload grain; auger seizure can damage flighting and gearbox.',
      cascadeFailures: ['Hydraulic System', 'Discharge Gate'],
      originalPosition: { x: 1.8, y: 0.6, z: -1.0 },
      explodedPosition: { x: 4.0, y: 3.0, z: -3.0 }
    },
    {
      name: 'Flotation Tire Set',
      description: 'Six large-diameter flotation tires with deep chevron tread pattern on multi-piece rims, dual-rear configuration.',
      material: 'Reinforced rubber compound, aluminum alloy rims',
      function: 'Minimizes soil compaction in wet field conditions while supporting 30+ ton gross weight.',
      assemblyOrder: 2,
      connections: ['Axle Assemblies', 'Main Frame'],
      failureEffect: 'Blowout causes load shift and potential rollover; excessive compaction damages cropland.',
      cascadeFailures: ['Axle Assemblies', 'Scale System'],
      originalPosition: { x: 0, y: -0.55, z: 1.7 },
      explodedPosition: { x: 0, y: -0.55, z: 4.5 }
    },
    {
      name: 'Scale / Weigh System',
      description: 'Integrated onboard weighing system with four strain-gauge load cells, digital display with LED readout, and ticket printer.',
      material: 'Precision load cells, electronic components',
      function: 'Provides real-time weight measurement for yield monitoring, load tracking, and settlement documentation.',
      assemblyOrder: 5,
      connections: ['Main Frame', 'Hopper Body', 'GPS Antenna'],
      failureEffect: 'Inaccurate weight data leads to improper load distribution and incorrect yield records.',
      cascadeFailures: ['GPS System'],
      originalPosition: { x: 2.2, y: 0.8, z: 1.75 },
      explodedPosition: { x: 4.5, y: 2.0, z: 3.5 }
    },
    {
      name: 'Tractor Hitch Tongue',
      description: 'Heavy-duty V-tongue with clevis hitch ring, safety chains, hydraulic quick-couplers, jack stand, and PTO coupler.',
      material: 'Structural steel, forged clevis',
      function: 'Connects grain cart to tractor; transmits steering input, hydraulic power, and PTO drive to auger.',
      assemblyOrder: 4,
      connections: ['Main Frame', 'Hydraulic Lines', 'Safety Chains'],
      failureEffect: 'Hitch separation causes runaway cart; PTO failure stops auger operation.',
      cascadeFailures: ['Safety Chains', 'Hydraulic System', 'Unloading Auger Assembly'],
      originalPosition: { x: 5.2, y: -0.3, z: 0 },
      explodedPosition: { x: 8.0, y: -0.3, z: 0 }
    },
    {
      name: 'Tarp Cover System',
      description: 'Roll-type tarp cover with aluminum bows, green UV-resistant fabric, and tie-down straps.',
      material: 'UV-stabilized polyester fabric, aluminum bows',
      function: 'Protects grain from rain, wind loss, and contamination during transport.',
      assemblyOrder: 6,
      connections: ['Hopper Body'],
      failureEffect: 'Grain exposure to moisture causes spoilage and weight gain; wind loss reduces yield.',
      cascadeFailures: ['Scale / Weigh System'],
      originalPosition: { x: 0, y: 2.05, z: 0 },
      explodedPosition: { x: 0, y: 4.5, z: 0 }
    },
    {
      name: 'Discharge Gate',
      description: 'Hydraulically-operated slide gate at the base of the V-bottom hopper controlling grain flow to the auger.',
      material: 'Hardened steel plate, hydraulic cylinder',
      function: 'Regulates grain flow rate into the auger sump; fully closes for transport.',
      assemblyOrder: 7,
      connections: ['Hopper Body', 'Unloading Auger Assembly', 'Hydraulic System'],
      failureEffect: 'Gate seizure prevents unloading; leaking gate causes grain loss during transport.',
      cascadeFailures: ['Unloading Auger Assembly'],
      originalPosition: { x: -0.5, y: -0.55, z: 0 },
      explodedPosition: { x: -0.5, y: -2.5, z: 0 }
    },
    {
      name: 'Hydraulic System',
      description: 'Complete hydraulic circuit including high-pressure hoses, quick-connect fittings, and cylinders for auger swing and gate control.',
      material: 'Braided rubber hoses, steel fittings, chrome-plated rods',
      function: 'Powers auger swing, gate operation, and optional tarp deployment from tractor hydraulics.',
      assemblyOrder: 8,
      connections: ['Tractor Hitch Tongue', 'Unloading Auger Assembly', 'Discharge Gate'],
      failureEffect: 'Hydraulic leak disables auger swing and gate; oil contamination of grain.',
      cascadeFailures: ['Unloading Auger Assembly', 'Discharge Gate', 'Tarp Cover System'],
      originalPosition: { x: 0, y: -0.5, z: 0.5 },
      explodedPosition: { x: 0, y: -3.0, z: 3.0 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  //  QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'Why do grain carts use large flotation tires instead of standard agricultural tires?',
      options: [
        'To increase road travel speed',
        'To minimize soil compaction under heavy loads',
        'To reduce manufacturing costs',
        'To improve fuel economy of the towing tractor'
      ],
      correct: 1,
      explanation: 'Flotation tires distribute the heavy load (often 30+ tons) over a larger contact area, dramatically reducing ground pressure and minimizing soil compaction that can damage crop root zones and reduce future yields.',
      difficulty: 'easy'
    },
    {
      question: 'What is the primary purpose of the onboard scale system in a modern grain cart?',
      options: [
        'To calculate fuel consumption of the tractor',
        'To prevent overloading and provide real-time yield data for precision agriculture',
        'To measure the speed of grain flow through the auger',
        'To balance the cart during turns'
      ],
      correct: 1,
      explanation: 'Onboard scales allow operators to monitor load weight in real time, prevent overloading (which causes excessive compaction and potential axle damage), and generate field-level yield maps for precision agriculture data management.',
      difficulty: 'medium'
    },
    {
      question: 'What would happen if the discharge gate hydraulic cylinder failed while unloading grain?',
      options: [
        'The tarp cover would deploy automatically',
        'The gate could jam closed (stopping unloading) or stuck open (uncontrolled grain flow)',
        'The tires would deflate as a safety measure',
        'The auger would reverse direction automatically'
      ],
      correct: 1,
      explanation: 'A hydraulic cylinder failure on the discharge gate is critical: if stuck closed, unloading stops entirely; if stuck open, grain flows uncontrollably into the auger sump, potentially overloading the auger drive and causing grain spillage.',
      difficulty: 'hard'
    },
    {
      question: 'Why does the grain cart hopper use a V-bottom (tapered) design rather than a flat bottom?',
      options: [
        'V-bottoms are cheaper to manufacture',
        'Flat bottoms provide better weight distribution',
        'V-bottoms allow complete gravity-assisted grain discharge with no residual grain left behind',
        'V-bottoms increase the total volume capacity'
      ],
      correct: 2,
      explanation: 'The V-bottom design uses gravity to funnel all grain toward the central discharge gate, ensuring complete cleanout. A flat bottom would leave grain in corners and along edges, requiring manual cleaning and risking cross-contamination between crop types.',
      difficulty: 'medium'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  //  DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════
  const description = `Modern Grain Cart / Auger Wagon — a high-capacity field logistics vehicle used during harvest to shuttle grain from combines to transport trucks. This 1,100-bushel model features a reinforced V-bottom hopper with vertical stiffener ribs, a hydraulically-operated swing auger with helical flighting for rapid 500+ BPM unloading, integrated onboard scale system with four precision load cells and digital LED display, large flotation tires in a dual-rear configuration for minimal soil compaction, heavy-duty V-tongue hitch with safety chains and hydraulic quick-couplers, roll tarp cover system, GPS antenna for yield mapping, and rear-view camera. The machine is equipped with neon diagnostic indicators, circuit-trace monitoring panels, and sensor domes for next-generation precision agriculture integration.`;

  // ═══════════════════════════════════════════════════════════════════
  //  ANIMATE
  // ═══════════════════════════════════════════════════════════════════
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // Auger swing oscillation (transport ↔ unload position)
    if (meshes.augerPivot) {
      meshes.augerPivot.rotation.y = Math.sin(t * 0.3) * 0.6;
    }

    // Auger boom slight lift animation
    if (meshes.augerBoom) {
      meshes.augerBoom.rotation.z = Math.sin(t * 0.5) * 0.05;
    }

    // Hydraulic rod extension (synchronized with auger swing)
    if (meshes.augerHydRod) {
      meshes.augerHydRod.scale.y = 1.0 + Math.sin(t * 0.3) * 0.2;
    }

    // Gate rod piston animation
    if (meshes.gateRod) {
      meshes.gateRod.scale.y = 1.0 + Math.sin(t * 0.6) * 0.15;
    }

    // Tire rotation (forward motion simulation)
    if (meshes.tires) {
      meshes.tires.forEach(tire => {
        tire.rotation.z += 0.008 * speed;
      });
    }

    // Grain mound gentle settling/shifting
    if (meshes.grainMound) {
      meshes.grainMound.scale.y = 0.5 + Math.sin(t * 0.8) * 0.03;
      meshes.grainMound.position.x = Math.sin(t * 0.4) * 0.05;
    }

    // Tarp flutter in wind
    if (meshes.tarp) {
      const tarpPos = meshes.tarp.geometry.attributes.position;
      for (let i = 0; i < tarpPos.count; i++) {
        const x = tarpPos.getX(i);
        const y = tarpPos.getY(i);
        const flutter = Math.sin(x * 3 + t * 2) * 0.02 + Math.cos(y * 2 + t * 1.5) * 0.015;
        const baseArch = 0.6 * Math.cos((y / 4.0) * Math.PI);
        tarpPos.setZ(i, baseArch + flutter);
      }
      meshes.tarp.geometry.attributes.position.needsUpdate = true;
      meshes.tarp.geometry.computeVertexNormals();
    }

    // Scale LED pulsing
    if (meshes.scaleSystem) {
      scaleLEDMat.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.4;
    }

    // Neon underglow pulsing
    if (meshes.underglow) {
      neonBlueGlow.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.25;
    }

    // Sensor LED blink
    if (meshes.sensorLED) {
      neonGreenGlow.emissiveIntensity = Math.sin(t * 6) > 0 ? 0.9 : 0.1;
    }

    // Tail lights pulse (brake simulation)
    if (meshes['tailLight1'] || meshes['tailLight-1']) {
      redTailLight.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.3;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
