import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- ADVANCED HIGH-TECH MATERIALS ---
    const plasmaMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaaff, emissive: 0xff00ff, emissiveIntensity: 2, 
        transparent: true, opacity: 0.8, side: THREE.DoubleSide 
    });
    const beamMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 5, 
        transparent: true, opacity: 0.6 
    });
    const monopoleMat = new THREE.MeshStandardMaterial({ 
        color: 0x000000, emissive: 0x0055ff, emissiveIntensity: 10, 
        roughness: 0.1, metalness: 1.0 
    });
    const fieldLineMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 4, 
        wireframe: true, transparent: true, opacity: 0.5 
    });
    const superConductorMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, metalness: 0.9, roughness: 0.2, 
        emissive: 0x001133, emissiveIntensity: 0.5 
    });
    const glowingCoreMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10, 
        transparent: true, opacity: 0.9 
    });
    const warningMat = new THREE.MeshStandardMaterial({ 
        color: 0xffcc00, metalness: 0.5, roughness: 0.5 
    });
    const laserMat = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 8, 
        transparent: true, opacity: 0.7 
    });
    const neonBlueMat = new THREE.MeshStandardMaterial({
        color: 0x0000ff, emissive: 0x0088ff, emissiveIntensity: 3
    });
    const displayScreenMat = new THREE.MeshStandardMaterial({
        color: 0x002200, emissive: 0x00ff00, emissiveIntensity: 1, 
        wireframe: true
    });

    // --- ANIMATION REGISTRIES ---
    const animRotators = [];
    const animGlows = [];
    const particleSystem = [];
    const beams = [];
    const fieldLines = [];
    const trapClaws = [];
    const pistons = [];
    const radarDishes = [];
    let monopoleMesh = null;
    let coreSphere = null;

    // --- EXTREME DETAIL HELPER FUNCTIONS ---
    
    // 1. Create highly detailed flange connection with bolts
    function createFlange(radius, thickness, boltsCount) {
        const flangeGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(radius, radius, thickness, 32);
        const base = new THREE.Mesh(baseGeo, steel);
        flangeGroup.add(base);
        
        const boltGeo = new THREE.CylinderGeometry(radius * 0.05, radius * 0.05, thickness * 1.5, 8);
        for(let i=0; i<boltsCount; i++) {
            const angle = (i / boltsCount) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, chrome);
            bolt.position.set(Math.cos(angle) * radius * 0.85, 0, Math.sin(angle) * radius * 0.85);
            flangeGroup.add(bolt);
        }
        return flangeGroup;
    }

    // 2. Create corrugated cryogenic cooling pipe
    function createCoolingPipe(path, radius, segments) {
        const pipeGroup = new THREE.Group();
        const tubeGeo = new THREE.TubeGeometry(path, segments, radius, 16, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        pipeGroup.add(tube);
        
        const ringGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.1, 8, 16);
        for(let i=0; i<=segments; i+=3) {
            const pt = path.getPointAt(i/segments);
            const tangent = path.getTangentAt(i/segments);
            
            const ring = new THREE.Mesh(ringGeo, aluminum);
            ring.position.copy(pt);
            const axis = new THREE.Vector3(0, 0, 1);
            ring.quaternion.setFromUnitVectors(axis, tangent);
            pipeGroup.add(ring);
        }
        return pipeGroup;
    }

    // 3. Create complex hydraulic piston
    function createPiston(radius, length) {
        const pGroup = new THREE.Group();
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length, 16);
        const outer = new THREE.Mesh(outerGeo, darkSteel);
        outer.position.y = length / 2;
        pGroup.add(outer);

        const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 1.2, 16);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = length; // Extended position
        pGroup.add(inner);
        
        return { group: pGroup, inner: inner, length: length };
    }

    // --- MAIN MASSIVE ASSEMBLIES ---

    // ==========================================
    // PART 1: The God-Tier Foundation Base
    // ==========================================
    const foundationGroup = new THREE.Group();
    
    // Multi-tiered massive base
    const baseGeo1 = new THREE.CylinderGeometry(60, 65, 3, 64);
    const baseMesh1 = new THREE.Mesh(baseGeo1, darkSteel);
    baseMesh1.position.y = -4;
    foundationGroup.add(baseMesh1);

    const baseGeo2 = new THREE.CylinderGeometry(55, 60, 3, 64);
    const baseMesh2 = new THREE.Mesh(baseGeo2, steel);
    baseMesh2.position.y = -1;
    foundationGroup.add(baseMesh2);
    
    // Grating grid top
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true });
    const gridGeo = new THREE.CircleGeometry(54.5, 64);
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.position.y = 0.55;
    gridMesh.rotation.x = -Math.PI/2;
    foundationGroup.add(gridMesh);

    // Hazard warning rings
    const warningGeo = new THREE.TorusGeometry(55, 0.4, 16, 64);
    const warningMesh = new THREE.Mesh(warningGeo, warningMat);
    warningMesh.position.y = 0.5;
    warningMesh.rotation.x = Math.PI/2;
    foundationGroup.add(warningMesh);

    group.add(foundationGroup);
    
    parts.push({
        name: "God-Tier Foundation Platform",
        description: "A multi-tiered, quantum-locked hyper-dense steel foundation designed to anchor the forge against tremendous GUT-scale recoils.",
        material: "DarkSteel / Warning Plating / Grating",
        function: "Absorbs asymmetrical energy bursts and grounds the massive electromagnetic fields.",
        assemblyOrder: 1,
        connections: ["Hydraulic Support Pillars", "Earth Core Grounding Cable"],
        failureEffect: "Catastrophic structural collapse resulting in a localized black hole creation.",
        cascadeFailures: ["Entire Facility"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ==========================================
    // PART 2: Hydraulic Support Pillars (8x)
    // ==========================================
    const pillarsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const pGroup = new THREE.Group();
        const angle = (i / 8) * Math.PI * 2;
        const radius = 42;
        
        // Base mount flange
        const baseMount = createFlange(4, 1, 16);
        pGroup.add(baseMount);

        // Shaft
        const shaftGeo = new THREE.CylinderGeometry(2.5, 3, 20, 32);
        const shaft = new THREE.Mesh(shaftGeo, steel);
        shaft.position.y = 10;
        pGroup.add(shaft);
        
        // Middle dampeners
        for(let d=0; d<3; d++) {
            const dampGeo = new THREE.TorusGeometry(3.5, 0.8, 16, 32);
            const damp = new THREE.Mesh(dampGeo, chrome);
            damp.rotation.x = Math.PI/2;
            damp.position.y = 6 + d * 4;
            pGroup.add(damp);
        }
        
        // Top mount flange
        const topMount = createFlange(4, 1, 16);
        topMount.position.y = 20;
        pGroup.add(topMount);
        
        pGroup.position.set(Math.cos(angle)*radius, 0.5, Math.sin(angle)*radius);
        
        // Tilt pillars slightly inward
        pGroup.lookAt(0, 22, 0);
        pGroup.rotateX(-Math.PI/2); 
        // Adjustment because lookAt points Z axis towards target, 
        // cylinder is along Y axis. We need to align.
        pGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(-Math.cos(angle)*radius, 22, -Math.sin(angle)*radius).normalize());

        pillarsGroup.add(pGroup);
    }
    group.add(pillarsGroup);
    
    parts.push({
        name: "Hydraulic Support Pillars",
        description: "8 highly articulated support columns equipped with chromatic hydraulic dampeners.",
        material: "Steel / Chrome / Rubber",
        function: "Transfers the immense weight and vibrational shockwaves from the containment torus to the foundation.",
        assemblyOrder: 2,
        connections: ["Foundation Platform", "Outer Containment Torus"],
        failureEffect: "Off-axis collision leading to containment breach and lateral plasma venting.",
        cascadeFailures: ["Vacuum Pumping System", "Cryogenic Cooling System"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 60 }
    });

    // ==========================================
    // PART 3: Outer Containment Torus
    // ==========================================
    const containmentGroup = new THREE.Group();
    containmentGroup.position.y = 22;
    
    // Main vacuum shell
    const shellGeo = new THREE.TorusGeometry(28, 8, 64, 128);
    const shell = new THREE.Mesh(shellGeo, darkSteel);
    shell.rotation.x = Math.PI/2;
    containmentGroup.add(shell);
    
    // Reinforcement ribs
    for(let r=0; r<32; r++) {
        const rAngle = (r/32) * Math.PI * 2;
        const ribGeo = new THREE.TorusGeometry(8.5, 0.5, 16, 32);
        const rib = new THREE.Mesh(ribGeo, steel);
        
        rib.position.set(Math.cos(rAngle)*28, 0, Math.sin(rAngle)*28);
        rib.rotation.y = -rAngle + Math.PI/2;
        containmentGroup.add(rib);
    }

    // Windows/Portholes
    const portGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32);
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2 + (Math.PI/16);
        const portGroup = new THREE.Group();
        
        const frame = new THREE.Mesh(portGeo, steel);
        const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.6, 32), tinted);
        portGroup.add(frame);
        portGroup.add(glassMesh);
        
        portGroup.rotation.x = Math.PI/2;
        portGroup.position.set(Math.cos(angle)*36, 0, Math.sin(angle)*36);
        portGroup.lookAt(0, 0, 0); 
        
        containmentGroup.add(portGroup);
    }
    
    group.add(containmentGroup);
    
    parts.push({
        name: "Outer Containment Torus",
        description: "The primary high-vacuum vessel where GUT plasma circulates before injection. Built with layered exotic matter shielding.",
        material: "DarkSteel / Tinted Glass",
        function: "Maintains absolute vacuum and shields the facility from raw gamma radiation emissions.",
        assemblyOrder: 3,
        connections: ["Support Pillars", "Superconducting Toroidal Coils"],
        failureEffect: "Atmospheric intrusion causing plasma quenching and massive radiation burst.",
        cascadeFailures: ["GUT Accelerator Rings"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // ==========================================
    // PART 4: Superconducting Toroidal Field Coils
    // ==========================================
    const tCoilsGroup = new THREE.Group();
    tCoilsGroup.position.y = 22;
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const coilGroup = new THREE.Group();
        
        // Massive D-shaped coil using modified geometry
        // Simulated with a stretched Torus
        const coilGeo = new THREE.TorusGeometry(13, 2.5, 32, 64);
        const coil = new THREE.Mesh(coilGeo, superConductorMat);
        coil.scale.set(1, 1.4, 1); // Stretch to D-shape approximation
        coilGroup.add(coil);
        
        // Copper windings (100 per coil for insane detail)
        const windingsGroup = new THREE.Group();
        const wGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.4, 16);
        for(let w=0; w<40; w++) {
            const wAngle = (w/40) * Math.PI * 2;
            const winding = new THREE.Mesh(wGeo, copper);
            winding.position.set(Math.cos(wAngle)*13, Math.sin(wAngle)*13*1.4, 0);
            winding.lookAt(0, 0, 0);
            winding.rotation.x = Math.PI/2;
            windingsGroup.add(winding);
        }
        coilGroup.add(windingsGroup);
        
        // Glow strips on coils
        const stripGeo = new THREE.TorusGeometry(13, 2.51, 4, 64);
        const strip = new THREE.Mesh(stripGeo, neonBlueMat);
        strip.scale.set(1, 1.4, 1);
        coilGroup.add(strip);
        animGlows.push({ material: neonBlueMat, base: 1, amplitude: 2, speed: 3 });
        
        coilGroup.position.set(Math.cos(angle)*28, 0, Math.sin(angle)*28);
        coilGroup.rotation.y = -angle; 
        tCoilsGroup.add(coilGroup);
    }
    group.add(tCoilsGroup);
    
    parts.push({
        name: "Superconducting Toroidal Field Coils",
        description: "16 massive D-shaped superconducting magnets cooled to 1.2 Kelvin, wrapped in ultra-pure copper.",
        material: "SuperConductor / Copper",
        function: "Generates the immense toroidal magnetic field necessary to confine the pre-collision plasma.",
        assemblyOrder: 4,
        connections: ["Outer Containment Torus", "Cryogenic Pipes"],
        failureEffect: "Quench event releasing gigajoules of thermal energy.",
        cascadeFailures: ["Outer Containment Torus", "Coolant Pipes"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: -70 }
    });

    // ==========================================
    // PART 5: Poloidal Field Coils
    // ==========================================
    const pCoilsGroup = new THREE.Group();
    pCoilsGroup.position.y = 22;
    
    const pRadius = [10, 18, 38, 45];
    const pHeights = [15, 12, 10, 5];
    
    for(let p=0; p<4; p++) {
        // Upper
        const pGeoU = new THREE.TorusGeometry(pRadius[p], 1.5, 32, 128);
        const pMeshU = new THREE.Mesh(pGeoU, superConductorMat);
        pMeshU.rotation.x = Math.PI/2;
        pMeshU.position.y = pHeights[p];
        pCoilsGroup.add(pMeshU);
        
        // Lower
        const pGeoL = new THREE.TorusGeometry(pRadius[p], 1.5, 32, 128);
        const pMeshL = new THREE.Mesh(pGeoL, superConductorMat);
        pMeshL.rotation.x = Math.PI/2;
        pMeshL.position.y = -pHeights[p];
        pCoilsGroup.add(pMeshL);
    }
    group.add(pCoilsGroup);

    parts.push({
        name: "Poloidal Field Stabilizers",
        description: "Horizontal superconducting rings positioned above and below the main torus.",
        material: "SuperConductor",
        function: "Provides vertical stability and shapes the plasma cross-section.",
        assemblyOrder: 5,
        connections: ["Toroidal Field Coils"],
        failureEffect: "Plasma touches the containment walls, vaporizing the interior.",
        cascadeFailures: ["Outer Containment Torus"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // ==========================================
    // PART 6: Linear Particle Injectors (4x)
    // ==========================================
    const injectorsGroup = new THREE.Group();
    injectorsGroup.position.y = 22;
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        const iGroup = new THREE.Group();
        
        // Main barrel
        const barrelGeo = new THREE.CylinderGeometry(1.5, 2.5, 35, 32);
        const barrel = new THREE.Mesh(barrelGeo, darkSteel);
        barrel.rotation.z = Math.PI/2;
        barrel.position.x = 30; // outside pointing in
        iGroup.add(barrel);
        
        // Focusing rings
        for(let r=0; r<8; r++) {
            const ringGeo = new THREE.TorusGeometry(3.5 - r*0.1, 0.6, 16, 32);
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.rotation.y = Math.PI/2;
            ring.position.x = 15 + r * 4;
            iGroup.add(ring);
            animRotators.push({ mesh: ring, axis: 'x', speed: 0.05 + r*0.02 });
        }
        
        // Heat sinks on injectors
        for(let h=0; h<10; h++) {
            const finGeo = new THREE.BoxGeometry(4, 4, 0.2);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.x = 20 + h * 1.5;
            iGroup.add(fin);
        }
        
        // Laser emission core
        const laserGeo = new THREE.CylinderGeometry(0.3, 0.3, 30, 16);
        const laser = new THREE.Mesh(laserGeo, laserMat);
        laser.rotation.z = Math.PI/2;
        laser.position.x = 25;
        iGroup.add(laser);
        beams.push(laser);
        
        iGroup.rotation.y = -angle;
        injectorsGroup.add(iGroup);
    }
    group.add(injectorsGroup);

    parts.push({
        name: "GUT-Scale Linear Injectors",
        description: "Four hyper-velocity linear accelerators loaded with progressive focusing magnets.",
        material: "DarkSteel / Chrome / Aluminum",
        function: "Accelerates exotic precursor matter to 0.999999999c for absolute core collision.",
        assemblyOrder: 6,
        connections: ["Collision Chamber Core", "Outer Containment Torus"],
        failureEffect: "Beam misalignment instantly vaporizing the core.",
        cascadeFailures: ["Collision Chamber Core"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: -60, y: 22, z: -60 }
    });

    // ==========================================
    // PART 7: Central Collision Chamber Core
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 22;
    
    // Core containment sphere
    const coreSphereGeo = new THREE.SphereGeometry(7, 64, 64);
    coreSphere = new THREE.Mesh(coreSphereGeo, glowingCoreMat);
    coreGroup.add(coreSphere);
    animGlows.push({ material: glowingCoreMat, base: 10, amplitude: 5, speed: 2 });
    
    // High-tech shielding lattice (Icosahedron wireframe)
    const latticeGeo = new THREE.IcosahedronGeometry(7.5, 3);
    const latticeMat = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.5 });
    const lattice = new THREE.Mesh(latticeGeo, latticeMat);
    coreGroup.add(lattice);
    animRotators.push({ mesh: lattice, axis: 'y', speed: 0.01 });
    animRotators.push({ mesh: lattice, axis: 'x', speed: 0.005 });
    
    // Inner primordial plasma
    const innerPlasmaGeo = new THREE.SphereGeometry(4, 32, 32);
    const innerPlasma = new THREE.Mesh(innerPlasmaGeo, plasmaMat);
    coreGroup.add(innerPlasma);
    animRotators.push({ mesh: innerPlasma, axis: 'z', speed: 0.1 });
    animRotators.push({ mesh: innerPlasma, axis: 'y', speed: -0.05 });
    
    // Sensor ring
    const sRingGeo = new THREE.TorusGeometry(8, 0.5, 32, 64);
    const sRing = new THREE.Mesh(sRingGeo, chrome);
    coreGroup.add(sRing);
    animRotators.push({ mesh: sRing, axis: 'x', speed: 0.08 });
    animRotators.push({ mesh: sRing, axis: 'y', speed: 0.04 });

    group.add(coreGroup);
    
    parts.push({
        name: "Collision Chamber Core",
        description: "The absolute epicenter of the forge. A hyper-dimensional glass-steel containment sphere observing GUT conditions.",
        material: "Glowing Core / Lattice Shielding",
        function: "Contains the trillion-degree plasma and hosts the topological defect formation.",
        assemblyOrder: 7,
        connections: ["Linear Injectors", "Topological Defect Traps"],
        failureEffect: "Release of primordial universe heat, vaporizing the entire continent.",
        cascadeFailures: ["Topological Defect Traps", "Monopole Containment"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: 0 }
    });

    // ==========================================
    // PART 8: Topological Defect Traps (Upper and Lower)
    // ==========================================
    const trapsGroup = new THREE.Group();
    trapsGroup.position.y = 22;
    
    function createTrapAssembly(isUpper) {
        const asmGroup = new THREE.Group();
        const dir = isUpper ? 1 : -1;
        
        // Massive base column housing electromagnetics
        const colGeo = new THREE.CylinderGeometry(3, 5, 12, 32);
        const col = new THREE.Mesh(colGeo, darkSteel);
        col.position.y = dir * 18;
        asmGroup.add(col);

        // Heavy locking mechanism
        const lockGeo = new THREE.TorusGeometry(4.5, 1, 16, 32);
        const lock = new THREE.Mesh(lockGeo, steel);
        lock.position.y = dir * 13;
        lock.rotation.x = Math.PI/2;
        asmGroup.add(lock);
        
        // Articulated trapping claws (4x per trap)
        const claws = new THREE.Group();
        claws.position.y = dir * 12;
        for(let i=0; i<4; i++) {
            const angle = (i/4) * Math.PI * 2;
            const arm = new THREE.Group();
            
            // Heavy Hinge
            const hingeGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
            const hinge = new THREE.Mesh(hingeGeo, copper);
            hinge.rotation.x = Math.PI/2;
            arm.add(hinge);
            
            // Primary segment
            // Created with a custom shape using grouped primitives
            const segGeo = new THREE.CylinderGeometry(0.8, 1.2, 8, 16);
            const seg = new THREE.Mesh(segGeo, steel);
            seg.position.y = dir * -4;
            seg.rotation.x = dir * 0.4;
            arm.add(seg);

            // Hydraulic actuator for arm
            const act = createPiston(0.4, 4);
            act.group.position.set(0, dir * 2, dir * 2);
            act.group.rotation.x = dir * -0.4;
            arm.add(act.group);
            pistons.push({ inner: act.inner, basePos: act.inner.position.y, dir: dir });
            
            // Effector Tip (Monopole Grip)
            const tipGeo = new THREE.ConeGeometry(0.8, 3, 16);
            const tipMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 4 });
            const tip = new THREE.Mesh(tipGeo, tipMat);
            tip.position.set(0, dir * -8.5, dir * -1.8);
            if(isUpper) tip.rotation.x = Math.PI; 
            arm.add(tip);
            
            arm.rotation.y = angle;
            claws.add(arm);
            trapClaws.push({ arm: arm, baseRotX: arm.rotation.x, dir: dir });
        }
        asmGroup.add(claws);
        return asmGroup;
    }
    
    trapsGroup.add(createTrapAssembly(true));
    trapsGroup.add(createTrapAssembly(false));
    group.add(trapsGroup);

    parts.push({
        name: "Topological Defect Traps",
        description: "Massive electro-mechanical claws tipped with localized 100-Tesla magnetic field generators.",
        material: "DarkSteel / Copper / Cyan Emissive",
        function: "Snaps shut precisely at monopole generation to prevent it from escaping or sinking to Earth's core.",
        assemblyOrder: 8,
        connections: ["Collision Chamber Core"],
        failureEffect: "Monopole escapes gravity, tearing through the planet's mantle.",
        cascadeFailures: ["Planetary Integrity"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 0 }
    });

    // ==========================================
    // PART 9: Cryogenic Cooling Piping Network
    // ==========================================
    const pipeGroup = new THREE.Group();
    // Complex bezier curves for chaotic but realistic plumbing
    class ComplexCurve extends THREE.Curve {
        constructor(r1, r2, yOff) { 
            super(); 
            this.r1 = r1; 
            this.r2 = r2; 
            this.yOff = yOff;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const rad = this.r1 + Math.sin(t * Math.PI * 8) * this.r2;
            const tx = Math.cos(2 * Math.PI * t) * rad;
            const ty = this.yOff + Math.sin(4 * Math.PI * t) * 5;
            const tz = Math.sin(2 * Math.PI * t) * rad;
            return optionalTarget.set(tx, ty, tz);
        }
    }
    
    for(let i=0; i<12; i++) {
        const path = new ComplexCurve(28, 4, 22 + (Math.random()-0.5)*15);
        const pipe = createCoolingPipe(path, 0.6, 120);
        pipe.rotation.y = (i/12)*Math.PI * 2;
        pipeGroup.add(pipe);
    }
    group.add(pipeGroup);

    parts.push({
        name: "Cryogenic Cooling Network",
        description: "Intricate array of corrugated rubberized liquid helium conduits wrapping the facility.",
        material: "Rubber / Aluminum",
        function: "Drains the immense thermal bloom from the superconducting coils.",
        assemblyOrder: 9,
        connections: ["Toroidal Field Coils", "Heat Exchangers"],
        failureEffect: "Explosive boiling of liquid helium and immediate coil quench.",
        cascadeFailures: ["Toroidal Field Coils", "Poloidal Stabilizers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: -80 }
    });

    // ==========================================
    // PART 10: Exhaust Stacks and Heat Exchangers
    // ==========================================
    const exhaustGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        
        const stackGeo = new THREE.CylinderGeometry(3, 4, 30, 32);
        const stack = new THREE.Mesh(stackGeo, steel);
        
        stack.position.set(Math.cos(angle)*50, 15, Math.sin(angle)*50);
        
        // Heat sink fins on stack
        for(let f=0; f<10; f++) {
            const finGeo = new THREE.TorusGeometry(3.5 + (10-f)*0.1, 0.5, 8, 32);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = -10 + f*2;
            fin.rotation.x = Math.PI/2;
            stack.add(fin);
        }
        
        // Warning light
        const lightGeo = new THREE.SphereGeometry(1, 16, 16);
        const lightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.y = 16;
        stack.add(light);
        animGlows.push({ material: lightMat, base: 0.5, amplitude: 5, speed: 10 }); // Fast blinking
        
        exhaustGroup.add(stack);
    }
    group.add(exhaustGroup);

    parts.push({
        name: "Thermodynamic Exhaust Stacks",
        description: "Massive venting chimneys equipped with aluminum heat-sink fins and hazard lights.",
        material: "Steel / Aluminum / Red Emissive",
        function: "Vents off excess low-energy plasma and boiled-off coolant gases.",
        assemblyOrder: 10,
        connections: ["Cryogenic Cooling Network", "Foundation Platform"],
        failureEffect: "Pressure buildup leading to explosive rupture of the primary cooling loop.",
        cascadeFailures: ["Cryogenic Cooling Network"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 80, y: 20, z: 80 }
    });

    // ==========================================
    // PART 11: Control Cabins and Observation Decks
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 15, 60); // Placed at the edge
    
    // Main cabin box (using grouped planes/cylinders for complexity rather than simple box)
    const floorGeo = new THREE.CylinderGeometry(15, 15, 1, 32, 1, false, 0, Math.PI);
    const floor = new THREE.Mesh(floorGeo, darkSteel);
    cabinGroup.add(floor);
    
    const roof = new THREE.Mesh(floorGeo, steel);
    roof.position.y = 10;
    cabinGroup.add(roof);
    
    // Glass window curved
    const windowGeo = new THREE.CylinderGeometry(15, 15, 10, 32, 1, true, 0, Math.PI);
    const window = new THREE.Mesh(windowGeo, tinted);
    window.position.y = 5;
    cabinGroup.add(window);
    
    // Consoles inside
    for(let c=0; c<5; c++) {
        const consoleGeo = new THREE.BoxGeometry(2, 3, 2);
        const cons = new THREE.Mesh(consoleGeo, steel);
        const cAngle = (c/4) * Math.PI - Math.PI/2 + Math.PI/4;
        cons.position.set(Math.cos(cAngle)*10, 2, Math.sin(cAngle)*10);
        cons.rotation.y = -cAngle + Math.PI/2;
        
        // Screen
        const screenGeo = new THREE.PlaneGeometry(1.5, 1);
        const screen = new THREE.Mesh(screenGeo, displayScreenMat);
        screen.position.set(0, 1, 1.01);
        cons.add(screen);
        
        cabinGroup.add(cons);
    }
    
    cabinGroup.lookAt(0, 15, 0);
    group.add(cabinGroup);

    parts.push({
        name: "Observation & Control Deck",
        description: "Heavily shielded command center featuring curved tinted blast glass and holographic diagnostics.",
        material: "DarkSteel / Tinted Glass",
        function: "Houses the researchers overseeing the GUT symmetry breaking event.",
        assemblyOrder: 11,
        connections: ["Foundation Platform"],
        failureEffect: "Lethal radiation exposure to all operating personnel.",
        cascadeFailures: ["Human Error Cascade"],
        originalPosition: { x: 0, y: 15, z: 60 },
        explodedPosition: { x: 0, y: 15, z: 120 }
    });

    // ==========================================
    // PART 12: Radar & Sensor Arrays
    // ==========================================
    const radarGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const rGroup = new THREE.Group();
        
        const mountGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.position.y = 2.5;
        rGroup.add(mount);
        
        const dishGroup = new THREE.Group();
        dishGroup.position.y = 5;
        
        const dishGeo = new THREE.SphereGeometry(3, 16, 16, 0, Math.PI*2, 0, Math.PI/4);
        const dish = new THREE.Mesh(dishGeo, chrome);
        dish.rotation.x = Math.PI/2;
        dishGroup.add(dish);
        
        const receiverGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
        const receiver = new THREE.Mesh(receiverGeo, warningMat);
        receiver.position.z = 1.5;
        receiver.rotation.x = Math.PI/2;
        dishGroup.add(receiver);
        
        rGroup.add(dishGroup);
        rGroup.position.set(Math.cos(angle)*35, 30, Math.sin(angle)*35);
        rGroup.lookAt(0, 22, 0); // pointing roughly at core
        
        radarDishes.push(dishGroup);
        radarGroup.add(rGroup);
    }
    group.add(radarGroup);

    parts.push({
        name: "Quantum Field Sensor Arrays",
        description: "High-frequency radar dishes designed to detect topological disruptions in spacetime.",
        material: "Steel / Chrome / Warning Yellow",
        function: "Provides microsecond telemetry on the forming magnetic monopole.",
        assemblyOrder: 12,
        connections: ["Outer Containment Torus"],
        failureEffect: "Loss of telemetry, causing the traps to miss the monopole capture window.",
        cascadeFailures: ["Topological Defect Traps"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 90, z: 0 }
    });


    // ==========================================
    // PART 13: Particle Shower System
    // ==========================================
    const pGroup = new THREE.Group();
    pGroup.position.y = 22;
    const pGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff5500, emissiveIntensity: 8 });
    for(let i=0; i<400; i++) {
        const p = new THREE.Mesh(pGeo, pMat);
        pGroup.add(p);
        
        // Random isotropic velocity vector for explosion
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const vx = Math.sin(phi) * Math.cos(theta);
        const vy = Math.sin(phi) * Math.sin(theta);
        const vz = Math.cos(phi);
        
        const speed = 10 + Math.random() * 20;
        
        particleSystem.push({
            mesh: p,
            vel: new THREE.Vector3(vx * speed, vy * speed, vz * speed),
            basePos: new THREE.Vector3(0,0,0),
            life: Math.random()
        });
    }
    group.add(pGroup);

    parts.push({
        name: "GUT Particle Shower Remnants",
        description: "Hundreds of highly energetic subatomic particles resulting from the ultimate collision.",
        material: "High-Energy Orange Plasma",
        function: "The natural radioactive byproduct of spontaneous symmetry breaking.",
        assemblyOrder: 13,
        connections: ["Collision Chamber Core"],
        failureEffect: "Excessive radiation blinding sensors and degrading the glass containment.",
        cascadeFailures: ["Observation & Control Deck"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: 0 }
    });

    // ==========================================
    // PART 14 & 15: The Magnetic Monopole and its Field Lines
    // ==========================================
    const monoGroup = new THREE.Group();
    monoGroup.position.y = 22;
    
    // Core singular monopole
    const mGeo = new THREE.SphereGeometry(1.2, 64, 64);
    monopoleMesh = new THREE.Mesh(mGeo, monopoleMat);
    monoGroup.add(monopoleMesh);
    animRotators.push({ mesh: monopoleMesh, axis: 'y', speed: 0.5 });
    animRotators.push({ mesh: monopoleMesh, axis: 'z', speed: 0.3 });
    
    // Field lines (Radiating twisted tubes showing divergent pure magnetic field)
    for(let i=0; i<16; i++) {
        // Complex torus knot to represent tangled extreme field lines stabilizing
        const fGeo = new THREE.TorusKnotGeometry(5, 0.1, 150, 16, 2, 5);
        const fLine = new THREE.Mesh(fGeo, fieldLineMat);
        fLine.rotation.x = Math.random() * Math.PI;
        fLine.rotation.y = Math.random() * Math.PI;
        monoGroup.add(fLine);
        fieldLines.push(fLine);
        
        animRotators.push({ mesh: fLine, axis: 'x', speed: 0.03 + Math.random()*0.04 });
        animRotators.push({ mesh: fLine, axis: 'y', speed: 0.03 + Math.random()*0.04 });
    }
    
    group.add(monoGroup);

    parts.push({
        name: "The Magnetic Monopole (Target)",
        description: "An isolated North or South magnetic pole, an incredibly dense point mass radiating purely divergent magnetic field lines.",
        material: "Exotic Monopole Void Material",
        function: "The ultimate prize of high-energy physics, proving Grand Unified Theories.",
        assemblyOrder: 14,
        connections: ["Topological Defect Traps"],
        failureEffect: "Annihilation with anti-monopole, converting entirely into pure energy.",
        cascadeFailures: ["Complete core destruction via matter-antimatter equivalent release"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: 40 }
    });

    parts.push({
        name: "Divergent Magnetic Field Lines",
        description: "Visible distortion of spacetime manifesting as glowing cyan tubes of infinite magnetic flux.",
        material: "Cyan Emissive Wireframe",
        function: "Interacts violently with any moving electric charges in the vicinity.",
        assemblyOrder: 15,
        connections: ["The Magnetic Monopole (Target)"],
        failureEffect: "Field collapse due to instability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: -40 }
    });

    // --- COMPLEX PHASE-BASED ANIMATION LOGIC ---
    // Phases (20 second loop): 
    // 0.0 - 5.0s : Charging (Torus spinning, core glowing, injectors off, traps open)
    // 5.0 - 8.0s : Injection (Beams fire, intensity increases wildly)
    // 8.0 - 8.2s : Collision (Massive flash, particle shower explodes)
    // 8.2 - 15.0s: Monopole forms, traps snap shut, field lines radiate
    // 15.0 - 20.0s: Cooldown, monopole fades, traps reset
    
    let localTime = 0;
    
    function animate(time, speed, meshes) {
        const dt = 0.016 * speed; // approximate delta time
        localTime += dt;
        
        const phaseTime = localTime % 20; 
        
        // 1. Continuous Rotations (Radar, Lathe, Coils)
        animRotators.forEach(rot => {
            rot.mesh.rotation[rot.axis] += rot.speed * dt;
        });

        radarDishes.forEach(dish => {
            dish.rotation.z += 0.02 * speed; 
        });
        
        // 2. Continuous Glow Pulsing
        animGlows.forEach(g => {
            g.material.emissiveIntensity = g.base + Math.sin(localTime * g.speed) * g.amplitude;
        });
        
        // --- PHASE LOGIC ---
        if (phaseTime < 5) {
            // PHASE 1: CHARGING
            beams.forEach(b => b.visible = false);
            particleSystem.forEach(p => p.mesh.visible = false);
            monopoleMesh.visible = false;
            fieldLines.forEach(f => f.visible = false);
            
            // Open traps smoothly
            trapClaws.forEach(c => {
                c.arm.rotation.x = THREE.MathUtils.lerp(c.arm.rotation.x, c.baseRotX + c.dir*0.6, 0.05);
            });
            // Pistons follow the arm rotation loosely
            pistons.forEach(p => {
                p.inner.position.y = THREE.MathUtils.lerp(p.inner.position.y, p.basePos, 0.05);
            });

            coreSphere.material.emissiveIntensity = 5 + Math.sin(localTime * 10) * 2;
            
        } else if (phaseTime < 8) {
            // PHASE 2: INJECTION
            beams.forEach(b => {
                b.visible = true;
                // Laser pulsing
                b.scale.x = 1 + Math.sin(localTime * 80) * 0.4;
                b.scale.z = 1 + Math.sin(localTime * 80) * 0.4;
            });
            coreSphere.material.emissiveIntensity = 20 + Math.random() * 30; // violent flicker
            
        } else if (phaseTime < 15) {
            // PHASE 3 & 4: COLLISION AND MONOPOLE FORMATION
            beams.forEach(b => b.visible = false);
            
            if (phaseTime < 8.2) {
                // Initial Flash
                coreSphere.material.emissiveIntensity = 150;
                // Reset and show particles
                particleSystem.forEach(p => {
                    p.mesh.position.set(0,0,0);
                    p.life = 1.0;
                    p.mesh.visible = true;
                    p.mesh.material.opacity = 1.0;
                });
            } else {
                // Flash fades
                coreSphere.material.emissiveIntensity = THREE.MathUtils.lerp(coreSphere.material.emissiveIntensity, 2, 0.05);
            }
            
            // Particle shower expansion
            particleSystem.forEach(p => {
                if(p.life > 0) {
                    p.mesh.position.addScaledVector(p.vel, dt);
                    p.life -= dt * 0.4; // fade over time
                    p.mesh.material.opacity = p.life;
                    p.mesh.scale.setScalar(p.life);
                } else {
                    p.mesh.visible = false;
                }
            });
            
            // Monopole Appears!
            if (phaseTime > 8.5) {
                monopoleMesh.visible = true;
                fieldLines.forEach(f => {
                    f.visible = true;
                    f.material.opacity = THREE.MathUtils.lerp(f.material.opacity, 0.6, 0.05);
                });
                
                // Traps snap shut aggressively!
                trapClaws.forEach(c => {
                    c.arm.rotation.x = THREE.MathUtils.lerp(c.arm.rotation.x, c.baseRotX - c.dir*0.25, 0.2);
                });
                // Pistons compress
                pistons.forEach(p => {
                    p.inner.position.y = THREE.MathUtils.lerp(p.inner.position.y, p.basePos - 2, 0.2);
                });
                
                // Monopole erratic bobbing due to magnetic repulsion
                monopoleMesh.position.y = Math.sin(localTime * 15) * 0.3;
                monopoleMesh.position.x = Math.cos(localTime * 12) * 0.2;
            }

        } else {
            // PHASE 5: COOLDOWN & RESET
            trapClaws.forEach(c => {
                c.arm.rotation.x = THREE.MathUtils.lerp(c.arm.rotation.x, c.baseRotX + c.dir*0.6, 0.03);
            });
            pistons.forEach(p => {
                p.inner.position.y = THREE.MathUtils.lerp(p.inner.position.y, p.basePos, 0.03);
            });

            // Fade out the monopole slowly
            monopoleMesh.material.emissiveIntensity = THREE.MathUtils.lerp(monopoleMesh.material.emissiveIntensity, 0, 0.03);
            fieldLines.forEach(f => {
                f.material.opacity = THREE.MathUtils.lerp(f.material.opacity, 0, 0.03);
            });
            
            if(phaseTime > 19) {
                // Hard reset just in case for next loop
                monopoleMesh.material.emissiveIntensity = 10;
                fieldLines.forEach(f => f.material.opacity = 0);
                monopoleMesh.position.set(0,0,0);
            }
        }
    }

    const description = "Ultra God-Tier Magnetic Monopole Forge. Utilizing Grand Unified Theory (GUT) scale energies, this massive apparatus collides specialized exotic particle beams at 0.999999999c. The intense heat and density simulate the conditions of the first trillionth of a second of the universe, precipitating topological defects in the form of stable, super-massive magnetic monopoles. These are immediately secured by 100-Tesla density topological defect traps to prevent them from annihilating or tearing through the Earth's crust.";
    
    const quizQuestions = [
        {
            question: "In the context of Grand Unified Theories (GUTs), what topological defect is formed during the spontaneous symmetry breaking of a semi-simple gauge group to the Standard Model gauge group, and what is its lower mass bound determined by?",
            options: [
                "Cosmic String; determined by the Kibble mechanism scale.",
                "Domain Wall; determined by the Higgs vacuum expectation value.",
                "'t Hooft-Polyakov Monopole; determined by the ratio of the vector boson mass to the fine-structure constant.",
                "Axion; determined by the Peccei-Quinn symmetry breaking scale."
            ],
            correctAnswer: 2,
            explanation: "The 't Hooft-Polyakov monopole arises when a GUT group breaks to a group containing a U(1) factor. Its mass is roughly the gauge boson mass divided by the fine-structure constant, making them incredibly massive (typically ~10^16 GeV)."
        },
        {
            question: "The Parker Bound places an upper limit on the astrophysical flux of magnetic monopoles. What physical mechanism is the primary basis for this theoretical constraint?",
            options: [
                "The decay rate of monopoles into leptons via the Callan-Rubakov effect.",
                "The annihilation of monopoles with antimonopoles in the early universe.",
                "The survival of the galactic magnetic field, which would be short-circuited by a high density of monopoles.",
                "The Cherenkov radiation emitted by relativistic monopoles in the interstellar medium."
            ],
            correctAnswer: 2,
            explanation: "Magnetic monopoles are accelerated by galactic magnetic fields, extracting energy from them. If the monopole flux were too high, they would drain the galactic magnetic field faster than the galactic dynamo could regenerate it."
        },
        {
            question: "According to the Callan-Rubakov effect, what extraordinary phenomenon occurs when a GUT magnetic monopole interacts with a proton?",
            options: [
                "The proton's charge is inverted, forming an antiproton.",
                "The monopole acts as a catalyst for baryon number violating proton decay with strong-interaction-like cross sections.",
                "The monopole binds to the proton, creating a magnetically charged macroscopic atom.",
                "The proton is accelerated to near light speed by the intense divergent magnetic field."
            ],
            correctAnswer: 1,
            explanation: "The Callan-Rubakov effect predicts that GUT monopoles have a core filled with GUT-scale fields that can catalyze nucleon decay (e.g., p -> e+ + pi0) at unsuppressed, strong-interaction rates, despite the GUT scale being extremely high."
        },
        {
            question: "What is the correct expression for the Dirac quantization condition relating electric charge (e) and magnetic charge (g)?",
            options: [
                "eg = n ħ c",
                "eg = (n ħ c) / 2",
                "eg = (n ħ) / (2c)",
                "eg = 2n π ħ c"
            ],
            correctAnswer: 1,
            explanation: "In 1931, Paul Dirac showed that quantum mechanics allows for magnetic monopoles only if the product of any electric charge and magnetic charge satisfies eg = nħc/2 (in CGS units), which beautifully explains the quantization of electric charge."
        },
        {
            question: "In inflationary cosmology, how is the 'monopole problem' typically resolved?",
            options: [
                "By postulating that monopoles decay rapidly into dark matter candidates.",
                "By demonstrating that Grand Unified Theories do not actually predict monopole formation.",
                "By an exponential expansion of the universe after monopole creation, diluting their number density to unobservably low levels.",
                "By concentrating all monopoles into the cores of supermassive black holes during galaxy formation."
            ],
            correctAnswer: 2,
            explanation: "Cosmic inflation proposes a period of rapid, exponential expansion of the early universe. This expansion effectively dilutes the density of primordial relics, including heavy GUT monopoles, down to perhaps one per observable universe, solving the 'monopole problem'."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
