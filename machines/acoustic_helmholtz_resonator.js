import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        chamberCore: null,
        outerLattice: [],
        fluidParticles: [],
        fluidTubes: [],
        confinementRings: [],
        hydraulicBases: [],
        hydraulicArms: [],
        acousticNodes: [],
        energyCores: [],
        scaffolding: group, // Just to have a reference
        rotors: [],
        lensPlates: []
    };

    const SCALE = 1;
    
    // --- HELPER FUNCTIONS FOR GEOMETRY ---
    
    function createPiston(radius, length, baseMaterial, armMaterial) {
        const pistonGroup = new THREE.Group();
        const baseGeom = new THREE.CylinderGeometry(radius, radius, length, 32);
        const base = new THREE.Mesh(baseGeom, baseMaterial);
        base.position.y = length / 2;
        
        const armGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.5, 32);
        const arm = new THREE.Mesh(armGeom, armMaterial);
        arm.position.y = length;
        
        pistonGroup.add(base);
        pistonGroup.add(arm);
        
        return { group: pistonGroup, base, arm };
    }

    function createComplexRing(innerRadius, outerRadius, thickness, radialSegments, tubularSegments, material) {
        const ringGeom = new THREE.TorusGeometry(outerRadius, thickness, radialSegments, tubularSegments);
        const ring = new THREE.Mesh(ringGeom, material);
        return ring;
    }
    
    function createTreadedTire(radius, width, treads, material) {
        const tireGroup = new THREE.Group();
        const baseTorus = new THREE.Mesh(new THREE.TorusGeometry(radius, width/2, 32, 100), material);
        tireGroup.add(baseTorus);
        
        const treadGeom = new THREE.BoxGeometry(width * 1.2, width * 0.4, radius * 0.3);
        for(let i=0; i<treads; i++) {
            const angle = (i / treads) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeom, material);
            tread.position.set(Math.cos(angle) * (radius + width/2 * 0.8), Math.sin(angle) * (radius + width/2 * 0.8), 0);
            tread.rotation.z = angle;
            tireGroup.add(tread);
        }
        return tireGroup;
    }

    // --- CUSTOM EMISSIVE MATERIALS ---
    const darkMatterGlow = new THREE.MeshStandardMaterial({
        color: 0x110033,
        emissive: 0x4400ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.8
    });

    const nodeGlowAlpha = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const nodeGlowBeta = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    
    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.05,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        opacity: 0.6,
        transparent: true,
        transmission: 0.9,
        ior: 2.5 // High IOR for gravitational lensing effect
    });

    // --- MAIN GEOMETRY CONSTRUCTION ---

    // 1. The Colossal Spherical Chamber
    const chamberRadius = 200 * SCALE;
    const chamberGeom = new THREE.IcosahedronGeometry(chamberRadius, 6);
    meshes.chamberCore = new THREE.Mesh(chamberGeom, darkSteel);
    group.add(meshes.chamberCore);
    
    // Create an intricate outer lattice (geodesic struts)
    const latticeGeom = new THREE.IcosahedronGeometry(chamberRadius * 1.05, 3);
    const latticeWire = new THREE.WireframeGeometry(latticeGeom);
    const latticeLines = new THREE.LineSegments(latticeWire, new THREE.LineBasicMaterial({ color: 0x00aaff, linewidth: 2, transparent: true, opacity: 0.5 }));
    meshes.outerLattice.push(latticeLines);
    group.add(latticeLines);
    
    // Add structural nodes at lattice vertices
    const posAttribute = latticeGeom.attributes.position;
    const nodeGeom = new THREE.SphereGeometry(3 * SCALE, 16, 16);
    for(let i=0; i<posAttribute.count; i++) {
        if(i % 5 === 0) { // Optimize by not placing a node on EVERY vertex
            const node = new THREE.Mesh(nodeGeom, copper);
            node.position.set(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
            meshes.acousticNodes.push(node);
            group.add(node);
        }
    }

    // 2. The Resonator Neck (Massive Cylinder with cooling fins)
    const neckRadius = 60 * SCALE;
    const neckLength = 300 * SCALE;
    const neckGroup = new THREE.Group();
    neckGroup.position.y = chamberRadius + neckLength / 2 - 20;
    
    const neckCoreGeom = new THREE.CylinderGeometry(neckRadius, neckRadius * 1.2, neckLength, 64);
    const neckCore = new THREE.Mesh(neckCoreGeom, darkSteel);
    neckGroup.add(neckCore);
    
    // Cooling fins (Magnetic Confinement Rings)
    for(let i = 0; i < 20; i++) {
        const ringY = -neckLength/2 + (i / 19) * neckLength;
        const ring = createComplexRing(neckRadius, neckRadius + 20, 5, 16, 100, steel);
        ring.position.y = ringY;
        ring.rotation.x = Math.PI / 2;
        neckGroup.add(ring);
        meshes.confinementRings.push(ring);
    }
    
    // 3. Dark Matter Fluid Injectors & Swirling Fluid
    const fluidGroup = new THREE.Group();
    const numTubes = 8;
    for (let i = 0; i < numTubes; i++) {
        // Create a spiral curve for fluid
        const curvePoints = [];
        for (let t = 0; t <= 100; t++) {
            const angle = (t / 100) * Math.PI * 4 + (i / numTubes) * Math.PI * 2;
            const r = (neckRadius - 10) * (1 - (t/100)*0.5); // Tapering spiral
            const y = -neckLength/2 + (t/100) * neckLength;
            curvePoints.push(new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeom = new THREE.TubeGeometry(curve, 100, 4, 8, false);
        const tube = new THREE.Mesh(tubeGeom, darkMatterGlow);
        fluidGroup.add(tube);
        meshes.fluidTubes.push(tube);
    }
    
    // Fluid Particles
    const particleGeom = new THREE.SphereGeometry(2, 8, 8);
    for(let i=0; i<300; i++) {
        const particle = new THREE.Mesh(particleGeom, nodeGlowBeta);
        particle.userData = {
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * (neckRadius - 5),
            height: (Math.random() - 0.5) * neckLength,
            speed: 0.02 + Math.random() * 0.03
        };
        fluidGroup.add(particle);
        meshes.fluidParticles.push(particle);
    }
    neckGroup.add(fluidGroup);
    group.add(neckGroup);

    // 4. Acoustic Nodes (Glowing Cores inside the chamber)
    // We will place large pulsing spheres inside. To see them, we make the chamber slightly transparent or just let them bleed through with bloom (conceptually).
    // Actually, let's create large cutouts or equator vents in the chamber.
    const ventGeom = new THREE.CylinderGeometry(chamberRadius * 1.01, chamberRadius * 1.01, 40, 64, 1, true, 0, Math.PI * 2);
    const vent = new THREE.Mesh(ventGeom, nodeGlowAlpha);
    group.add(vent);
    meshes.energyCores.push(vent);

    // 5. Huge Hydraulic Pistons supporting the neck
    const numPistons = 6;
    for(let i=0; i<numPistons; i++) {
        const angle = (i / numPistons) * Math.PI * 2;
        const pRadius = 8 * SCALE;
        const pLength = 150 * SCALE;
        const { group: piston, base, arm } = createPiston(pRadius, pLength, chrome, steel);
        
        // Position at the shoulder of the chamber
        const shoulderR = chamberRadius * 0.8;
        const shoulderY = chamberRadius * 0.6;
        piston.position.set(Math.cos(angle) * shoulderR, shoulderY, Math.sin(angle) * shoulderR);
        
        // Point towards the neck
        piston.lookAt(new THREE.Vector3(Math.cos(angle) * (neckRadius*1.5), neckGroup.position.y, Math.sin(angle) * (neckRadius*1.5)));
        piston.rotateX(Math.PI / 2); // Adjust cylinder orientation
        
        group.add(piston);
        meshes.hydraulicBases.push(base);
        meshes.hydraulicArms.push({ arm, initialY: arm.position.y, phase: i });
    }

    // 6. External Sensor Array and Scaffolding
    const scaffoldGroup = new THREE.Group();
    const scaffoldRadius = chamberRadius * 1.4;
    
    // Equatorial Ring
    const eqRing = createComplexRing(scaffoldRadius, scaffoldRadius + 15, 10, 32, 100, aluminum);
    eqRing.rotation.x = Math.PI / 2;
    scaffoldGroup.add(eqRing);
    
    // Vertical Rings
    const vertRing1 = createComplexRing(scaffoldRadius, scaffoldRadius + 15, 10, 32, 100, aluminum);
    scaffoldGroup.add(vertRing1);
    const vertRing2 = createComplexRing(scaffoldRadius, scaffoldRadius + 15, 10, 32, 100, aluminum);
    vertRing2.rotation.y = Math.PI / 2;
    scaffoldGroup.add(vertRing2);
    
    meshes.rotors.push(vertRing1, vertRing2, eqRing);
    
    // Gravitational Lens Plates
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const plateGeom = new THREE.BoxGeometry(40, 80, 5);
        const plate = new THREE.Mesh(plateGeom, lensMaterial);
        plate.position.set(Math.cos(angle) * scaffoldRadius, 0, Math.sin(angle) * scaffoldRadius);
        plate.lookAt(new THREE.Vector3(0,0,0));
        scaffoldGroup.add(plate);
        meshes.lensPlates.push(plate);
    }
    
    group.add(scaffoldGroup);

    // 7. Base Mount / Ground Interface with extreme treads (for mobile variant of the resonator)
    const baseGroup = new THREE.Group();
    baseGroup.position.y = -chamberRadius - 80;
    
    const basePlinthGeom = new THREE.CylinderGeometry(chamberRadius * 0.8, chamberRadius * 1.2, 50, 64);
    const basePlinth = new THREE.Mesh(basePlinthGeom, darkSteel);
    baseGroup.add(basePlinth);
    
    // Add huge treaded tires (Torus with boxes)
    const numTires = 8;
    for(let i=0; i<numTires; i++) {
        const angle = (i/numTires) * Math.PI * 2;
        const tire = createTreadedTire(40, 30, 40, rubber);
        tire.position.set(Math.cos(angle) * chamberRadius * 1.3, -20, Math.sin(angle) * chamberRadius * 1.3);
        // Align tires tangentially
        tire.rotation.y = -angle + Math.PI/2;
        baseGroup.add(tire);
    }
    group.add(baseGroup);

    // --- PARTS DEFINITION ---
    parts.push({
        name: "Main Resonance Chamber",
        description: "A moon-sized sphere composed of ultra-dense dark steel and stabilized by gravitational nodes. It acts as a macroscopic acoustic cavity to amplify Baryon Acoustic Oscillations, simulating the early universe photon-baryon plasma.",
        material: "darkSteel",
        function: "Amplifies and sustains cosmic acoustic waves.",
        assemblyOrder: 1,
        connections: ["Magnetic Confinement Neck", "Hydraulic Support Struts", "Equatorial Ring"],
        failureEffect: "Catastrophic acoustic decompression, unleashing a localized Big Bang event.",
        cascadeFailures: ["Complete structural vaporization", "Dark matter fluid containment breach"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    parts.push({
        name: "Magnetic Confinement Neck",
        description: "A heavily reinforced cylindrical column equipped with 20 superconducting torus rings. It channels and accelerates the dark matter fluid from the injector array into the main chamber.",
        material: "steel",
        function: "Fluid channeling and magnetic pinching.",
        assemblyOrder: 2,
        connections: ["Main Resonance Chamber", "Dark Matter Injectors"],
        failureEffect: "Fluid leakage, causing local gravitational anomalies.",
        cascadeFailures: ["Neck fracture", "Hydraulic failure"],
        originalPosition: {x: 0, y: 230, z: 0},
        explodedPosition: {x: 0, y: 400, z: 0}
    });

    parts.push({
        name: "Dark Matter Swirl Tubes",
        description: "8 interlocking spiral conduits carrying hyper-cooled, super-fluid dark matter into the acoustic chamber. They glow with intense Cherenkov radiation due to tachyonic decay processes.",
        material: "darkMatterGlow",
        function: "Delivery of mass-energy to the acoustic nodes.",
        assemblyOrder: 3,
        connections: ["Magnetic Confinement Neck"],
        failureEffect: "Fluid flow stagnation, halting the acoustic oscillation.",
        cascadeFailures: ["Tube rupture", "Thermal runaway"],
        originalPosition: {x: 0, y: 230, z: 0},
        explodedPosition: {x: 200, y: 500, z: -200}
    });

    parts.push({
        name: "Acoustic Overdensity Nodes",
        description: "Thousands of small copper-plated resonance spheres distributed across the geodesic lattice. They measure and manipulate the micro-fluctuations in the dark matter density field.",
        material: "copper",
        function: "Fine-tuning of acoustic wave harmonics.",
        assemblyOrder: 4,
        connections: ["Geodesic Lattice"],
        failureEffect: "Harmonic dissonance leading to constructive interference spikes.",
        cascadeFailures: ["Lattice shattering"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -300, y: 0, z: 300}
    });

    parts.push({
        name: "Hydraulic Damping Struts",
        description: "Six massive chrome-steel pistons that absorb the immense recoil generated by the macroscopic acoustic shockwaves, preventing the neck from snapping off the chamber.",
        material: "chrome",
        function: "Structural shock absorption.",
        assemblyOrder: 5,
        connections: ["Main Resonance Chamber", "Magnetic Confinement Neck"],
        failureEffect: "Neck shearing under shear stress.",
        cascadeFailures: ["Total structural collapse"],
        originalPosition: {x: 0, y: 120, z: 0},
        explodedPosition: {x: 0, y: 300, z: 400}
    });

    parts.push({
        name: "Equatorial Scaffolding Ring",
        description: "A primary aluminum structural loop providing a mounting point for external sensors and the gravitational lens array.",
        material: "aluminum",
        function: "Sensor mounting and gyroscope stabilization.",
        assemblyOrder: 6,
        connections: ["Gravitational Lens Array"],
        failureEffect: "Loss of gyroscopic stability.",
        cascadeFailures: ["Sensor misalignment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -200, z: 0}
    });

    parts.push({
        name: "Gravitational Lens Plates",
        description: "8 slabs of ultra-high IOR metamaterial (simulated via advanced glass properties). They bend local spacetime to allow observation of the internal dark matter fluid without physical intrusion.",
        material: "glass",
        function: "Spacetime distortion for observational telemetry.",
        assemblyOrder: 7,
        connections: ["Equatorial Scaffolding Ring"],
        failureEffect: "Blinding of external sensors to the internal state.",
        cascadeFailures: ["Control loop failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 400, y: 0, z: 0}
    });

    parts.push({
        name: "Geodesic Containment Lattice",
        description: "A sprawling wireframe of energized plasma conduits that act as a Faraday cage for gravitational waves, keeping the BAO contained within the chamber.",
        material: "plasma",
        function: "Gravitational wave containment.",
        assemblyOrder: 8,
        connections: ["Main Resonance Chamber"],
        failureEffect: "Leakage of primordial acoustic waves into local spacetime.",
        cascadeFailures: ["Spacetime tearing"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -500, y: -500, z: -500}
    });

    parts.push({
        name: "Baryon Injector Array (Alpha)",
        description: "High-throughput valving system to introduce ordinary baryonic matter (hydrogen/helium plasma) to mix with the dark matter fluid.",
        material: "steel",
        function: "Creates the photon-baryon fluid required for the acoustic oscillations.",
        assemblyOrder: 9,
        connections: ["Magnetic Confinement Neck"],
        failureEffect: "Improper matter mixture, suppressing BAO formation.",
        cascadeFailures: ["Plasma stall"],
        originalPosition: {x: 0, y: 350, z: 50},
        explodedPosition: {x: 0, y: 600, z: 200}
    });

    parts.push({
        name: "CMB Sensor Array",
        description: "Highly sensitive microwave antennae calibrated to detect the simulated cosmic microwave background radiation emitted during the artificial 'recombination' epoch inside the chamber.",
        material: "copper",
        function: "Telemetry acquisition of the acoustic peak scales.",
        assemblyOrder: 10,
        connections: ["Vertical Scaffolding Rings"],
        failureEffect: "Loss of primary scientific data.",
        cascadeFailures: ["None"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 500, z: -400}
    });
    
    parts.push({
        name: "Mobile Base Plinth",
        description: "A massive, dense foundation housing the primary power plant and mobility systems, allowing the entire resonator to traverse rugged planetary terrain.",
        material: "darkSteel",
        function: "Locomotion and power generation.",
        assemblyOrder: 11,
        connections: ["Main Resonance Chamber", "Treaded Mobility Units"],
        failureEffect: "Immobilization and power starvation.",
        cascadeFailures: ["Loss of containment fields"],
        originalPosition: {x: 0, y: -280, z: 0},
        explodedPosition: {x: 0, y: -600, z: 0}
    });

    parts.push({
        name: "Treaded Mobility Units",
        description: "Eight gigantic tires made of advanced synthetic rubber, clad in deep treads to grip the regolith of lifeless moons.",
        material: "rubber",
        function: "Traction and weight distribution.",
        assemblyOrder: 12,
        connections: ["Mobile Base Plinth"],
        failureEffect: "Sinking into soft terrain or loss of traversal capability.",
        cascadeFailures: ["Structural tilt and stress fracturing"],
        originalPosition: {x: 0, y: -300, z: 0},
        explodedPosition: {x: 500, y: -600, z: 500}
    });

    parts.push({
        name: "Primary Resonance Harmonizer",
        description: "A central tuning fork-like structure embedded within the core, vibrating at precisely the frequency of the primordial density perturbations.",
        material: "chrome",
        function: "Seeds the initial acoustic waves.",
        assemblyOrder: 13,
        connections: ["Main Resonance Chamber"],
        failureEffect: "Off-resonance oscillations leading to chaotic turbulence.",
        cascadeFailures: ["Complete acoustic decoherence"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 800}
    });

    parts.push({
        name: "Sub-Harmonic Damper",
        description: "Secondary systems designed to filter out high-frequency noise that deviates from the pure BAO signal.",
        material: "aluminum",
        function: "Signal-to-noise ratio enhancement.",
        assemblyOrder: 14,
        connections: ["Geodesic Containment Lattice"],
        failureEffect: "Noisy data output, obscuring the sound horizon measurement.",
        cascadeFailures: ["Sensor overload"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -800, y: 0, z: 0}
    });

    parts.push({
        name: "Temporal Stasis Generator",
        description: "Experimental module that dilates local time within the chamber, slowing down the 'early universe' simulation to observable speeds for human researchers.",
        material: "tinted",
        function: "Time dilation for observational convenience.",
        assemblyOrder: 15,
        connections: ["Equatorial Scaffolding Ring"],
        failureEffect: "Simulation completes in nanoseconds, rendering observation impossible.",
        cascadeFailures: ["Flash-heating of entire facility"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 800, z: 0}
    });

    const description = "The Ultra God Tier Helmholtz Resonator (Dark Matter Variant) is a pinnacle of macro-engineering and theoretical physics. Designed to artificially recreate the conditions of the early universe prior to recombination, it traps a highly pressurized photon-baryon-dark-matter fluid within a colossal moon-sized acoustic cavity. By precisely controlling the inflow of dark matter and plasma, it induces Baryon Acoustic Oscillations (BAO). The immense sound waves ripple through the fluid, creating massive overdensities that are contained by a pulsing geodesic lattice and magnetic pinch rings. This machine allows physicists to directly observe the seeding of galaxy clusters in real-time, functioning as a window into the primordial cosmos.";

    const quizQuestions = [
        {
            question: "What is the fundamental physical origin of Baryon Acoustic Oscillations (BAO) in the early universe, which this machine simulates?",
            options: [
                "A) Gravitational collapse of dark matter halos pulling baryons violently inward.",
                "B) Acoustic waves in the primordial photon-baryon fluid, driven by the opposing forces of radiation pressure and gravity.",
                "C) Inflationary quantum fluctuations isolated purely in the tensor sector of spacetime.",
                "D) Magnetic field reconnections in the hyper-dense primordial plasma."
            ],
            correctAnswer: 1,
            explanation: "BAO are essentially sound waves. In the hot, dense early universe, photons and baryons were tightly coupled via Thomson scattering. Gravity tried to pull this matter together into overdensities, but the intense radiation pressure of the photons pushed outward, creating a spherical sound wave."
        },
        {
            question: "In the context of the cosmic microwave background (CMB), at what epoch did the photon-baryon acoustic waves 'freeze out', establishing the characteristic BAO scale?",
            options: [
                "A) Matter-Radiation Equality",
                "B) The Epoch of Recombination / Decoupling",
                "C) The Epoch of Reionization",
                "D) Big Bang Nucleosynthesis"
            ],
            correctAnswer: 1,
            explanation: "At the epoch of recombination, the universe cooled enough for electrons and protons to form neutral hydrogen. Photons decoupled from baryons and free-streamed away. Without radiation pressure, the acoustic waves stalled or 'froze', leaving a shell of slightly higher baryon density at a specific radius (the sound horizon)."
        },
        {
            question: "How is the frozen BAO scale utilized by modern cosmologists as a 'standard ruler'?",
            options: [
                "A) By measuring the luminosity distance of Type Ia supernovae within the acoustic shells.",
                "B) By identifying a preferred comoving scale (approx 150 Mpc) as a distinct peak in the two-point correlation function of galaxy clustering.",
                "C) By measuring the dispersion measure of fast radio bursts traveling through the intergalactic medium.",
                "D) By analyzing the Lyman-alpha forest strictly for neutral hydrogen mass variations."
            ],
            correctAnswer: 1,
            explanation: "Because galaxies preferentially formed in the overdense regions created by these acoustic shells, there is a slightly higher probability of finding two galaxies separated by the comoving sound horizon scale (roughly 150 Megaparsecs today). This provides a fixed physical scale to measure the expansion history of the universe."
        },
        {
            question: "Which of the following best describes the critical role of Dark Matter in the formation and preservation of the BAO signature?",
            options: [
                "A) Dark matter interacts strongly with photons, actively driving the outward acoustic wave alongside baryons.",
                "B) Dark matter provides the underlying gravitational potential wells at the original perturbation sites, largely unaffected by radiation pressure, anchoring the central overdensities.",
                "C) Dark matter annihilations produce the high-energy photons that create the necessary radiation pressure.",
                "D) Dark matter undergoes identical acoustic oscillations to baryons, doubling the amplitude of the waves."
            ],
            correctAnswer: 1,
            explanation: "Dark matter only interacts gravitationally. Therefore, it did not participate in the acoustic oscillations driven by photon pressure. It stayed at the center of the original perturbations, forming deep gravitational wells that later pulled the baryons back in after decoupling, creating a central peak and a spherical shell in the final density distribution."
        },
        {
            question: "The comoving sound horizon $r_s$ at the drag epoch is given by an integral over the sound speed $c_s$. How does the theoretical inclusion of a significant fraction of massive neutrinos affect this BAO scale?",
            options: [
                "A) It increases the sound speed significantly due to their relativistic nature, expanding the sound horizon.",
                "B) It alters the expansion rate (the Hubble parameter) during the radiation-dominated era, slightly modifying the sound horizon and damping the acoustic peaks due to free-streaming.",
                "C) It causes the photons to decouple much earlier via weak interactions, severely shrinking the sound horizon.",
                "D) Massive neutrinos completely erase the BAO signature via violent pair-production cascades."
            ],
            correctAnswer: 1,
            explanation: "Massive neutrinos contribute to the radiation energy density at early times and transition to non-relativistic matter later. Their presence changes the expansion rate (H(z)) during the epochs relevant for BAO, which slightly shifts the sound horizon integral. Furthermore, their large thermal velocities allow them to free-stream out of overdensities, suppressing the growth of structure and damping the amplitude of the BAO peaks."
        }
    ];

    // --- ANIMATION LOGIC ---
    function animate(time, speed, activeMeshes) {
        const t = time * speed * 0.5;
        
        // 1. Slow, ominous rotation of the entire outer scaffolding
        if(activeMeshes.scaffolding) {
            activeMeshes.scaffolding.rotation.y = t * 0.1;
            activeMeshes.scaffolding.rotation.z = Math.sin(t * 0.05) * 0.1;
        }

        // 2. Swirling Dark Matter Fluid in the neck
        activeMeshes.fluidParticles.forEach((particle, index) => {
            // Move particles in a spiral upward/downward
            particle.userData.angle += particle.userData.speed * speed;
            particle.userData.height -= particle.userData.speed * 10 * speed;
            
            // Loop back to top
            if(particle.userData.height < -150) particle.userData.height = 150;
            
            particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
            particle.position.z = Math.sin(particle.userData.angle) * particle.userData.radius;
            particle.position.y = particle.userData.height;
            
            // Pulse particle scale based on sine wave
            const scalePulse = 1 + 0.5 * Math.sin(t * 5 + index);
            particle.scale.set(scalePulse, scalePulse, scalePulse);
        });

        // 3. Twist the fluid tubes to simulate vortex mechanics
        activeMeshes.fluidTubes.forEach((tube, i) => {
            tube.rotation.y = t * 0.5 + (i * 0.1);
        });

        // 4. Pulse the massive acoustic nodes on the geodesic lattice
        activeMeshes.acousticNodes.forEach((node, i) => {
            // Complex harmonic pulsing
            const pulse = 1 + 0.3 * Math.sin(t * 2 + i * 0.1) * Math.cos(t * 1.5 + i * 0.05);
            node.scale.set(pulse, pulse, pulse);
        });

        // 5. Pulsate the inner energy cores (BAO Overdensities)
        activeMeshes.energyCores.forEach((core) => {
            core.scale.x = 1 + 0.02 * Math.sin(t * 3);
            core.scale.z = 1 + 0.02 * Math.cos(t * 3);
            // Emissive pulsing
            if(core.material && core.material.emissiveIntensity !== undefined) {
                core.material.emissiveIntensity = 3.0 + 2.0 * Math.sin(t * 4);
            }
        });

        // 6. Hydraulic Piston expansion/contraction (simulating breathing/shock absorption)
        activeMeshes.hydraulicArms.forEach((armObj) => {
            // Calculate a breathing wave
            const extension = Math.sin(t * 2 + armObj.phase * Math.PI/3) * 15;
            armObj.arm.position.y = armObj.initialY + extension;
        });
        
        // 7. Counter-rotating magnetic confinement rings
        activeMeshes.confinementRings.forEach((ring, i) => {
            ring.rotation.z = t * (i % 2 === 0 ? 1 : -1) * 2;
        });

        // 8. Spin the giant external rotors for gyroscopic stabilization
        if(activeMeshes.rotors && activeMeshes.rotors.length === 3) {
            activeMeshes.rotors[0].rotation.z = t * 0.2;
            activeMeshes.rotors[1].rotation.x = -t * 0.15;
            activeMeshes.rotors[2].rotation.z = t * 0.3;
        }

        // 9. Pulsate the lattice wireframe opacity and color
        activeMeshes.outerLattice.forEach((lattice) => {
            lattice.rotation.x = t * 0.05;
            lattice.rotation.y = t * 0.08;
            if(lattice.material) {
                lattice.material.opacity = 0.3 + 0.2 * Math.sin(t * 5);
            }
        });
        
        // 10. Rotate Gravitational Lens Plates
        activeMeshes.lensPlates.forEach((plate, i) => {
            plate.rotation.y = Math.sin(t * 0.5 + i) * 0.5;
            plate.rotation.x = Math.cos(t * 0.5 + i) * 0.5;
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createHelmholtzResonator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
