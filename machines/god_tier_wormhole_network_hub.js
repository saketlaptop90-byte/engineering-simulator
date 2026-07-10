// ============================================================================
// GOD TIER WORMHOLE NETWORK HUB — Ultra Hyper-Realistic THREE.js Model
// A central station connecting multiple stabilized Morris-Thorne wormholes
// to different destinations. Features exotic matter generators, transiting
// ships, pulsing throats, flowing exotic matter streams, and destination
// portal visuals.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ── Helper Materials ────────────────────────────────────────────────────────
function _glow(hex, intensity = 2.5) {
    return new THREE.MeshStandardMaterial({
        color: hex, emissive: hex, emissiveIntensity: intensity,
        transparent: true, opacity: 0.92, side: THREE.DoubleSide
    });
}
function _solidGlow(hex, intensity = 1.8) {
    return new THREE.MeshStandardMaterial({
        color: hex, emissive: hex, emissiveIntensity: intensity,
        metalness: 0.7, roughness: 0.25
    });
}
function _hullMat() {
    return new THREE.MeshStandardMaterial({
        color: 0x1a1a2e, metalness: 0.92, roughness: 0.15
    });
}
function _exoticMat(hex = 0x7b2ff7) {
    return new THREE.MeshStandardMaterial({
        color: hex, emissive: hex, emissiveIntensity: 3.5,
        transparent: true, opacity: 0.55, side: THREE.DoubleSide
    });
}
function _panelMat() {
    return new THREE.MeshStandardMaterial({
        color: 0x0d0d1a, metalness: 0.85, roughness: 0.2,
        emissive: 0x0a0a22, emissiveIntensity: 0.3
    });
}

// ── Destination colors for each wormhole ────────────────────────────────────
const DESTINATION_COLORS = [
    { throat: 0x00e5ff, exotic: 0x7b2ff7, name: 'Andromeda Nexus' },
    { throat: 0xff4081, exotic: 0xff6f00, name: 'Cygnus X-1 Station' },
    { throat: 0x76ff03, exotic: 0x00e676, name: 'Sagittarius A* Relay' },
    { throat: 0xffea00, exotic: 0xffd600, name: 'Magellanic Outpost' },
    { throat: 0xe040fb, exotic: 0xd500f9, name: 'Triangulum Gate' },
    { throat: 0x00bcd4, exotic: 0x1de9b6, name: 'Centaurus Hub' }
];

