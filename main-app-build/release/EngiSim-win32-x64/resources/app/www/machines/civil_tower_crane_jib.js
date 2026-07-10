// ═══════════════════════════════════════════════════════════════════════════════
// EngiSim 3D — Tower Crane Jib Assembly (Ultra High-Tech Model)
// Triangular lattice truss jib, trolley with wheels, wire rope sheaves,
// tie rods to tower top, operator cabin, counterweight, hoist block & hook.
// ═══════════════════════════════════════════════════════════════════════════════

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── Custom Materials ────────────────────────────────────────────────────────
  const craneYellow = new THREE.MeshStandardMaterial({
    color: 0xf2b700, metalness: 0.35, roughness: 0.45, name: 'CraneYellow'
  });
  const craneYellowBright = new THREE.MeshStandardMaterial({
    color: 0xffd940, metalness: 0.25, roughness: 0.5, name: 'CraneYellowBright'
  });
  const safetyRed = new THREE.MeshStandardMaterial({
    color: 0xcc2222, metalness: 0.3, roughness: 0.45, name: 'SafetyRed'
  });
  const wireRopeMat = new THREE.MeshStandardMaterial({
    color: 0x9999aa, metalness: 0.85, roughness: 0.35, name: 'WireRope'
  });
  const warningLight = new THREE.MeshStandardMaterial({
    color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 1.2,
    metalness: 0.0, roughness: 0.3, name: 'WarningLight'
  });
  const neonGlow = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 0.9,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.85, name: 'NeonGlow'
  });
  const positionIndicator = new THREE.MeshStandardMaterial({
    color: 0x22aaff, emissive: 0x1188dd, emissiveIntensity: 0.7,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.8, name: 'PositionIndicator'
  });
  const cabinGlass = new THREE.MeshStandardMaterial({
    color: 0x88bbee, metalness: 0.15, roughness: 0.05,
    transparent: true, opacity: 0.3, name: 'CabinGlass'
  });
  const concreteGrey = new THREE.MeshStandardMaterial({
    color: 0x888888, metalness: 0.05, roughness: 0.9, name: 'Concrete'
  });
  const greasedSteel = new THREE.MeshStandardMaterial({
    color: 0x556670, metalness: 0.75, roughness: 0.4, name: 'GreasedSteel'
  });

  // ─── Helper: Lattice Tube Between Two Points ───────────────────────────────
  function createTube(p1, p2, radius, mat) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(radius, radius, len, 8);
    const mesh = new THREE.Mesh(geo, mat);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    mesh.quaternion.copy(quat);
    return mesh;
  }

  // ─── Helper: Gusset Plate ──────────────────────────────────────────────────
  function createGussetPlate(pos, rotZ, size) {
    const shape = new THREE.Shape();
    const s = size || 0.35;
    shape.moveTo(-s, -s * 0.5);
    shape.lineTo(s, -s * 0.5);
    shape.lineTo(0, s);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
    const mesh = new THREE.Mesh(geo, darkSteel);
    mesh.position.copy(pos);
    mesh.rotation.z = rotZ || 0;
    return mesh;
  }

  // ─── Helper: Bolt/Rivet ────────────────────────────────────────────────────
  function createBolt(pos, mat) {
    const g = new THREE.Group();
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 6), mat || chrome);
    head.position.y = 0.02;
    g.add(head);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8), darkSteel);
    shaft.position.y = -0.03;
    g.add(shaft);
    g.position.copy(pos);
    return g;
  }

  // ─── Helper: Sheave (Pulley Wheel) ─────────────────────────────────────────
  function createSheave(radius, thickness, mat) {
    const g = new THREE.Group();
    // Outer rim
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(radius, thickness * 0.35, 16, 32),
      mat || greasedSteel
    );
    torus.rotation.x = Math.PI / 2;
    g.add(torus);
    // Hub
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, thickness * 0.8, 16),
      darkSteel
    );
    hub.rotation.x = Math.PI / 2;
    g.add(hub);
    // Spokes
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const spoke = createTube(
        new THREE.Vector3(Math.cos(a) * radius * 0.25, Math.sin(a) * radius * 0.25, 0),
        new THREE.Vector3(Math.cos(a) * radius * 0.8, Math.sin(a) * radius * 0.8, 0),
        thickness * 0.08, mat || greasedSteel
      );
      g.add(spoke);
    }
    return g;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 1: TOWER MAST TOP SECTION (partial, for context)
  // ═══════════════════════════════════════════════════════════════════════════
  const mastSection = new THREE.Group();
  mastSection.userData.partName = 'mastTopSection';
  group.add(mastSection);

  // Tower top cap lattice frame (short section visible at base)
  const mastH = 4.0;
  const mastW = 1.8;
  // Four corner chords
  const mastCorners = [
    new THREE.Vector3(-mastW / 2, 0, -mastW / 2),
    new THREE.Vector3(mastW / 2, 0, -mastW / 2),
    new THREE.Vector3(mastW / 2, 0, mastW / 2),
    new THREE.Vector3(-mastW / 2, 0, mastW / 2),
  ];
  mastCorners.forEach((c) => {
    const top = c.clone(); top.y = mastH;
    mastSection.add(createTube(c, top, 0.06, craneYellow));
  });
  // Horizontal bracings at bottom and top
  [0, mastH].forEach((y) => {
    for (let i = 0; i < 4; i++) {
      const a = mastCorners[i].clone(); a.y = y;
      const b = mastCorners[(i + 1) % 4].clone(); b.y = y;
      mastSection.add(createTube(a, b, 0.04, craneYellow));
    }
  });
  // Diagonal K-bracings on each face
  for (let i = 0; i < 4; i++) {
    const bl = mastCorners[i].clone();
    const br = mastCorners[(i + 1) % 4].clone();
    const tl = bl.clone(); tl.y = mastH;
    const tr = br.clone(); tr.y = mastH;
    const mid = mastH / 2;
    const ml = bl.clone(); ml.y = mid;
    const mr = br.clone(); mr.y = mid;
    mastSection.add(createTube(bl, mr, 0.03, craneYellow));
    mastSection.add(createTube(br, ml, 0.03, craneYellow));
    mastSection.add(createTube(ml, tr, 0.03, craneYellow));
    mastSection.add(createTube(mr, tl, 0.03, craneYellow));
  }

  // Slewing bearing ring
  const bearingRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.12, 16, 48),
    chrome
  );
  bearingRing.rotation.x = Math.PI / 2;
  bearingRing.position.y = mastH;
  mastSection.add(bearingRing);

  // Bearing bolts
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    mastSection.add(createBolt(
      new THREE.Vector3(Math.cos(a) * 1.1, mastH + 0.08, Math.sin(a) * 1.1)
    ));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 2: SLEWING PLATFORM & OPERATOR CABIN
  // ═══════════════════════════════════════════════════════════════════════════
  const slewingGroup = new THREE.Group();
  slewingGroup.position.y = mastH + 0.15;
  slewingGroup.userData.partName = 'slewingPlatform';
  group.add(slewingGroup);

  // Platform base plate
  const platformGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.12, 32);
  const platform = new THREE.Mesh(platformGeo, darkSteel);
  slewingGroup.add(platform);

  // Platform edge rail
  const railRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.03, 8, 48), craneYellow
  );
  railRing.rotation.x = Math.PI / 2;
  railRing.position.y = 0.35;
  slewingGroup.add(railRing);
  // Rail posts
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const post = createTube(
      new THREE.Vector3(Math.cos(a) * 1.3, 0.06, Math.sin(a) * 1.3),
      new THREE.Vector3(Math.cos(a) * 1.3, 0.35, Math.sin(a) * 1.3),
      0.02, craneYellow
    );
    slewingGroup.add(post);
  }

  // ─── Operator Cabin ─────────────────────────────────────────────────────
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(1.4, 0.15, 0);
  cabinGroup.userData.partName = 'operatorCabin';
  slewingGroup.add(cabinGroup);

  // Cabin body (rounded using lathe-ish box)
  const cabinBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.5, 1.5, 1, 1, 1),
    craneYellow
  );
  cabinBody.position.y = 0.75;
  cabinGroup.add(cabinBody);

  // Cabin roof
  const cabinRoof = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 1.6),
    darkSteel
  );
  cabinRoof.position.y = 1.53;
  cabinGroup.add(cabinRoof);

  // Cabin windows (all sides)
  const winH = 0.7, winW = 0.6;
  // Front window
  const frontWin = new THREE.Mesh(
    new THREE.PlaneGeometry(winW, winH), cabinGlass
  );
  frontWin.position.set(0.66, 0.95, 0);
  frontWin.rotation.y = Math.PI / 2;
  cabinGroup.add(frontWin);
  // Side windows
  [-0.5, 0.5].forEach(z => {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(1.0, winH), cabinGlass);
    sw.position.set(0, 0.95, z * 1.52);
    sw.rotation.y = z > 0 ? 0 : Math.PI;
    cabinGroup.add(sw);
  });
  // Bottom viewing window
  const bottomWin = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1.0), cabinGlass
  );
  bottomWin.position.set(0.3, 0.16, 0);
  bottomWin.rotation.x = Math.PI / 2;
  cabinGroup.add(bottomWin);

  // Warning light on roof
  const warnLightMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16), warningLight
  );
  warnLightMesh.position.set(0, 1.65, 0);
  warnLightMesh.userData.partName = 'warningLight';
  cabinGroup.add(warnLightMesh);

  // Access ladder
  for (let r = 0; r < 6; r++) {
    const ry = 0.2 + r * 0.25;
    const rung = createTube(
      new THREE.Vector3(-0.66, ry, -0.35),
      new THREE.Vector3(-0.66, ry, 0.35),
      0.02, darkSteel
    );
    cabinGroup.add(rung);
  }
  // Ladder rails
  [-0.35, 0.35].forEach(z => {
    cabinGroup.add(createTube(
      new THREE.Vector3(-0.66, 0.1, z),
      new THREE.Vector3(-0.66, 1.5, z),
      0.02, darkSteel
    ));
  });

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 3: TRIANGULAR LATTICE JIB (Main Boom)
  // ═══════════════════════════════════════════════════════════════════════════
  const jibGroup = new THREE.Group();
  jibGroup.position.set(0, 0.2, 0);
  jibGroup.userData.partName = 'mainJib';
  slewingGroup.add(jibGroup);

  const jibLength = 28;
  const jibSections = 14;
  const sectionLen = jibLength / jibSections;
  const jibBaseH = 1.6;   // Height at root of triangular cross section
  const jibTipH = 0.6;    // Height at tip
  const jibBaseW = 1.2;   // Width at root
  const jibTipW = 0.5;    // Width at tip

  // Build triangular lattice truss
  for (let s = 0; s <= jibSections; s++) {
    const t = s / jibSections;
    const x = 2.0 + s * sectionLen; // start offset from slewing center
    const h = THREE.MathUtils.lerp(jibBaseH, jibTipH, t);
    const w = THREE.MathUtils.lerp(jibBaseW, jibTipW, t);

    // Cross section: triangle - top apex, bottom-left, bottom-right
    const topPt   = new THREE.Vector3(x, h, 0);
    const botL    = new THREE.Vector3(x, 0, -w / 2);
    const botR    = new THREE.Vector3(x, 0, w / 2);

    // Horizontal and vertical ring members at each section boundary
    if (s <= jibSections) {
      // Bottom chord connector
      jibGroup.add(createTube(botL, botR, 0.035, craneYellow));
      // Left diagonal to top
      jibGroup.add(createTube(botL, topPt, 0.03, craneYellow));
      // Right diagonal to top
      jibGroup.add(createTube(botR, topPt, 0.03, craneYellow));
    }

    // Longitudinal chords between sections
    if (s < jibSections) {
      const t2 = (s + 1) / jibSections;
      const x2 = 2.0 + (s + 1) * sectionLen;
      const h2 = THREE.MathUtils.lerp(jibBaseH, jibTipH, t2);
      const w2 = THREE.MathUtils.lerp(jibBaseW, jibTipW, t2);

      const nextTop = new THREE.Vector3(x2, h2, 0);
      const nextBotL = new THREE.Vector3(x2, 0, -w2 / 2);
      const nextBotR = new THREE.Vector3(x2, 0, w2 / 2);

      // Three main chords
      jibGroup.add(createTube(topPt, nextTop, 0.05, craneYellow));
      jibGroup.add(createTube(botL, nextBotL, 0.05, craneYellow));
      jibGroup.add(createTube(botR, nextBotR, 0.05, craneYellow));

      // Diagonal lacings (Warren truss pattern) on bottom face
      if (s % 2 === 0) {
        jibGroup.add(createTube(botL, nextBotR, 0.025, craneYellowBright));
      } else {
        jibGroup.add(createTube(botR, nextBotL, 0.025, craneYellowBright));
      }

      // Diagonal lacings on side faces (K-bracing)
      const midX = (x + x2) / 2;
      const midH = (h + h2) / 2;
      const midW = (w + w2) / 2;
      const midTop = new THREE.Vector3(midX, midH, 0);
      const midBotL = new THREE.Vector3(midX, 0, -midW / 2);
      const midBotR = new THREE.Vector3(midX, 0, midW / 2);

      // Left face K-bracing
      jibGroup.add(createTube(botL, midTop, 0.02, craneYellowBright));
      jibGroup.add(createTube(topPt, midBotL, 0.02, craneYellowBright));
      // Right face K-bracing
      jibGroup.add(createTube(botR, midTop, 0.02, craneYellowBright));
      jibGroup.add(createTube(topPt, midBotR, 0.02, craneYellowBright));

      // Gusset plates at section joints
      if (s % 3 === 0 && s > 0) {
        jibGroup.add(createGussetPlate(
          new THREE.Vector3(x, 0.02, 0), 0, 0.2
        ));
      }
    }

    // Bolts at each node
    if (s % 2 === 0) {
      jibGroup.add(createBolt(topPt.clone()));
      jibGroup.add(createBolt(botL.clone()));
      jibGroup.add(createBolt(botR.clone()));
    }
  }

  // Jib tip nose cone / safety cap
  const jibTipX = 2.0 + jibLength;
  const tipCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.5, 8), safetyRed
  );
  tipCone.position.set(jibTipX + 0.25, jibTipH * 0.5, 0);
  tipCone.rotation.z = -Math.PI / 2;
  jibGroup.add(tipCone);

  // Jib tip position indicator light
  const tipLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12), positionIndicator
  );
  tipLight.position.set(jibTipX, jibTipH + 0.15, 0);
  tipLight.userData.partName = 'tipLight';
  jibGroup.add(tipLight);

  // ─── Trolley Rail (bottom chords serve as rail) ────────────────────────
  // Additional rail bars on bottom for trolley wheels
  const railRadius = 0.035;
  [-0.25, 0.25].forEach(z => {
    const railBar = createTube(
      new THREE.Vector3(2.0, -0.04, z),
      new THREE.Vector3(jibTipX - 0.5, -0.04, z),
      railRadius, darkSteel
    );
    jibGroup.add(railBar);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 4: TROLLEY ASSEMBLY
  // ═══════════════════════════════════════════════════════════════════════════
  const trolleyGroup = new THREE.Group();
  trolleyGroup.position.set(12, 0, 0); // start position along jib
  trolleyGroup.userData.partName = 'trolleyAssembly';
  jibGroup.add(trolleyGroup);

  // Trolley frame
  const trolleyFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.15, 0.9),
    steel
  );
  trolleyFrame.position.y = -0.12;
  trolleyGroup.add(trolleyFrame);

  // Trolley side plates
  [-0.45, 0.45].forEach(z => {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.5, 0.04), steel
    );
    plate.position.set(0, -0.2, z);
    trolleyGroup.add(plate);

    // Reinforcement ribs
    for (let i = -1; i <= 1; i++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.4, 0.03), darkSteel
      );
      rib.position.set(i * 0.25, -0.25, z * 1.02);
      trolleyGroup.add(rib);
    }
  });

  // Trolley wheels (4 wheels riding on rails)
  const wheelPositions = [
    { x: -0.3, z: -0.25 }, { x: 0.3, z: -0.25 },
    { x: -0.3, z: 0.25 },  { x: 0.3, z: 0.25 }
  ];
  const trolleyWheels = [];
  wheelPositions.forEach(wp => {
    const wheelG = new THREE.Group();
    // Wheel body
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24), greasedSteel
    );
    wheel.rotation.x = Math.PI / 2;
    wheelG.add(wheel);
    // Wheel flange
    const flange = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.015, 8, 24), darkSteel
    );
    wheelG.add(flange);
    // Axle
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8), chrome
    );
    axle.rotation.x = Math.PI / 2;
    wheelG.add(axle);
    wheelG.position.set(wp.x, -0.05, wp.z);
    trolleyGroup.add(wheelG);
    trolleyWheels.push(wheel);
  });

  // Trolley sheaves (2 sheaves for main hoist)
  const trolleySheaves = [];
  [-0.15, 0.15].forEach(z => {
    const sheave = createSheave(0.12, 0.08, greasedSteel);
    sheave.position.set(0, -0.45, z);
    sheave.rotation.y = Math.PI / 2;
    trolleyGroup.add(sheave);
    trolleySheaves.push(sheave);
  });

  // Sheave guard plates
  [-0.28, 0.28].forEach(z => {
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 0.02), craneYellow
    );
    guard.position.set(0, -0.42, z);
    trolleyGroup.add(guard);
  });

  // Trolley motor (winch drive)
  const trolleyMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16), darkSteel
  );
  trolleyMotor.rotation.z = Math.PI / 2;
  trolleyMotor.position.set(-0.5, -0.15, 0);
  trolleyGroup.add(trolleyMotor);
  // Motor cooling fins
  for (let f = 0; f < 8; f++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.18, 0.01), aluminum
    );
    const a = (f / 8) * Math.PI * 2;
    fin.position.set(-0.5 + Math.cos(a) * 0.1, -0.15 + Math.sin(a) * 0.1, 0);
    fin.rotation.z = a;
    trolleyGroup.add(fin);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 5: WIRE ROPE & HOIST BLOCK
  // ═══════════════════════════════════════════════════════════════════════════
  const hoistGroup = new THREE.Group();
  hoistGroup.position.set(0, -0.5, 0);
  hoistGroup.userData.partName = 'hoistBlock';
  trolleyGroup.add(hoistGroup);

  // Wire ropes (4 falls)
  const ropeLength = 6.0;
  const ropeMeshes = [];
  [-0.12, -0.04, 0.04, 0.12].forEach(z => {
    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, ropeLength, 8), wireRopeMat
    );
    rope.position.set(0, -ropeLength / 2, z);
    hoistGroup.add(rope);
    ropeMeshes.push(rope);

    // Rope twist detail (helical wrap)
    for (let tw = 0; tw < 20; tw++) {
      const ty = -tw * (ropeLength / 20);
      const ta = tw * 0.8;
      const twistWire = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 4, 4), wireRopeMat
      );
      twistWire.position.set(Math.cos(ta) * 0.015, ty, z + Math.sin(ta) * 0.015);
      hoistGroup.add(twistWire);
    }
  });

  // Hook block body
  const hookBlock = new THREE.Group();
  hookBlock.position.y = -ropeLength;
  hookBlock.userData.partName = 'hookBlock';
  hoistGroup.add(hookBlock);

  // Block body
  const blockBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.5, 0.35), steel
  );
  hookBlock.add(blockBody);

  // Block sheaves (2 sheaves in the block)
  [-0.1, 0.1].forEach(z => {
    const bs = createSheave(0.1, 0.06, chrome);
    bs.position.set(0, 0.05, z);
    bs.rotation.y = Math.PI / 2;
    hookBlock.add(bs);
  });

  // Safety latch
  const latch = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.015, 8, 16, Math.PI * 1.5),
    safetyRed
  );
  latch.position.y = -0.35;
  latch.rotation.x = Math.PI / 2;
  hookBlock.add(latch);

  // Hook (curved J-shape via tube geometry)
  const hookCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.25, 0),
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(0.08, -0.65, 0),
    new THREE.Vector3(0.2, -0.7, 0),
    new THREE.Vector3(0.28, -0.6, 0),
    new THREE.Vector3(0.22, -0.45, 0),
    new THREE.Vector3(0.12, -0.35, 0),
  ]);
  const hookTubeGeo = new THREE.TubeGeometry(hookCurve, 32, 0.035, 12, false);
  const hookMesh = new THREE.Mesh(hookTubeGeo, chrome);
  hookBlock.add(hookMesh);

  // Hook tip safety color
  const hookTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 12, 12), safetyRed
  );
  hookTip.position.set(0.12, -0.35, 0);
  hookBlock.add(hookTip);

  // Swivel joint at top of hook block
  const swivel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16), chrome
  );
  swivel.position.y = 0.32;
  hookBlock.add(swivel);

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 6: COUNTER JIB & COUNTERWEIGHT
  // ═══════════════════════════════════════════════════════════════════════════
  const counterJibGroup = new THREE.Group();
  counterJibGroup.userData.partName = 'counterJib';
  slewingGroup.add(counterJibGroup);

  const cjibLen = 10;
  const cjibSections = 5;
  const cjibSecLen = cjibLen / cjibSections;
  const cjibH = 1.2;
  const cjibW = 1.0;

  for (let s = 0; s <= cjibSections; s++) {
    const x = -(1.5 + s * cjibSecLen);
    const topPt = new THREE.Vector3(x, cjibH, 0);
    const botL = new THREE.Vector3(x, 0, -cjibW / 2);
    const botR = new THREE.Vector3(x, 0, cjibW / 2);

    counterJibGroup.add(createTube(botL, botR, 0.035, craneYellow));
    counterJibGroup.add(createTube(botL, topPt, 0.03, craneYellow));
    counterJibGroup.add(createTube(botR, topPt, 0.03, craneYellow));

    if (s < cjibSections) {
      const x2 = -(1.5 + (s + 1) * cjibSecLen);
      const nextTop = new THREE.Vector3(x2, cjibH, 0);
      const nextBotL = new THREE.Vector3(x2, 0, -cjibW / 2);
      const nextBotR = new THREE.Vector3(x2, 0, cjibW / 2);

      counterJibGroup.add(createTube(topPt, nextTop, 0.045, craneYellow));
      counterJibGroup.add(createTube(botL, nextBotL, 0.045, craneYellow));
      counterJibGroup.add(createTube(botR, nextBotR, 0.045, craneYellow));

      // X-bracing on sides
      counterJibGroup.add(createTube(botL, nextTop, 0.02, craneYellowBright));
      counterJibGroup.add(createTube(topPt, nextBotL, 0.02, craneYellowBright));
      counterJibGroup.add(createTube(botR, nextTop, 0.02, craneYellowBright));
      counterJibGroup.add(createTube(topPt, nextBotR, 0.02, craneYellowBright));
    }
  }

  // Counterweights (stacked concrete blocks)
  for (let cw = 0; cw < 4; cw++) {
    const cwBlock = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.7, 1.2), concreteGrey
    );
    cwBlock.position.set(-(cjibLen + 1.5 - cw * 0.1), 0.35 + cw * 0.7, 0);
    counterJibGroup.add(cwBlock);

    // Weight labels (painted markings)
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.3), safetyRed
    );
    label.position.set(-(cjibLen + 1.5 - cw * 0.1), 0.35 + cw * 0.7, 0.61);
    counterJibGroup.add(label);
  }

  // Hoist machinery on counter jib
  const hoistMachineGroup = new THREE.Group();
  hoistMachineGroup.position.set(-3.0, 0.2, 0);
  hoistMachineGroup.userData.partName = 'hoistMachinery';
  counterJibGroup.add(hoistMachineGroup);

  // Hoist drum
  const hoistDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.8, 24), darkSteel
  );
  hoistDrum.rotation.z = Math.PI / 2;
  hoistDrum.position.y = 0.35;
  hoistDrum.userData.partName = 'hoistDrum';
  hoistMachineGroup.add(hoistDrum);

  // Drum flanges
  [-0.4, 0.4].forEach(xOff => {
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.03, 24), steel
    );
    flange.rotation.z = Math.PI / 2;
    flange.position.set(xOff, 0.35, 0);
    hoistMachineGroup.add(flange);
  });

  // Wire rope wound on drum (helical grooves)
  for (let wr = 0; wr < 30; wr++) {
    const wa = wr * 0.6;
    const wx = -0.35 + (wr / 30) * 0.7;
    const winding = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.012, 6, 12, 0.5), wireRopeMat
    );
    winding.position.set(wx, 0.35, 0);
    winding.rotation.set(0, wa, Math.PI / 2);
    hoistMachineGroup.add(winding);
  }

  // Hoist motor
  const hoistMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16), darkSteel
  );
  hoistMotor.rotation.z = Math.PI / 2;
  hoistMotor.position.set(0.7, 0.35, 0);
  hoistMachineGroup.add(hoistMotor);

  // Motor junction box
  const junctionBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.1), plastic
  );
  junctionBox.position.set(0.7, 0.6, 0.15);
  hoistMachineGroup.add(junctionBox);

  // Motor cable conduit
  const conduitCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.7, 0.6, 0.2),
    new THREE.Vector3(0.4, 0.9, 0.3),
    new THREE.Vector3(-0.2, 1.0, 0.3),
  ]);
  const conduit = new THREE.Mesh(
    new THREE.TubeGeometry(conduitCurve, 16, 0.02, 8, false), plastic
  );
  hoistMachineGroup.add(conduit);

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 7: TIE RODS / PENDANT LINES TO TOWER TOP (CAT HEAD)
  // ═══════════════════════════════════════════════════════════════════════════
  const catHead = new THREE.Group();
  catHead.userData.partName = 'catHead';
  slewingGroup.add(catHead);

  // Cat head mast (tower top above slewing)
  const catMastH = 6.0;
  const catMastW = 0.8;
  const catCorners = [
    new THREE.Vector3(-catMastW / 2, 0.2, -catMastW / 2),
    new THREE.Vector3(catMastW / 2, 0.2, -catMastW / 2),
    new THREE.Vector3(catMastW / 2, 0.2, catMastW / 2),
    new THREE.Vector3(-catMastW / 2, 0.2, catMastW / 2),
  ];
  const catCornersTop = catCorners.map(c => {
    const ct = c.clone(); ct.y = catMastH; return ct;
  });
  catCorners.forEach((c, i) => {
    catHead.add(createTube(c, catCornersTop[i], 0.04, craneYellow));
  });
  // Horizontal bracings
  [0.2, catMastH / 2, catMastH].forEach(y => {
    for (let i = 0; i < 4; i++) {
      const a = catCorners[i].clone(); a.y = y;
      const b = catCorners[(i + 1) % 4].clone(); b.y = y;
      catHead.add(createTube(a, b, 0.03, craneYellow));
    }
  });
  // Diagonal bracings
  for (let i = 0; i < 4; i++) {
    const bl = catCorners[i].clone();
    const tr = catCornersTop[(i + 1) % 4].clone();
    catHead.add(createTube(bl, tr, 0.025, craneYellowBright));
    const br = catCorners[(i + 1) % 4].clone();
    const tl = catCornersTop[i].clone();
    catHead.add(createTube(br, tl, 0.025, craneYellowBright));
  }

  // Cat head cross arm
  const crossArmLen = 4.0;
  const crossArmY = catMastH;
  [-crossArmLen, crossArmLen].forEach(xDir => {
    catHead.add(createTube(
      new THREE.Vector3(0, crossArmY, 0),
      new THREE.Vector3(xDir, crossArmY, 0),
      0.04, craneYellow
    ));
  });

  // ─── Tie Rods / Pendant Lines ──────────────────────────────────────────
  // Front tie rods (to jib tip)
  const frontTieAngles = [-0.15, 0.15]; // z-offsets
  frontTieAngles.forEach(z => {
    const tierod = createTube(
      new THREE.Vector3(crossArmLen * 0.9, crossArmY, z),
      new THREE.Vector3(jibTipX * 0.7, jibTipH * 0.5 + 0.2, z),
      0.04, steel
    );
    tierod.userData.partName = 'frontTieRod';
    catHead.add(tierod);
  });

  // Intermediate tie rods (to mid-jib)
  frontTieAngles.forEach(z => {
    const midTie = createTube(
      new THREE.Vector3(crossArmLen * 0.6, crossArmY, z),
      new THREE.Vector3(jibLength * 0.35 + 2.0, jibBaseH * 0.6, z),
      0.035, steel
    );
    catHead.add(midTie);
  });

  // Rear tie rods (to counter jib)
  frontTieAngles.forEach(z => {
    const rearTie = createTube(
      new THREE.Vector3(-crossArmLen * 0.8, crossArmY, z),
      new THREE.Vector3(-cjibLen * 0.6, cjibH * 0.7, z),
      0.04, steel
    );
    rearTie.userData.partName = 'rearTieRod';
    catHead.add(rearTie);
  });

  // Tie rod connection pins
  const pinPositions = [
    new THREE.Vector3(crossArmLen * 0.9, crossArmY, 0),
    new THREE.Vector3(-crossArmLen * 0.8, crossArmY, 0),
    new THREE.Vector3(crossArmLen * 0.6, crossArmY, 0),
  ];
  pinPositions.forEach(pp => {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), chrome
    );
    pin.position.copy(pp);
    pin.rotation.x = Math.PI / 2;
    catHead.add(pin);
  });

  // Top sheave for hoist rope at cat head
  const topSheave = createSheave(0.2, 0.1, chrome);
  topSheave.position.set(1.5, crossArmY + 0.15, 0);
  topSheave.userData.partName = 'topSheave';
  catHead.add(topSheave);

  // Hoist rope from top sheave down to trolley (catenary-ish path)
  const hoistRopeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.0, 0.55, 0),   // hoist drum
    new THREE.Vector3(-1.5, 2.0, 0),
    new THREE.Vector3(0, crossArmY - 0.5, 0),
    new THREE.Vector3(1.5, crossArmY + 0.15, 0),  // top sheave
    new THREE.Vector3(5.0, crossArmY - 1.0, 0),
    new THREE.Vector3(10.0, 1.5, 0),   // towards trolley (approx)
  ]);
  const hoistRopeMesh = new THREE.Mesh(
    new THREE.TubeGeometry(hoistRopeCurve, 64, 0.015, 6, false), wireRopeMat
  );
  slewingGroup.add(hoistRopeMesh);

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 8: JIB-TIP SHEAVE ASSEMBLY
  // ═══════════════════════════════════════════════════════════════════════════
  const tipSheaveGroup = new THREE.Group();
  tipSheaveGroup.position.set(jibTipX - 0.3, jibTipH * 0.3, 0);
  tipSheaveGroup.userData.partName = 'jibTipSheaves';
  jibGroup.add(tipSheaveGroup);

  // Twin sheaves at jib tip
  [-0.12, 0.12].forEach(z => {
    const ts = createSheave(0.15, 0.08, chrome);
    ts.position.set(0, 0, z);
    ts.rotation.y = Math.PI / 2;
    tipSheaveGroup.add(ts);
  });

  // Sheave mounting bracket
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 0.4), steel
  );
  bracket.position.set(-0.1, 0, 0);
  tipSheaveGroup.add(bracket);

  // Guard cage around sheaves
  for (let g = 0; g < 8; g++) {
    const ga = (g / 8) * Math.PI * 2;
    const guardBar = createTube(
      new THREE.Vector3(Math.cos(ga) * 0.2, Math.sin(ga) * 0.2, -0.18),
      new THREE.Vector3(Math.cos(ga) * 0.2, Math.sin(ga) * 0.2, 0.18),
      0.008, craneYellow
    );
    tipSheaveGroup.add(guardBar);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION 9: NEON DIAGNOSTIC STRIPS & HI-TECH DETAILS
  // ═══════════════════════════════════════════════════════════════════════════

  // Neon LED strip along jib top chord (futuristic monitoring system)
  const neonStripGeo = new THREE.BoxGeometry(jibLength - 1, 0.02, 0.02);
  const neonStrip = new THREE.Mesh(neonStripGeo, neonGlow);
  neonStrip.position.set(2.0 + jibLength / 2, jibBaseH * 0.8, 0);
  neonStrip.userData.partName = 'neonDiagStrip';
  jibGroup.add(neonStrip);

  // Periodic sensor nodes along jib
  for (let sn = 0; sn < 7; sn++) {
    const sx = 4.0 + sn * 3.5;
    const sensorNode = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.06, 0), positionIndicator
    );
    sensorNode.position.set(sx, jibBaseH * 0.82 + 0.05, 0);
    jibGroup.add(sensorNode);
  }

  // Anti-collision beacon at cat head top
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16), warningLight
  );
  beacon.position.set(0, catMastH + 0.3, 0);
  beacon.userData.partName = 'antiCollisionBeacon';
  catHead.add(beacon);

  // Anemometer at cat head
  const anemometerGroup = new THREE.Group();
  anemometerGroup.position.set(0.4, catMastH + 0.5, 0);
  anemometerGroup.userData.partName = 'anemometer';
  catHead.add(anemometerGroup);
  const anemMast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), aluminum
  );
  anemometerGroup.add(anemMast);
  for (let ac = 0; ac < 3; ac++) {
    const aa = (ac / 3) * Math.PI * 2;
    const cup = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8, 0, Math.PI), aluminum
    );
    cup.position.set(Math.cos(aa) * 0.12, 0.2, Math.sin(aa) * 0.12);
    cup.rotation.y = aa + Math.PI / 2;
    anemometerGroup.add(cup);
    const arm = createTube(
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(Math.cos(aa) * 0.12, 0.2, Math.sin(aa) * 0.12),
      0.008, aluminum
    );
    anemometerGroup.add(arm);
  }

  // Hydraulic cable festoon along jib for trolley power
  const festoonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3.0, -0.1, 0.5),
    new THREE.Vector3(6.0, -0.3, 0.5),
    new THREE.Vector3(9.0, -0.15, 0.5),
    new THREE.Vector3(12.0, -0.1, 0.5),
  ]);
  const festoon = new THREE.Mesh(
    new THREE.TubeGeometry(festoonCurve, 32, 0.025, 8, false), rubber
  );
  jibGroup.add(festoon);

  // Festoon hangers
  for (let fh = 0; fh < 5; fh++) {
    const fx = 3.0 + fh * 2.25;
    const hanger = createTube(
      new THREE.Vector3(fx, 0, 0.5),
      new THREE.Vector3(fx, -0.2, 0.5),
      0.01, darkSteel
    );
    jibGroup.add(hanger);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PARTS MANIFEST
  // ═══════════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Triangular Lattice Jib',
      description: 'Main horizontal boom constructed as a triangular cross-section Warren truss with K-bracing. Tapers from root to tip for optimal weight-to-strength ratio.',
      material: 'High-strength structural steel (S355)',
      function: 'Carries the trolley and suspended load across the working radius. Transfers bending moments through lattice geometry to the slewing unit.',
      assemblyOrder: 3,
      connections: ['Slewing Platform', 'Front Tie Rods', 'Trolley Assembly', 'Jib Tip Sheaves'],
      failureEffect: 'Catastrophic structural collapse of the boom, potential crane toppling.',
      cascadeFailures: ['Trolley Assembly', 'Wire Rope System', 'Hook Block'],
      originalPosition: { x: 0, y: 0.2, z: 0 },
      explodedPosition: { x: 6, y: 2, z: 0 }
    },
    {
      name: 'Trolley Assembly',
      description: 'Four-wheeled carriage riding on twin rail tracks along the jib bottom chords. Features flanged wheels, sheaves, motor drive, and side reinforcement plates.',
      material: 'Machined steel wheels on hardened rail, cast steel frame',
      function: 'Translates horizontally along the jib to vary the working radius, carrying the hoist rope and hook block assembly.',
      assemblyOrder: 5,
      connections: ['Triangular Lattice Jib', 'Wire Rope System', 'Cable Festoon'],
      failureEffect: 'Trolley cannot traverse — crane limited to fixed radius lifting.',
      cascadeFailures: ['Wire Rope System'],
      originalPosition: { x: 12, y: 0, z: 0 },
      explodedPosition: { x: 12, y: -4, z: 3 }
    },
    {
      name: 'Wire Rope System',
      description: 'Multi-fall wire rope reeving through top sheave, jib tip sheaves, trolley sheaves, and hook block sheaves. 4-fall configuration with helical strand construction.',
      material: '6x36 Warrington-Seale wire rope, galvanized steel core',
      function: 'Transmits hoisting force from the drum through the sheave system to raise and lower the load. Multi-fall arrangement provides mechanical advantage.',
      assemblyOrder: 7,
      connections: ['Hoist Drum', 'Cat Head Top Sheave', 'Jib Tip Sheaves', 'Trolley Sheaves', 'Hook Block'],
      failureEffect: 'Load drop — wire rope failure causes immediate uncontrolled descent of the hook block and any suspended load.',
      cascadeFailures: ['Hook Block'],
      originalPosition: { x: 0, y: -0.5, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 2 }
    },
    {
      name: 'Hook Block',
      description: 'Heavy-duty lifting block with twin internal sheaves, chrome-plated swivel hook with safety latch, and integrated swivel joint for free rotation under load.',
      material: 'Forged alloy steel hook, cast steel block, chrome plating',
      function: 'Provides the load attachment point. Swivel joint prevents rope twist. Safety latch prevents accidental sling release.',
      assemblyOrder: 8,
      connections: ['Wire Rope System'],
      failureEffect: 'Load detachment — catastrophic drop of suspended materials.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -6.5, z: 0 },
      explodedPosition: { x: 0, y: -14, z: 0 }
    },
    {
      name: 'Cat Head & Tie Rods',
      description: 'Vertical lattice mast above the slewing unit with cross arm, supporting front and rear pendant tie rods. Includes top sheave for hoist rope routing.',
      material: 'Structural steel lattice, forged steel pendant bars',
      function: 'Transfers jib bending loads through tension in the tie rods into the mast. Provides the high-point for hoist rope routing via top sheave.',
      assemblyOrder: 4,
      connections: ['Slewing Platform', 'Triangular Lattice Jib', 'Counter Jib', 'Top Sheave'],
      failureEffect: 'Loss of jib support — boom collapses under self-weight and load.',
      cascadeFailures: ['Triangular Lattice Jib', 'Counter Jib', 'Wire Rope System'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 10, z: 0 }
    },
    {
      name: 'Slewing Platform & Bearing',
      description: 'Rotating platform mounted on large-diameter roller bearing. Carries the operator cabin, jib, counter jib, and cat head. Features safety railing and ladder access.',
      material: 'Structural steel platform, precision bearing races',
      function: 'Enables 360° rotation of the entire upper structure relative to the fixed tower mast. Transfers all vertical and horizontal loads to the mast.',
      assemblyOrder: 2,
      connections: ['Tower Mast', 'Operator Cabin', 'Triangular Lattice Jib', 'Counter Jib', 'Cat Head'],
      failureEffect: 'Slewing mechanism seized — crane cannot rotate to serve different areas.',
      cascadeFailures: ['Operator Cabin'],
      originalPosition: { x: 0, y: 4.15, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 }
    },
    {
      name: 'Counter Jib & Counterweight',
      description: 'Rear lattice truss carrying stacked concrete counterweight blocks. Balances the overturning moment created by the jib and suspended load.',
      material: 'Structural steel lattice, precast concrete blocks',
      function: 'Provides the restoring moment to prevent crane tipping. Houses the hoist winch machinery including drum, motor, and brake system.',
      assemblyOrder: 6,
      connections: ['Slewing Platform', 'Rear Tie Rods', 'Hoist Machinery'],
      failureEffect: 'Crane stability compromised — overturning moment exceeds restoring moment, crane tips.',
      cascadeFailures: ['Hoist Machinery'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -8, y: 2, z: 0 }
    },
    {
      name: 'Hoist Machinery',
      description: 'Electric winch comprising grooved drum with helical rope winding, planetary gear motor, electromagnetic disc brake, and electrical junction box with cable conduit.',
      material: 'Cast iron drum, copper-wound motor, steel gears',
      function: 'Provides controlled hoisting and lowering of the load through the wire rope system. Brake holds load in position when motor is de-energized.',
      assemblyOrder: 6,
      connections: ['Counter Jib', 'Wire Rope System'],
      failureEffect: 'Uncontrolled load descent if brake fails, or inability to lift if motor fails.',
      cascadeFailures: ['Wire Rope System', 'Hook Block'],
      originalPosition: { x: -3, y: 0.2, z: 0 },
      explodedPosition: { x: -5, y: -3, z: 3 }
    },
    {
      name: 'Operator Cabin',
      description: 'Enclosed climate-controlled cabin with panoramic windows including bottom viewing glass. Features access ladder, roof-mounted warning light, and ergonomic controls.',
      material: 'Steel frame, tinted safety glass, insulated panels',
      function: 'Houses the crane operator with clear visibility of the load and work area. Contains all crane controls and safety instruments.',
      assemblyOrder: 9,
      connections: ['Slewing Platform'],
      failureEffect: 'Operator exposure to weather, reduced visibility, safety risk.',
      cascadeFailures: [],
      originalPosition: { x: 1.4, y: 0.15, z: 0 },
      explodedPosition: { x: 4, y: -2, z: 4 }
    },
    {
      name: 'Tower Mast Top Section',
      description: 'Square lattice mast section with K-bracing on all four faces, carrying the slewing bearing assembly. Features high-strength bolted connections.',
      material: 'High-strength structural steel tubes, Grade 10.9 bolts',
      function: 'Transfers all crane loads to the foundation. Provides the fixed base for the slewing mechanism.',
      assemblyOrder: 1,
      connections: ['Slewing Platform', 'Foundation'],
      failureEffect: 'Total crane failure — structural collapse of the entire crane.',
      cascadeFailures: ['Slewing Platform', 'Triangular Lattice Jib', 'Counter Jib', 'Cat Head'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -4, z: 0 }
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  //  QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary structural advantage of a triangular cross-section lattice jib over a box-section jib?',
      options: [
        'Triangular sections are cheaper to manufacture',
        'Triangular sections have better torsional rigidity for the same weight',
        'Triangular sections reduce the number of tie rods needed',
        'Triangular sections allow longer jib lengths without deflection'
      ],
      correct: 1,
      explanation: 'A triangular cross-section provides excellent torsional rigidity with fewer members than a box section, resulting in a lighter structure for a given stiffness. This is critical because the jib experiences combined bending and torsional loading when lifting off-center.',
      difficulty: 'hard'
    },
    {
      question: 'Why does a tower crane use a multi-fall wire rope reeving system through multiple sheaves?',
      options: [
        'To increase the speed of load hoisting',
        'To reduce the required drum diameter',
        'To provide mechanical advantage, reducing the rope tension and drum torque required',
        'To prevent the rope from swaying in the wind'
      ],
      correct: 2,
      explanation: 'Multi-fall reeving (e.g., 4-fall) divides the load among multiple rope segments, reducing the tension in each rope line by a factor equal to the number of falls. This means a smaller, lighter rope can be used, and the hoist motor/drum need less torque, though hoisting speed is reduced proportionally.',
      difficulty: 'medium'
    },
    {
      question: 'What is the function of the pendant tie rods connecting the cat head cross arm to the jib and counter jib?',
      options: [
        'They provide electrical grounding for lightning protection',
        'They carry tension loads that resist the bending moment in the jib, converting it to compression in the mast',
        'They guide the wire rope from the hoist drum to the jib tip',
        'They prevent the jib from rotating independently of the counter jib'
      ],
      correct: 1,
      explanation: 'The tie rods act as tension members in a structural truss formed by the jib (bottom chord), tie rod (top chord), and mast (vertical member). The bending moment from the jib\'s self-weight and load is resolved into tension in the tie rods and compression in the mast, which is far more efficient than a cantilevered beam.',
      difficulty: 'hard'
    },
    {
      question: 'Why is the hook block equipped with a swivel joint above the hook?',
      options: [
        'To allow the operator to rotate the load to a desired orientation',
        'To prevent the wire rope from accumulating twist as the load rotates freely, which would cause rope damage',
        'To increase the rated load capacity of the hook',
        'To accommodate different sling angles'
      ],
      correct: 1,
      explanation: 'As the crane slews and the trolley traverses, the suspended load tends to spin. Without a swivel, this rotation would twist the wire rope, causing strand separation, fatigue, and premature failure. The swivel allows free rotation, isolating the rope from torsional loads.',
      difficulty: 'medium'
    },
    {
      question: 'How does the counterweight system on a tower crane maintain stability?',
      options: [
        'It makes the crane heavier so wind cannot blow it over',
        'It ensures the restoring moment about the tipping edge always exceeds the overturning moment from the load and jib self-weight',
        'It anchors the crane to the ground through additional foundations',
        'It reduces the deflection of the jib tip under load'
      ],
      correct: 1,
      explanation: 'Crane stability is governed by the balance of moments about the potential tipping edge. The counterweight (positioned on the counter jib behind the mast) creates a restoring moment that must exceed the overturning moment created by the load at the hook and the jib\'s self-weight. Safety codes require a minimum stability factor (typically 1.5) against tipping.',
      difficulty: 'easy'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  //  DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════
  const description = `Tower Crane Jib Assembly — a complete upper structure model featuring a triangular lattice truss jib with Warren K-bracing, ` +
    `a four-wheeled hoist trolley with flanged wheels and twin sheaves, multi-fall wire rope reeving through top sheave, jib-tip sheaves, and hook block sheaves, ` +
    `pendant tie rods from the cat head cross arm supporting the jib and counter jib, ` +
    `an operator cabin with panoramic glazing and bottom viewing window, ` +
    `counter jib with stacked concrete counterweights and hoist winch machinery (grooved drum, motor, brake), ` +
    `and futuristic diagnostic LED strips with sensor nodes along the jib. ` +
    `The slewing bearing enables 360° rotation of the entire assembly atop the tower mast.`;

  // ═══════════════════════════════════════════════════════════════════════════
  //  ANIMATE
  // ═══════════════════════════════════════════════════════════════════════════
  const meshes = {
    slewingGroup,
    trolleyGroup,
    hookBlock,
    hoistDrum,
    warnLightMesh,
    beacon,
    neonStrip,
    tipLight,
    anemometerGroup,
    trolleyWheels,
    trolleySheaves,
    topSheave,
  };

  function animate(time, speed, _meshes) {
    const t = time * speed;
    const s = speed;

    // 1) Slewing rotation (slow, majestic 360° sweep)
    slewingGroup.rotation.y = Math.sin(t * 0.15) * 0.6;

    // 2) Trolley traverse along jib
    const trolleyTravel = 8 + Math.sin(t * 0.3) * 8; // range ~4 to ~16
    trolleyGroup.position.x = trolleyTravel;

    // 3) Hook block vertical hoisting
    const hoistDisp = Math.sin(t * 0.25 + 0.5) * 2.0;
    ropeMeshes.forEach(r => {
      r.scale.y = 1.0 + hoistDisp * 0.15;
      r.position.y = -(ropeLength / 2) * (1.0 + hoistDisp * 0.15);
    });
    hookBlock.position.y = -ropeLength + hoistDisp;

    // 4) Hoist drum rotation
    hoistDrum.rotation.x = t * 1.5;

    // 5) Trolley wheels rotation (speed proportional to trolley velocity)
    const wheelSpeed = Math.cos(t * 0.3) * 5.0;
    trolleyWheels.forEach(w => { w.rotation.y += wheelSpeed * 0.016; });

    // 6) Sheave rotations
    trolleySheaves.forEach(sh => {
      sh.children.forEach(c => { if (c.rotation) c.rotation.z = t * 2.0; });
    });
    topSheave.children.forEach(c => { if (c.rotation) c.rotation.z = t * 1.8; });

    // 7) Warning light pulsing
    const pulse = (Math.sin(t * 6.0) + 1.0) * 0.5;
    warnLightMesh.material.emissiveIntensity = 0.4 + pulse * 1.5;
    warnLightMesh.scale.setScalar(0.9 + pulse * 0.2);

    // 8) Anti-collision beacon alternating flash
    const flash = Math.sin(t * 4.0) > 0.0 ? 1.8 : 0.3;
    beacon.material.emissiveIntensity = flash;

    // 9) Neon diagnostic strip breathing
    neonStrip.material.emissiveIntensity = 0.5 + Math.sin(t * 2.0) * 0.4;
    neonStrip.material.opacity = 0.6 + Math.sin(t * 2.0) * 0.25;

    // 10) Tip light steady pulse
    tipLight.material.emissiveIntensity = 0.4 + Math.sin(t * 3.0) * 0.3;

    // 11) Anemometer cups spinning
    anemometerGroup.rotation.y = t * 3.0;

    // 12) Hook block gentle pendulum sway
    hookBlock.rotation.z = Math.sin(t * 0.4) * 0.04;
    hookBlock.rotation.x = Math.cos(t * 0.35) * 0.03;
  }

  return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTowerCraneJib() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
