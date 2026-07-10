import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const particles = [];
    const arcs = [];
    const hydraulics = [];

    // ==========================================
    // EXTREME GOD-TIER MATERIALS
    // ==========================================
    
    // The ominous glow of Strange Matter
    const strangeMatterGlow = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 4.5,
        roughness: 0.01,
        metalness: 1.0,
        wireframe: false
    });

    // The stable glow of Ordinary Baryonic Matter
    const normalMatterGlow = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.5
    });

    // The highly refractive and glowing containment field
    const containmentFieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x005555,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.2,
        roughness: 0.0,
        metalness: 0.2,
        transmission: 0.98,
        ior: 1.8,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    // Pure energy arc material
    const plasmaArcMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const supercooledCopper = new THREE.MeshStandardMaterial({
        color: 0xc87333,
        roughness: 0.1,
        metalness: 1.0,
        emissive: 0x331100,
        emissiveIntensity: 0.4
    });

    const adamantiumSteel = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.5,
        metalness: 0.9,
        clearcoat: 0.2
    });

    const quantumGlass = new THREE.MeshPhysicalMaterial({
        color: 0x88bbff,
        transparent: true,
        opacity: 0.1,
        transmission: 1.0,
        roughness: 0.0,
        metalness: 0.1,
        ior: 2.5
    });
    
    const warningSignMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        roughness: 0.6,
        metalness: 0.1
    });

    // ==========================================
    // HELPER FUNCTIONS FOR MASSIVE SCALING
    // ==========================================

    let partIdCounter = 0;
    
    /**
     * Registers a massive multi-mesh component into the parts array.
     * Computes exploded view positions dynamically based on origin.
     */
    function registerPart(name, mesh, desc, func, connections, failEf, cascade, orgPos, explodeMult = 2.5) {
        mesh.position.copy(orgPos);
        mesh.userData.id = partIdCounter++;
        group.add(mesh);
        
        parts.push({
            name: name,
            description: desc,
            material: mesh.material ? mesh.material.name : 'Hyper-Alloy Composite',
            function: func,
            assemblyOrder: partIdCounter,
            connections: connections,
            failureEffect: failEf,
            cascadeFailures: cascade,
            originalPosition: { x: orgPos.x, y: orgPos.y, z: orgPos.z },
            explodedPosition: { 
                x: orgPos.x * explodeMult + (Math.random() - 0.5) * 15, 
                y: orgPos.y * explodeMult + (Math.random() - 0.5) * 15, 
                z: orgPos.z * explodeMult + (Math.random() - 0.5) * 15 
            }
        });
    }

    // ==========================================
    // 1. HYPER-DENSE QUARK CORE (THE SINGULARITY)
    // ==========================================
    const coreGroup = new THREE.Group();
    meshes.core = coreGroup;
    
    // The main topological knot representing folded spacetime
    const coreGeom = new THREE.TorusKnotGeometry(5.5, 2.2, 512, 128, 9, 14);
    const coreMesh = new THREE.Mesh(coreGeom, strangeMatterGlow);
    coreGroup.add(coreMesh);
    
    // Fractal inner strangelet nodes
    const nodeCount = 24;
    for (let i = 0; i < nodeCount; i++) {
        const nodeGeom = new THREE.SphereGeometry(1.2, 32, 32);
        const node = new THREE.Mesh(nodeGeom, strangeMatterGlow);
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        node.position.set(
            6 * Math.cos(theta) * Math.sin(phi),
            6 * Math.sin(theta) * Math.sin(phi),
            6 * Math.cos(phi)
        );
        coreGroup.add(node);
    }
    
    registerPart(
        "Hyper-Dense Quark Core",
        coreGroup,
        "A continuously folding topological manifold sustaining extreme pressures (10^34 Pascals) required to stabilize strange quarks.",
        "Facilitates the irreversible conversion of up and down quarks into strange quarks via extreme weak-force interactions under ultra-high pressure.",
        ["Containment Rings", "Primary Injector", "Baryon Exhaust"],
        "Uncontrolled strangelet conversion of the local galactic sector.",
        ["Containment Failure", "Vacuum Decay", "Planetary Assimilation"],
        new THREE.Vector3(0, 0, 0),
        1.2
    );

    // ==========================================
    // 2. INNER STRONG-FORCE CONTAINMENT FIELD
    // ==========================================
    const innerFieldGroup = new THREE.Group();
    meshes.innerField = innerFieldGroup;

    // Solid refractive sphere
    const innerFieldGeom = new THREE.IcosahedronGeometry(11, 5);
    const innerFieldMesh = new THREE.Mesh(innerFieldGeom, containmentFieldMat);
    innerFieldGroup.add(innerFieldMesh);

    // Wireframe overlay for high-tech HUD look
    const wireGeom = new THREE.IcosahedronGeometry(11.1, 5);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.1 });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    innerFieldGroup.add(wireMesh);
    
    registerPart(
        "Inner Strong-Force Containment Field",
        innerFieldGroup,
        "A mathematically perfect geodesic sphere composed of overlapping Higgs fields.",
        "Prevents strangelets from tunneling out of the core by artificially increasing the vacuum expectation value locally.",
        ["Core", "Magnetic Torus"],
        "Quantum tunneling of strange matter into surrounding air.",
        ["Atmospheric Conversion", "Immediate Core Breach"],
        new THREE.Vector3(0, 0, 0),
        1.0
    );

    // ==========================================
    // 3. MAGNETIC CONFINEMENT RINGS (COMPLEX ARRAY)
    // ==========================================
    const ringsGroup = new THREE.Group();
    meshes.rings = [];
    for (let i = 0; i < 5; i++) {
        const ringGeom = new THREE.TorusGeometry(15 + i * 3, 1.2, 64, 256);
        const ringMesh = new THREE.Mesh(ringGeom, supercooledCopper);
        
        // Add thousands of electromagnetic coils
        const coilCount = 200 + i * 30;
        for(let j = 0; j < coilCount; j++) {
            const coilGeom = new THREE.BoxGeometry(2.5, 2.5, 0.4);
            const coil = new THREE.Mesh(coilGeom, adamantiumSteel);
            const angle = (j / coilCount) * Math.PI * 2;
            const radius = 15 + i * 3;
            coil.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            coil.rotation.z = angle;
            
            // Add tiny glowing nodes on every 5th coil
            if (j % 5 === 0) {
                const nodeG = new THREE.BoxGeometry(0.6, 0.6, 0.5);
                const nodeM = new THREE.Mesh(nodeG, plasmaArcMat);
                nodeM.position.z = 0.3;
                coil.add(nodeM);
            }
            
            ringMesh.add(coil);
        }

        ringMesh.rotation.x = Math.PI / 2 + i * 0.15;
        ringMesh.rotation.y = i * (Math.PI / 5);
        ringsGroup.add(ringMesh);
        
        // Save for animation
        meshes.rings.push({ 
            mesh: ringMesh, 
            speed: (i % 2 === 0 ? 1 : -1) * (0.015 - i * 0.002),
            axisX: ringMesh.rotation.x,
            axisY: ringMesh.rotation.y
        });
    }
    
    registerPart(
        "Superconducting Confinement Rings",
        ringsGroup,
        "Penta-axial superconducting toroids generating a 10^16 Tesla magnetic field.",
        "Stabilizes the plasma of free quarks and prevents it from expanding outwards.",
        ["Inner Field", "Cooling Array", "Power Grid"],
        "Magnetic field collapse resulting in explosive decompression of quark-gluon plasma.",
        ["Thermal Runaway", "Core Destabilization"],
        new THREE.Vector3(0, 0, 0),
        1.8
    );

    // ==========================================
    // 4. BARYONIC MATTER INJECTOR TUBE
    // ==========================================
    const injectorGroup = new THREE.Group();
    
    // Massive LatheGeometry for a complex high-tech nozzle
    const points = [];
    for ( let i = 0; i <= 40; i ++ ) {
        const v = i / 40;
        const radius = 3 + Math.sin(v * Math.PI * 8) * 0.8 - v * 2.0;
        points.push( new THREE.Vector2( radius, i * 1.8 ) );
    }
    const injectorGeom = new THREE.LatheGeometry(points, 128);
    const injectorMesh = new THREE.Mesh(injectorGeom, chrome);
    injectorMesh.rotation.x = Math.PI; // point down
    injectorMesh.position.y = 50;
    injectorGroup.add(injectorMesh);
    
    // Add heavy support rings to injector
    for(let i = 0; i < 8; i++) {
        const ringG = new THREE.TorusGeometry(4.5 - i*0.3, 0.6, 32, 128);
        const ringM = new THREE.Mesh(ringG, darkSteel);
        ringM.position.y = 50 - i * 8;
        ringM.rotation.x = Math.PI / 2;
        
        // Add bolts to the rings
        for(let b=0; b<12; b++) {
            const boltG = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
            const bolt = new THREE.Mesh(boltG, steel);
            const a = (b/12) * Math.PI * 2;
            const r = 4.5 - i*0.3;
            bolt.position.set(Math.cos(a)*r, 0, Math.sin(a)*r);
            bolt.rotation.x = Math.PI/2;
            bolt.rotation.z = a;
            ringM.add(bolt);
        }
        
        injectorGroup.add(ringM);
    }
    
    registerPart(
        "Baryonic Matter Injector",
        injectorGroup,
        "A hyper-accelerator that fires ordinary heavy nuclei (Lead-208) into the core at 0.999999999c.",
        "Feeds standard matter into the containment field to be assimilated by the strange matter.",
        ["Core", "Particle Accelerator Network", "Cooling Array"],
        "Backblast of strangelets up the injector tube.",
        ["Accelerator Contamination", "Total Subterranean Facility Loss"],
        new THREE.Vector3(0, 30, 0),
        1.5
    );

    // ==========================================
    // 5. HYDRAULIC QUANTUM STABILIZERS
    // ==========================================
    const pistonSystem = new THREE.Group();
    meshes.pistons = [];
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const pGroup = new THREE.Group();
        
        // Outer cylinder
        const outerG = new THREE.CylinderGeometry(2.0, 2.0, 30, 32);
        const outerM = new THREE.Mesh(outerG, darkSteel);
        outerM.position.y = 15;
        pGroup.add(outerM);
        
        // Inner piston (moves)
        const innerG = new THREE.CylinderGeometry(1.4, 1.4, 35, 32);
        const innerM = new THREE.Mesh(innerG, chrome);
        innerM.position.y = 30; // base extension
        
        // Piston Head
        const headG = new THREE.CylinderGeometry(2.5, 2.5, 2, 32);
        const headM = new THREE.Mesh(headG, steel);
        headM.position.y = 17.5;
        innerM.add(headM);
        
        pGroup.add(innerM);
        
        pGroup.position.set(Math.cos(angle)*25, -35, Math.sin(angle)*25);
        pGroup.lookAt(0, 0, 0);
        pGroup.rotateX(Math.PI / 4);
        
        pistonSystem.add(pGroup);
        meshes.pistons.push({
            mesh: innerM,
            offset: i * 0.4
        });
    }
    
    registerPart(
        "Hydraulic Quantum Stabilizers",
        pistonSystem,
        "Massive hydraulic dampeners filled with a non-Newtonian exotic fluid.",
        "Absorbs the immense gravitational tremors and spatial warping caused by strangelet creation.",
        ["Truss Framework", "Core Anchor"],
        "Piston rupture releasing exotic fluid.",
        ["Structural Imbalance", "Core Oscillation"],
        new THREE.Vector3(0, 0, 0),
        2.5
    );

    // ==========================================
    // 6. CRYOGENIC COOLING PIPES (TUBE GEOMETRY)
    // ==========================================
    const coolingGroup = new THREE.Group();
    
    class CryoPipeCurve extends THREE.Curve {
        constructor( scale = 1, phase = 0, yOffset = 0, complexity = 4 ) {
            super();
            this.scale = scale;
            this.phase = phase;
            this.yOffset = yOffset;
            this.complexity = complexity;
        }
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const tx = Math.cos( t * Math.PI * this.complexity + this.phase ) * 22 * this.scale;
            const ty = (t * 80) - 40 + this.yOffset;
            const tz = Math.sin( t * Math.PI * this.complexity + this.phase ) * 22 * this.scale;
            // Add some noise
            const nx = Math.sin(t * 20) * 1.5;
            const nz = Math.cos(t * 20) * 1.5;
            return optionalTarget.set( tx + nx, ty, tz + nz );
        }
    }
    
    for(let i=0; i<24; i++) {
        const path = new CryoPipeCurve( 1 + Math.random()*0.3, i * 0.3, (Math.random()-0.5)*15, 2 + Math.random()*4 );
        const tubeG = new THREE.TubeGeometry( path, 200, 0.5, 16, false );
        const tubeM = new THREE.Mesh( tubeG, copper );
        coolingGroup.add(tubeM);
        
        // Add frost/ice condenser rings randomly along pipes
        for(let j=0; j<15; j++) {
            const ringG = new THREE.TorusGeometry(0.8, 0.15, 8, 16);
            const ringM = new THREE.Mesh(ringG, quantumGlass);
            const t = Math.random();
            const pt = path.getPoint(t);
            const tangent = path.getTangent(t);
            ringM.position.copy(pt);
            const axis = new THREE.Vector3(0,1,0);
            ringM.quaternion.setFromUnitVectors(axis, tangent);
            coolingGroup.add(ringM);
        }
    }
    
    registerPart(
        "Superfluid Helium-3 Cryo-Pipes",
        coolingGroup,
        "A tangled, chaotic web of heavily insulated piping pumping superfluid He-3 at 0.0001 Kelvin.",
        "Maintains the superconducting state of the confinement rings.",
        ["Rings", "Cryo-Plant"],
        "Thermal spikes leading to superconductivity loss.",
        ["Magnetic Quench", "Containment Failure"],
        new THREE.Vector3(0, 0, 0),
        3.0
    );

    // ==========================================
    // 7. HEAVY ADAMANTIUM TRUSS FRAMEWORK
    // ==========================================
    const trussGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pillarGeom = new THREE.CylinderGeometry(3, 4, 100, 32);
        const pillar = new THREE.Mesh(pillarGeom, darkSteel);
        pillar.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
        
        // Intricate cross bracing connecting pillars
        const nextAngle = ((i+1) / 8) * Math.PI * 2;
        const p1 = new THREE.Vector3(Math.cos(angle)*35, 0, Math.sin(angle)*35);
        const p2 = new THREE.Vector3(Math.cos(nextAngle)*35, 0, Math.sin(nextAngle)*35);
        const dist = p1.distanceTo(p2);
        
        for (let j = -40; j <= 40; j += 15) {
            // Horizontal struts
            const strutG = new THREE.CylinderGeometry(0.8, 0.8, dist, 16);
            const strut = new THREE.Mesh(strutG, steel);
            strut.position.set(0, j, 0);
            strut.rotation.x = Math.PI / 2;
            strut.rotation.z = Math.PI / 2 + angle + Math.PI/8; 
            // Position it exactly between the two pillars
            strut.position.copy(p1).lerp(p2, 0.5);
            strut.position.y = j;
            strut.lookAt(p2.x, j, p2.z);
            trussGroup.add(strut);
            
            // X-braces
            if (j < 40) {
                const xDist = Math.sqrt(dist*dist + 15*15);
                const xBraceG = new THREE.CylinderGeometry(0.6, 0.6, xDist, 16);
                const x1 = new THREE.Mesh(xBraceG, steel);
                x1.position.copy(p1).lerp(p2, 0.5);
                x1.position.y = j + 7.5;
                x1.lookAt(p2.x, j+15, p2.z);
                trussGroup.add(x1);
                
                const x2 = new THREE.Mesh(xBraceG, steel);
                x2.position.copy(p1).lerp(p2, 0.5);
                x2.position.y = j + 7.5;
                x2.lookAt(p1.x, j+15, p1.z);
                trussGroup.add(x2);
            }
        }
        
        // Add giant bolts to pillars
        for (let j = -45; j <= 45; j += 10) {
            const boltG = new THREE.CylinderGeometry(3.5, 3.5, 1.5, 6);
            const bolt = new THREE.Mesh(boltG, chrome);
            bolt.position.set(0, j, 0);
            pillar.add(bolt);
        }

        trussGroup.add(pillar);
    }
    
    registerPart(
        "Adamantium Truss Framework",
        trussGroup,
        "A hyper-rigid support structure meant to withstand extreme gravitational shearing forces.",
        "Keeps the entire facility physically anchored against the micro-gravity anomalies generated by the core.",
        ["Foundation", "Rings", "Injectors"],
        "Structural collapse and catastrophic spatial implosion.",
        ["Facility Loss", "Core Drop"],
        new THREE.Vector3(0, 0, 0),
        1.8
    );

    // ==========================================
    // 8. ARMORED OBSERVATION DECK & CONTROL CABIN
    // ==========================================
    const deckGroup = new THREE.Group();
    
    const deckGeom = new THREE.RingGeometry(38, 48, 64);
    const deckMesh = new THREE.Mesh(deckGeom, darkSteel);
    deckMesh.rotation.x = -Math.PI / 2;
    deckMesh.position.y = 25;
    deckGroup.add(deckMesh);
    
    // Railings
    for(let i=0; i<128; i++) {
        const angle = (i/128) * Math.PI * 2;
        const postG = new THREE.CylinderGeometry(0.15, 0.15, 4, 8);
        const postM = new THREE.Mesh(postG, steel);
        postM.position.set(Math.cos(angle)*39, 27, Math.sin(angle)*39);
        deckGroup.add(postM);
    }
    const railG = new THREE.TorusGeometry(39, 0.2, 8, 128);
    const railM = new THREE.Mesh(railG, steel);
    railM.rotation.x = Math.PI / 2;
    railM.position.y = 29;
    deckGroup.add(railM);
    
    // The Cabin (Extruded shape)
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-8, -6);
    cabinShape.lineTo(8, -6);
    cabinShape.lineTo(10, 6);
    cabinShape.lineTo(-10, 6);
    cabinShape.closePath();
    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, { depth: 10, bevelEnabled: true, bevelSize: 0.5 });
    const cabinM = new THREE.Mesh(cabinGeom, darkSteel);
    cabinM.position.set(0, 25, 42);
    cabinM.rotation.x = -Math.PI / 2;
    deckGroup.add(cabinM);
    
    // Cabin Window
    const windowG = new THREE.PlaneGeometry(16, 6);
    const windowM = new THREE.Mesh(windowG, tinted);
    windowM.position.set(0, 29, 36.9);
    windowM.rotation.y = Math.PI;
    deckGroup.add(windowM);

    // Holographic Screens inside cabin
    for(let i=0; i<5; i++) {
        const screenG = new THREE.PlaneGeometry(2.5, 2.0);
        const screenM = new THREE.Mesh(screenG, warningSignMat);
        screenM.position.set(-6 + i*3, 29, 37.5);
        screenM.rotation.y = Math.PI;
        deckGroup.add(screenM);
    }
    
    registerPart(
        "Armored Observation Deck & Control Cabin",
        deckGroup,
        "A heavily shielded command center suspended above the core.",
        "Allows operators to monitor the conversion process behind 5 meters of neutron-absorbent plating.",
        ["Truss Framework"],
        "Radiation flooding the cabin.",
        ["Operator Death", "Loss of Manual Control"],
        new THREE.Vector3(0, 0, 0),
        1.5
    );

    // ==========================================
    // 9. BARYONIC EXHAUST MANIFOLD
    // ==========================================
    const exhaustGroup = new THREE.Group();
    const exhaustGeom = new THREE.CylinderGeometry(10, 6, 40, 64, 1, true);
    const exhaustMesh = new THREE.Mesh(exhaustGeom, darkSteel);
    exhaustMesh.position.y = -40;
    exhaustGroup.add(exhaustMesh);
    
    // Exhaust grilles and baffles
    for(let i=0; i<16; i++) {
        const grilleG = new THREE.BoxGeometry(0.8, 35, 20);
        const grilleM = new THREE.Mesh(grilleG, copper);
        const angle = (i/16) * Math.PI * 2;
        grilleM.position.set(Math.cos(angle)*8, -40, Math.sin(angle)*8);
        grilleM.rotation.y = angle + Math.PI/2;
        exhaustGroup.add(grilleM);
    }
    
    // Internal glowing vent core
    const ventCoreG = new THREE.CylinderGeometry(5, 3, 38, 32);
    const ventCoreM = new THREE.Mesh(ventCoreG, normalMatterGlow);
    ventCoreM.position.y = -40;
    exhaustGroup.add(ventCoreM);

    registerPart(
        "Baryonic Exhaust Manifold",
        exhaustGroup,
        "Massive venting system beneath the core.",
        "Vents off excess photons, neutrinos, and immense heat generated during the strange matter conversion phase.",
        ["Core", "Foundation"],
        "Overheating and catastrophic pressure buildup.",
        ["Core Rupture", "Plasma Detonation"],
        new THREE.Vector3(0, 0, 0),
        1.4
    );

    // ==========================================
    // 10. CLASS-X HAZARD BEACONS
    // ==========================================
    const beaconsGroup = new THREE.Group();
    meshes.beacons = [];
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), darkSteel);
        beaconBase.position.set(Math.cos(angle)*45, 10, Math.sin(angle)*45);
        
        const beaconG = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
        const beaconM = new THREE.Mesh(beaconG, warningSignMat);
        beaconM.position.y = 2;
        beaconBase.add(beaconM);
        
        beaconsGroup.add(beaconBase);
        meshes.beacons.push(beaconM);
    }
    
    registerPart(
        "Class-X Hazard Beacons",
        beaconsGroup,
        "Ultra-bright oscillating warning lights.",
        "Warns all personnel within a 5km radius of active strangelet production.",
        ["Truss Framework"],
        "No direct structural failure, safety violation.",
        [],
        new THREE.Vector3(0, 0, 0),
        3.0
    );

    // ==========================================
    // 11. QUANTUM VACUUM PUMPS
    // ==========================================
    const pumpsGroup = new THREE.Group();
    meshes.pumps = [];
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        
        const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 6), darkSteel);
        pumpBody.position.set(Math.cos(angle)*28, -15, Math.sin(angle)*28);
        pumpBody.lookAt(0, -15, 0);
        
        // Add giant rotating fan inside
        const fan = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.5, 32), steel);
        fan.rotation.x = Math.PI/2;
        fan.position.z = 3;
        
        // High-tech curved Fan blades
        for(let j=0; j<12; j++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.0, 1.0), aluminum);
            blade.rotation.z = (j/12) * Math.PI * 2;
            // curve the blade
            blade.rotation.x = 0.5;
            fan.add(blade);
        }
        
        pumpBody.add(fan);
        pumpsGroup.add(pumpBody);
        meshes.pumps.push(fan);
    }

    registerPart(
        "Quantum Vacuum Pumps",
        pumpsGroup,
        "Extracts virtual particles from the vacuum to maintain an ultra-hard vacuum inside the chamber.",
        "Prevents atmospheric particles from spontaneously converting into strange matter, which would cause an immediate atmospheric chain reaction.",
        ["Containment Chamber", "Power Grid"],
        "Loss of vacuum, allowing air to contact the core.",
        ["Atmospheric Ignition", "Planetary Assimilation"],
        new THREE.Vector3(0, 0, 0),
        2.2
    );

    // ==========================================
    // 12. HIGH-VOLTAGE POWER COUPLINGS (CABLES)
    // ==========================================
    const cablesGroup = new THREE.Group();
    for(let i=0; i<40; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3( (Math.random()-0.5)*15, 45, (Math.random()-0.5)*15 ),
            new THREE.Vector3( (Math.random()-0.5)*40, 25, (Math.random()-0.5)*40 ),
            new THREE.Vector3( (Math.random()-0.5)*55, 0, (Math.random()-0.5)*55 ),
            new THREE.Vector3( (Math.random()-0.5)*30, -35, (Math.random()-0.5)*30 )
        ]);
        const cableG = new THREE.TubeGeometry(curve, 128, 0.4 + Math.random()*0.3, 12, false);
        const cableM = new THREE.Mesh(cableG, rubber);
        cablesGroup.add(cableM);
    }
    
    registerPart(
        "High-Voltage Power Couplings",
        cablesGroup,
        "Thick rubber-shielded cables transmitting petawatts of power.",
        "Delivers raw electrical energy from the orbital Dyson swarm directly to the magnetic rings.",
        ["Rings", "Pumps", "Injector"],
        "Massive electrical arcing and power loss.",
        ["Containment Failure", "Facility Fire"],
        new THREE.Vector3(0, 0, 0),
        3.5
    );

    // ==========================================
    // 13. STRANGELET EXTRACTION PIPELINE
    // ==========================================
    const extractGroup = new THREE.Group();
    
    // Collector ring
    const extractG = new THREE.TorusGeometry(10, 1.5, 64, 128);
    const extractM = new THREE.Mesh(extractG, chrome);
    extractM.rotation.x = Math.PI / 2;
    extractM.position.y = -20;
    extractGroup.add(extractM);
    
    // Transport pipes
    for(let i=0; i<6; i++) {
        const pipeG = new THREE.CylinderGeometry(1.2, 1.2, 40, 32);
        const pipeM = new THREE.Mesh(pipeG, chrome);
        const angle = (i/6) * Math.PI * 2;
        pipeM.position.set(Math.cos(angle)*10, -40, Math.sin(angle)*10);
        
        // Add magnetic accelerator rings on pipes
        for(let r=0; r<8; r++) {
            const magG = new THREE.TorusGeometry(1.6, 0.3, 16, 32);
            const magM = new THREE.Mesh(magG, supercooledCopper);
            magM.position.y = -15 + r * 4;
            magM.rotation.x = Math.PI/2;
            pipeM.add(magM);
        }
        
        extractGroup.add(pipeM);
    }
    
    registerPart(
        "Strangelet Extraction Pipeline",
        extractGroup,
        "A heavily shielded pipe network lined with magnetic repulsors.",
        "Safely transports synthesized strangelets away from the core to weaponization facilities.",
        ["Core", "Storage Bunkers"],
        "Pipeline breach.",
        ["Contamination of Crust", "Planetary Assimilation"],
        new THREE.Vector3(0, 0, 0),
        1.7
    );

    // ==========================================
    // 14. PLASMA ARC GENERATORS
    // ==========================================
    const arcGenGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const genG = new THREE.BoxGeometry(4, 8, 4);
        const genM = new THREE.Mesh(genG, copper);
        genM.position.set(Math.cos(angle)*20, 0, Math.sin(angle)*20);
        genM.lookAt(0,0,0);
        
        // The emitter tip
        const tipG = new THREE.ConeGeometry(0.8, 3, 32);
        const tipM = new THREE.Mesh(tipG, warningSignMat);
        tipM.position.z = 3.5;
        tipM.rotation.x = Math.PI / 2;
        genM.add(tipM);
        
        arcGenGroup.add(genM);
    }
    
    registerPart(
        "Plasma Arc Generators",
        arcGenGroup,
        "High-energy plasma field emitters.",
        "Generates a secondary plasma shield to incinerate any stray normal matter before it hits the inner containment field.",
        ["Containment Field", "Truss Framework"],
        "Generator burnout.",
        ["Micro-meteoroid breach of containment"],
        new THREE.Vector3(0, 0, 0),
        2.1
    );

    // ==========================================
    // 15. SEISMIC ISOLATION BASE PLATE
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Extrude a massive high-tech gear shape for the base
    const baseShape = new THREE.Shape();
    const radiusOuter = 60;
    const radiusInner = 45;
    const numTeeth = 32;
    for (let i = 0; i < numTeeth * 2; i++) {
        const angle = (i / (numTeeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? radiusOuter : radiusInner;
        if (i === 0) baseShape.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
        else baseShape.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
    }
    baseShape.closePath();
    
    // Add central hole
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 15, 0, Math.PI * 2, false);
    baseShape.holes.push(holePath);

    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -50;
    baseGroup.add(baseMesh);
    
    registerPart(
        "Seismic Isolation Base Plate",
        baseGroup,
        "A 50,000-ton shock-absorbing foundation block.",
        "Isolates the catalyst from tectonic plate movements and artificial earthquakes caused by the machine.",
        ["Planet Crust", "Truss Framework", "Exhaust"],
        "Fracture of the base plate.",
        ["Catastrophic misalignment of confinement rings"],
        new THREE.Vector3(0, 0, 0),
        1.1
    );

    // ==========================================
    // 16. NEUTRINO DETECTOR ARRAY
    // ==========================================
    const neutrinoGroup = new THREE.Group();
    for (let i = 0; i < 200; i++) {
        const detG = new THREE.SphereGeometry(0.4, 8, 8);
        const detM = new THREE.Mesh(detG, glass);
        
        // Randomly place on a sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 20;
        
        detM.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        neutrinoGroup.add(detM);
    }

    registerPart(
        "Neutrino Detector Array",
        neutrinoGroup,
        "A spherical array of photomultiplier tubes submerged in heavy water.",
        "Detects the exact moment a strange quark is synthesized by measuring specific neutrino emissions.",
        ["Data Center", "Truss Framework"],
        "Blindness to the conversion rate.",
        ["Overfeeding the core", "Runaway conversion"],
        new THREE.Vector3(0, 0, 0),
        2.0
    );

    // ==========================================
    // 17. GRAVITON LENS ARRAY
    // ==========================================
    const gravitonGroup = new THREE.Group();
    const lensGeom = new THREE.OctahedronGeometry(4, 2);
    
    const lensTop = new THREE.Mesh(lensGeom, quantumGlass);
    lensTop.position.y = 12;
    gravitonGroup.add(lensTop);
    
    const lensBot = new THREE.Mesh(lensGeom, quantumGlass);
    lensBot.position.y = -12;
    gravitonGroup.add(lensBot);

    registerPart(
        "Graviton Lens",
        gravitonGroup,
        "Exotic metamaterial lenses.",
        "Focuses the immense gravity of the hyper-dense core to prevent localized black hole formation.",
        ["Core", "Inner Field"],
        "Unfocused gravity well.",
        ["Event horizon formation", "Spaghettification of the facility"],
        new THREE.Vector3(0, 0, 0),
        1.0
    );

    // ==========================================
    // DYNAMIC EFFECTS: PARTICLES (Ordinary -> Strange)
    // ==========================================
    const particleGroup = new THREE.Group();
    meshes.particles = [];
    for(let i=0; i<300; i++) {
        const pG = new THREE.SphereGeometry(0.25, 16, 16);
        // Start them off with normal matter material (blue)
        const pM = new THREE.Mesh(pG, normalMatterGlow.clone());
        
        // Randomize initial positions high up in the injector
        const py = 50 + Math.random() * 80;
        const radius = Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        pM.position.set(Math.cos(theta)*radius, py, Math.sin(theta)*radius);
        
        particleGroup.add(pM);
        meshes.particles.push({
            mesh: pM,
            speed: 0.15 + Math.random() * 0.4,
            state: 'normal',
            angle: theta,
            radius: radius
        });
    }
    group.add(particleGroup);

    // ==========================================
    // DYNAMIC EFFECTS: ENERGY ARCS
    // ==========================================
    const arcGroup = new THREE.Group();
    meshes.arcs = [];
    for(let i=0; i<15; i++) {
        const aG = new THREE.TubeGeometry(
            new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1)), 
            32, 0.2, 8, false
        );
        const aM = new THREE.Mesh(aG, plasmaArcMat);
        arcGroup.add(aM);
        meshes.arcs.push(aM);
    }
    group.add(arcGroup);


    // ==========================================
    // ANIMATION LOOP (EXTREME SYNCHRONIZATION)
    // ==========================================
    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;
        
        const t = time * 0.001 * speed;
        
        // 1. Core Pulsation and Topology Morphing
        if (activeMeshes.core) {
            activeMeshes.core.rotation.y = t * 0.8;
            activeMeshes.core.rotation.z = t * 0.5;
            activeMeshes.core.rotation.x = t * 0.3;
            
            const pulse = 3.5 + Math.sin(t * 8) * 2.5;
            // Traverse core group to update emissive intensity and scale
            activeMeshes.core.children.forEach((child, index) => {
                if (child.material && child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = pulse;
                }
                // Make the fractal nodes orbit the core
                if (index > 0) { // skip the main torus
                    const angle = t * 2 + index;
                    child.position.x = Math.cos(angle) * 7;
                    child.position.z = Math.sin(angle) * 7;
                    child.position.y = Math.sin(t * 3 + index) * 3;
                }
            });
            const scale = 1.0 + Math.sin(t * 12) * 0.08;
            activeMeshes.core.scale.set(scale, scale, scale);
        }

        // 2. Inner Field rotation
        if (activeMeshes.innerField) {
            activeMeshes.innerField.rotation.x = t * -0.3;
            activeMeshes.innerField.rotation.y = t * 0.5;
            activeMeshes.innerField.rotation.z = Math.sin(t * 0.5) * 0.2;
        }

        // 3. Magnetic Confinement Rings
        if (activeMeshes.rings) {
            activeMeshes.rings.forEach((ringObj, i) => {
                ringObj.mesh.rotation.z += ringObj.speed * speed;
                // Complex precession
                ringObj.mesh.rotation.x = ringObj.axisX + Math.sin(t * 1.5 + i) * 0.15;
                ringObj.mesh.rotation.y = ringObj.axisY + Math.cos(t * 1.5 + i) * 0.15;
            });
        }

        // 4. Hydraulic Pistons pumping in sync with core pulse
        if (activeMeshes.pistons) {
            activeMeshes.pistons.forEach(p => {
                const extension = Math.sin(t * 4 + p.offset) * 6;
                p.mesh.position.y = 30 + extension; // Adjust inner piston
            });
        }

        // 5. Vacuum Pumps spinning
        if (activeMeshes.pumps) {
            activeMeshes.pumps.forEach(fan => {
                fan.rotation.y += 0.4 * speed;
            });
        }

        // 6. Hazard Beacons strobing aggressively
        if (activeMeshes.beacons) {
            const strobe = Math.sin(t * 30) > 0 ? 1 : 0;
            activeMeshes.beacons.forEach(b => {
                b.material.emissiveIntensity = strobe * 3.0;
            });
        }

        // 7. Particle Flow (Blue Baryonic -> Purple Strangelet)
        if (activeMeshes.particles) {
            activeMeshes.particles.forEach(p => {
                // Move downwards violently
                p.mesh.position.y -= p.speed * speed * 4;
                
                // Spiral inward as they get closer to 0
                if (p.mesh.position.y > 0) {
                    p.angle += 0.15 * speed;
                    const funnelR = Math.max(0.1, p.radius * (p.mesh.position.y / 50)); 
                    p.mesh.position.x = Math.cos(p.angle) * funnelR;
                    p.mesh.position.z = Math.sin(p.angle) * funnelR;
                    
                    // Normal matter state
                    p.mesh.material.color.setHex(0x0088ff);
                    p.mesh.material.emissive.setHex(0x0088ff);
                    p.mesh.scale.set(1,1,1);
                } else {
                    // Passed the core, instant conversion to strange matter!
                    p.mesh.material.color.setHex(0xaa00ff);
                    p.mesh.material.emissive.setHex(0xaa00ff);
                    
                    // Strange matter is denser, make the visual particles smaller but glow brighter
                    p.mesh.scale.set(0.6, 0.6, 0.6);
                    p.mesh.material.emissiveIntensity = 4.0;
                    
                    // Spiral outwards via the exhaust pipeline (Torus ring radius is 10)
                    p.angle -= 0.2 * speed;
                    // Move them towards the extraction pipes
                    const pipeRadius = 10; 
                    p.mesh.position.x = Math.cos(p.angle) * pipeRadius;
                    p.mesh.position.z = Math.sin(p.angle) * pipeRadius;
                }
                
                // Reset to top if they fall too far down the pipes
                if (p.mesh.position.y < -50) {
                    p.mesh.position.y = 50 + Math.random() * 80;
                    p.mesh.position.x = Math.cos(p.angle) * p.radius;
                    p.mesh.position.z = Math.sin(p.angle) * p.radius;
                }
            });
        }

        // 8. Plasma Arcs (Violent striking from generators to containment)
        if (activeMeshes.arcs) {
            activeMeshes.arcs.forEach((arc, i) => {
                if (Math.random() < 0.15 * speed) {
                    // Start from random points on the generators
                    const startR = 20;
                    const angle = Math.random() * Math.PI * 2;
                    const startX = Math.cos(angle) * startR;
                    const startY = (Math.random()-0.5)*5;
                    const startZ = Math.sin(angle) * startR;
                    
                    // Strike the inner containment field
                    const endX = (Math.random()-0.5)*10;
                    const endY = (Math.random()-0.5)*10;
                    const endZ = (Math.random()-0.5)*10;

                    const p1 = new THREE.Vector3(startX, startY, startZ);
                    const p2 = new THREE.Vector3(startX * 0.5 + (Math.random()-0.5)*8, startY + (Math.random()-0.5)*8, startZ * 0.5 + (Math.random()-0.5)*8);
                    const p3 = new THREE.Vector3(endX, endY, endZ);
                    
                    const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
                    arc.geometry.dispose();
                    arc.geometry = new THREE.TubeGeometry(curve, 16, 0.15 + Math.random()*0.3, 8, false);
                    arc.visible = true;
                } else if (Math.random() < 0.3 * speed) {
                    arc.visible = false;
                }
            });
        }
    }

    const description = "The God-Tier Strange Matter Catalyst. A highly-classified, mathematically impossible megastructure designed to force up and down quarks into the 'strange' flavor state. Through immense pressure, magnetic confinement, and localized vacuum state manipulation, ordinary baryonic matter is dropped into the hyper-dense core (blue particles) where it undergoes a catastrophic phase transition into strange matter (purple particles). It is incredibly dangerous; a single microscopic breach could cause a chain reaction converting the entire Earth into a lifeless sphere of strangelets. Features full hydraulic stabilization, superconducting cryo-pipes, and overlapping strong-force containment fields. Designed with over 15 highly complex composite mechanical parts, this machine represents the peak of theoretical physics engineering.";

    const quizQuestions = [
        {
            question: "According to the Bodmer-Witten hypothesis, why is strange quark matter theorized to be the true ground state of baryonic matter?",
            options: [
                "Because the inclusion of the strange quark introduces an additional Fermi sea, lowering the overall energy per baryon compared to ordinary nuclear matter (Iron-56).",
                "Because strange quarks carry no color charge, eliminating the strong force repulsion entirely.",
                "Because strange quarks are significantly lighter than up and down quarks, reducing the mass-energy equivalence.",
                "Because strange matter spontaneously absorbs electrons to neutralize its charge, making it inert."
            ],
            correctAnswer: 0,
            explanation: "In strange quark matter, quarks are not confined to individual nucleons. The addition of a third quark flavor (strange) allows the quarks to occupy lower energy states in a new Fermi sea, avoiding the Pauli exclusion principle's energy penalty that occurs with just up and down quarks. This lowers the energy per baryon below that of Iron-56, making it the most stable state of matter."
        },
        {
            question: "In the context of the catalyst's operation, what symmetry breaking mechanism must be avoided to maintain a perfectly symmetric Color-Flavor Locked (CFL) state in the strange quark plasma?",
            options: [
                "Chiral symmetry breaking.",
                "Electroweak symmetry breaking.",
                "Parity violation.",
                "Time reversal asymmetry."
            ],
            correctAnswer: 0,
            explanation: "In the CFL state at extreme densities, chiral symmetry is spontaneously broken, but if the strange quark mass is too large or environmental conditions fluctuate, the perfect pairing between all three flavors (up, down, strange) and three colors can be disrupted. Maintaining the symmetry avoids less stable phases like 2SC."
        },
        {
            question: "How does the 'bag constant' (B) in the MIT Bag Model fundamentally affect the stability limits of the strange matter generated in this facility?",
            options: [
                "It represents the inward vacuum pressure confining the quarks; if B is too high, the strange matter is less stable than ordinary matter.",
                "It represents the outward degeneracy pressure of the quarks; if B is too high, the core explodes.",
                "It defines the maximum magnetic field the strangelets can endure before decaying.",
                "It dictates the rate at which strangelets emit Hawking radiation."
            ],
            correctAnswer: 0,
            explanation: "The bag constant (B) models the energy density of the perturbative vacuum (the 'bag' containing the quarks) relative to the true external vacuum. It acts as an inward pressure. If B is too large, the energy cost of creating the bag is too high, making strange quark matter energetically unfavorable compared to normal confined nucleons."
        },
        {
            question: "Why are the artificially synthesized strangelets in this facility possessing a negative charge considered vastly more dangerous than positively charged ones if they breach the containment field?",
            options: [
                "Negative strangelets attract positively charged atomic nuclei, allowing for immediate electrostatic assimilation and rapid runaway conversion.",
                "Negative strangelets repel each other, causing the core to instantly fragment and spray across the planet.",
                "Negative strangelets annihilate with ordinary electrons, causing massive antimatter-like explosions.",
                "Negative strangelets warp spacetime to a greater degree, inducing localized miniature black holes."
            ],
            correctAnswer: 0,
            explanation: "Normal matter nuclei are positively charged. A positively charged strangelet would repel them electrostatically (Coulomb barrier), slowing the conversion process. A negatively charged strangelet attracts nuclei, absorbing them instantly, growing larger, and continuing the chain reaction unstoppably."
        },
        {
            question: "What is the theoretical role of the electron Fermi gas that forms at the boundary of a strange star (or a massive strangelet core)?",
            options: [
                "It forms a protective electrostatic envelope that suspends normal matter (crust) above the strange matter, preventing immediate contact and assimilation.",
                "It acts as a catalyst to convert photons into strange quarks.",
                "It rapidly cools the strange matter via intense neutrino-antineutrino emission.",
                "It neutralizes the powerful magnetic fields generated by the spinning quarks."
            ],
            correctAnswer: 0,
            explanation: "Because quarks are confined by the strong nuclear force (creating a very sharp boundary) but electrons are not subject to the strong force, the electrons spill out slightly past the quark boundary. This creates a massive outward-pointing electric field (a dipole layer) that can electrostatically suspend a crust of normal matter, preventing it from touching and being absorbed by the strange matter beneath."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}
