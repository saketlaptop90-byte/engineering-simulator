import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const cleanroomMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 }); // Ultra-sterile casing
    const fluidicChipMat = new THREE.MeshPhysicalMaterial({ color: 0x99ccff, metalness: 0.1, roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.8 }); // Microfluidic glass
    const printerHeadMat = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 }); // Precision molecular extruders
    const goldContacts = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.1 }); // Electroporation contacts
    
    // VFX Materials
    const basePairVFX = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Glowing ATCG blocks
    const reagentFluidVFX = new THREE.MeshPhysicalMaterial({ color: 0xff00ff, transmission: 0.9, opacity: 0.6, transparent: true, roughness: 0.0 }); // Sequencing reagents
    const foldingLaserVFX = new THREE.MeshBasicMaterial({ color: 0x4400ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Optical tweezers

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.bases = [];
    group.userData.animatedMeshes.fluids = [];
    group.userData.animatedMeshes.printer = null;
    group.userData.animatedMeshes.tweezers = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Nano-Fluidic Core
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // Main microfluidic lab-on-a-chip
    const chip = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 3.0), fluidicChipMat);
    coreGroup.add(chip);
    
    // Capillary channels inside the chip
    for(let i=0; i<5; i++) {
        const xOffset = -0.8 + (i * 0.4);
        
        // Etched channel
        const channel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 2.8), cleanroomMat);
        channel.position.set(xOffset, 0, 0);
        coreGroup.add(channel);
        
        // Fluid flowing through channel
        const fluid = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 2.7), reagentFluidVFX);
        fluid.position.set(xOffset, 0, 0);
        // Randomize initial scale/position to simulate flowing segments
        fluid.userData = { offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() };
        coreGroup.add(fluid);
        group.userData.animatedMeshes.fluids.push(fluid);
        
        // Gold electroporation pads at the ends
        const pad1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), goldContacts);
        pad1.position.set(xOffset, 0.05, 1.3);
        coreGroup.add(pad1);
        
        const pad2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), goldContacts);
        pad2.position.set(xOffset, 0.05, -1.3);
        coreGroup.add(pad2);
    }
    
    group.add(coreGroup);
    parts.push({ mesh: chip, name: "Sapphire Microfluidic Array", description: "Nanoscale lab-on-a-chip.", function: "Routes raw nucleotides and custom enzymes through picogram-scale capillary channels for sequence assembly."});

    // ==========================================
    // 2. PROCEDURAL CAD: Molecular Printer Head
    // ==========================================
    const printerGroup = new THREE.Group();
    printerGroup.position.set(0, 0.5, 0); // Hovers over the chip
    
    // Gantry system
    const railX = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.1), cleanroomMat);
    railX.position.set(0, 0.2, 0);
    printerGroup.add(railX);
    
    // The print head itself
    const head = new THREE.Group();
    const headBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), printerHeadMat);
    head.add(headBody);
    
    // Micropipette nozzles
    for(let i=0; i<4; i++) {
        const nx = -0.1 + (i%2)*0.2;
        const nz = -0.1 + Math.floor(i/2)*0.2;
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.03, 0.2), stainlessSteel());
        nozzle.position.set(nx, -0.25, nz);
        head.add(nozzle);
    }
    
    printerGroup.add(head);
    group.userData.animatedMeshes.printer = head;
    
    group.add(printerGroup);
    parts.push({ mesh: headBody, name: "Atomic Force Print Head", description: "Sub-nanometer precision extruder.", function: "Physically aligns and bonds individual Adenine, Thymine, Cytosine, and Guanine molecules into continuous synthetic DNA strands."});

    // ==========================================
    // 3. PROCEDURAL CAD: Protein Folding Bays & DNA VFX
    // ==========================================
    const baysGroup = new THREE.Group();
    baysGroup.position.set(0, 0, 1.8); // Front of the machine
    
    // Two large cylindrical folding bays
    for(let i of [-1, 1]) {
        const bay = new THREE.Group();
        bay.position.set(i * 0.8, 0.2, 0);
        
        // Chamber
        const chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32), fluidicChipMat);
        bay.add(chamber);
        
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 32), cleanroomMat);
        base.position.y = -0.4;
        bay.add(base);
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 32), cleanroomMat);
        top.position.y = 0.4;
        bay.add(top);
        
        // Optical tweezers inside (lasers that fold the protein)
        for(let j=0; j<3; j++) {
            const angle = (j * Math.PI * 2) / 3;
            const tweezer = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.8).rotateX(Math.PI/2), foldingLaserVFX);
            tweezer.position.set(0.3 * Math.cos(angle), 0, 0.3 * Math.sin(angle));
            tweezer.lookAt(0,0,0); // Point to center
            bay.add(tweezer);
            group.userData.animatedMeshes.tweezers.push({ mesh: tweezer, index: i+j });
        }
        
        // Synthesized double helix VFX in the center
        const helixGroup = new THREE.Group();
        // Just make a few glowing spheres to represent base pairs
        for(let bp=0; bp<10; bp++) {
            const pair = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.05), basePairVFX);
            pair.position.y = -0.3 + (bp * 0.06);
            pair.rotation.y = bp * 0.5; // Twist
            helixGroup.add(pair);
            group.userData.animatedMeshes.bases.push(pair);
        }
        bay.add(helixGroup);
        
        baysGroup.add(bay);
    }
    
    group.add(baysGroup);
    parts.push({ mesh: baysGroup.children[0].children[1], name: "Chaperone Folding Bays", description: "Optical tweezer chambers.", function: "Uses precisely tuned ultraviolet lasers to manipulate the synthesized DNA, coaxing it into complex three-dimensional protein structures."});

    // Helper for stainless steel (since it's not imported directly)
    function stainlessSteel() {
        return new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.3 });
    }

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Fluidic channels pulse with reagents
            group.userData.animatedMeshes.fluids.forEach((fluid) => {
                // Simulate fluid "plugs" moving down the channel
                fluid.scale.z = 0.5 + (Math.sin(timeAcc * 10 * speed * fluid.userData.speed + fluid.userData.offset) * 0.4);
                fluid.position.z = Math.cos(timeAcc * 5 * speed * fluid.userData.speed + fluid.userData.offset) * 1.0;
                // Change color slightly
                fluid.material.color.setHSL((timeAcc * 0.1 + fluid.userData.offset) % 1.0, 1.0, 0.5);
            });
            
            // 2. Print head moves rapidly over the chip (Raster scanning)
            const headX = Math.sin(timeAcc * 20 * speed) * 0.9;
            const headZ = Math.cos(timeAcc * 2 * speed) * 1.2; // Slower on Z axis
            group.userData.animatedMeshes.printer.position.set(headX, 0, headZ);
            
            // 3. DNA Base Pairs glow and twist
            group.userData.animatedMeshes.bases.forEach((bp, index) => {
                bp.material.opacity = 0.6 * speed + (Math.sin(timeAcc * 15 * speed + index) * 0.3);
                // Rotate the whole helix (the parent is the helixGroup, but we can just rotate the individual pairs if we track it)
                bp.rotation.y += 0.05 * speed;
            });
            
            // 4. Optical Tweezers fire (lasers)
            group.userData.animatedMeshes.tweezers.forEach(t => {
                t.mesh.material.opacity = Math.random() < 0.6 * speed ? 0.7 : 0.1;
                // Jitter position slightly to simulate manipulation
                t.mesh.position.y = Math.sin(timeAcc * 30 * speed + t.index) * 0.1;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.printer.position.set(0, 0, 0);
            group.userData.animatedMeshes.bases.forEach(bp => bp.material.opacity = 0.0);
            group.userData.animatedMeshes.tweezers.forEach(t => t.mesh.material.opacity = 0.0);
            group.userData.animatedMeshes.fluids.forEach(fluid => {
                fluid.scale.z = 1.0;
                fluid.position.z = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
