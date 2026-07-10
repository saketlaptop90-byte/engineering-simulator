import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Animation Collections
    const timelineNodes = [];
    const timelineBranches = [];
    const ghostLayers = [];
    const lasers = [];
    const gasParticles = [];
    const kineticBlade = { mesh: null, rails: [] };
    const rings = [];
    const hydraulicPistons = [];
    const lifeSupportHoses = [];
    const consoleLights = [];
    const tapeReels = [];
    const gears = [];
    const superpositionJitterMeshes = [];

    const description = "GOD-TIER QUANTUM IMMORTALITY CHAMBER. An atrociously complex apparatus designed to empirically test and enforce the Many-Worlds Interpretation (MWI) of quantum mechanics upon the occupant. The chamber continuously measures a quantum superposition state (via radioactive decay). If the state results in a 'kill' signal, extreme lethal mechanisms (lasers, cyanide gas, kinetic crushers) are instantly deployed. According to MWI, the universe branches, and the occupant's consciousness can only subjectively continue in the timeline where the quantum event resulted in survival. Features a superposition containment stasis pod, highly articulated threat emitters, and a macroscopic holographic projection of the branching multiverse timelines. Do not operate without theoretical physics supervision.";

    // Custom Glowing & Ethereal Materials
    const holoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2, 
        transparent: true, opacity: 0.7, wireframe: false, side: THREE.DoubleSide 
    });
    const laserBeamMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 10, 
        transparent: true, opacity: 0.9 
    });
    const gasMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, emissive: 0x004400, emissiveIntensity: 1, 
        transparent: true, opacity: 0.4, depthWrite: false 
    });
    const superpositionMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, emissive: 0xaaaaff, emissiveIntensity: 0.8, 
        transparent: true, opacity: 0.15, depthWrite: false, side: THREE.DoubleSide
    });
    const warningMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.5 
    });
    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x002200, emissive: 0x00ff00, emissiveIntensity: 0.5 
    });
    const quantumCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0xaa00aa, emissiveIntensity: 3,
        transparent: true, opacity: 0.8, wireframe: true
    });

    // Helper Function for Parts Registration
    let partIdCounter = 0;
    function registerPart(name, mesh, desc, matName, funcDesc, order, failEff, cascade, ox, oy, oz, ex, ey, ez) {
        mesh.position.set(ox, oy, oz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Save initial coordinates for animation references
        mesh.userData.origin = new THREE.Vector3(ox, oy, oz);
        mesh.userData.id = partIdCounter++;

        group.add(mesh);
        parts.push({
            name,
            description: desc,
            material: matName,
            function: funcDesc,
            assemblyOrder: order,
            connections: [],
            failureEffect: failEff,
            cascadeFailures: cascade,
            originalPosition: { x: ox, y: oy, z: oz },
            explodedPosition: { x: ex, y: ey, z: ez }
        });
        return mesh;
    }

    // ==========================================
    // SECTOR 1: QUANTUM FOUNDATION & CONTAINMENT
    // ==========================================
    
    // Main Hexadeca-Foundation (16 sides)
    const baseShape = new THREE.Shape();
    const numSides = 16;
    for (let i = 0; i < numSides; i++) {
        const angle = (i / numSides) * Math.PI * 2;
        const radius = i % 2 === 0 ? 35 : 32;
        if (i === 0) baseShape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else baseShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    baseShape.closePath();
    const baseExtrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    registerPart("Decoherence Shielded Foundation", baseMesh, "Massive vibration-isolated platform.", "darkSteel", "Prevents environmental thermal noise from collapsing the wave function prematurely.", 1, "Immediate wave function collapse (Certain Death)", ["Timeline splitting failure", "Macroscopic entanglement"], 0, -4, 0, 0, -40, 0);

    // Grid panels and Sub-flooring
    for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const panelGeo = new THREE.BoxGeometry(5, 0.5, 12);
        const panel = new THREE.Mesh(panelGeo, steel);
        const px = Math.cos(angle) * 22;
        const pz = Math.sin(angle) * 22;
        panel.rotation.y = -angle;
        registerPart(`Superconducting Floor Panel ${i}`, panel, "Liquid helium cooled floor access.", "steel", "Thermal regulation of quantum triggers.", 2, "Localized overheating", ["Coolant leak"], px, 0.25, pz, px * 1.5, -5, pz * 1.5);
        
        // Add tiny rivets/bolts to each panel
        for(let j=0; j<4; j++) {
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8), chrome);
            const bx = px + (j<2 ? -1.5 : 1.5) * Math.cos(angle) + (j%2===0 ? -4 : 4) * Math.sin(angle);
            const bz = pz + (j<2 ? -1.5 : 1.5) * Math.sin(angle) + (j%2===0 ? 4 : -4) * Math.cos(angle);
            registerPart(`Panel Bolt ${i}-${j}`, bolt, "High-tension containment bolt", "chrome", "Secures floor against gravitational anomalies", 3, "Panel rattle", [], bx, 0.5, bz, bx*2, 10, bz*2);
        }
    }

    // Coolant Pipes (Outer Ring)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*30, -2, Math.sin(angle)*30),
            new THREE.Vector3(Math.cos(angle)*28, 2, Math.sin(angle)*28),
            new THREE.Vector3(Math.cos(angle)*25, 4, Math.sin(angle)*25),
            new THREE.Vector3(Math.cos(angle)*20, 1, Math.sin(angle)*20)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.8, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        registerPart(`Liquid Helium Pipe ${i}`, pipe, "Superfluid cooling line", "copper", "Maintains near absolute zero for the state detector.", 4, "Quantum state thermalization", ["False trigger", "Melt down"], 0, 0, 0, Math.cos(angle)*10, 20, Math.sin(angle)*10);
    }

    // ==========================================
    // SECTOR 2: DATA PROCESSING MAINFRAMES
    // ==========================================
    const consoleGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
        const cx = Math.cos(angle) * 26;
        const cz = Math.sin(angle) * 26;
        
        // Rack Base
        const rackGeo = new THREE.BoxGeometry(6, 12, 4);
        const rack = new THREE.Mesh(rackGeo, darkSteel);
        rack.rotation.y = -angle;
        registerPart(`Quantum Mainframe Rack ${i}`, rack, "High-density qubit processing array", "darkSteel", "Calculates branch probabilities in real-time.", 5, "Logic error", ["Miscalculated survival rate"], cx, 6, cz, cx*1.2, 16, cz*1.2);

        // Screens
        const screenGeo = new THREE.BoxGeometry(5, 3, 0.2);
        const screen = new THREE.Mesh(screenGeo, screenMaterial);
        screen.rotation.y = -angle;
        registerPart(`Mainframe Screen ${i}`, screen, "HUD for timeline data", "glass", "Displays Many-Worlds statistics", 6, "Display failure", [], cx - Math.sin(-angle)*2.1, 9, cz - Math.cos(-angle)*2.1, cx*1.3, 20, cz*1.3);

        // Blinking Console Lights
        for (let l = 0; l < 16; l++) {
            const lightGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const light = new THREE.Mesh(lightGeo, warningMaterial);
            light.rotation.y = -angle;
            const lx = cx - Math.sin(-angle)*2.1 + (Math.random()-0.5)*4;
            const ly = 2 + Math.random()*4;
            const lz = cz - Math.cos(-angle)*2.1 + (Math.random()-0.5)*3;
            registerPart(`Processing Node ${i}-${l}`, light, "Qubit status indicator", "plastic", "Visual feedback", 7, "None", [], lx, ly, lz, lx*1.5, ly*2, lz*1.5);
            consoleLights.push(light);
        }

        // Tape Drives (Spinning Reels)
        for (let r = 0; r < 2; r++) {
            const reelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 16);
            const reel = new THREE.Mesh(reelGeo, aluminum);
            reel.rotation.y = -angle;
            reel.rotation.x = Math.PI/2;
            const rx = cx - Math.sin(-angle)*2.1 + (r===0?-1.2:1.2);
            const ry = 4.5;
            const rz = cz - Math.cos(-angle)*2.1 + (r===0?-1:1);
            registerPart(`Magnetic Tape Reel ${i}-${r}`, reel, "Legacy branch backup", "aluminum", "Records timelines", 8, "Data corruption", [], rx, ry, rz, rx*2, ry*2, rz*2);
            tapeReels.push(reel);
        }
    }

    // ==========================================
    // SECTOR 3: CENTRAL STASIS POD & BED
    // ==========================================
    
    // Central Pedestal
    const pedGeo = new THREE.CylinderGeometry(6, 8, 4, 32);
    const ped = new THREE.Mesh(pedGeo, darkSteel);
    registerPart("Stasis Pedestal", ped, "Primary isolation mount", "darkSteel", "Houses the superposition trigger mechanism.", 10, "Structural collapse", ["Complete destruction"], 0, 2, 0, 0, -10, 0);

    // Inner Quantum Core
    const coreGeo = new THREE.IcosahedronGeometry(2, 2);
    const core = new THREE.Mesh(coreGeo, quantumCoreMaterial);
    registerPart("Radioactive Isotope Core", core, "Uranium-235 alpha emitter inside quantum dot array", "glass", "The source of true quantum randomness.", 11, "Isotope stabilization", ["Immortality sequence failure"], 0, 2, 0, 0, 50, 0);
    meshes.quantumCore = core;

    // Stasis Bed Frame
    const bedFrameGeo = new THREE.BoxGeometry(4, 1, 10);
    const bedFrame = new THREE.Mesh(bedFrameGeo, steel);
    registerPart("Ergonomic Stasis Frame", bedFrame, "Patient containment chassis", "steel", "Supports the observer during extreme timeline shifts.", 12, "Spinal injury", [], 0, 4.5, 0, 0, 15, -20);

    // Medical Cushions
    const cushionGeo = new THREE.BoxGeometry(3.6, 0.6, 4);
    const torsoCush = new THREE.Mesh(cushionGeo, rubber);
    registerPart("Torso Cushion", torsoCush, "Impact absorbing polymer", "rubber", "Comfort", 13, "Discomfort", [], 0, 5, -1, 0, 20, -15);
    
    const legCushGeo = new THREE.BoxGeometry(3.6, 0.5, 4);
    const legCush = new THREE.Mesh(legCushGeo, rubber);
    registerPart("Leg Cushion", legCush, "Impact absorbing polymer", "rubber", "Comfort", 14, "Discomfort", [], 0, 5, 3.5, 0, 18, 15);
    
    const headRestGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
    const headRest = new THREE.Mesh(headRestGeo, rubber);
    headRest.rotation.z = Math.PI/2;
    registerPart("Head Stabilizer", headRest, "Cranial restraint", "rubber", "Prevents whiplash during timeline decoupling.", 15, "Decapitation via inertia", ["Death"], 0, 5.2, -4, 0, 25, -25);

    // Brain-Machine Interface Helmet
    const helmetGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const helmet = new THREE.Mesh(helmetGeo, chrome);
    registerPart("Cortical Uplink Helmet", helmet, "Neural-quantum bridge", "chrome", "Synchronizes the observer's consciousness with the quantum core.", 16, "Brain wave desync", ["Subjective continuity broken (Permanent Death)"], 0, 6.2, -4.2, 0, 30, -30);

    // IV Lines and Neural Wires (50 highly detailed tubes)
    const wireGroup = new THREE.Group();
    for(let w=0; w<50; w++) {
        const startX = (Math.random()-0.5)*2;
        const startZ = -4 + (Math.random()-0.5)*1;
        const endX = (Math.random()-0.5)*10;
        const endZ = (Math.random()-0.5)*10;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, 6.5, startZ), // Helmet
            new THREE.Vector3(startX*2, 7 + Math.random(), startZ*2),
            new THREE.Vector3(endX*0.5, 3, endZ*0.5),
            new THREE.Vector3(endX, 0.5, endZ) // Floor/Base
        ]);
        const wireGeo = new THREE.TubeGeometry(curve, 12, 0.05 + Math.random()*0.05, 5, false);
        const wireMat = Math.random() > 0.5 ? copper : plastic;
        const wire = new THREE.Mesh(wireGeo, wireMat);
        registerPart(`Neural/IV Line ${w}`, wire, "Life support and data transmission", wireMat === copper ? "copper" : "plastic", "Feeds fluids and quantum data to the brain.", 17, "Nutrient deprivation / Data loss", ["Seizure"], 0, 0, 0, endX, 10, endZ);
        lifeSupportHoses.push(wire);
    }

    // Chamber Glass Shell
    const shellGeo = new THREE.SphereGeometry(8, 32, 32, 0, Math.PI*2, 0, Math.PI/1.5);
    const shell = new THREE.Mesh(shellGeo, tinted);
    registerPart("Vacuum Sealing Glass Dome", shell, "Hyper-dense bulletproof tinted glass", "tinted", "Contains the stasis atmosphere.", 18, "Depressurization", ["Suffocation"], 0, 4, 0, 0, 40, 0);

    // Superposition Ethereal Ghost Shells
    // These represent the diverging timelines in physical space
    for(let g=0; g<5; g++) {
        const ghostGeo = new THREE.SphereGeometry(8 + (g*0.2), 16, 16, 0, Math.PI*2, 0, Math.PI/1.5);
        const ghost = new THREE.Mesh(ghostGeo, superpositionMaterial);
        registerPart(`Superposition Probability Echo ${g}`, ghost, "Visual artifact of a diverging timeline branch", "glass", "None (Visual only).", 19, "None", [], 0, 4, 0, 0, 0, 0);
        ghostLayers.push(ghost);
        superpositionJitterMeshes.push(ghost);
    }

    // ==========================================
    // SECTOR 4: HOLOGRAPHIC TIMELINE PROJECTOR
    // ==========================================
    
    const holoBaseGeo = new THREE.TorusGeometry(10, 0.5, 16, 64);
    const holoBase = new THREE.Mesh(holoBaseGeo, chrome);
    holoBase.rotation.x = Math.PI/2;
    registerPart("Hologram Emitter Ring", holoBase, "Photon entrapment array", "chrome", "Projects the Many-Worlds branch visualization.", 20, "Projection failure", [], 0, 0.5, 0, 0, 5, 0);

    // Recursive function to generate massive fractal timeline trees
    const treeGroup = new THREE.Group();
    group.add(treeGroup);
    
    function buildTimelineTree(x, y, z, dx, dy, dz, length, depth, parentObj) {
        if (depth === 0) return;
        
        const endX = dx * length;
        const endY = dy * length;
        const endZ = dz * length;

        const curve = new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(endX, endY, endZ));
        const branchGeo = new THREE.TubeGeometry(curve, 4, 0.15 * depth, 6, false);
        const branch = new THREE.Mesh(branchGeo, holoMaterial);
        branch.position.set(x, y, z);
        parentObj.add(branch);
        timelineBranches.push(branch);

        const nodeGeo = new THREE.SphereGeometry(0.3 * depth, 8, 8);
        const node = new THREE.Mesh(nodeGeo, holoMaterial);
        node.position.set(endX, endY, endZ);
        branch.add(node);
        timelineNodes.push(node);

        const splits = Math.floor(Math.random() * 3) + 1; // 1 to 3 branches
        for(let i=0; i<splits; i++) {
            const spread = 0.8;
            const ndx = dx + (Math.random() - 0.5) * spread;
            const ndy = dy + (Math.random() - 0.5) * spread + 0.2; // trend upwards
            const ndz = dz + (Math.random() - 0.5) * spread;
            const mag = Math.sqrt(ndx*ndx + ndy*ndy + ndz*ndz);
            buildTimelineTree(endX, endY, endZ, ndx/mag, ndy/mag, ndz/mag, length * 0.75, depth - 1, branch);
        }
    }

    // Initiate 4 massive timeline trees expanding outwards and upwards
    for(let t=0; t<4; t++) {
        const tAngle = (t/4) * Math.PI*2;
        const subTree = new THREE.Group();
        subTree.position.set(Math.cos(tAngle)*12, 1, Math.sin(tAngle)*12);
        treeGroup.add(subTree);
        // Start branch going up and slightly out
        buildTimelineTree(0, 0, 0, Math.cos(tAngle)*0.3, 1, Math.sin(tAngle)*0.3, 10, 5, subTree);
    }

    // ==========================================
    // SECTOR 5: SCHRÖDINGER'S LETHAL SYSTEMS
    // ==========================================
    
    // System 5A: Quantum Laser Executioners
    for(let i=0; i<4; i++) {
        const lAngle = (i/4) * Math.PI*2 + (Math.PI/4);
        const bx = Math.cos(lAngle)*18;
        const bz = Math.sin(lAngle)*18;
        
        const laserGroup = new THREE.Group();
        laserGroup.position.set(bx, 0, bz);
        group.add(laserGroup);
        
        // Base
        const lBaseGeo = new THREE.CylinderGeometry(2, 2.5, 4, 16);
        const lBase = new THREE.Mesh(lBaseGeo, steel);
        registerPart(`Laser Base ${i}`, lBase, "Mounting for high-energy execution laser", "steel", "Structural support.", 30+i, "Laser misalignment", ["Inefficient execution (Torture)"], bx, 2, bz, bx*2, -10, bz*2);
        
        // Swivel
        const lSwivelGeo = new THREE.BoxGeometry(2, 4, 2);
        const lSwivel = new THREE.Mesh(lSwivelGeo, darkSteel);
        lSwivel.position.set(0, 4, 0);
        laserGroup.add(lSwivel);
        
        // Elevation Arm
        const lArmGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
        const lArm = new THREE.Mesh(lArmGeo, aluminum);
        lArm.rotation.x = Math.PI/2;
        lArm.position.set(0, 1.5, 0);
        lSwivel.add(lArm);
        
        // Barrel
        const lBarrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
        const lBarrel = new THREE.Mesh(lBarrelGeo, chrome);
        lBarrel.rotation.x = Math.PI/2;
        lBarrel.position.set(0, 0, 3);
        lArm.add(lBarrel);
        
        // Lens Array
        for(let l=0; l<3; l++) {
            const lensGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 16);
            const lens = new THREE.Mesh(lensGeo, glass);
            lens.rotation.x = Math.PI/2;
            lens.position.set(0, 0, 1 + l*2);
            lBarrel.add(lens);
        }

        // The Beam
        const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
        const beam = new THREE.Mesh(beamGeo, laserBeamMaterial);
        beam.rotation.x = Math.PI/2;
        // Move pivot to base of beam
        beam.geometry.translate(0, 0.5, 0);
        beam.position.set(0, 0, 4);
        lBarrel.add(beam);

        // Point laser inwards towards the pod
        laserGroup.lookAt(new THREE.Vector3(0, 5, 0));

        lasers.push({ swivel: lSwivel, arm: lArm, barrel: lBarrel, beam: beam });
    }

    // System 5B: Cyanide Gas Diffusers
    for(let i=0; i<4; i++) {
        const gAngle = (i/4) * Math.PI*2;
        const gx = Math.cos(gAngle)*14;
        const gz = Math.sin(gAngle)*14;

        // Tank
        const tankGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 16);
        const tank = new THREE.Mesh(tankGeo, copper);
        registerPart(`Toxin Tank ${i}`, tank, "Pressurized hydrogen cyanide storage", "copper", "Chemical execution method.", 40+i, "Valve leak", ["Accidental death"], gx, 3, gz, gx*3, 20, gz*3);

        // Twisted pipes (TorusKnots for complexity)
        const pipeGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        registerPart(`Toxin Regulator Pipe ${i}`, pipe, "Pressure manifold", "steel", "Flow control", 45+i, "Rupture", [], gx, 6.5, gz, gx*2, 30, gz*2);

        // Nozzle facing inward
        const nozzleGeo = new THREE.ConeGeometry(0.5, 2, 16);
        const nozzle = new THREE.Mesh(nozzleGeo, darkSteel);
        nozzle.rotation.x = -Math.PI/2;
        nozzle.position.set(gx - Math.cos(gAngle)*1.5, 6.5, gz - Math.sin(gAngle)*1.5);
        nozzle.lookAt(0, 6.5, 0);
        group.add(nozzle);

        // Emitter Particles (Gas clouds)
        for(let p=0; p<5; p++) {
            const particleGeo = new THREE.SphereGeometry(1, 8, 8);
            const particle = new THREE.Mesh(particleGeo, gasMaterial);
            const px = nozzle.position.x - Math.cos(gAngle)*2;
            const py = nozzle.position.y;
            const pz = nozzle.position.z - Math.sin(gAngle)*2;
            
            particle.position.set(px, py, pz);
            particle.userData.origin = new THREE.Vector3(px, py, pz);
            particle.userData.angle = gAngle;
            group.add(particle);
            gasParticles.push(particle);
        }
    }

    // System 5C: Macroscopic Kinetic Decapitator (The Crusher)
    const crusherGroup = new THREE.Group();
    group.add(crusherGroup);
    
    // Rails
    for(let r=0; r<2; r++) {
        const railGeo = new THREE.BoxGeometry(1, 30, 2);
        const rail = new THREE.Mesh(railGeo, steel);
        const rx = r===0 ? -4 : 4;
        registerPart(`Kinetic Rail ${r}`, rail, "Electromagnetic rail guide", "steel", "Guides the drop weight.", 50+r, "Friction burn", ["Blade jam"], rx, 15, -6, rx*2, 0, -20);
    }

    // The Blade Weight
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-3.5, 4);
    bladeShape.lineTo(3.5, 4);
    bladeShape.lineTo(3.5, -2);
    bladeShape.lineTo(0, -6); // extremely sharp point
    bladeShape.lineTo(-3.5, -2);
    bladeShape.closePath();
    const bladeExtrude = { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, bladeExtrude);
    const blade = new THREE.Mesh(bladeGeo, darkSteel);
    // Center it
    blade.position.set(0, 25, -6.5);
    crusherGroup.add(blade);
    kineticBlade.mesh = blade;
    
    registerPart("Quantum Decapitation Weight", blade, "10-ton tungsten-carbide kinetic impactor", "darkSteel", "Guarantees instantaneous cessation of consciousness.", 55, "Dull edge", ["Agonizing survival"], 0, 25, -6.5, 0, 50, -10);

    // Hydraulic Pistons for resetting the blade
    for(let h=0; h<2; h++) {
        const hx = h===0 ? -3 : 3;
        const outerGeo = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);
        const outer = new THREE.Mesh(outerGeo, chrome);
        registerPart(`Hydraulic Cylinder ${h}`, outer, "Pneumatic reset system", "chrome", "Lifts the blade after a lethal event in a dead timeline branch.", 56+h, "Loss of pressure", [], hx, 7.5, -7.5, hx*2, 5, -20);
        
        const innerGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 16);
        const inner = new THREE.Mesh(innerGeo, steel);
        inner.position.set(hx, 15, -7.5);
        crusherGroup.add(inner);
        hydraulicPistons.push({ inner: inner, outer: outer, offsetX: hx });
    }

    // ==========================================
    // SECTOR 6: QUANTUM STATE CONTAINMENT RINGS
    // ==========================================
    
    // Massive spinning gyroscope rings enclosing the pod
    const ringRadii = [12, 14, 16];
    const ringAxes = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(ringRadii[i], 0.6, 16, 100);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.position.set(0, 5, 0);
        group.add(ring);
        rings.push({ mesh: ring, axis: ringAxes[i], speed: (i+1)*0.02 });
        
        // Add glowing nodes to the rings
        for(let n=0; n<8; n++) {
            const nodeAngle = (n/8) * Math.PI*2;
            const nGeo = new THREE.SphereGeometry(1, 16, 16);
            const nMesh = new THREE.Mesh(nGeo, warningMaterial);
            nMesh.position.set(Math.cos(nodeAngle)*ringRadii[i], Math.sin(nodeAngle)*ringRadii[i], 0);
            ring.add(nMesh);
        }
        
        registerPart(`Containment Gyro-Ring ${i}`, ring, "Magnetic confinement generator", "steel", "Isolates the internal quantum system.", 60+i, "Axis misalignment", ["Magnetic singularity"], 0, 5, 0, 0, 30+i*10, 0);
    }

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Many-Worlds Interpretation (MWI), what mathematical mechanism theoretically prevents distinct branches of the universal wave function from interacting after an irreversible observation within this chamber?",
            options: [
                "Quantum Tunneling",
                "Decoherence",
                "The Born Rule",
                "Superposition Decay"
            ],
            answer: "Decoherence"
        },
        {
            question: "If an occupant survives $N$ successive lethal quantum events inside this chamber (assuming a 50% probability of a lethal trigger per event), what is the amplitude of the surviving wave function branch relative to the initial state?",
            options: [
                "(1/2)^N",
                "(1/\\sqrt{2})^N",
                "1 (It renormalizes)",
                "1/N!"
            ],
            answer: "(1/\\sqrt{2})^N"
        },
        {
            question: "Which famous thought experiment serves as the direct intellectual precursor and basis for the functionality of this Quantum Immortality Chamber?",
            options: [
                "Maxwell's Demon",
                "Wigner's Friend",
                "Schrödinger's Cat / Quantum Suicide",
                "Laplace's Demon"
            ],
            answer: "Schrödinger's Cat / Quantum Suicide"
        },
        {
            question: "What major philosophical/mathematical issue arises regarding 'measure' when evaluating the subjective experience of Quantum Immortality over thousands of trials?",
            options: [
                "Measure is not conserved in MWI.",
                "The surviving branch gains the measure of all dead branches.",
                "It implies consciousness can collapse the wave function.",
                "The surviving branch has a diminishingly small measure, approaching zero."
            ],
            answer: "The surviving branch has a diminishingly small measure, approaching zero."
        },
        {
            question: "If the Lethal Systems are triggered by a heavily biased quantum event (e.g., 99.9% probability of death, 0.1% survival), how does the theory of Quantum Immortality resolve the occupant's subjective perception?",
            options: [
                "The occupant dies 99.9% of the time and is reborn.",
                "The universe loops until the 0.1% event occurs.",
                "The occupant subjectively experiences survival with 100% certainty in the surviving 0.1% branch.",
                "Decoherence forces the 99.9% state to become a local hidden variable."
            ],
            answer: "The occupant subjectively experiences survival with 100% certainty in the surviving 0.1% branch."
        }
    ];

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // 1. Quantum Core Pulsing
        if (meshes.quantumCore) {
            meshes.quantumCore.rotation.x += 0.05 * speed;
            meshes.quantumCore.rotation.y += 0.03 * speed;
            meshes.quantumCore.material.emissiveIntensity = 2 + Math.sin(t * 10) * 1.5;
        }

        // 2. Holographic Multiverse Timelines
        timelineNodes.forEach((node, i) => {
            node.material.emissiveIntensity = 1 + Math.sin(t * 4 + i) * 0.8;
            node.scale.setScalar(1 + Math.sin(t * 6 + i * 0.5) * 0.3);
        });
        timelineBranches.forEach((branch, i) => {
            branch.material.opacity = 0.4 + Math.sin(t * 2 + i) * 0.3;
        });

        // 3. Containment Rings Gyroscopic Spin
        rings.forEach(r => {
            if(r.axis.x === 1) r.mesh.rotation.x += r.speed * speed;
            if(r.axis.y === 1) r.mesh.rotation.y += r.speed * speed;
            if(r.axis.z === 1) r.mesh.rotation.z += r.speed * speed;
        });

        // 4. Superposition Jitter (Ghost layers simulating branching uncertainty)
        superpositionJitterMeshes.forEach((ghost, i) => {
            if (Math.random() > 0.7) {
                // Violent quantum fluctuation
                ghost.position.x = ghost.userData.origin.x + (Math.random() - 0.5) * 0.8;
                ghost.position.y = ghost.userData.origin.y + (Math.random() - 0.5) * 0.8;
                ghost.position.z = ghost.userData.origin.z + (Math.random() - 0.5) * 0.8;
                ghost.rotation.y = (Math.random() - 0.5) * 0.2;
                ghost.rotation.x = (Math.random() - 0.5) * 0.2;
                ghost.material.opacity = 0.1 + Math.random() * 0.3;
            } else {
                // Snap back to base reality
                ghost.position.copy(ghost.userData.origin);
                ghost.rotation.set(0,0,0);
                ghost.material.opacity = 0.15;
            }
        });

        // 5. Laser Executioners Tracking & Firing
        lasers.forEach((laser, i) => {
            // Unnerving twitchy tracking
            laser.barrel.rotation.x = Math.sin(t * 2 + i) * 0.1;
            laser.swivel.rotation.y = Math.sin(t * 1.5 + i) * 0.2;
            
            // Firing sequence tied to sine wave threshold (simulating quantum trigger)
            const trigger = Math.sin(t * 5 + i * Math.PI);
            if (trigger > 0.95) {
                laser.beam.scale.y = 20; // Extends beam
                laser.beam.material.opacity = 1.0;
                laser.beam.material.emissiveIntensity = 20;
            } else {
                laser.beam.scale.y = 0.1;
                laser.beam.material.opacity = 0.0;
            }
        });

        // 6. Cyanide Gas Emissions
        gasParticles.forEach((p, i) => {
            // Expand and fade
            p.scale.addScalar(0.08 * speed);
            p.material.opacity -= 0.015 * speed;
            // Drift towards center (0, 5, 0)
            const dirX = 0 - p.position.x;
            const dirY = 5 - p.position.y;
            const dirZ = 0 - p.position.z;
            p.position.x += dirX * 0.01 * speed;
            p.position.y += dirY * 0.01 * speed;
            p.position.z += dirZ * 0.01 * speed;

            // Reset particle
            if (p.material.opacity <= 0) {
                p.scale.setScalar(0.5 + Math.random()*0.5);
                p.material.opacity = 0.6;
                p.position.copy(p.userData.origin);
            }
        });

        // 7. Macroscopic Kinetic Decapitator Drop
        const dropTrigger = Math.sin(t * 1.2);
        if (dropTrigger > 0.98 && kineticBlade.mesh.position.y > 5) {
            // Instantaneous violent drop
            kineticBlade.mesh.position.y = THREE.MathUtils.lerp(kineticBlade.mesh.position.y, 4, 0.8 * speed);
        } else {
            // Slow mechanical reset
            kineticBlade.mesh.position.y = THREE.MathUtils.lerp(kineticBlade.mesh.position.y, 25, 0.02 * speed);
        }

        // Animate hydraulic pistons lifting the blade
        hydraulicPistons.forEach(piston => {
            // Inner piston follows blade height roughly
            const bladeY = kineticBlade.mesh.position.y;
            // Map blade height (4 to 25) to piston y scale and position
            const extension = (bladeY - 4) / 21; // 0 to 1
            piston.inner.position.y = 10 + extension * 10;
        });

        // 8. Life Support Wiring Undulation
        lifeSupportHoses.forEach((hose, i) => {
            // Subtle creepy breathing effect
            const scalePulse = 1 + Math.sin(t * 3 + i) * 0.02;
            hose.scale.set(scalePulse, 1, scalePulse);
        });

        // 9. Mainframe Computers
        consoleLights.forEach((light, i) => {
            // Chaotic blinking
            light.material.emissiveIntensity = Math.random() > 0.6 ? 3 : 0;
        });
        tapeReels.forEach(reel => {
            // Jerky spinning
            if (Math.random() > 0.5) {
                reel.rotation.y -= 0.2 * speed;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
