import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM NEUTRON STAR MERGER MATERIALS
    // ==========================================
    const neutronStarMat1 = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2266ff, emissiveIntensity: 5.0 });
    const neutronStarMat2 = new THREE.MeshStandardMaterial({ color: 0xff4488, emissive: 0xff2266, emissiveIntensity: 5.0 });
    const magneticFieldMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ddaa, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.3 });
    const kilonovaMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 8.0, transparent: true, opacity: 0.6 });
    const jetMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 6.0, transparent: true, opacity: 0.5 });
    const ejectaMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 3.0, transparent: true, opacity: 0.7 });
    const heavyElementMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffcc00, emissiveIntensity: 4.0 });
    const trapMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.15 });
    const gwWaveMat = new THREE.MeshStandardMaterial({ color: 0x8844ff, emissive: 0x6622ff, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.2 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 4.0, transparent: true, opacity: 0.5 });
    const crustMat = new THREE.MeshStandardMaterial({ color: 0x889999, metalness: 0.95, roughness: 0.1 });

    // Dynamic arrays
    const neutronStars = [];
    const magneticLines = [];
    const ejectaParticles = [];
    const heavyElements = [];
    const gwRipples = [];
    const jetStreams = [];
    const captureTraps = [];
    const tidalDebris = [];

    // ==========================================
    // 1. NEUTRON STAR A (Primary)
    // ==========================================
    const nsAGroup = new THREE.Group();

    // Core (ultra-dense nuclear matter)
    const nsACoreGeo = new THREE.IcosahedronGeometry(15, 4);
    const nsACoreMesh = new THREE.Mesh(nsACoreGeo, neutronStarMat1);
    nsAGroup.add(nsACoreMesh);
    parts.push({ mesh: nsACoreMesh, name: 'Neutron Star A Core (1.4 M☉)' });

    // Solid crystalline crust
    const nsACrustGeo = new THREE.IcosahedronGeometry(16, 2);
    const nsACrustMesh = new THREE.Mesh(nsACrustGeo, crustMat);
    nsACrustMesh.material.wireframe = true;
    nsAGroup.add(nsACrustMesh);

    // Intense dipole magnetic field lines
    for (let i = 0; i < 8; i++) {
        const fieldPoints = [];
        const fieldAngleOffset = (i / 8) * Math.PI * 2;
        for (let t = 0; t <= 30; t++) {
            const param = (t / 30) * Math.PI;
            const r = 15 + Math.sin(param) * 25;
            fieldPoints.push(new THREE.Vector3(
                Math.cos(fieldAngleOffset) * Math.sin(param) * r * 0.3,
                Math.cos(param) * r,
                Math.sin(fieldAngleOffset) * Math.sin(param) * r * 0.3
            ));
        }
        const fieldCurve = new THREE.CatmullRomCurve3(fieldPoints);
        const fieldGeo = new THREE.TubeGeometry(fieldCurve, 30, 0.3, 4, false);
        const fieldMesh = new THREE.Mesh(fieldGeo, magneticFieldMat);
        nsAGroup.add(fieldMesh);
        magneticLines.push({ mesh: fieldMesh, star: 'A' });
    }

    // Hotspots at magnetic poles
    for (let pole = -1; pole <= 1; pole += 2) {
        const hotspotGeo = new THREE.SphereGeometry(3, 12, 12);
        const hotspotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8.0 });
        const hotspotMesh = new THREE.Mesh(hotspotGeo, hotspotMat);
        hotspotMesh.position.y = pole * 16;
        nsAGroup.add(hotspotMesh);
    }

    nsAGroup.position.set(-40, 0, 0);
    group.add(nsAGroup);
    neutronStars.push({ group: nsAGroup, core: nsACoreMesh, baseX: -40, orbitAngle: 0 });

    // ==========================================
    // 2. NEUTRON STAR B (Secondary)
    // ==========================================
    const nsBGroup = new THREE.Group();

    const nsBCoreGeo = new THREE.IcosahedronGeometry(13, 4);
    const nsBCoreMesh = new THREE.Mesh(nsBCoreGeo, neutronStarMat2);
    nsBGroup.add(nsBCoreMesh);
    parts.push({ mesh: nsBCoreMesh, name: 'Neutron Star B Core (1.2 M☉)' });

    const nsBCrustGeo = new THREE.IcosahedronGeometry(14, 2);
    const nsBCrustMesh = new THREE.Mesh(nsBCrustGeo, crustMat);
    nsBCrustMesh.material.wireframe = true;
    nsBGroup.add(nsBCrustMesh);

    for (let i = 0; i < 8; i++) {
        const fieldPoints = [];
        const fieldAngleOffset = (i / 8) * Math.PI * 2;
        for (let t = 0; t <= 30; t++) {
            const param = (t / 30) * Math.PI;
            const r = 13 + Math.sin(param) * 22;
            fieldPoints.push(new THREE.Vector3(
                Math.cos(fieldAngleOffset) * Math.sin(param) * r * 0.3,
                Math.cos(param) * r,
                Math.sin(fieldAngleOffset) * Math.sin(param) * r * 0.3
            ));
        }
        const fieldCurve = new THREE.CatmullRomCurve3(fieldPoints);
        const fieldGeo = new THREE.TubeGeometry(fieldCurve, 30, 0.3, 4, false);
        const fieldMesh = new THREE.Mesh(fieldGeo, magneticFieldMat);
        nsBGroup.add(fieldMesh);
        magneticLines.push({ mesh: fieldMesh, star: 'B' });
    }

    for (let pole = -1; pole <= 1; pole += 2) {
        const hotspotGeo = new THREE.SphereGeometry(2.5, 12, 12);
        const hotspotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8.0 });
        const hotspotMesh = new THREE.Mesh(hotspotGeo, hotspotMat);
        hotspotMesh.position.y = pole * 14;
        nsBGroup.add(hotspotMesh);
    }

    nsBGroup.position.set(40, 0, 0);
    group.add(nsBGroup);
    neutronStars.push({ group: nsBGroup, core: nsBCoreMesh, baseX: 40, orbitAngle: Math.PI });

    // ==========================================
    // 3. KILONOVA EXPLOSION SHELL
    // ==========================================
    const kilonovaGroup = new THREE.Group();
    const kilonovaGeo = new THREE.IcosahedronGeometry(5, 3);
    const kilonovaMesh = new THREE.Mesh(kilonovaGeo, kilonovaMat);
    kilonovaMesh.scale.setScalar(0.1); // Start tiny, grows during merge
    kilonovaGroup.add(kilonovaMesh);
    parts.push({ mesh: kilonovaMesh, name: 'Kilonova Explosion' });
    group.add(kilonovaGroup);

    // ==========================================
    // 4. TIDAL DEBRIS STREAM (InstancedMesh)
    // ==========================================
    const debrisCount = 1500;
    const debrisGeo = new THREE.TetrahedronGeometry(1, 0);
    const debrisMesh = new THREE.InstancedMesh(debrisGeo, ejectaMat, debrisCount);
    const debrisDummy = new THREE.Object3D();
    const debrisData = [];

    for (let i = 0; i < debrisCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 30;
        const height = (Math.random() - 0.5) * 10;
        debrisData.push({
            angle, radius, height,
            speed: 1 + Math.random() * 3,
            size: 0.3 + Math.random() * 1.0,
            spiralRate: 0.5 + Math.random() * 2
        });
    }
    group.add(debrisMesh);
    tidalDebris.push({ mesh: debrisMesh, data: debrisData, dummy: debrisDummy });
    parts.push({ mesh: debrisMesh, name: 'Tidal Debris Stream' });

    // ==========================================
    // 5. R-PROCESS EJECTA (InstancedMesh)
    // ==========================================
    const ejectaCount = 800;
    const ejectaGeoShape = new THREE.SphereGeometry(1.2, 6, 6);
    const ejectaInstanceMesh = new THREE.InstancedMesh(ejectaGeoShape, heavyElementMat, ejectaCount);
    const ejectaDummy = new THREE.Object3D();
    const ejectaData = [];

    for (let i = 0; i < ejectaCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        ejectaData.push({
            phi, theta,
            speed: 0.5 + Math.random() * 2,
            radius: 0,
            size: 0.5 + Math.random() * 1.5,
            active: false
        });
    }
    group.add(ejectaInstanceMesh);
    ejectaParticles.push({ mesh: ejectaInstanceMesh, data: ejectaData, dummy: ejectaDummy });
    parts.push({ mesh: ejectaInstanceMesh, name: 'R-process Heavy Element Ejecta' });

    // ==========================================
    // 6. RELATIVISTIC JETS (Polar)
    // ==========================================
    for (let dir = -1; dir <= 1; dir += 2) {
        const jetConeGeo = new THREE.ConeGeometry(5, 250, 12, 6, true);
        const jetConeMesh = new THREE.Mesh(jetConeGeo, jetMat);
        jetConeMesh.position.y = dir * 150;
        if (dir === -1) jetConeMesh.rotation.x = Math.PI;
        group.add(jetConeMesh);

        // Jet internal particles
        const jParticleCount = 200;
        const jGeo = new THREE.SphereGeometry(0.5, 4, 4);
        const jMesh = new THREE.InstancedMesh(jGeo, jetMat, jParticleCount);
        const jDummy = new THREE.Object3D();
        const jData = [];
        for (let i = 0; i < jParticleCount; i++) {
            jData.push({
                dir,
                offset: Math.random() * 250,
                radial: Math.random() * 4,
                theta: Math.random() * Math.PI * 2,
                speed: 3 + Math.random() * 5
            });
        }
        group.add(jMesh);
        jetStreams.push({ mesh: jMesh, data: jData, dummy: jDummy });
    }
    parts.push({ mesh: jetStreams[0]?.mesh, name: 'Gamma-ray Burst Jets' });

    // ==========================================
    // 7. GRAVITATIONAL WAVE RIPPLES
    // ==========================================
    for (let i = 0; i < 10; i++) {
        const gwRadius = 80 + i * 25;
        const gwGeo = new THREE.TorusGeometry(gwRadius, 1, 6, 64);
        const gwMesh = new THREE.Mesh(gwGeo, gwWaveMat);
        gwMesh.rotation.x = Math.PI / 2;
        group.add(gwMesh);
        gwRipples.push({ mesh: gwMesh, baseRadius: gwRadius, index: i });
    }
    parts.push({ mesh: gwRipples[0]?.mesh, name: 'Gravitational Wave Fronts' });

    // ==========================================
    // 8. MAGNETIC ELEMENT CAPTURE TRAPS
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const trapAngle = (i / 8) * Math.PI * 2;
        const trapGroup = new THREE.Group();

        // Superconducting magnetic bottle
        const trapBodyGeo = new THREE.CylinderGeometry(8, 8, 30, 12);
        const trapBodyMesh = new THREE.Mesh(trapBodyGeo, trapMat);
        trapGroup.add(trapBodyMesh);
        parts.push({ mesh: trapBodyMesh, name: `Element Capture Trap ${i + 1}` });

        // Coils
        for (let c = 0; c < 5; c++) {
            const coilGeo = new THREE.TorusGeometry(10, 1, 6, 16);
            const coilMesh = new THREE.Mesh(coilGeo, copper);
            coilMesh.position.y = -10 + c * 5;
            trapGroup.add(coilMesh);
        }

        // Collection funnel
        const funnelGeo = new THREE.ConeGeometry(12, 20, 8, 1, true);
        const funnelMesh = new THREE.Mesh(funnelGeo, glass);
        funnelMesh.position.y = -25;
        trapGroup.add(funnelMesh);

        // Storage tank
        const tankGeo = new THREE.CapsuleGeometry(6, 15, 8, 12);
        const tankMesh = new THREE.Mesh(tankGeo, darkSteel);
        tankMesh.position.y = 25;
        trapGroup.add(tankMesh);

        trapGroup.position.set(
            Math.cos(trapAngle) * 180,
            0,
            Math.sin(trapAngle) * 180
        );
        trapGroup.lookAt(0, 0, 0);
        group.add(trapGroup);
        captureTraps.push({ group: trapGroup, angle: trapAngle, index: i });
    }

    // ==========================================
    // 9. OBSERVATION & COMMAND PLATFORM
    // ==========================================
    const obsGroup = new THREE.Group();
    const obsBodyGeo = new THREE.BoxGeometry(40, 10, 20);
    const obsBodyMesh = new THREE.Mesh(obsBodyGeo, trapMat);
    obsGroup.add(obsBodyMesh);

    // Sensors
    for (let i = 0; i < 6; i++) {
        const sensorGeo = new THREE.SphereGeometry(3, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const sensorMesh = new THREE.Mesh(sensorGeo, glass);
        sensorMesh.position.set(-12 + i * 5, 6, 0);
        obsGroup.add(sensorMesh);
    }

    // Communication array
    const commGeo = new THREE.ConeGeometry(8, 3, 12);
    const commMesh = new THREE.Mesh(commGeo, chrome);
    commMesh.position.set(0, 10, 0);
    commMesh.rotation.x = Math.PI;
    obsGroup.add(commMesh);

    obsGroup.position.set(0, 0, 220);
    group.add(obsGroup);
    parts.push({ mesh: obsGroup, name: 'Observation Command Platform' });

    // ==========================================
    // 10. NEUTRINO DETECTOR ARRAY
    // ==========================================
    const nuDetGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const detAngle = (i / 12) * Math.PI * 2;
        const detGeo = new THREE.IcosahedronGeometry(5, 1);
        const detMat = new THREE.MeshStandardMaterial({ color: 0x8888ff, emissive: 0x6666cc, emissiveIntensity: 1.5, transparent: true, opacity: 0.6 });
        const detMesh = new THREE.Mesh(detGeo, detMat);
        detMesh.position.set(
            Math.cos(detAngle) * 200,
            30 * Math.sin(detAngle * 2),
            Math.sin(detAngle) * 200
        );
        nuDetGroup.add(detMesh);
    }
    group.add(nuDetGroup);
    parts.push({ mesh: nuDetGroup, name: 'Neutrino Detector Array' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In a binary neutron star merger, the r-process (rapid neutron capture) produces elements heavier than iron. What physical condition distinguishes r-process nucleosynthesis from the slower s-process occurring in AGB stars?",
            options: [
                "The r-process requires temperatures above 10⁹ K, while the s-process operates at 10⁶ K",
                "In the r-process, the neutron capture timescale τₙ is much shorter than the β-decay timescale τ_β, allowing nuclei to capture many neutrons before decaying, reaching the neutron drip line",
                "The r-process only produces elements with even atomic numbers due to nuclear pairing energy",
                "The s-process requires free neutrons from ¹³C(α,n)¹⁶O reactions, while the r-process uses proton capture"
            ],
            correct: 1,
            explanation: "The defining feature of the r-process is τₙ << τ_β: seed nuclei capture neutrons so rapidly (within milliseconds) that they are driven far from the valley of stability to the neutron drip line before β-decay can occur. This produces extremely neutron-rich nuclei that subsequently β-decay back toward stability, creating the characteristic r-process abundance peaks at A ~ 80, 130, and 195 (shifted from s-process peaks due to the different nuclear physics path). Neutron star mergers provide the extreme neutron flux (Yₑ < 0.25) required."
        },
        {
            question: "The kilonova emission from a neutron star merger is powered by radioactive decay of r-process elements. What determines the characteristic red color and week-long timescale of the kilonova?",
            options: [
                "Hydrogen recombination in the ejecta, similar to Type II supernovae",
                "The high opacity of lanthanide elements (Z = 57-71) in the ejecta, whose complex f-electron configurations produce millions of spectral lines that trap radiation",
                "Synchrotron emission from the relativistic jet interacting with the ISM",
                "Thermal bremsstrahlung from the neutron-rich ejecta at T ~ 10⁴ K"
            ],
            correct: 1,
            explanation: "R-process nucleosynthesis in NSM ejecta produces abundant lanthanides and actinides. These elements have partially filled 4f and 5f electron shells, creating an enormous number of bound-bound transitions (millions of spectral lines). This produces an opacity κ ~ 10-100 cm²/g, roughly 100× higher than iron-group elements in supernova ejecta. The high opacity traps radiation, extending the diffusion timescale to days-weeks and shifting the peak emission to near-infrared wavelengths, producing the characteristic 'red kilonova' observed in GW170817."
        },
        {
            question: "The gravitational wave signal from a binary neutron star inspiral encodes information about the neutron star equation of state (EOS). What specific feature of the late-inspiral waveform is most sensitive to the EOS?",
            options: [
                "The initial frequency of the gravitational wave signal at the start of the observable inspiral",
                "The tidal deformability parameter Λ, which affects the gravitational wave phase evolution through tidal corrections at 5PN (post-Newtonian) order, causing the inspiral to accelerate relative to point-particle predictions",
                "The polarization angle of the gravitational wave at the detector",
                "The ringdown frequency of the final black hole remnant"
            ],
            correct: 1,
            explanation: "The dimensionless tidal deformability Λ = (2/3)k₂(R/M)⁵ (where k₂ is the Love number) characterizes how much a neutron star deforms under the companion's tidal field. Stiffer EOS → larger R → larger Λ → stronger tidal effects → faster phase evolution. This enters the gravitational wave phase at 5PN order and becomes significant in the last ~1000 orbits. GW170817 constrained Λ₁.₄ ≤ 800 (90% credible), ruling out the stiffest equations of state and constraining the radius of a 1.4 M☉ NS to R ~ 11-13 km."
        },
        {
            question: "During the merger, a hypermassive neutron star (HMNS) may temporarily form before collapsing to a black hole. What supports the HMNS against gravitational collapse during its brief (~10-100 ms) lifetime?",
            options: [
                "Electron degeneracy pressure from the iron core, similar to white dwarfs",
                "Differential rotation and thermal pressure, which provide additional support beyond the cold, uniformly-rotating maximum mass (the supramassive limit)",
                "Magnetic pressure from the amplified magnetic field acting as a magnetic cushion",
                "Centrifugal force from solid-body rotation at the mass-shedding (Keplerian) limit"
            ],
            correct: 1,
            explanation: "A HMNS has mass exceeding the maximum for a uniformly rotating cold neutron star (the supramassive limit, ~1.2× TOV mass). It is temporarily supported by: (1) Differential rotation—inner regions spin faster than outer, providing extra centrifugal support that uniform rotation cannot; (2) Thermal pressure from shock-heated material at T ~ 50-100 MeV. As differential rotation is dissipated by magnetic braking and viscosity (MRI-driven turbulence), and the star cools via neutrino emission, these supports vanish and the HMNS collapses to a black hole on the characteristic timescale of tens of milliseconds."
        },
        {
            question: "What fraction of all gold (Au, Z=79) and platinum (Pt, Z=78) in the universe is currently believed to originate from neutron star mergers versus core-collapse supernovae?",
            options: [
                "~50/50 split, with both contributing equally",
                "Nearly 100% from core-collapse supernovae, with NSMs being negligible",
                "Current evidence suggests NSMs are the dominant or possibly sole source, producing ~80-100% of r-process elements with A > 130, though the exact fraction remains debated",
                "The majority comes from cosmic ray spallation in the interstellar medium"
            ],
            correct: 2,
            explanation: "GW170817's kilonova AT2017gfo confirmed ~0.05 M☉ of r-process ejecta, including lanthanides. Combined with the estimated NSM rate (~10-100 per Milky Way per Myr), this can account for the full Galactic r-process inventory. Core-collapse supernovae (particularly magnetorotational supernovae and collapsars) may contribute to lighter r-process elements (A < 130), but the heavy r-process elements (gold, platinum, uranium) appear to require the extreme neutron-rich conditions (Yₑ ~ 0.01-0.25) unique to NS mergers. Galactic chemical evolution models increasingly favor NSMs as the dominant r-process site."
        }
    ];

    const description = `<h2>Neutron Star Merger Forge</h2>
<p>The Neutron Star Merger Forge captures and harnesses the most extreme nucleosynthesis event in the universe: the collision of two neutron stars. This catastrophic event—producing gravitational waves, gamma-ray bursts, and a kilonova—is the primary cosmic forge for elements heavier than iron, including gold, platinum, and uranium.</p>

<h3>Core Systems</h3>
<ul>
<li><strong>Binary Neutron Stars:</strong> Two ultra-dense stellar remnants (1.2 and 1.4 M☉), each with radii of ~12 km and surface magnetic fields of 10¹² Gauss, spiraling toward merger.</li>
<li><strong>R-process Capture Arrays:</strong> Eight superconducting magnetic bottle traps positioned around the merger site to capture newly synthesized heavy elements as they are ejected at 0.1-0.3c.</li>
<li><strong>Gravitational Wave Detectors:</strong> Ripples in spacetime propagating outward at light speed, encoding information about the neutron star equation of state.</li>
<li><strong>Relativistic Jets:</strong> Gamma-ray burst jets launched along the spin axis by the Blandford-Znajek mechanism from the post-merger black hole.</li>
</ul>

<h3>Nucleosynthesis Output</h3>
<p>Each merger produces approximately 10⁻² solar masses of r-process material, including ~10 Earth masses of gold, ~30 Earth masses of platinum, and traces of transuranic elements. The forge's capture traps harvest these newly-created heavy elements from the expanding ejecta cloud.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // Merger cycle: stars spiral closer, merge, and reset
        const cycleTime = 15; // seconds per full cycle
        const phase = (time * speed) % cycleTime;
        const mergeProgress = Math.min(phase / (cycleTime * 0.7), 1.0); // 0 to 1 during inspiral

        // 1. Binary neutron star orbital inspiral
        const orbitRadius = 40 * (1 - mergeProgress * 0.85); // Shrink from 40 to 6
        const orbitSpeed = 1 + mergeProgress * 15; // Accelerate as they spiral in

        neutronStars.forEach((ns, idx) => {
            const angle = time * speed * orbitSpeed + idx * Math.PI;
            ns.group.position.x = Math.cos(angle) * orbitRadius;
            ns.group.position.z = Math.sin(angle) * orbitRadius;
            ns.core.rotation.y = time * speed * 10; // Fast spin
            ns.core.rotation.x = time * speed * 3;

            // Scale slightly as tidal effects deform the stars
            const tidalStretch = 1 + mergeProgress * 0.15;
            ns.core.scale.set(tidalStretch, 1 / tidalStretch, tidalStretch);
        });

        // 2. Kilonova explosion (grows during/after merger)
        const mergePhase = phase / cycleTime;
        if (mergePhase > 0.65) {
            const kilonovaProgress = (mergePhase - 0.65) / 0.35;
            const kScale = Math.min(kilonovaProgress * 30, 25);
            kilonovaMesh.scale.setScalar(kScale);
            kilonovaMesh.material.opacity = Math.max(0.6 - kilonovaProgress * 0.5, 0.1);
            kilonovaMesh.material.emissiveIntensity = 8.0 * (1 - kilonovaProgress * 0.7);
        } else {
            kilonovaMesh.scale.setScalar(0.1);
        }
        kilonovaMesh.rotation.x = time * speed;
        kilonovaMesh.rotation.y = time * speed * 0.7;

        // 3. Tidal debris stream
        tidalDebris.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                d.angle += d.speed * speed * 0.02;
                const effectiveRadius = d.radius * (1 - mergeProgress * 0.3) + mergeProgress * 15;
                dummy.position.set(
                    Math.cos(d.angle) * effectiveRadius,
                    d.height + Math.sin(time * speed * 3 + i) * 2,
                    Math.sin(d.angle) * effectiveRadius
                );
                dummy.scale.setScalar(d.size * (0.5 + mergeProgress * 0.5));
                dummy.rotation.set(time * speed * d.speed, time * speed * d.speed * 0.5, 0);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 4. R-process ejecta (emitted after merger)
        ejectaParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (mergePhase > 0.65) {
                    e.radius += e.speed * speed * 0.3;
                    if (e.radius > 200) e.radius = 0;
                    dummy.position.set(
                        e.radius * Math.sin(e.phi) * Math.cos(e.theta),
                        e.radius * Math.cos(e.phi),
                        e.radius * Math.sin(e.phi) * Math.sin(e.theta)
                    );
                    dummy.scale.setScalar(e.size);
                } else {
                    e.radius = 0;
                    dummy.scale.setScalar(0);
                }
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 5. Gravitational wave ripple propagation
        gwRipples.forEach(gw => {
            const expandFactor = 1 + Math.sin(time * speed * 3 - gw.index * 0.8) * 0.05;
            gw.mesh.scale.set(expandFactor, expandFactor, 1);
            gw.mesh.material.opacity = 0.15 + mergeProgress * 0.1 + Math.sin(time * speed * 4 + gw.index) * 0.05;

            // Chirp: ripples get stronger and closer together near merger
            const chirpFreq = 1 + mergeProgress * 5;
            gw.mesh.rotation.z = time * speed * chirpFreq * 0.1;
        });

        // 6. Jet stream particles
        jetStreams.forEach(sys => {
            const { mesh, data, dummy } = sys;
            const jetActive = mergePhase > 0.7;
            for (let i = 0; i < data.length; i++) {
                const j = data[i];
                if (jetActive) {
                    const y = j.dir * ((time * speed * j.speed * 20 + j.offset) % 250 + 25);
                    dummy.position.set(
                        Math.cos(j.theta) * j.radial,
                        y,
                        Math.sin(j.theta) * j.radial
                    );
                    dummy.scale.setScalar(0.5 + Math.random() * 0.5);
                } else {
                    dummy.scale.setScalar(0);
                }
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 7. Capture trap activity (glow when elements arrive)
        captureTraps.forEach(trap => {
            const activity = mergePhase > 0.75 ? Math.sin(time * speed * 5 + trap.index) * 0.5 + 0.5 : 0;
            const glow = 1 + activity * 0.2;
            trap.group.scale.setScalar(glow);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
