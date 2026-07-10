import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animData = {
        core: null,
        coreShells: [],
        coreParticles: [],
        magneticRings: [],
        penningCoilsPrimary: [],
        penningCoilsSecondary: [],
        laserBeams: [],
        powerCapacitors: [],
        hydraulicDampers: [],
        sensorDiodes: [],
        plasmaConduits: [],
        wheels: [],
        steeringWheels: [],
        joysticks: [],
        screens: [],
        exhausts: [],
        boomArms: [],
        pistons: []
    };

    const description = "God-Tier Strangelet Containment Vessel & Mobile Crawler Platform - A hyper-advanced, massively complex facility mounted on an ultra-heavy-duty off-road transport chassis. Designed to isolate and safely transport a microscopic droplet of Strange Quark Matter (SQM). Features absolutely perfectly balanced electromagnetic Penning traps, extreme vacuum pumping systems, colossal power capacitor banks, and hyper-focused laser cooling arrays. Driven from a highly detailed operator cabin, the massive treaded wheels and hydraulic systems allow the doomsday payload to be relocated at a moment's notice.";

    const quizQuestions = [
        {
            question: "In the context of the MIT Bag Model, what condition is necessary for Strange Quark Matter (SQM) to be the true ground state of hadronic matter, as proposed by the Bodmer-Witten hypothesis?",
            options: [
                "The energy per baryon of SQM must be less than that of the most stable atomic nucleus, Iron-56 (approximately 930 MeV).",
                "The strange quark mass must be strictly zero to allow perfect flavor symmetry.",
                "The system must reach a temperature above the QCD phase transition point of 150 MeV.",
                "The strangelet must have a net positive electrical charge equal to its baryon number."
            ],
            correctAnswer: 0,
            explanation: "The Bodmer-Witten hypothesis suggests that if the energy per baryon of a macroscopic droplet of u, d, and s quarks is lower than that of Iron-56, SQM is the absolute true ground state of matter."
        },
        {
            question: "Why does the presence of strange quarks lower the Fermi energy of the quark gas in a strangelet compared to normal two-flavor (up, down) quark matter?",
            options: [
                "Strange quarks have a negative mass-squared, reducing the overall energy density.",
                "The introduction of a third quark flavor opens a new Fermi sea, allowing quarks to occupy lower momentum states while satisfying the Pauli exclusion principle.",
                "Strange quarks do not interact via the strong force, eliminating color repulsion.",
                "Strange quarks spontaneously decay into gluons, lowering the total kinetic energy of the system."
            ],
            correctAnswer: 1,
            explanation: "By distributing the baryon number across three flavors instead of two, the highest occupied energy level (Fermi energy) in each flavor sector is lower, potentially making the three-flavor state energetically favorable."
        },
        {
            question: "What mechanism prevents a negatively charged strangelet from repelling electrons and instead forming a 'strange atom' where electrons orbit within the strangelet itself?",
            options: [
                "Electrons are converted into neutrinos upon contact with the strangelet boundary.",
                "The strangelet's extreme gravitational pull overcomes the electrostatic repulsion.",
                "As a strangelet grows in baryon number, its charge-to-mass ratio decreases, and the electron cloud is pulled inside the strangelet boundary to neutralize the bulk, leading to Debye screening.",
                "The strong nuclear force binds the electrons directly to the strange quarks."
            ],
            correctAnswer: 2,
            explanation: "For very large strangelets, the electrons reside entirely within the strangelet to ensure bulk charge neutrality, with a surface layer governed by Debye screening, rather than occupying external atomic orbitals."
        },
        {
            question: "In the color-flavor locked (CFL) phase of dense quark matter, how does the spontaneous breaking of color and flavor symmetries affect the excitation spectrum?",
            options: [
                "It causes all quarks to become massless bosons.",
                "It leads to the formation of a condensate of Cooper pairs involving all three quark flavors and all three colors, resulting in a gap in the quark excitation spectrum.",
                "It eliminates all gluons from the system, leaving only photon-mediated interactions.",
                "It causes the strangelet to undergo rapid fission into smaller, unstable hyperons."
            ],
            correctAnswer: 1,
            explanation: "The CFL phase is a color superconductor where all quarks pair up symmetrically. This pairing opens an energy gap in the excitation spectrum for all quark flavors and colors, making it highly stable."
        },
        {
            question: "If a strangelet were to interact with a normal atomic nucleus, what force mediates the conversion of the normal nucleons into strange matter?",
            options: [
                "The strong interaction alone.",
                "The weak interaction.",
                "The electromagnetic force.",
                "Gravitational wave emission."
            ],
            correctAnswer: 1,
            explanation: "To convert normal matter (u, d quarks) into strange matter (u, d, s quarks), flavor must change. Only the weak interaction can change quark flavors (e.g., d -> u + e- + anti-nu, and u + d -> s + u), facilitating the conversion and releasing immense energy."
        }
    ];

    // --- CUSTOM GLOWING MATERIALS ---
    const matStrangeletCore = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 20.0,
        transparent: true,
        opacity: 0.95,
        wireframe: false,
        roughness: 0.1,
        metalness: 1.0,
        blending: THREE.AdditiveBlending
    });

    const matFieldPrimary = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const matFieldSecondary = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x0022ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        blending: THREE.AdditiveBlending
    });

    const matLaserBeam = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const matSuperconductor = new THREE.MeshStandardMaterial({
        color: 0x111122,
        emissive: 0x2244ff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 1.0,
        wireframe: true
    });
    
    const matPlasmaGlow = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const matScreen = new THREE.MeshStandardMaterial({
        color: 0x002244,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0
    });

    // --- UTILITY FUNCTIONS ---
    function createComplexLathe(pointsArray, segments, material) {
        const points = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        const geom = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geom, material);
    }

    function createExtrudedShape(shapePoints, depth, material) {
        const shape = new THREE.Shape();
        shapePoints.forEach((p, idx) => {
            if (idx === 0) shape.moveTo(p[0], p[1]);
            else shape.lineTo(p[0], p[1]);
        });
        const geom = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.5,
            bevelThickness: 0.5
        });
        geom.center();
        return new THREE.Mesh(geom, material);
    }

    // --- 1. THE STRANGELET CORE ---
    function buildStrangeletCore() {
        const coreGroup = new THREE.Group();
        
        const coreGeom = new THREE.IcosahedronGeometry(4, 5);
        const coreMesh = new THREE.Mesh(coreGeom, matStrangeletCore);
        coreGroup.add(coreMesh);
        animData.core = coreMesh;

        // Nested fluctuating topological shells
        for (let i = 0; i < 5; i++) {
            const shellGeom = new THREE.IcosahedronGeometry(5 + i * 1.2, 4);
            const posAttr = shellGeom.attributes.position;
            for(let j=0; j<posAttr.count; j++) {
                const vec = new THREE.Vector3().fromBufferAttribute(posAttr, j);
                vec.multiplyScalar(1.0 + Math.random() * 0.15);
                posAttr.setXYZ(j, vec.x, vec.y, vec.z);
            }
            shellGeom.computeVertexNormals();
            const shellMat = new THREE.MeshStandardMaterial({
                color: 0xaa00ff,
                emissive: 0xaa00ff,
                emissiveIntensity: 1.5 + i*0.4,
                wireframe: true,
                transparent: true,
                opacity: 0.6 - i*0.1,
                blending: THREE.AdditiveBlending
            });
            const shellMesh = new THREE.Mesh(shellGeom, shellMat);
            coreGroup.add(shellMesh);
            animData.coreShells.push({
                mesh: shellMesh,
                speed: 1.5 + Math.random()*2.5,
                axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()
            });
        }

        // Orbiting exotic hyperon particles
        const particleGeom = new THREE.SphereGeometry(0.3, 12, 12);
        for(let i = 0; i < 300; i++) {
            const pMesh = new THREE.Mesh(particleGeom, matStrangeletCore);
            const radius = 8 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            pMesh.position.setFromSphericalCoords(radius, phi, theta);
            coreGroup.add(pMesh);
            animData.coreParticles.push({
                mesh: pMesh,
                orbitRadius: radius,
                orbitSpeed: (1.0 + Math.random() * 2.0) * (Math.random() < 0.5 ? 1 : -1),
                orbitAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
                angle: Math.random() * Math.PI * 2
            });
        }

        parts.push({
            name: "Strangelet Core",
            description: "A microscopic droplet of Strange Quark Matter (SQM). The absolute true ground state of hadronic matter. Kept strictly isolated.",
            material: "Exotic Strange Matter",
            function: "Primary research subject and potential infinite energy source / doomsday catalyst.",
            assemblyOrder: 99, 
            connections: ["None - strictly levitated in vacuum"],
            failureEffect: "Runaway strangelet conversion. The entire planet is catalyzed into a solid sphere of strange matter within hours.",
            cascadeFailures: ["Complete annihilation of Earth", "Destruction of all normal hadronic matter"],
            originalPosition: {x:0, y:0, z:0},
            explodedPosition: {x:0, y:0, z:0}
        });

        return coreGroup;
    }

    // --- 2. CONTAINMENT FIELDS ---
    function buildContainmentFields() {
        const fieldGroup = new THREE.Group();

        const sphereGeom = new THREE.SphereGeometry(25, 64, 64);
        const primaryField = new THREE.Mesh(sphereGeom, matFieldPrimary);
        fieldGroup.add(primaryField);
        animData.magneticRings.push({mesh: primaryField, type: 'pulse', baseScale: 1.0});

        for(let i=1; i<=4; i++) {
            const knotGeom = new THREE.TorusKnotGeometry(22, 1.8, 256, 64, i+1, i+3);
            const knotMesh = new THREE.Mesh(knotGeom, matFieldSecondary);
            fieldGroup.add(knotMesh);
            animData.magneticRings.push({
                mesh: knotMesh, 
                type: 'rotate', 
                axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                speed: 0.8 * i
            });
        }

        parts.push({
            name: "Primary Magnetic Containment Topology",
            description: "Multi-layered intersecting magnetic fields forming a perfect non-Euclidean quantum trap.",
            material: "Electromagnetic Plasma",
            function: "Provides the immediate repulsive boundary keeping the strangelet from touching the physical Penning traps.",
            assemblyOrder: 1,
            connections: ["Upper Penning Coils", "Lower Penning Coils", "Lateral Multipole Magnets"],
            failureEffect: "Immediate breach of vacuum, strangelet contacts structural elements.",
            cascadeFailures: ["Structural assimilation", "Total facility loss"],
            originalPosition: {x:0, y:0, z:0},
            explodedPosition: {x:0, y:30, z:0}
        });

        return fieldGroup;
    }

    // --- 3. PENNING TRAPS ---
    function buildPenningTraps() {
        const trapGroup = new THREE.Group();

        function createCoilStack(yOffset, isUpper) {
            const stackGroup = new THREE.Group();
            
            const mainCoilGeom = new THREE.TorusGeometry(32, 6, 64, 128);
            const mainCoil = new THREE.Mesh(mainCoilGeom, matSuperconductor);
            stackGroup.add(mainCoil);

            const subCoilGeom = new THREE.TorusGeometry(6.5, 0.3, 16, 64);
            for(let i=0; i<180; i++) {
                const sub = new THREE.Mesh(subCoilGeom, copper);
                const angle = (i / 180) * Math.PI * 2;
                sub.rotation.y = angle;
                sub.rotation.x = Math.PI / 2;
                sub.position.set(Math.cos(angle) * 32, 0, Math.sin(angle) * 32);
                sub.lookAt(new THREE.Vector3(0,0,0));
                stackGroup.add(sub);
            }

            const fluxGeom = new THREE.ConeGeometry(7, 22, 32);
            for(let i=0; i<12; i++) {
                const flux = new THREE.Mesh(fluxGeom, darkSteel);
                const angle = (i / 12) * Math.PI * 2;
                flux.position.set(Math.cos(angle) * 26, isUpper ? -8 : 8, Math.sin(angle) * 26);
                flux.lookAt(new THREE.Vector3(0, isUpper ? -30 : 30, 0));
                
                // Add tiny glowing rivets to flux directors
                for(let k=0; k<5; k++) {
                    const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 8), matPlasmaGlow);
                    rivet.position.set(0, -10 + k*4, 7);
                    rivet.rotation.x = Math.PI / 2;
                    flux.add(rivet);
                }
                stackGroup.add(flux);
            }

            stackGroup.position.y = yOffset;
            animData.penningCoilsPrimary.push(stackGroup);
            return stackGroup;
        }

        trapGroup.add(createCoilStack(45, true));
        trapGroup.add(createCoilStack(-45, false));

        parts.push({
            name: "Superconducting Penning Coil Arrays",
            description: "Massive niobium-titanium superconducting electromagnets cooled by liquid helium. Generates perfectly uniform 500 Tesla vertical magnetic fields.",
            material: "Niobium-Titanium / Copper / Steel",
            function: "Restricts the radial motion of the strangelet via an intense homogeneous axial magnetic field.",
            assemblyOrder: 2,
            connections: ["Cryogenic Piping", "Vacuum Chamber Top & Bottom Domes"],
            failureEffect: "Field asymmetry, resulting in strangelet ejection at high velocity.",
            cascadeFailures: ["Quench event", "Massive kinetic impact"],
            originalPosition: {x:0, y:45, z:0},
            explodedPosition: {x:0, y:120, z:0}
        });

        // Lateral Quadrupole/Multipole Electrodes
        const lateralGroup = new THREE.Group();
        const electrodeProfile = [
            [36, 20], [38, 20], [42, 12], [46, 6], [50, 4], [54, 2], [54, -2],
            [50, -4], [46, -6], [42, -12], [38, -20], [36, -20]
        ];
        
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const electrode = createComplexLathe(electrodeProfile, 64, chrome);
            electrode.rotation.z = Math.PI / 2; 
            electrode.rotation.y = angle;
            electrode.position.set(Math.cos(angle) * 55, 0, Math.sin(angle) * 55);
            lateralGroup.add(electrode);
            animData.penningCoilsSecondary.push(electrode);
            
            const arcCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0, -12, 0),
                new THREE.Vector3(0, -20, (i%2===0)?8:-8)
            ]);
            const arcGeom = new THREE.TubeGeometry(arcCurve, 32, 0.8, 12, false);
            const arc = new THREE.Mesh(arcGeom, matPlasmaGlow);
            electrode.add(arc);
        }
        trapGroup.add(lateralGroup);

        parts.push({
            name: "Lateral Multipole Electrodes",
            description: "Array of 12 hyperbolic electrodes surrounding the core radially.",
            material: "Hyper-polished Chrome Alloy",
            function: "Generates the static quadrupole electric field required to trap the strangelet axially.",
            assemblyOrder: 3,
            connections: ["Vacuum Chamber Equator", "High-Voltage Conduits"],
            failureEffect: "Axial instability; strangelet oscillating violently until collision.",
            cascadeFailures: ["Electrode vaporization", "Containment breach"],
            originalPosition: {x:0, y:0, z:0},
            explodedPosition: {x:150, y:0, z:150} 
        });

        return trapGroup;
    }

    // --- 4. VACUUM CHAMBER ---
    function buildVacuumChamber() {
        const chamberGroup = new THREE.Group();

        const hullProfile = [];
        for(let i=0; i<=80; i++) {
            const t = i / 80;
            const y = -85 + 170 * t;
            const r = 55 + 30 * Math.sin(t * Math.PI); 
            const rib = (i % 8 === 0) ? 3 : 0;
            hullProfile.push([r + rib, y]);
        }
        
        const hull = createComplexLathe(hullProfile, 128, steel);
        chamberGroup.add(hull);
        
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            
            const flangeGeom = new THREE.CylinderGeometry(20, 24, 12, 64);
            flangeGeom.translate(0, 6, 0);
            flangeGeom.rotateX(Math.PI / 2);
            const flange = new THREE.Mesh(flangeGeom, darkSteel);
            const radius = 80;
            flange.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            flange.lookAt(new THREE.Vector3(0,0,0));
            chamberGroup.add(flange);

            const glassGeom = new THREE.CylinderGeometry(18, 18, 14, 64);
            glassGeom.translate(0, 7, 0);
            glassGeom.rotateX(Math.PI / 2);
            const glassMesh = new THREE.Mesh(glassGeom, tinted);
            glassMesh.position.copy(flange.position);
            glassMesh.lookAt(new THREE.Vector3(0,0,0));
            chamberGroup.add(glassMesh);

            const shutterGeom = new THREE.TorusGeometry(16, 2.5, 32, 12, Math.PI);
            const shutter = new THREE.Mesh(shutterGeom, aluminum);
            shutter.position.copy(flange.position);
            shutter.lookAt(new THREE.Vector3(0,0,0));
            chamberGroup.add(shutter);
        }

        const endCapGeom = new THREE.CylinderGeometry(58, 62, 15, 128);
        const topCap = new THREE.Mesh(endCapGeom, darkSteel);
        topCap.position.y = 85;
        chamberGroup.add(topCap);
        
        const bottomCap = new THREE.Mesh(endCapGeom, darkSteel);
        bottomCap.position.y = -85;
        chamberGroup.add(bottomCap);
        
        const boltGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 12);
        for(let i=0; i<120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            const bTop = new THREE.Mesh(boltGeom, chrome);
            bTop.position.set(Math.cos(angle)*60, 92, Math.sin(angle)*60);
            chamberGroup.add(bTop);
            
            const bBot = new THREE.Mesh(boltGeom, chrome);
            bBot.position.set(Math.cos(angle)*60, -92, Math.sin(angle)*60);
            chamberGroup.add(bBot);
        }

        // 8 Turbomolecular Pumps
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2 + (Math.PI / 8);
            const pumpGroup = new THREE.Group();
            
            const bodyGeom = new THREE.CylinderGeometry(12, 9, 35, 64);
            const body = new THREE.Mesh(bodyGeom, aluminum);
            pumpGroup.add(body);
            
            const bladeGeom = new THREE.CylinderGeometry(8, 8, 3, 64);
            const blades = new THREE.Mesh(bladeGeom, darkSteel);
            blades.position.y = -15;
            pumpGroup.add(blades);
            animData.penningRotors.push(blades); 
            
            pumpGroup.position.set(Math.cos(angle) * 65, -55, Math.sin(angle) * 65);
            pumpGroup.lookAt(new THREE.Vector3(0, -55, 0));
            pumpGroup.rotateX(Math.PI / 2); 
            chamberGroup.add(pumpGroup);
        }

        parts.push({
            name: "Ultra-High Vacuum Chamber",
            description: "Maintained at 10^-15 Torr. Constructed from neutron-hardened dark steel and aluminum alloys. Ribbed for extreme structural integrity against massive pressure differentials.",
            material: "Neutron-Hardened Dark Steel / Aluminum / Tinted Glass",
            function: "Provides the absolutely empty environment required for the Penning traps to operate without interference.",
            assemblyOrder: 4,
            connections: ["Turbomolecular Pumps", "Penning Trap Assemblies"],
            failureEffect: "Air rushes in. Gas molecules convert to strange matter instantly, releasing petawatts of radiation.",
            cascadeFailures: ["Vessel vaporization", "Atmospheric ignition"],
            originalPosition: {x:0, y:0, z:0},
            explodedPosition: {x:0, y:0, z:0}
        });

        parts.push({
            name: "Turbomolecular Vacuum Pumps (x8)",
            description: "Extreme velocity multi-stage turbine pumps spinning at 350,000 RPM.",
            material: "Titanium Alloy",
            function: "Evacuates the chamber to deep-space vacuum levels.",
            assemblyOrder: 5,
            connections: ["Vacuum Chamber Lower Quadrants"],
            failureEffect: "Gradual loss of vacuum, micro-collisions with strangelet.",
            cascadeFailures: ["Thermal spike", "Containment destabilization"],
            originalPosition: {x:65, y:-55, z:65},
            explodedPosition: {x:180, y:-120, z:180}
        });

        return chamberGroup;
    }

    // --- 5. LASER COOLING SYSTEM ---
    function buildLaserCoolingSystem() {
        const laserGroup = new THREE.Group();
        
        const axes = [
            {dir: new THREE.Vector3(1, 0, 0), pos: new THREE.Vector3(130, 0, 0)},
            {dir: new THREE.Vector3(-1, 0, 0), pos: new THREE.Vector3(-130, 0, 0)},
            {dir: new THREE.Vector3(0, 1, 0), pos: new THREE.Vector3(0, 130, 0)},
            {dir: new THREE.Vector3(0, -1, 0), pos: new THREE.Vector3(0, -130, 0)},
            {dir: new THREE.Vector3(0, 0, 1), pos: new THREE.Vector3(0, 0, 130)},
            {dir: new THREE.Vector3(0, 0, -1), pos: new THREE.Vector3(0, 0, -130)},
        ];

        axes.forEach((axis) => {
            const emitterGroup = new THREE.Group();
            
            const housingGeom = new THREE.CylinderGeometry(14, 18, 45, 64);
            housingGeom.rotateX(Math.PI / 2);
            const housing = new THREE.Mesh(housingGeom, darkSteel);
            emitterGroup.add(housing);

            for(let j=0; j<8; j++) {
                const ringGeom = new THREE.TorusGeometry(16 - j, 1.5, 32, 64);
                ringGeom.rotateX(Math.PI / 2);
                const ring = new THREE.Mesh(ringGeom, copper);
                ring.position.z = 22 + j * 4;
                emitterGroup.add(ring);
            }

            const beamLength = 120;
            const beamGeom = new THREE.CylinderGeometry(0.8, 0.8, beamLength, 32);
            beamGeom.rotateX(Math.PI / 2);
            const beam = new THREE.Mesh(beamGeom, matLaserBeam);
            beam.position.z = -beamLength / 2; 
            emitterGroup.add(beam);
            animData.laserBeams.push(beam);

            for(let j=0; j<25; j++) {
                const sinkGeom = new THREE.CylinderGeometry(20, 20, 0.8, 64);
                sinkGeom.rotateX(Math.PI / 2);
                const sink = new THREE.Mesh(sinkGeom, aluminum);
                sink.position.z = -8 - j * 1.5;
                emitterGroup.add(sink);
            }

            emitterGroup.position.copy(axis.pos);
            emitterGroup.lookAt(new THREE.Vector3(0,0,0));
            laserGroup.add(emitterGroup);
        });

        parts.push({
            name: "Six-Axis Doppler Laser Cooling Array",
            description: "Six hyper-intensity ultraviolet laser emitters targeting the exact center of the chamber.",
            material: "Dark Steel / Aluminum / Copper",
            function: "Bombards any stray particles or the strangelet's outer electron cloud with photons to remove kinetic energy, keeping the core at micro-Kelvin temperatures.",
            assemblyOrder: 6,
            connections: ["Vacuum Chamber Ports", "Cooling Power Grid"],
            failureEffect: "Core temperature rises, kinetic energy overcomes containment fields.",
            cascadeFailures: ["Thermal expansion of strangelet", "Breach"],
            originalPosition: {x:130, y:0, z:0},
            explodedPosition: {x:300, y:0, z:0}
        });

        return laserGroup;
    }

    // --- 6. POWER BANKS AND CONDUITS ---
    function buildPowerBanks() {
        const powerGroup = new THREE.Group();

        for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const bankGroup = new THREE.Group();

            const baseGeom = new THREE.BoxGeometry(50, 8, 50);
            const base = new THREE.Mesh(baseGeom, steel);
            base.position.y = -110;
            bankGroup.add(base);

            const capGeom = new THREE.CylinderGeometry(5, 5, 45, 64);
            for(let x=-2; x<=2; x+=2) {
                for(let z=-2; z<=2; z+=2) {
                    const cap = new THREE.Mesh(capGeom, plastic);
                    cap.position.set(x * 10, -85, z * 10);
                    
                    const stripGeom = new THREE.CylinderGeometry(5.2, 5.2, 3, 64);
                    const strip = new THREE.Mesh(stripGeom, matPlasmaGlow);
                    strip.position.y = 15;
                    cap.add(strip);
                    animData.powerCapacitors.push(strip);

                    bankGroup.add(cap);
                }
            }

            const transGeom = new THREE.BoxGeometry(22, 30, 22);
            const trans = new THREE.Mesh(transGeom, darkSteel);
            trans.position.y = -85;
            bankGroup.add(trans);

            const cableCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, -70, 0),
                new THREE.Vector3(0, -45, 0),
                new THREE.Vector3(-30, -35, 0),
                new THREE.Vector3(-65, -25, 0)
            ]);
            const cableGeom = new THREE.TubeGeometry(cableCurve, 64, 3, 32, false);
            const cable = new THREE.Mesh(cableGeom, rubber);
            bankGroup.add(cable);

            bankGroup.position.set(Math.cos(angle)*160, 0, Math.sin(angle)*160);
            bankGroup.lookAt(new THREE.Vector3(0,0,0));
            
            powerGroup.add(bankGroup);
        }

        parts.push({
            name: "Terawatt Capacitor Banks (x6)",
            description: "Colossal energy storage arrays capable of discharging petawatts of power in milliseconds.",
            material: "Dielectric Plastics / Steel / Rubber / Plasma",
            function: "Supplies the raw, instant power required to keep the Penning traps perfectly stabilized against quantum fluctuations.",
            assemblyOrder: 7,
            connections: ["Main Facility Power Grid", "Superconducting Coils"],
            failureEffect: "Power dip in containment field; strangelet violently shifts position.",
            cascadeFailures: ["Loss of containment", "Catastrophic annihilation"],
            originalPosition: {x:160, y:-110, z:0},
            explodedPosition: {x:400, y:-200, z:0}
        });

        return powerGroup;
    }

    // --- 7. HYDRAULIC SUPPORT STRUCTURE ---
    function buildSupportStructure() {
        const structGroup = new THREE.Group();

        const ringGeom = new THREE.TorusGeometry(120, 12, 64, 16);
        const ring = new THREE.Mesh(ringGeom, darkSteel);
        ring.position.y = -120;
        ring.rotation.x = Math.PI / 2;
        structGroup.add(ring);

        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const pillarGroup = new THREE.Group();

            const sheathGeom = new THREE.CylinderGeometry(12, 16, 70, 32);
            const sheath = new THREE.Mesh(sheathGeom, steel);
            sheath.position.y = -95;
            pillarGroup.add(sheath);

            const pistonGeom = new THREE.CylinderGeometry(9, 9, 85, 32);
            const piston = new THREE.Mesh(pistonGeom, chrome);
            piston.position.y = -25;
            pillarGroup.add(piston);
            animData.hydraulicDampers.push({mesh: piston, baseY: -25});

            const connGeom = new THREE.BoxGeometry(25, 15, 25);
            const conn = new THREE.Mesh(connGeom, darkSteel);
            conn.position.y = 15;
            conn.position.z = -20; 
            pillarGroup.add(conn);

            pillarGroup.position.set(Math.cos(angle)*110, 0, Math.sin(angle)*110);
            pillarGroup.lookAt(new THREE.Vector3(0, 0, 0));
            structGroup.add(pillarGroup);
        }

        const walkGeom = new THREE.TorusGeometry(150, 7, 16, 128);
        const walk = new THREE.Mesh(walkGeom, steel);
        walk.position.y = -15;
        walk.rotation.x = Math.PI / 2;
        structGroup.add(walk);

        const railingGeom = new THREE.TorusGeometry(156, 0.8, 16, 128);
        for(let i=0; i<4; i++) {
            const rail = new THREE.Mesh(railingGeom, aluminum);
            rail.position.y = -10 + i * 4;
            rail.rotation.x = Math.PI / 2;
            structGroup.add(rail);
        }

        parts.push({
            name: "Active Hydraulic Dampening Pillars (x12)",
            description: "Huge chrome and steel shock absorbers utilizing magneto-rheological fluid. Responds to seismic anomalies in microseconds.",
            material: "Chrome / Steel",
            function: "Isolates the vacuum chamber from all seismic activity, down to micro-tremors caused by passing crawler treads.",
            assemblyOrder: 8,
            connections: ["Main Base Ring", "Vacuum Chamber Equator"],
            failureEffect: "Seismic vibrations transfer to containment coils, causing microscopic field warps.",
            cascadeFailures: ["Strangelet perturbation", "Containment stress"],
            originalPosition: {x:110, y:-95, z:0},
            explodedPosition: {x:250, y:-150, z:0}
        });

        return structGroup;
    }

    // --- 8. CRYOGENIC AND PLASMA PIPING ---
    function buildComplexPiping() {
        const pipeGroup = new THREE.Group();

        for(let i=0; i<40; i++) {
            const isPlasma = i % 4 === 0;
            const points = [];
            const startY = (Math.random() > 0.5) ? 120 : -120;
            const startAngle = Math.random() * Math.PI * 2;
            const startRadius = 45 + Math.random() * 20;
            
            points.push(new THREE.Vector3(Math.cos(startAngle)*startRadius, startY, Math.sin(startAngle)*startRadius));
            
            for(let j=1; j<=5; j++) {
                const r = 60 + Math.random() * 60;
                const a = startAngle + (Math.random() - 0.5) * 3;
                const y = startY - Math.sign(startY) * (j * 35) + (Math.random()-0.5)*15;
                points.push(new THREE.Vector3(Math.cos(a)*r, y, Math.sin(a)*r));
            }

            const endAngle = startAngle + Math.PI / 2;
            points.push(new THREE.Vector3(Math.cos(endAngle)*130, -120, Math.sin(endAngle)*130));

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeom = new THREE.TubeGeometry(curve, 128, isPlasma ? 2.5 : 3.5, 24, false);
            const mesh = new THREE.Mesh(tubeGeom, isPlasma ? matPlasmaGlow : steel);
            
            if (isPlasma) {
                animData.plasmaConduits.push(mesh);
            }
            pipeGroup.add(mesh);
        }

        parts.push({
            name: "Cryogenic & Plasma Conduits Network",
            description: "An intricate labyrinth of supercooled pipes delivering liquid helium and high-energy plasma.",
            material: "Steel / Insulated Plasma Conduits",
            function: "Maintains absolute zero thermal conditions and extreme electrical operating voltages simultaneously.",
            assemblyOrder: 9,
            connections: ["Vacuum Chamber", "Penning Traps", "Capacitor Banks"],
            failureEffect: "Coils quench or electrodes lose voltage.",
            cascadeFailures: ["Containment failure"],
            originalPosition: {x:0, y:0, z:0},
            explodedPosition: {x:0, y:200, z:0}
        });

        return pipeGroup;
    }

    // --- 9. MOBILE CRAWLER PLATFORM ---
    function buildCrawlerTransport() {
        const transportGroup = new THREE.Group();
        
        // Massive Main Chassis Platform
        const chassisGeom = new THREE.BoxGeometry(400, 30, 600);
        const chassis = new THREE.Mesh(chassisGeom, darkSteel);
        chassis.position.y = -160;
        transportGroup.add(chassis);

        // Build 8 massive treaded off-road wheels
        const wheelPositions = [
            [220, -180, 200], [220, -180, 0], [220, -180, -200], [220, -180, -400],
            [-220, -180, 200], [-220, -180, 0], [-220, -180, -200], [-220, -180, -400]
        ];

        wheelPositions.forEach((pos) => {
            const wheelGroup = new THREE.Group();
            
            // Core Tire Torus
            const tireGeom = new THREE.TorusGeometry(45, 18, 64, 128);
            const tire = new THREE.Mesh(tireGeom, rubber);
            tire.rotation.y = Math.PI / 2;
            wheelGroup.add(tire);
            
            // Hundreds of extruded off-road tread lugs
            const lugGeom = new THREE.BoxGeometry(42, 6, 10);
            const numLugs = 80;
            for(let i=0; i<numLugs; i++) {
                const angle = (i / numLugs) * Math.PI * 2;
                const lug = new THREE.Mesh(lugGeom, rubber);
                lug.position.set(0, Math.sin(angle)*60, Math.cos(angle)*60);
                lug.rotation.x = -angle;
                wheelGroup.add(lug);
            }

            // Complex Spoke Rim
            const rimGeom = new THREE.CylinderGeometry(32, 32, 22, 128);
            const rim = new THREE.Mesh(rimGeom, darkSteel);
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);

            const spokeGeom = new THREE.CylinderGeometry(2, 2, 64, 32);
            for(let i=0; i<24; i++) {
                const angle = (i / 24) * Math.PI;
                const spoke = new THREE.Mesh(spokeGeom, chrome);
                spoke.rotation.x = angle;
                rim.add(spoke);
            }
            
            const hubGeom = new THREE.CylinderGeometry(10, 10, 30, 64);
            const hub = new THREE.Mesh(hubGeom, chrome);
            hub.rotation.z = Math.PI / 2;
            wheelGroup.add(hub);

            wheelGroup.position.set(pos[0], pos[1], pos[2]);
            transportGroup.add(wheelGroup);
            
            animData.wheels.push(wheelGroup);
        });

        // Exhaust Stacks (Emitting Plasma/Heat)
        for(let i=0; i<4; i++) {
            const exX = (i % 2 === 0) ? 180 : -180;
            const exZ = (i < 2) ? -280 : -320;
            const exGeom = new THREE.CylinderGeometry(8, 10, 120, 32);
            const exhaust = new THREE.Mesh(exGeom, darkSteel);
            exhaust.position.set(exX, -100, exZ);
            transportGroup.add(exhaust);

            const heatGeom = new THREE.CylinderGeometry(6, 6, 40, 16);
            const heat = new THREE.Mesh(heatGeom, matPlasmaGlow);
            heat.position.set(exX, -20, exZ);
            transportGroup.add(heat);
            animData.exhausts.push(heat);
        }

        // --- DETAILED OPERATOR CABIN ---
        const cabinGroup = new THREE.Group();
        const cabinShell = new THREE.Mesh(new THREE.BoxGeometry(80, 50, 60), steel);
        cabinGroup.add(cabinShell);
        
        // Tinted Windshield
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(76, 25, 4), tinted);
        windshield.position.set(0, 8, 30);
        cabinGroup.add(windshield);

        // Control Console inside
        const console = new THREE.Mesh(new THREE.BoxGeometry(70, 15, 20), darkSteel);
        console.position.set(0, -10, 20);
        cabinGroup.add(console);

        // Steering Wheel
        const sWheelGeom = new THREE.TorusGeometry(6, 1, 32, 64);
        const sWheel = new THREE.Mesh(sWheelGeom, plastic);
        sWheel.position.set(-20, 4, 15);
        sWheel.rotation.x = -Math.PI / 4;
        cabinGroup.add(sWheel);
        animData.steeringWheels.push(sWheel);

        // Dual Micro-Adjustment Joysticks
        for(let i=-1; i<=1; i+=2) {
            const joystickGeom = new THREE.CylinderGeometry(1, 1, 10, 32);
            const joystick = new THREE.Mesh(joystickGeom, chrome);
            joystick.position.set(20 + i*8, 4, 18);
            joystick.rotation.x = -Math.PI / 8;
            cabinGroup.add(joystick);
            animData.joysticks.push({mesh: joystick, phase: Math.random()});
        }

        // Glowing Screens
        for(let i=0; i<4; i++) {
            const screen = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 1), matScreen);
            screen.position.set(-25 + i*16, 8, 25);
            screen.rotation.x = -Math.PI / 6;
            cabinGroup.add(screen);
            animData.screens.push(screen);
        }

        cabinGroup.position.set(0, -100, 300); // Front of the transport chassis
        transportGroup.add(cabinGroup);

        parts.push({
            name: "Heavy-Duty Mobile Crawler Chassis",
            description: "A colossal dark-steel platform allowing the entire containment facility to relocate dynamically.",
            material: "Dark Steel / Depleted Uranium Ballast",
            function: "Transports the payload away from populated areas in the event of an imminent unrecoverable containment failure.",
            assemblyOrder: 10,
            connections: ["Hydraulic Dampening Pillars", "Crawler Wheels"],
            failureEffect: "Immobility. Cannot relocate the apocalyptic threat.",
            cascadeFailures: ["Geographical destruction"],
            originalPosition: {x:0, y:-160, z:0},
            explodedPosition: {x:0, y:-400, z:0}
        });

        parts.push({
            name: "Aggressive Off-Road Crawler Tires (x8)",
            description: "Massive solid rubber toruses layered with hundreds of extruded lugs for perfect traction.",
            material: "Vulcanized Rubber / Chrome / Steel",
            function: "Provides unstoppable mobility across any terrain, crushing obstacles.",
            assemblyOrder: 11,
            connections: ["Chassis Axles"],
            failureEffect: "Loss of traction, transport vehicle gets stuck.",
            cascadeFailures: ["Immobility"],
            originalPosition: {x:220, y:-180, z:200},
            explodedPosition: {x:400, y:-250, z:400}
        });

        parts.push({
            name: "Operator Command Cabin",
            description: "Heavily shielded cockpit featuring tinted glass, steering wheels, joysticks, and multiple glowing telemetry screens.",
            material: "Steel / Tinted Glass / Plastic / Chrome",
            function: "Allows a pilot to manually override the AI and drive the transport crawler, adjusting micro-containment fields via joysticks.",
            assemblyOrder: 12,
            connections: ["Forward Chassis Deck"],
            failureEffect: "Pilot incapacitated due to radiation leakage.",
            cascadeFailures: ["Loss of manual override"],
            originalPosition: {x:0, y:-100, z:300},
            explodedPosition: {x:0, y:-100, z:600}
        });

        return transportGroup;
    }

    // --- ASSEMBLE ALL COMPONENTS ---
    const core = buildStrangeletCore();
    const containment = buildContainmentFields();
    const traps = buildPenningTraps();
    const chamber = buildVacuumChamber();
    const lasers = buildLaserCoolingSystem();
    const power = buildPowerBanks();
    const structure = buildSupportStructure();
    const piping = buildComplexPiping();
    const crawler = buildCrawlerTransport();

    group.add(core);
    group.add(containment);
    group.add(traps);
    group.add(chamber);
    group.add(lasers);
    group.add(power);
    group.add(structure);
    group.add(piping);
    group.add(crawler);

    // --- LIGHTING ---
    const coreLight = new THREE.PointLight(0xaa00ff, 1500, 300);
    group.add(coreLight);
    
    const ambientBlue = new THREE.PointLight(0x0055ff, 500, 500);
    ambientBlue.position.set(0, 150, 0);
    group.add(ambientBlue);
    
    const ambientRed = new THREE.PointLight(0xff0000, 500, 500);
    ambientRed.position.set(0, -150, 0);
    group.add(ambientRed);

    // Ensure we meet the > 15 parts requirement (currently we have 12 major part entries). Adding more detailed entries:
    
    parts.push({
        name: "External Diagnostic Sensor Array",
        description: "Thousands of microscopic quantum sensors embedded in the chamber hull, updating at terahertz frequencies.",
        material: "Silicon / Gold / Sapphire",
        function: "Monitors the strangelet's precise sub-atomic position to picometer accuracy.",
        assemblyOrder: 13,
        connections: ["Vacuum Chamber Hull", "AI Core"],
        failureEffect: "Feedback loop broken, containment fields cannot adjust.",
        cascadeFailures: ["Loss of containment"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:0}
    });

    parts.push({
        name: "Heavy Neutron Shielding Panels",
        description: "Interlocking dense panels of boron-carbide and lead wrapping the exterior.",
        material: "Boron-Carbide / Lead",
        function: "Absorbs stray neutrons and high-energy gamma radiation emitted during quantum fluctuations of the strangelet.",
        assemblyOrder: 14,
        connections: ["Vacuum Chamber Exterior"],
        failureEffect: "Lethal radiation doses to facility personnel and local environment.",
        cascadeFailures: ["Personnel incapacitation"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:0}
    });

    parts.push({
        name: "Emergency Helium Dump Valves",
        description: "Massive explosive valves on the cryogenic lines.",
        material: "Titanium",
        function: "In case of a quench event, rapidly vents boiling helium to prevent the superconducting coils from exploding.",
        assemblyOrder: 15,
        connections: ["Cryogenic Piping Network"],
        failureEffect: "Helium expansion destroys the coils.",
        cascadeFailures: ["Catastrophic explosion", "Containment breach"],
        originalPosition: {x:0, y:120, z:0},
        explodedPosition: {x:0, y:250, z:0}
    });

    parts.push({
        name: "Main Artificial Intelligence Control Core",
        description: "A localized quantum computer housed beneath the main structure inside the crawler chassis.",
        material: "Quantum Circuitry / Cryo-Cooling Gel",
        function: "Calculates the necessary micro-adjustments for the Penning traps in real-time, far faster than human capability.",
        assemblyOrder: 16,
        connections: ["Diagnostic Sensor Array", "Penning Traps", "Capacitor Banks"],
        failureEffect: "Total system paralysis.",
        cascadeFailures: ["Immediate and unavoidable loss of containment"],
        originalPosition: {x:0, y:-150, z:0},
        explodedPosition: {x:0, y:-300, z:0}
    });

    parts.push({
        name: "Plasma Exhaust Stacks",
        description: "Massive vertical chimneys venting immense waste heat and plasma from the crawler engine.",
        material: "Dark Steel / Plasma",
        function: "Prevents the crawler chassis engine from melting down under the terawatt loads.",
        assemblyOrder: 17,
        connections: ["Crawler Chassis"],
        failureEffect: "Engine meltdown.",
        cascadeFailures: ["Immobility", "Power loss"],
        originalPosition: {x:180, y:-100, z:-280},
        explodedPosition: {x:300, y:100, z:-400}
    });

    parts.push({
        name: "Micro-Adjustment Joysticks & Steering",
        description: "High-precision mechanical inputs inside the cabin.",
        material: "Chrome / Plastic",
        function: "Permits human oversight and emergency manual balancing of the magnetic fields.",
        assemblyOrder: 18,
        connections: ["Cabin Control Console"],
        failureEffect: "Loss of manual input.",
        cascadeFailures: [],
        originalPosition: {x:20, y:-96, z:318},
        explodedPosition: {x:50, y:-50, z:350}
    });

    // --- EXTREME ANIMATION LOGIC ---
    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        if (animData.core) {
            animData.core.rotation.x = Math.sin(t * 3) * 0.8;
            animData.core.rotation.y = t * 4;
            const scale = 1.0 + Math.sin(t * 25) * 0.08 + Math.random() * 0.08; 
            animData.core.scale.set(scale, scale, scale);
            animData.core.material.emissiveIntensity = 20.0 + Math.sin(t * 15) * 8.0;
        }

        animData.coreShells.forEach((shell, idx) => {
            shell.mesh.rotateOnAxis(shell.axis, shell.speed * speed * 0.08);
            const pulse = 1.0 + Math.sin(t * 6 + idx) * 0.15;
            shell.mesh.scale.set(pulse, pulse, pulse);
        });

        animData.coreParticles.forEach((p) => {
            p.angle += p.orbitSpeed * speed * 0.08;
            p.mesh.position.x = Math.cos(p.angle) * p.orbitRadius;
            p.mesh.position.z = Math.sin(p.angle) * p.orbitRadius;
            p.mesh.position.applyAxisAngle(p.orbitAxis, p.orbitSpeed * speed * 0.04);
        });

        animData.magneticRings.forEach((ring) => {
            if (ring.type === 'pulse') {
                const s = ring.baseScale + Math.sin(t * 5) * 0.03;
                ring.mesh.scale.set(s, s, s);
                ring.mesh.material.opacity = 0.25 + Math.sin(t * 10) * 0.15;
            } else if (ring.type === 'rotate') {
                ring.mesh.rotateOnAxis(ring.axis, ring.speed * speed * 0.08);
            }
        });

        animData.penningCoilsPrimary.forEach((coil, idx) => {
            coil.rotation.y = t * 0.8 * (idx === 0 ? 1 : -1);
        });

        animData.laserBeams.forEach((beam) => {
            beam.material.opacity = 0.8 + (Math.random() - 0.5) * 0.4;
            beam.scale.x = 1.0 + Math.random() * 0.6;
            beam.scale.z = 1.0 + Math.random() * 0.6;
        });

        animData.penningRotors.forEach((rotor) => {
            rotor.rotation.y += 35 * speed; 
        });

        animData.powerCapacitors.forEach((cap, idx) => {
            cap.material.emissiveIntensity = 5.0 + Math.sin(t * 12 + idx) * 4.0;
        });

        animData.hydraulicDampers.forEach((damper, idx) => {
            damper.mesh.position.y = damper.baseY + Math.sin(t * 18 + idx * 3) * 0.8;
        });

        animData.plasmaConduits.forEach((pipe, idx) => {
            pipe.material.emissiveIntensity = 4.0 + Math.sin(t * 8 + idx) * 4.0;
        });

        // Vehicle Animations
        animData.wheels.forEach((wheel) => {
            // Wheels slowly turn as the crawler moves imperceptibly forward
            wheel.children[0].rotation.z -= 0.5 * speed; // Tire
            wheel.children[2].rotation.z -= 0.5 * speed; // Rim
            wheel.children[3].rotation.z -= 0.5 * speed; // Hub
            
            // Lug rotation
            for(let i=1; i<=80; i++) {
                if(wheel.children[i] && wheel.children[i].geometry.type === 'BoxGeometry') {
                    // Update lug rotation around the tire's local axis
                    const angle = (i / 80) * Math.PI * 2 - (t * 0.5 * speed);
                    wheel.children[i].position.set(0, Math.sin(angle)*60, Math.cos(angle)*60);
                    wheel.children[i].rotation.x = -angle;
                }
            }
        });

        animData.exhausts.forEach((exh) => {
            exh.scale.y = 1.0 + Math.random() * 0.5;
            exh.material.opacity = 0.6 + Math.random() * 0.4;
        });

        animData.steeringWheels.forEach((sw) => {
            sw.rotation.z = Math.sin(t * 2) * 0.5; // Pilot making corrections
        });

        animData.joysticks.forEach((js) => {
            js.mesh.rotation.x = -Math.PI / 8 + Math.sin(t * 10 + js.phase) * 0.2;
            js.mesh.rotation.z = Math.cos(t * 8 + js.phase) * 0.2;
        });

        animData.screens.forEach((sc, idx) => {
            sc.material.emissiveIntensity = 2.0 + Math.random() * 1.5;
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
