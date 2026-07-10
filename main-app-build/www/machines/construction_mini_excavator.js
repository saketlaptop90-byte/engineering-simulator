// construction_mini_excavator.js
// Modern Mini Excavator – Kubota KX040-4 style
// Ultra-detailed THREE.js model with realistic rubber crawler tracks,
// compact boom-stick-bucket, rear blade, enclosed cab, zero tail swing,
// and hydraulic lines.

import {
  plastic,
  aluminum,
  glass,
  copper,
  steel,
  darkSteel,
  rubber,
  chrome,
  tinted
} from '../utils/materials.js';

/* ------------------------------------------------------------------ */
/*  Helper: re-usable material factories                               */
/* ------------------------------------------------------------------ */

function _glow(THREE, hex, intensity = 2.0) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: intensity,
    roughness: 0.25,
    metalness: 0.6,
    transparent: true,
    opacity: 0.92
  });
}

function _paint(THREE, hex) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: 0.45,
    metalness: 0.35
  });
}

function _matteBlack(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.85,
    metalness: 0.15
  });
}

function _hydraulicMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.3,
    metalness: 0.9
  });
}

function _warningStripe(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff8800,
    emissiveIntensity: 0.3,
    roughness: 0.5,
    metalness: 0.2
  });
}

function _cabGlass(THREE) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x88bbdd,
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.85,
    transparent: true,
    opacity: 0.35,
    thickness: 0.02,
    ior: 1.5,
    clearcoat: 1.0
  });
}

/* ------------------------------------------------------------------ */
/*  Helper: hydraulic tube between two points                          */
/* ------------------------------------------------------------------ */

function _hydraulicTube(THREE, start, end, radius = 0.018, mat) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const ctrl = mid.clone().add(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.06,
      dir.length() * 0.15,
      (Math.random() - 0.5) * 0.06
    )
  );
  const curve = new THREE.QuadraticBezierCurve3(start, ctrl, end);
  const tubeGeo = new THREE.TubeGeometry(curve, 16, radius, 8, false);
  const mesh = new THREE.Mesh(tubeGeo, mat);

  // fittings at each end
  const fitGeo = new THREE.CylinderGeometry(radius * 1.8, radius * 1.8, 0.025, 8);
  const fitMat = mat.clone ? mat.clone() : mat;
  [start, end].forEach((p) => {
    const fit = new THREE.Mesh(fitGeo, fitMat);
    fit.position.copy(p);
    mesh.add(fit);
  });
  return mesh;
}

/* ------------------------------------------------------------------ */
/*  Helper: hydraulic cylinder (piston + rod)                          */
/* ------------------------------------------------------------------ */

function _hydraulicCylinder(THREE, length, barrelR, rodR, mat, chromeMat) {
  const grp = new THREE.Group();
  // barrel
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(barrelR, barrelR, length * 0.6, 16),
    mat
  );
  barrel.position.y = length * 0.3;
  grp.add(barrel);
  // rod
  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(rodR, rodR, length * 0.55, 12),
    chromeMat
  );
  rod.position.y = -length * 0.2;
  rod.name = '__pistonRod';
  grp.add(rod);
  // caps
  const capGeo = new THREE.SphereGeometry(barrelR * 1.05, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const cap1 = new THREE.Mesh(capGeo, mat);
  cap1.position.y = length * 0.6;
  grp.add(cap1);
  // eyelets
  const eyeGeo = new THREE.TorusGeometry(barrelR * 0.6, rodR * 0.7, 8, 12);
  const eye1 = new THREE.Mesh(eyeGeo, mat);
  eye1.position.y = length * 0.6;
  eye1.rotation.x = Math.PI / 2;
  grp.add(eye1);
  const eye2 = new THREE.Mesh(eyeGeo, mat);
  eye2.position.y = -length * 0.5;
  eye2.rotation.x = Math.PI / 2;
  grp.add(eye2);
  return grp;
}

/* ------------------------------------------------------------------ */
/*  Helper: rubber track assembly                                      */
/* ------------------------------------------------------------------ */

