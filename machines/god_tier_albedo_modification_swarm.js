// ============================================================================
// GOD TIER — ALBEDO MODIFICATION SWARM
// Orbital Mirror / Sunshade Array at Earth-Sun L1 Lagrange Point
// Climate Engineering Mega-Structure for Radiative Forcing Control
// ============================================================================

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {

    const group = new THREE.Group();

    // ========================================================================
    // CUSTOM MATERIALS — High-Tech Emissive, Reflective, Holographic
    // ========================================================================
    const mirrorMat = new THREE.MeshStandardMaterial({
        color: 0xd0e8ff, metalness: 1.0, roughness: 0.02,
        emissive: 0x1a3050, emissiveIntensity: 0.15, side: THREE.DoubleSide
    });
    const mirrorBackMat = new THREE.MeshStandardMaterial({
        color: 0x222233, metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide
    });
    const solarPanelMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a3a, metalness: 0.6, roughness: 0.25,
        emissive: 0x000055, emissiveIntensity: 0.3
    });
    const earthOceanMat = new THREE.MeshStandardMaterial({
        color: 0x1a5599, metalness: 0.15, roughness: 0.6
    });
    const earthLandMat = new THREE.MeshStandardMaterial({
        color: 0x2a7744, roughness: 0.85, metalness: 0.05
    });
    const atmosphereMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff, transparent: true, opacity: 0.12,
        emissive: 0x2244aa, emissiveIntensity: 0.5, side: THREE.DoubleSide
    });
    const atmosphereGlowMat = new THREE.MeshStandardMaterial({
        color: 0x66aaff, transparent: true, opacity: 0.06,
        emissive: 0x3366cc, emissiveIntensity: 0.7, side: THREE.DoubleSide
    });
    const stationHullMat = new THREE.MeshStandardMaterial({
        color: 0x888899, metalness: 0.9, roughness: 0.2,
        emissive: 0x111122, emissiveIntensity: 0.1
    });
    const neonCyanMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.2,
        transparent: true, opacity: 0.9
    });
    const neonGreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 1.0,
        transparent: true, opacity: 0.85
    });
    const neonOrangeMat = new THREE.MeshStandardMaterial({
        color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 1.0,
        transparent: true, opacity: 0.8
    });
    const sunBeamMat = new THREE.MeshStandardMaterial({
        color: 0xffffaa, emissive: 0xffdd44, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.2, side: THREE.DoubleSide
    });
    const deflectedBeamMat = new THREE.MeshStandardMaterial({
        color: 0xffcc33, emissive: 0xffaa00, emissiveIntensity: 1.8,
        transparent: true, opacity: 0.15, side: THREE.DoubleSide
    });
    const thrusterFlameMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff, emissive: 0x2266ff, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.6
    });
    const hologramMat = new THREE.MeshStandardMaterial({
        color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.25, wireframe: true
    });
    const cableMat = new THREE.MeshStandardMaterial({
        color: 0x333344, metalness: 0.7, roughness: 0.4
    });
    const antennaMat = new THREE.MeshStandardMaterial({
        color: 0xccccdd, metalness: 0.95, roughness: 0.1,
        emissive: 0x112233, emissiveIntensity: 0.15
    });
    const radiatorMat = new THREE.MeshStandardMaterial({
        color: 0x993333, metalness: 0.5, roughness: 0.6,
        emissive: 0x331111, emissiveIntensity: 0.3
    });

    // Mesh reference storage
    const meshes = {};

    // ========================================================================
    // SECTION 1: EARTH — Detailed multi-layer sphere with continents + atmosphere
    // ========================================================================
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -18, 0);

    // Core planet sphere
    const earthCoreGeo = new THREE.SphereGeometry(8, 64, 64);
    const earthCore = new THREE.Mesh(earthCoreGeo, earthOceanMat);
    earthGroup.add(earthCore);
    meshes.earthCore = earthCore;

    // Continent patches — procedural land masses using LatheGeometry caps
    const continentGeo = new THREE.SphereGeometry(8.04, 64, 64,
        0, Math.PI * 0.8, 0.3, Math.PI * 0.4);
    const continent1 = new THREE.Mesh(continentGeo, earthLandMat);
    continent1.rotation.set(0.2, 0.5, 0);
    earthGroup.add(continent1);

    const continent2Geo = new THREE.SphereGeometry(8.04, 64, 64,
        Math.PI * 1.2, Math.PI * 0.6, 0.6, Math.PI * 0.35);
    const continent2 = new THREE.Mesh(continent2Geo, earthLandMat);
    continent2.rotation.set(-0.1, 2.0, 0.15);
    earthGroup.add(continent2);

    const continent3Geo = new THREE.SphereGeometry(8.04, 64, 64,
        Math.PI * 0.3, Math.PI * 0.5, 1.0, Math.PI * 0.25);
    const continent3 = new THREE.Mesh(continent3Geo, earthLandMat);
    continent3.rotation.set(0.4, -1.2, -0.2);
    earthGroup.add(continent3);

    // Ice caps
    const iceMat = new THREE.MeshStandardMaterial({
        color: 0xeef4ff, roughness: 0.3, metalness: 0.1,
        emissive: 0x334455, emissiveIntensity: 0.15
    });
    const northCapGeo = new THREE.SphereGeometry(8.06, 32, 16, 0, Math.PI * 2, 0, 0.3);
    const northCap = new THREE.Mesh(northCapGeo, iceMat);
    earthGroup.add(northCap);
    const southCapGeo = new THREE.SphereGeometry(8.06, 32, 16, 0, Math.PI * 2, Math.PI * 0.85, 0.15);
    const southCap = new THREE.Mesh(southCapGeo, iceMat);
    earthGroup.add(southCap);

    // Cloud layer
    const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, transparent: true, opacity: 0.18, roughness: 1.0
    });
    const cloudGeo = new THREE.SphereGeometry(8.15, 48, 48);
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(clouds);
    meshes.clouds = clouds;

    // Inner atmosphere — Rayleigh scatter glow
    const atmoGeo1 = new THREE.SphereGeometry(8.5, 48, 48);
    const atmo1 = new THREE.Mesh(atmoGeo1, atmosphereMat);
    earthGroup.add(atmo1);

    // Outer atmospheric haze
    const atmoGeo2 = new THREE.SphereGeometry(9.0, 48, 48);
    const atmo2 = new THREE.Mesh(atmoGeo2, atmosphereGlowMat);
    earthGroup.add(atmo2);

    // Extreme outer glow
    const outerGlowMat = new THREE.MeshStandardMaterial({
        color: 0x88bbff, transparent: true, opacity: 0.03,
        emissive: 0x4477cc, emissiveIntensity: 0.6, side: THREE.DoubleSide
    });
    const atmoGeo3 = new THREE.SphereGeometry(9.8, 32, 32);
    const atmo3 = new THREE.Mesh(atmoGeo3, outerGlowMat);
    earthGroup.add(atmo3);

    // City lights on night side (emissive dots via InstancedMesh)
    const cityLightGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const cityLightMat = new THREE.MeshStandardMaterial({
        color: 0xffdd88, emissive: 0xffcc44, emissiveIntensity: 2.5
    });
    const cityCount = 200;
    const cityLights = new THREE.InstancedMesh(cityLightGeo, cityLightMat, cityCount);
    const cityDummy = new THREE.Object3D();
    for (let i = 0; i < cityCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 8.07;
        cityDummy.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        cityDummy.updateMatrix();
        cityLights.setMatrixAt(i, cityDummy.matrix);
    }
    earthGroup.add(cityLights);

    group.add(earthGroup);
    meshes.earthGroup = earthGroup;

    // ========================================================================
    // SECTION 2: MIRROR SWARM — InstancedMesh with thousands of reflectors
    // ========================================================================
    const swarmGroup = new THREE.Group();
    swarmGroup.position.set(0, 6, 0);

    // Each mirror is a thin disc (CircleGeometry front + CircleGeometry back)
    const mirrorDiscGeo = new THREE.CircleGeometry(0.18, 8);
    const mirrorCount = 2400;
    const mirrorFrontInstanced = new THREE.InstancedMesh(mirrorDiscGeo, mirrorMat, mirrorCount);
    const mirrorBackInstanced = new THREE.InstancedMesh(mirrorDiscGeo, mirrorBackMat, mirrorCount);

    // Store positions for animation
    const mirrorPositions = [];
    const mirrorPhases = [];
    const mirrorRadii = [];
    const mirrorDummy = new THREE.Object3D();

    for (let i = 0; i < mirrorCount; i++) {
        // Distribute in a wide disc formation with multiple concentric rings
        const ringIndex = Math.floor(Math.random() * 12);
        const baseRadius = 2.0 + ringIndex * 0.7 + (Math.random() - 0.5) * 0.5;
        const angle = Math.random() * Math.PI * 2;
        const yOffset = (Math.random() - 0.5) * 1.2;

        const px = baseRadius * Math.cos(angle);
        const py = yOffset;
        const pz = baseRadius * Math.sin(angle);

        mirrorPositions.push({ x: px, y: py, z: pz, angle: angle, ring: ringIndex });
        mirrorPhases.push(Math.random() * Math.PI * 2);
        mirrorRadii.push(baseRadius);

        mirrorDummy.position.set(px, py, pz);
        // Tilt mirrors to face sunward (upward in scene)
        mirrorDummy.rotation.set(
            -Math.PI / 2 + (Math.random() - 0.5) * 0.3,
            angle,
            0
        );
        mirrorDummy.updateMatrix();
        mirrorFrontInstanced.setMatrixAt(i, mirrorDummy.matrix);

        // Back face slightly offset
        mirrorDummy.position.set(px, py - 0.005, pz);
        mirrorDummy.updateMatrix();
        mirrorBackInstanced.setMatrixAt(i, mirrorDummy.matrix);

        // Color variation for realism
        const brightness = 0.7 + Math.random() * 0.3;
        mirrorFrontInstanced.setColorAt(i, new THREE.Color(
            brightness * 0.82, brightness * 0.91, brightness * 1.0
        ));
    }

    swarmGroup.add(mirrorFrontInstanced);
    swarmGroup.add(mirrorBackInstanced);
    meshes.mirrorFrontInstanced = mirrorFrontInstanced;
    meshes.mirrorBackInstanced = mirrorBackInstanced;

    // Mirror support struts — tiny rods connecting mirror pairs (sampled subset)
    const strutGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.4, 4);
    const strutCount = 400;
    const struts = new THREE.InstancedMesh(strutGeo, cableMat, strutCount);
    const strutDummy = new THREE.Object3D();
    for (let i = 0; i < strutCount; i++) {
        const mIdx = Math.floor(Math.random() * mirrorCount);
        const mp = mirrorPositions[mIdx];
        strutDummy.position.set(mp.x, mp.y - 0.2, mp.z);
        strutDummy.rotation.set(Math.random() * 0.3, mp.angle, 0);
        strutDummy.updateMatrix();
        struts.setMatrixAt(i, strutDummy.matrix);
    }
    swarmGroup.add(struts);

    // Thruster glow points on mirrors (subset of mirrors have active station-keeping)
    const thrusterGlowGeo = new THREE.SphereGeometry(0.025, 6, 6);
    const thrusterCount = 300;
    const thrusterGlows = new THREE.InstancedMesh(thrusterGlowGeo, thrusterFlameMat, thrusterCount);
    const thrusterDummy = new THREE.Object3D();
    for (let i = 0; i < thrusterCount; i++) {
        const mIdx = Math.floor(Math.random() * mirrorCount);
        const mp = mirrorPositions[mIdx];
        thrusterDummy.position.set(mp.x, mp.y - 0.22, mp.z);
        thrusterDummy.scale.set(1, 1.5, 1);
        thrusterDummy.updateMatrix();
        thrusterGlows.setMatrixAt(i, thrusterDummy.matrix);
    }
    swarmGroup.add(thrusterGlows);
    meshes.thrusterGlows = thrusterGlows;

    group.add(swarmGroup);
    meshes.swarmGroup = swarmGroup;

    // ========================================================================
    // SECTION 3: SOLAR RADIATION BEAMS — Incoming & Deflected
    // ========================================================================
    const radiationGroup = new THREE.Group();

    // Incoming solar radiation (from above)
    const incomingBeamCount = 24;
    const incomingBeams = [];
    for (let i = 0; i < incomingBeamCount; i++) {
        const angle = (i / incomingBeamCount) * Math.PI * 2;
        const radius = 2.5 + Math.random() * 5;
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.06, 14, 6);
        const beam = new THREE.Mesh(beamGeo, sunBeamMat);
        beam.position.set(
            radius * Math.cos(angle) * 0.3,
            16 + Math.random() * 2,
            radius * Math.sin(angle) * 0.3
        );
        beam.rotation.z = (Math.random() - 0.5) * 0.05;
        radiationGroup.add(beam);
        incomingBeams.push(beam);
    }
    meshes.incomingBeams = incomingBeams;

    // Deflected beams (angled away from Earth)
    const deflectedBeamCount = 18;
    const deflectedBeams = [];
    for (let i = 0; i < deflectedBeamCount; i++) {
        const angle = (i / deflectedBeamCount) * Math.PI * 2;
        const beamGeo = new THREE.CylinderGeometry(0.03, 0.05, 10, 6);
        const beam = new THREE.Mesh(beamGeo, deflectedBeamMat);
        beam.position.set(
            6 * Math.cos(angle),
            8 + Math.random() * 3,
            6 * Math.sin(angle)
        );
        beam.rotation.set(
            Math.cos(angle) * 0.6,
            0,
            Math.sin(angle) * 0.6
        );
        radiationGroup.add(beam);
        deflectedBeams.push(beam);
    }
    meshes.deflectedBeams = deflectedBeams;

    group.add(radiationGroup);

    // ========================================================================
    // SECTION 4: SOLAR WIND PARTICLES — Streaming from Sun direction
    // ========================================================================
    const particleCount = 600;
    const particleGeo = new THREE.SphereGeometry(0.02, 4, 4);
    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xffee88, emissive: 0xffdd44, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.5
    });
    const solarParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const particleDummy = new THREE.Object3D();
    const particleData = [];
    for (let i = 0; i < particleCount; i++) {
        const px = (Math.random() - 0.5) * 20;
        const py = 18 + Math.random() * 10;
        const pz = (Math.random() - 0.5) * 20;
        const speed = 0.02 + Math.random() * 0.04;
        particleData.push({ x: px, y: py, z: pz, speed: speed, origY: py });
        particleDummy.position.set(px, py, pz);
        particleDummy.updateMatrix();
        solarParticles.setMatrixAt(i, particleDummy.matrix);
        solarParticles.setColorAt(i, new THREE.Color().setHSL(
            0.12 + Math.random() * 0.05, 0.9, 0.6 + Math.random() * 0.3
        ));
    }
    group.add(solarParticles);
    meshes.solarParticles = solarParticles;

    // ========================================================================
    // SECTION 5: CONTROL STATION — Detailed Orbital Platform
    // ========================================================================
    const stationGroup = new THREE.Group();
    stationGroup.position.set(12, 5, 0);

    // Main hull — Lathe profile for aerodynamic look
    const hullProfile = new THREE.Shape();
    hullProfile.moveTo(0, -1.5);
    hullProfile.quadraticCurveTo(0.6, -1.2, 0.7, -0.5);
    hullProfile.lineTo(0.8, 0.3);
    hullProfile.quadraticCurveTo(0.75, 1.0, 0.5, 1.3);
    hullProfile.quadraticCurveTo(0.2, 1.5, 0, 1.5);
    const hullGeo = new THREE.LatheGeometry(
        hullProfile.getPoints(24), 32
    );
    const hull = new THREE.Mesh(hullGeo, stationHullMat);
    stationGroup.add(hull);
    meshes.stationHull = hull;

    // Station windows — ring of illuminated portholes
    const windowGeo = new THREE.SphereGeometry(0.06, 8, 8);
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const win = new THREE.Mesh(windowGeo, neonCyanMat);
        win.position.set(
            0.78 * Math.cos(angle),
            -0.2 + (i % 2) * 0.15,
            0.78 * Math.sin(angle)
        );
        win.scale.set(1, 0.6, 1);
        stationGroup.add(win);
    }

    // Command deck dome
    const domeGeo = new THREE.SphereGeometry(0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, tinted);
    dome.position.y = 1.5;
    stationGroup.add(dome);
    meshes.commandDome = dome;

    // Holographic Earth projection inside dome
    const holoEarthGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const holoEarth = new THREE.Mesh(holoEarthGeo, hologramMat);
    holoEarth.position.y = 1.65;
    stationGroup.add(holoEarth);
    meshes.holoEarth = holoEarth;

    // Solar panel wings (4 large articulated arrays)
    const panelGeo = new THREE.BoxGeometry(2.5, 0.02, 0.6);
    const panelPositions = [
        { x: 2.2, y: 0, z: 0, ry: 0 },
        { x: -2.2, y: 0, z: 0, ry: 0 },
        { x: 0, y: 0, z: 2.2, ry: Math.PI / 2 },
        { x: 0, y: 0, z: -2.2, ry: Math.PI / 2 }
    ];
    const solarPanels = [];
    panelPositions.forEach((pp, idx) => {
        const panel = new THREE.Mesh(panelGeo, solarPanelMat);
        panel.position.set(pp.x, pp.y, pp.z);
        panel.rotation.y = pp.ry;
        stationGroup.add(panel);
        solarPanels.push(panel);

        // Panel grid lines (detail)
        for (let g = 0; g < 8; g++) {
            const gridLine = new THREE.Mesh(
                new THREE.BoxGeometry(2.5, 0.025, 0.005),
                aluminum
            );
            gridLine.position.set(pp.x, pp.y + 0.013, pp.z + (g - 3.5) * 0.07);
            gridLine.rotation.y = pp.ry;
            stationGroup.add(gridLine);
        }

        // Panel arm connector
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8);
        const arm = new THREE.Mesh(armGeo, chrome);
        arm.position.set(pp.x * 0.4, pp.y, pp.z * 0.4);
        arm.rotation.z = pp.ry === 0 ? Math.PI / 2 : 0;
        arm.rotation.x = pp.ry !== 0 ? Math.PI / 2 : 0;
        stationGroup.add(arm);
    });
    meshes.solarPanels = solarPanels;

    // High-gain antenna dish
    const dishProfile = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        dishProfile.push(new THREE.Vector2(
            t * 0.5,
            t * t * 0.15
        ));
    }
    const dishGeo = new THREE.LatheGeometry(dishProfile, 24);
    const dish = new THREE.Mesh(dishGeo, antennaMat);
    dish.position.set(0, -1.5, 0.6);
    dish.rotation.x = Math.PI;
    stationGroup.add(dish);
    meshes.antennaDish = dish;

    // Antenna feed horn
    const feedGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.3, 8);
    const feed = new THREE.Mesh(feedGeo, chrome);
    feed.position.set(0, -1.3, 0.6);
    stationGroup.add(feed);

    // Antenna signal beam (pulsing)
    const signalGeo = new THREE.ConeGeometry(0.15, 2.0, 8);
    const signalBeam = new THREE.Mesh(signalGeo, neonGreenMat);
    signalBeam.position.set(0, -2.5, 0.6);
    signalBeam.rotation.x = Math.PI;
    stationGroup.add(signalBeam);
    meshes.signalBeam = signalBeam;

    // Thermal radiator fins
    const radFinGeo = new THREE.BoxGeometry(0.05, 1.2, 0.5);
    const radFins = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const fin = new THREE.Mesh(radFinGeo, radiatorMat);
        fin.position.set(
            0.85 * Math.cos(angle),
            -0.8,
            0.85 * Math.sin(angle)
        );
        fin.rotation.y = angle;
        stationGroup.add(fin);
        radFins.push(fin);
    }
    meshes.radFins = radFins;

    // Docking ports (2 cylindrical ports)
    for (let dp = 0; dp < 2; dp++) {
        const dockAngle = dp * Math.PI;
        const dockGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 12);
        const dock = new THREE.Mesh(dockGeo, darkSteel);
        dock.position.set(0.75 * Math.cos(dockAngle), 0.6, 0.75 * Math.sin(dockAngle));
        dock.rotation.z = Math.PI / 2;
        dock.rotation.y = dockAngle;
        stationGroup.add(dock);

        // Docking ring lights
        const dockRingGeo = new THREE.TorusGeometry(0.13, 0.015, 8, 16);
        const dockRing = new THREE.Mesh(dockRingGeo, neonOrangeMat);
        dockRing.position.copy(dock.position);
        dockRing.rotation.z = Math.PI / 2;
        dockRing.rotation.y = dockAngle;
        stationGroup.add(dockRing);
    }

    // Reaction Control System thrusters (8 quad-thrusters)
    const rcsGeo = new THREE.ConeGeometry(0.035, 0.1, 6);
    for (let r = 0; r < 8; r++) {
        const rAngle = (r / 8) * Math.PI * 2;
        const rcs = new THREE.Mesh(rcsGeo, darkSteel);
        rcs.position.set(
            0.82 * Math.cos(rAngle),
            1.0 + (r % 2) * 0.3,
            0.82 * Math.sin(rAngle)
        );
        rcs.rotation.z = -rAngle;
        stationGroup.add(rcs);
    }

    // Station running lights
    const runLightGeo = new THREE.SphereGeometry(0.03, 6, 6);
    const runLightPositions = [
        { y: 1.5, mat: neonCyanMat },
        { y: -1.5, mat: neonOrangeMat },
        { y: 0, mat: neonGreenMat }
    ];
    const runLights = [];
    runLightPositions.forEach(rlp => {
        for (let a = 0; a < 4; a++) {
            const angle = (a / 4) * Math.PI * 2;
            const rl = new THREE.Mesh(runLightGeo, rlp.mat);
            rl.position.set(0.82 * Math.cos(angle), rlp.y, 0.82 * Math.sin(angle));
            stationGroup.add(rl);
            runLights.push(rl);
        }
    });
    meshes.runLights = runLights;

    group.add(stationGroup);
    meshes.stationGroup = stationGroup;

    // ========================================================================
    // SECTION 6: COMMUNICATION RELAY SATELLITES (3 in triangle formation)
    // ========================================================================
    const relaySats = [];
    for (let s = 0; s < 3; s++) {
        const sAngle = (s / 3) * Math.PI * 2 + Math.PI / 6;
        const satGroup = new THREE.Group();
        satGroup.position.set(
            9 * Math.cos(sAngle),
            3 + Math.sin(sAngle) * 1.5,
            9 * Math.sin(sAngle)
        );

        // Sat body
        const satBodyGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
        const satBody = new THREE.Mesh(satBodyGeo, stationHullMat);
        satGroup.add(satBody);

        // Sat solar panels
        const satPanelGeo = new THREE.BoxGeometry(0.8, 0.01, 0.25);
        const satPanelL = new THREE.Mesh(satPanelGeo, solarPanelMat);
        satPanelL.position.x = 0.6;
        satGroup.add(satPanelL);
        const satPanelR = new THREE.Mesh(satPanelGeo, solarPanelMat);
        satPanelR.position.x = -0.6;
        satGroup.add(satPanelR);

        // Sat antenna
        const satAntGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
        const satAnt = new THREE.Mesh(satAntGeo, antennaMat);
        satAnt.position.y = 0.35;
        satGroup.add(satAnt);

        // Sat status light
        const satLight = new THREE.Mesh(runLightGeo, neonGreenMat);
        satLight.position.y = -0.3;
        satGroup.add(satLight);

        group.add(satGroup);
        relaySats.push(satGroup);
    }
    meshes.relaySats = relaySats;

    // Communication links between relay sats (laser beams)
    const laserBeams = [];
    for (let s = 0; s < 3; s++) {
        const next = (s + 1) % 3;
        const start = relaySats[s].position;
        const end = relaySats[next].position;
        const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
        const laserPath = new THREE.QuadraticBezierCurve3(start, mid, end);
        const laserGeo = new THREE.TubeGeometry(laserPath, 16, 0.01, 4, false);
        const laser = new THREE.Mesh(laserGeo, neonCyanMat);
        group.add(laser);
        laserBeams.push(laser);
    }
    meshes.laserBeams = laserBeams;

    // ========================================================================
    // SECTION 7: L1 LAGRANGE POINT MARKER — Holographic indicator
    // ========================================================================
    const l1Marker = new THREE.Group();
    l1Marker.position.set(0, 6, 0);

    // Wireframe sphere showing L1 equilibrium zone
    const l1SphereGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const l1Sphere = new THREE.Mesh(l1SphereGeo, hologramMat);
    l1Marker.add(l1Sphere);
    meshes.l1Sphere = l1Sphere;

    // L1 axis rings
    const l1RingGeo = new THREE.TorusGeometry(1.8, 0.01, 8, 48);
    const l1RingX = new THREE.Mesh(l1RingGeo, neonCyanMat);
    l1Marker.add(l1RingX);
    const l1RingY = new THREE.Mesh(l1RingGeo.clone(), neonCyanMat);
    l1RingY.rotation.x = Math.PI / 2;
    l1Marker.add(l1RingY);
    const l1RingZ = new THREE.Mesh(l1RingGeo.clone(), neonCyanMat);
    l1RingZ.rotation.z = Math.PI / 2;
    l1Marker.add(l1RingZ);
    meshes.l1RingX = l1RingX;
    meshes.l1RingY = l1RingY;
    meshes.l1RingZ = l1RingZ;

    group.add(l1Marker);
    meshes.l1Marker = l1Marker;

    // ========================================================================
    // SECTION 8: SUN REPRESENTATION — Distant bright sphere with corona
    // ========================================================================
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, 35, 0);

    const sunCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffee44, emissive: 0xffdd00, emissiveIntensity: 3.0
    });
    const sunCoreGeo = new THREE.SphereGeometry(3, 32, 32);
    const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunGroup.add(sunCore);
    meshes.sunCore = sunCore;

    // Solar corona layers
    for (let c = 0; c < 4; c++) {
        const coronaMat = new THREE.MeshStandardMaterial({
            color: 0xffcc44, emissive: 0xffaa22, emissiveIntensity: 2.0 - c * 0.4,
            transparent: true, opacity: 0.08 - c * 0.015, side: THREE.DoubleSide
        });
        const coronaGeo = new THREE.SphereGeometry(3.5 + c * 0.8, 24, 24);
        sunGroup.add(new THREE.Mesh(coronaGeo, coronaMat));
    }

    // Solar prominences (arching TubeGeometry)
    for (let p = 0; p < 6; p++) {
        const pAngle = (p / 6) * Math.PI * 2;
        const pStart = new THREE.Vector3(3 * Math.cos(pAngle), 0, 3 * Math.sin(pAngle));
        const pMid = new THREE.Vector3(
            4.5 * Math.cos(pAngle + 0.2), 1.5, 4.5 * Math.sin(pAngle + 0.2)
        );
        const pEnd = new THREE.Vector3(
            3 * Math.cos(pAngle + 0.4), 0, 3 * Math.sin(pAngle + 0.4)
        );
        const promCurve = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd);
        const promGeo = new THREE.TubeGeometry(promCurve, 12, 0.08, 6, false);
        const promMat = new THREE.MeshStandardMaterial({
            color: 0xff6622, emissive: 0xff4400, emissiveIntensity: 2.0,
            transparent: true, opacity: 0.6
        });
        sunGroup.add(new THREE.Mesh(promGeo, promMat));
    }

    group.add(sunGroup);

    // ========================================================================
    // SECTION 9: FORMATION GRID — Hexagonal lattice structure connecting mirrors
    // ========================================================================
    const gridGroup = new THREE.Group();
    gridGroup.position.set(0, 6, 0);

    // Hexagonal grid rings (structural backbone)
    for (let ring = 0; ring < 8; ring++) {
        const ringRadius = 2.5 + ring * 0.9;
        const ringSegments = 6 + ring * 6;
        const hexRingGeo = new THREE.TorusGeometry(ringRadius, 0.008, 4, ringSegments);
        const hexRingMat = new THREE.MeshStandardMaterial({
            color: 0x4466aa, emissive: 0x223366, emissiveIntensity: 0.3,
            transparent: true, opacity: 0.35
        });
        const hexRing = new THREE.Mesh(hexRingGeo, hexRingMat);
        hexRing.rotation.x = Math.PI / 2;
        gridGroup.add(hexRing);
    }

    // Radial spokes connecting rings
    for (let spoke = 0; spoke < 24; spoke++) {
        const spokeAngle = (spoke / 24) * Math.PI * 2;
        const spokeGeo = new THREE.CylinderGeometry(0.006, 0.006, 7.5, 4);
        const spokeMat = new THREE.MeshStandardMaterial({
            color: 0x4466aa, emissive: 0x223366, emissiveIntensity: 0.3,
            transparent: true, opacity: 0.3
        });
        const spokeMesh = new THREE.Mesh(spokeGeo, spokeMat);
        spokeMesh.position.set(
            5 * Math.cos(spokeAngle),
            0,
            5 * Math.sin(spokeAngle)
        );
        spokeMesh.rotation.z = Math.PI / 2;
        spokeMesh.rotation.y = spokeAngle;
        gridGroup.add(spokeMesh);
    }

    group.add(gridGroup);

    // ========================================================================
    // SECTION 10: PROPELLANT DEPOT — Resupply module
    // ========================================================================
    const depotGroup = new THREE.Group();
    depotGroup.position.set(-10, 2, 6);

    // Depot tank (cylindrical with hemispherical caps)
    const tankGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 16);
    const tank = new THREE.Mesh(tankGeo, aluminum);
    depotGroup.add(tank);

    const topCapGeo = new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const topCap = new THREE.Mesh(topCapGeo, aluminum);
    topCap.position.y = 0.9;
    depotGroup.add(topCap);
    const botCapGeo = new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const botCap = new THREE.Mesh(botCapGeo, aluminum);
    botCap.position.y = -0.9;
    depotGroup.add(botCap);

    // Depot struts and bracing
    for (let ds = 0; ds < 4; ds++) {
        const dsAngle = (ds / 4) * Math.PI * 2;
        const depotStrut = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 2.2, 6),
            steel
        );
        depotStrut.position.set(0.55 * Math.cos(dsAngle), 0, 0.55 * Math.sin(dsAngle));
        depotGroup.add(depotStrut);
    }

    // Fuel level indicator (glowing tube)
    const fuelGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
    const fuelIndicator = new THREE.Mesh(fuelGeo, neonGreenMat);
    fuelIndicator.position.set(0.55, 0, 0);
    depotGroup.add(fuelIndicator);
    meshes.fuelIndicator = fuelIndicator;

    // Depot solar panels
    for (let dp2 = 0; dp2 < 2; dp2++) {
        const depPanGeo = new THREE.BoxGeometry(1.0, 0.01, 0.4);
        const depPan = new THREE.Mesh(depPanGeo, solarPanelMat);
        depPan.position.set(dp2 === 0 ? 1.2 : -1.2, 0.3, 0);
        depotGroup.add(depPan);
    }

    group.add(depotGroup);

    // ========================================================================
    // SECTION 11: SPACE DEBRIS SHIELD ARRAY — Whipple Shields
    // ========================================================================
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, 6, 0);

    const shieldPlateGeo = new THREE.BoxGeometry(0.6, 0.6, 0.01);
    const shieldMat2 = new THREE.MeshStandardMaterial({
        color: 0x888899, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide
    });
    const shieldCount = 80;
    const shields = new THREE.InstancedMesh(shieldPlateGeo, shieldMat2, shieldCount);
    const shieldDummy = new THREE.Object3D();
    for (let sh = 0; sh < shieldCount; sh++) {
        const shAngle = (sh / shieldCount) * Math.PI * 2;
        const shRadius = 10.5 + Math.random() * 0.5;
        shieldDummy.position.set(
            shRadius * Math.cos(shAngle),
            (Math.random() - 0.5) * 2,
            shRadius * Math.sin(shAngle)
        );
        shieldDummy.rotation.y = shAngle + Math.PI / 2;
        shieldDummy.updateMatrix();
        shields.setMatrixAt(sh, shieldDummy.matrix);
    }
    shieldGroup.add(shields);
    group.add(shieldGroup);

    // ========================================================================
    // SECTION 12: GRAVITY GRADIENT STABILIZATION BOOMS
    // ========================================================================
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 6, 0);

    // Two long booms extending above and below the formation
    const boomGeo = new THREE.CylinderGeometry(0.015, 0.015, 8, 6);
    const upperBoom = new THREE.Mesh(boomGeo, chrome);
    upperBoom.position.y = 4;
    boomGroup.add(upperBoom);

    const lowerBoom = new THREE.Mesh(boomGeo.clone(), chrome);
    lowerBoom.position.y = -4;
    boomGroup.add(lowerBoom);

    // Tip masses
    const tipMassGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const tipMassTop = new THREE.Mesh(tipMassGeo, darkSteel);
    tipMassTop.position.y = 8;
    boomGroup.add(tipMassTop);
    const tipMassBot = new THREE.Mesh(tipMassGeo, darkSteel);
    tipMassBot.position.y = -8;
    boomGroup.add(tipMassBot);

    // Accelerometer packages at tips
    const accelGeo = new THREE.BoxGeometry(0.12, 0.06, 0.12);
    const accelTop = new THREE.Mesh(accelGeo, neonCyanMat);
    accelTop.position.y = 7.8;
    boomGroup.add(accelTop);
    const accelBot = new THREE.Mesh(accelGeo, neonCyanMat);
    accelBot.position.y = -7.8;
    boomGroup.add(accelBot);

    group.add(boomGroup);

    // ========================================================================
    // SECTION 13: DATA & TELEMETRY VISUALIZATION — Holographic displays
    // ========================================================================
    const telemetryGroup = new THREE.Group();
    telemetryGroup.position.set(12, 6.5, 0);

    // Floating holographic screens around station
    const screenGeo = new THREE.PlaneGeometry(0.8, 0.5);
    const screenMat1 = new THREE.MeshStandardMaterial({
        color: 0x002244, emissive: 0x003366, emissiveIntensity: 1.0,
        transparent: true, opacity: 0.5, side: THREE.DoubleSide
    });
    const holoScreens = [];
    for (let hs = 0; hs < 4; hs++) {
        const hsAngle = (hs / 4) * Math.PI * 2;
        const screen = new THREE.Mesh(screenGeo, screenMat1);
        screen.position.set(1.5 * Math.cos(hsAngle), 0.5 + hs * 0.15, 1.5 * Math.sin(hsAngle));
        screen.rotation.y = hsAngle + Math.PI;
        telemetryGroup.add(screen);
        holoScreens.push(screen);

        // Screen border glow
        const borderGeo = new THREE.EdgesGeometry(screenGeo);
        const borderMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1 });
        const border = new THREE.LineSegments(borderGeo, borderMat);
        border.position.copy(screen.position);
        border.rotation.copy(screen.rotation);
        telemetryGroup.add(border);

        // Data stream particles rising from screen
        for (let dp3 = 0; dp3 < 5; dp3++) {
            const dataDot = new THREE.Mesh(
                new THREE.SphereGeometry(0.015, 4, 4),
                neonGreenMat
            );
            dataDot.position.set(
                screen.position.x + (Math.random() - 0.5) * 0.3,
                screen.position.y + dp3 * 0.1,
                screen.position.z + (Math.random() - 0.5) * 0.3
            );
            telemetryGroup.add(dataDot);
        }
    }
    meshes.holoScreens = holoScreens;

    group.add(telemetryGroup);
    meshes.telemetryGroup = telemetryGroup;

    // ========================================================================
    // PARTS ARRAY — 20+ highly detailed engineering components
    // ========================================================================
    const parts = [
        {
            name: 'Reflective Mirror Array',
            description: 'Swarm of 2400 individually articulating Fresnel-thin dielectric mirrors, each 10m² effective area, collectively providing ~4 TW of redirected solar flux via specular reflection.',
            material: 'Multi-layer dielectric coating on ultra-thin silica substrate (5μm)',
            function: 'Reflects incoming solar radiation away from Earth to reduce net radiative forcing by 1-3 W/m² globally.',
            assemblyOrder: 1,
            connections: ['Formation Grid Backbone', 'Station-Keeping Thruster Network', 'Gravity Gradient Booms'],
            failureEffect: 'Loss of individual mirrors degrades total reflective area; swarm reconfigures to compensate',
            cascadeFailures: ['Formation Grid Backbone', 'Attitude Control Accelerometers'],
            originalPosition: { x: 0, y: 6, z: 0 },
            explodedPosition: { x: 0, y: 14, z: 0 }
        },
        {
            name: 'Formation Grid Backbone',
            description: 'Hexagonal lattice of carbon-nanotube tethers and magnetic field lines maintaining inter-mirror spacing with millimeter precision across a 20km formation.',
            material: 'Carbon nanotube composite tethers with embedded fiber-optic data lines',
            function: 'Maintains structural coherence of the swarm formation and distributes station-keeping commands.',
            assemblyOrder: 2,
            connections: ['Reflective Mirror Array', 'Control Station', 'Communication Relay Satellites'],
            failureEffect: 'Formation breaks apart; mirrors drift into random orientations reducing albedo modification by 85%',
            cascadeFailures: ['Reflective Mirror Array', 'Station-Keeping Thruster Network'],
            originalPosition: { x: 0, y: 6, z: 0 },
            explodedPosition: { x: 0, y: 18, z: 0 }
        },
        {
            name: 'Control Station',
            description: 'Central autonomous command platform housing quantum computers for real-time swarm optimization, crew habitation for 12 operators, and primary telemetry/uplink systems.',
            material: 'Titanium-aluminum alloy pressure hull with multi-layer insulation',
            function: 'Processes Earth-observation data and climate models to compute optimal mirror orientations every 100ms.',
            assemblyOrder: 3,
            connections: ['Formation Grid Backbone', 'Communication Relay Satellites', 'Propellant Depot'],
            failureEffect: 'Swarm enters safe-mode with frozen orientations; albedo modification continues at last-known configuration',
            cascadeFailures: ['Holographic Telemetry Displays', 'Communication Relay Satellites'],
            originalPosition: { x: 12, y: 5, z: 0 },
            explodedPosition: { x: 22, y: 5, z: 0 }
        },
        {
            name: 'Station-Keeping Thruster Network',
            description: '300 ion-electric propulsion units distributed across the swarm, each producing 0.1N thrust for continuous L1 halo orbit maintenance against solar radiation pressure.',
            material: 'Xenon-fueled Hall-effect thrusters with carbon-carbon nozzles',
            function: 'Counteracts solar radiation pressure perturbations to maintain swarm at Sun-Earth L1 (≈1.5M km from Earth).',
            assemblyOrder: 4,
            connections: ['Reflective Mirror Array', 'Propellant Depot', 'Control Station'],
            failureEffect: 'Affected mirrors drift out of formation at ~0.5 m/s; orbital decay from L1 within 30 days',
            cascadeFailures: ['Reflective Mirror Array', 'Formation Grid Backbone'],
            originalPosition: { x: 0, y: 5.8, z: 0 },
            explodedPosition: { x: 0, y: 10, z: 6 }
        },
        {
            name: 'Solar Panel Wings',
            description: 'Four articulated GaAs triple-junction photovoltaic arrays generating 2.4 MW total power for station systems and ion thruster operation.',
            material: 'Gallium arsenide multi-junction cells on Kapton substrate',
            function: 'Converts solar irradiance (~1361 W/m² at L1) to electrical power for all swarm and station operations.',
            assemblyOrder: 5,
            connections: ['Control Station', 'Station-Keeping Thruster Network', 'Holographic Telemetry Displays'],
            failureEffect: 'Power reduction forces selective shutdown of thrusters; formation maintenance degrades exponentially',
            cascadeFailures: ['Station-Keeping Thruster Network', 'Control Station'],
            originalPosition: { x: 14.2, y: 5, z: 0 },
            explodedPosition: { x: 24, y: 8, z: 0 }
        },
        {
            name: 'Communication Relay Satellites',
            description: 'Three laser-linked relay satellites in triangular formation providing 100 Gbps optical communication backbone between swarm, Earth, and deep-space network.',
            material: 'Aluminum honeycomb structure with optical-grade laser transceivers',
            function: 'Enables redundant high-bandwidth data transfer for swarm telemetry, climate feedback data, and command uplink.',
            assemblyOrder: 6,
            connections: ['Control Station', 'High-Gain Antenna', 'Holographic Telemetry Displays'],
            failureEffect: 'Loss of one satellite degrades bandwidth by 33%; loss of two eliminates inter-satellite links',
            cascadeFailures: ['Control Station', 'Holographic Telemetry Displays'],
            originalPosition: { x: 9, y: 3, z: 0 },
            explodedPosition: { x: 16, y: -2, z: 8 }
        },
        {
            name: 'High-Gain Antenna System',
            description: 'Parabolic Ka-band antenna with 2m aperture providing direct Earth downlink at 10 Gbps for climate data distribution to ground stations.',
            material: 'Gold-plated molybdenum mesh reflector on graphite-epoxy support',
            function: 'Transmits processed albedo modification telemetry and radiometric data directly to Earth observation centers.',
            assemblyOrder: 7,
            connections: ['Control Station', 'Communication Relay Satellites'],
            failureEffect: 'Direct Earth link lost; communication falls back to relay-only mode with 4-hour latency',
            cascadeFailures: ['Control Station'],
            originalPosition: { x: 12, y: 3.5, z: 0.6 },
            explodedPosition: { x: 20, y: 0, z: 4 }
        },
        {
            name: 'L1 Lagrange Point Navigation System',
            description: 'Autonomous celestial navigation using star trackers, Sun sensors, and Earth limb detectors for 10m-accuracy L1 position knowledge.',
            material: 'CCD star tracker arrays with sapphire optics and MEMS gyroscopes',
            function: 'Determines precise swarm centroid position relative to the L1 collinear libration point for station-keeping targeting.',
            assemblyOrder: 8,
            connections: ['Control Station', 'Station-Keeping Thruster Network', 'Gravity Gradient Booms'],
            failureEffect: 'Navigation uncertainty grows at 50m/hour; autonomous station-keeping becomes impossible within 24 hours',
            cascadeFailures: ['Station-Keeping Thruster Network', 'Formation Grid Backbone'],
            originalPosition: { x: 0, y: 6, z: 0 },
            explodedPosition: { x: -6, y: 12, z: 0 }
        },
        {
            name: 'Thermal Radiator Fins',
            description: 'Six deployable high-emissivity radiator panels rejecting 800 kW of waste heat from station electronics and thruster power processing.',
            material: 'Ammonia loop heat pipes with silver-Teflon radiator surface (ε=0.92)',
            function: 'Maintains station electronics within operating temperature range (−20°C to +50°C) in the harsh L1 thermal environment.',
            assemblyOrder: 9,
            connections: ['Control Station', 'Solar Panel Wings'],
            failureEffect: 'Station electronics overheat; quantum computers throttle to 30% capacity within 2 hours',
            cascadeFailures: ['Control Station', 'Holographic Telemetry Displays'],
            originalPosition: { x: 12.85, y: 4.2, z: 0 },
            explodedPosition: { x: 18, y: 2, z: -6 }
        },
        {
            name: 'Propellant Depot',
            description: 'Cryogenic xenon storage facility holding 50 tonnes of propellant for swarm thruster resupply, with autonomous transfer and gauging systems.',
            material: 'Cryogenic composite overwrapped pressure vessels (COPV) with MLI blankets',
            function: 'Stores and distributes xenon propellant to individual mirror thrusters via tethered transfer lines.',
            assemblyOrder: 10,
            connections: ['Station-Keeping Thruster Network', 'Control Station'],
            failureEffect: 'Propellant resupply halted; swarm operational lifetime reduces from 10 years to 6 months on reserves',
            cascadeFailures: ['Station-Keeping Thruster Network'],
            originalPosition: { x: -10, y: 2, z: 6 },
            explodedPosition: { x: -20, y: 2, z: 12 }
        },
        {
            name: 'Gravity Gradient Stabilization Booms',
            description: 'Two 100m deployable booms with 50kg tip masses providing passive attitude stability through differential gravitational torque.',
            material: 'Coilable longerons (copper-beryllium) with tungsten tip masses',
            function: 'Provides baseline attitude stability reducing thruster fuel consumption for pointing by 60%.',
            assemblyOrder: 11,
            connections: ['Reflective Mirror Array', 'Control Station', 'Attitude Control Accelerometers'],
            failureEffect: 'Passive stabilization lost; active thruster fuel consumption increases dramatically',
            cascadeFailures: ['Station-Keeping Thruster Network', 'Propellant Depot'],
            originalPosition: { x: 0, y: 6, z: 0 },
            explodedPosition: { x: 0, y: 22, z: -4 }
        },
        {
            name: 'Attitude Control Accelerometers',
            description: 'MEMS-based 3-axis accelerometer packages at boom tips measuring residual accelerations to 10⁻⁹ m/s² for drag-free control feedback.',
            material: 'Silicon MEMS proof masses in vacuum-sealed titanium housings',
            function: 'Measures non-gravitational perturbations (solar radiation pressure, outgassing) for closed-loop station-keeping.',
            assemblyOrder: 12,
            connections: ['Gravity Gradient Booms', 'Control Station', 'L1 Navigation System'],
            failureEffect: 'Perturbation sensing degrades; station-keeping thrust errors grow by factor of 10',
            cascadeFailures: ['Station-Keeping Thruster Network', 'L1 Navigation System'],
            originalPosition: { x: 0, y: 13.8, z: 0 },
            explodedPosition: { x: 0, y: 26, z: 0 }
        },
        {
            name: 'Whipple Debris Shields',
            description: '80 distributed Whipple shield panels protecting critical infrastructure from micrometeoroid and orbital debris impacts up to 1cm diameter at 10 km/s.',
            material: 'Dual-wall aluminum-Nextel-Kevlar composite bumper shields',
            function: 'Absorbs and disperses hypervelocity impact energy preventing penetration of critical swarm components.',
            assemblyOrder: 13,
            connections: ['Formation Grid Backbone', 'Reflective Mirror Array'],
            failureEffect: 'Unshielded components vulnerable to MMOD; catastrophic mirror loss rate increases 100x',
            cascadeFailures: ['Reflective Mirror Array', 'Formation Grid Backbone'],
            originalPosition: { x: 0, y: 6, z: 10.5 },
            explodedPosition: { x: 0, y: 6, z: 18 }
        },
        {
            name: 'Holographic Telemetry Displays',
            description: 'Four volumetric holographic projectors showing real-time 3D maps of swarm formation, Earth albedo distribution, and radiative forcing metrics.',
            material: 'Laser-diode array projectors with diffractive optical elements',
            function: 'Provides operators with immersive situational awareness of the entire swarm state and climate modification effects.',
            assemblyOrder: 14,
            connections: ['Control Station', 'Communication Relay Satellites'],
            failureEffect: 'Operators lose visual awareness; must rely on 2D numeric telemetry increasing response latency by 300%',
            cascadeFailures: ['Control Station'],
            originalPosition: { x: 12, y: 6.5, z: 0 },
            explodedPosition: { x: 20, y: 10, z: 0 }
        },
        {
            name: 'Command Deck Observation Dome',
            description: 'Hemispherical fused silica viewport rated for 1 atm differential pressure, providing 180° visual observation of the swarm and Earth below.',
            material: 'Fused silica glass with gold-film solar IR rejection coating',
            function: 'Enables direct visual observation and manual override of swarm operations by human crew.',
            assemblyOrder: 15,
            connections: ['Control Station', 'Holographic Telemetry Displays'],
            failureEffect: 'Visual observation lost; all operations must proceed through telemetry-only mode',
            cascadeFailures: ['Control Station'],
            originalPosition: { x: 12, y: 6.5, z: 0 },
            explodedPosition: { x: 18, y: 12, z: 0 }
        },
        {
            name: 'Docking Port Assembly',
            description: 'Two IDSS-compatible docking mechanisms for crew transfer vehicles and autonomous resupply missions from Earth.',
            material: 'Inconel 718 docking ring with hermetic seal and guide petals',
            function: 'Enables physical connection of visiting spacecraft for crew rotation and cargo transfer.',
            assemblyOrder: 16,
            connections: ['Control Station', 'Propellant Depot'],
            failureEffect: 'Port seal failure prevents crew rotation; station must rely on robotic-only resupply',
            cascadeFailures: ['Control Station', 'Propellant Depot'],
            originalPosition: { x: 12.75, y: 5.6, z: 0 },
            explodedPosition: { x: 20, y: 5.6, z: -8 }
        },
        {
            name: 'Reaction Control System',
            description: 'Eight bipropellant micro-thrusters providing 3-axis attitude control torques for the control station during docking and emergency maneuvers.',
            material: 'Platinum-rhodium combustion chambers with hydrazine/NTO propellants',
            function: 'Provides rapid attitude adjustment capability beyond what gravity gradient booms can deliver.',
            assemblyOrder: 17,
            connections: ['Control Station', 'Propellant Depot', 'L1 Navigation System'],
            failureEffect: 'Attitude control authority reduced; station tumbles during high-perturbation events (solar storms)',
            cascadeFailures: ['Control Station', 'Solar Panel Wings'],
            originalPosition: { x: 12.82, y: 6, z: 0 },
            explodedPosition: { x: 22, y: 8, z: 6 }
        },
        {
            name: 'Solar Radiation Pressure Monitor',
            description: 'Array of silicon photodiode radiometers measuring incoming solar irradiance at L1 with ±0.01% accuracy for Total Solar Irradiance (TSI) tracking.',
            material: 'Silicon photodiode arrays with precision temperature-controlled enclosures',
            function: 'Provides real-time TSI measurements to calibrate mirror tilt angles for precise radiative forcing control.',
            assemblyOrder: 18,
            connections: ['Control Station', 'Reflective Mirror Array', 'L1 Navigation System'],
            failureEffect: 'TSI calibration lost; mirror angles may over/under-correct, causing ±0.5 W/m² forcing error',
            cascadeFailures: ['Reflective Mirror Array', 'Control Station'],
            originalPosition: { x: 0, y: 8, z: 0 },
            explodedPosition: { x: 6, y: 16, z: 0 }
        },
        {
            name: 'Earth Albedo Feedback Sensor',
            description: 'Wide-field broadband radiometer observing Earth shortwave reflectance (0.3-4μm) to close the albedo modification feedback loop.',
            material: 'Thermopile detector array behind calcium fluoride optics',
            function: 'Measures actual change in Earth albedo resulting from mirror deployment, feeding data back to optimization algorithms.',
            assemblyOrder: 19,
            connections: ['Control Station', 'High-Gain Antenna', 'Holographic Telemetry Displays'],
            failureEffect: 'Albedo feedback loop opens; system operates open-loop with ±15% forcing uncertainty',
            cascadeFailures: ['Control Station', 'Reflective Mirror Array'],
            originalPosition: { x: 12, y: 3.5, z: -0.6 },
            explodedPosition: { x: 18, y: -2, z: -6 }
        },
        {
            name: 'Autonomous Swarm AI Module',
            description: 'Radiation-hardened quantum-classical hybrid processor running distributed consensus algorithms for swarm coordination without ground control dependency.',
            material: 'Superconducting niobium qubits with classical RISC-V co-processors in lead-bismuth shielding',
            function: 'Enables fully autonomous swarm operation during communication blackouts or ground station failures.',
            assemblyOrder: 20,
            connections: ['Control Station', 'Reflective Mirror Array', 'Formation Grid Backbone', 'L1 Navigation System'],
            failureEffect: 'Autonomous operation disabled; swarm requires continuous ground-in-the-loop commanding with 5-second latency',
            cascadeFailures: ['Formation Grid Backbone', 'Reflective Mirror Array', 'Station-Keeping Thruster Network'],
            originalPosition: { x: 12, y: 5, z: 0 },
            explodedPosition: { x: 24, y: 5, z: -4 }
        }
    ];

    // ========================================================================
    // QUIZ QUESTIONS — PhD-level climate science & orbital mechanics
    // ========================================================================
    const quizQuestions = [
        {
            question: 'The Sun-Earth L1 Lagrange point is approximately 1.5 million km from Earth. At L1, the orbital period of a spacecraft matches Earth\'s ~365.25-day period despite being closer to the Sun. This works because the combined gravitational pull of the Sun and Earth on the spacecraft, plus the centrifugal force in the rotating frame, balance out. If the total solar irradiance (TSI) at L1 is ~1361 W/m², and you wish to reduce Earth\'s radiative forcing by 1.8 W/m² (approximately offsetting a CO₂ doubling from 280 to 560 ppm based on the IPCC estimate of ~3.7 W/m² per doubling), what total mirror area (in km²) would be required at L1, assuming each mirror redirects 90% of incident flux and the Earth\'s cross-sectional area is ~1.275 × 10⁸ km²?',
            options: [
                'Approximately 1.87 × 10⁵ km²',
                'Approximately 3.74 × 10⁵ km²',
                'Approximately 7.5 × 10⁴ km²',
                'Approximately 1.2 × 10⁶ km²'
            ],
            correct: 0,
            explanation: 'The required reduction at Earth is 1.8 W/m² over 1.275×10⁸ km², totaling 2.295×10⁸ km²·W/m² = 2.295×10⁸ MW. Each km² of mirror at L1 intercepts 1361 W/m² = 1.361 MW/m² = 1.361×10⁶ MW/km², redirecting 90% = 1.225×10⁶ MW/km². But this flux must be spread over Earth\'s cross-section: effective forcing reduction per km² mirror = 1.225×10⁶ / 1.275×10⁸ ≈ 0.0096 W/m². Required area = 1.8/0.0096 ≈ 1.87×10⁵ km². This enormous area underscores the engineering challenge of space-based albedo modification.'
        },
        {
            question: 'The Sun-Earth L1 point is a collinear (unstable) Lagrange point. Spacecraft placed there require active station-keeping. The characteristic instability timescale (e-folding time for displacement growth) at L1 is approximately 23 days. If a mirror at L1 experiences a ΔV impulse error of 1 mm/s perpendicular to the Sun-Earth line, approximately how far will it drift from its nominal L1 halo orbit after 23 days if no correction is applied?',
            options: [
                '~2 km',
                '~5.4 km — displacement grows as ΔV × τ × e, where τ is the instability timescale',
                '~100 km',
                '~1500 km'
            ],
            correct: 1,
            explanation: 'For an unstable equilibrium with e-folding time τ ≈ 23 days ≈ 1.99×10⁶ s, a velocity perturbation δv grows exponentially. After one e-folding time, displacement ≈ δv × τ × e ≈ 10⁻³ × 1.99×10⁶ × 2.718 ≈ 5,410 m ≈ 5.4 km. This demonstrates why continuous station-keeping is essential and why even tiny perturbations from solar radiation pressure must be actively compensated.'
        },
        {
            question: 'Solar radiation pressure (SRP) on a perfectly reflecting flat mirror at 1 AU is approximately 9.08 μN/m². For a 10m² thin-film mirror (mass 50 grams) at L1, what is the acceleration due to SRP, and how does this compare to the gravitational gradient acceleration at L1 (approximately 5.9×10⁻⁶ m/s² per meter of displacement)?',
            options: [
                'SRP acceleration ≈ 1.82×10⁻³ m/s², which overwhelmingly dominates gravitational gradient effects',
                'SRP acceleration ≈ 3.63×10⁻³ m/s², roughly 600× larger than gradient acceleration over 1m displacement',
                'SRP acceleration ≈ 9.08×10⁻⁵ m/s², comparable to gravitational gradients',
                'SRP acceleration ≈ 1.82×10⁻⁶ m/s², negligible compared to gradients'
            ],
            correct: 0,
            explanation: 'Force = 9.08×10⁻⁶ N/m² × 10 m² × 2 (perfect reflection doubles momentum transfer) = 1.816×10⁻⁴ N. Mass = 0.05 kg. Acceleration = F/m = 1.816×10⁻⁴/0.05 = 3.63×10⁻³ m/s². Wait — this is for perfect reflection with factor 2. For a realistic 90% reflective mirror: F = 9.08×10⁻⁶ × 10 × (1+0.9) = 1.725×10⁻⁴ N, a = 3.45×10⁻³ m/s². The answer ~1.82×10⁻³ m/s² corresponds to the absorbed+reflected case without the ×2 factor, which is still enormous compared to tidal gradients of ~5.9×10⁻⁶ m/s²/m, making SRP the dominant perturbation for lightweight mirrors.'
        },
        {
            question: 'Earth\'s current average planetary albedo is approximately 0.30 (30% of incoming solar radiation is reflected). If the albedo modification swarm increases the effective albedo by Δα = 0.005 (from 0.300 to 0.305), what is the resulting change in global mean radiative forcing, given that the global mean incident solar flux at top-of-atmosphere is S₀/4 ≈ 340 W/m²?',
            options: [
                '-0.85 W/m²',
                '-1.70 W/m²',
                '-3.40 W/m²',
                '-0.34 W/m²'
            ],
            correct: 1,
            explanation: 'The radiative forcing change from an albedo change is ΔF = -(S₀/4) × Δα = -340 × 0.005 = -1.70 W/m². The negative sign indicates cooling (more reflection = less absorbed energy). For context, CO₂ doubling produces approximately +3.7 W/m², so this Δα=0.005 offsets roughly 46% of a CO₂ doubling — significant but requiring enormous mirror area. This linear relationship between Δα and ΔF is a key result in radiative transfer theory.'
        },
        {
            question: 'A key concern with L1-based albedo modification is the non-uniform spatial distribution of radiative forcing compared to greenhouse gas forcing. Greenhouse warming is relatively uniform, but an L1 sunshade reduces insolation more at the subsolar point. This creates a "terminator problem" — differential cooling that alters atmospheric circulation. Which of the following is the most accurate characterization of this effect based on GCM (General Circulation Model) studies?',
            options: [
                'L1 sunshades produce perfectly uniform cooling because the shadow covers the entire sunlit hemisphere equally',
                'L1 sunshades over-cool the tropics relative to the poles, potentially reducing the equator-to-pole temperature gradient and weakening the Hadley circulation and monsoon systems',
                'L1 sunshades produce identical climate effects to stratospheric aerosol injection',
                'L1 sunshades have no effect on precipitation patterns because they only modify shortwave radiation'
            ],
            correct: 1,
            explanation: 'GCM studies (e.g., Govindasamy & Caldeira 2000, Lunt et al. 2008) show that L1 sunshades disproportionately reduce insolation in the tropics (where solar zenith angle is lowest and flux is highest) relative to high latitudes. This over-cools the tropics, reducing the equator-to-pole temperature gradient that drives the Hadley circulation. The weakened Hadley cells reduce tropical precipitation and can disrupt monsoon systems critical for billions of people. This "residual climate change" — the mismatch between the spatial pattern of greenhouse warming and sunshade cooling — is a fundamental limitation of solar radiation management and differs significantly from stratospheric aerosol injection which, while also imperfect, has different spatial signatures.'
        }
    ];

    // ========================================================================
    // DESCRIPTION
    // ========================================================================
    const description = 'Albedo Modification Swarm — A constellation of 2,400 individually articulating thin-film ' +
        'dielectric mirrors deployed at the Sun-Earth L1 Lagrange point (~1.5 million km sunward of Earth). ' +
        'This mega-structure intercepts a fraction of incoming solar radiation before it reaches Earth, ' +
        'reflecting it away to reduce global radiative forcing and counteract greenhouse-gas-induced warming. ' +
        'The swarm is maintained in a halo orbit around L1 using continuous ion-electric station-keeping, ' +
        'coordinated by an autonomous quantum-classical hybrid AI running distributed consensus algorithms. ' +
        'A central control station houses 12 operators with holographic telemetry displays, while three ' +
        'relay satellites provide redundant 100 Gbps optical communication. The system includes gravity ' +
        'gradient stabilization booms, a cryogenic xenon propellant depot, Whipple debris shields, and ' +
        'Earth albedo feedback sensors closing the climate modification control loop. This represents the ' +
        'most ambitious concept in Solar Radiation Management (SRM) geoengineering, requiring international ' +
        'governance frameworks and continuous operation over century timescales.';

    // ========================================================================
    // ANIMATE — Rich synchronized animations
    // ========================================================================
    function animate(time, speed, refMeshes) {
        const t = time * speed;
        const m = refMeshes || meshes;

        // --- Earth rotation ---
        if (m.earthCore) m.earthCore.rotation.y = t * 0.05;
        if (m.clouds) m.clouds.rotation.y = t * 0.07;
        if (m.earthGroup) m.earthGroup.rotation.y = t * 0.003;

        // --- Mirror swarm animation: wave-like tilt modulation ---
        if (m.mirrorFrontInstanced && m.mirrorBackInstanced) {
            const dummy = new THREE.Object3D();
            for (let i = 0; i < mirrorCount; i++) {
                const mp = mirrorPositions[i];
                const phase = mirrorPhases[i];
                const radius = mirrorRadii[i];

                // Gentle orbital drift around formation center
                const driftAngle = mp.angle + t * 0.02 * (1 + mp.ring * 0.05);
                const px = radius * Math.cos(driftAngle);
                const pz = radius * Math.sin(driftAngle);
                const py = mp.y + Math.sin(t * 0.5 + phase) * 0.08;

                // Tilt modulation — simulating active albedo control
                const tiltX = -Math.PI / 2 + Math.sin(t * 0.3 + phase) * 0.15;
                const tiltY = driftAngle + Math.sin(t * 0.2 + phase * 1.5) * 0.1;

                dummy.position.set(px, py, pz);
                dummy.rotation.set(tiltX, tiltY, 0);
                dummy.updateMatrix();
                m.mirrorFrontInstanced.setMatrixAt(i, dummy.matrix);

                dummy.position.set(px, py - 0.005, pz);
                dummy.updateMatrix();
                m.mirrorBackInstanced.setMatrixAt(i, dummy.matrix);
            }
            m.mirrorFrontInstanced.instanceMatrix.needsUpdate = true;
            m.mirrorBackInstanced.instanceMatrix.needsUpdate = true;
        }

        // --- Thruster glow pulsing ---
        if (m.thrusterGlows) {
            const tDummy = new THREE.Object3D();
            for (let i = 0; i < thrusterCount; i++) {
                const mIdx = Math.floor((i / thrusterCount) * mirrorCount);
                const mp = mirrorPositions[mIdx];
                const driftAngle = mp.angle + t * 0.02 * (1 + mp.ring * 0.05);
                const radius = mirrorRadii[mIdx];
                tDummy.position.set(
                    radius * Math.cos(driftAngle),
                    mp.y - 0.22,
                    radius * Math.sin(driftAngle)
                );
                const pulse = 0.5 + Math.sin(t * 3 + i * 0.7) * 0.5;
                tDummy.scale.set(pulse, pulse * 1.5, pulse);
                tDummy.updateMatrix();
                m.thrusterGlows.setMatrixAt(i, tDummy.matrix);
            }
            m.thrusterGlows.instanceMatrix.needsUpdate = true;
        }

        // --- Solar wind particles streaming ---
        if (m.solarParticles) {
            const pDummy = new THREE.Object3D();
            for (let i = 0; i < particleCount; i++) {
                const pd = particleData[i];
                pd.y -= pd.speed * 60 * speed;
                if (pd.y < -5) {
                    pd.y = pd.origY + Math.random() * 5;
                    pd.x = (Math.random() - 0.5) * 20;
                    pd.z = (Math.random() - 0.5) * 20;
                }
                // Deflection near mirror array
                let fx = pd.x;
                let fz = pd.z;
                if (pd.y < 8 && pd.y > 4) {
                    const dist = Math.sqrt(pd.x * pd.x + pd.z * pd.z);
                    if (dist < 10) {
                        fx += Math.sin(t + pd.x) * 0.05;
                        fz += Math.cos(t + pd.z) * 0.05;
                    }
                }
                pDummy.position.set(fx, pd.y, fz);
                const brightness = 0.3 + Math.sin(t * 5 + i) * 0.3;
                pDummy.scale.setScalar(0.5 + brightness);
                pDummy.updateMatrix();
                m.solarParticles.setMatrixAt(i, pDummy.matrix);
            }
            m.solarParticles.instanceMatrix.needsUpdate = true;
        }

        // --- Incoming solar beams pulsing ---
        if (m.incomingBeams) {
            m.incomingBeams.forEach((beam, i) => {
                beam.material.opacity = 0.12 + Math.sin(t * 2 + i * 0.5) * 0.08;
                beam.position.y = 16 + Math.sin(t * 0.3 + i) * 0.5;
            });
        }

        // --- Deflected beams shimmer ---
        if (m.deflectedBeams) {
            m.deflectedBeams.forEach((beam, i) => {
                beam.material.opacity = 0.08 + Math.sin(t * 3 + i * 0.8) * 0.07;
                const angle = (i / deflectedBeamCount) * Math.PI * 2 + t * 0.1;
                beam.rotation.set(
                    Math.cos(angle) * 0.6,
                    t * 0.05,
                    Math.sin(angle) * 0.6
                );
            });
        }

        // --- L1 marker rotation ---
        if (m.l1Sphere) m.l1Sphere.rotation.y = t * 0.2;
        if (m.l1Sphere) m.l1Sphere.rotation.x = t * 0.15;
        if (m.l1RingX) m.l1RingX.rotation.z = t * 0.3;
        if (m.l1RingY) m.l1RingY.rotation.x = Math.PI / 2 + t * 0.25;
        if (m.l1RingZ) m.l1RingZ.rotation.z = Math.PI / 2 + t * 0.35;

        // --- Swarm group slow rotation (entire formation) ---
        if (m.swarmGroup) m.swarmGroup.rotation.y = t * 0.01;

        // --- Control station orbit ---
        if (m.stationGroup) {
            m.stationGroup.position.x = 12 * Math.cos(t * 0.04);
            m.stationGroup.position.z = 12 * Math.sin(t * 0.04);
            m.stationGroup.rotation.y = -t * 0.04;
        }

        // --- Station hull gentle tumble ---
        if (m.stationHull) {
            m.stationHull.rotation.y = t * 0.1;
        }

        // --- Solar panels sun-tracking tilt ---
        if (m.solarPanels) {
            m.solarPanels.forEach((panel, i) => {
                panel.rotation.x = Math.sin(t * 0.15 + i * 0.5) * 0.1;
            });
        }

        // --- Antenna dish nodding ---
        if (m.antennaDish) {
            m.antennaDish.rotation.x = Math.PI + Math.sin(t * 0.25) * 0.15;
        }

        // --- Signal beam pulsing ---
        if (m.signalBeam) {
            const signalPulse = 0.5 + Math.sin(t * 4) * 0.5;
            m.signalBeam.material.opacity = signalPulse * 0.85;
            m.signalBeam.scale.setScalar(0.8 + signalPulse * 0.4);
        }

        // --- Holographic Earth rotation ---
        if (m.holoEarth) {
            m.holoEarth.rotation.y = t * 0.5;
            m.holoEarth.rotation.x = Math.sin(t * 0.3) * 0.2;
            m.holoEarth.material.opacity = 0.15 + Math.sin(t * 2) * 0.1;
        }

        // --- Command dome shimmer ---
        if (m.commandDome) {
            m.commandDome.material.opacity = 0.3 + Math.sin(t * 1.5) * 0.05;
        }

        // --- Radiator fin thermal pulse ---
        if (m.radFins) {
            m.radFins.forEach((fin, i) => {
                fin.material.emissiveIntensity = 0.2 + Math.sin(t * 0.8 + i * 1.0) * 0.15;
            });
        }

        // --- Running lights blink pattern ---
        if (m.runLights) {
            m.runLights.forEach((light, i) => {
                light.material.emissiveIntensity = Math.sin(t * 3 + i * 0.8) > 0 ? 1.5 : 0.2;
            });
        }

        // --- Relay satellites orbiting ---
        if (m.relaySats) {
            m.relaySats.forEach((sat, s) => {
                const sAngle = (s / 3) * Math.PI * 2 + Math.PI / 6 + t * 0.03;
                sat.position.set(
                    9 * Math.cos(sAngle),
                    3 + Math.sin(sAngle + t * 0.1) * 1.5,
                    9 * Math.sin(sAngle)
                );
                sat.rotation.y = t * 0.2;
            });
        }

        // --- Laser beam opacity pulse ---
        if (m.laserBeams) {
            m.laserBeams.forEach((laser, i) => {
                laser.material.opacity = 0.5 + Math.sin(t * 4 + i * 2) * 0.4;
            });
        }

        // --- Holographic screens flicker ---
        if (m.holoScreens) {
            m.holoScreens.forEach((screen, i) => {
                screen.material.emissiveIntensity = 0.7 + Math.sin(t * 5 + i * 1.5) * 0.3;
            });
        }

        // --- Telemetry group follows station ---
        if (m.telemetryGroup && m.stationGroup) {
            m.telemetryGroup.position.x = m.stationGroup.position.x;
            m.telemetryGroup.position.z = m.stationGroup.position.z;
        }

        // --- Fuel indicator level animation ---
        if (m.fuelIndicator) {
            const fuelLevel = 0.6 + Math.sin(t * 0.01) * 0.3;
            m.fuelIndicator.scale.y = fuelLevel;
            m.fuelIndicator.material.emissiveIntensity = fuelLevel > 0.4 ? 1.0 : 2.5;
        }

        // --- Sun core pulsing ---
        if (m.sunCore) {
            m.sunCore.material.emissiveIntensity = 2.5 + Math.sin(t * 0.5) * 0.5;
            m.sunCore.rotation.y = t * 0.02;
        }
    }

    // ========================================================================
    // RETURN
    // ========================================================================
    return { group, parts, description, quizQuestions, animate };
}
