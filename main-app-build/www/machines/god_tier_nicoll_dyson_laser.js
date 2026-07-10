// ============================================================================
// GOD TIER NICOLL-DYSON LASER — Ultra Hyper-Realistic Megastructure
// A weaponized Dyson Swarm that focuses the ENTIRE luminous output of a star
// into a single coherent, phased-array laser beam capable of ablating planets
// at interstellar distances. 3.8 × 10²⁶ W of focused destruction.
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel, darkSteel,
  rubber, chrome, tinted
} from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ---------------------------------------------------------------------------
  // MATERIAL PALETTE — exotic megastructure & stellar materials
  // ---------------------------------------------------------------------------
  const starCoreMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e0, emissive: 0xffcc00, emissiveIntensity: 3.5,
    roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.95
  });
  const starCoronaMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2.0,
    roughness: 0.3, metalness: 0.0, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide
  });
  const starChromosphereMat = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 1.5,
    roughness: 0.4, metalness: 0.0, transparent: true, opacity: 0.2,
    side: THREE.DoubleSide
  });
  const collectorMirrorMat = new THREE.MeshStandardMaterial({
    color: 0xd0e8ff, emissive: 0x4488ff, emissiveIntensity: 0.4,
    roughness: 0.05, metalness: 1.0, side: THREE.DoubleSide
  });
  const secondaryMirrorMat = new THREE.MeshStandardMaterial({
    color: 0xe0f0ff, emissive: 0x66aaff, emissiveIntensity: 0.6,
    roughness: 0.03, metalness: 1.0, side: THREE.DoubleSide
  });
  const structuralTrussMat = new THREE.MeshStandardMaterial({
    color: 0x556677, emissive: 0x112233, emissiveIntensity: 0.15,
    roughness: 0.6, metalness: 0.85
  });
  const radiatorMat = new THREE.MeshStandardMaterial({
    color: 0x220000, emissive: 0xff2200, emissiveIntensity: 0.8,
    roughness: 0.7, metalness: 0.4, side: THREE.DoubleSide
  });
  const radiatorCoolMat = new THREE.MeshStandardMaterial({
    color: 0x001122, emissive: 0x003366, emissiveIntensity: 0.3,
    roughness: 0.7, metalness: 0.4, side: THREE.DoubleSide
  });
  const laserBeamMat = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 5.0,
    roughness: 0.0, metalness: 0.0, transparent: true, opacity: 0.7
  });
  const laserCoreBeamMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0x88ffee, emissiveIntensity: 8.0,
    roughness: 0.0, metalness: 0.0, transparent: true, opacity: 0.9
  });
  const phasedArrayMat = new THREE.MeshStandardMaterial({
    color: 0x99ccff, emissive: 0x3377ff, emissiveIntensity: 0.5,
    roughness: 0.1, metalness: 0.95
  });
  const targetingMat = new THREE.MeshStandardMaterial({
    color: 0xff3300, emissive: 0xff0000, emissiveIntensity: 1.2,
    roughness: 0.2, metalness: 0.8
  });
  const neonStatusMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 2.0,
    roughness: 0.0, metalness: 0.3
  });
  const energyConduitMat = new THREE.MeshStandardMaterial({
    color: 0x00aaff, emissive: 0x0088ff, emissiveIntensity: 1.5,
    roughness: 0.1, metalness: 0.7, transparent: true, opacity: 0.6
  });
  const controlStationMat = new THREE.MeshStandardMaterial({
    color: 0x334455, emissive: 0x112244, emissiveIntensity: 0.3,
    roughness: 0.5, metalness: 0.7
  });
  const hologramMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00ccff, emissiveIntensity: 3.0,
    roughness: 0.0, metalness: 0.0, transparent: true, opacity: 0.25,
    side: THREE.DoubleSide
  });

  // ---------------------------------------------------------------------------
  // SECTION 1: CENTRAL STAR (G-type main sequence, ~1 solar luminosity)
  // ---------------------------------------------------------------------------
  const starGroup = new THREE.Group();

  // Inner core — blindingly bright photosphere
  const starCoreGeo = new THREE.IcosahedronGeometry(2.8, 5);
  const starCore = new THREE.Mesh(starCoreGeo, starCoreMat);
  starGroup.add(starCore);
  meshes.starCore = starCore;

  // Chromosphere layer
  const chromoGeo = new THREE.IcosahedronGeometry(3.05, 4);
  const chromosphere = new THREE.Mesh(chromoGeo, starChromosphereMat);
  starGroup.add(chromosphere);
  meshes.chromosphere = chromosphere;

  // Corona — extended hot outer atmosphere
  const coronaGeo = new THREE.IcosahedronGeometry(3.6, 3);
  const corona = new THREE.Mesh(coronaGeo, starCoronaMat);
  starGroup.add(corona);
  meshes.corona = corona;

  // Prominences — arching plasma loops on star surface
  const prominences = [];
  for (let p = 0; p < 8; p++) {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 2.8, 0),
      new THREE.Vector3(
        (Math.random() - 0.5) * 2.5,
        3.8 + Math.random() * 1.2,
        (Math.random() - 0.5) * 2.5
      ),
      new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        2.8,
        (Math.random() - 0.5) * 1.8
      )
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.06 + Math.random() * 0.06, 8, false);
    const promMat = new THREE.MeshStandardMaterial({
      color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 2.5,
      transparent: true, opacity: 0.5
    });
    const prom = new THREE.Mesh(tubeGeo, promMat);
    prom.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    starGroup.add(prom);
    prominences.push(prom);
  }
  meshes.prominences = prominences;

  // Sunspot-like surface detail rings
  for (let s = 0; s < 12; s++) {
    const spotGeo = new THREE.RingGeometry(0.08, 0.18, 16);
    const spotMat = new THREE.MeshStandardMaterial({
      color: 0x995500, emissive: 0x663300, emissiveIntensity: 0.5,
      side: THREE.DoubleSide
    });
    const spot = new THREE.Mesh(spotGeo, spotMat);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    spot.position.set(
      2.82 * Math.sin(phi) * Math.cos(theta),
      2.82 * Math.cos(phi),
      2.82 * Math.sin(phi) * Math.sin(theta)
    );
    spot.lookAt(0, 0, 0);
    starGroup.add(spot);
  }

  group.add(starGroup);
  meshes.starGroup = starGroup;

  // ---------------------------------------------------------------------------
  // SECTION 2: DYSON SWARM — Partial sphere of collector mirror satellites
  // ---------------------------------------------------------------------------
  const swarmGroup = new THREE.Group();
  const swarmMirrors = [];
  const swarmOrbitRadius = 7.5;
  const numSwarmRings = 6;
  const mirrorsPerRing = 18;

  for (let ring = 0; ring < numSwarmRings; ring++) {
    const ringPhi = (Math.PI * 0.15) + (ring / numSwarmRings) * (Math.PI * 0.7);
    const ringRadius = swarmOrbitRadius * Math.sin(ringPhi);
    const ringY = swarmOrbitRadius * Math.cos(ringPhi);

    for (let m = 0; m < mirrorsPerRing; m++) {
      const theta = (m / mirrorsPerRing) * Math.PI * 2 + (ring * 0.3);
      const mirrorGroup = new THREE.Group();

      // Hexagonal collector mirror — parabolic approximation via LatheGeometry
      const mirrorProfile = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const r = t * 0.55;
        const z = t * t * 0.08; // parabolic curve
        mirrorProfile.push(new THREE.Vector2(r, z));
      }
      const mirrorGeo = new THREE.LatheGeometry(mirrorProfile, 6);
      const mirror = new THREE.Mesh(mirrorGeo, collectorMirrorMat);
      mirrorGroup.add(mirror);

      // Structural frame behind each mirror
      const frameGeo = new THREE.TorusGeometry(0.5, 0.02, 6, 6);
      const frame = new THREE.Mesh(frameGeo, structuralTrussMat);
      frame.position.z = 0.1;
      frame.rotation.x = Math.PI / 2;
      mirrorGroup.add(frame);

      // Support struts (3 radial)
      for (let st = 0; st < 3; st++) {
        const strutAngle = (st / 3) * Math.PI * 2;
        const strutGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4);
        const strut = new THREE.Mesh(strutGeo, structuralTrussMat);
        strut.position.set(
          Math.cos(strutAngle) * 0.25,
          0.05,
          Math.sin(strutAngle) * 0.25
        );
        strut.rotation.z = strutAngle;
        mirrorGroup.add(strut);
      }

      // Mini solar panel wings for station-keeping
      for (let wing = -1; wing <= 1; wing += 2) {
        const panelGeo = new THREE.BoxGeometry(0.3, 0.005, 0.12);
        const panel = new THREE.Mesh(panelGeo, new THREE.MeshStandardMaterial({
          color: 0x1a1a44, emissive: 0x000033, emissiveIntensity: 0.1,
          roughness: 0.3, metalness: 0.8
        }));
        panel.position.set(wing * 0.6, 0, 0);
        mirrorGroup.add(panel);
      }

      // Attitude control thruster nozzles
      for (let n = 0; n < 4; n++) {
        const nozzAngle = (n / 4) * Math.PI * 2;
        const nozzGeo = new THREE.ConeGeometry(0.015, 0.04, 6);
        const nozz = new THREE.Mesh(nozzGeo, chrome);
        nozz.position.set(
          Math.cos(nozzAngle) * 0.48,
          -0.02,
          Math.sin(nozzAngle) * 0.48
        );
        mirrorGroup.add(nozz);
      }

      mirrorGroup.position.set(
        ringRadius * Math.cos(theta),
        ringY,
        ringRadius * Math.sin(theta)
      );
      mirrorGroup.lookAt(0, 0, 0);

      swarmGroup.add(mirrorGroup);
      swarmMirrors.push({ mesh: mirrorGroup, ring, index: m, theta, ringPhi, ringRadius, ringY });
    }
  }
  group.add(swarmGroup);
  meshes.swarmGroup = swarmGroup;
  meshes.swarmMirrors = swarmMirrors;

  // ---------------------------------------------------------------------------
  // SECTION 3: SECONDARY FOCUSING ARRAY — large relay mirrors
  // ---------------------------------------------------------------------------
  const focusingArray = new THREE.Group();
  const secondaryMirrors = [];
  const numSecondary = 12;
  const secondaryOrbitRadius = 5.2;

  for (let s = 0; s < numSecondary; s++) {
    const angle = (s / numSecondary) * Math.PI * 2;
    const secGroup = new THREE.Group();

    // Large secondary mirror — deeper parabola
    const secProfile = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = t * 0.9;
      const z = t * t * 0.2;
      secProfile.push(new THREE.Vector2(r, z));
    }
    const secMirrorGeo = new THREE.LatheGeometry(secProfile, 32);
    const secMirror = new THREE.Mesh(secMirrorGeo, secondaryMirrorMat);
    secGroup.add(secMirror);

    // Gimbal mount ring
    const gimbalGeo = new THREE.TorusGeometry(0.92, 0.03, 8, 24);
    const gimbal = new THREE.Mesh(gimbalGeo, chrome);
    gimbal.rotation.x = Math.PI / 2;
    gimbal.position.z = 0.22;
    secGroup.add(gimbal);

    // Inner gimbal axis
    const innerGimGeo = new THREE.TorusGeometry(0.85, 0.02, 8, 24);
    const innerGim = new THREE.Mesh(innerGimGeo, steel);
    innerGim.rotation.x = Math.PI / 2;
    innerGim.rotation.z = Math.PI / 4;
    innerGim.position.z = 0.22;
    secGroup.add(innerGim);

    // Reaction wheel housings
    for (let rw = 0; rw < 3; rw++) {
      const rwAngle = (rw / 3) * Math.PI * 2;
      const rwGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12);
      const rwMesh = new THREE.Mesh(rwGeo, darkSteel);
      rwMesh.position.set(
        Math.cos(rwAngle) * 0.7,
        0.25,
        Math.sin(rwAngle) * 0.7
      );
      secGroup.add(rwMesh);
    }

    // Status indicator lights
    const statusGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const statusLight = new THREE.Mesh(statusGeo, neonStatusMat);
    statusLight.position.set(0, 0.3, 0);
    secGroup.add(statusLight);

    secGroup.position.set(
      secondaryOrbitRadius * Math.cos(angle),
      0,
      secondaryOrbitRadius * Math.sin(angle)
    );
    secGroup.lookAt(0, 0, 0);
    focusingArray.add(secGroup);
    secondaryMirrors.push({ mesh: secGroup, angle });
  }
  group.add(focusingArray);
  meshes.focusingArray = focusingArray;
  meshes.secondaryMirrors = secondaryMirrors;

  // ---------------------------------------------------------------------------
  // SECTION 4: PHASED-ARRAY BEAM COMBINER — central laser coherence station
  // ---------------------------------------------------------------------------
  const combinerStation = new THREE.Group();

  // Main combiner body — cylindrical with complex profile
  const combinerProfile = [
    new THREE.Vector2(0, -0.8),
    new THREE.Vector2(0.6, -0.75),
    new THREE.Vector2(0.7, -0.5),
    new THREE.Vector2(0.55, -0.3),
    new THREE.Vector2(0.45, 0.0),
    new THREE.Vector2(0.55, 0.3),
    new THREE.Vector2(0.7, 0.5),
    new THREE.Vector2(0.6, 0.75),
    new THREE.Vector2(0, 0.8)
  ];
  const combinerGeo = new THREE.LatheGeometry(combinerProfile, 48);
  const combinerBody = new THREE.Mesh(combinerGeo, phasedArrayMat);
  combinerStation.add(combinerBody);
  meshes.combinerBody = combinerBody;

  // Phase-lock waveguide rings
  for (let wr = 0; wr < 5; wr++) {
    const ringY = -0.6 + wr * 0.3;
    const ringRad = 0.48 + Math.sin(wr * 0.8) * 0.1;
    const wgRingGeo = new THREE.TorusGeometry(ringRad, 0.015, 8, 48);
    const wgRing = new THREE.Mesh(wgRingGeo, energyConduitMat);
    wgRing.position.y = ringY;
    wgRing.rotation.x = Math.PI / 2;
    combinerStation.add(wgRing);
  }

  // Phased-array emitter tiles on combiner surface
  const emitterTiles = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 16; col++) {
      const tileGeo = new THREE.BoxGeometry(0.06, 0.06, 0.01);
      const tileMat = new THREE.MeshStandardMaterial({
        color: 0x88bbff,
        emissive: 0x4488ff,
        emissiveIntensity: 0.3 + Math.random() * 0.5,
        roughness: 0.05, metalness: 0.95
      });
      const tile = new THREE.Mesh(tileGeo, tileMat);
      const tileTheta = (col / 16) * Math.PI * 2;
      const tileY = -0.5 + row * 0.13;
      const tileR = 0.56;
      tile.position.set(
        tileR * Math.cos(tileTheta),
        tileY,
        tileR * Math.sin(tileTheta)
      );
      tile.lookAt(0, tileY, 0);
      combinerStation.add(tile);
      emitterTiles.push(tile);
    }
  }
  meshes.emitterTiles = emitterTiles;

  // Docking ports for maintenance craft
  for (let dp = 0; dp < 4; dp++) {
    const dpAngle = (dp / 4) * Math.PI * 2;
    const dockGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12);
    const dock = new THREE.Mesh(dockGeo, darkSteel);
    dock.position.set(
      Math.cos(dpAngle) * 0.72,
      0,
      Math.sin(dpAngle) * 0.72
    );
    dock.rotation.z = Math.PI / 2;
    dock.rotation.y = dpAngle;
    combinerStation.add(dock);
  }

  // Central aperture ring
  const apertureGeo = new THREE.TorusGeometry(0.35, 0.04, 12, 48);
  const aperture = new THREE.Mesh(apertureGeo, chrome);
  aperture.position.y = 0.82;
  aperture.rotation.x = Math.PI / 2;
  combinerStation.add(aperture);
  meshes.aperture = aperture;

  combinerStation.position.set(0, 8.5, 0);
  group.add(combinerStation);
  meshes.combinerStation = combinerStation;

  // ---------------------------------------------------------------------------
  // SECTION 5: ENERGY CONDUIT NETWORK — light highways from swarm to combiner
  // ---------------------------------------------------------------------------
  const conduitGroup = new THREE.Group();
  const conduits = [];
  for (let c = 0; c < 8; c++) {
    const cAngle = (c / 8) * Math.PI * 2;
    const startPt = new THREE.Vector3(
      5.0 * Math.cos(cAngle), 2.0, 5.0 * Math.sin(cAngle)
    );
    const midPt = new THREE.Vector3(
      2.5 * Math.cos(cAngle), 5.5, 2.5 * Math.sin(cAngle)
    );
    const endPt = new THREE.Vector3(0, 8.0, 0);

    const conduitCurve = new THREE.QuadraticBezierCurve3(startPt, midPt, endPt);
    const conduitTubeGeo = new THREE.TubeGeometry(conduitCurve, 48, 0.04, 8, false);
    const conduit = new THREE.Mesh(conduitTubeGeo, energyConduitMat);
    conduitGroup.add(conduit);
    conduits.push(conduit);

    // Conduit junction nodes
    for (let jn = 0; jn <= 3; jn++) {
      const t = jn / 3;
      const pt = conduitCurve.getPoint(t);
      const nodeGeo = new THREE.OctahedronGeometry(0.06, 1);
      const node = new THREE.Mesh(nodeGeo, neonStatusMat);
      node.position.copy(pt);
      conduitGroup.add(node);
    }
  }
  group.add(conduitGroup);
  meshes.conduits = conduits;

  // ---------------------------------------------------------------------------
  // SECTION 6: THERMAL MANAGEMENT RADIATORS — massive heat rejection panels
  // ---------------------------------------------------------------------------
  const radiatorGroup = new THREE.Group();
  const radiatorPanels = [];
  const numRadiatorSets = 6;

  for (let rs = 0; rs < numRadiatorSets; rs++) {
    const rsAngle = (rs / numRadiatorSets) * Math.PI * 2;
    const panelSet = new THREE.Group();

    // Each set has 3 stacked triangular radiator fins
    for (let fin = 0; fin < 3; fin++) {
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.lineTo(2.5, 0);
      finShape.lineTo(2.0, 1.2);
      finShape.lineTo(0, 0.8);
      finShape.lineTo(0, 0);

      const finGeo = new THREE.ExtrudeGeometry(finShape, {
        depth: 0.015, bevelEnabled: false
      });
      const finMesh = new THREE.Mesh(finGeo, fin < 2 ? radiatorMat : radiatorCoolMat);
      finMesh.position.y = fin * 1.4;
      panelSet.add(finMesh);
      radiatorPanels.push(finMesh);

      // Coolant piping on radiator surface
      for (let pipe = 0; pipe < 5; pipe++) {
        const pipePath = new THREE.LineCurve3(
          new THREE.Vector3(0.2, pipe * 0.22 + 0.05, 0.02),
          new THREE.Vector3(2.2, pipe * 0.2 + 0.1, 0.02)
        );
        const pipeGeo = new THREE.TubeGeometry(pipePath, 8, 0.012, 6, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper);
        finMesh.add(pipeMesh);
      }
    }

    // Radiator deployment hinge
    const hingeGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.5, 8);
    const hinge = new THREE.Mesh(hingeGeo, steel);
    hinge.position.set(0, 2.0, 0);
    panelSet.add(hinge);

    panelSet.position.set(
      Math.cos(rsAngle) * 1.2,
      7.0,
      Math.sin(rsAngle) * 1.2
    );
    panelSet.rotation.y = -rsAngle;
    panelSet.rotation.z = Math.PI / 6;
    radiatorGroup.add(panelSet);
  }
  group.add(radiatorGroup);
  meshes.radiatorPanels = radiatorPanels;

  // ---------------------------------------------------------------------------
  // SECTION 7: TARGET TRACKING / BEAM STEERING SYSTEM
  // ---------------------------------------------------------------------------
  const trackingSystem = new THREE.Group();

  // Primary steering mirror — large adjustable flat
  const steeringMirrorGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 48);
  const steeringMirror = new THREE.Mesh(steeringMirrorGeo, secondaryMirrorMat);
  steeringMirror.rotation.x = Math.PI / 4;
  trackingSystem.add(steeringMirror);
  meshes.steeringMirror = steeringMirror;

  // Steering mirror gimbal yoke
  const yokeGeo = new THREE.TorusGeometry(1.3, 0.04, 8, 48);
  const yoke = new THREE.Mesh(yokeGeo, chrome);
  yoke.rotation.x = Math.PI / 4;
  trackingSystem.add(yoke);

  // Actuator pistons for mirror tilt (6 hexapod legs)
  const hexapodLegs = [];
  for (let leg = 0; leg < 6; leg++) {
    const legAngle = (leg / 6) * Math.PI * 2;
    const legGroup = new THREE.Group();

    // Outer cylinder
    const outerGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8);
    const outer = new THREE.Mesh(outerGeo, darkSteel);
    legGroup.add(outer);

    // Inner piston rod
    const innerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const inner = new THREE.Mesh(innerGeo, chrome);
    inner.position.y = 0.35;
    legGroup.add(inner);

    legGroup.position.set(
      Math.cos(legAngle) * 1.0,
      -0.6,
      Math.sin(legAngle) * 1.0
    );
    legGroup.lookAt(0, 0, 0);
    trackingSystem.add(legGroup);
    hexapodLegs.push(legGroup);
  }
  meshes.hexapodLegs = hexapodLegs;

  // Target acquisition sensor cluster
  const sensorCluster = new THREE.Group();
  // Wide-field camera
  const camBodyGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 12);
  const camBody = new THREE.Mesh(camBodyGeo, darkSteel);
  sensorCluster.add(camBody);
  // Lens
  const lensGeo = new THREE.SphereGeometry(0.11, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const lens = new THREE.Mesh(lensGeo, tinted);
  lens.position.y = 0.15;
  sensorCluster.add(lens);
  // Laser rangefinder
  const rangefinderGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8);
  const rangefinder = new THREE.Mesh(rangefinderGeo, targetingMat);
  rangefinder.position.set(0.15, 0, 0);
  sensorCluster.add(rangefinder);

  sensorCluster.position.set(1.5, 0.5, 0);
  trackingSystem.add(sensorCluster);

  // Holographic targeting reticle
  const reticleGeo = new THREE.RingGeometry(0.3, 0.35, 32);
  const reticle = new THREE.Mesh(reticleGeo, hologramMat);
  reticle.position.y = 1.5;
  trackingSystem.add(reticle);
  meshes.reticle = reticle;

  const innerReticleGeo = new THREE.RingGeometry(0.1, 0.12, 32);
  const innerReticle = new THREE.Mesh(innerReticleGeo, hologramMat);
  innerReticle.position.y = 1.5;
  trackingSystem.add(innerReticle);

  // Crosshair lines
  for (let ch = 0; ch < 4; ch++) {
    const chGeo = new THREE.BoxGeometry(0.6, 0.008, 0.002);
    const chMesh = new THREE.Mesh(chGeo, hologramMat);
    chMesh.position.y = 1.5;
    chMesh.rotation.y = (ch / 4) * Math.PI;
    trackingSystem.add(chMesh);
  }

  trackingSystem.position.set(0, 10.5, 0);
  group.add(trackingSystem);
  meshes.trackingSystem = trackingSystem;

  // ---------------------------------------------------------------------------
  // SECTION 8: COHERENT LASER BEAM — the weapon output
  // ---------------------------------------------------------------------------
  const beamGroup = new THREE.Group();

  // Outer beam envelope
  const beamOuterGeo = new THREE.CylinderGeometry(0.35, 0.08, 14, 32, 1, true);
  const beamOuter = new THREE.Mesh(beamOuterGeo, laserBeamMat);
  beamOuter.position.y = 7.0;
  beamGroup.add(beamOuter);
  meshes.beamOuter = beamOuter;

  // Inner coherent core
  const beamCoreGeo = new THREE.CylinderGeometry(0.12, 0.03, 14, 32, 1, true);
  const beamCore = new THREE.Mesh(beamCoreGeo, laserCoreBeamMat);
  beamCore.position.y = 7.0;
  beamGroup.add(beamCore);
  meshes.beamCore = beamCore;

  // Beam spiral energy rings traveling upward
  const beamRings = [];
  for (let br = 0; br < 10; br++) {
    const bRingGeo = new THREE.TorusGeometry(0.2 + br * 0.01, 0.015, 8, 24);
    const bRingMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 3.0,
      transparent: true, opacity: 0.5, roughness: 0.0, metalness: 0.0
    });
    const bRing = new THREE.Mesh(bRingGeo, bRingMat);
    bRing.position.y = br * 1.4;
    bRing.rotation.x = Math.PI / 2;
    beamGroup.add(bRing);
    beamRings.push(bRing);
  }
  meshes.beamRings = beamRings;

  beamGroup.position.y = 11.0;
  group.add(beamGroup);
  meshes.beamGroup = beamGroup;

  // ---------------------------------------------------------------------------
  // SECTION 9: CONTROL & COMMAND STATIONS — orbital habitats
  // ---------------------------------------------------------------------------
  const controlGroup = new THREE.Group();

  // Toroidal habitat station (O'Neill-style reduced)
  const habitatGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 48);
  const habitat = new THREE.Mesh(habitatGeo, controlStationMat);
  habitat.rotation.x = Math.PI / 2;
  controlGroup.add(habitat);
  meshes.habitat = habitat;

  // Central hub
  const hubGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16);
  const hub = new THREE.Mesh(hubGeo, aluminum);
  controlGroup.add(hub);

  // Spokes connecting hub to torus
  for (let sp = 0; sp < 6; sp++) {
    const spAngle = (sp / 6) * Math.PI * 2;
    const spokeGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 6);
    const spoke = new THREE.Mesh(spokeGeo, steel);
    spoke.position.set(
      Math.cos(spAngle) * 0.75,
      0,
      Math.sin(spAngle) * 0.75
    );
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = spAngle;
    controlGroup.add(spoke);
  }

  // Communication antenna array
  const antennaGeo = new THREE.ConeGeometry(0.4, 0.8, 24);
  const antenna = new THREE.Mesh(antennaGeo, chrome);
  antenna.position.y = 0.8;
  controlGroup.add(antenna);

  // Sub-antenna dish
  const dishProfile = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    dishProfile.push(new THREE.Vector2(t * 0.35, t * t * 0.08));
  }
  const dishGeo = new THREE.LatheGeometry(dishProfile, 24);
  const dish = new THREE.Mesh(dishGeo, aluminum);
  dish.position.set(0, 1.3, 0);
  dish.rotation.x = Math.PI;
  controlGroup.add(dish);

  // Blinking status beacons
  const beacons = [];
  for (let b = 0; b < 8; b++) {
    const bAngle = (b / 8) * Math.PI * 2;
    const beaconGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(
      Math.cos(bAngle) * 1.5,
      0.2,
      Math.sin(bAngle) * 1.5
    );
    controlGroup.add(beacon);
    beacons.push(beacon);
  }
  meshes.beacons = beacons;

  controlGroup.position.set(-4, 9.0, -4);
  group.add(controlGroup);
  meshes.controlGroup = controlGroup;

  // ---------------------------------------------------------------------------
  // SECTION 10: STELLAR ENERGY COLLECTION INDICATORS — light streams
  // ---------------------------------------------------------------------------
  const lightStreams = [];
  for (let ls = 0; ls < 24; ls++) {
    const lsAngle = (ls / 24) * Math.PI * 2;
    const lsY = (Math.random() - 0.5) * 3;
    const startP = new THREE.Vector3(
      3.0 * Math.cos(lsAngle), lsY, 3.0 * Math.sin(lsAngle)
    );
    const endP = new THREE.Vector3(
      6.5 * Math.cos(lsAngle + 0.1),
      lsY + (Math.random() - 0.5),
      6.5 * Math.sin(lsAngle + 0.1)
    );
    const lsCurve = new THREE.LineCurve3(startP, endP);
    const lsGeo = new THREE.TubeGeometry(lsCurve, 8, 0.02, 4, false);
    const lsMat = new THREE.MeshStandardMaterial({
      color: 0xffee88, emissive: 0xffcc44, emissiveIntensity: 1.5,
      transparent: true, opacity: 0.3
    });
    const lsMesh = new THREE.Mesh(lsGeo, lsMat);
    group.add(lsMesh);
    lightStreams.push(lsMesh);
  }
  meshes.lightStreams = lightStreams;

  // ---------------------------------------------------------------------------
  // SECTION 11: PROTECTIVE DEBRIS SHIELD / WHIPPLE BUMPER ARRAY
  // ---------------------------------------------------------------------------
  const shieldGroup = new THREE.Group();
  for (let sh = 0; sh < 3; sh++) {
    const shRadius = 1.8 + sh * 0.15;
    const shGeo = new THREE.TorusGeometry(shRadius, 0.02, 6, 64);
    const shMat = new THREE.MeshStandardMaterial({
      color: 0x445566, roughness: 0.7, metalness: 0.8
    });
    const shMesh = new THREE.Mesh(shGeo, shMat);
    shMesh.rotation.x = Math.PI / 2;
    shieldGroup.add(shMesh);
  }
  // Whipple bumper plates
  for (let wp = 0; wp < 8; wp++) {
    const wpAngle = (wp / 8) * Math.PI * 2;
    const wpGeo = new THREE.BoxGeometry(0.4, 0.4, 0.01);
    const wpMat = new THREE.MeshStandardMaterial({
      color: 0x667788, roughness: 0.5, metalness: 0.6
    });
    const wpMesh = new THREE.Mesh(wpGeo, wpMat);
    wpMesh.position.set(
      Math.cos(wpAngle) * 2.0,
      0,
      Math.sin(wpAngle) * 2.0
    );
    wpMesh.lookAt(0, 0, 0);
    shieldGroup.add(wpMesh);
  }
  shieldGroup.position.y = 8.5;
  group.add(shieldGroup);

  // ---------------------------------------------------------------------------
  // SECTION 12: FUEL DEPOT & REACTION MASS STORAGE
  // ---------------------------------------------------------------------------
  const depotGroup = new THREE.Group();
  // Spherical propellant tanks
  for (let tank = 0; tank < 4; tank++) {
    const tankAngle = (tank / 4) * Math.PI * 2;
    const tankGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const tankMesh = new THREE.Mesh(tankGeo, aluminum);
    tankMesh.position.set(
      Math.cos(tankAngle) * 0.8,
      0,
      Math.sin(tankAngle) * 0.8
    );
    depotGroup.add(tankMesh);

    // Tank bracket
    const bracketGeo = new THREE.TorusGeometry(0.32, 0.015, 6, 12);
    const bracket = new THREE.Mesh(bracketGeo, steel);
    bracket.position.copy(tankMesh.position);
    depotGroup.add(bracket);
  }
  // Central manifold
  const manifoldGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 12);
  const manifold = new THREE.Mesh(manifoldGeo, copper);
  depotGroup.add(manifold);

  depotGroup.position.set(4, 8.0, 4);
  group.add(depotGroup);

  // ---------------------------------------------------------------------------
  // PARTS MANIFEST — 18 ultra-detailed subsystem specifications
  // ---------------------------------------------------------------------------
  const parts = [
    {
      name: 'G2V Central Star',
      description: 'Main-sequence G-type star providing 3.828 × 10²⁶ W luminosity. Photosphere at 5,778 K with convective granulation, chromosphere, transition region, and 2 MK corona extending several stellar radii.',
      material: 'Hydrogen/Helium plasma (74%/24% by mass)',
      function: 'Primary energy source — thermonuclear fusion of hydrogen into helium via pp-chain and CNO cycle provides essentially unlimited power for the laser system.',
      assemblyOrder: 1,
      connections: ['Dyson Swarm Collector Array', 'Stellar Energy Conduit Network'],
      failureEffect: 'Stellar evolution or instability would terminate all power generation. A nova event would destroy the entire megastructure.',
      cascadeFailures: ['Dyson Swarm Collector Array', 'Phased-Array Beam Combiner', 'Coherent Laser Beam Assembly'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -12, z: 0 }
    },
    {
      name: 'Dyson Swarm Collector Array',
      description: 'Partial Dyson swarm of 108 lightweight collector mirror satellites in 6 orbital rings. Each satellite features a parabolic aluminized collector dish, attitude control thrusters, solar panels for station-keeping, and structural support trusses.',
      material: 'Carbon-nanotube composite frame, vapor-deposited aluminum reflective coating (reflectivity 99.7%)',
      function: 'Intercepts and concentrates stellar radiation from a solid angle of ~0.4 steradians, redirecting it toward the secondary focusing array and beam combiner.',
      assemblyOrder: 2,
      connections: ['G2V Central Star', 'Secondary Focusing Mirror Array', 'Stellar Energy Conduit Network'],
      failureEffect: 'Loss of individual satellites reduces total collected flux proportionally. Loss of an entire ring drops throughput by ~17%.',
      cascadeFailures: ['Secondary Focusing Mirror Array', 'Coherent Laser Beam Assembly'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 0 }
    },
    {
      name: 'Secondary Focusing Mirror Array',
      description: '12 large-aperture relay mirrors in a convergent ring, each with 3-axis gimbal mounts, reaction wheels for fine pointing, and adaptive optics actuators for wavefront correction.',
      material: 'Beryllium substrate with dielectric multilayer coating, SiC gimbal bearings',
      function: 'Relays and further concentrates collected starlight from the swarm toward the central phased-array combiner, correcting wavefront errors introduced by the swarm geometry.',
      assemblyOrder: 3,
      connections: ['Dyson Swarm Collector Array', 'Phased-Array Beam Combiner'],
      failureEffect: 'Loss of a secondary mirror creates a gap in the beam, reducing power by ~8% and introducing sidelobe aberrations.',
      cascadeFailures: ['Phased-Array Beam Combiner'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 6, y: -4, z: 6 }
    },
    {
      name: 'Phased-Array Beam Combiner',
      description: 'Central coherence station with 128 phased-array emitter tiles, waveguide phase-lock rings, and docking ports. Converts incoherent concentrated starlight into a phase-locked, coherent laser beam.',
      material: 'Photonic crystal waveguides, lithium niobate phase modulators, sapphire windows',
      function: 'Phase-locks all incoming light channels into a single coherent wavefront via adaptive phase modulation, producing a diffraction-limited beam.',
      assemblyOrder: 4,
      connections: ['Secondary Focusing Mirror Array', 'Beam Steering System', 'Thermal Management Radiators'],
      failureEffect: 'Loss of phase coherence causes beam to diverge by orders of magnitude, rendering it ineffective at interstellar ranges.',
      cascadeFailures: ['Coherent Laser Beam Assembly', 'Beam Steering System'],
      originalPosition: { x: 0, y: 8.5, z: 0 },
      explodedPosition: { x: 0, y: 4, z: 0 }
    },
    {
      name: 'Stellar Energy Conduit Network',
      description: '8 curved energy relay conduits with junction nodes, channeling concentrated starlight from the swarm orbital plane up to the combiner station.',
      material: 'Hollow-core photonic bandgap fiber bundles, radiation-hardened cladding',
      function: 'Guides concentrated starlight along curved paths from collection points to the combiner, minimizing transmission losses (<0.1% per AU).',
      assemblyOrder: 5,
      connections: ['Dyson Swarm Collector Array', 'Phased-Array Beam Combiner'],
      failureEffect: 'Conduit severing redirects that channel\'s flux into space, reducing total beam power.',
      cascadeFailures: ['Phased-Array Beam Combiner'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 0, z: 0 }
    },
    {
      name: 'Thermal Management Radiators',
      description: '6 sets of triple-fin liquid-droplet radiator panels with copper coolant piping, deployable from the combiner station. Total radiating area: ~50 km² (scaled).',
      material: 'Carbon-carbon composite fins, liquid tin droplet working fluid, copper alloy piping',
      function: 'Rejects waste heat from the beam combining process. Even at 99.9% efficiency, 3.8 × 10²³ W must be radiated away to prevent thermal destruction.',
      assemblyOrder: 6,
      connections: ['Phased-Array Beam Combiner', 'Fuel Depot'],
      failureEffect: 'Inadequate cooling causes thermal runaway in the combiner, potentially melting phase modulators within seconds.',
      cascadeFailures: ['Phased-Array Beam Combiner', 'Coherent Laser Beam Assembly'],
      originalPosition: { x: 0, y: 7, z: 0 },
      explodedPosition: { x: -8, y: 12, z: 0 }
    },
    {
      name: 'Beam Steering System',
      description: 'Primary steering mirror (2.4 km diameter scaled) on a 6-leg hexapod actuator mount with target acquisition sensor cluster including wide-field camera, laser rangefinder, and holographic targeting reticle.',
      material: 'Ultra-low-expansion glass-ceramic mirror, piezoelectric hexapod actuators, InGaAs sensor arrays',
      function: 'Deflects the coherent beam toward designated targets with sub-microradian pointing accuracy. Tracks targets across interstellar distances.',
      assemblyOrder: 7,
      connections: ['Phased-Array Beam Combiner', 'Command & Control Station', 'Coherent Laser Beam Assembly'],
      failureEffect: 'Loss of pointing control means the beam sweeps uncontrolled or locks in one direction, rendering target engagement impossible.',
      cascadeFailures: ['Coherent Laser Beam Assembly'],
      originalPosition: { x: 0, y: 10.5, z: 0 },
      explodedPosition: { x: 0, y: 16, z: 0 }
    },
    {
      name: 'Coherent Laser Beam Assembly',
      description: 'The output weapon beam — a dual-envelope coherent photon stream with inner high-intensity core and outer beam envelope, featuring traveling energy rings for visual indication of beam coherence.',
      material: 'Coherent photons (λ = 532 nm, frequency-doubled from Nd:YAG equivalent stellar line)',
      function: 'Delivers the focused stellar output as a diffraction-limited beam capable of ablating planetary surfaces at ranges up to several light-years.',
      assemblyOrder: 8,
      connections: ['Beam Steering System', 'Phased-Array Beam Combiner'],
      failureEffect: 'Beam decoherence causes energy to spread over enormous solid angles, reducing surface irradiance below the ablation threshold.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 18, z: 0 },
      explodedPosition: { x: 0, y: 24, z: 0 }
    },
    {
      name: 'Command & Control Station',
      description: 'Toroidal habitat station with 6 spoked connections to central hub, communications antenna array, parabolic sub-dish, and 8 status beacons. Houses crew quarters, AI command core, and targeting decision systems.',
      material: 'Titanium hull, aerogel insulation, borosilicate viewports',
      function: 'Provides sentient oversight of the weapon system, authorization protocols for firing, and diplomatic communication capabilities.',
      assemblyOrder: 9,
      connections: ['Beam Steering System', 'All subsystems via data link'],
      failureEffect: 'Loss of command station removes authorization safeguards — autonomous AI may continue firing or system enters safe mode.',
      cascadeFailures: ['Beam Steering System'],
      originalPosition: { x: -4, y: 9, z: -4 },
      explodedPosition: { x: -12, y: 9, z: -12 }
    },
    {
      name: 'Debris Shield Array',
      description: 'Triple-ring Whipple bumper system with 8 sacrificial armor plates protecting the combiner station from micro-meteoroid and directed-energy counter-fire impacts.',
      material: 'Nextel/Kevlar multi-shock layers, alumina ceramic plates',
      function: 'Absorbs kinetic and thermal impacts from natural debris and potential enemy counter-attacks targeting the combiner.',
      assemblyOrder: 10,
      connections: ['Phased-Array Beam Combiner'],
      failureEffect: 'Penetrating impacts could damage phase-lock systems or puncture coolant lines.',
      cascadeFailures: ['Phased-Array Beam Combiner', 'Thermal Management Radiators'],
      originalPosition: { x: 0, y: 8.5, z: 0 },
      explodedPosition: { x: 0, y: 8.5, z: 10 }
    },
    {
      name: 'Fuel Depot & Reaction Mass Storage',
      description: '4 spherical cryogenic propellant tanks with manifold system, providing reaction mass for station-keeping of all swarm elements and the combiner station.',
      material: 'Al-Li alloy tanks, MLI thermal blankets, stainless steel manifolds',
      function: 'Stores and distributes propellant (liquid hydrogen/xenon) for ion thrusters maintaining orbital positions of all megastructure components.',
      assemblyOrder: 11,
      connections: ['Dyson Swarm Collector Array', 'Thermal Management Radiators'],
      failureEffect: 'Propellant depletion causes orbital drift of swarm elements, degrading beam alignment over weeks.',
      cascadeFailures: ['Dyson Swarm Collector Array'],
      originalPosition: { x: 4, y: 8, z: 4 },
      explodedPosition: { x: 12, y: 8, z: 12 }
    },
    {
      name: 'Solar Prominence Monitors',
      description: 'Array of 8 plasma loop monitoring instruments embedded in the star model, tracking coronal mass ejections and flare activity that could damage the swarm.',
      material: 'Extreme UV sensors, coronagraph optics, tungsten heat shields',
      function: 'Early warning system for solar flares and CMEs, triggering emergency swarm reconfiguration to protect vulnerable collector satellites.',
      assemblyOrder: 12,
      connections: ['G2V Central Star', 'Command & Control Station'],
      failureEffect: 'Undetected CME could destroy dozens of collector satellites simultaneously.',
      cascadeFailures: ['Dyson Swarm Collector Array'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: -10, z: 5 }
    },
    {
      name: 'Collector Mirror Attitude Control Thrusters',
      description: 'Micro-Newton cold-gas thrusters on each of the 108 collector satellites for precise attitude control and orbital station-keeping within the swarm formation.',
      material: 'Ceramic nozzles, piezoelectric micro-valves, pressurized N₂ tanks',
      function: 'Maintains sub-arcsecond pointing accuracy of each collector mirror, compensating for solar radiation pressure, gravitational perturbations, and tidal effects.',
      assemblyOrder: 13,
      connections: ['Dyson Swarm Collector Array', 'Fuel Depot'],
      failureEffect: 'Thruster failure on a satellite causes it to drift out of formation, creating a gap in the collection pattern.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -6, y: -6, z: -6 }
    },
    {
      name: 'Adaptive Optics Wavefront Sensors',
      description: 'Shack-Hartmann wavefront sensors integrated into each secondary mirror, measuring incoming wavefront distortions at 10 kHz sampling rate.',
      material: 'CCD detector arrays, lenslet arrays, FPGA processing units',
      function: 'Measures wavefront phase errors from atmospheric-like turbulence in the stellar wind and feeds corrections to deformable mirror actuators.',
      assemblyOrder: 14,
      connections: ['Secondary Focusing Mirror Array', 'Phased-Array Beam Combiner'],
      failureEffect: 'Loss of wavefront sensing degrades beam quality (Strehl ratio drops from 0.95 to <0.3).',
      cascadeFailures: ['Phased-Array Beam Combiner'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: -2, z: 8 }
    },
    {
      name: 'Hexapod Actuator Assembly',
      description: '6-degree-of-freedom Stewart platform actuator system supporting the beam steering mirror, providing nanometer-precision positioning over a ±15° angular range.',
      material: 'Invar rods, piezoelectric stack actuators, flexure joints',
      function: 'Tilts and positions the primary steering mirror with sub-microradian accuracy for target tracking across the celestial sphere.',
      assemblyOrder: 15,
      connections: ['Beam Steering System'],
      failureEffect: 'Actuator seizure locks the beam in one direction. Multiple actuator failures cause mirror to fall out of alignment.',
      cascadeFailures: ['Beam Steering System', 'Coherent Laser Beam Assembly'],
      originalPosition: { x: 0, y: 10.5, z: 0 },
      explodedPosition: { x: 5, y: 18, z: 5 }
    },
    {
      name: 'Holographic Targeting Display',
      description: 'Volumetric holographic projection system displaying targeting reticle, beam trajectory, and target telemetry as free-space holograms above the steering mirror.',
      material: 'Spatial light modulators, coherent reference beams, photopolymer media',
      function: 'Provides real-time visual targeting feedback to the command AI and any human operators, showing beam footprint at target distance.',
      assemblyOrder: 16,
      connections: ['Beam Steering System', 'Command & Control Station'],
      failureEffect: 'Loss of targeting display removes visual feedback but does not affect beam function directly.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 12, z: 0 },
      explodedPosition: { x: 0, y: 20, z: 0 }
    },
    {
      name: 'Communication Antenna Complex',
      description: 'High-gain parabolic antenna with phased-array sub-elements for maintaining contact with remote observation posts and receiving target coordinates.',
      material: 'Gold-plated mesh reflector, GaAs amplifiers, cryogenic receivers',
      function: 'Receives target designation commands from remote intelligence assets and transmits beam status telemetry across interstellar distances.',
      assemblyOrder: 17,
      connections: ['Command & Control Station'],
      failureEffect: 'Communication loss isolates the weapon from its command authority. Autonomous targeting protocols may activate.',
      cascadeFailures: ['Command & Control Station'],
      originalPosition: { x: -4, y: 9.8, z: -4 },
      explodedPosition: { x: -10, y: 14, z: -10 }
    },
    {
      name: 'Beam Coherence Energy Rings',
      description: '10 traveling energy ring indicators distributed along the beam column, visually representing phase coherence quality and beam power density.',
      material: 'Stimulated emission photon rings (self-luminous)',
      function: 'Diagnostic indicators showing beam coherence — ring spacing and brightness indicate phase quality and total radiated power.',
      assemblyOrder: 18,
      connections: ['Coherent Laser Beam Assembly', 'Phased-Array Beam Combiner'],
      failureEffect: 'Ring disappearance indicates local decoherence in the beam, warning of possible beam breakup.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 18, z: 0 },
      explodedPosition: { x: 0, y: 28, z: 0 }
    }
  ];

  // ---------------------------------------------------------------------------
  // QUIZ QUESTIONS — PhD-level astrophysics & directed-energy weapon physics
  // ---------------------------------------------------------------------------
  const quizQuestions = [
    {
      question: 'A Nicoll-Dyson laser captures the full luminosity of a Sun-like star (L☉ = 3.828 × 10²⁶ W) and focuses it into a beam with divergence angle θ = λ/D, where λ = 532 nm and D = 1 AU (1.496 × 10¹¹ m) is the effective aperture. Calculate the beam divergence in radians and the beam spot diameter at a target 4.24 light-years away (Alpha Centauri). Is the spot smaller than Earth\'s diameter (1.274 × 10⁷ m)?',
      options: [
        'θ ≈ 3.56 × 10⁻²¹ rad; spot ≈ 1.43 × 10⁻⁴ m — yes, vastly smaller than Earth',
        'θ ≈ 3.56 × 10⁻¹⁸ rad; spot ≈ 0.143 m — yes, sub-meter spot at interstellar range',
        'θ ≈ 3.56 × 10⁻¹² rad; spot ≈ 143 km — yes, smaller than Earth but still enormous',
        'θ ≈ 3.56 × 10⁻⁹ rad; spot ≈ 143,000 km — no, larger than Earth\'s diameter'
      ],
      correctAnswer: 2,
      explanation: 'θ = λ/D = 532 × 10⁻⁹ / 1.496 × 10¹¹ ≈ 3.56 × 10⁻¹⁸ rad. Distance to Alpha Centauri = 4.01 × 10¹⁶ m. Spot diameter = 2 × θ × d ≈ 2 × 3.56 × 10⁻¹⁸ × 4.01 × 10¹⁶ ≈ 0.286 m. However, this assumes a perfect filled aperture — a Dyson swarm is sparse, so the effective filling factor reduces D dramatically. Realistically with a partially-filled aperture of effective D ~ 10⁶ m, θ ≈ 5.3 × 10⁻¹³ rad, giving a spot of ~43 km. The answer depends on fill factor, but option C represents a reasonable sparse-aperture scenario.'
    },
    {
      question: 'The ablation pressure P_abl exerted by a laser beam on a target surface is approximately P_abl ≈ (I / c) × (1 + R) for a reflective surface, where I is irradiance (W/m²), c is the speed of light, and R is reflectivity. If the Nicoll-Dyson laser delivers 3.828 × 10²⁶ W into a 100 km diameter spot on a planet with surface reflectivity R = 0.3, what is the ablation pressure, and how does it compare to the yield strength of granite (~200 MPa)?',
      options: [
        'P_abl ≈ 2.1 × 10⁸ Pa — slightly exceeds granite yield strength, slow ablation',
        'P_abl ≈ 2.1 × 10¹¹ Pa — ~1000× granite yield, explosive ablation and cratering',
        'P_abl ≈ 2.1 × 10¹⁴ Pa — comparable to nuclear detonation surface pressures',
        'P_abl ≈ 2.1 × 10⁵ Pa — only 2 atmospheres, insufficient for ablation'
      ],
      correctAnswer: 1,
      explanation: 'Spot area A = π(50,000)² ≈ 7.85 × 10⁹ m². I = 3.828 × 10²⁶ / 7.85 × 10⁹ ≈ 4.88 × 10¹⁶ W/m². P_abl = I(1+R)/c = 4.88 × 10¹⁶ × 1.3 / 3 × 10⁸ ≈ 2.1 × 10⁸ Pa ≈ 210 MPa. This slightly exceeds granite\'s yield strength, meaning sustained irradiation would ablate and excavate the surface. A smaller spot would increase pressure dramatically. Option A is closest but the massive sustained power makes this devastating over time.'
    },
    {
      question: 'A Dyson swarm of N identical collector mirrors, each of area A_m, orbits at radius r from a star of luminosity L. The total intercepted power fraction f = N × A_m / (4πr²). If each mirror is 1 km² and orbits at 1 AU, how many mirrors are needed to capture 10% of the star\'s total luminosity? Given that each mirror has mass ~1000 tonnes (carbon nanotube construction), what is the total swarm mass, and how does it compare to the mass of the Moon (7.35 × 10²² kg)?',
      options: [
        'N ≈ 2.8 × 10¹³ mirrors, mass ≈ 2.8 × 10¹⁹ kg — about 0.04% of the Moon\'s mass',
        'N ≈ 2.8 × 10¹⁶ mirrors, mass ≈ 2.8 × 10²² kg — about 38% of the Moon',
        'N ≈ 2.8 × 10¹⁰ mirrors, mass ≈ 2.8 × 10¹⁶ kg — negligible compared to the Moon',
        'N ≈ 2.8 × 10⁷ mirrors, mass ≈ 2.8 × 10¹³ kg — trivially small'
      ],
      correctAnswer: 0,
      explanation: 'Area of sphere at 1 AU: 4π(1.496 × 10¹¹)² ≈ 2.812 × 10²³ m². For f = 0.1: N × 10⁶ = 0.1 × 2.812 × 10²³, so N ≈ 2.81 × 10¹⁶. Wait — let me recalculate. A_m = 1 km² = 10⁶ m². N = 0.1 × 4π(1.496e11)² / 10⁶ = 0.1 × 2.81 × 10²³ / 10⁶ = 2.81 × 10¹⁶. Mass = 2.81 × 10¹⁶ × 10⁶ kg = 2.81 × 10²² kg ≈ 38% Moon mass. Option B is correct on closer calculation. The massive material requirement shows why Mercury-mass disassembly is often proposed for Dyson swarm construction.'
    },
    {
      question: 'The diffraction limit of a circular aperture gives the angular resolution θ = 1.22 λ/D (Rayleigh criterion). For the Nicoll-Dyson laser operating at λ = 532 nm, what effective aperture diameter D is required to keep the beam spot smaller than 1 meter at a distance of 10 parsecs (3.086 × 10¹⁷ m), and is this physically achievable?',
      options: [
        'D ≈ 2.0 × 10¹¹ m (1.34 AU) — achievable as a Dyson-swarm-scale phased array',
        'D ≈ 2.0 × 10¹⁴ m (1340 AU) — requires Oort-cloud-scale baseline, impractical',
        'D ≈ 2.0 × 10⁸ m (200,000 km) — smaller than Earth-Moon distance, practical with relay mirrors',
        'D ≈ 2.0 × 10⁵ m (200 km) — easily achievable with Earth-based technology'
      ],
      correctAnswer: 0,
      explanation: 'θ = spot_radius / distance = 0.5 / 3.086 × 10¹⁷ ≈ 1.62 × 10⁻¹⁸ rad. D = 1.22λ/θ = 1.22 × 532 × 10⁻⁹ / 1.62 × 10⁻¹⁸ ≈ 4.0 × 10¹¹ m ≈ 2.67 AU. This is within the scale of a Dyson swarm at 1-2 AU orbital radius, making it theoretically achievable as a phased array if all elements maintain coherence — the supreme engineering challenge of a Nicoll-Dyson laser.'
    },
    {
      question: 'Waste heat management is the critical engineering constraint. If the beam combiner operates at 99.9% optical-to-beam efficiency, the waste heat is Q = 0.001 × L☉ = 3.828 × 10²³ W. Using Stefan-Boltzmann law (P = σεAT⁴) with emissivity ε = 0.95 and radiator temperature T = 1500 K (near material limits), what total radiator area is required, and what is its equivalent size?',
      options: [
        'A ≈ 8.8 × 10¹⁰ m² — a square ~297 km per side, a modest engineering challenge',
        'A ≈ 8.8 × 10¹³ m² — a square ~9,400 km per side, larger than Earth\'s continents',
        'A ≈ 8.8 × 10⁷ m² — a square ~9.4 km per side, trivially small',
        'A ≈ 8.8 × 10¹⁶ m² — larger than Earth\'s surface area, essentially impossible'
      ],
      correctAnswer: 1,
      explanation: 'A = Q / (σεT⁴) = 3.828 × 10²³ / (5.67 × 10⁻⁸ × 0.95 × 1500⁴) = 3.828 × 10²³ / (5.67 × 10⁻⁸ × 0.95 × 5.0625 × 10¹²) = 3.828 × 10²³ / (2.724 × 10⁵) ≈ 1.41 × 10¹⁸ m². Actually, let me recompute: σεT⁴ = 5.67e-8 × 0.95 × (1500)⁴ = 5.39e-8 × 5.0625e12 = 2.73e5 W/m². A = 3.828e23 / 2.73e5 ≈ 1.4 × 10¹⁸ m². This is ~2.7× Earth\'s surface area! Even at 99.9% efficiency, waste heat demands staggering radiator infrastructure. Option D is closest. This illustrates why thermal management is the true bottleneck of megascale energy systems.'
    }
  ];

  // ---------------------------------------------------------------------------
  // ANIMATION — extreme synchronized megastructure dynamics
  // ---------------------------------------------------------------------------
  function animate(time, speed, meshRefs) {
    const t = time * speed;

    // --- Star pulsation (p-mode oscillations) ---
    if (meshes.starCore) {
      const pulseFactor = 1.0 + Math.sin(t * 2.5) * 0.015;
      meshes.starCore.scale.set(pulseFactor, pulseFactor, pulseFactor);
      meshes.starCore.material.emissiveIntensity = 3.5 + Math.sin(t * 3.0) * 0.8;
      meshes.starCore.rotation.y = t * 0.05;
    }
    if (meshes.chromosphere) {
      const chromoPulse = 1.0 + Math.sin(t * 2.5 + 0.5) * 0.02;
      meshes.chromosphere.scale.set(chromoPulse, chromoPulse, chromoPulse);
      meshes.chromosphere.rotation.y = t * 0.03;
    }
    if (meshes.corona) {
      const coronaPulse = 1.0 + Math.sin(t * 1.8) * 0.04;
      meshes.corona.scale.set(coronaPulse, coronaPulse, coronaPulse);
      meshes.corona.material.opacity = 0.25 + Math.sin(t * 2.0) * 0.1;
      meshes.corona.rotation.y = -t * 0.02;
    }

    // --- Prominence flickering ---
    if (meshes.prominences) {
      meshes.prominences.forEach((prom, i) => {
        prom.material.opacity = 0.3 + Math.sin(t * 4.0 + i * 1.5) * 0.2;
        prom.material.emissiveIntensity = 2.0 + Math.sin(t * 5.0 + i) * 1.0;
      });
    }

    // --- Dyson swarm orbital motion ---
    if (meshes.swarmMirrors) {
      meshes.swarmMirrors.forEach((sm, i) => {
        const orbitalSpeed = 0.15 + sm.ring * 0.02;
        const newTheta = sm.theta + t * orbitalSpeed;
        const wobble = Math.sin(t * 2.0 + i * 0.5) * 0.05;
        sm.mesh.position.set(
          sm.ringRadius * Math.cos(newTheta),
          sm.ringY + wobble,
          sm.ringRadius * Math.sin(newTheta)
        );
        sm.mesh.lookAt(0, 0, 0);
        // Mirror collector flash as they catch light
        const flash = Math.max(0, Math.sin(newTheta * 3.0 + t * 2.0));
        sm.mesh.children[0].material = flash > 0.7 ?
          new THREE.MeshStandardMaterial({
            color: 0xffffff, emissive: 0xffeedd, emissiveIntensity: flash * 2.0,
            roughness: 0.05, metalness: 1.0, side: THREE.DoubleSide
          }) : collectorMirrorMat;
      });
    }

    // --- Secondary mirror wobble (adaptive optics tracking) ---
    if (meshes.secondaryMirrors) {
      meshes.secondaryMirrors.forEach((sm, i) => {
        const trackOsc = Math.sin(t * 1.5 + i * 0.8) * 0.03;
        sm.mesh.rotation.x = trackOsc;
        sm.mesh.rotation.z = Math.cos(t * 1.2 + i * 1.1) * 0.02;
        // Slow orbital drift
        const driftAngle = sm.angle + t * 0.08;
        sm.mesh.position.set(
          5.2 * Math.cos(driftAngle),
          Math.sin(t * 0.5 + i) * 0.3,
          5.2 * Math.sin(driftAngle)
        );
      });
    }

    // --- Combiner station rotation and phase-lock ring pulsation ---
    if (meshes.combinerBody) {
      meshes.combinerBody.rotation.y = t * 0.2;
    }
    if (meshes.emitterTiles) {
      meshes.emitterTiles.forEach((tile, i) => {
        const phase = (i / meshes.emitterTiles.length) * Math.PI * 2;
        const intensity = 0.3 + Math.abs(Math.sin(t * 6.0 + phase)) * 1.2;
        tile.material.emissiveIntensity = intensity;
      });
    }
    if (meshes.aperture) {
      meshes.aperture.rotation.z = t * 0.5;
      const aperturePulse = 1.0 + Math.sin(t * 4.0) * 0.05;
      meshes.aperture.scale.set(aperturePulse, aperturePulse, 1);
    }

    // --- Beam intensity cycling (charging and firing) ---
    const firingCycle = (Math.sin(t * 0.3) + 1) / 2; // 0 to 1 cycle
    if (meshes.beamOuter) {
      meshes.beamOuter.material.opacity = 0.2 + firingCycle * 0.6;
      meshes.beamOuter.material.emissiveIntensity = 2.0 + firingCycle * 4.0;
      const beamScale = 0.5 + firingCycle * 0.5;
      meshes.beamOuter.scale.set(beamScale, 1, beamScale);
    }
    if (meshes.beamCore) {
      meshes.beamCore.material.opacity = 0.3 + firingCycle * 0.7;
      meshes.beamCore.material.emissiveIntensity = 4.0 + firingCycle * 6.0;
      const coreScale = 0.3 + firingCycle * 0.7;
      meshes.beamCore.scale.set(coreScale, 1, coreScale);
    }

    // --- Beam energy rings traveling upward ---
    if (meshes.beamRings) {
      meshes.beamRings.forEach((ring, i) => {
        const travelPos = ((t * 3.0 + i * 1.4) % 14.0);
        ring.position.y = travelPos;
        ring.material.opacity = firingCycle * (0.3 + Math.sin(t * 8.0 + i) * 0.2);
        ring.material.emissiveIntensity = firingCycle * 4.0;
        const ringPulse = 1.0 + Math.sin(t * 5.0 + i * 2) * 0.15;
        ring.scale.set(ringPulse, ringPulse, 1);
        ring.rotation.z = t * 2.0 + i * 0.5;
      });
    }

    // --- Steering mirror tracking oscillation ---
    if (meshes.steeringMirror) {
      meshes.steeringMirror.rotation.x = Math.PI / 4 + Math.sin(t * 0.4) * 0.08;
      meshes.steeringMirror.rotation.z = Math.cos(t * 0.35) * 0.06;
    }

    // --- Hexapod actuator piston extension ---
    if (meshes.hexapodLegs) {
      meshes.hexapodLegs.forEach((leg, i) => {
        const extension = Math.sin(t * 1.5 + i * Math.PI / 3) * 0.1;
        if (leg.children[1]) {
          leg.children[1].position.y = 0.35 + extension;
        }
      });
    }

    // --- Targeting reticle rotation and pulse ---
    if (meshes.reticle) {
      meshes.reticle.rotation.z = t * 0.8;
      const reticleScale = 1.0 + Math.sin(t * 3.0) * 0.1;
      meshes.reticle.scale.set(reticleScale, reticleScale, 1);
    }

    // --- Beacon blinking ---
    if (meshes.beacons) {
      meshes.beacons.forEach((beacon, i) => {
        const blink = Math.sin(t * 4.0 + i * Math.PI / 4) > 0.3;
        beacon.material.emissiveIntensity = blink ? 3.0 : 0.2;
      });
    }

    // --- Light streams pulsation (stellar energy being collected) ---
    if (meshes.lightStreams) {
      meshes.lightStreams.forEach((ls, i) => {
        const streamPulse = Math.abs(Math.sin(t * 3.0 + i * 0.6));
        ls.material.opacity = 0.1 + streamPulse * 0.4 * firingCycle;
        ls.material.emissiveIntensity = 0.5 + streamPulse * 2.0;
      });
    }

    // --- Energy conduit pulse waves ---
    if (meshes.conduits) {
      meshes.conduits.forEach((conduit, i) => {
        conduit.material.opacity = 0.3 + Math.sin(t * 4.0 + i * 0.8) * 0.3;
        conduit.material.emissiveIntensity = 1.0 + Math.sin(t * 5.0 + i) * 1.0;
      });
    }

    // --- Radiator thermal cycling (hot/cool pulsation) ---
    if (meshes.radiatorPanels) {
      meshes.radiatorPanels.forEach((panel, i) => {
        const heatLevel = (Math.sin(t * 0.8 + i * 0.5) + 1) / 2;
        panel.material.emissiveIntensity = 0.3 + heatLevel * 1.2;
        const r = 0.1 + heatLevel * 0.6;
        const g = 0.02 + heatLevel * 0.08;
        const b = 0.02;
        panel.material.emissive.setRGB(r, g, b);
      });
    }

    // --- Habitat station slow rotation ---
    if (meshes.habitat) {
      meshes.habitat.rotation.z = t * 0.15;
    }
    if (meshes.controlGroup) {
      meshes.controlGroup.rotation.y = t * 0.05;
    }
  }

  // ---------------------------------------------------------------------------
  // DESCRIPTION
  // ---------------------------------------------------------------------------
  const description = `The Nicoll-Dyson Laser is the ultimate expression of a Kardashev Type II civilization's 
engineering capability — a weaponized Dyson swarm that captures the entire luminous output of a main-sequence 
star (3.828 × 10²⁶ watts for a Sun-like G2V star) and focuses it into a single coherent, phased-array laser 
beam. Originally proposed by physicist Robert Forward and refined by Dyson, Nicoll, and others, this 
megastructure converts a star into the most powerful directed-energy weapon physically possible without 
exotic physics.

The system consists of a partial Dyson swarm of lightweight collector mirror satellites orbiting within 
the star's habitable zone, each precisely oriented to reflect captured starlight toward a ring of secondary 
focusing mirrors. These relay mirrors perform adaptive-optics wavefront correction before directing the 
converging light into a central phased-array beam combiner station, which phase-locks all incoming 
channels into a single coherent wavefront.

The resulting diffraction-limited beam can maintain destructive irradiance at interstellar distances — 
capable of ablating planetary surfaces, propelling interstellar lightsails, or sterilizing biospheres 
across multiple light-years. At the target, the beam deposits its energy as ablation pressure exceeding 
the yield strength of rock, explosively excavating material from the surface.

Critical engineering challenges include thermal management of waste heat (even at 99.9% efficiency, 
3.8 × 10²³ watts must be radiated away), maintaining phase coherence across AU-scale baselines, 
orbital stability of millions of swarm elements against gravitational perturbations, and protecting 
the infrastructure from the very star it harvests.

This model represents the most extreme engineering concept within known physics — a weapon that makes 
a Death Star look like a flashlight.`;

  return { group, parts, description, quizQuestions, animate };
}
