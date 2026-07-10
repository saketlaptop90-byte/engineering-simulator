import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER BIRCH PLANET MEGASTRUCTURE
 * -----------------------------------
 * A Birch Planet is a theoretical megastructure constructed around a supermassive black hole.
 * The concept envisions a multi-layered shell world of unimaginable scale, where gravity is
 * managed via the black hole's mass and active support structures (orbital rings/mass streams).
 * 
 * Features:
 * - Supermassive Black Hole Event Horizon & Photon Sphere
 * - Multi-layered glowing accretion disk (instanced particle swarm + gaseous rings)
 * - Relativistic Polar Jets
 * - Inner Energy Harvesting Dyson Swarm
 * - Artificial Suns in precise orbits
 * - Inner Habitat Shell (Inside-out world with hexagonal mega-continents)
 * - Atmospheric Containment & Cloud Layers
 * - Massive Inter-shell Transit Elevators & Hydraulic-like Struts
 * - Mid-level Structural Framework
 * - Outer Armored Hull with Macroscopic Cooling Radiators
 * 
 * Author: Swarm Intelligence
 * Date: 2026
 */
export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // 1. DIMENSIONAL CONSTANTS & SCALE
    // ==========================================
    const SCALE_FACTOR = 1.0;
    const R_EH = 20 * SCALE_FACTOR;              // Event Horizon Radius
    const R_PHOTON = 23 * SCALE_FACTOR;          // Photon Sphere
    const R_DISK_IN = 28 * SCALE_FACTOR;         // Accretion Disk Inner Edge
    const R_DISK_OUT = 80 * SCALE_FACTOR;        // Accretion Disk Outer Edge
    const R_HARVESTERS = 85 * SCALE_FACTOR;      // Energy Harvester Swarm Radius
    const R_SUNS = 105 * SCALE_FACTOR;           // Artificial Sun Orbit
    const R_CLOUD = 135 * SCALE_FACTOR;          // Atmospheric Cloud Layer
    const R_HABITAT = 140 * SCALE_FACTOR;        // Inner Habitat Shell
    const R_MID = 165 * SCALE_FACTOR;            // Structural Shell
    const R_OUTER = 190 * SCALE_FACTOR;          // Outer Armor Shell

    // ==========================================
    // 2. CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const matEventHorizon = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.FrontSide
    });

    const matPhotonRing = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const matAccretionGas = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const matAccretionHot = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0088ff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const matJet = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x0066ff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const matSun = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa33,
        emissiveIntensity: 10.0
    });

    const matHabitatBase = new THREE.MeshStandardMaterial({
        color: 0x112211,
        roughness: 0.8,
        metalness: 0.2,
        side: THREE.BackSide // Inside facing
    });

    const matAtmosphere = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const matCloud = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
        roughness: 1.0
    });

    const matNeonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 4.0
    });

    const matNeonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xcc0000,
        emissiveIntensity: 3.0
    });

    // We will also use imported materials for structural parts
    const matStrut = darkSteel;
    const matArmor = steel;
    const matGlass = tinted;
    const matHarvester = copper;

    // ==========================================
    // 3. UTILITY MATH FUNCTIONS
    // ==========================================
    const dummyObj = new THREE.Object3D();
    const vec3 = new THREE.Vector3();
    const upVec = new THREE.Vector3(0, 1, 0);

    // Distribute points evenly on a sphere using Fibonacci spiral
    function fibonacciSphere(samples, radius) {
        const points = [];
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        for (let i = 0; i < samples; i++) {
            const y = 1 - (i / (samples - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
        }
        return points;
    }

    // Random point within a disk
    function randomDiskPoint(rMin, rMax) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * (rMax - rMin) + rMin;
        return new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta));
    }

    // Align an object to face the origin (for inner shell structures)
    function alignToOrigin(matrix, position) {
        dummyObj.position.copy(position);
        dummyObj.lookAt(0, 0, 0);
        // Sometimes we need it to point exactly away or towards.
        // The default lookAt points the -Z axis towards target.
        // We might want +Y towards target (e.g., for cylinders).
        dummyObj.rotateX(Math.PI / 2);
        dummyObj.updateMatrix();
        matrix.copy(dummyObj.matrix);
    }

    // Align object radially outwards
    function alignOutwards(matrix, position) {
        dummyObj.position.copy(position);
        // Look away from origin
        vec3.copy(position).multiplyScalar(2);
        dummyObj.lookAt(vec3);
        dummyObj.rotateX(Math.PI / 2);
        dummyObj.updateMatrix();
        matrix.copy(dummyObj.matrix);
    }

    // ==========================================
    // 4. CENTRAL SINGULARITY & PHOTON SPHERE
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The Event Horizon
    const geoEventHorizon = new THREE.SphereGeometry(R_EH, 64, 64);
    const meshEventHorizon = new THREE.Mesh(geoEventHorizon, matEventHorizon);
    coreGroup.add(meshEventHorizon);

    // The Photon Sphere (Light bending region)
    const geoPhotonSphere = new THREE.SphereGeometry(R_PHOTON, 64, 64);
    const meshPhotonSphere = new THREE.Mesh(geoPhotonSphere, matPhotonRing);
    coreGroup.add(meshPhotonSphere);

    group.add(coreGroup);

    parts.push({
        name: 'Event Horizon Core',
        description: 'The physical boundary of the supermassive black hole. Mass equivalent to 1.5 trillion solar masses. Gravity here is infinite; space and time swap roles.',
        material: 'Vantablack / Perfect Absorber',
        function: 'Anchor for the entire megastructure, providing immense gravitational pull required to hold the structural shells in place.',
        assemblyOrder: 1,
        connections: ['Accretion Disk', 'Gravimetric Stabilizers'],
        failureEffect: 'Spaghettification of the entire sector.',
        cascadeFailures: ['Complete Structural Collapse', 'Time Dilation Anomalies'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // ==========================================
    // 5. ACCRETION DISK (Particle Swarm + Gas Rings)
    // ==========================================
    const diskGroup = new THREE.Group();
    
    // Gaseous Inner Ring (Superheated, X-ray emitting)
    const geoDiskInner = new THREE.TorusGeometry((R_DISK_IN + R_DISK_OUT*0.4)/2, (R_DISK_OUT*0.4 - R_DISK_IN)/2, 16, 128);
    // Flatten it
    geoDiskInner.scale(1, 0.05, 1);
    const meshDiskInner = new THREE.Mesh(geoDiskInner, matAccretionHot);
    diskGroup.add(meshDiskInner);

    // Gaseous Outer Ring (Cooler, Orange/Red)
    const geoDiskOuter = new THREE.RingGeometry(R_DISK_OUT * 0.4, R_DISK_OUT, 128);
    // Rotate ring to lie flat on XZ plane
    geoDiskOuter.rotateX(-Math.PI / 2);
    const meshDiskOuter = new THREE.Mesh(geoDiskOuter, matAccretionGas);
    diskGroup.add(meshDiskOuter);

    // Accretion Particle Swarm (Asteroids, gas clumps)
    const NUM_ACCRETION_PARTICLES = 15000;
    const geoAccretionParticle = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const instAccretionParticles = new THREE.InstancedMesh(geoAccretionParticle, matAccretionHot, NUM_ACCRETION_PARTICLES);
    
    // Store particle data for animation
    const accretionParticleData = [];

    for (let i = 0; i < NUM_ACCRETION_PARTICLES; i++) {
        const isHot = Math.random() < 0.3;
        // Distribution biased towards inner radius
        const radius = R_DISK_IN + Math.pow(Math.random(), 2) * (R_DISK_OUT - R_DISK_IN);
        const theta = Math.random() * Math.PI * 2;
        // Disk thickness varies with radius (thicker at outside)
        const ySpread = (radius / R_DISK_OUT) * 3.0;
        const y = (Math.random() - 0.5) * ySpread;

        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);

        dummyObj.position.set(x, y, z);
        // Random rotation
        dummyObj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        // Random scale
        const s = Math.random() * 2.0 + 0.5;
        dummyObj.scale.set(s, s, s);
        dummyObj.updateMatrix();

        instAccretionParticles.setMatrixAt(i, dummyObj.matrix);
        
        // Save Keplerian orbital speed (v ~ 1/sqrt(r))
        const speed = Math.sqrt(1000 / radius) * 0.02; 
        accretionParticleData.push({
            angle: theta,
            radius: radius,
            y: y,
            speed: speed,
            rotSpeed: new THREE.Vector3(Math.random()*0.1, Math.random()*0.1, Math.random()*0.1)
        });

        // Color override for outer particles
        if (!isHot && radius > R_DISK_OUT * 0.5) {
            instAccretionParticles.setColorAt(i, new THREE.Color(0xff6600));
        } else {
            instAccretionParticles.setColorAt(i, new THREE.Color(0x00ffff));
        }
    }
    instAccretionParticles.instanceMatrix.needsUpdate = true;
    if (instAccretionParticles.instanceColor) instAccretionParticles.instanceColor.needsUpdate = true;
    diskGroup.add(instAccretionParticles);

    // Tilt the entire disk slightly for aesthetics
    diskGroup.rotation.x = Math.PI * 0.05;
    diskGroup.rotation.z = Math.PI * 0.02;
    group.add(diskGroup);

    parts.push({
        name: 'Relativistic Accretion Disk',
        description: 'A swirling mass of superheated plasma, dust, and planetary debris falling into the gravity well. Generates hard X-rays and immense thermal energy.',
        material: 'Plasma / Degenerate Matter',
        function: 'Primary power source for the Birch Planet. Energy is extracted via magnetic tapping and Penrose processes.',
        assemblyOrder: 2,
        connections: ['Event Horizon', 'Dyson Swarm Harvesters'],
        failureEffect: 'Loss of 99% of habitat power; thermal runaway in inner shells.',
        cascadeFailures: ['Habitat Freezing', 'Atmospheric Collapse'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // ==========================================
    // 6. RELATIVISTIC POLAR JETS
    // ==========================================
    const geoJet = new THREE.CylinderGeometry(0.5, 15, 300, 32, 1, true);
    geoJet.translate(0, 150, 0); // Move origin to base

    const jetNorth = new THREE.Mesh(geoJet, matJet);
    diskGroup.add(jetNorth); // Attach to disk so it tilts with it

    const jetSouth = new THREE.Mesh(geoJet, matJet);
    jetSouth.rotation.x = Math.PI; // Point down
    diskGroup.add(jetSouth);

    parts.push({
        name: 'Polar Astrophysical Jets',
        description: 'Twin beams of ionized matter ejected at 0.99c from the black hole poles due to twisted magnetic fields.',
        material: 'High-Energy Plasma',
        function: 'Exhaust mechanism for angular momentum. Tapped for exotic antimatter production.',
        assemblyOrder: 3,
        connections: ['Accretion Disk'],
        failureEffect: 'Magnetic field reconnection events damaging inner harvester rings.',
        cascadeFailures: ['EMP Surges', 'Harvester Vaporization'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -200, z: 0}
    });

    // ==========================================
    // 7. DYSON ENERGY HARVESTERS
    // ==========================================
    const NUM_HARVESTERS = 300;
    const geoHarvester = new THREE.TorusKnotGeometry(2, 0.5, 64, 8);
    const instHarvesters = new THREE.InstancedMesh(geoHarvester, matHarvester, NUM_HARVESTERS);
    const harvesterData = [];

    for (let i = 0; i < NUM_HARVESTERS; i++) {
        // Distribute in a spherical swarm around the poles and disk edge
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        // Push away from the exact equator to avoid the densest part of the disk
        let r = R_HARVESTERS + (Math.random() * 10 - 5);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        dummyObj.position.set(x, y, z);
        dummyObj.lookAt(0, 0, 0);
        dummyObj.updateMatrix();
        instHarvesters.setMatrixAt(i, dummyObj.matrix);

        harvesterData.push({
            basePos: new THREE.Vector3(x, y, z),
            phase: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.01,
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        });
    }
    instHarvesters.instanceMatrix.needsUpdate = true;
    group.add(instHarvesters);

    parts.push({
        name: 'Dyson Harvester Swarm',
        description: 'A cloud of magnetically-shielded collector nodes orbiting within the high-radiation zone.',
        material: 'Hyper-Copper / Graphene Composite',
        function: 'Transmits multi-petawatt power beams to the inner shell via microwave and laser links.',
        assemblyOrder: 4,
        connections: ['Habitat Power Grid'],
        failureEffect: 'Brownouts across continental sectors.',
        cascadeFailures: ['Life Support Strain'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -100}
    });

    // ==========================================
    // 8. ARTIFICIAL SUNS
    // ==========================================
    const NUM_SUNS = 6;
    const sunsGroup = new THREE.Group();
    const sunData = [];
    
    // Core of the sun
    const geoSunCore = new THREE.IcosahedronGeometry(3, 4);
    // Harness rings around the sun
    const geoSunRing = new THREE.TorusGeometry(4.5, 0.2, 16, 64);

    for (let i = 0; i < NUM_SUNS; i++) {
        const sunLocalGroup = new THREE.Group();
        
        const sunMesh = new THREE.Mesh(geoSunCore, matSun);
        sunLocalGroup.add(sunMesh);

        const ring1 = new THREE.Mesh(geoSunRing, matNeonBlue);
        ring1.rotation.x = Math.PI / 2;
        sunLocalGroup.add(ring1);

        const ring2 = new THREE.Mesh(geoSunRing, matNeonBlue);
        ring2.rotation.y = Math.PI / 2;
        sunLocalGroup.add(ring2);

        // Calculate initial orbit position
        const angle = (i / NUM_SUNS) * Math.PI * 2;
        sunLocalGroup.position.set(Math.cos(angle) * R_SUNS, 0, Math.sin(angle) * R_SUNS);

        sunsGroup.add(sunLocalGroup);

        sunData.push({
            group: sunLocalGroup,
            angle: angle,
            speed: 0.002, // Very slow orbit
            ring1: ring1,
            ring2: ring2
        });
    }
    // Tilt the sun orbits relative to the disk and equator
    sunsGroup.rotation.x = -Math.PI * 0.1;
    group.add(sunsGroup);

    parts.push({
        name: 'Artificial Stellar Engines',
        description: 'Compact fusion reactors encapsulated in spatial-distortion harnesses. They emit tailored spectrum light for the habitat.',
        material: 'Degenerate Hydrogen / Chromatic Glass',
        function: 'Provides natural daylight cycles, photosynthesis energy, and thermal regulation for the inner habitat.',
        assemblyOrder: 5,
        connections: ['Orbital Trackers', 'Inner Shell Atmosphere'],
        failureEffect: 'Localized eternal night and rapid freezing.',
        cascadeFailures: ['Ecological Death in Sector'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 150, y: 0, z: 150}
    });

    // ==========================================
    // 9. INNER HABITAT SHELL
    // ==========================================
    const habitatGroup = new THREE.Group();

    // Base continuous shell (Inside Out)
    const geoHabitatBase = new THREE.IcosahedronGeometry(R_HABITAT, 8); // High poly
    const meshHabitatBase = new THREE.Mesh(geoHabitatBase, matHabitatBase);
    habitatGroup.add(meshHabitatBase);

    // Continental Hex-Plates (Greebling on the inside)
    const NUM_PLATES = 6000;
    // We make a cylinder acting as a hex plate. 
    // It will be placed on the inner surface, pointing INWARDS.
    const geoPlate = new THREE.CylinderGeometry(1.5, 1.5, 1.0, 6);
    // Move origin to the bottom face so it sits perfectly on the shell
    geoPlate.translate(0, 0.5, 0); 
    
    // Create diverse materials for continents (cities, forests, oceans)
    // Using instanced mesh with vertex colors
    const instPlates = new THREE.InstancedMesh(geoPlate, new THREE.MeshStandardMaterial({
        roughness: 0.9,
        metalness: 0.1,
        color: 0xffffff
    }), NUM_PLATES);

    const platePoints = fibonacciSphere(NUM_PLATES, R_HABITAT);
    
    // Perlin noise substitute using sine waves for procedural terrain generation
    function getTerrainType(x, y, z) {
        const nx = x / R_HABITAT;
        const ny = y / R_HABITAT;
        const nz = z / R_HABITAT;
        const noise = Math.sin(nx * 10) * Math.cos(ny * 10) + Math.sin(nz * 15);
        if (noise > 0.5) return 'city';
        if (noise > -0.2) return 'forest';
        return 'ocean';
    }

    const colorCity = new THREE.Color(0xaaaaaa);
    const colorForest = new THREE.Color(0x114411);
    const colorOcean = new THREE.Color(0x112255);

    for (let i = 0; i < NUM_PLATES; i++) {
        const pt = platePoints[i];
        
        // Align facing inwards. 
        alignToOrigin(dummyObj.matrix, pt);
        
        // Vary height based on terrain
        const terrain = getTerrainType(pt.x, pt.y, pt.z);
        let scaleY = 1.0;
        let c = colorOcean;

        if (terrain === 'city') {
            scaleY = 2.0 + Math.random() * 3.0; // skyscrapers/megacities
            c = colorCity;
            if (Math.random() < 0.1) c = new THREE.Color(0xffff00); // glowing city lights
        } else if (terrain === 'forest') {
            scaleY = 1.2 + Math.random() * 0.5;
            c = colorForest;
        } else {
            scaleY = 0.5; // depressed ocean basin
        }

        dummyObj.scale.set(1, scaleY, 1);
        dummyObj.updateMatrix();
        
        instPlates.setMatrixAt(i, dummyObj.matrix);
        instPlates.setColorAt(i, c);
    }
    instPlates.instanceMatrix.needsUpdate = true;
    instPlates.instanceColor.needsUpdate = true;
    habitatGroup.add(instPlates);

    // Add glowing transit rivers/highways on the surface
    const NUM_HIGHWAYS = 1000;
    const geoHighway = new THREE.BoxGeometry(0.2, 2.5, 4.0); // Taller than plates
    geoHighway.translate(0, 1.25, 0);
    const instHighways = new THREE.InstancedMesh(geoHighway, matNeonBlue, NUM_HIGHWAYS);
    for (let i = 0; i < NUM_HIGHWAYS; i++) {
        // Pick a random plate position
        const idx = Math.floor(Math.random() * NUM_PLATES);
        const pt = platePoints[idx];
        alignToOrigin(dummyObj.matrix, pt);
        // Random rotation on the surface
        dummyObj.rotateY(Math.random() * Math.PI);
        dummyObj.updateMatrix();
        instHighways.setMatrixAt(i, dummyObj.matrix);
    }
    instHighways.instanceMatrix.needsUpdate = true;
    habitatGroup.add(instHighways);

    group.add(habitatGroup);

    parts.push({
        name: 'Inner Biosphere Shell',
        description: 'The primary living area. Surface area equivalent to 4 billion Earths. Centripetal gravity is supplemented by localized graviton generators.',
        material: 'Programmable Matter / Biome Substrates',
        function: 'Sustains trillions of lifeforms across highly engineered ecosystem patches.',
        assemblyOrder: 6,
        connections: ['Atmospheric Field', 'Mid-Shell Struts'],
        failureEffect: 'Atmospheric venting, catastrophic gravity shearing.',
        cascadeFailures: ['Mass Extinction'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 300, z: 0}
    });

    // ==========================================
    // 10. ATMOSPHERIC CONTAINMENT & CLOUDS
    // ==========================================
    // The atmosphere is held *inside* the habitat shell
    const geoAtmosphere = new THREE.IcosahedronGeometry(R_HABITAT - 1, 8);
    const meshAtmosphere = new THREE.Mesh(geoAtmosphere, matAtmosphere);
    group.add(meshAtmosphere);

    const geoClouds = new THREE.IcosahedronGeometry(R_CLOUD, 6);
    // Deform the cloud sphere slightly to make it lumpy
    const posAttribute = geoClouds.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const u = posAttribute.getX(i);
        const v = posAttribute.getY(i);
        const w = posAttribute.getZ(i);
        const noise = Math.sin(u * 0.1) * Math.cos(v * 0.1) * Math.sin(w * 0.1);
        posAttribute.setXYZ(i, u + noise * 2, v + noise * 2, w + noise * 2);
    }
    geoClouds.computeVertexNormals();
    const meshClouds = new THREE.Mesh(geoClouds, matCloud);
    group.add(meshClouds);

    parts.push({
        name: 'Atmospheric Containment Field',
        description: 'A 500km thick layer of breathable gas held against the inner shell by artificial gravity and electromagnetic shields.',
        material: 'Nitrogen-Oxygen Mix / Plasma Shielding',
        function: 'Provides life support and radiation filtering from the central singularity.',
        assemblyOrder: 7,
        connections: ['Biosphere Shell', 'Artificial Suns'],
        failureEffect: 'Vacuum exposure to the inner surface.',
        cascadeFailures: ['Complete biological eradication'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // ==========================================
    // 11. MID STRUCTURAL SHELL & MACRO-STRUTS
    // ==========================================
    const midGroup = new THREE.Group();

    // The Mid Shell Framework (Wireframe-like)
    const geoMid = new THREE.IcosahedronGeometry(R_MID, 4);
    const edgesMid = new THREE.EdgesGeometry(geoMid);
    // Using LineSegments for a high-tech blueprint look, or thin cylinders. We'll use tubes for thickness.
    // Instead of heavy TubeGeometry for all edges, we use LineSegments with a glowing material
    const matMidWire = new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 2 });
    const meshMidWire = new THREE.LineSegments(edgesMid, matMidWire);
    midGroup.add(meshMidWire);

    // MACRO STRUTS connecting Inner Habitat (R_HABITAT) to Mid Shell (R_MID)
    const NUM_STRUTS = 2500;
    const strutLength = R_MID - R_HABITAT;
    // Cylinder centered at origin. We will shift it so its base is at R_HABITAT
    const geoStrut = new THREE.CylinderGeometry(1.5, 2.5, strutLength, 8);
    geoStrut.translate(0, strutLength / 2, 0); 

    const instStruts = new THREE.InstancedMesh(geoStrut, matStrut, NUM_STRUTS);
    const strutPoints = fibonacciSphere(NUM_STRUTS, R_HABITAT);

    for (let i = 0; i < NUM_STRUTS; i++) {
        const pt = strutPoints[i];
        alignOutwards(dummyObj.matrix, pt);
        instStruts.setMatrixAt(i, dummyObj.matrix);
    }
    instStruts.instanceMatrix.needsUpdate = true;
    midGroup.add(instStruts);

    // TRANSIT ELEVATORS (Glowing tubes interspersed among struts)
    const NUM_ELEVATORS = 400;
    const geoElevator = new THREE.CylinderGeometry(0.8, 0.8, strutLength, 6);
    geoElevator.translate(0, strutLength / 2, 0);
    const instElevators = new THREE.InstancedMesh(geoElevator, matNeonRed, NUM_ELEVATORS);
    
    // We just pick a subset of the strut points to also have an elevator alongside
    for (let i = 0; i < NUM_ELEVATORS; i++) {
        const pt = strutPoints[i * 6]; // pick every 6th point roughly
        // Offset slightly from the strut
        const offsetPt = pt.clone().multiplyScalar(1.01);
        alignOutwards(dummyObj.matrix, offsetPt);
        instElevators.setMatrixAt(i, dummyObj.matrix);
    }
    instElevators.instanceMatrix.needsUpdate = true;
    midGroup.add(instElevators);

    group.add(midGroup);

    parts.push({
        name: 'Macro-Strut Supports & Transit Network',
        description: 'Trillions of tons of active-support hydraulic pillars that prevent the shells from collapsing into the black hole. Contains high-speed vacuum transit tubes.',
        material: 'Carbon Nanotube / Degenerate Matter Cores',
        function: 'Maintains structural integrity against extreme gravitational shearing. Facilitates inter-shell logistics.',
        assemblyOrder: 8,
        connections: ['Inner Shell', 'Mid Shell', 'Outer Shell'],
        failureEffect: 'Localized shell collapse, millions of casualties.',
        cascadeFailures: ['Global Buckling', 'Total structural pancake'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -300, y: 0, z: 0}
    });

    // ==========================================
    // 12. OUTER ARMOR SHELL & RADIATORS
    // ==========================================
    const outerGroup = new THREE.Group();

    // Base outer shell (highly tessellated)
    const geoOuter = new THREE.IcosahedronGeometry(R_OUTER, 10);
    const meshOuter = new THREE.Mesh(geoOuter, matArmor);
    // Add wireframe over it to simulate panel gaps
    const edgesOuter = new THREE.EdgesGeometry(geoOuter);
    const meshOuterWire = new THREE.LineSegments(edgesOuter, new THREE.LineBasicMaterial({ color: 0x111111 }));
    outerGroup.add(meshOuter);
    outerGroup.add(meshOuterWire);

    // MACRO RADIATORS (Fins sticking out into space)
    const NUM_RADIATORS = 800;
    const radHeight = 30;
    const geoRadiator = new THREE.BoxGeometry(0.5, radHeight, 15);
    geoRadiator.translate(0, radHeight / 2, 0);
    const instRadiators = new THREE.InstancedMesh(geoRadiator, matNeonRed, NUM_RADIATORS);
    
    const radPoints = fibonacciSphere(NUM_RADIATORS, R_OUTER);
    for (let i = 0; i < NUM_RADIATORS; i++) {
        const pt = radPoints[i];
        alignOutwards(dummyObj.matrix, pt);
        // Random spin around local Y
        dummyObj.rotateY(Math.random() * Math.PI);
        dummyObj.updateMatrix();
        instRadiators.setMatrixAt(i, dummyObj.matrix);
    }
    instRadiators.instanceMatrix.needsUpdate = true;
    outerGroup.add(instRadiators);

    // DEFLECTOR SHIELD GENERATORS (Glowing nodes on outer shell)
    const NUM_SHIELDS = 200;
    const geoShield = new THREE.SphereGeometry(3, 16, 16);
    // Sink it halfway into the shell
    geoShield.translate(0, 0, 0);
    const instShields = new THREE.InstancedMesh(geoShield, matNeonBlue, NUM_SHIELDS);
    
    for (let i = 0; i < NUM_SHIELDS; i++) {
        const pt = radPoints[i * 4]; // Subset of radiator points
        alignOutwards(dummyObj.matrix, pt);
        instShields.setMatrixAt(i, dummyObj.matrix);
    }
    instShields.instanceMatrix.needsUpdate = true;
    outerGroup.add(instShields);

    group.add(outerGroup);

    parts.push({
        name: 'Outer Armored Hull & Thermal Radiators',
        description: 'The exterior of the Birch Planet, facing deep space. Armored against hyper-velocity impacts and armed with massive heat rejection fins.',
        material: 'Neutronium Plating / Graphene Radiators',
        function: 'Protects the interior from astrophysical phenomena. Dissipates the immense waste heat generated by the inner biosphere and singularity tapping.',
        assemblyOrder: 9,
        connections: ['Mid Shell'],
        failureEffect: 'Thermal runaway inside the habitat; cooking the biosphere.',
        cascadeFailures: ['Habitat Vaporization'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -400, z: 0}
    });

    // ==========================================
    // 13. ANIMATION LOGIC
    // ==========================================
    let timeElapsed = 0;

    function animate(time, speed, meshes) {
        timeElapsed += speed;

        // 1. Accretion Disk Rotation
        // The disk rotates rapidly, but differential rotation (inner faster than outer)
        diskGroup.rotation.y = timeElapsed * 0.05;

        // Animate individual particles in the accretion disk for differential Keplerian orbit
        for (let i = 0; i < NUM_ACCRETION_PARTICLES; i++) {
            const data = accretionParticleData[i];
            data.angle -= data.speed * speed; // Orbit
            
            const x = data.radius * Math.cos(data.angle);
            const z = data.radius * Math.sin(data.angle);
            
            dummyObj.position.set(x, data.y, z);
            // Spin particle on its own axis
            dummyObj.rotation.x += data.rotSpeed.x * speed;
            dummyObj.rotation.y += data.rotSpeed.y * speed;
            dummyObj.rotation.z += data.rotSpeed.z * speed;
            dummyObj.updateMatrix();
            
            instAccretionParticles.setMatrixAt(i, dummyObj.matrix);
        }
        instAccretionParticles.instanceMatrix.needsUpdate = true;

        // 2. Pulse the Photon Sphere
        const pulse = Math.sin(timeElapsed * 2.0) * 0.5 + 0.5;
        matPhotonRing.opacity = 0.1 + pulse * 0.15;
        matPhotonRing.emissiveIntensity = 4.0 + pulse * 3.0;

        // 3. Dyson Harvesters Swarm movement
        for (let i = 0; i < NUM_HARVESTERS; i++) {
            const data = harvesterData[i];
            data.phase += data.speed * speed;
            // Oscillate position slightly along their local axis
            const offset = Math.sin(data.phase) * 2.0;
            const pos = data.basePos.clone().add(data.axis.clone().multiplyScalar(offset));
            
            dummyObj.position.copy(pos);
            dummyObj.lookAt(0, 0, 0);
            dummyObj.rotateZ(data.phase * 2.0); // Spin harvester
            dummyObj.updateMatrix();
            instHarvesters.setMatrixAt(i, dummyObj.matrix);
        }
        instHarvesters.instanceMatrix.needsUpdate = true;

        // 4. Orbit Artificial Suns
        for (let i = 0; i < NUM_SUNS; i++) {
            const data = sunData[i];
            data.angle += data.speed * speed;
            data.group.position.set(
                Math.cos(data.angle) * R_SUNS,
                Math.sin(data.angle * 2) * 5, // Slight bobbing up and down
                Math.sin(data.angle) * R_SUNS
            );
            // Spin the sun harness rings
            data.ring1.rotation.y += 0.05 * speed;
            data.ring2.rotation.x += 0.04 * speed;
        }

        // 5. Cloud Layer dynamics
        meshClouds.rotation.y = timeElapsed * -0.002;
        meshClouds.rotation.z = timeElapsed * 0.001;
        // Pulse cloud opacity to simulate weather patterns
        matCloud.opacity = 0.3 + Math.sin(timeElapsed * 0.5) * 0.1;

        // 6. Slowly rotate the outer structural shells
        midGroup.rotation.y = timeElapsed * 0.0005;
        midGroup.rotation.x = Math.sin(timeElapsed * 0.0001) * 0.02; // Tiny wobble

        outerGroup.rotation.y = timeElapsed * 0.0005;
        outerGroup.rotation.x = Math.sin(timeElapsed * 0.0001) * 0.02;

        // 7. Pulse Transit Elevators
        const elevatorPulse = (Math.sin(timeElapsed * 5.0) + 1.0) / 2.0;
        matNeonRed.emissiveIntensity = 2.0 + elevatorPulse * 5.0;
    }

    // ==========================================
    // 14. QUIZ QUESTIONS (PhD Level)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of Birch Planet active support, if the structural load of the inner shell exceeds the compressive strength of degenerate matter, how do the macro-struts prevent buckling?",
            options: [
                "By utilizing hyper-diamond crystal lattice doping.",
                "By accelerating streams of mass (orbital rings) electromagnetically through the struts to provide outward centrifugal force.",
                "By neutralizing the graviton field using exotic matter with negative mass.",
                "By relying on the frame-dragging effect of the Ergosphere to lift the shell."
            ],
            correctAnswer: 1,
            explanation: "Active support relies on the kinetic energy of mass streams. By accelerating mass electromagnetically through a track inside the strut, the centrifugal force pushes outwards against gravity, capable of supporting loads vastly exceeding the static chemical or degenerate bonds of any material."
        },
        {
            question: "How does the Birch Planet architecture account for the extreme time dilation differential between the inner habitat shell and the outer armor shell?",
            options: [
                "It doesn't; inhabitants on the inner shell simply age slower relative to the outer shell.",
                "Data buffering and heavily subsidized temporal-sync algorithms in transit networks.",
                "By placing the inner shell precisely at the photon sphere where time normalizes.",
                "A & B. Time dilation is physically unavoidable, so society adapts via computational logistics."
            ],
            correctAnswer: 3,
            explanation: "Because the inner shell is deeper in the gravity well of the 1.5 trillion mass black hole, time moves measurably slower there compared to the outer shell. This requires massive temporal-sync protocols for communication and transit, and sociologically, inner-shell inhabitants age slower."
        },
        {
            question: "What is the primary thermodynamic bottleneck for a civilization inhabiting a fully enclosed Birch Planet?",
            options: [
                "Extracting enough energy from the black hole's accretion disk.",
                "Synthesizing enough baryonic matter to build the outer shells.",
                "Radiating waste heat into deep space fast enough to prevent the biosphere from boiling.",
                "Maintaining the orbital velocity of the artificial suns."
            ],
            correctAnswer: 2,
            explanation: "A Birch planet generates staggering amounts of energy (from the singularity, suns, and billions of inhabitants). Because it is enclosed, this heat must be radiated away through the outer shell. The surface area of the outer shell limits the maximum power dissipation via the Stefan-Boltzmann law."
        },
        {
            question: "For an artificial sun in orbit at radius R_SUNS inside the shell, how does its orbital velocity compare to a standard Keplerian orbit at that same radius?",
            options: [
                "It is exactly equal to the Keplerian velocity.",
                "It is significantly faster to counteract the mass of the outer shells.",
                "It is completely independent of Keplerian mechanics because it is magnetically suspended from the Mid Shell.",
                "It is slower, due to the Lense-Thirring effect."
            ],
            correctAnswer: 2,
            explanation: "In a true megastructure like a Birch planet, objects within the shell do not rely solely on freefall orbital mechanics. The 'Suns' are attached to or suspended by the active support grid (the mid shell) and dragged along electromagnetic tracks to simulate precise diurnal cycles, completely divorced from orbital velocity requirements."
        },
        {
            question: "Why is the inner habitat shell constructed 'inside-out', facing the singularity?",
            options: [
                "To hide from extragalactic radiation.",
                "So that the immense gravity of the central black hole acts as 'down', holding atmospheres and oceans to the shell floor.",
                "To utilize the Hawking radiation from the event horizon directly.",
                "Because centrifugal force from the shell's rotation requires them to be on the inside."
            ],
            correctAnswer: 1,
            explanation: "Unlike a classic Ringworld or O'Neill cylinder which relies on spin (centrifugal force) for gravity, a Birch Planet is so massive that the central black hole provides the gravity. Therefore, 'down' is towards the black hole, and the habitat is built on the inside surface of a shell, facing inward."
        }
    ];

    return {
        group,
        parts,
        description: "A highly complex, fully animated Birch Planet megastructure. Built around a supermassive black hole, it features an accretion disk, Dyson swarm harvesters, artificial suns, an inside-out biosphere with procedural mega-continents, atmospheric containment, and billions of tons of active-support structural struts.",
        quizQuestions,
        animate
    };
}