function _buildTrack(THREE, side) {
  const trackGroup = new THREE.Group();
  const sign = side === 'left' ? -1 : 1;
  const trackWidth = 0.25;
  const trackLength = 1.6;
  const trackHeight = 0.38;
  const sprocketR = 0.15;
  const idlerR = 0.13;

  // Main track frame (undercarriage rail)
  const frameMat = _paint(THREE, 0x333333);
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(trackWidth * 0.5, 0.06, trackLength),
    frameMat
  );
  frame.position.set(sign * 0.55, 0.18, 0);
  trackGroup.add(frame);

  // Track guard / side panels
  const guardGeo = new THREE.BoxGeometry(0.03, trackHeight * 0.6, trackLength * 1.02);
  const guardInner = new THREE.Mesh(guardGeo, frameMat);
  guardInner.position.set(sign * (0.55 - trackWidth * 0.25 - 0.015), 0.2, 0);
  trackGroup.add(guardInner);
  const guardOuter = new THREE.Mesh(guardGeo, frameMat);
  guardOuter.position.set(sign * (0.55 + trackWidth * 0.25 + 0.015), 0.2, 0);
  trackGroup.add(guardOuter);

  // Drive sprocket (front)
  const sprocketGeo = new THREE.CylinderGeometry(sprocketR, sprocketR, trackWidth * 0.85, 16);
  const sprocketMesh = new THREE.Mesh(sprocketGeo, darkSteel(THREE));
  sprocketMesh.rotation.z = Math.PI / 2;
  sprocketMesh.position.set(sign * 0.55, 0.19, trackLength * 0.45);
  sprocketMesh.name = side + 'Sprocket';
  trackGroup.add(sprocketMesh);
  // sprocket teeth
  for (let t = 0; t < 10; t++) {
    const ang = (t / 10) * Math.PI * 2;
    const tooth = new THREE.Mesh(
      new THREE.BoxGeometry(trackWidth * 0.15, 0.03, 0.035),
      darkSteel(THREE)
    );
    tooth.position.set(
      sign * 0.55,
      0.19 + Math.sin(ang) * sprocketR,
      trackLength * 0.45 + Math.cos(ang) * sprocketR
    );
    tooth.rotation.x = ang;
    trackGroup.add(tooth);
  }

  // Idler wheel (rear)
  const idlerGeo = new THREE.CylinderGeometry(idlerR, idlerR, trackWidth * 0.7, 16);
  const idlerMesh = new THREE.Mesh(idlerGeo, darkSteel(THREE));
  idlerMesh.rotation.z = Math.PI / 2;
  idlerMesh.position.set(sign * 0.55, 0.17, -trackLength * 0.45);
  trackGroup.add(idlerMesh);

  // Track rollers (bottom)
  const rollerGeo = new THREE.CylinderGeometry(0.04, 0.04, trackWidth * 0.6, 10);
  for (let r = 0; r < 5; r++) {
    const roller = new THREE.Mesh(rollerGeo, steel(THREE));
    roller.rotation.z = Math.PI / 2;
    roller.position.set(
      sign * 0.55,
      0.06,
      -trackLength * 0.35 + r * (trackLength * 0.7 / 4)
    );
    trackGroup.add(roller);
  }
  // Top carrier roller
  const carrierRoller = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, trackWidth * 0.5, 10),
    steel(THREE)
  );
  carrierRoller.rotation.z = Math.PI / 2;
  carrierRoller.position.set(sign * 0.55, 0.34, 0);
  trackGroup.add(carrierRoller);

  // ---- RUBBER TRACK WITH TREAD LUGS ----
  // Main track body uses a custom shape extruded around the path
  const rubberMat = rubber(THREE);

  // Bottom straight
  const lugHeight = 0.025;
  const lugWidth = trackWidth * 0.7;
  const lugDepth = 0.02;
  const numLugs = 42;

  // Create track segments along a rounded-rectangle path
  const trackPath = [];
  const halfL = trackLength * 0.45;
  const topY = 0.35;
  const botY = 0.03;
  const segments = 80;

  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    let px, py;
    if (frac < 0.3) {
      // bottom straight (front to back)
      const t = frac / 0.3;
      px = halfL - t * trackLength * 0.9;
      py = botY;
    } else if (frac < 0.4) {
      // rear curve
      const t = (frac - 0.3) / 0.1;
      const ang = -Math.PI / 2 + t * Math.PI;
      px = -halfL + Math.cos(ang) * idlerR * 0.8;
      py = (botY + topY) * 0.5 + Math.sin(ang) * (topY - botY) * 0.5;
    } else if (frac < 0.75) {
      // top straight (back to front)
      const t = (frac - 0.4) / 0.35;
      px = -halfL + t * trackLength * 0.9;
      py = topY;
    } else {
      // front curve
      const t = (frac - 0.75) / 0.25;
      const ang = Math.PI / 2 + t * Math.PI;
      px = halfL + Math.cos(ang) * sprocketR * 0.8;
      py = (botY + topY) * 0.5 + Math.sin(ang) * (topY - botY) * 0.5;
    }
    trackPath.push(new THREE.Vector3(0, py, px));
  }

  const trackCurve = new THREE.CatmullRomCurve3(trackPath, true);
  const trackBandGeo = new THREE.TubeGeometry(trackCurve, 120, 0.022, 6, true);
  const trackBand = new THREE.Mesh(trackBandGeo, rubberMat);
  trackBand.position.x = sign * 0.55;
  trackGroup.add(trackBand);

  // inner band for width
  const trackBandGeo2 = new THREE.TubeGeometry(trackCurve, 120, 0.02, 6, true);
  const trackBand2 = new THREE.Mesh(trackBandGeo2, rubberMat);
  trackBand2.position.x = sign * (0.55 + 0.06);
  trackGroup.add(trackBand2);
  const trackBand3 = new THREE.Mesh(trackBandGeo2, rubberMat);
  trackBand3.position.x = sign * (0.55 - 0.06);
  trackGroup.add(trackBand3);

  // Tread lugs around the track
  const lugGeo = new THREE.BoxGeometry(lugWidth, lugHeight, lugDepth);
  for (let i = 0; i < numLugs; i++) {
    const t = i / numLugs;
    const pt = trackCurve.getPoint(t);
    const tangent = trackCurve.getTangent(t);
    const lug = new THREE.Mesh(lugGeo, rubberMat);
    lug.position.set(sign * 0.55, pt.y, pt.z);
    // outward normal
    const normal = new THREE.Vector3(-tangent.z, tangent.y, tangent.x).normalize();
    lug.position.add(normal.multiplyScalar(0.018));
    // orient lug
    lug.lookAt(
      lug.position.clone().add(tangent)
    );
    trackGroup.add(lug);

    // Chevron / herring-bone inner lugs for grip pattern
    if (i % 2 === 0) {
      const chevGeo = new THREE.BoxGeometry(lugWidth * 0.35, lugHeight * 0.7, lugDepth * 0.7);
      const chev1 = new THREE.Mesh(chevGeo, rubberMat);
      chev1.position.copy(lug.position);
      chev1.position.x += sign * 0.03;
      chev1.rotation.copy(lug.rotation);
      chev1.rotateZ(0.3);
      trackGroup.add(chev1);
      const chev2 = chev1.clone();
      chev2.position.x -= sign * 0.06;
      chev2.rotation.z = -0.3;
      trackGroup.add(chev2);
    }
  }

  // Track tensioner mechanism
  const tensioner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8),
    steel(THREE)
  );
  tensioner.rotation.x = Math.PI / 2;
  tensioner.position.set(sign * 0.55, 0.17, -trackLength * 0.42 - 0.07);
  trackGroup.add(tensioner);
  const tensionerKnob = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    chrome(THREE)
  );
  tensionerKnob.position.set(sign * 0.55, 0.17, -trackLength * 0.42 - 0.13);
  trackGroup.add(tensionerKnob);

  return trackGroup;
}

