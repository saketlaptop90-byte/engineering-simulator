import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const microfluidicChipMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.1, transmission: 0.9, ior: 1.5, thickness: 0.2 }); // Transparent glass/polymer
    const goldNanoporeMat = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.2 }); // Conductive sensor array
    const titaniumManifoldMat = new THREE.MeshPhysicalMaterial({ color: 0x778899, metalness: 0.8, roughness: 0.4 }); // Fluid routing
    
    // VFX Materials
    const basePairVFX = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // A, T, C, G data reads
    const dnaStrandVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 }); // The double helix
    const reagentFluidVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Wash buffers

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.dnaPoints = [];
    group.userData.animatedMeshes.basePairs = [];
    group.userData.animatedMeshes.fluids = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Microfluidic Chip & Manifold
    // ==========================================
    const chipGroup = new THREE.Group();
    
    // The main transparent chip body
    const chip = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 1.2), microfluidicChipMat);
    chipGroup.add(chip);
    
    // Titanium fluid manifolds (Inlet/Outlet)
    for(let side of [-1, 1]) {
        const manifold = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 1.0), titaniumManifoldMat);
        manifold.position.set(side * 1.1, 0.15, 0);
        chipGroup.add(manifold);
        
        // Fluid lines
        const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), plastic);
        pipe1.position.set(side * 1.1, 0.4, 0.2);
        const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), plastic);
        pipe2.position.set(side * 1.1, 0.4, -0.2);
        chipGroup.add(pipe1, pipe2);
    }
    
    // The Nanopore Array (Gold electrodes embedded in the chip)
    const arrayGroup = new THREE.Group();
    const numPores = 12; // Representing millions
    for(let i=0; i<numPores; i++) {
        const pore = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12), goldNanoporeMat);
        // Distribute them in a grid
        const x = -0.7 + (i % 4) * 0.45;
        const z = -0.3 + Math.floor(i / 4) * 0.3;
        pore.position.set(x, 0, z);
        arrayGroup.add(pore);
        
        // Add a VFX indicator for each pore to flash when reading a base pair
        const bpFlash = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.06), basePairVFX);
        bpFlash.position.set(x, 0, z);
        chipGroup.add(bpFlash);
        group.userData.animatedMeshes.basePairs.push(bpFlash);
    }
    chipGroup.add(arrayGroup);
    
    // Reagent fluid in the microchannels (VFX)
    const fluidChamber = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.0), reagentFluidVFX);
    chipGroup.add(fluidChamber);
    group.userData.animatedMeshes.fluids.push(fluidChamber);
    
    group.add(chipGroup);
    parts.push({ mesh: chip, name: "Microfluidic Nanopore Array", description: "Glass/polymer lab-on-a-chip.", function: "Routes raw biological samples through millions of gold electrodes. A voltage is applied across the pore, and as DNA strands pass through, the electrical disruption identifies each base pair."});

    // ==========================================
    // 2. PROCEDURAL CAD: DNA Strand & Helicase VFX
    // ==========================================
    // We will model a highly stylized, massive DNA helix moving through the central pore
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(0, 1.5, 0); // Suspended above the chip, feeding down
    
    const numBases = 40;
    const helixRadius = 0.2;
    for(let i=0; i<numBases; i++) {
        const yPos = (i * 0.1); // Spacing
        const angle = i * 0.5; // Twist
        
        // Strand 1
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), dnaStrandVFX);
        // Strand 2
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), dnaStrandVFX);
        // Bridge (Base Pair)
        const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, helixRadius * 2).rotateZ(Math.PI/2), dnaStrandVFX);
        
        const dnaSegment = new THREE.Group();
        s1.position.set(helixRadius, 0, 0);
        s2.position.set(-helixRadius, 0, 0);
        dnaSegment.add(s1, s2, bridge);
        
        // Initial positioning
        dnaSegment.position.y = yPos;
        dnaSegment.rotation.y = angle;
        
        dnaGroup.add(dnaSegment);
        
        // Store the baseline data so we can animate it moving downward and unzipping
        group.userData.animatedMeshes.dnaPoints.push({
            mesh: dnaSegment,
            baseY: yPos,
            angleOffset: angle
        });
    }
    
    group.add(dnaGroup);
    parts.push({ mesh: dnaGroup.children[0].children[2], name: "DNA Helicase Unzipper", description: "Protein motor complex.", function: "Rapidly unzips the double-stranded DNA into a single strand, feeding it through the nanopore reader at 400 bases per second."});

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Reagent fluid pulses through the chip
            group.userData.animatedMeshes.fluids[0].material.opacity = 0.2 + (Math.sin(timeAcc * 10 * speed) * 0.1);
            
            // 2. Nanopore arrays flash (simulating A, T, C, G reads)
            group.userData.animatedMeshes.basePairs.forEach(bp => {
                if(Math.random() < 0.1 * speed) {
                    // Randomly assign a color to represent different base pairs
                    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
                    bp.material.color.setHex(colors[Math.floor(Math.random()*4)]);
                    bp.material.opacity = 0.8;
                } else {
                    bp.material.opacity *= 0.8; // Fade out quickly
                }
            });
            
            // 3. DNA Helix moves downward and unzips at the bottom
            // The bottom of the DNA group is at y=1.5, feeding into y=0 (the chip)
            group.userData.animatedMeshes.dnaPoints.forEach((pt, index) => {
                // Move the whole strand downward
                pt.baseY -= 1.0 * speed * 0.016;
                // If it goes below 0 (into the pore), loop it back to the top
                if (pt.baseY < 0) {
                    pt.baseY += (numBases * 0.1);
                }
                
                pt.mesh.position.y = pt.baseY;
                
                // Keep the twist
                pt.mesh.rotation.y = pt.angleOffset + (timeAcc * 2.0 * speed); // Entire helix rotates
                
                // Opacity (fade out as it enters the pore, fade in at top)
                pt.mesh.children.forEach(c => c.material.opacity = Math.min(1.0, pt.baseY * 1.5));
                
                // UNZIPPING EFFECT: As it gets close to Y=0, split the strands
                if (pt.baseY < 0.5) {
                    const split = (0.5 - pt.baseY) * 2.0; // 0 to 1
                    pt.mesh.children[0].position.x = helixRadius + split;
                    pt.mesh.children[1].position.x = -helixRadius - split;
                    // Break the bridge
                    pt.mesh.children[2].material.opacity = 1.0 - split; 
                } else {
                    pt.mesh.children[0].position.x = helixRadius;
                    pt.mesh.children[1].position.x = -helixRadius;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.fluids[0].material.opacity = 0;
            group.userData.animatedMeshes.basePairs.forEach(bp => bp.material.opacity = 0);
            group.userData.animatedMeshes.dnaPoints.forEach(pt => {
                pt.mesh.children.forEach(c => c.material.opacity = 0);
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
