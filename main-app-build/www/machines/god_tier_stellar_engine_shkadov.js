import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM SHKADOV THRUSTER MATERIALS
    // ==========================================
    const starMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 6.0 });
    const coronaMat = new THREE.MeshStandardMaterial({ color: 0xffee88, emissive: 0xffcc44, emissiveIntensity: 3.0, transparent: true, opacity: 0.3, wireframe: true });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.02, side: 2 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.15 });
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.85, roughness: 0.2 });
    const solarWindMat = new THREE.MeshStandardMaterial({ color: 0xffdd44, emissive: 0xffcc00, emissiveIntensity: 3.0, transparent: true, opacity: 0.3 });
    const reflectedMat = new THREE.MeshStandardMaterial({ color: 0xffff88, emissive: 0xffff44, emissiveIntensity: 4.0, transparent: true, opacity: 0.5 });
    const bowShockMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2266ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.15, wireframe: true, side: 2 });
    const flareMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 4.0, transparent: true, opacity: 0.5 });
    const cmeMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 3.0, transparent: true, opacity: 0.4 });
    const stationMat = new THREE.MeshStandardMaterial({ color: 0x667788, metalness: 0.8, roughness: 0.25 });

    // Dynamic arrays
    const mirrorSegments = [];
    const solarFlares = [];
    const radiationParticles = [];
    const reflectedBeams = [];
    const bowShockElements = [];
    const stationKeepers = [];
    const cmeParticles = [];

    // ==========================================
    // 1. CENTRAL STAR (G-type main sequence)
    // ==========================================
    const starGroup = new THREE.Group();

    // Stellar photosphere
    const starGeo = new THREE.IcosahedronGeometry(60, 4);
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starGroup.add(starMesh);
    parts.push({ mesh: starMesh, name: 'Central Star (1 M☉ G2V)' });

    // Corona
    const coronaGeo = new THREE.IcosahedronGeometry(75, 3);
    const coronaFMesh = new THREE.Mesh(coronaGeo, coronaMat);
    starGroup.add(coronaFMesh);
    parts.push({ mesh: coronaFMesh, name: 'Stellar Corona' });

    // Chromosphere granulation (sunspots)
    for (let i = 0; i < 20; i++) {
        const spotRadius = 3 + Math.random() * 8;
        const spotGeo = new THREE.CircleGeometry(spotRadius, 12);
        const spotMat = new THREE.MeshStandardMaterial({ color: 0xaa6600, emissive: 0x884400, emissiveIntensity: 1.0 });
        const spotMesh = new THREE.Mesh(spotGeo, spotMat);
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        spotMesh.position.set(
            61 * Math.sin(phi) * Math.cos(theta),
            61 * Math.cos(phi),
            61 * Math.sin(phi) * Math.sin(theta)
        );
        spotMesh.lookAt(0, 0, 0);
        starGroup.add(spotMesh);
    }

    // Solar flare protuberances
    for (let i = 0; i < 8; i++) {
        const flarePoints = [];
        const flareAngle = (i / 8) * Math.PI * 2;
        const flareLat = (Math.random() - 0.5) * Math.PI * 0.6;
        for (let t = 0; t <= 25; t++) {
            const param = t / 25;
            const height = Math.sin(param * Math.PI) * (20 + Math.random() * 15);
            const baseR = 60;
            flarePoints.push(new THREE.Vector3(
                (baseR + height) * Math.cos(flareAngle + param * 0.3) * Math.cos(flareLat),
                (baseR + height) * Math.sin(flareLat) + param * 10 - 5,
                (baseR + height) * Math.sin(flareAngle + param * 0.3) * Math.cos(flareLat)
            ));
        }
        const flareCurve = new THREE.CatmullRomCurve3(flarePoints);
        const flareGeo = new THREE.TubeGeometry(flareCurve, 20, 2, 6, false);
        const flareMesh = new THREE.Mesh(flareGeo, flareMat);
        starGroup.add(flareMesh);
        solarFlares.push({ mesh: flareMesh, angle: flareAngle });
    }

    group.add(starGroup);

    // ==========================================
    // 2. SHKADOV MIRROR - STATITE REFLECTOR
    // ==========================================
    const mirrorGroup = new THREE.Group();

    // Build the mirror as a partial sphere (covering ~half the star)
    // Use multiple segments for detail
    const mirrorRadius = 180;
    const mirrorSegCount = 24;
    const mirrorLatCount = 8;

    for (let lat = 0; lat < mirrorLatCount; lat++) {
        for (let lon = 0; lon < mirrorSegCount; lon++) {
            const phi1 = (lat / mirrorLatCount) * (Math.PI / 2);
            const phi2 = ((lat + 1) / mirrorLatCount) * (Math.PI / 2);
            const theta1 = (lon / mirrorSegCount) * Math.PI * 2;
            const theta2 = ((lon + 1) / mirrorSegCount) * Math.PI * 2;

            const segGeo = new THREE.SphereGeometry(
                mirrorRadius, 4, 4,
                theta1, theta2 - theta1,
                phi1, phi2 - phi1
            );
            const segMesh = new THREE.Mesh(segGeo, mirrorMat);
            mirrorGroup.add(segMesh);
            mirrorSegments.push({
                mesh: segMesh, lat, lon,
                phi: (phi1 + phi2) / 2,
                theta: (theta1 + theta2) / 2
            });
        }
    }

    // Mirror structural framework (geodesic ribs)
    for (let lat = 0; lat <= mirrorLatCount; lat++) {
        const ribPhi = (lat / mirrorLatCount) * (Math.PI / 2);
        const ribGeo = new THREE.TorusGeometry(
            mirrorRadius * Math.sin(ribPhi), 0.8, 4, 48,
            Math.PI * 2
        );
        const ribMesh = new THREE.Mesh(ribGeo, frameMat);
        ribMesh.position.y = mirrorRadius * Math.cos(ribPhi);
        mirrorGroup.add(ribMesh);
    }

    // Radial support struts
    for (let i = 0; i < 12; i++) {
        const strutAngle = (i / 12) * Math.PI * 2;
        const strutPoints = [];
        for (let t = 0; t <= 10; t++) {
            const param = (t / 10) * (Math.PI / 2);
            strutPoints.push(new THREE.Vector3(
                mirrorRadius * Math.sin(param) * Math.cos(strutAngle),
                mirrorRadius * Math.cos(param),
                mirrorRadius * Math.sin(param) * Math.sin(strutAngle)
            ));
        }
        const strutCurve = new THREE.CatmullRomCurve3(strutPoints);
        const strutGeo = new THREE.TubeGeometry(strutCurve, 10, 1, 4, false);
        const strutMesh = new THREE.Mesh(strutGeo, frameMat);
        mirrorGroup.add(strutMesh);
    }

    // Position mirror to face the star
    mirrorGroup.position.y = 0; // Mirror is above/around the star
    group.add(mirrorGroup);
    parts.push({ mesh: mirrorGroup, name: 'Shkadov Mirror Statite' });

    // ==========================================
    // 3. SOLAR RADIATION PRESSURE VISUALIZATION
    // ==========================================
    const radParticleCount = 600;
    const radGeo = new THREE.SphereGeometry(0.8, 4, 4);
    const radMesh = new THREE.InstancedMesh(radGeo, solarWindMat, radParticleCount);
    const radDummy = new THREE.Object3D();
    const radData = [];

    for (let i = 0; i < radParticleCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        radData.push({
            phi, theta,
            radius: 62 + Math.random() * 5,
            speed: 1 + Math.random() * 3,
            size: 0.3 + Math.random() * 0.8,
            hitsMirror: phi < Math.PI / 2 // Upper hemisphere hits mirror
        });
    }
    group.add(radMesh);
    radiationParticles.push({ mesh: radMesh, data: radData, dummy: radDummy });
    parts.push({ mesh: radMesh, name: 'Solar Radiation Stream' });

    // ==========================================
    // 4. REFLECTED RADIATION (THRUST)
    // ==========================================
    const reflectedCount = 300;
    const refGeo = new THREE.SphereGeometry(1, 4, 4);
    const refMesh = new THREE.InstancedMesh(refGeo, reflectedMat, reflectedCount);
    const refDummy = new THREE.Object3D();
    const refData = [];

    for (let i = 0; i < reflectedCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        refData.push({
            theta,
            radius: mirrorRadius,
            speed: 2 + Math.random() * 4,
            y: mirrorRadius * Math.cos(Math.random() * Math.PI / 2),
            size: 0.5 + Math.random() * 1.0
        });
    }
    group.add(refMesh);
    reflectedBeams.push({ mesh: refMesh, data: refData, dummy: refDummy });
    parts.push({ mesh: refMesh, name: 'Reflected Radiation Thrust' });

    // ==========================================
    // 5. BOW SHOCK (from ISM interaction)
    // ==========================================
    const bowShockGeo = new THREE.SphereGeometry(300, 24, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bowShockMesh = new THREE.Mesh(bowShockGeo, bowShockMat);
    bowShockMesh.rotation.x = Math.PI;
    bowShockMesh.position.y = -150;
    group.add(bowShockMesh);
    bowShockElements.push({ mesh: bowShockMesh });
    parts.push({ mesh: bowShockMesh, name: 'Interstellar Bow Shock' });

    // ==========================================
    // 6. STATION-KEEPING THRUSTERS
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const skAngle = (i / 8) * Math.PI * 2;
        const skGroup = new THREE.Group();

        // Thruster body
        const skBodyGeo = new THREE.CylinderGeometry(5, 7, 15, 8);
        const skBodyMesh = new THREE.Mesh(skBodyGeo, thrusterMat);
        skGroup.add(skBodyMesh);

        // Nozzle
        const nozzleGeo = new THREE.ConeGeometry(6, 10, 8, 1, true);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, darkSteel);
        nozzleMesh.position.y = -12;
        skGroup.add(nozzleMesh);

        // Fuel tank
        const tankGeo = new THREE.CapsuleGeometry(4, 10, 6, 8);
        const tankMesh = new THREE.Mesh(tankGeo, aluminum);
        tankMesh.position.y = 15;
        skGroup.add(tankMesh);

        skGroup.position.set(
            Math.cos(skAngle) * (mirrorRadius + 10),
            mirrorRadius * 0.7,
            Math.sin(skAngle) * (mirrorRadius + 10)
        );
        group.add(skGroup);
        stationKeepers.push({ group: skGroup, angle: skAngle, index: i });
    }
    parts.push({ mesh: stationKeepers[0]?.group, name: 'Station-keeping Thrusters' });

    // ==========================================
    // 7. CME PARTICLE EJECTIONS (InstancedMesh)
    // ==========================================
    const cmeCount = 400;
    const cmeGeo = new THREE.TetrahedronGeometry(1.5, 0);
    const cmeMesh = new THREE.InstancedMesh(cmeGeo, cmeMat, cmeCount);
    const cmeDummy = new THREE.Object3D();
    const cmeData = [];

    for (let i = 0; i < cmeCount; i++) {
        const cmeAngle = Math.random() * Math.PI * 2;
        const cmeLat = (Math.random() - 0.5) * Math.PI * 0.8;
        cmeData.push({
            angle: cmeAngle, lat: cmeLat,
            radius: 62,
            speed: 0.5 + Math.random() * 2,
            size: 0.5 + Math.random() * 1.5,
            active: Math.random() > 0.5
        });
    }
    group.add(cmeMesh);
    cmeParticles.push({ mesh: cmeMesh, data: cmeData, dummy: cmeDummy });
    parts.push({ mesh: cmeMesh, name: 'Coronal Mass Ejections' });

    // ==========================================
    // 8. THRUST VECTOR INDICATOR
    // ==========================================
    const thrustArrowGroup = new THREE.Group();
    const arrowShaftGeo = new THREE.CylinderGeometry(2, 2, 100, 6);
    const arrowShaftMat = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 2.0 });
    const arrowShaftMesh = new THREE.Mesh(arrowShaftGeo, arrowShaftMat);
    arrowShaftMesh.position.y = -100;
    thrustArrowGroup.add(arrowShaftMesh);

    const arrowHeadGeo = new THREE.ConeGeometry(5, 15, 8);
    const arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, arrowShaftMat);
    arrowHeadMesh.position.y = -155;
    arrowHeadMesh.rotation.x = Math.PI;
    thrustArrowGroup.add(arrowHeadMesh);

    group.add(thrustArrowGroup);
    parts.push({ mesh: thrustArrowGroup, name: 'Net Thrust Vector' });

    // ==========================================
    // 9. OBSERVATION STATION
    // ==========================================
    const obsGroup = new THREE.Group();
    const obsGeo = new THREE.BoxGeometry(25, 10, 15);
    const obsMesh = new THREE.Mesh(obsGeo, stationMat);
    obsGroup.add(obsMesh);

    // Solar shield
    const shieldGeo = new THREE.BoxGeometry(30, 0.5, 20);
    const shieldMesh = new THREE.Mesh(shieldGeo, mirrorMat);
    shieldMesh.position.y = 8;
    obsGroup.add(shieldMesh);

    // Telescopes
    for (let i = 0; i < 3; i++) {
        const telGeo = new THREE.CylinderGeometry(2, 3, 12, 8);
        const telMesh = new THREE.Mesh(telGeo, darkSteel);
        telMesh.position.set(-8 + i * 8, -8, 0);
        obsGroup.add(telMesh);
    }

    obsGroup.position.set(250, 0, 0);
    group.add(obsGroup);
    parts.push({ mesh: obsGroup, name: 'Observation Station' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "A Shkadov thruster is a 'statite'—a structure that hovers at a fixed distance from the star by balancing gravitational attraction with radiation pressure. For the mirror to remain stationary, what condition must the mirror's area-to-mass ratio satisfy?",
            options: [
                "A/m = c/(L☉/4π), independent of distance from the star",
                "A/m = 4πGM☉c/L☉, where both gravity and radiation pressure follow inverse-square laws, making this ratio distance-independent",
                "A/m = L☉/(4πGM☉c²), derived from relativistic momentum transfer",
                "A/m = R²/(GM☉), dependent on the orbital radius R"
            ],
            correct: 1,
            explanation: "For a perfect reflector at distance r from a star of luminosity L and mass M: gravitational force F_g = GMm/r² and radiation force F_rad = 2LA/(4πr²c) (factor 2 for reflection). Setting F_g = F_rad gives A/m = 4πGMc/(2L) = 2πGMc/L. Crucially, both forces scale as 1/r², so the ratio A/m is independent of distance. For the Sun: A/m ≈ 1.53 × 10⁻³ m²/kg. This means the mirror can hover at any distance—the equilibrium is distance-independent but unstable laterally, requiring active station-keeping."
        },
        {
            question: "What is the maximum acceleration a Shkadov thruster can impart to a Sun-like star, and how long would it take to change the Sun's velocity by 20 km/s (enough to significantly alter its galactic orbit)?",
            options: [
                "a ≈ 10⁻⁵ m/s² and about 100 years",
                "a ≈ L☉/(2M☉c) ≈ 6.3 × 10⁻¹⁰ m/s², and approximately 1 million years",
                "a ≈ GM☉/R² ≈ 274 m/s² and about 1 hour",
                "The acceleration is zero because the star and mirror are gravitationally bound and momentum is conserved"
            ],
            correct: 1,
            explanation: "The net force on the star-mirror system comes from the asymmetry in radiation: photons reflected by the mirror carry momentum away preferentially in one direction. The net force is F = L☉/(2c) (for a hemisphere mirror), giving a = L/(2Mc) = 3.8×10²⁶/(2 × 2×10³⁰ × 3×10⁸) ≈ 3.2×10⁻¹³ m/s² for a half-sphere, or ~6.3×10⁻¹⁰ m/s² with optimistic coverage. To reach Δv = 20 km/s: t = Δv/a ≈ 2×10⁴/6.3×10⁻¹⁰ ≈ 3.2×10¹³ s ≈ 1 million years. This is within stellar evolution timescales and could redirect the solar system away from future hazards."
        },
        {
            question: "A key engineering challenge is that the star's luminosity is not constant—it varies due to stellar activity cycles and evolution. How does this affect the Shkadov thruster's stability?",
            options: [
                "It doesn't affect stability because the mirror can absorb variable radiation without consequence",
                "Luminosity variations ΔL cause the radiation pressure balance point to shift: increased L pushes the mirror outward (since F_rad > F_g), while decreased L lets it fall inward. Without active correction, the mirror oscillates around the equilibrium with amplitude proportional to ΔL/L",
                "The mirror would melt during stellar flares, requiring periodic replacement",
                "Luminosity variations are too small (<0.1%) to have any measurable effect on the thruster"
            ],
            correct: 1,
            explanation: "While the equilibrium A/m ratio is distance-independent, the equilibrium position for a given A/m is not. Perturbations δL cause δF_rad = (2A/4πr²c)δL. If δL > 0, the net outward force pushes the mirror to larger r. However, since both forces scale as 1/r², there is no restoring force from the radial perturbation—the equilibrium is marginally stable radially. Lateral perturbations are genuinely unstable. Solar cycles (ΔL/L ~ 0.1%), flares, and main-sequence evolution (L increases ~1% per 100 Myr) all require active station-keeping. The thrusters must continuously adjust the mirror's attitude and position."
        },
        {
            question: "Badescu and Cathcart proposed an improved design: the 'Caplan thruster,' which uses focused starlight to drive a nuclear fusion reactor that produces directed particle jets. How does this improve upon the basic Shkadov design?",
            options: [
                "The Caplan thruster produces less thrust but operates more efficiently",
                "It separates the radiation collection from the propulsion mechanism. Focused starlight powers electromagnetic harvesting of stellar material, which is fused in a reactor and expelled as a collimated particle jet. This achieves ~10× higher thrust than pure photon reflection because massive particle jets carry more momentum per unit energy (p = mv >> E/c)",
                "It eliminates the need for exotic matter by using conventional fusion fuel",
                "The Caplan design is smaller and can be constructed with current technology"
            ],
            correct: 1,
            explanation: "The Caplan thruster uses concentrated solar energy to: (1) electromagnetically lift hydrogen and helium from the star's surface, (2) fuse it in a reactor, and (3) expel the products as a relativistic particle beam. Since p_jet = γm_jet·v_jet >> E_jet/c for non-relativistic or mildly relativistic exhaust, the momentum thrust is much larger than photon pressure alone. Caplan estimated ~10⁻⁹ m/s² acceleration—about 10× better than a Shkadov mirror. Additionally, the mass harvesting slightly reduces the star's luminosity, reducing its main-sequence lifetime but achieving the stellar motion goal much faster."
        },
        {
            question: "If a Shkadov thruster has been operating for 500 million years, moving the Sun at approximately 20 km/s relative to its original galactic orbit, what observable consequence might future astronomers detect?",
            options: [
                "The Sun would appear as a quasar due to the energetic reflection",
                "The Sun's orbit around the galactic center would appear anomalous: its velocity would deviate significantly from the local standard of rest (LSR), and its orbit would no longer match the expected kinematics for a star of its age, metallicity, and galactic birth radius",
                "The Sun would have a much higher surface temperature from the reflected radiation",
                "The mirror would be visible as a transit across background stars"
            ],
            correct: 1,
            explanation: "After 500 Myr of acceleration at ~10⁻¹⁰ m/s², the Sun would have Δv ≈ 1.5 km/s (or up to 20 km/s with a Caplan thruster). This would cause its galactic orbit to differ from predictions based on its stellar population. The Sun's peculiar velocity (deviation from the local standard of rest) is currently ~13 km/s; an additional 20 km/s would make it a significant outlier. Galactic archaeologists could identify this by comparing the Sun's orbital elements (eccentricity, inclination, guiding center radius) with its metallicity and age—a star displaced from its birth radius would have anomalous chemical composition for its location, a phenomenon already observed as 'radial migration.'"
        }
    ];

    const description = `<h2>Shkadov Thruster Stellar Engine</h2>
<p>The Shkadov Thruster is a megascale statite mirror designed to convert a star's radiation pressure into directional thrust, gradually accelerating an entire solar system through the galaxy. Proposed by Leonid Shkadov in 1987, it exploits the balance between gravitational attraction and radiation pressure to hover as a 'solar sail that never moves,' while the asymmetric radiation creates net thrust on the star.</p>

<h3>Core Systems</h3>
<ul>
<li><strong>Statite Mirror:</strong> A colossal, ultralight parabolic reflector hovering on the star's radiation pressure. Its area-to-mass ratio (A/m = 2πGMc/L) is precisely tuned to balance gravity and radiation.</li>
<li><strong>Station-keeping Thrusters:</strong> Active control systems compensating for lateral instability and stellar luminosity variations.</li>
<li><strong>Interstellar Bow Shock:</strong> As the star system accelerates through the ISM, a visible bow shock forms in the direction of motion.</li>
</ul>

<h3>Performance</h3>
<p>A Shkadov mirror covering ~50% of the stellar solid angle produces a net acceleration of a ≈ L/(2Mc) ≈ 3×10⁻¹⁰ m/s² for a solar-mass star. Over 1 million years, this changes the Sun's velocity by ~10 km/s—sufficient to alter its galactic orbit and potentially dodge close encounters with passing stars, molecular clouds, or galactic spiral arm crossings.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Star rotation and pulsation
        starMesh.rotation.y = time * speed * 0.3;
        const starPulse = 1.0 + Math.sin(time * speed * 2) * 0.02;
        starMesh.scale.setScalar(starPulse);
        starMesh.material.emissiveIntensity = 5 + Math.sin(time * speed * 3) * 1.5;

        // Corona shimmer
        coronaFMesh.rotation.y = -time * speed * 0.2;
        coronaFMesh.rotation.x = time * speed * 0.1;
        const coronaScale = 1.0 + Math.sin(time * speed * 1.5) * 0.03;
        coronaFMesh.scale.setScalar(coronaScale);

        // 2. Mirror segment subtle vibration
        mirrorSegments.forEach(seg => {
            const vibration = Math.sin(time * speed * 2 + seg.lat * 0.5 + seg.lon * 0.3) * 0.002;
            seg.mesh.scale.set(1 + vibration, 1 + vibration, 1);
        });

        // 3. Solar radiation particles (outward from star, hitting mirror or escaping)
        radiationParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                p.radius += p.speed * speed * 0.5;
                if (p.hitsMirror && p.radius > mirrorRadius) {
                    p.radius = 62; // Reset - absorbed by mirror
                }
                if (p.radius > 350) p.radius = 62; // Reset - escaped

                dummy.position.set(
                    p.radius * Math.sin(p.phi) * Math.cos(p.theta),
                    p.radius * Math.cos(p.phi),
                    p.radius * Math.sin(p.phi) * Math.sin(p.theta)
                );
                dummy.scale.setScalar(p.size);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 4. Reflected radiation (thrust direction - downward)
        reflectedBeams.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const r = data[i];
                r.y -= r.speed * speed * 1.5;
                if (r.y < -350) r.y = mirrorRadius;
                dummy.position.set(
                    Math.cos(r.theta) * 20,
                    r.y,
                    Math.sin(r.theta) * 20
                );
                dummy.scale.setScalar(r.size * (0.5 + Math.sin(time * speed * 8 + i) * 0.3));
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 5. Bow shock breathing
        bowShockElements.forEach(bs => {
            const breathe = 1.0 + Math.sin(time * speed * 0.5) * 0.03;
            bs.mesh.scale.setScalar(breathe);
            bs.mesh.material.opacity = 0.1 + Math.sin(time * speed * 1.5) * 0.05;
        });

        // 6. CME particle eruptions
        cmeParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const c = data[i];
                if (c.active) {
                    c.radius += c.speed * speed * 0.3;
                    if (c.radius > 300) { c.radius = 62; c.active = Math.random() > 0.3; }
                    dummy.position.set(
                        c.radius * Math.cos(c.angle) * Math.cos(c.lat),
                        c.radius * Math.sin(c.lat),
                        c.radius * Math.sin(c.angle) * Math.cos(c.lat)
                    );
                    dummy.scale.setScalar(c.size);
                } else {
                    dummy.scale.setScalar(0);
                    if (Math.random() < 0.001) c.active = true;
                }
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 7. Station-keeper activity
        stationKeepers.forEach(sk => {
            const wobble = Math.sin(time * speed * 3 + sk.index * 0.8) * 2;
            sk.group.position.y = mirrorRadius * 0.7 + wobble;
        });

        // 8. Thrust arrow pulsation
        const thrustPulse = 1.0 + Math.sin(time * speed * 2) * 0.1;
        arrowShaftMesh.scale.set(thrustPulse, 1, thrustPulse);
        arrowHeadMesh.scale.setScalar(thrustPulse);
    }

    return { group, parts, description, quizQuestions, animate };
}
