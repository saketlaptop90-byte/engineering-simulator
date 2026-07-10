import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // 1. CUSTOM ADVANCED MATERIALS
    // ==========================================
    
    const plasmaBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        side: THREE.DoubleSide
    });

    const plasmaRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const laserBeamMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const superheatedMetal = new THREE.MeshStandardMaterial({
        color: 0x550000,
        emissive: 0xff5500,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 1.0
    });

    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffddaa,
        emissive: 0xff8822,
        emissiveIntensity: 2.0,
        wireframe: false,
        roughness: 0.4,
        metalness: 0.1
    });

    const darkMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0x110022,
        emissive: 0x440088,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const neonGreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9
    });

    // ==========================================
    // 2. COMPONENT GENERATORS
    // ==========================================

    // Helper: Create a highly detailed cylindrical truss segment
    function createTruss(radius, length, segments, radialSegments) {
        const trussGroup = new THREE.Group();
        
        // Main structural beams
        const beamGeo = new THREE.CylinderGeometry(radius * 0.05, radius * 0.05, length, 8);
        for (let i = 0; i < radialSegments; i++) {
            const angle = (i / radialSegments) * Math.PI * 2;
            const beam = new THREE.Mesh(beamGeo, darkSteel);
            beam.position.x = Math.cos(angle) * radius;
            beam.position.y = Math.sin(angle) * radius;
            beam.rotation.x = Math.PI / 2;
            trussGroup.add(beam);
        }

        // Cross braces
        const segmentLength = length / segments;
        for (let j = 0; j < segments; j++) {
            const zPos = -length / 2 + j * segmentLength + segmentLength / 2;
            
            // Ring
            const ringGeo = new THREE.TorusGeometry(radius, radius * 0.04, 8, radialSegments);
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.position.z = zPos - segmentLength / 2;
            trussGroup.add(ring);

            // Diagonal braces
            for (let i = 0; i < radialSegments; i++) {
                const angle1 = (i / radialSegments) * Math.PI * 2;
                const angle2 = ((i + 1) % radialSegments) * Math.PI * 2;
                
                const p1 = new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1) * radius, zPos - segmentLength / 2);
                const p2 = new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2) * radius, zPos + segmentLength / 2);
                
                const braceLength = p1.distanceTo(p2);
                const braceGeo = new THREE.CylinderGeometry(radius * 0.03, radius * 0.03, braceLength, 8);
                const brace = new THREE.Mesh(braceGeo, steel);
                
                const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
                brace.position.copy(midPoint);
                brace.lookAt(p2);
                brace.rotateX(Math.PI / 2);
                
                trussGroup.add(brace);
            }
        }
        return trussGroup;
    }

    // Helper: Hydraulic and cooling lines network
    function createHydraulicLines(radius, length, count, complexity) {
        const lineGroup = new THREE.Group();
        for(let i=0; i<count; i++) {
            const path = new THREE.CurvePath();
            let currentPt = new THREE.Vector3(
                Math.cos(Math.random() * Math.PI * 2) * radius,
                Math.sin(Math.random() * Math.PI * 2) * radius,
                -length/2
            );
            
            for(let j=0; j<complexity; j++) {
                const zNext = -length/2 + (length/complexity) * (j+1);
                const nextPt = new THREE.Vector3(
                    Math.cos(Math.random() * Math.PI * 2) * radius,
                    Math.sin(Math.random() * Math.PI * 2) * radius,
                    zNext
                );
                const curve = new THREE.LineCurve3(currentPt, nextPt);
                path.add(curve);
                currentPt = nextPt;
            }
            
            const tubeGeo = new THREE.TubeGeometry(path, complexity * 4, radius * 0.02, 8, false);
            const tubeMat = Math.random() > 0.5 ? copper : rubber;
            const tube = new THREE.Mesh(tubeGeo, tubeMat);
            lineGroup.add(tube);
        }
        return lineGroup;
    }

    // ==========================================
    // 3. ASSEMBLING THE CAPLAN THRUSTER
    // ==========================================

    const scaleFactor = 100; // General scaling for dramatic effect
    
    // --- The Target Star ---
    // Represents a scaled-down main sequence star
    const starGeo = new THREE.SphereGeometry(2000, 128, 128);
    const starMesh = new THREE.Mesh(starGeo, starMaterial);
    starMesh.position.set(0, 0, -6000);
    group.add(starMesh);
    meshes.star = starMesh;

    // --- Bussard Ramjet Electromagnetic Funnel (The Scoop) ---
    const funnelGroup = new THREE.Group();
    funnelGroup.position.set(0, 0, -2000);
    
    // Funnel Magnetic Coils
    const scoopRings = 20;
    meshes.scoopCoils = [];
    for(let i=0; i<scoopRings; i++) {
        const ringRadius = 1500 - Math.pow(i, 1.8) * 5; 
        const ringThickness = 20 + i * 2;
        const ringGeo = new THREE.TorusGeometry(ringRadius, ringThickness, 32, 100);
        const ringMat = i % 3 === 0 ? superheatedMetal : chrome;
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = i * 120;
        funnelGroup.add(ring);
        meshes.scoopCoils.push(ring);
        
        // Add glowing inner plasma constrainer
        if (i < scoopRings - 5) {
            const glowGeo = new THREE.TorusGeometry(ringRadius - ringThickness - 5, ringThickness * 0.5, 16, 64);
            const glow = new THREE.Mesh(glowGeo, plasmaBlueMaterial);
            ring.add(glow);
        }
    }
    
    // Funnel structural spokes connecting rings
    for(let i=0; i<scoopRings - 1; i++) {
        const r1 = 1500 - Math.pow(i, 1.8) * 5;
        const r2 = 1500 - Math.pow(i+1, 1.8) * 5;
        const z1 = i * 120;
        const z2 = (i+1) * 120;
        
        for(let j=0; j<12; j++) {
            const angle = (j / 12) * Math.PI * 2;
            const p1 = new THREE.Vector3(Math.cos(angle)*r1, Math.sin(angle)*r1, z1);
            const p2 = new THREE.Vector3(Math.cos(angle)*r2, Math.sin(angle)*r2, z2);
            
            const dist = p1.distanceTo(p2);
            const spokeGeo = new THREE.CylinderGeometry(5, 5, dist, 8);
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            
            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            spoke.position.copy(mid);
            spoke.lookAt(p2);
            spoke.rotateX(Math.PI/2);
            funnelGroup.add(spoke);
        }
    }
    
    group.add(funnelGroup);

    // --- Intake Manifold & Dark Matter Separator ---
    const manifoldGroup = new THREE.Group();
    manifoldGroup.position.set(0, 0, 500);
    
    const manifoldGeo = new THREE.CylinderGeometry(300, 600, 800, 64, 1, false);
    const manifoldMesh = new THREE.Mesh(manifoldGeo, steel);
    manifoldMesh.rotation.x = Math.PI / 2;
    manifoldGroup.add(manifoldMesh);

    // Intake spinning turbines
    meshes.turbines = [];
    for(let i=0; i<3; i++) {
        const turbineGeo = new THREE.CylinderGeometry(280 - i*20, 280 - i*20, 40, 32);
        const turbine = new THREE.Mesh(turbineGeo, chrome);
        turbine.position.z = -300 + i*150;
        turbine.rotation.x = Math.PI / 2;
        
        // Blades
        for(let j=0; j<24; j++) {
            const bladeGeo = new THREE.BoxGeometry(260 - i*20, 5, 30);
            const blade = new THREE.Mesh(bladeGeo, darkSteel);
            blade.position.x = (130 - i*10);
            blade.rotation.x = Math.PI / 6; // pitch
            
            const bladeHolder = new THREE.Group();
            bladeHolder.rotation.y = (j / 24) * Math.PI * 2;
            bladeHolder.add(blade);
            turbine.add(bladeHolder);
        }
        manifoldGroup.add(turbine);
        meshes.turbines.push(turbine);
    }
    
    group.add(manifoldGroup);

    // --- Central Fusion Reactor Containment ---
    const reactorGroup = new THREE.Group();
    reactorGroup.position.set(0, 0, 1500);

    // Outer spherical containment
    const containmentGeo = new THREE.SphereGeometry(500, 64, 64);
    const containmentMesh = new THREE.Mesh(containmentGeo, glass);
    containmentMesh.material.transparent = true;
    containmentMesh.material.opacity = 0.3;
    reactorGroup.add(containmentMesh);

    // Heavy Isotope confinement rings (nested)
    meshes.reactorRings = [];
    for(let i=0; i<5; i++) {
        const rGeo = new THREE.TorusGeometry(480 - i*30, 20, 16, 100);
        const rMesh = new THREE.Mesh(rGeo, steel);
        rMesh.rotation.x = Math.random() * Math.PI;
        rMesh.rotation.y = Math.random() * Math.PI;
        reactorGroup.add(rMesh);
        meshes.reactorRings.push({mesh: rMesh, speedX: Math.random()*0.02 - 0.01, speedY: Math.random()*0.02 - 0.01});
    }

    // The Fusion Plasma Core
    const coreGeo = new THREE.SphereGeometry(250, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeo, plasmaRedMaterial);
    reactorGroup.add(coreMesh);
    meshes.fusionCore = coreMesh;

    // Heat extraction pipes wrapping the reactor
    const heatPipes = createHydraulicLines(510, 1000, 50, 10);
    heatPipes.rotation.x = Math.PI/2;
    reactorGroup.add(heatPipes);

    group.add(reactorGroup);

    // --- Main Truss Backbone ---
    const backboneGroup = new THREE.Group();
    backboneGroup.position.set(0, 0, 3000);
    const backbone = createTruss(400, 3000, 15, 12);
    backboneGroup.add(backbone);

    // Add heavy isotope tanks along the backbone
    for(let i=0; i<8; i++) {
        for(let j=0; j<4; j++) {
            const tankGeo = new THREE.CylinderGeometry(80, 80, 250, 32);
            const tank = new THREE.Mesh(tankGeo, aluminum);
            const angle = (j / 4) * Math.PI * 2 + (i%2 * Math.PI/4);
            const rOffset = 500;
            tank.position.set(
                Math.cos(angle) * rOffset,
                Math.sin(angle) * rOffset,
                -1200 + i * 350
            );
            tank.rotation.x = Math.PI/2;
            
            // Neon indicators on tanks
            const neonGeo = new THREE.CylinderGeometry(82, 82, 20, 32);
            const neon = new THREE.Mesh(neonGeo, neonGreenMaterial);
            tank.add(neon);
            
            backboneGroup.add(tank);
        }
    }
    
    group.add(backboneGroup);

    // --- Secondary Laser Array (Dyson Beams for star-pushing) ---
    // The Caplan thruster uses a Bussard ramjet for the exhaust, but MUST push against the star 
    // to avoid just falling into it due to gravity. It does this by firing an immense laser beam at the star.
    const laserGroup = new THREE.Group();
    laserGroup.position.set(0, 0, -2500);
    
    // Laser Emitter Hub
    const hubGeo = new THREE.CylinderGeometry(800, 1000, 300, 64);
    const hubMesh = new THREE.Mesh(hubGeo, darkSteel);
    hubMesh.rotation.x = Math.PI / 2;
    laserGroup.add(hubMesh);

    meshes.laserBeams = [];
    meshes.laserEmitters = [];
    
    // Ring of massive laser emitters
    const numLasers = 8;
    for(let i=0; i<numLasers; i++) {
        const angle = (i / numLasers) * Math.PI * 2;
        const lX = Math.cos(angle) * 600;
        const lY = Math.sin(angle) * 600;
        
        // Emitter Canon
        const canonGeo = new THREE.CylinderGeometry(80, 120, 600, 32);
        const canon = new THREE.Mesh(canonGeo, steel);
        canon.position.set(lX, lY, -300);
        canon.rotation.x = Math.PI / 2;
        laserGroup.add(canon);
        meshes.laserEmitters.push(canon);

        // Actual Laser Beam pointing at star
        const beamGeo = new THREE.CylinderGeometry(40, 40, 8000, 32);
        // Pivot beam at bottom so we can scale it
        beamGeo.translate(0, 4000, 0); 
        const beam = new THREE.Mesh(beamGeo, laserBeamMaterial);
        beam.position.set(lX, lY, -600);
        beam.rotation.x = -Math.PI / 2;
        laserGroup.add(beam);
        meshes.laserBeams.push(beam);
    }

    group.add(laserGroup);

    // --- Exhaust Magnetic Nozzle ---
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(0, 0, 5000);
    
    // Bell shape using LatheGeometry
    const points = [];
    for ( let i = 0; i <= 50; i ++ ) {
        const x = 300 + Math.pow(i * 0.5, 2);
        const y = i * 40;
        points.push( new THREE.Vector2( x, y ) );
    }
    const nozzleGeo = new THREE.LatheGeometry( points, 64 );
    const nozzleMesh = new THREE.Mesh( nozzleGeo, chrome );
    // Needs to face +z
    nozzleMesh.rotation.x = Math.PI / 2;
    nozzleGroup.add(nozzleMesh);

    // Magnetic constriction rings outside nozzle
    for(let i=0; i<10; i++) {
        const r = 300 + Math.pow(i * 5 * 0.5, 2) + 50;
        const ringGeo = new THREE.TorusGeometry(r, 30, 16, 64);
        const ring = new THREE.Mesh(ringGeo, superheatedMetal);
        ring.position.z = i * 200;
        nozzleGroup.add(ring);
    }

    group.add(nozzleGroup);

    // --- Exhaust Plasma Plume ---
    const plumeGroup = new THREE.Group();
    plumeGroup.position.set(0, 0, 5000);
    
    meshes.plumeParticles = [];
    const plumeParticleCount = 300;
    const plumeGeo = new THREE.SphereGeometry(1, 16, 16);
    
    for(let i=0; i<plumeParticleCount; i++) {
        const particle = new THREE.Mesh(plumeGeo, plasmaRedMaterial);
        // Distribute within the bell
        resetPlumeParticle(particle);
        // Randomize initial Z so they fill the volume immediately
        particle.position.z = Math.random() * 8000; 
        plumeGroup.add(particle);
        meshes.plumeParticles.push(particle);
    }

    function resetPlumeParticle(p) {
        p.position.set(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            0
        );
        p.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            200 + Math.random() * 100
        );
        p.scale.set(50, 50, 200);
    }

    group.add(plumeGroup);

    // --- Command Citadel & Crew Habitat ---
    // A tiny speck compared to the engine, shielded heavily behind the intake
    const citadelGroup = new THREE.Group();
    citadelGroup.position.set(0, 900, 1000); // Ride on top of the intake manifold

    const habitatGeo = new THREE.TorusGeometry(150, 30, 32, 64);
    const habitat = new THREE.Mesh(habitatGeo, tinted);
    habitat.rotation.x = Math.PI / 2;
    citadelGroup.add(habitat);
    meshes.habitatRing = habitat;

    const citadelCoreGeo = new THREE.CylinderGeometry(80, 80, 200, 32);
    const citadelCore = new THREE.Mesh(citadelCoreGeo, steel);
    citadelGroup.add(citadelCore);

    // Shielding plate
    const shieldGeo = new THREE.BoxGeometry(600, 20, 600);
    const shield = new THREE.Mesh(shieldGeo, darkSteel);
    shield.position.z = -120;
    shield.rotation.x = Math.PI / 2;
    citadelGroup.add(shield);

    group.add(citadelGroup);

    // --- Massive Radiator Fins ---
    // To dissipate heat from fusion and lasers
    const radiatorGroup = new THREE.Group();
    radiatorGroup.position.set(0, 0, 1500); // Around reactor
    
    meshes.radiators = [];
    const numFins = 36;
    for(let i=0; i<numFins; i++) {
        const angle = (i / numFins) * Math.PI * 2;
        const finGeo = new THREE.BoxGeometry(20, 3000, 1200);
        // Shift geometry so origin is at bottom
        finGeo.translate(0, 1500, 0);
        
        const fin = new THREE.Mesh(finGeo, copper);
        fin.position.set(Math.cos(angle)*600, Math.sin(angle)*600, 0);
        fin.rotation.z = angle - Math.PI/2;
        
        // Heat pipes on fins
        const pipeGeo = new THREE.CylinderGeometry(10, 10, 2800, 8);
        const pipe = new THREE.Mesh(pipeGeo, superheatedMetal);
        pipe.position.set(15, 1500, 0);
        fin.add(pipe);

        radiatorGroup.add(fin);
        meshes.radiators.push(fin);
    }
    group.add(radiatorGroup);


    // ==========================================
    // 4. PARTS DEFINITION
    // ==========================================
    
    parts.push({
        name: "Bussard Scoop Magnetic Funnel",
        description: "A colossal array of superconducting electromagnets spanning thousands of kilometers. Generates a funnel-shaped magnetic field to gather solar wind (hydrogen and helium) directly from the star's corona.",
        material: "superheatedMetal / chrome / plasmaBlue",
        function: "Fuel Gathering & Star Interaction",
        assemblyOrder: 1,
        connections: ["Intake Manifold", "Star Stabilizer Ring"],
        failureEffect: "Loss of magnetic funnel. Solar wind ceases to be captured. Engine thrust drops to zero, and immense radiation bathes the structure.",
        cascadeFailures: ["Fusion Reactor Core Starvation", "Command Citadel Radiation Shield Overload"],
        originalPosition: funnelGroup.position.clone(),
        explodedPosition: funnelGroup.position.clone().add(new THREE.Vector3(0, 0, -3000))
    });

    parts.push({
        name: "Intake Manifold & Separator",
        description: "Massive turbines and magnetic separators that filter the captured solar wind, stripping away useless ions and directing pure hydrogen isotopes into the fusion core.",
        material: "steel / chrome / darkSteel",
        function: "Fuel Refinement",
        assemblyOrder: 2,
        connections: ["Bussard Scoop Magnetic Funnel", "Primary Fusion Reactor Containment"],
        failureEffect: "Impure fuel enters the reactor. Fusion reaction splutters and destabilizes. Potential for catastrophic thermal runaway.",
        cascadeFailures: ["Primary Fusion Reactor Containment Breach", "Exhaust Nozzle Erosion"],
        originalPosition: manifoldGroup.position.clone(),
        explodedPosition: manifoldGroup.position.clone().add(new THREE.Vector3(2000, 1000, -500))
    });

    parts.push({
        name: "Primary Fusion Reactor Containment",
        description: "A spherical shell encompassing the artificial sun powering the engine. Uses hyper-dense magnetic fields and graviton sheer to contain a continuous multi-terawatt thermonuclear detonation.",
        material: "glass / steel / plasmaRed",
        function: "Power Generation",
        assemblyOrder: 3,
        connections: ["Intake Manifold", "Main Truss Backbone", "Thermal Radiator Array"],
        failureEffect: "Containment breach. The artificial sun expands rapidly, instantly vaporizing the entire Caplan Thruster and nearby celestial bodies.",
        cascadeFailures: ["Absolute Structural Annihilation"],
        originalPosition: reactorGroup.position.clone(),
        explodedPosition: reactorGroup.position.clone().add(new THREE.Vector3(0, 3000, 0))
    });

    parts.push({
        name: "Thermal Radiator Array",
        description: "A vast array of copper-graphene composite fins stretching thousands of kilometers into space. Radiates the unimaginable waste heat of the fusion core to prevent the engine from melting itself.",
        material: "copper / superheatedMetal",
        function: "Heat Dissipation",
        assemblyOrder: 4,
        connections: ["Primary Fusion Reactor Containment"],
        failureEffect: "Heat accumulation. Superconducting magnets lose zero-resistance state. Entire engine melts into slag within 42 seconds.",
        cascadeFailures: ["Bussard Scoop Collapse", "Reactor Containment Breach"],
        originalPosition: radiatorGroup.position.clone(),
        explodedPosition: radiatorGroup.position.clone().add(new THREE.Vector3(0, -4000, 0))
    });

    parts.push({
        name: "Main Truss Backbone",
        description: "The structural spine of the Caplan Thruster. Forged from hyper-tensile carbon nanotubes and dark-matter infused steel. Transfers the unimaginable thrust from the nozzle to the rest of the engine.",
        material: "darkSteel / steel",
        function: "Structural Integrity",
        assemblyOrder: 5,
        connections: ["Primary Fusion Reactor Containment", "Exhaust Magnetic Nozzle"],
        failureEffect: "Structural shearing. The thruster nozzle rips itself free from the reactor, shooting off into deep space while the reactor is left behind to detonate.",
        cascadeFailures: ["Total Engine Decapitation"],
        originalPosition: backboneGroup.position.clone(),
        explodedPosition: backboneGroup.position.clone().add(new THREE.Vector3(-3000, 0, 1000))
    });

    parts.push({
        name: "Heavy Isotope Storage Tanks",
        description: "Vast reservoirs holding refined deuterium and tritium, alongside heavier catalytic elements. Used for reaction mass when solar wind capture is insufficient.",
        material: "aluminum / neonGreen",
        function: "Fuel Reserve",
        assemblyOrder: 6,
        connections: ["Main Truss Backbone"],
        failureEffect: "Fuel leak into space. Reduction of operational lifespan by millions of years.",
        cascadeFailures: ["Thruster Flame-Out"],
        originalPosition: backboneGroup.position.clone(),
        explodedPosition: backboneGroup.position.clone().add(new THREE.Vector3(-4000, -2000, 1000))
    });

    parts.push({
        name: "Dyson Laser Array Emitters",
        description: "A ring of apocalyptic-scale laser cannons aiming directly at the star. By firing at the star, they vaporize solar material, generating a localized solar flare. The reaction force pushes the engine forward, preventing it from falling into the star.",
        material: "steel / darkSteel / laserBeam",
        function: "Stellar Manipulation & Position Keeping",
        assemblyOrder: 7,
        connections: ["Bussard Scoop Magnetic Funnel"],
        failureEffect: "Loss of anti-gravity thrust. The Caplan Thruster succumbs to stellar gravity and slowly falls into the star, burning up in the photosphere.",
        cascadeFailures: ["Star Collision", "Complete Mission Failure"],
        originalPosition: laserGroup.position.clone(),
        explodedPosition: laserGroup.position.clone().add(new THREE.Vector3(3000, -3000, -1000))
    });

    parts.push({
        name: "Exhaust Magnetic Nozzle",
        description: "A monolithic bell of superconducting rings shaping the fusion plasma into a directed column of relativistic exhaust. Provides the primary thrust to move the entire star system over millions of years.",
        material: "chrome / superheatedMetal",
        function: "Thrust Vectoring",
        assemblyOrder: 8,
        connections: ["Main Truss Backbone", "Exhaust Plasma Plume"],
        failureEffect: "Thrust becomes omnidirectional. The engine spins wildly out of control, bombarding the target star system with relativistic plasma.",
        cascadeFailures: ["Planetary Sterilization", "Backbone Torsion Failure"],
        originalPosition: nozzleGroup.position.clone(),
        explodedPosition: nozzleGroup.position.clone().add(new THREE.Vector3(0, 0, 4000))
    });

    parts.push({
        name: "Exhaust Plasma Plume",
        description: "The macroscopic manifestation of thrust: a stream of fusion products moving at a significant fraction of the speed of light. Brighter than the star it orbits.",
        material: "plasmaRed",
        function: "Propulsion",
        assemblyOrder: 9,
        connections: ["Exhaust Magnetic Nozzle"],
        failureEffect: "Flame-out. The star system remains in its natural galactic orbit, destined for a supernova or black hole collision.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: plumeGroup.position.clone(),
        explodedPosition: plumeGroup.position.clone().add(new THREE.Vector3(0, 0, 8000))
    });

    parts.push({
        name: "Command Citadel & Crew Habitat",
        description: "A heavily shielded ring providing centrifugal gravity for the multi-generational crew of millions. Oversees engine telemetry and coordinates with the Dyson Swarm.",
        material: "tinted / steel / darkSteel",
        function: "Crew Housing & Engine Control",
        assemblyOrder: 10,
        connections: ["Intake Manifold"],
        failureEffect: "Loss of biological crew. AI must take over. Risk of rogue AI directing the star system into hostile galactic territory.",
        cascadeFailures: ["Navigational Errors", "Maintenance Deficits"],
        originalPosition: citadelGroup.position.clone(),
        explodedPosition: citadelGroup.position.clone().add(new THREE.Vector3(0, 4000, -2000))
    });

    // ==========================================
    // 5. QUIZ QUESTIONS
    // ==========================================

    const description = "The Caplan Thruster is a theoretical 'God Tier' megastructure and stellar engine. It utilizes the mass of a star to generate thrust, allowing a civilization to move their entire solar system across the galaxy. It works by capturing solar wind with a massive Bussard ramjet, fusing the hydrogen in an immense reactor, and firing the exhaust out of a magnetic nozzle. Simultaneously, a Dyson-sphere powered laser array fires back at the star to vaporize stellar matter, creating a localized thrust that keeps the engine hovering above the star without falling in due to gravity. Operating over millions of years, it can navigate a star system away from cosmic hazards like supernovae or galactic mergers.";

    const quizQuestions = [
        {
            question: "In the mechanics of a Caplan Thruster, what is the primary purpose of the secondary laser array firing at the star?",
            options: [
                "To mine heavy metals from the star's core.",
                "To trigger artificial solar flares, creating a reactionary force that prevents the thruster from falling into the star.",
                "To communicate with deep-space outposts via Morse code.",
                "To ignite the fusion reactor via stellar ignition."
            ],
            correctAnswer: 1,
            explanation: "The thruster is a massive object hovering near a star. To counteract the immense gravitational pull, the laser array heats the stellar surface, causing a plume of solar material to eject. This ejection acts as a rocket exhaust for the star itself, pushing against the thruster and keeping it suspended."
        },
        {
            question: "The Caplan Thruster utilizes a Bussard Ramjet concept. What is the fundamental mechanism of this ramjet?",
            options: [
                "Scooping interstellar dark matter via gravitational lenses.",
                "Using immense electromagnetic fields to funnel charged particles (solar wind) into a central collector for fusion fuel.",
                "Ramming a physical carbon-nanotube net through an asteroid belt.",
                "Absorbing cosmic microwave background radiation."
            ],
            correctAnswer: 1,
            explanation: "A Bussard Ramjet uses giant electromagnetic fields to act as a 'scoop', gathering diffuse charged particles (like hydrogen in solar wind or the interstellar medium) and compressing them until they can undergo nuclear fusion."
        },
        {
            question: "Why is an asymmetrical mass ejection (thrust) required for a stellar engine to move a solar system?",
            options: [
                "Because a symmetrical ejection would cause the star to spin out of control.",
                "Because the star is already moving too fast.",
                "Newton's Third Law: to accelerate the center of mass of the star system in a specific direction, mass or energy must be ejected preferentially in the opposite direction.",
                "Asymmetrical ejection looks cooler."
            ],
            correctAnswer: 2,
            explanation: "By conservation of momentum, the only way to alter the galactic trajectory of a star system is to eject mass or energy asymmetrically. The Caplan Thruster does this by directing a relativistic fusion plasma jet in one specific direction."
        },
        {
            question: "What limits the maximum acceleration of a star system moved by a Caplan Thruster?",
            options: [
                "The speed of light.",
                "The structural integrity of the thruster itself.",
                "The gravitational binding of the planetary system; accelerating too fast would strip the planets from their orbits.",
                "The amount of dark energy in the local sector."
            ],
            correctAnswer: 2,
            explanation: "If the star is accelerated too rapidly, its gravitational hold on the orbiting planets will not be strong enough to pull them along, causing the planetary system to be torn apart and left behind."
        },
        {
            question: "To power the lasers and contain the fusion, the Caplan Thruster relies on a Dyson Swarm. What is the relationship between the Dyson Swarm and the Thruster?",
            options: [
                "The Dyson Swarm provides the immense electrical power required to operate the thruster's electromagnetic scoops and lasers.",
                "The Dyson Swarm physically tows the thruster.",
                "The Dyson Swarm blocks the thrust to steer the ship.",
                "The Dyson Swarm is actually an enemy construct."
            ],
            correctAnswer: 0,
            explanation: "A Caplan Thruster is an active stellar engine that requires unimaginable amounts of energy to run its containment fields and stellar lasers. This energy is harvested by a Dyson Swarm (a vast array of solar collectors) orbiting the star and beaming power to the thruster."
        }
    ];

    // ==========================================
    // 6. ANIMATION LOOP
    // ==========================================

    function animate(time, speed, meshesObj) {
        // Star pulsation
        if (meshesObj.star) {
            meshesObj.star.rotation.y = time * 0.05 * speed;
            const pulse = Math.sin(time * 2) * 0.1 + 1.0;
            meshesObj.star.scale.set(pulse, pulse, pulse);
            meshesObj.star.material.emissiveIntensity = 2.0 + Math.sin(time * 3) * 0.5;
        }

        // Intake turbines spinning rapidly
        if (meshesObj.turbines) {
            meshesObj.turbines.forEach((turbine, i) => {
                turbine.rotation.y += speed * 0.5 * (i % 2 === 0 ? 1 : -1);
            });
        }

        // Reactor rings chaotic rotation
        if (meshesObj.reactorRings) {
            meshesObj.reactorRings.forEach(ringData => {
                ringData.mesh.rotation.x += ringData.speedX * speed * 20;
                ringData.mesh.rotation.y += ringData.speedY * speed * 20;
            });
        }

        // Fusion core pulsing
        if (meshesObj.fusionCore) {
            const coreScale = 1.0 + Math.sin(time * 10) * 0.05;
            meshesObj.fusionCore.scale.set(coreScale, coreScale, coreScale);
            meshesObj.fusionCore.material.emissiveIntensity = 6.0 + Math.random() * 2.0;
        }

        // Scoop coils energy flow (scaling glow)
        if (meshesObj.scoopCoils) {
            meshesObj.scoopCoils.forEach((coil, i) => {
                const offsetTime = time * 5 - i * 0.5;
                if (coil.children.length > 0) {
                    const glowScale = 1.0 + Math.max(0, Math.sin(offsetTime)) * 0.2;
                    coil.children[0].scale.set(glowScale, glowScale, glowScale);
                }
            });
        }

        // Habitat ring gentle rotation
        if (meshesObj.habitatRing) {
            meshesObj.habitatRing.rotation.z += 0.01 * speed;
        }

        // Laser beam pulsing (firing at star)
        if (meshesObj.laserBeams) {
            meshesObj.laserBeams.forEach((beam, i) => {
                const firePhase = (time * 10 + i) % 10; // Staggered firing
                if (firePhase < 2) {
                    beam.scale.set(1.5, 1, 1.5);
                    beam.material.emissiveIntensity = 15.0;
                    beam.visible = true;
                } else if (firePhase < 3) {
                    beam.scale.set(0.5, 1, 0.5);
                    beam.material.emissiveIntensity = 5.0;
                } else {
                    beam.visible = false;
                }
            });
        }

        // Exhaust plume particle simulation (relativistic speeds)
        if (meshesObj.plumeParticles) {
            meshesObj.plumeParticles.forEach(p => {
                // Move particle along Z axis heavily, slight X/Y expansion
                p.position.addScaledVector(p.userData.velocity, speed);
                
                // Expand scale slightly as it moves out
                p.scale.x += speed * 2;
                p.scale.y += speed * 2;
                
                // Fade out based on distance
                const dist = p.position.z;
                if (dist > 15000) {
                    resetPlumeParticle(p);
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
