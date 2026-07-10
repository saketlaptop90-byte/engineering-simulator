import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM MATRIOSHKA BRAIN MATERIALS
    // ==========================================
    const starCoreMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 6.0 });
    const innerShellMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 2.5, transparent: true, opacity: 0.35, side: 2 });
    const midShellMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xcc6600, emissiveIntensity: 1.5, transparent: true, opacity: 0.25, side: 2 });
    const outerShellMat = new THREE.MeshStandardMaterial({ color: 0x884400, emissive: 0x662200, emissiveIntensity: 0.8, transparent: true, opacity: 0.2, side: 2 });
    const coldShellMat = new THREE.MeshStandardMaterial({ color: 0x224466, emissive: 0x112244, emissiveIntensity: 0.4, transparent: true, opacity: 0.15, side: 2 });
    const computeNodeMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 3.0 });
    const dataPulseMat = new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 4.0, transparent: true, opacity: 0.7 });
    const energyFlowMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 3.0, transparent: true, opacity: 0.5 });
    const wasteHeatMat = new THREE.MeshStandardMaterial({ color: 0x880000, emissive: 0x660000, emissiveIntensity: 1.0, transparent: true, opacity: 0.4 });
    const networkMat = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.5 });
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.8, roughness: 0.3 });
    const coronaMat = new THREE.MeshStandardMaterial({ color: 0xffee88, emissive: 0xffcc44, emissiveIntensity: 5.0, transparent: true, opacity: 0.3, wireframe: true });

    // Dynamic arrays
    const shells = [];
    const computeNodes = [];
    const dataPulses = [];
    const energyFlows = [];
    const solarFlares = [];
    const interShellBeams = [];

    // ==========================================
    // 1. CENTRAL STAR
    // ==========================================
    const starGroup = new THREE.Group();

    // Star photosphere
    const starGeo = new THREE.IcosahedronGeometry(25, 4);
    const starMesh = new THREE.Mesh(starGeo, starCoreMat);
    starGroup.add(starMesh);
    parts.push({ mesh: starMesh, name: 'Central Star Photosphere' });

    // Star corona (outer atmosphere)
    const coronaGeo = new THREE.IcosahedronGeometry(32, 3);
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    starGroup.add(coronaMesh);
    parts.push({ mesh: coronaMesh, name: 'Stellar Corona' });

    // Convection cells on star surface (bumpy texture via vertex displacement done visually)
    const sunspotCount = 12;
    for (let i = 0; i < sunspotCount; i++) {
        const spotGeo = new THREE.CircleGeometry(3 + Math.random() * 4, 12);
        const spotMat = new THREE.MeshStandardMaterial({ color: 0xcc6600, emissive: 0x993300, emissiveIntensity: 1.0 });
        const spotMesh = new THREE.Mesh(spotGeo, spotMat);

        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        spotMesh.position.set(
            26 * Math.sin(phi) * Math.cos(theta),
            26 * Math.cos(phi),
            26 * Math.sin(phi) * Math.sin(theta)
        );
        spotMesh.lookAt(0, 0, 0);
        starGroup.add(spotMesh);
    }

    // Solar flare protuberances
    for (let i = 0; i < 6; i++) {
        const flarePoints = [];
        const flareAngle = (i / 6) * Math.PI * 2;
        const baseX = Math.cos(flareAngle) * 25;
        const baseZ = Math.sin(flareAngle) * 25;
        for (let t = 0; t <= 20; t++) {
            const param = t / 20;
            const height = Math.sin(param * Math.PI) * (15 + Math.random() * 10);
            flarePoints.push(new THREE.Vector3(
                baseX + Math.cos(flareAngle) * height,
                param * 30 - 15,
                baseZ + Math.sin(flareAngle) * height
            ));
        }
        const flareCurve = new THREE.CatmullRomCurve3(flarePoints);
        const flareGeo = new THREE.TubeGeometry(flareCurve, 20, 1.5, 6, false);
        const flareMesh = new THREE.Mesh(flareGeo, energyFlowMat);
        starGroup.add(flareMesh);
        solarFlares.push({ mesh: flareMesh, angle: flareAngle });
    }

    group.add(starGroup);

    // ==========================================
    // 2. DYSON SHELL 1 - INNERMOST (HOTTEST ~3000K)
    // ==========================================
    const shell1Group = new THREE.Group();
    const shell1Radius = 70;

    // Shell sphere
    const shell1Geo = new THREE.IcosahedronGeometry(shell1Radius, 3);
    const shell1Mesh = new THREE.Mesh(shell1Geo, innerShellMat);
    shell1Group.add(shell1Mesh);
    parts.push({ mesh: shell1Mesh, name: 'Shell 1 - Infrared Computronium (T ~ 3000K)' });
    shells.push({ group: shell1Group, mesh: shell1Mesh, radius: shell1Radius, rotSpeed: 0.3, axis: 'y' });

    // Compute nodes on shell 1 surface (InstancedMesh)
    const s1NodeCount = 500;
    const s1NodeGeo = new THREE.BoxGeometry(2, 2, 2);
    const s1NodeMesh = new THREE.InstancedMesh(s1NodeGeo, computeNodeMat, s1NodeCount);
    const s1Dummy = new THREE.Object3D();
    const s1Data = [];
    for (let i = 0; i < s1NodeCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        s1Data.push({ phi, theta, pulse: Math.random() * Math.PI * 2 });
        s1Dummy.position.set(
            shell1Radius * Math.sin(phi) * Math.cos(theta),
            shell1Radius * Math.cos(phi),
            shell1Radius * Math.sin(phi) * Math.sin(theta)
        );
        s1Dummy.lookAt(0, 0, 0);
        s1Dummy.scale.setScalar(0.8 + Math.random() * 0.4);
        s1Dummy.updateMatrix();
        s1NodeMesh.setMatrixAt(i, s1Dummy.matrix);
    }
    s1NodeMesh.instanceMatrix.needsUpdate = true;
    shell1Group.add(s1NodeMesh);
    computeNodes.push({ mesh: s1NodeMesh, data: s1Data, dummy: s1Dummy, radius: shell1Radius, shell: 0 });

    // Network connections (wireframe icosahedron)
    const net1Geo = new THREE.IcosahedronGeometry(shell1Radius + 1, 2);
    const net1Mesh = new THREE.Mesh(net1Geo, networkMat);
    shell1Group.add(net1Mesh);

    group.add(shell1Group);

    // ==========================================
    // 3. DYSON SHELL 2 - MIDDLE (WARM ~800K)
    // ==========================================
    const shell2Group = new THREE.Group();
    const shell2Radius = 120;

    const shell2Geo = new THREE.IcosahedronGeometry(shell2Radius, 3);
    const shell2Mesh = new THREE.Mesh(shell2Geo, midShellMat);
    shell2Group.add(shell2Mesh);
    parts.push({ mesh: shell2Mesh, name: 'Shell 2 - Microwave Computronium (T ~ 800K)' });
    shells.push({ group: shell2Group, mesh: shell2Mesh, radius: shell2Radius, rotSpeed: 0.2, axis: 'x' });

    // Compute nodes on shell 2
    const s2NodeCount = 800;
    const s2NodeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const s2NodeMesh = new THREE.InstancedMesh(s2NodeGeo, computeNodeMat, s2NodeCount);
    const s2Dummy = new THREE.Object3D();
    const s2Data = [];
    for (let i = 0; i < s2NodeCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        s2Data.push({ phi, theta, pulse: Math.random() * Math.PI * 2 });
        s2Dummy.position.set(
            shell2Radius * Math.sin(phi) * Math.cos(theta),
            shell2Radius * Math.cos(phi),
            shell2Radius * Math.sin(phi) * Math.sin(theta)
        );
        s2Dummy.lookAt(0, 0, 0);
        s2Dummy.scale.setScalar(0.6 + Math.random() * 0.4);
        s2Dummy.updateMatrix();
        s2NodeMesh.setMatrixAt(i, s2Dummy.matrix);
    }
    s2NodeMesh.instanceMatrix.needsUpdate = true;
    shell2Group.add(s2NodeMesh);
    computeNodes.push({ mesh: s2NodeMesh, data: s2Data, dummy: s2Dummy, radius: shell2Radius, shell: 1 });

    const net2Geo = new THREE.IcosahedronGeometry(shell2Radius + 1, 2);
    const net2Mesh = new THREE.Mesh(net2Geo, networkMat);
    shell2Group.add(net2Mesh);

    group.add(shell2Group);

    // ==========================================
    // 4. DYSON SHELL 3 - OUTER (COOL ~300K)
    // ==========================================
    const shell3Group = new THREE.Group();
    const shell3Radius = 180;

    const shell3Geo = new THREE.IcosahedronGeometry(shell3Radius, 2);
    const shell3Mesh = new THREE.Mesh(shell3Geo, outerShellMat);
    shell3Group.add(shell3Mesh);
    parts.push({ mesh: shell3Mesh, name: 'Shell 3 - Radio-wave Computronium (T ~ 300K)' });
    shells.push({ group: shell3Group, mesh: shell3Mesh, radius: shell3Radius, rotSpeed: 0.12, axis: 'z' });

    // Compute nodes on shell 3
    const s3NodeCount = 1200;
    const s3NodeGeo = new THREE.BoxGeometry(1, 1, 1);
    const s3NodeMesh = new THREE.InstancedMesh(s3NodeGeo, computeNodeMat, s3NodeCount);
    const s3Dummy = new THREE.Object3D();
    const s3Data = [];
    for (let i = 0; i < s3NodeCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        s3Data.push({ phi, theta, pulse: Math.random() * Math.PI * 2 });
        s3Dummy.position.set(
            shell3Radius * Math.sin(phi) * Math.cos(theta),
            shell3Radius * Math.cos(phi),
            shell3Radius * Math.sin(phi) * Math.sin(theta)
        );
        s3Dummy.lookAt(0, 0, 0);
        s3Dummy.scale.setScalar(0.5 + Math.random() * 0.3);
        s3Dummy.updateMatrix();
        s3NodeMesh.setMatrixAt(i, s3Dummy.matrix);
    }
    s3NodeMesh.instanceMatrix.needsUpdate = true;
    shell3Group.add(s3NodeMesh);
    computeNodes.push({ mesh: s3NodeMesh, data: s3Data, dummy: s3Dummy, radius: shell3Radius, shell: 2 });

    const net3Geo = new THREE.IcosahedronGeometry(shell3Radius + 1, 1);
    const net3Mesh = new THREE.Mesh(net3Geo, networkMat);
    shell3Group.add(net3Mesh);

    group.add(shell3Group);

    // ==========================================
    // 5. OUTERMOST COLD SHELL (RADIATOR ~50K)
    // ==========================================
    const shell4Group = new THREE.Group();
    const shell4Radius = 240;

    const shell4Geo = new THREE.IcosahedronGeometry(shell4Radius, 1);
    const shell4Mesh = new THREE.Mesh(shell4Geo, coldShellMat);
    shell4Group.add(shell4Mesh);
    parts.push({ mesh: shell4Mesh, name: 'Shell 4 - Cold Radiator Shell (T ~ 50K)' });
    shells.push({ group: shell4Group, mesh: shell4Mesh, radius: shell4Radius, rotSpeed: 0.08, axis: 'y' });

    // Massive radiator fins
    for (let i = 0; i < 20; i++) {
        const finAngle = (i / 20) * Math.PI * 2;
        const finGeo = new THREE.BoxGeometry(2, 60, 40);
        const finMesh = new THREE.Mesh(finGeo, radiatorMat);
        finMesh.position.set(
            Math.cos(finAngle) * (shell4Radius + 30),
            0,
            Math.sin(finAngle) * (shell4Radius + 30)
        );
        finMesh.rotation.y = -finAngle;
        shell4Group.add(finMesh);
    }

    group.add(shell4Group);

    // ==========================================
    // 6. INTER-SHELL ENERGY TRANSFER CONDUITS
    // ==========================================
    for (let i = 0; i < 12; i++) {
        const conduitPhi = Math.acos(2 * (i / 12) - 1);
        const conduitTheta = (i / 12) * Math.PI * 2 * 1.618; // Golden ratio spacing

        // Conduit from star to shell 1
        const dir = new THREE.Vector3(
            Math.sin(conduitPhi) * Math.cos(conduitTheta),
            Math.cos(conduitPhi),
            Math.sin(conduitPhi) * Math.sin(conduitTheta)
        );

        // Full conduit running through all shells
        const conduitLen = shell4Radius - 30;
        const conduitGeo = new THREE.CylinderGeometry(1.5, 1.5, conduitLen, 6);
        const conduitMesh = new THREE.Mesh(conduitGeo, energyFlowMat);
        conduitMesh.position.copy(dir.clone().multiplyScalar(30 + conduitLen / 2));
        conduitMesh.lookAt(0, 0, 0);
        conduitMesh.rotateX(Math.PI / 2);
        group.add(conduitMesh);

        interShellBeams.push({ mesh: conduitMesh, phi: conduitPhi, theta: conduitTheta, index: i });
    }
    parts.push({ mesh: interShellBeams[0]?.mesh, name: 'Inter-Shell Energy Conduits' });

    // ==========================================
    // 7. DATA PULSE PARTICLE SYSTEM (InstancedMesh)
    // ==========================================
    const pulseCount = 600;
    const pulseGeo = new THREE.SphereGeometry(1, 6, 6);
    const pulseMesh = new THREE.InstancedMesh(pulseGeo, dataPulseMat, pulseCount);
    const pulseDummy = new THREE.Object3D();
    const pulseData = [];

    for (let i = 0; i < pulseCount; i++) {
        const shell = Math.floor(Math.random() * 4);
        const shellRadii = [shell1Radius, shell2Radius, shell3Radius, shell4Radius];
        const r = shellRadii[shell];
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;

        pulseData.push({
            shell: shell,
            radius: r,
            phi: phi,
            theta: theta,
            speed: 1 + Math.random() * 3,
            direction: Math.random() > 0.5 ? 1 : -1,
            size: 0.5 + Math.random() * 1.0
        });
    }
    group.add(pulseMesh);
    dataPulses.push({ mesh: pulseMesh, data: pulseData, dummy: pulseDummy });
    parts.push({ mesh: pulseMesh, name: 'Data Pulse Network' });

    // ==========================================
    // 8. WASTE HEAT RADIATION VISUALIZATION
    // ==========================================
    const wasteHeatCount = 300;
    const whGeo = new THREE.SphereGeometry(0.6, 4, 4);
    const whMesh = new THREE.InstancedMesh(whGeo, wasteHeatMat, wasteHeatCount);
    const whDummy = new THREE.Object3D();
    const whData = [];

    for (let i = 0; i < wasteHeatCount; i++) {
        const startShell = Math.floor(Math.random() * 3); // 0, 1, or 2
        const shellRadii = [shell1Radius, shell2Radius, shell3Radius];
        const targetRadii = [shell2Radius, shell3Radius, shell4Radius];

        whData.push({
            startR: shellRadii[startShell],
            endR: targetRadii[startShell],
            phi: Math.acos(2 * Math.random() - 1),
            theta: Math.random() * Math.PI * 2,
            phase: Math.random(),
            speed: 0.3 + Math.random() * 0.5
        });
    }
    group.add(whMesh);
    energyFlows.push({ mesh: whMesh, data: whData, dummy: whDummy });
    parts.push({ mesh: whMesh, name: 'Waste Heat Radiation' });

    // ==========================================
    // 9. COMMAND & CONTROL HUB
    // ==========================================
    const ccGroup = new THREE.Group();

    // Central processing node (between shell 1 and star)
    const ccCoreGeo = new THREE.OctahedronGeometry(8, 2);
    const ccCoreMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00cccc, emissiveIntensity: 3.0, wireframe: true });
    const ccCoreMesh = new THREE.Mesh(ccCoreGeo, ccCoreMat);
    ccCoreMesh.position.set(0, 50, 0);
    ccGroup.add(ccCoreMesh);
    parts.push({ mesh: ccCoreMesh, name: 'Central Processing Hub' });

    // Antenna spines
    for (let i = 0; i < 6; i++) {
        const spineGeo = new THREE.CylinderGeometry(0.3, 0.3, 25, 4);
        const spineMesh = new THREE.Mesh(spineGeo, chrome);
        const spineAngle = (i / 6) * Math.PI * 2;
        spineMesh.position.set(
            Math.cos(spineAngle) * 12 + 0,
            50,
            Math.sin(spineAngle) * 12
        );
        ccGroup.add(spineMesh);
    }

    group.add(ccGroup);

    // ==========================================
    // 10. STRUCTURAL SUPPORT FRAMEWORK
    // ==========================================
    // Latticework connecting shells at key structural points
    for (let i = 0; i < 8; i++) {
        const strutPhi = Math.acos(2 * (i + 0.5) / 8 - 1);
        const strutTheta = (i * 1.618) * Math.PI * 2;
        const dir = new THREE.Vector3(
            Math.sin(strutPhi) * Math.cos(strutTheta),
            Math.cos(strutPhi),
            Math.sin(strutPhi) * Math.sin(strutTheta)
        );

        // Cross braces at each shell intersection
        for (let s = 0; s < 3; s++) {
            const radii = [shell1Radius, shell2Radius, shell3Radius];
            const braceGeo = new THREE.BoxGeometry(3, 3, 15);
            const braceMesh = new THREE.Mesh(braceGeo, darkSteel);
            braceMesh.position.copy(dir.clone().multiplyScalar(radii[s]));
            braceMesh.lookAt(0, 0, 0);
            group.add(braceMesh);
        }
    }

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "A Matrioshka brain uses multiple nested Dyson shells at different temperatures to maximize computational efficiency. According to the Landauer principle, what is the minimum energy dissipated per irreversible bit operation at temperature T?",
            options: [
                "E = kT, where k is Boltzmann's constant",
                "E = kT ln(2), the Landauer limit for irreversible computation",
                "E = ħ/τ, where τ is the switching time (quantum speed limit)",
                "E = kT²/ΔT, derived from the Carnot efficiency between shells"
            ],
            correct: 1,
            explanation: "Landauer's principle states that erasing one bit of information in a system at temperature T requires a minimum energy dissipation of E_min = kT ln(2) ≈ 2.87 × 10⁻²¹ J at room temperature. This is a fundamental thermodynamic bound: information is physical, and its erasure increases entropy by at least k ln(2). A Matrioshka brain exploits this by operating inner shells at higher T (faster computation, more energy per operation) and cascading waste heat to outer, colder shells that perform more energy-efficient computations per joule of waste heat received."
        },
        {
            question: "The computational capacity of a Matrioshka brain is ultimately bounded by what fundamental physical limit?",
            options: [
                "The Bekenstein bound: maximum information content proportional to the surface area enclosing the system, I_max = 2πRE/(ħc ln2)",
                "Moore's law extrapolation to the atomic scale",
                "The Schwarzschild radius limit on mass concentration",
                "The diffraction limit on optical interconnect bandwidth"
            ],
            correct: 0,
            explanation: "The Bekenstein bound sets the absolute maximum information (and thus computational states) that can exist in a finite region: I_max = 2πRE/(ħc ln2), where R is the radius and E is the total energy. For a Matrioshka brain capturing a Sun-like star's entire luminosity (3.8×10²⁶ W) with outermost shell at radius ~1 AU, this gives an astronomical but finite upper bound on its computational state space. Approaching this limit converts the structure into a black hole, establishing the ultimate physical limit on computation."
        },
        {
            question: "Why does a Matrioshka brain use multiple concentric shells rather than a single optimal-temperature shell?",
            options: [
                "Multiple shells provide redundancy against meteorite impacts",
                "Each shell operates as a Carnot engine between temperature tiers, extracting computational work from the temperature gradient and recycling waste heat at progressively lower temperatures",
                "A single shell would become gravitationally unstable due to radiation pressure",
                "The inner shells focus starlight onto the outer shells for photovoltaic conversion"
            ],
            correct: 1,
            explanation: "A single shell would absorb stellar radiation and re-radiate waste heat at its equilibrium temperature, wasting the potential to extract further computational work. By nesting shells at progressively lower temperatures T₁ > T₂ > T₃ > ..., each shell acts as a heat engine with Carnot efficiency η = 1 - T_{n+1}/T_n. The waste heat from shell n becomes the input energy for shell n+1, enabling additional computation at each tier. This cascading architecture maximizes total computational operations per unit of stellar luminosity, approaching the thermodynamic limit."
        },
        {
            question: "Seth Lloyd estimated the maximum computational speed of a system with energy E. What is this 'ultimate laptop' limit, and how does it apply to a stellar-scale computer?",
            options: [
                "ν_max = 2E/(πħ) operations per second, derived from the Margolus-Levitin theorem bounding the speed of quantum state evolution",
                "ν_max = E/kT operations per second, set by thermal fluctuation timescales",
                "ν_max = c/λ_deBroglie operations per second, limited by the de Broglie wavelength of the processing elements",
                "ν_max = E²/(ħc⁵) operations per second, derived from the Planck time constraint"
            ],
            correct: 0,
            explanation: "The Margolus-Levitin theorem proves that a quantum system with energy E above its ground state can transition between orthogonal states at most ν_max = 2E/(πħ) times per second. For the Sun's luminosity (3.8×10²⁶ W), this gives ~10⁴⁷ operations per second—vastly exceeding any conventional computer. However, this is a theoretical maximum assuming all energy goes to computation with no overhead. A realistic Matrioshka brain would achieve a fraction of this, limited by the Landauer dissipation at each shell's temperature."
        },
        {
            question: "A key engineering challenge for a Matrioshka brain is maintaining structural stability. What mechanism prevents each Dyson shell from collapsing onto the star due to gravity?",
            options: [
                "Active station-keeping using thrusters distributed across the shell surface, since a rigid Dyson shell is gravitationally unstable (no net restoring force for displacements from center, per the shell theorem)",
                "The radiation pressure from the star naturally pushes each shell outward in a stable equilibrium",
                "Gyroscopic stabilization from the shell's rotation about the stellar axis",
                "Magnetic levitation using the star's magnetosphere"
            ],
            correct: 0,
            explanation: "By the shell theorem (Gauss's law for gravity), a uniform spherical shell experiences no net gravitational force from a point mass at its center—any displacement produces no restoring force. This means a solid Dyson sphere is a saddle point, not a stable equilibrium: any perturbation causes it to drift and eventually collide with the star. Radiation pressure does push outward but also provides no lateral restoring force. Therefore, active station-keeping (distributed thrusters or solar sails) is essential. Alternatively, a Dyson swarm of independent orbiting units avoids this problem entirely."
        }
    ];

    const description = `<h2>Matrioshka Brain Computronium</h2>
<p>The Matrioshka Brain is the ultimate expression of computational megascale engineering: a nested series of Dyson spheres surrounding a star, each operating at a different temperature tier to maximize total computational throughput per unit of stellar luminosity.</p>

<h3>Architecture</h3>
<ul>
<li><strong>Shell 1 (T ~ 3000K):</strong> The innermost computronium layer absorbs raw stellar radiation, performing the highest-energy, fastest computations. Its waste heat (~infrared) is radiated outward.</li>
<li><strong>Shell 2 (T ~ 800K):</strong> Absorbs Shell 1's waste heat, performing additional computations at lower energy cost per operation (Landauer principle: E_min = kT ln 2).</li>
<li><strong>Shell 3 (T ~ 300K):</strong> Operates near room temperature, maximizing energy efficiency for the most computations per joule.</li>
<li><strong>Shell 4 (T ~ 50K):</strong> The outermost cold radiator shell dissipates final waste heat into the cosmic microwave background at 2.7K.</li>
</ul>

<h3>Computational Capacity</h3>
<p>Capturing the full luminosity of a Sun-like star (L☉ ≈ 3.8 × 10²⁶ W) and operating near Landauer limits, a Matrioshka brain could perform approximately 10⁴⁷ operations per second (Margolus-Levitin bound) while storing up to 10⁴² bits (Bekenstein bound for the outermost shell). This far exceeds the computational capacity of all computers ever built by humanity by a factor of roughly 10³⁰.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Star pulsation and rotation
        starMesh.rotation.y = time * speed * 0.5;
        const starPulse = 1.0 + Math.sin(time * speed * 3) * 0.03;
        starMesh.scale.setScalar(starPulse);
        starMesh.material.emissiveIntensity = 5.0 + Math.sin(time * speed * 4) * 2.0;
        coronaMesh.rotation.y = -time * speed * 0.3;
        coronaMesh.rotation.x = time * speed * 0.1;
        const coronaScale = 1.0 + Math.sin(time * speed * 2) * 0.05;
        coronaMesh.scale.setScalar(coronaScale);

        // 2. Shell rotations (each on different axis at different speed)
        shells.forEach(shell => {
            if (shell.axis === 'y') shell.group.rotation.y = time * speed * shell.rotSpeed;
            else if (shell.axis === 'x') shell.group.rotation.x = time * speed * shell.rotSpeed;
            else shell.group.rotation.z = time * speed * shell.rotSpeed;

            // Shell breathing
            const breathe = 1.0 + Math.sin(time * speed * 1.5 + shell.radius * 0.01) * 0.01;
            shell.mesh.scale.setScalar(breathe);
        });

        // 3. Compute node pulsation (glowing data processing)
        computeNodes.forEach(cn => {
            const { mesh, data, dummy, radius } = cn;
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                const pulseScale = 0.6 + Math.abs(Math.sin(time * speed * 5 + d.pulse)) * 0.8;
                dummy.position.set(
                    radius * Math.sin(d.phi) * Math.cos(d.theta),
                    radius * Math.cos(d.phi),
                    radius * Math.sin(d.phi) * Math.sin(d.theta)
                );
                dummy.lookAt(0, 0, 0);
                dummy.scale.setScalar(pulseScale);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 4. Data pulses racing along shell surfaces
        dataPulses.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                d.theta += d.speed * speed * 0.03 * d.direction;
                d.phi += d.speed * speed * 0.01;
                dummy.position.set(
                    d.radius * Math.sin(d.phi) * Math.cos(d.theta),
                    d.radius * Math.cos(d.phi),
                    d.radius * Math.sin(d.phi) * Math.sin(d.theta)
                );
                const pScale = d.size * (0.8 + Math.sin(time * speed * 8 + i) * 0.4);
                dummy.scale.setScalar(pScale);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 5. Waste heat radiation flowing outward between shells
        energyFlows.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const w = data[i];
                w.phase = (w.phase + w.speed * speed * 0.01) % 1.0;
                const currentR = w.startR + (w.endR - w.startR) * w.phase;
                dummy.position.set(
                    currentR * Math.sin(w.phi) * Math.cos(w.theta),
                    currentR * Math.cos(w.phi),
                    currentR * Math.sin(w.phi) * Math.sin(w.theta)
                );
                dummy.scale.setScalar(0.5 + (1 - w.phase) * 0.5); // Fades as it moves outward
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 6. Inter-shell conduit pulsation
        interShellBeams.forEach(beam => {
            const pulse = 0.7 + Math.sin(time * speed * 6 + beam.index * 0.5) * 0.5;
            beam.mesh.material.opacity = 0.3 + Math.sin(time * speed * 4 + beam.index) * 0.2;
            beam.mesh.scale.set(pulse, 1, pulse);
        });

        // 7. Central hub rotation
        ccCoreMesh.rotation.x = time * speed * 2;
        ccCoreMesh.rotation.z = time * speed * 1.5;
        const hubPulse = 1.0 + Math.sin(time * speed * 4) * 0.2;
        ccCoreMesh.scale.setScalar(hubPulse);
    }

    return { group, parts, description, quizQuestions, animate };
}
