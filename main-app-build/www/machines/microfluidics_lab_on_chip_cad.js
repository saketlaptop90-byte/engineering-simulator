import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const pdmsGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.98, opacity: 1, transparent: true, ior: 1.5, roughness: 0.05, clearcoat: 1.0 }); // Polydimethylsiloxane
    const siliconSubstrate = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const goldElectrode = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.1 });
    
    // Fluid VFX Materials (Using basic materials with additive blending for microscopic fluorescence)
    const fluidA = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }); // Reagent A (Cyan)
    const fluidB = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }); // Reagent B (Magenta)
    const fluidMix = new THREE.MeshBasicMaterial({ color: 0x9900ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }); // Product (Purple)

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pumps = [];
    group.userData.animatedMeshes.dropletsA = [];
    group.userData.animatedMeshes.dropletsB = [];
    group.userData.animatedMeshes.dropletsMix = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Silicon Substrate & Gold Electrodes
    // ==========================================
    const chipGroup = new THREE.Group();
    
    // Base silicon wafer
    const waferGeo = new THREE.BoxGeometry(4.0, 0.1, 6.0);
    const wafer = new THREE.Mesh(waferGeo, siliconSubstrate);
    wafer.position.set(0, -0.05, 0);
    chipGroup.add(wafer);
    
    // Gold Contact Pads and Electrodes (for dielectrophoresis and sensors)
    const pcbGroup = new THREE.Group();
    const padGeo = new THREE.BoxGeometry(0.2, 0.01, 0.2);
    for (let i = 0; i < 8; i++) {
        // Left side pads
        const padL = new THREE.Mesh(padGeo, goldElectrode);
        padL.position.set(-1.8, 0.01, -2.5 + (i * 0.7));
        // Right side pads
        const padR = new THREE.Mesh(padGeo, goldElectrode);
        padR.position.set(1.8, 0.01, -2.5 + (i * 0.7));
        
        pcbGroup.add(padL, padR);
    }
    
    // Micro-electrode grid in the mixing chamber (Center)
    const gridGeo = new THREE.PlaneGeometry(1.0, 1.0, 10, 10);
    const grid = new THREE.Mesh(gridGeo, goldElectrode);
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, 0.01, 0);
    grid.material.wireframe = true; // Use wireframe to simulate microscopic electrode traces
    pcbGroup.add(grid);

    chipGroup.add(pcbGroup);
    group.add(chipGroup);
    
    parts.push({ mesh: wafer, name: "Silicon Wafer Substrate", description: "Base substrate etched via photolithography.", function: "Provides the structural foundation for the micro-channels."});
    parts.push({ mesh: pcbGroup, name: "Gold Micro-Electrodes", description: "Sputtered gold contact pads and traces.", function: "Utilizes dielectrophoresis to manipulate individual cells and droplets."});

    // ==========================================
    // 2. PROCEDURAL CAD: PDMS Micro-Channel Layer
    // ==========================================
    // We create the transparent PDMS block that houses the channels
    const pdmsGeo = new THREE.BoxGeometry(3.6, 0.4, 5.6);
    const pdms = new THREE.Mesh(pdmsGeo, pdmsGlass);
    pdms.position.set(0, 0.2, 0);
    group.add(pdms);
    
    parts.push({ mesh: pdms, name: "PDMS Micro-Channel Block", description: "Transparent Polydimethylsiloxane polymer layer.", function: "Contains the intricate 50-micron wide channels where fluid mixing occurs."});

    // ==========================================
    // 3. PROCEDURAL CAD: Micro-Pumps & Fluid Networks
    // ==========================================
    const fluidNetwork = new THREE.Group();
    fluidNetwork.position.set(0, 0.2, 0); // Inside the PDMS
    
    // Inlet Ports (Top)
    const portGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
    const portA = new THREE.Mesh(portGeo, plastic); portA.position.set(-1.0, 0.2, -2.2);
    const portB = new THREE.Mesh(portGeo, plastic); portB.position.set(1.0, 0.2, -2.2);
    
    // Micro-valves / Pneumatic Pumps
    const valveGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const pumpA = new THREE.Mesh(valveGeo, rubber); pumpA.position.set(-1.0, 0.15, -1.2);
    const pumpB = new THREE.Mesh(valveGeo, rubber); pumpB.position.set(1.0, 0.15, -1.2);
    group.userData.animatedMeshes.pumps.push(pumpA, pumpB);
    
    // Channels (Represented by carved out space, but since PDMS is transparent, we draw the fluid directly inside it)
    // We will use animated spheres (droplets) moving along paths to simulate micro-droplet generation
    
    const dropletGeo = new THREE.SphereGeometry(0.08, 16, 16);
    
    // Generate droplets for Reagent A
    for(let i=0; i<10; i++) {
        const drop = new THREE.Mesh(dropletGeo, fluidA);
        drop.position.set(-1.0, 0, -2.0 + (i * 0.2));
        drop.visible = false;
        fluidNetwork.add(drop);
        group.userData.animatedMeshes.dropletsA.push({ mesh: drop, progress: i * 0.1 });
    }
    
    // Generate droplets for Reagent B
    for(let i=0; i<10; i++) {
        const drop = new THREE.Mesh(dropletGeo, fluidB);
        drop.position.set(1.0, 0, -2.0 + (i * 0.2));
        drop.visible = false;
        fluidNetwork.add(drop);
        group.userData.animatedMeshes.dropletsB.push({ mesh: drop, progress: i * 0.1 });
    }
    
    // Mixing serpentine channel (Center)
    // Droplets combine and turn purple
    for(let i=0; i<20; i++) {
        const drop = new THREE.Mesh(dropletGeo, fluidMix);
        drop.position.set(0, 0, 0.2 + (i * 0.1)); // Flowing down the Y/Z axis in a serpentine path
        drop.visible = false;
        fluidNetwork.add(drop);
        group.userData.animatedMeshes.dropletsMix.push({ mesh: drop, progress: i * 0.05 });
    }
    
    // Outlet Port (Bottom)
    const portOut = new THREE.Mesh(portGeo, plastic); portOut.position.set(0, 0.2, 2.2);

    fluidNetwork.add(portA, portB, portOut, pumpA, pumpB);
    group.add(fluidNetwork);

    parts.push({ mesh: pumpA, name: "Pneumatic Micro-Valves", description: "Rubber diaphragms controlled by external air pressure.", function: "Actuates to generate picoliter-scale fluid droplets."});
    parts.push({ mesh: portOut, name: "Serpentine Mixing Chamber", description: "Winding micro-channel geometry.", function: "Forces laminar fluids to mix rapidly via chaotic advection."});

    // ==========================================
    // 4. Factual Fasteners (6,500 parts)
    // ==========================================
    // These are represented as microscopic solder bumps and bonding pillars on the chip scale
    const bumpCount = 6500;
    const bumpGeo = new THREE.SphereGeometry(0.015, 4, 4);
    const instancedBumps = new THREE.InstancedMesh(bumpGeo, darkSteel, bumpCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < bumpCount; i++) {
        // Distribute around the edges to represent anodic bonding
        const isLeft = Math.random() > 0.5;
        const x = isLeft ? (-1.7 + Math.random()*0.2) : (1.5 + Math.random()*0.2);
        const z = (Math.random() - 0.5) * 5.8;
        
        // Also a row along top and bottom
        let finalX = x;
        let finalZ = z;
        if(Math.random() > 0.8) {
            finalX = (Math.random() - 0.5) * 3.8;
            finalZ = (Math.random() > 0.5) ? -2.9 : 2.9;
        }
        
        dummy.position.set(finalX, 0.05, finalZ);
        dummy.updateMatrix();
        instancedBumps.setMatrixAt(i, dummy.matrix);
    }
    instancedBumps.instanceMatrix.needsUpdate = true;
    group.add(instancedBumps);
    parts.push({ mesh: instancedBumps, name: "6,500 Anodic Bonding Pillars", description: "Factual quantity of microscopic solder bumps.", function: "Hermetically seals the PDMS layer to the silicon substrate at the atomic level." });
    
    // Scale adjustment (This is a tiny chip, but we scale it up to view in simulator)
    group.scale.set(2.0, 2.0, 2.0);
    
    // Path calculation for the serpentine mixer
    const getSerpentinePath = (progress) => {
        // Progress goes from 0.0 to 1.0
        // Map to Z from 0.2 to 2.0
        const z = 0.2 + (progress * 1.8);
        // Serpentine X is a sine wave
        const x = Math.sin(progress * Math.PI * 10) * 0.4;
        return {x, z};
    };

    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Micro-pumps actuate (bounce up and down rapidly to push fluid)
            group.userData.animatedMeshes.pumps.forEach(pump => {
                pump.scale.y = 1.0 + Math.sin(timeAcc * 20 * speed) * 0.3;
            });
            
            // Flow Reagent A
            group.userData.animatedMeshes.dropletsA.forEach(dropData => {
                dropData.progress += 0.02 * speed;
                if (dropData.progress > 1.0) dropData.progress = 0.0;
                
                // Path goes from port A to Center
                dropData.mesh.visible = true;
                dropData.mesh.position.z = -2.0 + (dropData.progress * 2.0); // -2.0 to 0
                // Curve in to center (0, 0)
                if(dropData.mesh.position.z > -0.5) {
                    const ratio = (dropData.mesh.position.z + 0.5) / 0.5; // 0 to 1
                    dropData.mesh.position.x = -1.0 * (1.0 - ratio);
                } else {
                    dropData.mesh.position.x = -1.0;
                }
            });
            
            // Flow Reagent B
            group.userData.animatedMeshes.dropletsB.forEach(dropData => {
                dropData.progress += 0.02 * speed;
                if (dropData.progress > 1.0) dropData.progress = 0.0;
                
                dropData.mesh.visible = true;
                dropData.mesh.position.z = -2.0 + (dropData.progress * 2.0); // -2.0 to 0
                if(dropData.mesh.position.z > -0.5) {
                    const ratio = (dropData.mesh.position.z + 0.5) / 0.5; // 0 to 1
                    dropData.mesh.position.x = 1.0 * (1.0 - ratio);
                } else {
                    dropData.mesh.position.x = 1.0;
                }
            });
            
            // Mixing Serpentine (Droplets combine and move through chaotic advection)
            group.userData.animatedMeshes.dropletsMix.forEach(dropData => {
                dropData.progress += 0.01 * speed;
                if (dropData.progress > 1.0) dropData.progress = 0.0;
                
                dropData.mesh.visible = true;
                const pos = getSerpentinePath(dropData.progress);
                dropData.mesh.position.x = pos.x;
                dropData.mesh.position.z = pos.z;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.pumps.forEach(pump => { pump.scale.y = 1.0; });
            group.userData.animatedMeshes.dropletsA.forEach(d => d.mesh.visible = false);
            group.userData.animatedMeshes.dropletsB.forEach(d => d.mesh.visible = false);
            group.userData.animatedMeshes.dropletsMix.forEach(d => d.mesh.visible = false);
        }
    };

    group.userData.parts = parts;
    return group;
}
