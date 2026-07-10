import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM O'NEILL CYLINDER MATERIALS
    // ==========================================
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.85, roughness: 0.2 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x4488cc, emissiveIntensity: 0.5, transparent: true, opacity: 0.3 });
    const landMat = new THREE.MeshStandardMaterial({ color: 0x228833, emissive: 0x114422, emissiveIntensity: 0.2 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x2266aa, emissive: 0x114488, emissiveIntensity: 0.5, transparent: true, opacity: 0.7 });
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcccccc, emissiveIntensity: 0.5, transparent: true, opacity: 0.4 });
    const sunMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffff88, emissiveIntensity: 8.0 });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.05 });
    const dockMat = new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.8, roughness: 0.3 });
    const cityMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, emissive: 0x444444, emissiveIntensity: 0.3 });
    const atmosphereMat = new THREE.MeshStandardMaterial({ color: 0x88bbff, emissive: 0x4488cc, emissiveIntensity: 0.3, transparent: true, opacity: 0.08, side: 2 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.15 });

    // Dynamic arrays
    const cylinders = [];
    const mirrorPanels = [];
    const cloudFormations = [];
    const dockingShips = [];
    const sunLightElements = [];
    const internalStructures = [];

    // ==========================================
    // 1. CYLINDER A (Primary)
    // ==========================================
    const cylAGroup = new THREE.Group();
    const cylALength = 250;
    const cylARadius = 50;

    // Main hull (open cylinder with visible interior)
    const cylAHullGeo = new THREE.CylinderGeometry(cylARadius, cylARadius, cylALength, 48, 1, true);
    const cylAHullMesh = new THREE.Mesh(cylAHullGeo, hullMat);
    cylAHullMesh.rotation.x = Math.PI / 2;
    cylAGroup.add(cylAHullMesh);
    parts.push({ mesh: cylAHullMesh, name: 'Cylinder A Hull' });

    // End caps
    for (let end = -1; end <= 1; end += 2) {
        const capGeo = new THREE.CircleGeometry(cylARadius, 48);
        const capMesh = new THREE.Mesh(capGeo, hullMat);
        capMesh.position.z = end * cylALength / 2;
        if (end === -1) capMesh.rotation.y = Math.PI;
        cylAGroup.add(capMesh);

        // Docking port in center of cap
        const dockGeo = new THREE.CylinderGeometry(8, 8, 15, 12);
        const dockMesh = new THREE.Mesh(dockGeo, dockMat);
        dockMesh.rotation.x = Math.PI / 2;
        dockMesh.position.z = end * (cylALength / 2 + 7);
        cylAGroup.add(dockMesh);
    }

    // Window strips (6 alternating land/window strips)
    for (let strip = 0; strip < 6; strip++) {
        const stripAngle = (strip / 6) * Math.PI * 2;
        const stripWidth = Math.PI * 2 / 6 * 0.4;
        const stripGeo = new THREE.CylinderGeometry(
            cylARadius + 0.5, cylARadius + 0.5, cylALength, 8, 1, true,
            stripAngle - stripWidth / 2, stripWidth
        );
        const isMat = strip % 2 === 0 ? windowMat : landMat;
        const stripMesh = new THREE.Mesh(stripGeo, isMat);
        stripMesh.rotation.x = Math.PI / 2;
        cylAGroup.add(stripMesh);
    }

    // Interior landscape elements (hills, cities, water bodies)
    for (let i = 0; i < 30; i++) {
        const landscapeAngle = Math.random() * Math.PI * 2;
        const landscapeZ = (Math.random() - 0.5) * cylALength * 0.8;
        const isCity = Math.random() > 0.6;
        const isWater = !isCity && Math.random() > 0.5;

        if (isCity) {
            // City blocks (clusters of boxes)
            const cityGroup = new THREE.Group();
            for (let b = 0; b < 5; b++) {
                const bHeight = 1 + Math.random() * 4;
                const bGeo = new THREE.BoxGeometry(2, bHeight, 2);
                const bMesh = new THREE.Mesh(bGeo, cityMat);
                bMesh.position.set((Math.random() - 0.5) * 6, bHeight / 2, (Math.random() - 0.5) * 6);
                cityGroup.add(bMesh);
            }
            cityGroup.position.set(
                Math.cos(landscapeAngle) * (cylARadius - 3),
                Math.sin(landscapeAngle) * (cylARadius - 3),
                landscapeZ
            );
            const lookTarget = new THREE.Vector3(0, 0, landscapeZ);
            cityGroup.lookAt(lookTarget);
            cylAGroup.add(cityGroup);
            internalStructures.push({ group: cityGroup, type: 'city' });
        } else if (isWater) {
            const waterGeo = new THREE.CircleGeometry(3 + Math.random() * 5, 12);
            const waterMesh = new THREE.Mesh(waterGeo, waterMat);
            waterMesh.position.set(
                Math.cos(landscapeAngle) * (cylARadius - 1),
                Math.sin(landscapeAngle) * (cylARadius - 1),
                landscapeZ
            );
            waterMesh.lookAt(0, 0, landscapeZ);
            cylAGroup.add(waterMesh);
        }
    }

    // Cloud layer (InstancedMesh inside the cylinder)
    const cloudCount = 80;
    const cloudGeo = new THREE.SphereGeometry(3, 8, 6);
    const cloudInstMesh = new THREE.InstancedMesh(cloudGeo, cloudMat, cloudCount);
    const cloudDummy = new THREE.Object3D();
    const cloudData = [];
    for (let i = 0; i < cloudCount; i++) {
        const cAngle = Math.random() * Math.PI * 2;
        const cZ = (Math.random() - 0.5) * cylALength * 0.8;
        const cR = cylARadius * 0.4 + Math.random() * cylARadius * 0.3;
        cloudData.push({
            angle: cAngle, z: cZ, radius: cR,
            speed: 0.1 + Math.random() * 0.3,
            scaleX: 2 + Math.random() * 3,
            scaleY: 0.5 + Math.random() * 0.5,
            scaleZ: 1 + Math.random() * 2
        });
        cloudDummy.position.set(Math.cos(cAngle) * cR, Math.sin(cAngle) * cR, cZ);
        cloudDummy.scale.set(cloudData[i].scaleX, cloudData[i].scaleY, cloudData[i].scaleZ);
        cloudDummy.updateMatrix();
        cloudInstMesh.setMatrixAt(i, cloudDummy.matrix);
    }
    cloudInstMesh.instanceMatrix.needsUpdate = true;
    cylAGroup.add(cloudInstMesh);
    cloudFormations.push({ mesh: cloudInstMesh, data: cloudData, dummy: cloudDummy, cylinder: 'A' });

    // Atmosphere glow
    const atmoGeo = new THREE.CylinderGeometry(cylARadius - 2, cylARadius - 2, cylALength, 32, 1, true);
    const atmoMesh = new THREE.Mesh(atmoGeo, atmosphereMat);
    atmoMesh.rotation.x = Math.PI / 2;
    cylAGroup.add(atmoMesh);

    cylAGroup.position.x = -60;
    group.add(cylAGroup);
    cylinders.push({ group: cylAGroup, radius: cylARadius, length: cylALength, direction: 1, name: 'A' });

    // ==========================================
    // 2. CYLINDER B (Counter-rotating)
    // ==========================================
    const cylBGroup = new THREE.Group();
    const cylBLength = 250;
    const cylBRadius = 50;

    const cylBHullGeo = new THREE.CylinderGeometry(cylBRadius, cylBRadius, cylBLength, 48, 1, true);
    const cylBHullMesh = new THREE.Mesh(cylBHullGeo, hullMat);
    cylBHullMesh.rotation.x = Math.PI / 2;
    cylBGroup.add(cylBHullMesh);
    parts.push({ mesh: cylBHullMesh, name: 'Cylinder B Hull (Counter-rotating)' });

    for (let end = -1; end <= 1; end += 2) {
        const capGeo = new THREE.CircleGeometry(cylBRadius, 48);
        const capMesh = new THREE.Mesh(capGeo, hullMat);
        capMesh.position.z = end * cylBLength / 2;
        if (end === -1) capMesh.rotation.y = Math.PI;
        cylBGroup.add(capMesh);

        const dockGeo = new THREE.CylinderGeometry(8, 8, 15, 12);
        const dockMesh = new THREE.Mesh(dockGeo, dockMat);
        dockMesh.rotation.x = Math.PI / 2;
        dockMesh.position.z = end * (cylBLength / 2 + 7);
        cylBGroup.add(dockMesh);
    }

    for (let strip = 0; strip < 6; strip++) {
        const stripAngle = (strip / 6) * Math.PI * 2;
        const stripWidth = Math.PI * 2 / 6 * 0.4;
        const stripGeo = new THREE.CylinderGeometry(
            cylBRadius + 0.5, cylBRadius + 0.5, cylBLength, 8, 1, true,
            stripAngle - stripWidth / 2, stripWidth
        );
        const isMat = strip % 2 === 0 ? windowMat : landMat;
        const stripMesh = new THREE.Mesh(stripGeo, isMat);
        stripMesh.rotation.x = Math.PI / 2;
        cylBGroup.add(stripMesh);
    }

    for (let i = 0; i < 30; i++) {
        const landscapeAngle = Math.random() * Math.PI * 2;
        const landscapeZ = (Math.random() - 0.5) * cylBLength * 0.8;
        const isCity = Math.random() > 0.6;
        if (isCity) {
            const cityGroup = new THREE.Group();
            for (let b = 0; b < 5; b++) {
                const bHeight = 1 + Math.random() * 4;
                const bGeo = new THREE.BoxGeometry(2, bHeight, 2);
                const bMesh = new THREE.Mesh(bGeo, cityMat);
                bMesh.position.set((Math.random() - 0.5) * 6, bHeight / 2, (Math.random() - 0.5) * 6);
                cityGroup.add(bMesh);
            }
            cityGroup.position.set(
                Math.cos(landscapeAngle) * (cylBRadius - 3),
                Math.sin(landscapeAngle) * (cylBRadius - 3),
                landscapeZ
            );
            cityGroup.lookAt(new THREE.Vector3(0, 0, landscapeZ));
            cylBGroup.add(cityGroup);
        }
    }

    const cloud2Count = 80;
    const cloud2InstMesh = new THREE.InstancedMesh(cloudGeo, cloudMat, cloud2Count);
    const cloud2Dummy = new THREE.Object3D();
    const cloud2Data = [];
    for (let i = 0; i < cloud2Count; i++) {
        const cAngle = Math.random() * Math.PI * 2;
        const cZ = (Math.random() - 0.5) * cylBLength * 0.8;
        const cR = cylBRadius * 0.4 + Math.random() * cylBRadius * 0.3;
        cloud2Data.push({
            angle: cAngle, z: cZ, radius: cR,
            speed: 0.1 + Math.random() * 0.3,
            scaleX: 2 + Math.random() * 3,
            scaleY: 0.5 + Math.random() * 0.5,
            scaleZ: 1 + Math.random() * 2
        });
        cloud2Dummy.position.set(Math.cos(cAngle) * cR, Math.sin(cAngle) * cR, cZ);
        cloud2Dummy.scale.set(cloud2Data[i].scaleX, cloud2Data[i].scaleY, cloud2Data[i].scaleZ);
        cloud2Dummy.updateMatrix();
        cloud2InstMesh.setMatrixAt(i, cloud2Dummy.matrix);
    }
    cloud2InstMesh.instanceMatrix.needsUpdate = true;
    cylBGroup.add(cloud2InstMesh);
    cloudFormations.push({ mesh: cloud2InstMesh, data: cloud2Data, dummy: cloud2Dummy, cylinder: 'B' });

    const atmo2Geo = new THREE.CylinderGeometry(cylBRadius - 2, cylBRadius - 2, cylBLength, 32, 1, true);
    const atmo2Mesh = new THREE.Mesh(atmo2Geo, atmosphereMat);
    atmo2Mesh.rotation.x = Math.PI / 2;
    cylBGroup.add(atmo2Mesh);

    cylBGroup.position.x = 60;
    group.add(cylBGroup);
    cylinders.push({ group: cylBGroup, radius: cylBRadius, length: cylBLength, direction: -1, name: 'B' });

    // ==========================================
    // 3. CENTRAL ARTIFICIAL SUN
    // ==========================================
    const sunGroup = new THREE.Group();

    // Sun light tube running between cylinders
    const sunTubeGeo = new THREE.CylinderGeometry(3, 3, 100, 12);
    const sunTubeMesh = new THREE.Mesh(sunTubeGeo, sunMat);
    sunTubeMesh.rotation.z = Math.PI / 2;
    sunGroup.add(sunTubeMesh);
    parts.push({ mesh: sunTubeMesh, name: 'Artificial Sun Light Tube' });

    // Sun emitter nodes along the tube
    for (let i = 0; i < 8; i++) {
        const nodeGeo = new THREE.SphereGeometry(5, 12, 12);
        const nodeMesh = new THREE.Mesh(nodeGeo, sunMat);
        nodeMesh.position.x = -35 + i * 10;
        sunGroup.add(nodeMesh);
        sunLightElements.push({ mesh: nodeMesh, index: i });
    }

    // Light diffuser rings
    for (let i = 0; i < 12; i++) {
        const diffuserGeo = new THREE.TorusGeometry(6, 0.5, 6, 24);
        const diffuserMesh = new THREE.Mesh(diffuserGeo, glass);
        diffuserMesh.position.x = -33 + i * 6;
        diffuserMesh.rotation.y = Math.PI / 2;
        sunGroup.add(diffuserMesh);
    }

    group.add(sunGroup);

    // ==========================================
    // 4. EXTERNAL SOLAR MIRRORS
    // ==========================================
    for (let side = -1; side <= 1; side += 2) {
        for (let m = 0; m < 3; m++) {
            const mirrorGroup = new THREE.Group();

            // Large reflective panel
            const mirrorGeo = new THREE.BoxGeometry(40, 80, 0.5);
            const mirrorMesh = new THREE.Mesh(mirrorGeo, mirrorMat);
            mirrorGroup.add(mirrorMesh);
            parts.push({ mesh: mirrorMesh, name: `Solar Mirror ${side > 0 ? 'B' : 'A'}-${m + 1}` });

            // Mirror support frame
            const frameGeo = new THREE.BoxGeometry(42, 2, 2);
            const frameMesh = new THREE.Mesh(frameGeo, frameMat);
            frameMesh.position.y = 40;
            mirrorGroup.add(frameMesh);
            const frameMesh2 = new THREE.Mesh(frameGeo, frameMat);
            frameMesh2.position.y = -40;
            mirrorGroup.add(frameMesh2);

            // Hinge mechanism
            const hingeGeo = new THREE.CylinderGeometry(2, 2, 5, 8);
            const hingeMesh = new THREE.Mesh(hingeGeo, darkSteel);
            hingeMesh.position.set(0, -45, 0);
            mirrorGroup.add(hingeMesh);

            const mirrorAngle = (m / 3) * Math.PI * 2 / 3 - Math.PI / 3;
            mirrorGroup.position.set(
                side * 60,
                Math.cos(mirrorAngle) * 90,
                Math.sin(mirrorAngle) * 90
            );
            mirrorGroup.lookAt(side * 60, 0, 0);

            group.add(mirrorGroup);
            mirrorPanels.push({ group: mirrorGroup, side, index: m, baseAngle: mirrorAngle });
        }
    }

    // ==========================================
    // 5. CONNECTING FRAMEWORK BETWEEN CYLINDERS
    // ==========================================
    const connectGroup = new THREE.Group();

    // Main structural beam
    const mainBeamGeo = new THREE.BoxGeometry(120, 5, 5);
    const mainBeamMesh = new THREE.Mesh(mainBeamGeo, frameMat);
    mainBeamMesh.position.y = 60;
    connectGroup.add(mainBeamMesh);

    const mainBeamMesh2 = new THREE.Mesh(mainBeamGeo, frameMat);
    mainBeamMesh2.position.y = -60;
    connectGroup.add(mainBeamMesh2);

    // Cross braces
    for (let i = 0; i < 6; i++) {
        const braceGeo = new THREE.CylinderGeometry(1, 1, 130, 4);
        const braceMesh = new THREE.Mesh(braceGeo, frameMat);
        const braceAngle = (i / 6) * Math.PI * 2;
        braceMesh.position.set(0, Math.cos(braceAngle) * 60, Math.sin(braceAngle) * 60);
        braceMesh.rotation.z = Math.PI / 2;
        connectGroup.add(braceMesh);
    }

    // Bearing assembly (allows counter-rotation)
    const bearingGeo = new THREE.TorusGeometry(55, 3, 12, 32);
    const bearingMesh = new THREE.Mesh(bearingGeo, chrome);
    bearingMesh.rotation.y = Math.PI / 2;
    connectGroup.add(bearingMesh);
    parts.push({ mesh: bearingMesh, name: 'Counter-rotation Bearing Assembly' });

    group.add(connectGroup);

    // ==========================================
    // 6. DOCKING SHIPS (InstancedMesh)
    // ==========================================
    const shipCount = 20;
    const shipGeo = new THREE.ConeGeometry(2, 8, 6);
    const shipMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    const shipInstMesh = new THREE.InstancedMesh(shipGeo, shipMat, shipCount);
    const shipDummy = new THREE.Object3D();
    const shipData = [];

    for (let i = 0; i < shipCount; i++) {
        const targetCyl = i < shipCount / 2 ? -60 : 60;
        const orbitAngle = Math.random() * Math.PI * 2;
        const orbitRadius = 70 + Math.random() * 40;
        shipData.push({
            targetX: targetCyl,
            orbitAngle,
            orbitRadius,
            speed: 0.3 + Math.random() * 0.8,
            phase: Math.random() * Math.PI * 2,
            z: (Math.random() - 0.5) * 200
        });
    }
    group.add(shipInstMesh);
    dockingShips.push({ mesh: shipInstMesh, data: shipData, dummy: shipDummy });
    parts.push({ mesh: shipInstMesh, name: 'Transport Ships' });

    // ==========================================
    // 7. AGRICULTURAL RINGS
    // ==========================================
    for (let cyl = 0; cyl < 2; cyl++) {
        const cylX = cyl === 0 ? -60 : 60;
        for (let ring = 0; ring < 3; ring++) {
            const agriRingGeo = new THREE.TorusGeometry(cylARadius + 5, 3, 6, 32);
            const agriMat = new THREE.MeshStandardMaterial({ color: 0x44aa22, emissive: 0x226611, emissiveIntensity: 0.5 });
            const agriRingMesh = new THREE.Mesh(agriRingGeo, agriMat);
            agriRingMesh.position.set(cylX, 0, -80 + ring * 80);
            group.add(agriRingMesh);
        }
    }
    parts.push({ mesh: group, name: 'Agricultural Ring Systems' });

    // ==========================================
    // 8. SOLAR PANEL ARRAYS
    // ==========================================
    for (let side = -1; side <= 1; side += 2) {
        for (let p = 0; p < 4; p++) {
            const panelGeo = new THREE.BoxGeometry(20, 30, 0.3);
            const panelMat2 = new THREE.MeshStandardMaterial({ color: 0x112244, emissive: 0x001133, emissiveIntensity: 0.3 });
            const panelMesh = new THREE.Mesh(panelGeo, panelMat2);
            panelMesh.position.set(
                side * (60 + 35),
                65 + p * 35,
                0
            );
            group.add(panelMesh);
        }
    }
    parts.push({ mesh: group, name: 'Solar Panel Arrays' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "An O'Neill cylinder of radius R rotating at angular velocity ω produces artificial gravity g = ω²R on its inner surface. For R = 3.2 km (as in O'Neill's Island Three design), what rotation rate is needed to produce 1g, and what is the critical concern at smaller radii?",
            options: [
                "ω ≈ 0.055 rad/s (1 rpm); the concern is Coriolis forces causing motion sickness, which become significant when the ratio of Coriolis to centripetal acceleration (2v/ωR) is large at small R",
                "ω ≈ 0.5 rad/s (5 rpm); the concern is structural fatigue from rapid rotation",
                "ω ≈ 0.01 rad/s (0.1 rpm); the concern is insufficient atmospheric pressure at low rotation rates",
                "ω ≈ 1.0 rad/s (10 rpm); the concern is relativistic time dilation at the rim"
            ],
            correct: 0,
            explanation: "From g = ω²R: ω = √(g/R) = √(9.81/3200) ≈ 0.055 rad/s ≈ 0.53 rpm. The critical concern at smaller radii is the Coriolis effect. In a rotating frame, a person moving with velocity v experiences a Coriolis acceleration a_C = 2ωv perpendicular to their motion. The ratio a_C/g = 2v/(ωR) = 2v/√(gR). At R = 3.2 km, walking at 1.5 m/s gives a_C/g ≈ 1.7%. At R = 100 m (requiring ω = 0.31 rad/s), this jumps to ~10%, causing severe vestibular disturbance. NASA studies suggest 2 rpm is the comfort limit for most humans."
        },
        {
            question: "O'Neill proposed counter-rotating paired cylinders. What is the primary engineering reason for counter-rotation?",
            options: [
                "It doubles the available living space per unit of construction material",
                "It cancels the net angular momentum of the system, preventing gyroscopic precession that would otherwise require continuous thruster corrections to maintain orbital orientation",
                "It creates a region of zero gravity between the cylinders for industrial processing",
                "It generates a magnetic field through the Barnett effect to shield against cosmic radiation"
            ],
            correct: 1,
            explanation: "A single spinning cylinder has angular momentum L = Iω. In orbit, gyroscopic precession torques (τ = L × Ω_orbit) would continuously reorient the cylinder's spin axis relative to the Sun, requiring constant thruster corrections. By pairing two counter-rotating cylinders with equal and opposite angular momenta, L_net = 0, eliminating precession entirely. This also simplifies attitude control: the system behaves like a non-spinning body for orbital mechanics purposes while maintaining artificial gravity internally."
        },
        {
            question: "The structural material for an O'Neill cylinder must withstand the hoop stress from rotation. For a cylinder of radius R, surface density σ (kg/m²), and surface gravity g, what is the hoop stress, and why did O'Neill favor specific materials?",
            options: [
                "σ_hoop = σgR; O'Neill favored lunar-derived steel and aluminum because of the 22× lower delta-v to launch from the Moon versus Earth",
                "σ_hoop = ρv² where v is the rim speed; O'Neill favored carbon fiber for its specific strength",
                "σ_hoop = σg/R; thicker walls reduce stress, so O'Neill favored heavy concrete",
                "σ_hoop = σgR²; the quadratic scaling with R limits cylinder size to under 100m"
            ],
            correct: 0,
            explanation: "The hoop stress in a rotating thin-walled cylinder is σ_hoop = ρ·ω²·R·t·R = σgR (where σ is surface mass density). For Island Three (R = 3.2 km, g = 9.81 m/s²), with structural + atmospheric + terrain mass ~10⁴ kg/m², the hoop stress is ~320 MPa. Steel (yield ~250-500 MPa) and aluminum alloys work with safety factors. O'Neill specifically advocated mining the Moon (escape velocity 2.4 km/s vs Earth's 11.2 km/s), using electromagnetic mass drivers to launch raw materials, reducing launch energy by a factor of ~22."
        },
        {
            question: "The atmospheric pressure inside an O'Neill cylinder varies with 'altitude' (distance from inner wall toward axis). At what effective altitude does the atmosphere become too thin for comfortable breathing, and why?",
            options: [
                "At about 1 km from the inner wall; the scale height H = kT/(mg) ≈ 8.5 km is unchanged, but the effective gravity decreases linearly as g(r) = ω²r, causing the pressure to drop faster than in a uniform gravity field",
                "At about 5 km, identical to Earth because the atmospheric composition is the same",
                "At any distance, because the Coriolis effect prevents stable atmospheric stratification",
                "The atmosphere would be uniformly distributed due to the centrifugal force, with no variation"
            ],
            correct: 0,
            explanation: "In a rotating cylinder, the effective gravity varies as g(r) = ω²r (zero at the axis, maximum at the wall). The barometric formula becomes dP/dr = -ρω²r, giving P(r) = P₀·exp(-ω²(R²-r²)/(2kT/m)). This is a Gaussian rather than exponential decay: pressure drops faster near the wall (where g is strongest) and slower near the axis (where g → 0). For Island Three parameters, the pressure at the axis is roughly exp(-ω²R²m/(2kT)) ≈ exp(-1.4) ≈ 25% of sea level, breathable but thin. The practical habitable zone extends ~2 km from the wall."
        },
        {
            question: "O'Neill's design uses large adjustable mirrors to control the day/night cycle. What thermal engineering challenge does this create that has no terrestrial analogue?",
            options: [
                "The mirrors must be actively cooled to prevent melting from concentrated solar flux",
                "Without a massive planetary heat sink, the cylinder must radiatively emit waste heat at the same rate it absorbs solar energy, requiring careful albedo management; and the thermal inertia is far lower than Earth's, causing rapid temperature swings without active control",
                "The mirrors generate dangerous amounts of UV radiation inside the cylinder",
                "Solar wind pressure on the mirrors would de-orbit the structure within weeks"
            ],
            correct: 1,
            explanation: "Earth's oceans (4×10²¹ kg) provide enormous thermal inertia, and the planet radiates as a blackbody from its full surface area. An O'Neill cylinder has comparatively negligible thermal mass and a much smaller radiating surface. When mirrors open, solar input is ~1361 W/m² × window area. The cylinder must achieve thermal equilibrium via radiation (Stefan-Boltzmann: P = εσAT⁴) from its outer hull. With the hull at ~300K, this requires radiator area comparable to the mirror area. Day/night cycling must be carefully managed to prevent temperature swings of tens of degrees within hours—a problem Earth solves with 5×10²⁴ kg of atmospheric/oceanic thermal buffer."
        }
    ];

    const description = `<h2>O'Neill Cylinder Biosphere</h2>
<p>The O'Neill Cylinder is a space habitat concept proposed by Princeton physicist Gerard K. O'Neill in 1976. It consists of two counter-rotating cylinders, each providing Earth-normal artificial gravity on their inner surfaces through centripetal acceleration. The design supports permanent human settlement of tens of thousands of inhabitants.</p>

<h3>Design Features</h3>
<ul>
<li><strong>Counter-rotating Pair:</strong> Two cylinders rotate in opposite directions to cancel net angular momentum, preventing gyroscopic precession in orbit.</li>
<li><strong>Alternating Strips:</strong> Three land strips alternate with three window strips along each cylinder, allowing sunlight to enter while providing livable terrain.</li>
<li><strong>Artificial Gravity:</strong> Rotation at ~0.53 rpm for a 3.2 km radius cylinder produces 1g at the inner surface.</li>
<li><strong>Solar Mirrors:</strong> Large adjustable external mirrors control the day/night cycle and direct sunlight through the window strips.</li>
<li><strong>Interior Biosphere:</strong> Complete ecosystems with cities, agriculture, water bodies, and weather systems inside the cylinders.</li>
</ul>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Counter-rotating cylinders
        cylinders.forEach(cyl => {
            cyl.group.rotation.z = time * speed * 0.3 * cyl.direction;
        });

        // 2. Cloud drift inside cylinders
        cloudFormations.forEach(cf => {
            const { mesh, data, dummy } = cf;
            for (let i = 0; i < data.length; i++) {
                const c = data[i];
                c.angle += c.speed * speed * 0.005;
                c.z += Math.sin(time * speed * 0.5 + i) * 0.02;
                dummy.position.set(
                    Math.cos(c.angle) * c.radius,
                    Math.sin(c.angle) * c.radius,
                    c.z
                );
                dummy.scale.set(c.scaleX, c.scaleY, c.scaleZ);
                const fade = 0.3 + Math.sin(time * speed * 0.3 + i * 0.5) * 0.1;
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 3. Solar mirror tracking
        mirrorPanels.forEach(mp => {
            const trackAngle = Math.sin(time * speed * 0.2 + mp.index) * 0.15;
            mp.group.rotation.x = trackAngle;
        });

        // 4. Sun node pulsation
        sunLightElements.forEach(node => {
            const pulse = 1.0 + Math.sin(time * speed * 3 + node.index * 0.5) * 0.1;
            node.mesh.scale.setScalar(pulse);
            node.mesh.material.emissiveIntensity = 6 + Math.sin(time * speed * 4 + node.index) * 2;
        });

        // 5. Transport ship orbits
        dockingShips.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const s = data[i];
                s.orbitAngle += s.speed * speed * 0.02;
                const approachDist = 70 + Math.sin(time * speed * 0.5 + s.phase) * 20;
                dummy.position.set(
                    s.targetX + Math.cos(s.orbitAngle) * 5,
                    Math.cos(s.orbitAngle) * approachDist,
                    s.z + Math.sin(s.orbitAngle) * approachDist
                );
                dummy.lookAt(s.targetX, 0, s.z);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
