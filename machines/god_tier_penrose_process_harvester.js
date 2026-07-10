import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM PENROSE PROCESS MATERIALS
    // ==========================================
    const ergosphereMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 3.0, transparent: true, opacity: 0.25, side: 2 });
    const eventHorizonMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1.0, roughness: 0.0, emissive: 0x000000 });
    const accretionMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 4.0, transparent: true, opacity: 0.7 });
    const jetMat = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0xaa00ff, emissiveIntensity: 5.0, transparent: true, opacity: 0.6 });
    const harvesterMat = new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.9, roughness: 0.2, emissive: 0x112233, emissiveIntensity: 0.3 });
    const energyBeamMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 5.0, transparent: true, opacity: 0.7 });
    const frameDragMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2266ff, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.3 });
    const photonSphereMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffcc00, emissiveIntensity: 3.0, transparent: true, opacity: 0.2, wireframe: true });
    const massProjectileMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    const fragmentMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 4.0 });
    const thermalMat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 3.0, transparent: true, opacity: 0.5 });

    // Dynamic arrays
    const accretionParticles = [];
    const frameDragRings = [];
    const massProjectiles = [];
    const energyBeams = [];
    const harvesterSegments = [];
    const jetParticles = [];
    const ergosphereElements = [];

    // ==========================================
    // 1. KERR BLACK HOLE - EVENT HORIZON
    // ==========================================
    const blackHoleGroup = new THREE.Group();

    // Inner event horizon (Cauchy horizon) - smaller sphere
    const innerHorizonGeo = new THREE.SphereGeometry(18, 48, 48);
    const innerHorizonMesh = new THREE.Mesh(innerHorizonGeo, eventHorizonMat);
    blackHoleGroup.add(innerHorizonMesh);
    parts.push({ mesh: innerHorizonMesh, name: 'Cauchy Inner Horizon (r₋)' });

    // Outer event horizon - larger sphere
    const outerHorizonGeo = new THREE.SphereGeometry(30, 64, 64);
    const outerHorizonMesh = new THREE.Mesh(outerHorizonGeo, eventHorizonMat);
    blackHoleGroup.add(outerHorizonMesh);
    parts.push({ mesh: outerHorizonMesh, name: 'Outer Event Horizon (r₊)' });

    // Photon sphere
    const photonSphereGeo = new THREE.SphereGeometry(45, 48, 48);
    const photonSphereMesh = new THREE.Mesh(photonSphereGeo, photonSphereMat);
    blackHoleGroup.add(photonSphereMesh);
    parts.push({ mesh: photonSphereMesh, name: 'Photon Sphere (r = 3M/2)' });

    // Ring singularity (torus at the center, since Kerr BH has ring singularity)
    const singularityGeo = new THREE.TorusGeometry(5, 0.5, 8, 64);
    const singularityMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10.0 });
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    singularityMesh.rotation.x = Math.PI / 2;
    blackHoleGroup.add(singularityMesh);
    parts.push({ mesh: singularityMesh, name: 'Ring Singularity' });

    group.add(blackHoleGroup);

    // ==========================================
    // 2. ERGOSPHERE - OBLATE SPHEROID
    // ==========================================
    const ergosphereGroup = new THREE.Group();

    // Ergosphere boundary - oblate ellipsoid (flattened at poles, wider at equator)
    const ergoGeo = new THREE.SphereGeometry(60, 64, 64);
    const ergoMesh = new THREE.Mesh(ergoGeo, ergosphereMat);
    ergoMesh.scale.set(1.0, 0.7, 1.0); // Oblate - flatter along spin axis (y)
    ergosphereGroup.add(ergoMesh);
    parts.push({ mesh: ergoMesh, name: 'Ergosphere Boundary' });

    // Ergosphere internal frame-dragging visualization rings
    for (let i = 0; i < 12; i++) {
        const dragRingGeo = new THREE.TorusGeometry(32 + i * 2.5, 0.4, 6, 48);
        const dragRingMesh = new THREE.Mesh(dragRingGeo, frameDragMat);
        dragRingMesh.rotation.x = Math.PI / 2;
        dragRingMesh.position.y = -15 + i * 2.5;
        ergosphereGroup.add(dragRingMesh);
        frameDragRings.push({ mesh: dragRingMesh, baseY: -15 + i * 2.5, index: i });
    }

    // Swirling spacetime current lines (helical curves)
    for (let j = 0; j < 8; j++) {
        const helixPoints = [];
        const helixAngleOffset = (j / 8) * Math.PI * 2;
        for (let t = 0; t < 100; t++) {
            const param = t / 100 * Math.PI * 4;
            const radius = 35 + t / 100 * 20;
            helixPoints.push(new THREE.Vector3(
                Math.cos(param + helixAngleOffset) * radius,
                (t / 100 - 0.5) * 40,
                Math.sin(param + helixAngleOffset) * radius
            ));
        }
        const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
        const helixGeo = new THREE.TubeGeometry(helixCurve, 80, 0.5, 6, false);
        const helixMesh = new THREE.Mesh(helixGeo, frameDragMat);
        ergosphereGroup.add(helixMesh);
        ergosphereElements.push({ mesh: helixMesh, type: 'helix' });
    }

    group.add(ergosphereGroup);

    // ==========================================
    // 3. ACCRETION DISK (InstancedMesh)
    // ==========================================
    const diskParticleCount = 3000;
    const diskParticleGeo = new THREE.SphereGeometry(0.8, 4, 4);
    const diskParticleMesh = new THREE.InstancedMesh(diskParticleGeo, accretionMat, diskParticleCount);
    const diskDummy = new THREE.Object3D();
    const diskData = [];

    for (let i = 0; i < diskParticleCount; i++) {
        const r = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * (4 + (r - 50) * 0.02); // Thicker at larger radii
        const orbitalSpeed = 1.0 / Math.sqrt(r / 50); // Keplerian velocity

        diskData.push({
            radius: r,
            theta: theta,
            height: height,
            speed: orbitalSpeed * (0.8 + Math.random() * 0.4),
            size: 0.4 + Math.random() * 1.2,
            temperature: Math.max(0, 1.0 - (r - 50) / 100) // Hotter closer to BH
        });

        diskDummy.position.set(
            Math.cos(theta) * r,
            height,
            Math.sin(theta) * r
        );
        diskDummy.scale.setScalar(diskData[i].size);
        diskDummy.updateMatrix();
        diskParticleMesh.setMatrixAt(i, diskDummy.matrix);
    }
    diskParticleMesh.instanceMatrix.needsUpdate = true;
    group.add(diskParticleMesh);
    accretionParticles.push({ mesh: diskParticleMesh, data: diskData, dummy: diskDummy });
    parts.push({ mesh: diskParticleMesh, name: 'Accretion Disk' });

    // ==========================================
    // 4. HARVESTING RING STATION
    // ==========================================
    const harvesterRingGroup = new THREE.Group();

    // Main structural ring
    const harvesterRingGeo = new THREE.TorusGeometry(160, 10, 16, 64);
    const harvesterRingMesh = new THREE.Mesh(harvesterRingGeo, harvesterMat);
    harvesterRingMesh.rotation.x = Math.PI / 2;
    harvesterRingGroup.add(harvesterRingMesh);
    parts.push({ mesh: harvesterRingMesh, name: 'Harvesting Ring Station' });

    // Docking bays and mass injectors around the ring (16 stations)
    for (let i = 0; i < 16; i++) {
        const stationAngle = (i / 16) * Math.PI * 2;
        const stationGroup = new THREE.Group();

        // Station body
        const stationBodyGeo = new THREE.BoxGeometry(15, 20, 12);
        const stationBodyMesh = new THREE.Mesh(stationBodyGeo, harvesterMat);
        stationGroup.add(stationBodyMesh);

        // Mass launcher barrel
        const launcherGeo = new THREE.CylinderGeometry(3, 4, 30, 8);
        const launcherMesh = new THREE.Mesh(launcherGeo, darkSteel);
        launcherMesh.position.y = -20;
        stationGroup.add(launcherMesh);
        parts.push({ mesh: launcherMesh, name: `Mass Launcher ${i + 1}` });

        // Energy collection dish
        const dishGeo = new THREE.SphereGeometry(8, 12, 12, 0, Math.PI * 2, 0, Math.PI / 3);
        const dishMesh = new THREE.Mesh(dishGeo, chrome);
        dishMesh.position.y = 15;
        dishMesh.rotation.x = Math.PI;
        stationGroup.add(dishMesh);

        // Capacitor banks
        for (let c = 0; c < 3; c++) {
            const capGeo = new THREE.CylinderGeometry(2, 2, 8, 6);
            const capMesh = new THREE.Mesh(capGeo, copper);
            capMesh.position.set(-6 + c * 6, 5, 8);
            stationGroup.add(capMesh);
        }

        stationGroup.position.set(
            Math.cos(stationAngle) * 160,
            0,
            Math.sin(stationAngle) * 160
        );
        stationGroup.lookAt(0, 0, 0);

        harvesterRingGroup.add(stationGroup);
        harvesterSegments.push({ group: stationGroup, angle: stationAngle, index: i });
    }

    // Connecting trusses between stations
    for (let i = 0; i < 16; i++) {
        const a1 = (i / 16) * Math.PI * 2;
        const a2 = ((i + 1) / 16) * Math.PI * 2;
        const midAngle = (a1 + a2) / 2;
        const trussGeo = new THREE.CylinderGeometry(1, 1, 62, 4);
        const trussMesh = new THREE.Mesh(trussGeo, aluminum);
        trussMesh.position.set(
            Math.cos(midAngle) * 160,
            15,
            Math.sin(midAngle) * 160
        );
        const tangentAngle = midAngle + Math.PI / 2;
        trussMesh.rotation.y = -tangentAngle;
        trussMesh.rotation.z = Math.PI / 2;
        harvesterRingGroup.add(trussMesh);
    }

    group.add(harvesterRingGroup);

    // ==========================================
    // 5. MASS PROJECTILE SYSTEM (InstancedMesh)
    // ==========================================
    const projectileCount = 200;
    const projectileGeo = new THREE.OctahedronGeometry(2, 0);
    const projectileMesh = new THREE.InstancedMesh(projectileGeo, massProjectileMat, projectileCount);
    const projectileDummy = new THREE.Object3D();
    const projectileData = [];

    for (let i = 0; i < projectileCount; i++) {
        // Start from harvester ring, spiral inward toward ergosphere
        const startAngle = Math.random() * Math.PI * 2;
        const phase = Math.random(); // 0 = at ring, 1 = at ergosphere split point

        projectileData.push({
            startAngle: startAngle,
            phase: phase,
            speed: 0.3 + Math.random() * 0.5,
            active: Math.random() > 0.3, // 70% active
            splitPoint: 0.7 + Math.random() * 0.2 // Where it splits in ergosphere
        });
    }

    projectileMesh.instanceMatrix.needsUpdate = true;
    group.add(projectileMesh);
    massProjectiles.push({ mesh: projectileMesh, data: projectileData, dummy: projectileDummy });
    parts.push({ mesh: projectileMesh, name: 'Mass Projectile Stream' });

    // ==========================================
    // 6. ENERGIZED FRAGMENT RETURN STREAM
    // ==========================================
    const fragmentCount = 150;
    const fragmentGeo = new THREE.TetrahedronGeometry(1.5, 1);
    const fragmentMesh = new THREE.InstancedMesh(fragmentGeo, fragmentMat, fragmentCount);
    const fragmentDummy = new THREE.Object3D();
    const fragmentData = [];

    for (let i = 0; i < fragmentCount; i++) {
        fragmentData.push({
            angle: Math.random() * Math.PI * 2,
            phase: Math.random(),
            speed: 0.5 + Math.random() * 1.0,
            active: Math.random() > 0.4
        });
    }
    group.add(fragmentMesh);
    parts.push({ mesh: fragmentMesh, name: 'Energized Fragment Stream' });

    // ==========================================
    // 7. RELATIVISTIC JETS (Polar)
    // ==========================================
    const jetGroup = new THREE.Group();

    // Upper jet cone
    const upperJetGeo = new THREE.ConeGeometry(8, 300, 16, 8, true);
    const upperJetMesh = new THREE.Mesh(upperJetGeo, jetMat);
    upperJetMesh.position.y = 180;
    jetGroup.add(upperJetMesh);
    parts.push({ mesh: upperJetMesh, name: 'Upper Relativistic Jet' });

    // Lower jet cone
    const lowerJetGeo = new THREE.ConeGeometry(8, 300, 16, 8, true);
    const lowerJetMesh = new THREE.Mesh(lowerJetGeo, jetMat);
    lowerJetMesh.position.y = -180;
    lowerJetMesh.rotation.x = Math.PI;
    jetGroup.add(lowerJetMesh);
    parts.push({ mesh: lowerJetMesh, name: 'Lower Relativistic Jet' });

    // Jet internal structure (helical magnetic field lines)
    for (let jet = 0; jet < 2; jet++) {
        const yDir = jet === 0 ? 1 : -1;
        for (let h = 0; h < 4; h++) {
            const helicalPoints = [];
            const hOffset = (h / 4) * Math.PI * 2;
            for (let t = 0; t < 60; t++) {
                const param = t / 60;
                const r = 3 + param * 5;
                helicalPoints.push(new THREE.Vector3(
                    Math.cos(param * Math.PI * 8 + hOffset) * r,
                    yDir * (30 + param * 270),
                    Math.sin(param * Math.PI * 8 + hOffset) * r
                ));
            }
            const helixCurve = new THREE.CatmullRomCurve3(helicalPoints);
            const helixGeo = new THREE.TubeGeometry(helixCurve, 50, 0.3, 4, false);
            const helixMesh = new THREE.Mesh(helixGeo, jetMat);
            jetGroup.add(helixMesh);
        }
    }

    // Jet particle streams (InstancedMesh)
    const jetParticleCount = 500;
    const jetPGeo = new THREE.SphereGeometry(0.6, 4, 4);
    const jetPMesh = new THREE.InstancedMesh(jetPGeo, jetMat, jetParticleCount);
    const jetPDummy = new THREE.Object3D();
    const jetPData = [];
    for (let i = 0; i < jetParticleCount; i++) {
        jetPData.push({
            dir: i < jetParticleCount / 2 ? 1 : -1,
            speed: 2 + Math.random() * 5,
            offset: Math.random() * 300,
            radialOffset: Math.random() * 6,
            theta: Math.random() * Math.PI * 2
        });
    }
    group.add(jetPMesh);
    jetParticles.push({ mesh: jetPMesh, data: jetPData, dummy: jetPDummy });

    group.add(jetGroup);

    // ==========================================
    // 8. ENERGY TRANSFER BEAMS
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const beamAngle = (i / 8) * Math.PI * 2;
        const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 100, 6);
        const beamMesh = new THREE.Mesh(beamGeo, energyBeamMat);
        const midR = 110;
        beamMesh.position.set(
            Math.cos(beamAngle) * midR,
            0,
            Math.sin(beamAngle) * midR
        );
        beamMesh.rotation.z = Math.PI / 2;
        beamMesh.rotation.y = -beamAngle;
        group.add(beamMesh);
        energyBeams.push({ mesh: beamMesh, angle: beamAngle, index: i });
    }
    parts.push({ mesh: energyBeams[0]?.mesh, name: 'Energy Transfer Beam Array' });

    // ==========================================
    // 9. GRAVITATIONAL WAVE DETECTORS
    // ==========================================
    const gwDetectorGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const detAngle = (i / 6) * Math.PI * 2;
        const detGroup = new THREE.Group();

        // Interferometer arm 1
        const arm1Geo = new THREE.CylinderGeometry(0.5, 0.5, 50, 4);
        const arm1Mesh = new THREE.Mesh(arm1Geo, chrome);
        arm1Mesh.rotation.z = Math.PI / 2;
        arm1Mesh.position.x = 25;
        detGroup.add(arm1Mesh);

        // Interferometer arm 2
        const arm2Geo = new THREE.CylinderGeometry(0.5, 0.5, 50, 4);
        const arm2Mesh = new THREE.Mesh(arm2Geo, chrome);
        arm2Mesh.position.y = 25;
        detGroup.add(arm2Mesh);

        // Central beam splitter
        const splitterGeo = new THREE.BoxGeometry(4, 4, 4);
        const splitterMesh = new THREE.Mesh(splitterGeo, glass);
        detGroup.add(splitterMesh);

        // Test masses at arm ends
        for (let m = 0; m < 4; m++) {
            const testMassGeo = new THREE.SphereGeometry(2, 8, 8);
            const testMassMesh = new THREE.Mesh(testMassGeo, aluminum);
            const positions = [[50, 0, 0], [0, 50, 0], [-50, 0, 0], [0, -50, 0]];
            if (m < 2) {
                testMassMesh.position.set(positions[m][0], positions[m][1], 0);
                detGroup.add(testMassMesh);
            }
        }

        detGroup.position.set(
            Math.cos(detAngle) * 200,
            30,
            Math.sin(detAngle) * 200
        );
        gwDetectorGroup.add(detGroup);
    }
    group.add(gwDetectorGroup);
    parts.push({ mesh: gwDetectorGroup, name: 'Gravitational Wave Detector Array' });

    // ==========================================
    // 10. THERMAL MANAGEMENT RADIATORS
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const radAngle = (i / 8) * Math.PI * 2 + Math.PI / 16;
        const radGeo = new THREE.BoxGeometry(30, 1, 60);
        const radMesh = new THREE.Mesh(radGeo, thermalMat);
        radMesh.position.set(
            Math.cos(radAngle) * 175,
            0,
            Math.sin(radAngle) * 175
        );
        radMesh.rotation.y = -radAngle;
        group.add(radMesh);
    }
    parts.push({ mesh: group, name: 'Thermal Radiator Panels' });

    // ==========================================
    // 11. TIDAL FORCE SENSOR LATTICE
    // ==========================================
    const tidalGroup = new THREE.Group();
    for (let lat = 0; lat < 6; lat++) {
        for (let lon = 0; lon < 12; lon++) {
            const phi = (lat / 6) * Math.PI;
            const theta = (lon / 12) * Math.PI * 2;
            const r = 90;
            const sensorGeo = new THREE.OctahedronGeometry(1.5, 0);
            const sensorMesh = new THREE.Mesh(sensorGeo, energyBeamMat);
            sensorMesh.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.cos(phi),
                r * Math.sin(phi) * Math.sin(theta)
            );
            tidalGroup.add(sensorMesh);
        }
    }
    group.add(tidalGroup);
    parts.push({ mesh: tidalGroup, name: 'Tidal Force Sensor Lattice' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the Penrose process, a particle entering the ergosphere splits into two fragments. What specific condition on the fragment that falls into the black hole enables energy extraction exceeding the original particle's rest mass energy?",
            options: [
                "The infalling fragment must have angular momentum aligned with the black hole's spin",
                "The infalling fragment must have negative energy-at-infinity (E < 0), which is only possible inside the ergosphere where the Killing vector ∂/∂t becomes spacelike",
                "The infalling fragment must exceed the speed of light relative to locally non-rotating observers",
                "The infalling fragment must undergo pair annihilation at the event horizon"
            ],
            correct: 1,
            explanation: "Inside the ergosphere, the time-translation Killing vector ξᵘ = (∂/∂t)ᵘ becomes spacelike. Since the conserved energy E = -pᵘξᵤ, and physical 4-momenta pᵘ must be future-directed timelike, E can be negative when ξ is spacelike. The escaping fragment carries away energy E₁ = E₀ + |E₂| > E₀, where E₂ < 0 is the negative energy of the infalling piece. This reduces the black hole's mass and angular momentum."
        },
        {
            question: "The maximum efficiency of the Penrose process for a maximally spinning Kerr black hole (a* = 1) is approximately 20.7%. This limit is determined by which geometric feature?",
            options: [
                "The surface gravity κ of the outer event horizon",
                "The innermost stable circular orbit (ISCO) radius, which for a* = 1 coincides with the event horizon at r = M",
                "The photon sphere radius at r = 3M",
                "The Buchdahl limit for the compactness ratio R/M"
            ],
            correct: 1,
            explanation: "For a maximally spinning Kerr black hole (a* = J/M² = 1), the ISCO for prograde orbits moves inward to r = M (Boyer-Lindquist coordinates), coinciding with the horizon. The binding energy of a test particle at the ISCO is E/m = 1/√3 ≈ 0.577, meaning (1 - 1/√3) ≈ 42.3% of rest mass can be radiated. The Penrose process specifically extracts rotational energy with maximum efficiency η = 1 - √(1/2) ≈ 20.7%, set by the condition that the escaping particle originates from the ISCO."
        },
        {
            question: "The superradiant scattering analogue of the Penrose process involves bosonic waves reflecting off a Kerr black hole. What is the superradiance condition for wave amplification?",
            options: [
                "The wave frequency must exceed the black hole's Hawking temperature, ω > κ/2π",
                "The wave must satisfy ω < mΩH, where m is the azimuthal quantum number and ΩH = a/(2Mr₊) is the angular velocity of the horizon",
                "The wave's wavelength must be smaller than the Schwarzschild radius, λ < 2GM/c²",
                "The wave must be circularly polarized with handedness matching the black hole's spin"
            ],
            correct: 1,
            explanation: "Superradiance occurs when ω < mΩH, where ΩH is the angular velocity of the horizon. In this regime, the reflected wave has greater amplitude than the incident wave, extracting rotational energy from the black hole. This is the wave analogue of the Penrose process. For massive bosonic fields, this leads to the 'black hole bomb' instability when the system is enclosed (e.g., by a mirror or the mass of the field itself), as the amplified wave bounces back repeatedly."
        },
        {
            question: "The Blandford-Znajek process, which powers astrophysical relativistic jets, differs from the Penrose process in what fundamental way?",
            options: [
                "It extracts mass energy rather than rotational energy from the black hole",
                "It uses electromagnetic fields threading the event horizon rather than particle splitting, with energy extracted via currents flowing along magnetic field lines supported by the accretion disk",
                "It operates outside the ergosphere by using tidal forces to accelerate matter",
                "It requires quantum tunneling through the event horizon"
            ],
            correct: 1,
            explanation: "The Blandford-Znajek mechanism extracts the black hole's rotational energy through large-scale magnetic fields anchored in the surrounding accretion disk. Frame-dragging twists the field lines, generating a Poynting flux that carries energy outward along the rotation axis, powering relativistic jets. Unlike the mechanical Penrose process (particle splitting), BZ is electromagnetic and operates through the ergospheric region without requiring discrete particle trajectories. It is believed to be the dominant mechanism powering Active Galactic Nuclei (AGN) jets."
        },
        {
            question: "According to Christodoulou's irreducible mass theorem, what fraction of a Kerr black hole's total mass-energy is in principle extractable through repeated Penrose processes?",
            options: [
                "100% of the mass can be extracted, leaving a naked singularity",
                "At most (1 - 1/√2) ≈ 29% for a maximally spinning black hole, after which it is reduced to its irreducible mass M_irr = M√[(1 + √(1 - a*²))/2]",
                "Exactly 50%, corresponding to the equipartition between gravitational and rotational energy",
                "An arbitrarily small fraction, as the ergosphere shrinks exponentially with each extraction"
            ],
            correct: 1,
            explanation: "Christodoulou showed that a Kerr black hole's mass decomposes as M² = M_irr² + J²/(4M_irr²), where M_irr = √(A/16π) depends only on the irreducible horizon area A. The second law of black hole mechanics (δA ≥ 0) means M_irr can never decrease. For a maximally spinning hole (a* = 1), M_irr = M/√2, so the maximum extractable energy is M - M/√2 = M(1 - 1/√2) ≈ 0.293M. This is an extraordinary amount—for a solar-mass BH, it corresponds to ~5.2×10⁴⁶ joules."
        }
    ];

    // ==========================================
    // DESCRIPTION
    // ==========================================
    const description = `<h2>Penrose Process Energy Harvester</h2>
<p>The Penrose Process Energy Harvester is a megascale facility designed to extract rotational energy from a spinning Kerr black hole by exploiting the unique properties of its ergosphere—the region where spacetime itself is dragged so violently that nothing can remain stationary.</p>

<h3>Core Systems</h3>
<ul>
<li><strong>Kerr Black Hole:</strong> A rapidly spinning black hole with distinct inner (Cauchy) and outer event horizons, a ring singularity (unique to rotating black holes), and an oblate ergosphere extending beyond the outer horizon.</li>
<li><strong>Ergosphere Boundary:</strong> The critical region where the time-translation Killing vector becomes spacelike, enabling negative-energy orbits. This is where energy extraction occurs.</li>
<li><strong>Harvesting Ring Station:</strong> A massive orbital platform at safe distance (r >> r₊) with 16 mass launcher stations that inject projectile masses on precise trajectories into the ergosphere.</li>
<li><strong>Mass Projectile Stream:</strong> Carefully aimed masses that enter the ergosphere and split at the optimal point, with one fragment falling into the black hole on a negative-energy orbit while the other escapes with more energy than the original.</li>
<li><strong>Relativistic Jets:</strong> Collimated beams of matter and radiation accelerated to near light-speed along the spin axis by the Blandford-Znajek electromagnetic process.</li>
</ul>

<h3>Theoretical Basis</h3>
<p>Proposed by Roger Penrose in 1969, the process exploits the fact that inside the ergosphere of a Kerr black hole, the Killing vector ∂/∂t becomes spacelike. This means particles can exist on orbits with negative conserved energy E = -pᵘξᵤ < 0. By splitting a mass into two fragments—one with E < 0 falling into the hole, and one with E > E₀ escaping—net energy is extracted from the black hole's rotational energy, reducing its spin parameter a*.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Spin the black hole event horizon
        innerHorizonMesh.rotation.y = time * speed * 5;
        outerHorizonMesh.rotation.y = time * speed * 3;
        singularityMesh.rotation.y = time * speed * 8;

        // 2. Frame-dragging rings rotation (each at different speed - differential rotation)
        frameDragRings.forEach(ring => {
            const dragSpeed = 3.0 / (1 + ring.index * 0.3); // Faster closer to BH
            ring.mesh.rotation.y = time * speed * dragSpeed;
        });

        // 3. Accretion disk orbital motion
        accretionParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                p.theta += p.speed * speed * 0.03;
                const wobble = Math.sin(time * speed * 2 + i * 0.1) * 0.5;
                dummy.position.set(
                    Math.cos(p.theta) * p.radius,
                    p.height + wobble,
                    Math.sin(p.theta) * p.radius
                );
                const tempScale = 0.5 + p.temperature * 1.5;
                dummy.scale.setScalar(p.size * tempScale);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 4. Mass projectile animation (spiral inward)
        massProjectiles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                if (!p.active) { dummy.scale.setScalar(0); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); continue; }

                p.phase = (p.phase + p.speed * speed * 0.01) % 1.0;
                const radius = 160 - p.phase * 100; // Spiral from ring to ergosphere
                const angle = p.startAngle + p.phase * Math.PI * 4;

                dummy.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(time * speed + i) * 3,
                    Math.sin(angle) * radius
                );
                dummy.scale.setScalar(p.phase < p.splitPoint ? 1.0 : 0.5);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 5. Fragment return stream
        const fMesh = fragmentMesh;
        for (let i = 0; i < fragmentData.length; i++) {
            const f = fragmentData[i];
            if (!f.active) { fragmentDummy.scale.setScalar(0); fragmentDummy.updateMatrix(); fMesh.setMatrixAt(i, fragmentDummy.matrix); continue; }

            f.phase = (f.phase + f.speed * speed * 0.015) % 1.0;
            const radius = 60 + f.phase * 100; // From ergosphere outward
            const angle = f.angle + f.phase * Math.PI * 3;

            fragmentDummy.position.set(
                Math.cos(angle) * radius,
                Math.sin(time * speed * 2 + i) * 5,
                Math.sin(angle) * radius
            );
            fragmentDummy.scale.setScalar(1.2 + Math.sin(time * speed * 8 + i) * 0.3);
            fragmentDummy.updateMatrix();
            fMesh.setMatrixAt(i, fragmentDummy.matrix);
        }
        fMesh.instanceMatrix.needsUpdate = true;

        // 6. Jet particle animation
        jetParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const j = data[i];
                const y = j.dir * ((time * speed * j.speed * 30 + j.offset) % 300 + 30);
                dummy.position.set(
                    Math.cos(j.theta) * j.radialOffset,
                    y,
                    Math.sin(j.theta) * j.radialOffset
                );
                dummy.scale.setScalar(0.3 + Math.random() * 0.5);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 7. Energy beam pulsation
        energyBeams.forEach(beam => {
            const pulse = 0.5 + Math.abs(Math.sin(time * speed * 4 + beam.index * 0.8)) * 1.5;
            beam.mesh.scale.set(pulse, 1, pulse);
            beam.mesh.material.opacity = 0.3 + Math.sin(time * speed * 6 + beam.index) * 0.4;
        });

        // 8. Ergosphere pulsation
        ergoMesh.scale.set(
            1.0 + Math.sin(time * speed * 1.5) * 0.03,
            0.7 + Math.sin(time * speed * 2) * 0.02,
            1.0 + Math.sin(time * speed * 1.5 + 1) * 0.03
        );
        ergoMesh.material.opacity = 0.2 + Math.sin(time * speed * 3) * 0.08;

        // 9. Photon sphere shimmer
        photonSphereMesh.rotation.y = time * speed * 0.3;
        photonSphereMesh.rotation.x = time * speed * 0.2;

        // 10. Jet cones pulsation
        upperJetMesh.scale.set(
            1.0 + Math.sin(time * speed * 5) * 0.2,
            1.0,
            1.0 + Math.sin(time * speed * 5 + 1) * 0.2
        );
        lowerJetMesh.scale.set(
            1.0 + Math.sin(time * speed * 5 + 2) * 0.2,
            1.0,
            1.0 + Math.sin(time * speed * 5 + 3) * 0.2
        );
    }

    return { group, parts, description, quizQuestions, animate };
}