/* ================================================================== */
/*                      MAIN: createMachine                           */
/* ================================================================== */

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ---- colour scheme (Kubota orange / grey) ----
  const orangePaint = _paint(THREE, 0xf27820);
  const greyPaint = _paint(THREE, 0x5a5a5e);
  const blackMat = _matteBlack(THREE);
  const hydroMat = _hydraulicMat(THREE);
  const chromeMat = chrome(THREE);
  const glowGreen = _glow(THREE, 0x00ff88, 1.4);
  const glowAmber = _glow(THREE, 0xffaa00, 1.6);
  const warningMat = _warningStripe(THREE);
  const glassMat = _cabGlass(THREE);

  const meshes = {};

  /* ==============  UNDERCARRIAGE / TRACKS  =============== */
  const undercarriage = new THREE.Group();
  const leftTrack = _buildTrack(THREE, 'left');
  const rightTrack = _buildTrack(THREE, 'right');
  undercarriage.add(leftTrack, rightTrack);

  // Cross frame connecting tracks
  const crossFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.08, 1.35),
    darkSteel(THREE)
  );
  crossFrame.position.set(0, 0.22, -0.05);
  undercarriage.add(crossFrame);

  // Belly plate
  const bellyPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.025, 1.2),
    greyPaint
  );
  bellyPlate.position.set(0, 0.26, -0.05);
  undercarriage.add(bellyPlate);

  group.add(undercarriage);
  meshes.undercarriage = undercarriage;

  /* ============  SLEW RING / TURNTABLE  ============ */
  const slewRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.03, 12, 32),
    darkSteel(THREE)
  );
  slewRing.rotation.x = Math.PI / 2;
  slewRing.position.set(0, 0.3, 0);
  group.add(slewRing);

  // slew ring bolts
  for (let b = 0; b < 16; b++) {
    const ang = (b / 16) * Math.PI * 2;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.02, 6),
      chrome(THREE)
    );
    bolt.position.set(
      Math.cos(ang) * 0.22,
      0.31,
      Math.sin(ang) * 0.22
    );
    group.add(bolt);
  }

  /* ============  UPPER STRUCTURE (HOUSE)  ============ */
  const upperHouse = new THREE.Group();
  upperHouse.position.set(0, 0.32, 0);

  // Main body – rounded shape for zero tail swing
  // Use a custom shape
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-0.35, -0.4);
  bodyShape.lineTo(0.35, -0.4);
  bodyShape.quadraticCurveTo(0.42, -0.4, 0.42, -0.32);
  bodyShape.lineTo(0.42, 0.32);
  bodyShape.quadraticCurveTo(0.42, 0.42, 0.32, 0.42);
  bodyShape.lineTo(-0.32, 0.42);
  bodyShape.quadraticCurveTo(-0.42, 0.42, -0.42, 0.32);
  bodyShape.lineTo(-0.42, -0.32);
  bodyShape.quadraticCurveTo(-0.42, -0.4, -0.35, -0.4);

  const bodyExtrudeSettings = { depth: 0.32, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.01, bevelSegments: 3 };
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
  bodyGeo.rotateX(-Math.PI / 2);
  const bodyMesh = new THREE.Mesh(bodyGeo, orangePaint);
  bodyMesh.position.y = 0.01;
  upperHouse.add(bodyMesh);

  // Engine compartment hood (rear)
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.12, 0.4),
    orangePaint
  );
  hood.position.set(0, 0.28, -0.2);
  upperHouse.add(hood);

  // Hood louvers / grilles
  for (let lv = 0; lv < 6; lv++) {
    const louver = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.005, 0.002),
      blackMat
    );
    louver.position.set(0.36, 0.22 + lv * 0.03, -0.15);
    upperHouse.add(louver);
    const louverR = louver.clone();
    louverR.position.x = -0.36;
    upperHouse.add(louverR);
  }

  // Exhaust pipe
  const exhaustPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.018, 0.18, 10),
    darkSteel(THREE)
  );
  exhaustPipe.position.set(-0.25, 0.42, -0.25);
  upperHouse.add(exhaustPipe);
  const exhaustCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.022, 0.02, 10),
    darkSteel(THREE)
  );
  exhaustCap.position.set(-0.25, 0.52, -0.25);
  upperHouse.add(exhaustCap);

  // Counterweight (rear, rounded)
  const cwShape = new THREE.Shape();
  cwShape.absarc(0, 0, 0.38, Math.PI * 0.7, Math.PI * 1.3, false);
  cwShape.lineTo(-0.2, 0);
  const cwGeo = new THREE.ExtrudeGeometry(cwShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 });
  cwGeo.rotateX(-Math.PI / 2);
  const counterweight = new THREE.Mesh(cwGeo, greyPaint);
  counterweight.position.set(0, 0.01, -0.38);
  upperHouse.add(counterweight);

  // Panel lines / rivets on body
  for (let rv = 0; rv < 12; rv++) {
    const rivet = new THREE.Mesh(
      new THREE.SphereGeometry(0.006, 6, 6),
      chrome(THREE)
    );
    rivet.position.set(
      0.43,
      0.12,
      -0.35 + rv * 0.06
    );
    upperHouse.add(rivet);
  }
  // Left side rivets
  for (let rv = 0; rv < 12; rv++) {
    const rivet = new THREE.Mesh(
      new THREE.SphereGeometry(0.006, 6, 6),
      chrome(THREE)
    );
    rivet.position.set(
      -0.43,
      0.12,
      -0.35 + rv * 0.06
    );
    upperHouse.add(rivet);
  }

  group.add(upperHouse);
  meshes.upperHouse = upperHouse;

  /* ============  OPERATOR CAB  ============ */
  const cab = new THREE.Group();

  // Cab frame – ROPS/FOPS structure
  const cabFrameMat = _paint(THREE, 0x444444);
  const pillarGeo = new THREE.BoxGeometry(0.03, 0.45, 0.03);
  // four corner pillars
  const positions = [
    [0.28, 0.52, 0.08], [-0.08, 0.52, 0.08],
    [0.28, 0.52, 0.42], [-0.08, 0.52, 0.42]
  ];
  positions.forEach(([x, y, z]) => {
    const pillar = new THREE.Mesh(pillarGeo, cabFrameMat);
    pillar.position.set(x, y, z);
    cab.add(pillar);
  });

  // Top crossbars
  const topBarGeo = new THREE.BoxGeometry(0.39, 0.025, 0.03);
  const topBar1 = new THREE.Mesh(topBarGeo, cabFrameMat);
  topBar1.position.set(0.1, 0.75, 0.08);
  cab.add(topBar1);
  const topBar2 = topBar1.clone();
  topBar2.position.z = 0.42;
  cab.add(topBar2);
  const topBarSide = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.025, 0.37),
    cabFrameMat
  );
  topBarSide.position.set(0.28, 0.75, 0.25);
  cab.add(topBarSide);
  const topBarSide2 = topBarSide.clone();
  topBarSide2.position.x = -0.08;
  cab.add(topBarSide2);

  // Roof
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.02, 0.42),
    orangePaint
  );
  roof.position.set(0.1, 0.77, 0.25);
  cab.add(roof);

  // Glass panels (front, side, rear)
  // Front windshield
  const frontGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.42),
    glassMat
  );
  frontGlass.position.set(0.1, 0.52, 0.43);
  cab.add(frontGlass);

  // Side glass (right)
  const sideGlassR = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.42),
    glassMat
  );
  sideGlassR.rotation.y = Math.PI / 2;
  sideGlassR.position.set(0.29, 0.52, 0.25);
  cab.add(sideGlassR);

  // Side glass (left)
  const sideGlassL = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.42),
    glassMat
  );
  sideGlassL.rotation.y = -Math.PI / 2;
  sideGlassL.position.set(-0.09, 0.52, 0.25);
  cab.add(sideGlassL);

  // Rear window (smaller)
  const rearGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.25),
    glassMat
  );
  rearGlass.position.set(0.1, 0.58, 0.07);
  rearGlass.rotation.y = Math.PI;
  cab.add(rearGlass);

  // Floor plate
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.015, 0.36),
    blackMat
  );
  floor.position.set(0.1, 0.3, 0.25);
  cab.add(floor);

  // Operator seat
  const seatBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.04, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
  );
  seatBase.position.set(0.1, 0.34, 0.2);
  cab.add(seatBase);
  const seatBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.2, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
  );
  seatBack.position.set(0.1, 0.44, 0.11);
  cab.add(seatBack);

  // Joystick controls
  const joystickGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.08, 8);
  const joyL = new THREE.Mesh(joystickGeo, blackMat);
  joyL.position.set(-0.0, 0.38, 0.28);
  cab.add(joyL);
  const joyLKnob = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), blackMat);
  joyLKnob.position.set(-0.0, 0.42, 0.28);
  cab.add(joyLKnob);
  const joyR = new THREE.Mesh(joystickGeo, blackMat);
  joyR.position.set(0.2, 0.38, 0.28);
  cab.add(joyR);
  const joyRKnob = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), blackMat);
  joyRKnob.position.set(0.2, 0.42, 0.28);
  cab.add(joyRKnob);

  // Step/footrest
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.015, 0.06),
    aluminum(THREE)
  );
  step.position.set(0.1, 0.29, 0.44);
  cab.add(step);
  // Anti-slip tread on step
  for (let s = 0; s < 4; s++) {
    const tread = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.004, 0.004),
      blackMat
    );
    tread.position.set(0.1, 0.3, 0.425 + s * 0.012);
    cab.add(tread);
  }

  // Work lights on cab roof
  const lightGeo = new THREE.BoxGeometry(0.04, 0.025, 0.02);
  const lightFront = new THREE.Mesh(lightGeo, glowAmber);
  lightFront.position.set(0.1, 0.79, 0.42);
  lightFront.name = 'workLightFront';
  cab.add(lightFront);
  meshes.workLightFront = lightFront;

  const lightRear = new THREE.Mesh(lightGeo, glowAmber);
  lightRear.position.set(0.1, 0.79, 0.08);
  lightRear.name = 'workLightRear';
  cab.add(lightRear);
  meshes.workLightRear = lightRear;

  // Safety beacon (rotating warning light)
  const beaconBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.02, 0.015, 10),
    blackMat
  );
  beaconBase.position.set(-0.05, 0.785, 0.12);
  cab.add(beaconBase);
  const beaconLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.03, 10),
    _glow(THREE, 0xff6600, 2.5)
  );
  beaconLens.position.set(-0.05, 0.81, 0.12);
  beaconLens.name = 'beacon';
  cab.add(beaconLens);
  meshes.beacon = beaconLens;

  upperHouse.add(cab);
  meshes.cab = cab;

  /* ============  BOOM – STICK – BUCKET  ============ */
  const armAssembly = new THREE.Group();
  armAssembly.position.set(0.1, 0.35, 0.42);

  // === BOOM ===
  const boom = new THREE.Group();
  // Main boom arm – tapered box with bevel
  const boomShape = new THREE.Shape();
  boomShape.moveTo(-0.05, -0.04);
  boomShape.lineTo(0.05, -0.04);
  boomShape.lineTo(0.04, 0.04);
  boomShape.lineTo(-0.04, 0.04);
  boomShape.lineTo(-0.05, -0.04);
  const boomCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.35, 0.15),
    new THREE.Vector3(0, 0.45, 0.45),
    new THREE.Vector3(0, 0.15, 0.7)
  );
  const boomExtGeo = new THREE.ExtrudeGeometry(boomShape, {
    steps: 30,
    extrudePath: boomCurve,
    bevelEnabled: false
  });
  const boomMesh = new THREE.Mesh(boomExtGeo, orangePaint);
  boom.add(boomMesh);

  // Boom pivot pin
  const pivotPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.14, 10),
    chrome(THREE)
  );
  pivotPin.rotation.z = Math.PI / 2;
  pivotPin.position.set(0, 0.0, 0.0);
  boom.add(pivotPin);

  // Boom cylinder
  const boomCylinder = _hydraulicCylinder(THREE, 0.5, 0.032, 0.016, hydroMat, chromeMat);
  boomCylinder.position.set(-0.08, 0.12, 0.12);
  boomCylinder.rotation.z = -0.3;
  boomCylinder.name = 'boomCylinder';
  boom.add(boomCylinder);
  meshes.boomCylinder = boomCylinder;

  // Hydraulic lines on boom
  const boomHydroLine1 = _hydraulicTube(
    THREE,
    new THREE.Vector3(0.06, 0.1, 0.05),
    new THREE.Vector3(0.05, 0.35, 0.55),
    0.01,
    hydroMat
  );
  boom.add(boomHydroLine1);
  const boomHydroLine2 = _hydraulicTube(
    THREE,
    new THREE.Vector3(-0.06, 0.1, 0.05),
    new THREE.Vector3(-0.05, 0.38, 0.5),
    0.008,
    new THREE.MeshStandardMaterial({ color: 0x884400, roughness: 0.5, metalness: 0.3 })
  );
  boom.add(boomHydroLine2);

  // Boom reinforcement plates
  const reinforcePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.005, 0.08),
    darkSteel(THREE)
  );
  reinforcePlate.position.set(0, -0.04, 0.15);
  boom.add(reinforcePlate);

  armAssembly.add(boom);
  meshes.boom = boom;

  // === STICK (DIPPER ARM) ===
  const stick = new THREE.Group();
  stick.position.set(0, 0.15, 0.7);

  const stickGeo = new THREE.BoxGeometry(0.06, 0.07, 0.55);
  const stickMesh = new THREE.Mesh(stickGeo, orangePaint);
  stickMesh.position.set(0, -0.05, 0.28);
  stickMesh.rotation.x = 0.15;
  stick.add(stickMesh);

  // Stick side plates
  const stickPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.003, 0.08, 0.5),
    greyPaint
  );
  stickPlate.position.set(0.032, -0.05, 0.28);
  stickPlate.rotation.x = 0.15;
  stick.add(stickPlate);
  const stickPlate2 = stickPlate.clone();
  stickPlate2.position.x = -0.032;
  stick.add(stickPlate2);

  // Stick pivot
  const stickPivot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.1, 10),
    chrome(THREE)
  );
  stickPivot.rotation.z = Math.PI / 2;
  stick.add(stickPivot);

  // Stick cylinder
  const stickCylinder = _hydraulicCylinder(THREE, 0.35, 0.025, 0.013, hydroMat, chromeMat);
  stickCylinder.position.set(0.06, 0.08, 0.1);
  stickCylinder.rotation.z = 0.25;
  stickCylinder.rotation.x = 0.3;
  stickCylinder.name = 'stickCylinder';
  stick.add(stickCylinder);
  meshes.stickCylinder = stickCylinder;

  // Hydraulic line on stick
  const stickHydroLine = _hydraulicTube(
    THREE,
    new THREE.Vector3(0.04, 0.0, 0.05),
    new THREE.Vector3(0.03, -0.08, 0.5),
    0.008,
    hydroMat
  );
  stick.add(stickHydroLine);

  // Grease fittings
  const greaseFit = new THREE.Mesh(
    new THREE.SphereGeometry(0.008, 6, 6),
    _glow(THREE, 0xffdd00, 0.5)
  );
  greaseFit.position.set(0.04, 0, 0);
  stick.add(greaseFit);

  boom.add(stick);
  meshes.stick = stick;

  // === BUCKET ===
  const bucket = new THREE.Group();
  bucket.position.set(0, -0.12, 0.55);

  // Bucket shell – curved using LatheGeometry
  const bucketProfile = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const angle = t * Math.PI * 0.6 - Math.PI * 0.1;
    bucketProfile.push(
      new THREE.Vector2(
        0.12 + Math.sin(angle) * 0.06,
        (t - 0.5) * 0.22
      )
    );
  }
  const bucketShell = new THREE.Mesh(
    new THREE.LatheGeometry(bucketProfile, 16, 0, Math.PI),
    darkSteel(THREE)
  );
  bucketShell.rotation.y = Math.PI / 2;
  bucketShell.rotation.z = Math.PI;
  bucket.add(bucketShell);

  // Bucket cutting edge
  const cuttingEdge = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.015, 0.01),
    steel(THREE)
  );
  cuttingEdge.position.set(0, -0.11, 0.14);
  bucket.add(cuttingEdge);

  // Bucket teeth
  for (let bt = 0; bt < 4; bt++) {
    const tooth = new THREE.Group();
    const toothBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.012, 0.05, 6),
      steel(THREE)
    );
    toothBody.rotation.x = Math.PI * 0.7;
    tooth.add(toothBody);
    const toothBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.018, 0.015),
      darkSteel(THREE)
    );
    toothBase.position.y = 0.005;
    tooth.add(toothBase);
    tooth.position.set(-0.075 + bt * 0.05, -0.12, 0.16);
    bucket.add(tooth);
  }

  // Side cutters
  const sideCutter = new THREE.Mesh(
    new THREE.BoxGeometry(0.012, 0.08, 0.04),
    steel(THREE)
  );
  sideCutter.position.set(0.13, -0.08, 0.12);
  bucket.add(sideCutter);
  const sideCutter2 = sideCutter.clone();
  sideCutter2.position.x = -0.13;
  bucket.add(sideCutter2);

  // Bucket pivot
  const bucketPivot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8),
    chrome(THREE)
  );
  bucketPivot.rotation.z = Math.PI / 2;
  bucket.add(bucketPivot);

  // Bucket link mechanism
  const bucketLink = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, 0.12, 0.015),
    darkSteel(THREE)
  );
  bucketLink.position.set(0.04, 0.04, -0.02);
  bucketLink.rotation.z = 0.3;
  bucket.add(bucketLink);
  const bucketLink2 = bucketLink.clone();
  bucketLink2.position.x = -0.04;
  bucketLink2.rotation.z = -0.3;
  bucket.add(bucketLink2);

  // Bucket cylinder
  const bucketCylinder = _hydraulicCylinder(THREE, 0.22, 0.02, 0.01, hydroMat, chromeMat);
  bucketCylinder.position.set(0, 0.12, -0.04);
  bucketCylinder.rotation.x = 0.4;
  bucketCylinder.name = 'bucketCylinder';
  bucket.add(bucketCylinder);
  meshes.bucketCylinder = bucketCylinder;

  stick.add(bucket);
  meshes.bucket = bucket;

  group.add(armAssembly);
  meshes.armAssembly = armAssembly;

  /* ============  DOZER BLADE (REAR)  ============ */
  const blade = new THREE.Group();
  blade.position.set(0, 0.12, -0.85);

  // Blade plate – curved
  const bladeCurve = new THREE.QuadraticBezierCurve(
    new THREE.Vector2(-0.45, 0),
    new THREE.Vector2(0, 0.06),
    new THREE.Vector2(0.45, 0)
  );
  const bladePoints = bladeCurve.getPoints(20);
  const bladeShape2 = new THREE.Shape();
  bladeShape2.moveTo(bladePoints[0].x, -0.12);
  bladePoints.forEach((p) => bladeShape2.lineTo(p.x, p.y - 0.12));
  bladeShape2.lineTo(bladePoints[bladePoints.length - 1].x, 0.12);
  for (let i = bladePoints.length - 1; i >= 0; i--) {
    bladeShape2.lineTo(bladePoints[i].x, bladePoints[i].y + 0.12);
  }
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape2, {
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.003
  });
  const bladePlate = new THREE.Mesh(bladeGeo, orangePaint);
  blade.add(bladePlate);

  // Blade cutting edge
  const bladeCutEdge = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.02, 0.03),
    steel(THREE)
  );
  bladeCutEdge.position.set(0, -0.12, 0.015);
  blade.add(bladeCutEdge);

  // Blade arms
  const bladeArmGeo = new THREE.BoxGeometry(0.025, 0.04, 0.35);
  const bladeArmL = new THREE.Mesh(bladeArmGeo, greyPaint);
  bladeArmL.position.set(0.25, 0, 0.19);
  blade.add(bladeArmL);
  const bladeArmR = new THREE.Mesh(bladeArmGeo, greyPaint);
  bladeArmR.position.set(-0.25, 0, 0.19);
  blade.add(bladeArmR);

  // Blade cylinder
  const bladeCylinder = _hydraulicCylinder(THREE, 0.28, 0.022, 0.012, hydroMat, chromeMat);
  bladeCylinder.position.set(0, 0.06, 0.22);
  bladeCylinder.rotation.x = -0.2;
  bladeCylinder.name = 'bladeCylinder';
  blade.add(bladeCylinder);
  meshes.bladeCylinder = bladeCylinder;

  group.add(blade);
  meshes.blade = blade;

  /* ============  ADDITIONAL DETAILS  ============ */

  // Fuel cap
  const fuelCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12),
    blackMat
  );
  fuelCap.position.set(0.3, 0.67, -0.1);
  upperHouse.add(fuelCap);
  const fuelCapRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.02, 0.003, 8, 12),
    chrome(THREE)
  );
  fuelCapRing.rotation.x = Math.PI / 2;
  fuelCapRing.position.copy(fuelCap.position);
  fuelCapRing.position.y += 0.01;
  upperHouse.add(fuelCapRing);

  // Hydraulic oil cap
  const oilCap = fuelCap.clone();
  oilCap.position.set(-0.3, 0.67, -0.15);
  upperHouse.add(oilCap);

  // Tie-down hooks
  const hookGeo = new THREE.TorusGeometry(0.015, 0.004, 6, 8, Math.PI);
  const hook1 = new THREE.Mesh(hookGeo, chrome(THREE));
  hook1.position.set(0.43, 0.15, 0.3);
  hook1.rotation.y = Math.PI / 2;
  upperHouse.add(hook1);
  const hook2 = hook1.clone();
  hook2.position.set(-0.43, 0.15, 0.3);
  upperHouse.add(hook2);

  // Warning decals / stripes
  const warningStripe1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.025, 0.003),
    warningMat
  );
  warningStripe1.position.set(0.1, 0.27, 0.43);
  upperHouse.add(warningStripe1);
  const warningStripe2 = warningStripe1.clone();
  warningStripe2.position.set(0.1, 0.24, 0.43);
  upperHouse.add(warningStripe2);

  // Grab handle on cab
  const handleCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.29, 0.45, 0.35),
    new THREE.Vector3(0.33, 0.55, 0.35),
    new THREE.Vector3(0.33, 0.65, 0.35),
    new THREE.Vector3(0.29, 0.72, 0.35)
  );
  const handleGeo = new THREE.TubeGeometry(handleCurve, 12, 0.008, 8, false);
  const grabHandle = new THREE.Mesh(handleGeo, blackMat);
  cab.add(grabHandle);

  // Boom-mounted work light
  const boomLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.02, 0.015),
    glowAmber
  );
  boomLight.position.set(0, 0.06, 0.02);
  boom.add(boomLight);

  // Hydraulic quick-coupler hoses at base
  for (let h = 0; h < 3; h++) {
    const hose = _hydraulicTube(
      THREE,
      new THREE.Vector3(-0.15 + h * 0.05, 0.35, 0.38),
      new THREE.Vector3(-0.12 + h * 0.04, 0.1, 0.42),
      0.007,
      new THREE.MeshStandardMaterial({
        color: h === 0 ? 0x880000 : h === 1 ? 0x000088 : 0x444444,
        roughness: 0.5,
        metalness: 0.3
      })
    );
    upperHouse.add(hose);
  }

  // Swivel joint indicator (neon ring at slew)
  const slewGlow = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.005, 8, 32),
    glowGreen
  );
  slewGlow.rotation.x = Math.PI / 2;
  slewGlow.position.set(0, 0.305, 0);
  slewGlow.name = 'slewGlow';
  group.add(slewGlow);
  meshes.slewGlow = slewGlow;

  // Status LEDs on dashboard (inside cab)
  const ledGeo = new THREE.SphereGeometry(0.005, 6, 6);
  const ledColors = [0x00ff00, 0xff0000, 0x00aaff, 0xffff00];
  ledColors.forEach((c, i) => {
    const led = new THREE.Mesh(ledGeo, _glow(THREE, c, 2.0));
    led.position.set(0.05 + i * 0.03, 0.37, 0.36);
    led.name = 'led_' + i;
    cab.add(led);
    meshes['led_' + i] = led;
  });

  // Mirror
  const mirrorArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.08, 6),
    blackMat
  );
  mirrorArm.rotation.z = Math.PI / 4;
  mirrorArm.position.set(0.32, 0.6, 0.42);
  cab.add(mirrorArm);
  const mirrorFace = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.06, 0.003),
    new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.05,
      metalness: 0.95
    })
  );
  mirrorFace.position.set(0.36, 0.64, 0.42);
  cab.add(mirrorFace);

  /* ================================================================ */
  /*  PARTS METADATA                                                   */
  /* ================================================================ */

  const parts = [
    {
      name: 'Rubber Crawler Tracks',
      description: 'Continuous rubber belt tracks with steel-reinforced lugs providing low ground pressure and excellent traction on soft terrain.',
      material: 'Reinforced rubber compound with embedded steel cables',
      function: 'Provides locomotion and distributes machine weight over a large surface area, minimising ground damage.',
      assemblyOrder: 1,
      connections: ['Undercarriage frame', 'Drive sprocket', 'Idler wheel', 'Track rollers'],
      failureEffect: 'Loss of mobility; machine becomes stationary.',
      cascadeFailures: ['Drive sprocket wear', 'Undercarriage misalignment'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -0.5, z: 0 }
    },
    {
      name: 'Slew Ring / Turntable',
      description: 'Large-diameter bearing assembly enabling 360° continuous rotation of the upper structure relative to the undercarriage.',
      material: 'Case-hardened alloy steel with precision-ground raceways',
      function: 'Transfers loads between upper and lower structures while allowing unlimited rotation for all-around digging.',
      assemblyOrder: 2,
      connections: ['Undercarriage cross-frame', 'Upper house base'],
      failureEffect: 'Upper structure cannot rotate; severely limits working range.',
      cascadeFailures: ['Hydraulic swivel joint leak', 'Boom positioning failure'],
      originalPosition: { x: 0, y: 0.3, z: 0 },
      explodedPosition: { x: 0, y: 0.6, z: 0 }
    },
    {
      name: 'Upper House (Engine Compartment)',
      description: 'Zero-tail-swing body housing the diesel engine, hydraulic pumps, radiator, and fuel/oil tanks within a compact, counterweighted shell.',
      material: 'Pressed high-tensile steel panels with sound-dampening insulation',
      function: 'Encloses and protects powertrain components; counterweight balances digging loads.',
      assemblyOrder: 3,
      connections: ['Slew ring', 'Cab structure', 'Boom foot pivot'],
      failureEffect: 'Engine exposure to elements; potential overheating from lost airflow management.',
      cascadeFailures: ['Cooling system failure', 'Hydraulic pump contamination'],
      originalPosition: { x: 0, y: 0.32, z: 0 },
      explodedPosition: { x: -0.6, y: 0.8, z: -0.4 }
    },
    {
      name: 'ROPS/FOPS Operator Cab',
      description: 'Fully enclosed cabin with tinted safety glass, ROPS (Roll Over Protection Structure) and FOPS (Falling Object Protection Structure) certification.',
      material: 'Welded tubular high-strength steel frame; laminated safety glass panels',
      function: 'Protects operator from rollover, falling objects, and adverse weather; houses all controls.',
      assemblyOrder: 4,
      connections: ['Upper house structure', 'Control valve block', 'Electrical harness'],
      failureEffect: 'Operator safety compromised; regulatory non-compliance.',
      cascadeFailures: ['Control system inaccessibility'],
      originalPosition: { x: 0.1, y: 0.32, z: 0.25 },
      explodedPosition: { x: 0.8, y: 1.2, z: 0.3 }
    },
    {
      name: 'Boom',
      description: 'Primary structural arm connecting the house to the stick; curved profile optimised for close-quarters excavation with zero tail swing.',
      material: 'High-tensile quenched-and-tempered steel plate, fully welded box section',
      function: 'Controls the elevation and reach of the digging attachment via the boom cylinder.',
      assemblyOrder: 5,
      connections: ['Upper house boom foot bracket', 'Stick pivot', 'Boom cylinder'],
      failureEffect: 'Cannot raise or lower dig attachment; machine non-operational for excavation.',
      cascadeFailures: ['Stick positioning failure', 'Bucket inoperable'],
      originalPosition: { x: 0.1, y: 0.35, z: 0.42 },
      explodedPosition: { x: 0.1, y: 1.0, z: 1.2 }
    },
    {
      name: 'Stick (Dipper Arm)',
      description: 'Secondary arm pivoting at the boom tip; controls the depth and angle of the bucket.',
      material: 'High-tensile steel box section with wear-resistant pivot bushings',
      function: 'Extends and retracts the bucket for crowding and dumping operations.',
      assemblyOrder: 6,
      connections: ['Boom tip pivot', 'Bucket pivot', 'Stick cylinder'],
      failureEffect: 'Cannot control bucket reach or crowd force.',
      cascadeFailures: ['Bucket positioning failure'],
      originalPosition: { x: 0.1, y: 0.5, z: 1.12 },
      explodedPosition: { x: 0.1, y: 1.2, z: 1.8 }
    },
    {
      name: 'Bucket',
      description: 'Compact trenching bucket with four forged teeth, side cutters, and a curved shell for efficient soil retention.',
      material: 'AR400 abrasion-resistant steel shell; forged alloy steel teeth',
      function: 'Excavates, retains, and dumps material. Teeth concentrate breakout force on hard ground.',
      assemblyOrder: 7,
      connections: ['Stick tip pivot', 'Bucket link mechanism', 'Bucket cylinder'],
      failureEffect: 'Cannot excavate material.',
      cascadeFailures: ['Productivity loss'],
      originalPosition: { x: 0.1, y: 0.38, z: 1.67 },
      explodedPosition: { x: 0.1, y: 1.4, z: 2.4 }
    },
    {
      name: 'Hydraulic Cylinders (Boom/Stick/Bucket/Blade)',
      description: 'Double-acting hydraulic cylinders with chrome-plated piston rods providing the motive force for all attachment movements.',
      material: 'Honed steel barrel; hard-chrome piston rod; polyurethane seals',
      function: 'Convert hydraulic pressure into linear mechanical force to actuate boom, stick, bucket, and blade.',
      assemblyOrder: 5,
      connections: ['Control valve block', 'Hydraulic lines', 'Pivot pins'],
      failureEffect: 'Loss of movement in the affected circuit; potential oil leak and environmental hazard.',
      cascadeFailures: ['Hydraulic oil loss', 'Pump cavitation', 'Adjacent cylinder overload'],
      originalPosition: { x: 0, y: 0.4, z: 0.3 },
      explodedPosition: { x: -0.8, y: 1.0, z: 0.5 }
    },
    {
      name: 'Dozer Blade',
      description: 'Rear-mounted backfill blade for grading, levelling, and stabilising the machine during digging.',
      material: 'Rolled steel plate with replaceable bolt-on cutting edge',
      function: 'Grades terrain, backfills trenches, and provides a third ground-contact point for stability during excavation.',
      assemblyOrder: 8,
      connections: ['Undercarriage rear brackets', 'Blade cylinder', 'Blade arms'],
      failureEffect: 'Cannot level or stabilise the machine; reduced versatility.',
      cascadeFailures: ['Machine instability during deep digging'],
      originalPosition: { x: 0, y: 0.12, z: -0.85 },
      explodedPosition: { x: 0, y: -0.3, z: -1.5 }
    },
    {
      name: 'Hydraulic Line Network',
      description: 'Network of high-pressure hoses and hard lines distributing hydraulic fluid from pumps to cylinders, motors, and the swivel joint.',
      material: 'Braided steel-reinforced synthetic rubber hoses; steel fittings with O-ring seals',
      function: 'Conducts pressurised hydraulic oil (up to 250 bar) to all actuators enabling precise, powerful movements.',
      assemblyOrder: 9,
      connections: ['Hydraulic pump', 'Control valve', 'All cylinders', 'Track motors'],
      failureEffect: 'Loss of hydraulic pressure in affected circuit; potential fluid spill.',
      cascadeFailures: ['Cylinder stall', 'Pump overheating', 'Environmental contamination'],
      originalPosition: { x: 0, y: 0.3, z: 0.2 },
      explodedPosition: { x: -0.6, y: 0.6, z: 0 }
    }
  ];

  /* ================================================================ */
  /*  QUIZ QUESTIONS                                                   */
  /* ================================================================ */

  const quizQuestions = [
    {
      question: 'What is the primary advantage of a "zero tail swing" design on a mini excavator?',
      options: [
        'It increases maximum digging depth',
        'The upper structure stays within the track width when rotating, allowing safe work near walls and obstacles',
        'It eliminates the need for a counterweight',
        'It allows the machine to travel at higher speeds on roads'
      ],
      correct: 1,
      explanation: 'Zero tail swing means the rear of the upper house does not extend beyond the crawler track footprint during slewing, allowing the operator to work in confined spaces without striking nearby structures or workers.',
      difficulty: 'medium'
    },
    {
      question: 'Why do mini excavators use rubber crawler tracks instead of steel tracks like larger excavators?',
      options: [
        'Rubber tracks are cheaper to manufacture',
        'Steel tracks are not available in small sizes',
        'Rubber tracks reduce ground surface damage and vibration, making the machine suitable for finished surfaces like asphalt and lawns',
        'Rubber tracks provide higher top speed on highways'
      ],
      correct: 2,
      explanation: 'Rubber tracks distribute the machine weight over a larger area with lower contact pressure and do not gouge or crack paved surfaces, making mini excavators suitable for urban, landscaping, and indoor work.',
      difficulty: 'easy'
    },
    {
      question: 'In a mini excavator hydraulic system, what happens if the stick cylinder seal fails?',
      options: [
        'The boom will drop uncontrollably',
        'The bucket will lock in position',
        'The stick will drift or lose crowd force, and the hydraulic circuit may lose pressure, potentially affecting the bucket circuit as well',
        'The dozer blade will automatically lower for safety'
      ],
      correct: 2,
      explanation: 'A failed stick cylinder seal allows internal bypass of hydraulic fluid, causing the stick to drift under load. Because the stick and bucket circuits often share a return line, pressure loss can also degrade bucket response. This is a cascade failure requiring immediate shutdown.',
      difficulty: 'hard'
    },
    {
      question: 'What is the function of the dozer blade on a mini excavator?',
      options: [
        'It is used as a snow plow attachment only',
        'It backfills trenches, grades surfaces, and provides a stabilising ground contact point during excavation',
        'It replaces the bucket for pushing large boulders',
        'It raises the front of the machine for transport loading'
      ],
      correct: 1,
      explanation: 'The dozer blade serves a dual purpose: it can push soil to backfill trenches and level ground, and when lowered to the ground, it acts as a stabilising brace to prevent the machine from sliding or tipping during deep excavation work.',
      difficulty: 'medium'
    }
  ];

  /* ================================================================ */
  /*  ANIMATE                                                          */
  /* ================================================================ */

  function animate(time, speed, _meshes) {
    const t = time * speed;
    const ref = _meshes || meshes;

    // --- Upper house slew (slow oscillation) ---
    if (ref.upperHouse) {
      ref.upperHouse.rotation.y = Math.sin(t * 0.3) * 0.35;
    }

    // --- Boom raise/lower ---
    if (ref.boom) {
      ref.boom.rotation.x = Math.sin(t * 0.5) * 0.12 - 0.05;
    }

    // --- Stick curl ---
    if (ref.stick) {
      ref.stick.rotation.x = Math.sin(t * 0.7 + 1.0) * 0.15;
    }

    // --- Bucket curl ---
    if (ref.bucket) {
      ref.bucket.rotation.x = Math.sin(t * 0.9 + 2.0) * 0.25;
    }

    // --- Blade up/down ---
    if (ref.blade) {
      ref.blade.position.y = 0.12 + Math.sin(t * 0.4 + 0.5) * 0.04;
    }

    // --- Slew glow ring pulse ---
    if (ref.slewGlow && ref.slewGlow.material) {
      ref.slewGlow.material.emissiveIntensity = 1.0 + Math.sin(t * 2.0) * 0.5;
      ref.slewGlow.material.opacity = 0.7 + Math.sin(t * 2.0) * 0.25;
    }

    // --- Beacon rotation ---
    if (ref.beacon) {
      ref.beacon.rotation.y = t * 3.0;
      if (ref.beacon.material) {
        ref.beacon.material.emissiveIntensity = 1.5 + Math.sin(t * 8.0) * 1.0;
      }
    }

    // --- Work lights flicker ---
    if (ref.workLightFront && ref.workLightFront.material) {
      ref.workLightFront.material.emissiveIntensity = 1.2 + Math.sin(t * 5.0) * 0.4;
    }
    if (ref.workLightRear && ref.workLightRear.material) {
      ref.workLightRear.material.emissiveIntensity = 1.2 + Math.cos(t * 5.0) * 0.4;
    }

    // --- Dashboard LEDs sequential blink ---
    for (let i = 0; i < 4; i++) {
      const led = ref['led_' + i];
      if (led && led.material) {
        led.material.emissiveIntensity = (Math.sin(t * 3.0 + i * 1.5) > 0.3) ? 2.5 : 0.3;
      }
    }

    // --- Track sprocket rotation (visual) ---
    if (ref.undercarriage) {
      ref.undercarriage.traverse((child) => {
        if (child.name === 'leftSprocket' || child.name === 'rightSprocket') {
          child.rotation.x = t * 1.2;
        }
      });
    }

    // --- Hydraulic cylinder piston rod oscillation ---
    ['boomCylinder', 'stickCylinder', 'bucketCylinder', 'bladeCylinder'].forEach((cylName, idx) => {
      const cyl = ref[cylName];
      if (cyl) {
        cyl.traverse((child) => {
          if (child.name === '__pistonRod') {
            child.position.y = -0.2 + Math.sin(t * 0.6 + idx * 0.8) * 0.04;
          }
        });
      }
    });
  }

  /* ================================================================ */
  /*  DESCRIPTION                                                      */
  /* ================================================================ */

  const description = `Modern Mini Excavator (Kubota KX040-4 Style)

A compact, zero-tail-swing hydraulic excavator designed for urban construction, 
landscaping, and utility work in confined spaces. Features include:

• Rubber crawler tracks with deep-lug tread pattern for low ground pressure
• 360° continuous slewing with zero tail swing – the counterweight stays within 
  the track footprint at all rotation angles
• Compact boom–stick–bucket linkage with independent hydraulic cylinders for 
  precise multi-axis digging
• Fully enclosed ROPS/FOPS operator cabin with tinted safety glass, dual 
  joystick controls, and ergonomic seating
• Rear-mounted dozer blade for backfilling and machine stabilisation
• Complete hydraulic line network with colour-coded hoses and quick-disconnect 
  fittings for attachment versatility
• Diesel engine housed in the counterweighted rear compartment with side-access 
  service panels and integrated cooling

Operating weight: ~4,300 kg | Max digging depth: ~3.5 m | Bucket breakout: ~35 kN`;

  return { group, parts, description, quizQuestions, animate };
}
