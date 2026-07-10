import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── CUSTOM MATERIALS ──────────────────────────────────────────────
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8,
    metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.85
  });
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.7,
    metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.9
  });
  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.6,
    metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.8
  });
  const hotExhaust = new THREE.MeshStandardMaterial({
    color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 1.0,
    metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7
  });
  const bodyYellow = new THREE.MeshStandardMaterial({
    color: 0xf5c518, metalness: 0.25, roughness: 0.45
  });
  const bodyYellowDark = new THREE.MeshStandardMaterial({
    color: 0xc49e10, metalness: 0.3, roughness: 0.5
  });
  const drumChrome = new THREE.MeshStandardMaterial({
    color: 0xcccccc, metalness: 0.95, roughness: 0.05
  });
  const drumSideSteel = new THREE.MeshStandardMaterial({
    color: 0x888888, metalness: 0.85, roughness: 0.15
  });
  const hydraulicRed = new THREE.MeshStandardMaterial({
    color: 0xcc2222, metalness: 0.4, roughness: 0.5
  });
  const seatBlack = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.1, roughness: 0.8
  });
  const waterBlue = new THREE.MeshStandardMaterial({
    color: 0x3388ff, emissive: 0x1144aa, emissiveIntensity: 0.3,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.55
  });
  const warningStripe = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.25,
    metalness: 0.3, roughness: 0.4
  });
  const decalWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 0.1, roughness: 0.6
  });
  const gaugeGlow = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1.2,
    metalness: 0.2, roughness: 0.1
  });
  const plasmaCore = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.5,
    metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.6
  });

  const meshes = {};

  // ═══════════════════════════════════════════════════════════════════
  // 1. FRONT STEEL DRUM ASSEMBLY
  // ═══════════════════════════════════════════════════════════════════
  const drumGroup = new THREE.Group();
  drumGroup.position.set(0, 0.65, 2.2);

  // Main drum cylinder – large smooth compaction drum
  const drumGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.1, 64);
  const drumMesh = new THREE.Mesh(drumGeo, drumChrome);
  drumMesh.rotation.z = Math.PI / 2;
  drumGroup.add(drumMesh);
  meshes.drum = drumMesh;

  // Drum side plates (left & right)
  for (let side = -1; side <= 1; side += 2) {
    const sidePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.67, 0.67, 0.04, 64),
      drumSideSteel
    );
    sidePlate.rotation.z = Math.PI / 2;
    sidePlate.position.x = side * 1.07;
    drumGroup.add(sidePlate);

    // Drum hub ring
    const hubRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.04, 12, 32),
      darkSteel
    );
    hubRing.rotation.y = Math.PI / 2;
    hubRing.position.x = side * 1.09;
    drumGroup.add(hubRing);

    // Hub bolts (8 per side)
    for (let b = 0; b < 8; b++) {
      const ang = (b / 8) * Math.PI * 2;
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.06, 8),
        chrome
      );
      bolt.position.set(
        side * 1.11,
        Math.sin(ang) * 0.18,
        Math.cos(ang) * 0.18
      );
      bolt.rotation.z = Math.PI / 2;
      drumGroup.add(bolt);
    }
  }

  // Drum scraper blade (cleans drum surface)
  const scraperBlade = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.02, 0.12),
    darkSteel
  );
  scraperBlade.position.set(0, -0.63, 0.2);
  drumGroup.add(scraperBlade);
  meshes.scraperBlade = scraperBlade;

  // Scraper blade mount brackets
  for (let sx = -1; sx <= 1; sx += 2) {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.15, 0.08),
      darkSteel
    );
    bracket.position.set(sx * 0.9, -0.56, 0.2);
    drumGroup.add(bracket);
  }

  // Drum surface detail rings (visual surface texture)
  for (let r = 0; r < 6; r++) {
    const ringPos = -0.9 + r * 0.36;
    const surfRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.651, 0.005, 8, 64),
      steel
    );
    surfRing.rotation.y = Math.PI / 2;
    surfRing.position.x = ringPos;
    drumGroup.add(surfRing);
  }

  group.add(drumGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 2. VIBRATION MECHANISM (inside drum, visible through cutaway glow)
  // ═══════════════════════════════════════════════════════════════════
  const vibrationGroup = new THREE.Group();
  vibrationGroup.position.copy(drumGroup.position);

  // Eccentric shaft
  const eccentricShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.8, 16),
    chrome
  );
  eccentricShaft.rotation.z = Math.PI / 2;
  vibrationGroup.add(eccentricShaft);
  meshes.eccentricShaft = eccentricShaft;

  // Eccentric weights (offset masses for vibration)
  for (let w = 0; w < 4; w++) {
    const wPos = -0.6 + w * 0.4;
    const eccWeight = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.18, 0.12),
      neonOrange
    );
    eccWeight.position.set(wPos, 0.12, 0);
    vibrationGroup.add(eccWeight);
  }

  // Vibration motor housing
  const vibMotorHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.3, 24),
    darkSteel
  );
  vibMotorHousing.rotation.z = Math.PI / 2;
  vibMotorHousing.position.set(0, 0, 0);
  vibrationGroup.add(vibMotorHousing);

  // Plasma vibration core (futuristic glow)
  const vibCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 24, 24),
    plasmaCore
  );
  vibrationGroup.add(vibCore);
  meshes.vibCore = vibCore;

  group.add(vibrationGroup);
  meshes.vibrationGroup = vibrationGroup;

  // ═══════════════════════════════════════════════════════════════════
  // 3. FRONT DRUM FRAME / YOKE
  // ═══════════════════════════════════════════════════════════════════
  const drumFrameGroup = new THREE.Group();

  // Side yoke arms
  for (let side = -1; side <= 1; side += 2) {
    // Vertical arm
    const yokeArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.6, 0.12),
      bodyYellow
    );
    yokeArm.position.set(side * 1.0, 0.95, 2.2);
    drumFrameGroup.add(yokeArm);

    // Horizontal top connector
    const yokeTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.8),
      bodyYellow
    );
    yokeTop.position.set(side * 1.0, 1.25, 1.8);
    drumFrameGroup.add(yokeTop);

    // Shock absorber (drum to frame)
    const shockOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12),
      chrome
    );
    shockOuter.position.set(side * 0.85, 1.05, 1.95);
    shockOuter.rotation.x = 0.3;
    drumFrameGroup.add(shockOuter);
    
    const shockInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.2, 12),
      hydraulicRed
    );
    shockInner.position.set(side * 0.85, 1.2, 1.85);
    shockInner.rotation.x = 0.3;
    drumFrameGroup.add(shockInner);
  }

  // Cross-brace between yoke arms
  const yokeCross = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.06, 0.06),
    bodyYellowDark
  );
  yokeCross.position.set(0, 1.25, 1.45);
  drumFrameGroup.add(yokeCross);

  group.add(drumFrameGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 4. ARTICULATED STEERING JOINT
  // ═══════════════════════════════════════════════════════════════════
  const articulationGroup = new THREE.Group();
  articulationGroup.position.set(0, 0.9, 1.1);

  // Central pivot housing
  const pivotHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.5, 24),
    darkSteel
  );
  pivotHousing.position.set(0, 0, 0);
  articulationGroup.add(pivotHousing);

  // Pivot pin
  const pivotPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.65, 16),
    chrome
  );
  articulationGroup.add(pivotPin);
  meshes.pivotPin = pivotPin;

  // Steering hydraulic cylinders (dual)
  for (let side = -1; side <= 1; side += 2) {
    const steerCylOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.6, 12),
      chrome
    );
    steerCylOuter.rotation.z = Math.PI / 2;
    steerCylOuter.position.set(side * 0.45, 0.15, 0);
    articulationGroup.add(steerCylOuter);

    const steerCylRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12),
      hydraulicRed
    );
    steerCylRod.rotation.z = Math.PI / 2;
    steerCylRod.position.set(side * 0.7, 0.15, 0);
    articulationGroup.add(steerCylRod);

    // Clevis mounts
    for (let cm = 0; cm < 2; cm++) {
      const clevis = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.08, 0.1),
        darkSteel
      );
      clevis.position.set(side * (0.2 + cm * 0.65), 0.15, 0);
      articulationGroup.add(clevis);
    }
  }

  // Neon articulation ring
  const artRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.015, 12, 48),
    neonCyan
  );
  articulationGroup.add(artRing);
  meshes.artRing = artRing;

  group.add(articulationGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 5. REAR BODY / ENGINE COMPARTMENT
  // ═══════════════════════════════════════════════════════════════════
  const rearBodyGroup = new THREE.Group();

  // Main rear body (slightly rounded using LatheGeometry profile)
  const bodyProfile = [];
  bodyProfile.push(new THREE.Vector2(0, -0.8));
  bodyProfile.push(new THREE.Vector2(0.85, -0.75));
  bodyProfile.push(new THREE.Vector2(0.95, -0.5));
  bodyProfile.push(new THREE.Vector2(1.0, 0));
  bodyProfile.push(new THREE.Vector2(0.95, 0.5));
  bodyProfile.push(new THREE.Vector2(0.85, 0.75));
  bodyProfile.push(new THREE.Vector2(0, 0.8));

  // Engine hood (box with rounded top approximation)
  const hoodBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.6, 1.8),
    bodyYellow
  );
  hoodBase.position.set(0, 1.3, -0.4);
  rearBodyGroup.add(hoodBase);

  // Hood top panel (slightly curved)
  const hoodTopPts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    hoodTopPts.push(new THREE.Vector3(0, Math.sin(t * Math.PI) * 0.08, -0.9 + t * 1.8));
  }
  const hoodTopCurve = new THREE.CatmullRomCurve3(hoodTopPts);
  const hoodTopGeo = new THREE.TubeGeometry(hoodTopCurve, 20, 0.85, 4, false);
  const hoodTop = new THREE.Mesh(hoodTopGeo, bodyYellow);
  hoodTop.position.set(0, 1.62, -0.4);
  hoodTop.scale.set(1, 0.15, 1);
  rearBodyGroup.add(hoodTop);

  // Engine grilles (side vents)
  for (let side = -1; side <= 1; side += 2) {
    for (let g = 0; g < 5; g++) {
      const grille = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.06, 0.28),
        darkSteel
      );
      grille.position.set(side * 0.86, 1.15 + g * 0.09, -0.4);
      rearBodyGroup.add(grille);
    }

    // Side panel lines
    for (let p = 0; p < 3; p++) {
      const panelLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.005, 0.5, 0.005),
        darkSteel
      );
      panelLine.position.set(side * 0.855, 1.3, -0.8 + p * 0.4);
      rearBodyGroup.add(panelLine);
    }
  }

  // Rear engine cover with louvers
  const rearCover = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 0.04),
    bodyYellowDark
  );
  rearCover.position.set(0, 1.35, -1.32);
  rearBodyGroup.add(rearCover);

  for (let l = 0; l < 6; l++) {
    const louver = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.005, 0.03),
      darkSteel
    );
    louver.position.set(0, 1.12 + l * 0.07, -1.34);
    louver.rotation.x = 0.3;
    rearBodyGroup.add(louver);
  }

  // Counterweight at rear
  const counterweight = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.35, 0.25),
    darkSteel
  );
  counterweight.position.set(0, 0.85, -1.45);
  rearBodyGroup.add(counterweight);

  // Counterweight ribbing detail
  for (let cr = 0; cr < 4; cr++) {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.3, 0.26),
      steel
    );
    rib.position.set(-0.5 + cr * 0.33, 0.85, -1.45);
    rearBodyGroup.add(rib);
  }

  group.add(rearBodyGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 6. REAR CHASSIS / FRAME
  // ═══════════════════════════════════════════════════════════════════
  const chassisGroup = new THREE.Group();

  // Main chassis rails (dual)
  for (let side = -1; side <= 1; side += 2) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.15, 2.8),
      darkSteel
    );
    rail.position.set(side * 0.65, 0.65, -0.2);
    chassisGroup.add(rail);
  }

  // Cross members
  for (let cm = 0; cm < 4; cm++) {
    const crossMem = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 0.08),
      darkSteel
    );
    crossMem.position.set(0, 0.65, 0.6 - cm * 0.6);
    chassisGroup.add(crossMem);
  }

  // Under-body guard plate
  const guardPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.03, 2.4),
    darkSteel
  );
  guardPlate.position.set(0, 0.55, -0.2);
  chassisGroup.add(guardPlate);

  group.add(chassisGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 7. REAR TIRES (REALISTIC with deep tread patterns)
  // ═══════════════════════════════════════════════════════════════════
  function createRealisticTire(radius, tubeRadius, treadCount) {
    const tireGroup = new THREE.Group();

    // Main tire body (torus)
    const tireBody = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tubeRadius, 24, 48),
      rubber
    );
    tireBody.rotation.x = Math.PI / 2;
    tireGroup.add(tireBody);

    // Sidewall rings (inner and outer)
    for (let sr = -1; sr <= 1; sr += 2) {
      const sidewallRing = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tubeRadius * 0.15, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.9 })
      );
      sidewallRing.rotation.x = Math.PI / 2;
      sidewallRing.position.y = sr * tubeRadius * 0.7;
      tireGroup.add(sidewallRing);
    }

    // Deep-carved tread lugs around circumference
    for (let t = 0; t < treadCount; t++) {
      const ang = (t / treadCount) * Math.PI * 2;
      
      // Main center tread lug
      const lug = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, tubeRadius * 0.5, 0.04),
        rubber
      );
      lug.position.set(
        Math.cos(ang) * (radius + tubeRadius * 0.85),
        0,
        Math.sin(ang) * (radius + tubeRadius * 0.85)
      );
      lug.rotation.y = -ang;
      lug.rotation.x = Math.PI / 2;
      tireGroup.add(lug);

      // Shoulder tread lugs (alternating offset)
      if (t % 2 === 0) {
        for (let sh = -1; sh <= 1; sh += 2) {
          const shoulderLug = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, tubeRadius * 0.25, 0.035),
            rubber
          );
          shoulderLug.position.set(
            Math.cos(ang) * (radius + tubeRadius * 0.75),
            sh * tubeRadius * 0.35,
            Math.sin(ang) * (radius + tubeRadius * 0.75)
          );
          shoulderLug.rotation.y = -ang;
          shoulderLug.rotation.x = Math.PI / 2;
          tireGroup.add(shoulderLug);
        }
      }

      // Sipe groove lines (between lugs)
      if (t % 3 === 0) {
        const sipe = new THREE.Mesh(
          new THREE.BoxGeometry(0.01, tubeRadius * 0.6, 0.02),
          new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1.0 })
        );
        sipe.position.set(
          Math.cos(ang + 0.04) * (radius + tubeRadius * 0.9),
          0,
          Math.sin(ang + 0.04) * (radius + tubeRadius * 0.9)
        );
        sipe.rotation.y = -ang;
        sipe.rotation.x = Math.PI / 2;
        tireGroup.add(sipe);
      }
    }

    // Rim (multi-piece)
    const rimOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, tubeRadius * 1.0, 32),
      aluminum
    );
    rimOuter.rotation.x = Math.PI / 2;
    tireGroup.add(rimOuter);

    // Rim center hub
    const rimHub = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, tubeRadius * 1.1, 24),
      chrome
    );
    rimHub.rotation.x = Math.PI / 2;
    tireGroup.add(rimHub);

    // Rim spokes (6 spokes)
    for (let s = 0; s < 6; s++) {
      const spokeAng = (s / 6) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 0.42, 0.035, tubeRadius * 0.6),
        aluminum
      );
      spoke.position.set(
        Math.cos(spokeAng) * radius * 0.4,
        0,
        Math.sin(spokeAng) * radius * 0.4
      );
      spoke.rotation.y = spokeAng;
      spoke.rotation.x = Math.PI / 2;
      tireGroup.add(spoke);
    }

    // Lug nuts on hub (8)
    for (let ln = 0; ln < 8; ln++) {
      const lnAng = (ln / 8) * Math.PI * 2;
      const lugNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, tubeRadius * 1.15, 6),
        chrome
      );
      lugNut.rotation.x = Math.PI / 2;
      lugNut.position.set(
        Math.cos(lnAng) * radius * 0.15,
        0,
        Math.sin(lnAng) * radius * 0.15
      );
      tireGroup.add(lugNut);
    }

    // Hub cap center neon dot
    const hubGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 16, 16),
      neonCyan
    );
    tireGroup.add(hubGlow);

    return tireGroup;
  }

  // Rear tire assemblies (dual tires per side)
  const rearAxleY = 0.38;
  const rearAxleZ = -1.0;
  const tireRadius = 0.32;
  const tireTube = 0.14;

  for (let side = -1; side <= 1; side += 2) {
    // Outer tire
    const outerTire = createRealisticTire(tireRadius, tireTube, 36);
    outerTire.position.set(side * 0.85, rearAxleY, rearAxleZ);
    outerTire.rotation.x = Math.PI / 2;
    group.add(outerTire);
    meshes[side > 0 ? 'rearTireOuterR' : 'rearTireOuterL'] = outerTire;

    // Inner tire (slightly inboard)
    const innerTire = createRealisticTire(tireRadius, tireTube, 36);
    innerTire.position.set(side * 0.55, rearAxleY, rearAxleZ);
    innerTire.rotation.x = Math.PI / 2;
    group.add(innerTire);
    meshes[side > 0 ? 'rearTireInnerR' : 'rearTireInnerL'] = innerTire;
  }

  // Rear axle
  const rearAxle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.9, 16),
    darkSteel
  );
  rearAxle.rotation.z = Math.PI / 2;
  rearAxle.position.set(0, rearAxleY, rearAxleZ);
  group.add(rearAxle);

  // Rear axle differential housing
  const diffHousing = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    darkSteel
  );
  diffHousing.position.set(0, rearAxleY, rearAxleZ);
  diffHousing.scale.set(1, 0.8, 1.2);
  group.add(diffHousing);

  // ═══════════════════════════════════════════════════════════════════
  // 8. FENDERS / MUDGUARDS
  // ═══════════════════════════════════════════════════════════════════
  for (let side = -1; side <= 1; side += 2) {
    // Rear fenders
    const fenderPts = [];
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI;
      fenderPts.push(new THREE.Vector3(
        Math.cos(a) * 0.5,
        Math.sin(a) * 0.5 + rearAxleY,
        rearAxleZ
      ));
    }
    const fenderCurve = new THREE.CatmullRomCurve3(fenderPts);
    const fenderGeo = new THREE.TubeGeometry(fenderCurve, 16, 0.04, 8, false);
    const fender = new THREE.Mesh(fenderGeo, bodyYellow);
    fender.position.x = side * 0.95;
    group.add(fender);

    // Fender panel (flat)
    const fenderPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.45, 0.7),
      bodyYellow
    );
    fenderPanel.position.set(side * 0.97, rearAxleY + 0.25, rearAxleZ);
    group.add(fenderPanel);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 9. ROPS CAB (Roll-Over Protection Structure)
  // ═══════════════════════════════════════════════════════════════════
  const cabGroup = new THREE.Group();
  cabGroup.position.set(0, 1.05, 0.1);

  // Cab floor
  const cabFloor = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.04, 1.2),
    darkSteel
  );
  cabGroup.add(cabFloor);

  // ROPS vertical pillars (4 posts with slight inward taper)
  const pillarPositions = [
    { x: -0.6, z: 0.5 }, { x: 0.6, z: 0.5 },
    { x: -0.55, z: -0.5 }, { x: 0.55, z: -0.5 }
  ];
  pillarPositions.forEach((pp, idx) => {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.15, 0.06),
      bodyYellow
    );
    pillar.position.set(pp.x, 0.58, pp.z);
    cabGroup.add(pillar);

    // Pillar neon accent strips
    const neonStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 1.1, 0.01),
      neonCyan
    );
    neonStrip.position.set(pp.x + 0.035, 0.58, pp.z + 0.035);
    cabGroup.add(neonStrip);
  });

  // ROPS top frame (roof rails)
  const roofRails = [
    { from: [-0.6, 1.15, 0.5], to: [0.6, 1.15, 0.5] },
    { from: [-0.55, 1.15, -0.5], to: [0.55, 1.15, -0.5] },
    { from: [-0.6, 1.15, 0.5], to: [-0.55, 1.15, -0.5] },
    { from: [0.6, 1.15, 0.5], to: [0.55, 1.15, -0.5] }
  ];
  roofRails.forEach(rail => {
    const dx = rail.to[0] - rail.from[0];
    const dz = rail.to[2] - rail.from[2];
    const len = Math.sqrt(dx * dx + dz * dz);
    const railMesh = new THREE.Mesh(
      new THREE.BoxGeometry(len + 0.06, 0.06, 0.06),
      bodyYellow
    );
    railMesh.position.set(
      (rail.from[0] + rail.to[0]) / 2,
      rail.from[1],
      (rail.from[2] + rail.to[2]) / 2
    );
    railMesh.rotation.y = Math.atan2(dz, dx);
    cabGroup.add(railMesh);
  });

  // Roof panel
  const roofPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.03, 1.1),
    bodyYellow
  );
  roofPanel.position.set(0, 1.19, 0);
  cabGroup.add(roofPanel);

  // Tinted glass panels (front, sides, rear)
  // Front windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 0.75, 0.02),
    tinted
  );
  windshield.position.set(0, 0.6, 0.51);
  cabGroup.add(windshield);

  // Side windows
  for (let side = -1; side <= 1; side += 2) {
    const sideWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.65, 0.85),
      tinted
    );
    sideWindow.position.set(side * 0.58, 0.6, 0);
    cabGroup.add(sideWindow);
  }

  // Rear window
  const rearWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 0.6, 0.02),
    tinted
  );
  rearWindow.position.set(0, 0.65, -0.51);
  cabGroup.add(rearWindow);

  // ─── Operator seat ───
  const seatBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.08, 0.4),
    seatBlack
  );
  seatBase.position.set(0, 0.12, -0.1);
  cabGroup.add(seatBase);

  const seatBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.45, 0.06),
    seatBlack
  );
  seatBack.position.set(0, 0.36, -0.28);
  seatBack.rotation.x = 0.1;
  cabGroup.add(seatBack);

  // Seat armrests
  for (let side = -1; side <= 1; side += 2) {
    const armrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.3),
      seatBlack
    );
    armrest.position.set(side * 0.22, 0.25, -0.1);
    cabGroup.add(armrest);

    const armPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8),
      darkSteel
    );
    armPost.position.set(side * 0.22, 0.18, 0.0);
    cabGroup.add(armPost);
  }

  // ─── Steering column & wheel ───
  const steerColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12),
    darkSteel
  );
  steerColumn.position.set(0, 0.35, 0.25);
  steerColumn.rotation.x = -0.5;
  cabGroup.add(steerColumn);

  const steeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.015, 12, 32),
    seatBlack
  );
  steeringWheel.position.set(0, 0.55, 0.35);
  steeringWheel.rotation.x = -0.5;
  cabGroup.add(steeringWheel);
  meshes.steeringWheel = steeringWheel;

  // Steering wheel spokes
  for (let sp = 0; sp < 3; sp++) {
    const spAng = (sp / 3) * Math.PI * 2;
    const spokeW = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.11, 6),
      darkSteel
    );
    spokeW.position.set(
      Math.cos(spAng) * 0.055,
      0.55 + Math.sin(spAng) * 0.055 * Math.cos(0.5),
      0.35 + Math.sin(spAng) * 0.055 * Math.sin(0.5)
    );
    spokeW.rotation.x = -0.5;
    spokeW.rotation.z = spAng;
    cabGroup.add(spokeW);
  }

  // ─── Dashboard / instrument panel ───
  const dashboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.25, 0.08),
    seatBlack
  );
  dashboard.position.set(0, 0.25, 0.45);
  cabGroup.add(dashboard);

  // Gauge cluster (glowing instruments)
  for (let ga = 0; ga < 4; ga++) {
    const gauge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.01, 16),
      gaugeGlow
    );
    gauge.position.set(-0.25 + ga * 0.16, 0.32, 0.47);
    gauge.rotation.x = Math.PI / 2;
    cabGroup.add(gauge);
    if (ga === 0) meshes.gauge0 = gauge;
  }

  // Joystick controls (left and right)
  for (let side = -1; side <= 1; side += 2) {
    const joyBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 0.04, 12),
      darkSteel
    );
    joyBase.position.set(side * 0.35, 0.12, 0.15);
    cabGroup.add(joyBase);

    const joyStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.015, 0.12, 8),
      chrome
    );
    joyStick.position.set(side * 0.35, 0.2, 0.15);
    cabGroup.add(joyStick);

    const joyKnob = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 10, 10),
      neonOrange
    );
    joyKnob.position.set(side * 0.35, 0.27, 0.15);
    cabGroup.add(joyKnob);
  }

  // Steps / ladder (entry)
  for (let st = 0; st < 2; st++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.025, 0.12),
      darkSteel
    );
    step.position.set(-0.65, -0.15 + st * 0.2, 0.1);
    cabGroup.add(step);

    // Step anti-slip pattern (small nubs)
    for (let nub = 0; nub < 5; nub++) {
      const n = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 6, 6),
        rubber
      );
      n.position.set(-0.6 + nub * 0.06, -0.13 + st * 0.2, 0.1);
      cabGroup.add(n);
    }
  }

  // Grab handle
  const handlePts = [
    new THREE.Vector3(-0.62, 0.0, 0.5),
    new THREE.Vector3(-0.66, 0.4, 0.52),
    new THREE.Vector3(-0.62, 0.8, 0.5)
  ];
  const handleCurve = new THREE.CatmullRomCurve3(handlePts);
  const handleGeo = new THREE.TubeGeometry(handleCurve, 12, 0.015, 8, false);
  const grabHandle = new THREE.Mesh(handleGeo, chrome);
  cabGroup.add(grabHandle);

  group.add(cabGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 10. WATER SPRAY SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  const waterGroup = new THREE.Group();

  // Water tank (mounted rear-top)
  const waterTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.9, 24),
    waterBlue
  );
  waterTank.rotation.z = Math.PI / 2;
  waterTank.position.set(0, 1.85, -0.6);
  waterGroup.add(waterTank);
  meshes.waterTank = waterTank;

  // Tank end caps
  for (let tc = -1; tc <= 1; tc += 2) {
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      waterBlue
    );
    cap.rotation.z = tc > 0 ? Math.PI / 2 : -Math.PI / 2;
    cap.position.set(tc * 0.45, 1.85, -0.6);
    waterGroup.add(cap);
  }

  // Tank mounting straps
  for (let ms = -1; ms <= 1; ms += 2) {
    const strap = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.015, 8, 24, Math.PI),
      darkSteel
    );
    strap.position.set(ms * 0.25, 1.85, -0.6);
    strap.rotation.y = Math.PI / 2;
    strap.rotation.x = Math.PI;
    waterGroup.add(strap);
  }

  // Water fill cap
  const fillCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12),
    chrome
  );
  fillCap.position.set(0, 2.13, -0.6);
  waterGroup.add(fillCap);

  // Water supply lines (from tank to drum spray bar)
  const waterLinePts = [
    new THREE.Vector3(0, 1.57, -0.6),
    new THREE.Vector3(0, 1.4, 0.0),
    new THREE.Vector3(0, 1.2, 0.8),
    new THREE.Vector3(0, 1.0, 1.6),
    new THREE.Vector3(0, 0.7, 2.1)
  ];
  const waterLineCurve = new THREE.CatmullRomCurve3(waterLinePts);
  const waterLineGeo = new THREE.TubeGeometry(waterLineCurve, 24, 0.02, 8, false);
  const waterLine = new THREE.Mesh(waterLineGeo, copper);
  waterGroup.add(waterLine);

  // Spray bar (at front of drum)
  const sprayBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.8, 12),
    copper
  );
  sprayBar.rotation.z = Math.PI / 2;
  sprayBar.position.set(0, 0.9, 2.65);
  waterGroup.add(sprayBar);

  // Spray nozzles
  for (let nz = 0; nz < 8; nz++) {
    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.015, 0.04, 8),
      chrome
    );
    nozzle.position.set(-0.7 + nz * 0.2, 0.87, 2.65);
    nozzle.rotation.x = Math.PI;
    waterGroup.add(nozzle);
    if (nz === 0) meshes.nozzle0 = nozzle;
  }
  meshes.sprayBar = sprayBar;

  // Water pump (small box near tank)
  const waterPump = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.12, 0.12),
    darkSteel
  );
  waterPump.position.set(0.4, 1.65, -0.3);
  waterGroup.add(waterPump);

  // Pump neon indicator
  const pumpGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 12, 12),
    neonGreen
  );
  pumpGlow.position.set(0.4, 1.72, -0.25);
  waterGroup.add(pumpGlow);
  meshes.pumpGlow = pumpGlow;

  group.add(waterGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 11. EXHAUST SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  const exhaustGroup = new THREE.Group();

  // Exhaust pipe (vertical stack)
  const exhaustPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16),
    darkSteel
  );
  exhaustPipe.position.set(0.7, 1.8, -0.8);
  exhaustGroup.add(exhaustPipe);

  // Exhaust rain cap
  const exhaustCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16),
    darkSteel
  );
  exhaustCap.position.set(0.7, 2.21, -0.8);
  exhaustGroup.add(exhaustCap);

  // Exhaust heat shield
  const heatShield = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.3, 16, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide })
  );
  heatShield.position.set(0.7, 1.6, -0.8);
  exhaustGroup.add(heatShield);

  // Exhaust glow tip
  const exhaustTip = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.01, 8, 16),
    hotExhaust
  );
  exhaustTip.position.set(0.7, 2.2, -0.8);
  exhaustGroup.add(exhaustTip);
  meshes.exhaustTip = exhaustTip;

  group.add(exhaustGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 12. LIGHTS & SAFETY
  // ═══════════════════════════════════════════════════════════════════
  const lightsGroup = new THREE.Group();

  // Front work lights (on cab roof)
  for (let fl = -1; fl <= 1; fl += 2) {
    const lightHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.06, 0.06),
      darkSteel
    );
    lightHousing.position.set(fl * 0.45, 2.28, 0.65);
    lightsGroup.add(lightHousing);

    const lightLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xffffcc, emissive: 0xffff88, emissiveIntensity: 1.0,
        transparent: true, opacity: 0.9
      })
    );
    lightLens.position.set(fl * 0.45, 2.28, 0.69);
    lightLens.rotation.x = -Math.PI / 2;
    lightsGroup.add(lightLens);
    if (fl < 0) meshes.frontLightL = lightLens;
    else meshes.frontLightR = lightLens;
  }

  // Rear tail lights
  for (let rl = -1; rl <= 1; rl += 2) {
    const tailLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.06, 0.03),
      new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.9
      })
    );
    tailLight.position.set(rl * 0.7, 1.1, -1.5);
    lightsGroup.add(tailLight);
  }

  // Amber rotating beacon (on cab roof center)
  const beaconBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.03, 16),
    darkSteel
  );
  beaconBase.position.set(0, 2.25, 0);
  lightsGroup.add(beaconBase);

  const beaconLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16),
    neonOrange
  );
  beaconLens.position.set(0, 2.31, 0);
  lightsGroup.add(beaconLens);
  meshes.beacon = beaconLens;

  // Warning stripes (rear)
  for (let ws = 0; ws < 3; ws++) {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.04, 0.02),
      warningStripe
    );
    stripe.position.set(-0.3 + ws * 0.3, 0.95, -1.47);
    stripe.rotation.z = 0.4;
    lightsGroup.add(stripe);
  }

  // Side reflectors
  for (let side = -1; side <= 1; side += 2) {
    const reflector = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.04, 0.04),
      neonOrange
    );
    reflector.position.set(side * 0.88, 1.0, 0.3);
    lightsGroup.add(reflector);
  }

  group.add(lightsGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 13. HYDRAULIC LINES & HOSES (visible routing)
  // ═══════════════════════════════════════════════════════════════════
  const hydraulicGroup = new THREE.Group();

  // Main hydraulic supply lines
  const hydLine1Pts = [
    new THREE.Vector3(-0.5, 1.0, -0.8),
    new THREE.Vector3(-0.55, 1.0, 0.0),
    new THREE.Vector3(-0.5, 0.95, 0.8),
    new THREE.Vector3(-0.4, 0.9, 1.3)
  ];
  const hydCurve1 = new THREE.CatmullRomCurve3(hydLine1Pts);
  const hydLineGeo1 = new THREE.TubeGeometry(hydCurve1, 20, 0.015, 8, false);
  const hydLine1 = new THREE.Mesh(hydLineGeo1, hydraulicRed);
  hydraulicGroup.add(hydLine1);

  const hydLine2Pts = [
    new THREE.Vector3(0.5, 1.0, -0.8),
    new THREE.Vector3(0.55, 1.0, 0.0),
    new THREE.Vector3(0.5, 0.95, 0.8),
    new THREE.Vector3(0.4, 0.9, 1.3)
  ];
  const hydCurve2 = new THREE.CatmullRomCurve3(hydLine2Pts);
  const hydLineGeo2 = new THREE.TubeGeometry(hydCurve2, 20, 0.015, 8, false);
  const hydLine2 = new THREE.Mesh(hydLineGeo2, hydraulicRed);
  hydraulicGroup.add(hydLine2);

  // Return line (bottom)
  const retLinePts = [
    new THREE.Vector3(0, 0.6, -1.0),
    new THREE.Vector3(0, 0.58, 0.2),
    new THREE.Vector3(0, 0.6, 1.2)
  ];
  const retCurve = new THREE.CatmullRomCurve3(retLinePts);
  const retLineGeo = new THREE.TubeGeometry(retCurve, 16, 0.012, 8, false);
  const retLine = new THREE.Mesh(retLineGeo, copper);
  hydraulicGroup.add(retLine);

  // Hydraulic fittings at connections
  const fittingPositions = [
    [-0.4, 0.9, 1.3], [0.4, 0.9, 1.3],
    [-0.5, 1.0, -0.8], [0.5, 1.0, -0.8]
  ];
  fittingPositions.forEach(fp => {
    const fitting = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.018, 0.04, 8),
      chrome
    );
    fitting.position.set(fp[0], fp[1], fp[2]);
    hydraulicGroup.add(fitting);
  });

  group.add(hydraulicGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 14. MIRRORS
  // ═══════════════════════════════════════════════════════════════════
  for (let side = -1; side <= 1; side += 2) {
    // Mirror arm
    const mirrorArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.25, 8),
      darkSteel
    );
    mirrorArm.position.set(side * 0.75, 1.75, 0.55);
    mirrorArm.rotation.z = side * 0.5;
    group.add(mirrorArm);

    // Mirror glass
    const mirrorGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.01),
      new THREE.MeshStandardMaterial({
        color: 0x88aacc, metalness: 0.95, roughness: 0.05
      })
    );
    mirrorGlass.position.set(side * 0.88, 1.8, 0.55);
    group.add(mirrorGlass);

    // Mirror housing
    const mirrorHouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.1, 0.03),
      bodyYellow
    );
    mirrorHouse.position.set(side * 0.88, 1.8, 0.535);
    group.add(mirrorHouse);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 15. RIVETS & PANEL DETAILS
  // ═══════════════════════════════════════════════════════════════════
  // Rivet rows along hood
  for (let rr = 0; rr < 8; rr++) {
    for (let side = -1; side <= 1; side += 2) {
      const rivet = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 6, 6),
        chrome
      );
      rivet.position.set(side * 0.84, 1.62, 0.2 - rr * 0.2);
      group.add(rivet);
    }
  }

  // Panel split lines on hood
  for (let pl = 0; pl < 2; pl++) {
    const splitLine = new THREE.Mesh(
      new THREE.BoxGeometry(1.68, 0.005, 0.005),
      darkSteel
    );
    splitLine.position.set(0, 1.61, 0.25 - pl * 0.65);
    group.add(splitLine);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 16. FUTURISTIC TECH ACCENTS
  // ═══════════════════════════════════════════════════════════════════

  // Neon undercarriage glow strips
  for (let ug = 0; ug < 3; ug++) {
    const glowStrip = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.01, 0.02),
      neonCyan
    );
    glowStrip.position.set(0, 0.53, 0.5 - ug * 0.5);
    group.add(glowStrip);
  }

  // Energy conduit rings around drum
  for (let ecr = 0; ecr < 3; ecr++) {
    const energyRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.008, 8, 48),
      neonGreen
    );
    energyRing.rotation.y = Math.PI / 2;
    energyRing.position.set(-0.6 + ecr * 0.6, drumGroup.position.y, drumGroup.position.z);
    group.add(energyRing);
    if (ecr === 1) meshes.energyRingCenter = energyRing;
  }

  // Data port panel (side of cab)
  const dataPort = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.12, 0.08),
    darkSteel
  );
  dataPort.position.set(0.68, 1.35, 0.2);
  group.add(dataPort);

  for (let dp = 0; dp < 3; dp++) {
    const portLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 8, 8),
      dp === 0 ? neonGreen : dp === 1 ? neonCyan : neonOrange
    );
    portLight.position.set(0.7, 1.31 + dp * 0.04, 0.2);
    group.add(portLight);
  }

  // ═══════════════════════════════════════════════════════════════════
  // PARTS ARRAY
  // ═══════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Vibratory Steel Drum',
      description: 'Large smooth steel compaction drum at the front, used to compact soil, asphalt, and aggregate materials through static weight and vibration.',
      material: 'Hardened Chrome-Plated Steel',
      function: 'Delivers compaction force to surface materials; vibration mode increases effective compaction depth significantly.',
      assemblyOrder: 1,
      connections: ['Drum Yoke Frame', 'Vibration Mechanism', 'Scraper Blade Assembly'],
      failureEffect: 'Loss of compaction ability; surface remains unconsolidated, causing premature pavement failure.',
      cascadeFailures: ['Vibration Mechanism', 'Water Spray System'],
      originalPosition: { x: 0, y: 0.65, z: 2.2 },
      explodedPosition: { x: 0, y: 1.5, z: 4.5 }
    },
    {
      name: 'Vibration Mechanism',
      description: 'Eccentric-weight vibration system housed inside the drum, driven by a dedicated hydraulic motor. Generates controlled vibration frequencies.',
      material: 'Forged Steel Eccentric Weights, Hardened Shaft',
      function: 'Creates rapid oscillating force (25-45 Hz) to increase compaction energy beyond static weight alone.',
      assemblyOrder: 2,
      connections: ['Vibratory Steel Drum', 'Hydraulic System'],
      failureEffect: 'Drum operates in static mode only, reducing compaction depth by 50-70%.',
      cascadeFailures: ['Vibratory Steel Drum'],
      originalPosition: { x: 0, y: 0.65, z: 2.2 },
      explodedPosition: { x: 0, y: 2.5, z: 4.5 }
    },
    {
      name: 'Articulated Steering Joint',
      description: 'Central pivot mechanism allowing front drum frame and rear body to articulate independently for tight-radius turns.',
      material: 'High-Strength Cast Steel, Hardened Pivot Pin',
      function: 'Enables the roller to steer by angling the front and rear sections relative to each other, allowing nimble maneuvering.',
      assemblyOrder: 3,
      connections: ['Drum Yoke Frame', 'Rear Chassis', 'Steering Hydraulic Cylinders'],
      failureEffect: 'Loss of steering control; machine cannot turn and must be towed for service.',
      cascadeFailures: ['Steering Hydraulic Cylinders', 'Drum Yoke Frame'],
      originalPosition: { x: 0, y: 0.9, z: 1.1 },
      explodedPosition: { x: 0, y: 2.0, z: 1.1 }
    },
    {
      name: 'ROPS Operator Cab',
      description: 'Enclosed Roll-Over Protective Structure cab with tinted glass, ergonomic seat, full instrument panel, and climate controls.',
      material: 'Reinforced Steel Frame, Laminated Safety Glass',
      function: 'Protects operator from rollover hazards, weather, noise, and vibration while providing full visibility and machine controls.',
      assemblyOrder: 5,
      connections: ['Rear Chassis', 'Steering System', 'Instrument Panel'],
      failureEffect: 'Operator safety severely compromised; machine may not meet OSHA requirements for operation.',
      cascadeFailures: ['Instrument Panel'],
      originalPosition: { x: 0, y: 1.05, z: 0.1 },
      explodedPosition: { x: 0, y: 3.0, z: 0.1 }
    },
    {
      name: 'Water Spray System',
      description: 'Pressurized water spray system with tank, pump, supply lines, and spray bar with nozzles positioned at drum leading edge.',
      material: 'Polyethylene Tank, Copper Supply Lines, Brass Nozzles',
      function: 'Sprays water on drum surface to prevent asphalt from sticking during hot-mix compaction operations.',
      assemblyOrder: 6,
      connections: ['Vibratory Steel Drum', 'Spray Bar', 'Water Pump', 'Electrical System'],
      failureEffect: 'Asphalt adheres to drum surface causing surface tearing, poor finish quality, and drum damage.',
      cascadeFailures: ['Vibratory Steel Drum'],
      originalPosition: { x: 0, y: 1.85, z: -0.6 },
      explodedPosition: { x: 2.0, y: 3.0, z: -0.6 }
    },
    {
      name: 'Rear Dual-Tire Assembly',
      description: 'Heavy-duty dual rubber tire set on each side of the rear axle providing traction, additional compaction, and machine mobility.',
      material: 'Reinforced Rubber Compound, Steel-Belted, Alloy Rims',
      function: 'Provides propulsion traction and secondary compaction behind the drum, with dual configuration for load distribution.',
      assemblyOrder: 4,
      connections: ['Rear Axle', 'Differential', 'Hydraulic Drive Motor'],
      failureEffect: 'Loss of traction; machine cannot propel itself. Uneven tire wear causes compaction inconsistencies.',
      cascadeFailures: ['Rear Axle', 'Differential'],
      originalPosition: { x: 0.85, y: 0.38, z: -1.0 },
      explodedPosition: { x: 2.5, y: 0.38, z: -1.0 }
    },
    {
      name: 'Hydraulic System Network',
      description: 'Complete hydraulic circuit including pump, valves, cylinders, hoses, and fittings powering steering, vibration, and propulsion.',
      material: 'Steel Tubing, Reinforced Rubber Hoses, Brass Fittings',
      function: 'Transmits hydraulic power from engine-driven pump to all actuators for steering, vibration drive, and wheel propulsion.',
      assemblyOrder: 7,
      connections: ['Engine', 'Steering Cylinders', 'Vibration Motor', 'Drive Motors'],
      failureEffect: 'Complete loss of machine function; no steering, vibration, or propulsion capability.',
      cascadeFailures: ['Vibration Mechanism', 'Articulated Steering Joint', 'Rear Dual-Tire Assembly'],
      originalPosition: { x: -0.5, y: 1.0, z: 0 },
      explodedPosition: { x: -2.5, y: 1.0, z: 0 }
    },
    {
      name: 'Exhaust System',
      description: 'Vertical exhaust stack with heat shield, rain cap, and muffler. Routes engine exhaust gases safely above operator level.',
      material: 'Aluminized Steel, High-Temperature Gaskets',
      function: 'Directs combustion exhaust away from operator and ground, reduces noise, and contains spark arrestor for fire prevention.',
      assemblyOrder: 8,
      connections: ['Engine', 'Engine Compartment'],
      failureEffect: 'Exhaust fumes enter cab area; noise levels exceed safety limits; fire risk near combustible materials.',
      cascadeFailures: ['ROPS Operator Cab'],
      originalPosition: { x: 0.7, y: 1.8, z: -0.8 },
      explodedPosition: { x: 2.5, y: 3.5, z: -0.8 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary purpose of the vibratory mechanism inside the road roller drum?',
      options: [
        'To shake loose debris off the drum surface',
        'To increase compaction depth and density beyond static weight alone',
        'To keep the operator alert through vibration feedback',
        'To cool the drum during asphalt compaction'
      ],
      correct: 1,
      explanation: 'The eccentric-weight vibration mechanism generates rapid oscillations (25-45 Hz) that dramatically increase the effective compaction force, allowing the roller to compact materials to greater depth and higher density than static weight alone could achieve.',
      difficulty: 'medium'
    },
    {
      question: 'Why does the road roller water spray system wet the drum surface during asphalt compaction?',
      options: [
        'To cool the asphalt so it sets faster',
        'To lubricate the drum bearings',
        'To prevent hot asphalt from sticking to the drum surface',
        'To add moisture content to the base material'
      ],
      correct: 2,
      explanation: 'During hot-mix asphalt compaction, the drum surface temperature rises and bitumen becomes extremely sticky. The water spray creates a thin film that prevents asphalt adhesion, which would otherwise tear the surface, create pick-up marks, and damage the drum finish.',
      difficulty: 'easy'
    },
    {
      question: 'What advantage does an articulated steering joint provide over conventional front-axle steering in a road roller?',
      options: [
        'It allows the machine to compact in a straight line only',
        'It enables tighter turning radius by pivoting the entire front section relative to the rear',
        'It reduces the overall weight of the machine',
        'It increases the top speed of the roller'
      ],
      correct: 1,
      explanation: 'Articulated steering allows the entire front drum frame to pivot relative to the rear body, providing a significantly tighter turning radius than conventional steering. This is critical for compacting in confined spaces, around curves, and near edges where precise maneuvering is required.',
      difficulty: 'medium'
    },
    {
      question: 'What does ROPS stand for, and why is it critical on a road roller?',
      options: [
        'Rotational Output Power System — manages engine power delivery',
        'Roll-Over Protective Structure — shields operator during tip-over events',
        'Rear Operational Positioning Sensor — assists with reverse maneuvering',
        'Rapid Oscillation Pressure Switch — controls vibration frequency'
      ],
      correct: 1,
      explanation: 'ROPS (Roll-Over Protective Structure) is a reinforced structural frame designed to create a protective zone around the operator in the event of a machine rollover. It is an OSHA-mandated safety feature on heavy equipment and is engineered to absorb and deflect crushing forces.',
      difficulty: 'easy'
    },
    {
      question: 'In a vibratory road roller, what determines the compaction frequency and amplitude?',
      options: [
        'The diameter of the rear tires',
        'The weight and rotational speed of the eccentric masses on the vibration shaft',
        'The volume of water in the spray system tank',
        'The thickness of the drum wall'
      ],
      correct: 1,
      explanation: 'Vibration frequency is determined by the rotational speed of the eccentric shaft, while amplitude is controlled by the mass and offset distance of the eccentric weights. Operators can typically adjust both parameters to match material type and lift thickness requirements.',
      difficulty: 'hard'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════
  const description = `A modern vibratory road roller (also called a compactor) is a critical piece of construction equipment used to compress soil, gravel, asphalt, and concrete during road building, earthwork, and paving operations. This model features a large smooth steel vibratory drum at the front that delivers both static weight and dynamic vibratory compaction force. The rear section rides on dual rubber tires for traction and secondary compaction. An articulated steering joint at the center allows the front drum frame and rear body to pivot independently, enabling tight-radius maneuvering on job sites. The enclosed ROPS (Roll-Over Protective Structure) cab protects the operator with reinforced pillars and tinted safety glass, while providing ergonomic controls, climate control, and excellent all-around visibility. A water spray system with onboard tank, pump, and spray bar wets the drum surface to prevent asphalt pickup during hot-mix compaction. The hydraulic system powers steering, vibration, and propulsion through a network of high-pressure lines and precision actuators.`;

  // ═══════════════════════════════════════════════════════════════════
  // ANIMATE FUNCTION
  // ═══════════════════════════════════════════════════════════════════
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // 1. Drum rotation (rolling forward)
    if (refMeshes.drum) {
      refMeshes.drum.rotation.x += 0.025 * speed;
    }

    // 2. Vibration mechanism — eccentric shaft spins fast
    if (refMeshes.eccentricShaft) {
      refMeshes.eccentricShaft.rotation.x += 0.15 * speed;
    }

    // 3. Vibration core plasma pulse
    if (refMeshes.vibCore) {
      const pulseScale = 1.0 + Math.sin(t * 12) * 0.3;
      refMeshes.vibCore.scale.set(pulseScale, pulseScale, pulseScale);
      refMeshes.vibCore.material.emissiveIntensity = 1.0 + Math.sin(t * 15) * 0.5;
    }

    // 4. Drum vibration effect (slight Y oscillation)
    if (refMeshes.vibrationGroup) {
      refMeshes.vibrationGroup.position.y = 0.65 + Math.sin(t * 30) * 0.003;
    }

    // 5. Rear tires rotation
    ['rearTireOuterR', 'rearTireOuterL', 'rearTireInnerR', 'rearTireInnerL'].forEach(key => {
      if (refMeshes[key]) {
        refMeshes[key].rotation.z += 0.02 * speed;
      }
    });

    // 6. Steering wheel gentle oscillation
    if (refMeshes.steeringWheel) {
      refMeshes.steeringWheel.rotation.z = Math.sin(t * 0.8) * 0.2;
    }

    // 7. Beacon rotation (amber warning light)
    if (refMeshes.beacon) {
      refMeshes.beacon.rotation.y += 0.08 * speed;
      refMeshes.beacon.material.emissiveIntensity = 0.5 + Math.sin(t * 6) * 0.5;
    }

    // 8. Articulation ring pulse
    if (refMeshes.artRing) {
      refMeshes.artRing.material.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.4;
    }

    // 9. Exhaust tip glow pulse (engine running)
    if (refMeshes.exhaustTip) {
      refMeshes.exhaustTip.material.emissiveIntensity = 0.6 + Math.sin(t * 5) * 0.4;
      refMeshes.exhaustTip.material.opacity = 0.5 + Math.sin(t * 7) * 0.2;
    }

    // 10. Water pump indicator blink
    if (refMeshes.pumpGlow) {
      refMeshes.pumpGlow.material.emissiveIntensity = Math.sin(t * 4) > 0 ? 1.0 : 0.2;
    }

    // 11. Water tank subtle transparency shift (simulating liquid sloshing)
    if (refMeshes.waterTank) {
      refMeshes.waterTank.material.opacity = 0.45 + Math.sin(t * 1.5) * 0.1;
    }

    // 12. Front light intensity pulse
    if (refMeshes.frontLightL) {
      refMeshes.frontLightL.material.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.2;
    }
    if (refMeshes.frontLightR) {
      refMeshes.frontLightR.material.emissiveIntensity = 0.8 + Math.cos(t * 2) * 0.2;
    }

    // 13. Energy rings around drum rotation
    if (refMeshes.energyRingCenter) {
      refMeshes.energyRingCenter.rotation.x += 0.02 * speed;
      refMeshes.energyRingCenter.material.emissiveIntensity = 0.3 + Math.sin(t * 4) * 0.3;
    }

    // 14. Gauge cluster flicker
    if (refMeshes.gauge0) {
      refMeshes.gauge0.material.emissiveIntensity = 0.8 + Math.sin(t * 8) * 0.4;
    }

    // 15. Scraper blade micro-vibration (from drum contact)
    if (refMeshes.scraperBlade) {
      refMeshes.scraperBlade.position.y = -0.63 + Math.sin(t * 25) * 0.001;
    }

    // 16. Pivot pin subtle rotation
    if (refMeshes.pivotPin) {
      refMeshes.pivotPin.rotation.y = Math.sin(t * 0.5) * 0.05;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