export function createMachine(THREE) {
    const group = new THREE.Group();
    const animatedMeshes = {};

    // ════════════════════════════════════════════════════════════════════════
    // 1. CENTRAL STATION CORE — Massive toroidal base with layered hull
    // ════════════════════════════════════════════════════════════════════════
    const stationCore = new THREE.Group();
    // Primary toroidal hull ring
    const torusGeo = new THREE.TorusGeometry(12, 2.8, 32, 128);
    const torusMesh = new THREE.Mesh(torusGeo, _hullMat());
    stationCore.add(torusMesh);

    // Inner structural torus
    const innerTorus = new THREE.Mesh(
        new THREE.TorusGeometry(12, 1.6, 24, 96),
        new THREE.MeshStandardMaterial({ color: 0x111133, metalness: 0.9, roughness: 0.12 })
    );
    stationCore.add(innerTorus);

    // Central command sphere with layered panels
    const commandSphereGeo = new THREE.SphereGeometry(4.5, 64, 64);
    const commandSphere = new THREE.Mesh(commandSphereGeo, _panelMat());
    stationCore.add(commandSphere);

    // Observation dome on top of command sphere
    const domeGeo = new THREE.SphereGeometry(3.2, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMesh = new THREE.Mesh(domeGeo, tinted.clone());
    domeMesh.position.y = 2.5;
    stationCore.add(domeMesh);

    // Hull panel lines (extruded grooves around the torus)
    for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        const panelLine = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.5, 5.8),
            _solidGlow(0x0055aa, 0.4)
        );
        panelLine.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
        panelLine.lookAt(0, 0, 0);
        stationCore.add(panelLine);
    }

    // Riveted armour plates around command sphere
    for (let ring = 0; ring < 6; ring++) {
        const yOff = -2.0 + ring * 0.8;
        const radius = Math.sqrt(Math.max(0, 4.5 * 4.5 - yOff * yOff));
        const count = Math.max(8, Math.floor(radius * 6));
        for (let j = 0; j < count; j++) {
            const a = (j / count) * Math.PI * 2;
            const rivet = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 8, 8),
                chrome.clone()
            );
            rivet.position.set(Math.cos(a) * radius, yOff, Math.sin(a) * radius);
            stationCore.add(rivet);
        }
    }
    group.add(stationCore);

    // ════════════════════════════════════════════════════════════════════════
    // 2. STRUCTURAL SPOKES — Connecting core to wormhole docking pylons
    // ════════════════════════════════════════════════════════════════════════
    const spokeGroup = new THREE.Group();
    animatedMeshes.spokes = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const spoke = new THREE.Group();
        // Main truss beam
        const trussLen = 18;
        const truss = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, trussLen),
            steel.clone()
        );
        truss.position.set(0, 0, trussLen / 2 + 3);
        spoke.add(truss);

        // Truss cross bracing
        for (let b = 0; b < 8; b++) {
            const brace = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8),
                darkSteel.clone()
            );
            brace.position.set(0, 0, 4 + b * 2);
            brace.rotation.z = (b % 2 === 0) ? 0.78 : -0.78;
            spoke.add(brace);
        }

        // Power conduit running along spoke
        const conduitCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.5, 0.5, 3),
            new THREE.Vector3(0.6, 0.6, 10),
            new THREE.Vector3(0.5, 0.5, 18),
            new THREE.Vector3(0, 0, 21)
        ]);
        const conduitGeo = new THREE.TubeGeometry(conduitCurve, 32, 0.12, 8, false);
        const conduit = new THREE.Mesh(conduitGeo, _solidGlow(DESTINATION_COLORS[i].exotic, 1.2));
        spoke.add(conduit);
        animatedMeshes.spokes.push(conduit);

        // Secondary conduit
        const conduit2Curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.5, -0.5, 3),
            new THREE.Vector3(-0.6, -0.4, 12),
            new THREE.Vector3(-0.5, -0.5, 20)
        ]);
        const conduit2 = new THREE.Mesh(
            new THREE.TubeGeometry(conduit2Curve, 28, 0.09, 8, false),
            _solidGlow(DESTINATION_COLORS[i].throat, 0.8)
        );
        spoke.add(conduit2);

        // Spoke junction ring at torus connection
        const junctionRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.2, 0.2, 12, 24),
            chrome.clone()
        );
        junctionRing.position.z = 3;
        spoke.add(junctionRing);

        spoke.rotation.y = angle;
        spokeGroup.add(spoke);
    }
    group.add(spokeGroup);

    // ════════════════════════════════════════════════════════════════════════
    // 3. WORMHOLE THROAT ASSEMBLIES — Morris-Thorne type stabilized throats
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.throats = [];
    animatedMeshes.throatInners = [];
    animatedMeshes.exoticRings = [];
    animatedMeshes.destinationDiscs = [];
    animatedMeshes.stabilizers = [];
    animatedMeshes.pylonLights = [];

    const throatAssemblies = new THREE.Group();

    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = 22;
        const dest = DESTINATION_COLORS[i];
        const assembly = new THREE.Group();
        assembly.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
        assembly.lookAt(0, 0, 0);

        // ── 3a. Docking pylon structure ─────────────────────────────────
        const pylonBase = new THREE.Mesh(
            new THREE.CylinderGeometry(3.5, 4.0, 2.0, 8),
            _hullMat()
        );
        pylonBase.rotation.x = Math.PI / 2;
        assembly.add(pylonBase);

        // Pylon support arches (4 arches around throat)
        for (let a = 0; a < 4; a++) {
            const archAngle = (a / 4) * Math.PI * 2;
            const archCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(Math.cos(archAngle) * 4.5, Math.sin(archAngle) * 4.5, -1),
                new THREE.Vector3(Math.cos(archAngle) * 5.5, Math.sin(archAngle) * 5.5, 0),
                new THREE.Vector3(Math.cos(archAngle) * 4.5, Math.sin(archAngle) * 4.5, 1)
            ]);
            const archGeo = new THREE.TubeGeometry(archCurve, 16, 0.25, 8, false);
            const arch = new THREE.Mesh(archGeo, darkSteel.clone());
            assembly.add(arch);
        }

        // ── 3b. Wormhole throat — nested torus rings forming a tunnel ───
        const throatRings = new THREE.Group();
        const ringCount = 14;
        for (let r = 0; r < ringCount; r++) {
            const t = r / (ringCount - 1);
            const z = -3 + t * 6;
            const flare = 2.5 + 1.2 * Math.pow(Math.abs(t - 0.5) * 2, 2.5);
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(flare, 0.12, 12, 48),
                _glow(dest.throat, 1.5 + t * 1.5)
            );
            ring.position.z = z;
            throatRings.add(ring);
        }
        animatedMeshes.throats.push(throatRings);
        assembly.add(throatRings);

        // Inner throat membrane — a thinly stretched tube (wormhole interior)
        const throatProfile = [];
        for (let s = 0; s <= 32; s++) {
            const t = s / 32;
            const z = -3 + t * 6;
            const r = 2.2 + 0.8 * Math.pow(Math.abs(t - 0.5) * 2, 2.2);
            throatProfile.push(new THREE.Vector2(r, z));
        }
        const throatLathe = new THREE.LatheGeometry(throatProfile, 48);
        const throatInner = new THREE.Mesh(throatLathe, new THREE.MeshStandardMaterial({
            color: dest.throat, emissive: dest.throat, emissiveIntensity: 0.8,
            transparent: true, opacity: 0.25, side: THREE.DoubleSide, wireframe: true
        }));
        animatedMeshes.throatInners.push(throatInner);
        assembly.add(throatInner);

        // ── 3c. Destination portal disc — visible "other side" ──────────
        const destDisc = new THREE.Mesh(
            new THREE.CircleGeometry(2.3, 64),
            new THREE.MeshStandardMaterial({
                color: dest.throat, emissive: dest.throat, emissiveIntensity: 2.0,
                transparent: true, opacity: 0.7, side: THREE.DoubleSide
            })
        );
        destDisc.position.z = 0;
        animatedMeshes.destinationDiscs.push(destDisc);
        assembly.add(destDisc);

        // Destination glow halo ring
        const haloRing = new THREE.Mesh(
            new THREE.RingGeometry(2.3, 3.0, 64),
            _glow(dest.throat, 3.0)
        );
        haloRing.position.z = 0.01;
        assembly.add(haloRing);

        // ── 3d. Exotic matter generator rings ───────────────────────────
        for (let e = 0; e < 3; e++) {
            const exoZ = -2.5 + e * 2.5;
            const exoRing = new THREE.Mesh(
                new THREE.TorusGeometry(3.8 + e * 0.3, 0.35, 16, 48),
                _exoticMat(dest.exotic)
            );
            exoRing.position.z = exoZ;
            animatedMeshes.exoticRings.push(exoRing);
            assembly.add(exoRing);

            // Exotic matter injector nozzles on each ring
            for (let n = 0; n < 8; n++) {
                const na = (n / 8) * Math.PI * 2;
                const nozzle = new THREE.Mesh(
                    new THREE.ConeGeometry(0.15, 0.6, 8),
                    _solidGlow(dest.exotic, 2.0)
                );
                const nR = 3.8 + e * 0.3;
                nozzle.position.set(Math.cos(na) * nR, Math.sin(na) * nR, exoZ);
                nozzle.lookAt(0, 0, exoZ);
                assembly.add(nozzle);
            }
        }

        // ── 3e. Throat stabilizer pylons — 8 radial struts ──────────────
        for (let sp = 0; sp < 8; sp++) {
            const spAngle = (sp / 8) * Math.PI * 2;
            const stabilizer = new THREE.Mesh(
                new THREE.CylinderGeometry(0.15, 0.1, 4, 8),
                aluminum.clone()
            );
            stabilizer.position.set(
                Math.cos(spAngle) * 5.5,
                Math.sin(spAngle) * 5.5,
                0
            );
            stabilizer.lookAt(0, 0, 0);
            animatedMeshes.stabilizers.push(stabilizer);
            assembly.add(stabilizer);

            // Stabilizer tip light
            const tipLight = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 12, 12),
                _glow(dest.exotic, 3.0)
            );
            tipLight.position.copy(stabilizer.position);
            animatedMeshes.pylonLights.push(tipLight);
            assembly.add(tipLight);
        }

        // ── 3f. Magnetic field coils around each throat ─────────────────
        for (let mc = 0; mc < 5; mc++) {
            const mcZ = -2 + mc * 1;
            const coil = new THREE.Mesh(
                new THREE.TorusGeometry(4.5, 0.08, 8, 64),
                _solidGlow(0x4488ff, 0.6)
            );
            coil.position.z = mcZ;
            assembly.add(coil);
        }

        // Destination label backing plate
        const labelPlate = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.8, 0.1),
            _panelMat()
        );
        labelPlate.position.set(0, -5.5, 0);
        assembly.add(labelPlate);

        // Label indicator LED strip
        const ledStrip = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.1, 0.12),
            _glow(dest.throat, 2.0)
        );
        ledStrip.position.set(0, -5.1, 0);
        assembly.add(ledStrip);

        throatAssemblies.add(assembly);
    }
    group.add(throatAssemblies);

    // ════════════════════════════════════════════════════════════════════════
    // 4. EXOTIC MATTER CENTRAL GENERATOR — Heart of the Hub
    // ════════════════════════════════════════════════════════════════════════
    const exoticGenerator = new THREE.Group();

    // Main containment vessel — lathe-generated shape
    const vesselProfile = [
        new THREE.Vector2(0, -3),
        new THREE.Vector2(1.5, -2.8),
        new THREE.Vector2(2.5, -2),
        new THREE.Vector2(3.0, -1),
        new THREE.Vector2(3.2, 0),
        new THREE.Vector2(3.0, 1),
        new THREE.Vector2(2.5, 2),
        new THREE.Vector2(1.5, 2.8),
        new THREE.Vector2(0, 3)
    ];
    const vesselGeo = new THREE.LatheGeometry(vesselProfile, 64);
    const vessel = new THREE.Mesh(vesselGeo, new THREE.MeshStandardMaterial({
        color: 0x110022, metalness: 0.85, roughness: 0.15,
        transparent: true, opacity: 0.6
    }));
    exoticGenerator.add(vessel);

    // Core plasma sphere
    const plasmaSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 48, 48),
        _glow(0x9c27b0, 4.0)
    );
    animatedMeshes.plasmaCore = plasmaSphere;
    exoticGenerator.add(plasmaSphere);

    // Inner rotating exotic matter ring
    const exoCoreRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.3, 16, 64),
        _exoticMat(0xaa00ff)
    );
    animatedMeshes.exoCoreRing = exoCoreRing;
    exoticGenerator.add(exoCoreRing);

    // Secondary perpendicular ring
    const exoCoreRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.2, 16, 64),
        _exoticMat(0x6600cc)
    );
    exoCoreRing2.rotation.x = Math.PI / 2;
    animatedMeshes.exoCoreRing2 = exoCoreRing2;
    exoticGenerator.add(exoCoreRing2);

    // Tertiary angled ring
    const exoCoreRing3 = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.15, 16, 64),
        _exoticMat(0x4400aa)
    );
    exoCoreRing3.rotation.x = Math.PI / 3;
    exoCoreRing3.rotation.y = Math.PI / 6;
    animatedMeshes.exoCoreRing3 = exoCoreRing3;
    exoticGenerator.add(exoCoreRing3);

    // Exotic matter distribution pipes to each spoke
    animatedMeshes.distPipes = [];
    for (let p = 0; p < 6; p++) {
        const pa = (p / 6) * Math.PI * 2;
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(pa) * 4, Math.sin(pa * 0.3) * 1.5, Math.sin(pa) * 4),
            new THREE.Vector3(Math.cos(pa) * 8, 0, Math.sin(pa) * 8),
            new THREE.Vector3(Math.cos(pa) * 11.5, 0, Math.sin(pa) * 11.5)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 48, 0.2, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, _exoticMat(DESTINATION_COLORS[p].exotic));
        animatedMeshes.distPipes.push(pipe);
        exoticGenerator.add(pipe);

        // Pipe junction valve
        const valve = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            chrome.clone()
        );
        valve.position.set(Math.cos(pa) * 6, 0, Math.sin(pa) * 6);
        exoticGenerator.add(valve);
    }

    group.add(exoticGenerator);

    // ════════════════════════════════════════════════════════════════════════
    // 5. TRANSIT SHIPS — Small vessels entering/exiting wormholes
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.ships = [];
    for (let si = 0; si < 6; si++) {
        const shipGroup = new THREE.Group();
        // Hull — elongated ellipsoid via lathe
        const shipProfile = [
            new THREE.Vector2(0, -1.2),
            new THREE.Vector2(0.18, -1.0),
            new THREE.Vector2(0.32, -0.6),
            new THREE.Vector2(0.35, 0),
            new THREE.Vector2(0.30, 0.4),
            new THREE.Vector2(0.20, 0.8),
            new THREE.Vector2(0.08, 1.1),
            new THREE.Vector2(0, 1.2)
        ];
        const shipHull = new THREE.Mesh(
            new THREE.LatheGeometry(shipProfile, 16),
            new THREE.MeshStandardMaterial({ color: 0xccccdd, metalness: 0.8, roughness: 0.2 })
        );
        shipGroup.add(shipHull);

        // Cockpit window
        const cockpit = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
            _glow(0x00ccff, 1.5)
        );
        cockpit.position.set(0.25, 0, -0.8);
        cockpit.rotation.z = -Math.PI / 2;
        shipGroup.add(cockpit);

        // Engine glow
        const engineGlow = new THREE.Mesh(
            new THREE.ConeGeometry(0.12, 0.5, 8),
            _glow(DESTINATION_COLORS[si].throat, 3.0)
        );
        engineGlow.position.y = 1.3;
        shipGroup.add(engineGlow);

        // Nacelle struts
        for (let ns = 0; ns < 2; ns++) {
            const side = ns === 0 ? 1 : -1;
            const strut = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.04, 0.04),
                darkSteel.clone()
            );
            strut.position.set(side * 0.3, 0, 0);
            shipGroup.add(strut);

            const nacelle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.08, 0.5, 8),
                _solidGlow(DESTINATION_COLORS[si].throat, 1.5)
            );
            nacelle.position.set(side * 0.55, 0, 0);
            shipGroup.add(nacelle);
        }

        shipGroup.scale.set(1.2, 1.2, 1.2);
        // Initial position near a wormhole
        const wa = (si / 6) * Math.PI * 2;
        shipGroup.userData = { angle: wa, progress: Math.random(), direction: si % 2 === 0 ? 1 : -1, wormholeIndex: si };
        animatedMeshes.ships.push(shipGroup);
        group.add(shipGroup);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 6. NAVIGATION BEACONS & APPROACH LIGHTS
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.beacons = [];
    for (let bi = 0; bi < 6; bi++) {
        const ba = (bi / 6) * Math.PI * 2;
        for (let bl = 0; bl < 5; bl++) {
            const dist = 14 + bl * 1.8;
            const beacon = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                _glow(DESTINATION_COLORS[bi].throat, 2.0)
            );
            beacon.position.set(Math.cos(ba) * dist, 0, Math.sin(ba) * dist);
            animatedMeshes.beacons.push(beacon);
            group.add(beacon);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // 7. UPPER & LOWER ANTENNA / SENSOR ARRAYS
    // ════════════════════════════════════════════════════════════════════════
    for (let side = 0; side < 2; side++) {
        const yDir = side === 0 ? 1 : -1;
        const antennaGroup = new THREE.Group();

        // Central mast
        const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.15, 8, 12),
            darkSteel.clone()
        );
        mast.position.y = yDir * 4;
        antennaGroup.add(mast);

        // Dish
        const dishGeo = new THREE.SphereGeometry(2.0, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
        const dish = new THREE.Mesh(dishGeo, aluminum.clone());
        dish.position.y = yDir * 8;
        if (yDir === -1) dish.rotation.x = Math.PI;
        antennaGroup.add(dish);

        // Feed horn
        const horn = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.15, 1.0, 8),
            chrome.clone()
        );
        horn.position.y = yDir * 7;
        antennaGroup.add(horn);

        // Sensor tip glow
        const sensorTip = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 12, 12),
            _glow(0x00ff88, 2.5)
        );
        sensorTip.position.y = yDir * 8.5;
        antennaGroup.add(sensorTip);

        // Sub-antennas
        for (let sa = 0; sa < 4; sa++) {
            const saAngle = (sa / 4) * Math.PI * 2;
            const subAnt = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.04, 3, 6),
                steel.clone()
            );
            subAnt.position.set(Math.cos(saAngle) * 1.5, yDir * 6, Math.sin(saAngle) * 1.5);
            subAnt.rotation.z = saAngle * 0.2;
            antennaGroup.add(subAnt);
        }

        group.add(antennaGroup);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 8. DOCKING BAY STRUCTURES along the torus
    // ════════════════════════════════════════════════════════════════════════
    for (let db = 0; db < 12; db++) {
        const dba = (db / 12) * Math.PI * 2;
        const bayGroup = new THREE.Group();
        bayGroup.position.set(Math.cos(dba) * 12, 0, Math.sin(dba) * 12);
        bayGroup.lookAt(0, 0, 0);

        // Bay hull
        const bayHull = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.0, 2.0),
            _hullMat()
        );
        bayGroup.add(bayHull);

        // Bay window
        const bayWindow = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.4),
            tinted.clone()
        );
        bayWindow.position.set(0, 0.2, 1.01);
        bayGroup.add(bayWindow);

        // Bay running light
        const bayLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            _glow(db % 2 === 0 ? 0xff0000 : 0x00ff00, 2.5)
        );
        bayLight.position.set(0.8, 0.5, 0);
        bayGroup.add(bayLight);

        group.add(bayGroup);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 9. GRAVITATIONAL LENS EFFECT RINGS — concentric around station
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.lensRings = [];
    for (let lr = 0; lr < 4; lr++) {
        const lensRing = new THREE.Mesh(
            new THREE.TorusGeometry(16 + lr * 3, 0.05, 8, 128),
            new THREE.MeshStandardMaterial({
                color: 0x4444ff, emissive: 0x2222aa, emissiveIntensity: 0.5,
                transparent: true, opacity: 0.15
            })
        );
        lensRing.rotation.x = Math.PI / 2;
        animatedMeshes.lensRings.push(lensRing);
        group.add(lensRing);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 10. CONTROL ROOM INTERIOR (visible through dome)
    // ════════════════════════════════════════════════════════════════════════
    const controlRoom = new THREE.Group();

    // Floor
    controlRoom.add(new THREE.Mesh(
        new THREE.CircleGeometry(2.8, 32),
        new THREE.MeshStandardMaterial({ color: 0x0a0a1a, metalness: 0.8, roughness: 0.3 })
    ));
    controlRoom.children[controlRoom.children.length - 1].rotation.x = -Math.PI / 2;
    controlRoom.children[controlRoom.children.length - 1].position.y = 2.51;

    // Holographic display table
    const holoTable = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.0, 0.15, 24),
        _panelMat()
    );
    holoTable.position.y = 3.2;
    controlRoom.add(holoTable);

    // Holographic projection above table
    const holoProjection = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 24, 24),
        _glow(0x00aaff, 1.5)
    );
    holoProjection.position.y = 3.8;
    animatedMeshes.holoProjection = holoProjection;
    controlRoom.add(holoProjection);

    // Console stations (6 around the room)
    for (let cs = 0; cs < 6; cs++) {
        const csa = (cs / 6) * Math.PI * 2;
        const console = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.6, 0.3),
            _panelMat()
        );
        console.position.set(Math.cos(csa) * 2.0, 3.0, Math.sin(csa) * 2.0);
        console.lookAt(0, 3.0, 0);
        controlRoom.add(console);

        // Screen glow
        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(0.6, 0.35),
            _glow(DESTINATION_COLORS[cs].throat, 1.2)
        );
        screen.position.set(Math.cos(csa) * 1.85, 3.15, Math.sin(csa) * 1.85);
        screen.lookAt(0, 3.15, 0);
        controlRoom.add(screen);
    }

    // Operator chairs
    for (let ch = 0; ch < 6; ch++) {
        const cha = (ch / 6) * Math.PI * 2;
        const chair = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.5, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x222244, metalness: 0.5, roughness: 0.6 })
        );
        chair.position.set(Math.cos(cha) * 2.4, 2.8, Math.sin(cha) * 2.4);
        controlRoom.add(chair);
    }

    group.add(controlRoom);

    // ════════════════════════════════════════════════════════════════════════
    // 11. EXOTIC MATTER PARTICLE STREAMS — flowing from generator to throats
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.particles = [];
    for (let pi = 0; pi < 6; pi++) {
        const pAngle = (pi / 6) * Math.PI * 2;
        const particleCount = 20;
        for (let pp = 0; pp < particleCount; pp++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 6, 6),
                _glow(DESTINATION_COLORS[pi].exotic, 3.0)
            );
            particle.userData = {
                spokeAngle: pAngle,
                offset: pp / particleCount,
                speed: 0.3 + Math.random() * 0.4,
                maxDist: 22
            };
            animatedMeshes.particles.push(particle);
            group.add(particle);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // 12. GRAVITATIONAL WAVE DETECTOR ARMS
    // ════════════════════════════════════════════════════════════════════════
    for (let gw = 0; gw < 3; gw++) {
        const gwAngle = (gw / 3) * Math.PI * 2 + Math.PI / 6;
        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 30, 8),
            new THREE.MeshStandardMaterial({
                color: 0x880088, emissive: 0x440044, emissiveIntensity: 0.5,
                transparent: true, opacity: 0.4
            })
        );
        arm.position.set(Math.cos(gwAngle) * 15, 3, Math.sin(gwAngle) * 15);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = gwAngle;
        group.add(arm);

        // Detector end mirror
        const mirror = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16),
            chrome.clone()
        );
        mirror.position.set(Math.cos(gwAngle) * 30, 3, Math.sin(gwAngle) * 30);
        group.add(mirror);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 13. SAFETY BARRIER / CONTAINMENT FIELD POSTS
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.fieldPosts = [];
    for (let fp = 0; fp < 24; fp++) {
        const fpa = (fp / 24) * Math.PI * 2;
        const post = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 4, 8),
            darkSteel.clone()
        );
        post.position.set(Math.cos(fpa) * 28, 0, Math.sin(fpa) * 28);
        group.add(post);

        const postLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            _glow(0xffaa00, 2.0)
        );
        postLight.position.set(Math.cos(fpa) * 28, 2.1, Math.sin(fpa) * 28);
        animatedMeshes.fieldPosts.push(postLight);
        group.add(postLight);
    }

    // Containment field lines between posts
    for (let fl = 0; fl < 24; fl++) {
        const a1 = (fl / 24) * Math.PI * 2;
        const a2 = ((fl + 1) / 24) * Math.PI * 2;
        const fieldCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(a1) * 28, 1, Math.sin(a1) * 28),
            new THREE.Vector3(
                Math.cos((a1 + a2) / 2) * 28.5,
                1.5,
                Math.sin((a1 + a2) / 2) * 28.5
            ),
            new THREE.Vector3(Math.cos(a2) * 28, 1, Math.sin(a2) * 28)
        ]);
        const fieldLine = new THREE.Mesh(
            new THREE.TubeGeometry(fieldCurve, 12, 0.03, 4, false),
            new THREE.MeshStandardMaterial({
                color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 1.0,
                transparent: true, opacity: 0.3
            })
        );
        group.add(fieldLine);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 14. WORMHOLE THROAT FRAME BRACING — geodesic frame per throat
    // ════════════════════════════════════════════════════════════════════════
    for (let wf = 0; wf < 6; wf++) {
        const wfa = (wf / 6) * Math.PI * 2;
        const dist = 22;
        const frameGroup = new THREE.Group();
        frameGroup.position.set(Math.cos(wfa) * dist, 0, Math.sin(wfa) * dist);
        frameGroup.lookAt(0, 0, 0);

        // Geodesic frame struts
        for (let gs = 0; gs < 16; gs++) {
            const gsa = (gs / 16) * Math.PI * 2;
            const strut = new THREE.Mesh(
                new THREE.CylinderGeometry(0.07, 0.07, 7, 6),
                darkSteel.clone()
            );
            strut.position.set(Math.cos(gsa) * 5, Math.sin(gsa) * 5, 0);
            const nextA = ((gs + 3) / 16) * Math.PI * 2;
            strut.lookAt(Math.cos(nextA) * 5, Math.sin(nextA) * 5, 1.5);
            frameGroup.add(strut);
        }

        // Frame connection nodes
        for (let gn = 0; gn < 16; gn++) {
            const gna = (gn / 16) * Math.PI * 2;
            const node = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.15),
                chrome.clone()
            );
            node.position.set(Math.cos(gna) * 5, Math.sin(gna) * 5, 0);
            frameGroup.add(node);
        }

        group.add(frameGroup);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 15. POWER REACTOR PODS — attached below the torus
    // ════════════════════════════════════════════════════════════════════════
    animatedMeshes.reactorGlows = [];
    for (let rp = 0; rp < 6; rp++) {
        const rpa = (rp / 6) * Math.PI * 2 + Math.PI / 12;
        const reactor = new THREE.Group();
        reactor.position.set(Math.cos(rpa) * 12, -4, Math.sin(rpa) * 12);

        // Reactor casing
        const casing = new THREE.Mesh(
            new THREE.CylinderGeometry(1.0, 1.2, 2.5, 12),
            _hullMat()
        );
        reactor.add(casing);

        // Reactor core glow
        const coreGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 16, 16),
            _glow(0xff4400, 3.0)
        );
        coreGlow.position.y = 0;
        animatedMeshes.reactorGlows.push(coreGlow);
        reactor.add(coreGlow);

        // Coolant pipes
        for (let cp = 0; cp < 3; cp++) {
            const cpa = (cp / 3) * Math.PI * 2;
            const coolant = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 3, 8),
                copper.clone()
            );
            coolant.position.set(Math.cos(cpa) * 1.3, 0, Math.sin(cpa) * 1.3);
            reactor.add(coolant);
        }

        // Heat radiator fins
        for (let hf = 0; hf < 4; hf++) {
            const hfa = (hf / 4) * Math.PI * 2;
            const fin = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 2.0, 1.5),
                new THREE.MeshStandardMaterial({
                    color: 0x333344, metalness: 0.7, roughness: 0.3,
                    emissive: 0x220000, emissiveIntensity: 0.3
                })
            );
            fin.position.set(Math.cos(hfa) * 1.5, 0, Math.sin(hfa) * 1.5);
            fin.rotation.y = hfa;
            reactor.add(fin);
        }

        group.add(reactor);
    }

    // ════════════════════════════════════════════════════════════════════════
    // PARTS MANIFEST
    // ════════════════════════════════════════════════════════════════════════
    const parts = [
        {
            name: 'Central Toroidal Station',
            description: 'Primary habitat and operations ring housing crew quarters, laboratories, and command facilities. Provides centrifugal gravity via slow rotation.',
            material: 'Titanium-Carbide composite hull with radiation shielding',
            function: 'Houses all station personnel and central operations; structural backbone of the network hub',
            assemblyOrder: 1,
            connections: ['Command Sphere', 'Structural Spokes', 'Docking Bays', 'Power Reactor Pods'],
            failureEffect: 'Complete station loss — loss of life support, structural integrity compromised',
            cascadeFailures: ['Command Sphere', 'Docking Bays'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 0 }
        },
        {
            name: 'Command Sphere',
            description: 'Armoured central sphere housing the main control room, holographic navigation displays, and wormhole network management consoles.',
            material: 'Reinforced nanocarbon lattice with EM-shielded tinted observation dome',
            function: 'Centralized command and control of all wormhole operations, traffic management, and emergency protocols',
            assemblyOrder: 2,
            connections: ['Central Toroidal Station', 'Holographic Display Array', 'Sensor Arrays'],
            failureEffect: 'Loss of centralised coordination; wormhole operations revert to autonomous mode',
            cascadeFailures: ['Holographic Display Array'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 12, z: 0 }
        },
        {
            name: 'Wormhole Throat Assembly (×6)',
            description: 'Morris-Thorne type stabilized wormhole throats with nested toroidal confinement rings. Each throat is tuned to a specific spacetime coordinate for its destination.',
            material: 'Casimir-effect metamaterial throat lining with exotic-matter-infused confinement rings',
            function: 'Maintains stable traversable wormhole connections; each throat sustains a permanent Einstein-Rosen bridge',
            assemblyOrder: 5,
            connections: ['Exotic Matter Generator Rings', 'Structural Spokes', 'Stabilizer Pylons', 'Magnetic Coils'],
            failureEffect: 'Wormhole collapse — throat pinch-off, severing connection to destination; potential naked singularity formation',
            cascadeFailures: ['Exotic Matter Generator Rings', 'Transit Ships'],
            originalPosition: { x: 22, y: 0, z: 0 },
            explodedPosition: { x: 35, y: 0, z: 0 }
        },
        {
            name: 'Exotic Matter Central Generator',
            description: 'Quantum vacuum energy harvester producing negative-energy-density exotic matter required to hold wormhole throats open. Uses Casimir effect amplification.',
            material: 'Superconducting quantum metamaterial containment vessel',
            function: 'Generates and distributes exotic matter (negative energy density) to all six wormhole throats, satisfying the ANEC-violating stress-energy requirements',
            assemblyOrder: 3,
            connections: ['Exotic Matter Distribution Pipes', 'Power Reactor Pods', 'Central Toroidal Station'],
            failureEffect: 'All wormholes collapse simultaneously within ~0.3 seconds as exotic matter supply ceases',
            cascadeFailures: ['Wormhole Throat Assembly (×6)', 'Exotic Matter Generator Rings'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -12, z: 0 }
        },
        {
            name: 'Exotic Matter Generator Rings (×18)',
            description: 'Three concentric exotic matter injection rings per wormhole throat, providing localized ANEC-violating energy distribution.',
            material: 'Casimir-cavity metamaterial with superconducting flux channels',
            function: 'Locally injects exotic matter into each throat to maintain the flare-out condition (dr/dl > 0 at throat)',
            assemblyOrder: 6,
            connections: ['Wormhole Throat Assembly (×6)', 'Exotic Matter Central Generator'],
            failureEffect: 'Individual wormhole destabilisation; throat begins to pinch and oscillate',
            cascadeFailures: ['Wormhole Throat Assembly (×6)'],
            originalPosition: { x: 22, y: 0, z: 0 },
            explodedPosition: { x: 38, y: 5, z: 0 }
        },
        {
            name: 'Structural Spokes (×6)',
            description: 'Heavy-duty truss beams with cross-bracing and integrated power/exotic-matter conduits connecting the central station to each wormhole pylon.',
            material: 'Carbon-nanotube reinforced titanium truss with superconducting conduit sheath',
            function: 'Structural support and power/exotic-matter transport between station core and wormhole assemblies',
            assemblyOrder: 4,
            connections: ['Central Toroidal Station', 'Wormhole Throat Assembly (×6)'],
            failureEffect: 'Loss of structural connection to affected wormhole; exotic matter flow interrupted',
            cascadeFailures: ['Wormhole Throat Assembly (×6)'],
            originalPosition: { x: 11, y: 0, z: 0 },
            explodedPosition: { x: 11, y: 8, z: 0 }
        },
        {
            name: 'Transit Ships (×6)',
            description: 'Wormhole-rated transport vessels with radiation-hardened hulls, tidal-force compensators, and exotic-matter-compatible navigation systems.',
            material: 'Ablative nanocarbon hull with Faraday-cage electromagnetic shielding',
            function: 'Transport cargo and personnel through stabilized wormhole throats between network nodes',
            assemblyOrder: 10,
            connections: ['Wormhole Throat Assembly (×6)', 'Docking Bays', 'Navigation Beacons'],
            failureEffect: 'Ship loss during transit; potential tidal disruption if wormhole stability is marginal',
            cascadeFailures: [],
            originalPosition: { x: 18, y: 0, z: 0 },
            explodedPosition: { x: 18, y: 10, z: 0 }
        },
        {
            name: 'Stabilizer Pylons (×48)',
            description: 'Radial strut assemblies with active feedback control providing real-time throat geometry adjustment.',
            material: 'Piezoelectric smart alloy with nanoscale strain sensors',
            function: 'Active stabilisation of wormhole throat geometry; compensate for tidal fluctuations and metric perturbations',
            assemblyOrder: 7,
            connections: ['Wormhole Throat Assembly (×6)', 'Command Sphere'],
            failureEffect: 'Throat geometry oscillations; increased tidal forces for transiting vessels',
            cascadeFailures: [],
            originalPosition: { x: 22, y: 5, z: 0 },
            explodedPosition: { x: 32, y: 12, z: 0 }
        },
        {
            name: 'Magnetic Confinement Coils (×30)',
            description: 'High-temperature superconducting coils generating magnetic fields to confine exotic matter streams within the throat region.',
            material: 'YBCO superconductor in cryogenic housing',
            function: 'Magnetic confinement of exotic matter plasma; prevents dissipation and maintains throat energy density',
            assemblyOrder: 8,
            connections: ['Wormhole Throat Assembly (×6)', 'Power Reactor Pods'],
            failureEffect: 'Exotic matter dispersal; throat energy density drops below critical threshold',
            cascadeFailures: ['Exotic Matter Generator Rings (×18)'],
            originalPosition: { x: 22, y: 0, z: 2 },
            explodedPosition: { x: 34, y: -5, z: 6 }
        },
        {
            name: 'Sensor Arrays (Upper & Lower)',
            description: 'Gravitational wave interferometers, neutrino detectors, and spacetime curvature sensors monitoring all wormhole connections.',
            material: 'Ultra-precision laser interferometer with supercooled photodetectors',
            function: 'Real-time monitoring of spacetime curvature, gravitational wave detection, and early warning of throat instabilities',
            assemblyOrder: 9,
            connections: ['Command Sphere', 'Gravitational Wave Detector Arms'],
            failureEffect: 'Loss of situational awareness; cannot detect impending throat collapse',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 8, z: 0 },
            explodedPosition: { x: 0, y: 18, z: 0 }
        },
        {
            name: 'Holographic Display Array',
            description: 'Volumetric holographic projection system showing real-time network topology, ship positions, and throat stability metrics.',
            material: 'Photonic crystal display matrix with AI-driven rendering',
            function: 'Visual representation of entire wormhole network state for command crew',
            assemblyOrder: 11,
            connections: ['Command Sphere', 'Sensor Arrays'],
            failureEffect: 'Command crew loses visual overview; must rely on raw telemetry',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 3.8, z: 0 },
            explodedPosition: { x: 0, y: 15, z: 0 }
        },
        {
            name: 'Navigation Beacons (×30)',
            description: 'Approach lane markers guiding ships along safe transit corridors to each wormhole throat.',
            material: 'High-intensity photonic emitters with IFF transponders',
            function: 'Provide visual and electromagnetic guidance for ship approach and alignment with throat entry vector',
            assemblyOrder: 12,
            connections: ['Transit Ships (×6)', 'Command Sphere'],
            failureEffect: 'Ships must navigate manually; increased collision risk',
            cascadeFailures: [],
            originalPosition: { x: 18, y: 0, z: 0 },
            explodedPosition: { x: 24, y: -8, z: 0 }
        },
        {
            name: 'Power Reactor Pods (×6)',
            description: 'Compact fusion reactors providing the enormous energy budget required to sustain six simultaneous wormhole connections.',
            material: 'Deuterium-Tritium tokamak with superconducting magnetic confinement',
            function: 'Power generation for exotic matter production, magnetic coils, life support, and all station systems',
            assemblyOrder: 3,
            connections: ['Exotic Matter Central Generator', 'Central Toroidal Station', 'Magnetic Confinement Coils (×30)'],
            failureEffect: 'Cascading power loss; emergency exotic matter reserves give ~45 seconds before first throat collapse',
            cascadeFailures: ['Exotic Matter Central Generator', 'Magnetic Confinement Coils (×30)'],
            originalPosition: { x: 12, y: -4, z: 0 },
            explodedPosition: { x: 12, y: -14, z: 0 }
        },
        {
            name: 'Containment Field Perimeter',
            description: 'Electrostatic containment barrier surrounding the entire hub, preventing debris, radiation, and unauthorized approach.',
            material: 'Plasma-magnetic hybrid barrier with failsafe grounding posts',
            function: 'Station defense perimeter; contains exotic radiation; prevents micro-meteorite impacts on critical throat structures',
            assemblyOrder: 13,
            connections: ['Power Reactor Pods (×6)', 'Command Sphere'],
            failureEffect: 'Station exposed to external hazards; exotic radiation leakage',
            cascadeFailures: [],
            originalPosition: { x: 28, y: 0, z: 0 },
            explodedPosition: { x: 40, y: 0, z: 0 }
        },
        {
            name: 'Gravitational Wave Detector Arms (×3)',
            description: 'LIGO-style laser interferometer arms extending from the station to detect gravitational perturbations from wormhole operations.',
            material: 'Ultra-high-vacuum laser pathway with suspended test masses',
            function: 'Detects gravitational wave signatures from throat oscillations and approaching massive objects',
            assemblyOrder: 14,
            connections: ['Sensor Arrays (Upper & Lower)', 'Command Sphere'],
            failureEffect: 'Cannot detect gravitational anomalies; reduced warning time for instabilities',
            cascadeFailures: [],
            originalPosition: { x: 15, y: 3, z: 0 },
            explodedPosition: { x: 20, y: 16, z: 0 }
        },
        {
            name: 'Docking Bays (×12)',
            description: 'Ship berthing facilities integrated into the toroidal hull, providing refuelling, maintenance, and crew transfer.',
            material: 'Reinforced docking clamp assemblies with atmospheric seals',
            function: 'Secure ship docking, cargo transfer, passenger embarkation, and vessel maintenance',
            assemblyOrder: 15,
            connections: ['Central Toroidal Station', 'Transit Ships (×6)'],
            failureEffect: 'Ships cannot dock safely; must use emergency tether procedures',
            cascadeFailures: [],
            originalPosition: { x: 12, y: 0, z: 0 },
            explodedPosition: { x: 16, y: -6, z: 0 }
        }
    ];

    // ════════════════════════════════════════════════════════════════════════
    // QUIZ QUESTIONS — PhD-level General Relativity & Wormhole Physics
    // ════════════════════════════════════════════════════════════════════════
    const quizQuestions = [
        {
            question: 'In the Morris-Thorne wormhole metric ds² = -e^(2Φ)dt² + dr²/(1 - b(r)/r) + r²dΩ², what physical condition must the "shape function" b(r) satisfy at the throat radius r₀ to ensure traversability, and why does this condition necessitate exotic matter?',
            options: [
                'b(r₀) = r₀ and b\'(r₀) < 1 (flare-out condition); this requires the stress-energy tensor to violate the Averaged Null Energy Condition (ANEC)',
                'b(r₀) = 0 and b\'(r₀) = 0 to ensure a smooth manifold at the throat',
                'b(r₀) = 2M (Schwarzschild radius) ensuring the throat is hidden behind a horizon',
                'b(r₀) > r₀ so that the throat is super-critical and self-sustaining without exotic matter'
            ],
            correctAnswer: 0,
            explanation: 'At the throat r = r₀, the shape function must satisfy b(r₀) = r₀ (defining the throat) and the flare-out condition b\'(r₀) < 1 (equivalently, (b - b\'r)/b² > 0). Via the Einstein field equations, the flare-out condition implies that the stress-energy tensor component (τ - ρ) must be positive at the throat, meaning ρ + p_r < 0. This violates the Null Energy Condition (NEC), and for any complete geodesic through the throat, the ANEC (∫T_μν k^μ k^ν dλ ≥ 0) is also violated. Only "exotic matter" with negative energy density can achieve this.'
        },
        {
            question: 'The Averaged Null Energy Condition (ANEC) states ∫T_μν k^μ k^ν dλ ≥ 0 along complete null geodesics. In the context of this wormhole hub, how does the Casimir effect in the exotic matter generators provide a physical mechanism for ANEC violation, and what are the known limitations?',
            options: [
                'The Casimir effect produces unbounded negative energy that trivially violates ANEC at any scale',
                'The Casimir effect produces locally negative vacuum energy density between conducting plates, but the magnitude scales as 1/d⁴ (plate separation), making macroscopic throat stabilisation require astronomically precise nanoscale engineering; additionally, Ford-Roman quantum inequalities constrain the magnitude and duration of negative energy fluxes',
                'The Casimir effect only works for photons and cannot generate the exotic matter needed for fermion-traversable wormholes',
                'ANEC violation is impossible in any quantum field theory on curved spacetime; the Casimir effect is irrelevant'
            ],
            correctAnswer: 1,
            explanation: 'The Casimir effect between closely-spaced conducting plates produces a negative vacuum energy density ρ ∝ -ℏcπ²/(720d⁴). This is a genuine ANEC-violating quantum effect. However, the Ford-Roman quantum inequalities place severe constraints: the product of negative energy density and the time interval over which it persists is bounded (|ΔE| · Δt ≲ ℏ). Scaling this to macroscopic wormhole throats requires plate separations of order the Planck length, making practical implementation with current physics extraordinarily challenging.'
        },
        {
            question: 'For a traveller passing through one of these wormhole throats, the tidal acceleration they experience is related to the Riemann curvature tensor. In the Morris-Thorne framework, what is the traversability condition on tidal forces, expressed in terms of the metric functions Φ(r) and b(r)?',
            options: [
                'The tidal forces must not exceed ~1g across the traveller\'s body: |R^r̂_t̂r̂t̂| = |(1-b/r)[Φ\'\' + Φ\'² - b\'r-b/(2r(r-b))Φ\' + Φ\'/r]| ≤ 1/(body height)² in geometrized units, constraining the redshift function Φ(r) to be slowly varying',
                'Tidal forces are always zero inside a wormhole because spacetime is flat at the throat',
                'Tidal forces are only important for massless particles; massive travellers are protected by their inertia',
                'The traversability condition requires the traveller to exceed the speed of light to avoid tidal disruption'
            ],
            correctAnswer: 0,
            explanation: 'The radial tidal acceleration experienced by a traveller with body height η is a_tidal = |R^r̂_t̂r̂t̂| · η · c². The component R^r̂_t̂r̂t̂ depends on both Φ(r) (the redshift function) and b(r) (the shape function) and their derivatives. For comfortable human traversal, this must be ≤ g_Earth/η ≈ 1/(2m)² in appropriate units. This constrains Φ(r) to vary slowly (|Φ\'| small) and limits how rapidly b(r) changes, effectively requiring a "gentle" throat geometry with large throat radius.'
        },
        {
            question: 'If the hub operators wanted to create a NEW wormhole connection (a seventh throat), general relativity poses fundamental topological obstacles. What is the key theorem that restricts spacetime topology change, and how might this be circumvented?',
            options: [
                'The Geroch theorem states that topology change in a globally hyperbolic spacetime necessarily involves either closed timelike curves (CTCs) or singularities. Circumvention might involve operating briefly in a non-globally-hyperbolic regime with controlled CTC formation, or exploiting quantum gravity effects at the Planck scale where the classical theorem breaks down.',
                'Topology change is freely allowed in general relativity and poses no theoretical obstacle',
                'The Penrose singularity theorem forbids topology change entirely with no known exceptions',
                'Topology change requires violating energy conservation, which is impossible even with exotic matter'
            ],
            correctAnswer: 0,
            explanation: 'The Geroch theorem (1967) proves that in a spacetime with a well-defined Cauchy surface (globally hyperbolic), a change in spatial topology (such as forming a new wormhole handle on the spatial manifold) necessarily implies either the existence of closed timelike curves or the breakdown of the manifold structure (singularities). This is because the cobordism between different spatial topologies requires a Lorentzian manifold that cannot maintain a global time function. Potential circumventions include: (1) allowing transient CTCs in a controlled region, (2) invoking quantum gravity where the classical notion of smooth manifold topology breaks down (e.g., spacetime foam), or (3) using the ER=EPR conjecture where entangled quantum states might provide topological connections without classical topology change.'
        },
        {
            question: 'This hub connects six wormholes to different regions of the universe. If wormhole mouths are in relative motion or at different gravitational potentials, what relativistic paradox can arise, and how does the Hawking Chronology Protection Conjecture address it?',
            options: [
                'The wormholes would emit Hawking radiation at different rates, causing an energy imbalance that destroys the hub',
                'If one mouth undergoes time dilation (gravitational or kinematic) relative to another, a CTC can form, allowing causal paradoxes. Hawking\'s Chronology Protection Conjecture posits that quantum back-reaction (vacuum polarisation divergences on the Cauchy horizon) will destroy the wormhole before a CTC fully forms, preventing time travel.',
                'Wormholes in different gravitational fields are automatically unstable due to the equivalence principle',
                'Relativistic length contraction makes the wormhole throats physically impossible to traverse at different potentials'
            ],
            correctAnswer: 1,
            explanation: 'If wormhole mouth A is in a stronger gravitational field than mouth B (or if A is boosted to relativistic speed and returned), the differential time dilation means that a signal entering B, traversing the wormhole to A, and then travelling back to B through external spacetime could arrive before it was sent — forming a closed timelike curve. Hawking\'s Chronology Protection Conjecture (1992) argues that the renormalized stress-energy tensor of quantum fields diverges on the chronology horizon (the boundary of the region containing CTCs), creating a singularity that destroys the wormhole before any CTC can form. This has been supported by calculations of the vacuum polarisation of scalar fields on Misner space and in Deutsch-Politzer spacetimes, but a definitive proof requires a complete theory of quantum gravity.'
        }
    ];

    // ════════════════════════════════════════════════════════════════════════
    // ANIMATION FUNCTION — extreme synchronised animation
    // ════════════════════════════════════════════════════════════════════════
    function animate(time, speed, meshes) {
        const t = time * speed;

        // ── Wormhole throat ring pulsation ───────────────────────────────
        if (animatedMeshes.throats) {
            animatedMeshes.throats.forEach((throatGroup, idx) => {
                throatGroup.children.forEach((ring, ri) => {
                    const phase = t * 2.5 + ri * 0.4 + idx * 1.1;
                    const scale = 1.0 + 0.08 * Math.sin(phase);
                    ring.scale.set(scale, scale, 1);
                    ring.rotation.z = t * 0.3 + ri * 0.1;
                    if (ring.material && ring.material.emissiveIntensity !== undefined) {
                        ring.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(phase * 1.3);
                    }
                });
            });
        }

        // ── Throat inner membrane rotation ──────────────────────────────
        if (animatedMeshes.throatInners) {
            animatedMeshes.throatInners.forEach((inner, idx) => {
                inner.rotation.y = t * 0.8 + idx * 1.05;
                if (inner.material) {
                    inner.material.opacity = 0.15 + 0.12 * Math.sin(t * 1.5 + idx);
                }
            });
        }

        // ── Destination disc pulsing ────────────────────────────────────
        if (animatedMeshes.destinationDiscs) {
            animatedMeshes.destinationDiscs.forEach((disc, idx) => {
                const pulse = 0.6 + 0.2 * Math.sin(t * 3.0 + idx * 1.05);
                disc.material.opacity = pulse;
                disc.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(t * 2.0 + idx * 0.7);
                disc.rotation.z = t * 0.2;
            });
        }

        // ── Exotic matter ring rotation ─────────────────────────────────
        if (animatedMeshes.exoticRings) {
            animatedMeshes.exoticRings.forEach((ring, idx) => {
                ring.rotation.z = t * (0.5 + idx * 0.1);
                ring.rotation.x = Math.sin(t * 0.3 + idx * 0.5) * 0.15;
                if (ring.material) {
                    ring.material.opacity = 0.4 + 0.2 * Math.sin(t * 2.0 + idx * 0.4);
                }
            });
        }

        // ── Central exotic generator core ───────────────────────────────
        if (animatedMeshes.plasmaCore) {
            const pScale = 1.0 + 0.15 * Math.sin(t * 4.0);
            animatedMeshes.plasmaCore.scale.set(pScale, pScale, pScale);
            animatedMeshes.plasmaCore.material.emissiveIntensity = 3.0 + 2.0 * Math.sin(t * 5.0);
        }
        if (animatedMeshes.exoCoreRing) {
            animatedMeshes.exoCoreRing.rotation.z = t * 1.5;
            animatedMeshes.exoCoreRing.rotation.x = t * 0.7;
        }
        if (animatedMeshes.exoCoreRing2) {
            animatedMeshes.exoCoreRing2.rotation.y = t * 1.2;
            animatedMeshes.exoCoreRing2.rotation.z = t * 0.5;
        }
        if (animatedMeshes.exoCoreRing3) {
            animatedMeshes.exoCoreRing3.rotation.x = t * 0.9;
            animatedMeshes.exoCoreRing3.rotation.y = t * 1.1;
        }

        // ── Ship transit animation ──────────────────────────────────────
        if (animatedMeshes.ships) {
            animatedMeshes.ships.forEach((ship) => {
                const sd = ship.userData;
                sd.progress += sd.speed * speed * 0.005 * sd.direction;
                if (sd.progress > 1.0) { sd.progress = 1.0; sd.direction = -1; }
                if (sd.progress < -0.3) { sd.progress = -0.3; sd.direction = 1; }

                const wa = sd.angle;
                const dist = 5 + sd.progress * 20;
                ship.position.set(
                    Math.cos(wa) * dist,
                    Math.sin(t * 0.5 + sd.angle) * 0.5,
                    Math.sin(wa) * dist
                );
                ship.lookAt(Math.cos(wa) * 22, 0, Math.sin(wa) * 22);

                // Scale effect near throat (visual squish)
                const throatProximity = Math.max(0, 1.0 - Math.abs(dist - 22) / 5);
                const squish = 1.0 - throatProximity * 0.3;
                ship.scale.set(1.2 * squish, 1.2, 1.2 / squish);
            });
        }

        // ── Exotic matter particle stream ───────────────────────────────
        if (animatedMeshes.particles) {
            animatedMeshes.particles.forEach((particle) => {
                const pd = particle.userData;
                const progress = (pd.offset + t * pd.speed * 0.15) % 1.0;
                const dist = 3 + progress * (pd.maxDist - 3);
                particle.position.set(
                    Math.cos(pd.spokeAngle) * dist,
                    Math.sin(t * 3.0 + pd.offset * 10) * 0.4,
                    Math.sin(pd.spokeAngle) * dist
                );
                const glow = 0.5 + 0.5 * Math.sin(t * 8.0 + pd.offset * 20);
                particle.material.opacity = glow;
                particle.material.emissiveIntensity = 2.0 + 2.0 * glow;
            });
        }

        // ── Navigation beacon blinking ──────────────────────────────────
        if (animatedMeshes.beacons) {
            animatedMeshes.beacons.forEach((beacon, idx) => {
                const blink = Math.sin(t * 4.0 + idx * 1.3) > 0.2 ? 1.0 : 0.15;
                beacon.material.opacity = blink;
                beacon.material.emissiveIntensity = blink * 3.0;
            });
        }

        // ── Holographic projection spin ─────────────────────────────────
        if (animatedMeshes.holoProjection) {
            animatedMeshes.holoProjection.rotation.y = t * 2.0;
            animatedMeshes.holoProjection.rotation.x = Math.sin(t * 0.5) * 0.3;
            const hScale = 0.8 + 0.3 * Math.sin(t * 1.5);
            animatedMeshes.holoProjection.scale.set(hScale, hScale, hScale);
            animatedMeshes.holoProjection.material.emissiveIntensity = 1.0 + 0.8 * Math.sin(t * 3.0);
        }

        // ── Gravitational lens ring oscillation ─────────────────────────
        if (animatedMeshes.lensRings) {
            animatedMeshes.lensRings.forEach((ring, idx) => {
                ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.2 + idx * 0.5) * 0.1;
                ring.rotation.z = t * 0.05 * (idx + 1);
                ring.material.opacity = 0.08 + 0.08 * Math.sin(t * 1.0 + idx);
            });
        }

        // ── Stabiliser pylon light pulsing ──────────────────────────────
        if (animatedMeshes.pylonLights) {
            animatedMeshes.pylonLights.forEach((light, idx) => {
                light.material.emissiveIntensity = 2.0 + 2.0 * Math.sin(t * 3.5 + idx * 0.5);
            });
        }

        // ── Containment field post lights ───────────────────────────────
        if (animatedMeshes.fieldPosts) {
            animatedMeshes.fieldPosts.forEach((post, idx) => {
                const blink = Math.sin(t * 2.0 + idx * 0.26) > 0 ? 1.0 : 0.2;
                post.material.emissiveIntensity = blink * 2.5;
            });
        }

        // ── Power reactor core pulsing ──────────────────────────────────
        if (animatedMeshes.reactorGlows) {
            animatedMeshes.reactorGlows.forEach((glow, idx) => {
                const rScale = 1.0 + 0.2 * Math.sin(t * 6.0 + idx * 1.05);
                glow.scale.set(rScale, rScale, rScale);
                glow.material.emissiveIntensity = 2.5 + 1.5 * Math.sin(t * 4.0 + idx * 0.7);
            });
        }

        // ── Distribution pipe glow cycling ──────────────────────────────
        if (animatedMeshes.distPipes) {
            animatedMeshes.distPipes.forEach((pipe, idx) => {
                pipe.material.opacity = 0.35 + 0.25 * Math.sin(t * 2.5 + idx * 1.05);
                pipe.material.emissiveIntensity = 2.5 + 2.0 * Math.sin(t * 3.0 + idx * 1.05);
            });
        }

        // ── Spoke conduit glow ──────────────────────────────────────────
        if (animatedMeshes.spokes) {
            animatedMeshes.spokes.forEach((conduit, idx) => {
                conduit.material.emissiveIntensity = 0.8 + 0.6 * Math.sin(t * 2.0 + idx * 1.05);
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // DESCRIPTION
    // ════════════════════════════════════════════════════════════════════════
    const description = `Wormhole Network Hub — a central space station connecting six stabilized Morris-Thorne traversable wormholes to different destinations across the cosmos. The hub features a massive toroidal habitat ring surrounding a command sphere, with six structural spokes extending to wormhole throat assemblies. Each throat is a carefully engineered Morris-Thorne geometry maintained by exotic matter generators that violate the Averaged Null Energy Condition (ANEC) through amplified Casimir effect technology. Transit ships move along beacon-lit approach corridors, entering and exiting the pulsing wormhole throats. The central exotic matter generator distributes negative-energy-density plasma through superconducting conduits to all six throats simultaneously. Gravitational wave detector arms monitor spacetime perturbations, while a containment field perimeter protects the station from external hazards and exotic radiation leakage. The entire facility represents the pinnacle of theoretical physics engineering — making Einstein-Rosen bridges practical transportation infrastructure.`;

    return { group, parts, description, quizQuestions, animate };
}
