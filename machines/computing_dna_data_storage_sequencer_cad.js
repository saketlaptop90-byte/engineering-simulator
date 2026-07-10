import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const chassisMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, clearcoat: 0.8 }); 
    const fluidicGlass = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.0, transmission: 0.9, thickness: 0.1 }); 
    const brassFittings = new THREE.MeshPhysicalMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.3 });
    const pcbGreen = new THREE.MeshPhysicalMaterial({ color: 0x004400, metalness: 0.3, roughness: 0.8 });
    const siliconChip = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.2 });
    
    // VFX Materials
    const laserA = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Adenine
    const laserC = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Cytosine
    const laserG = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Guanine
    const laserT = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Thymine
    
    const reagentFluid = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6 }); 

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.lasers = [];
    group.userData.animatedMeshes.fluids = [];
    group.userData.animatedMeshes.valves = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Main Enclosure & Display
    // ==========================================
    const enclosure = new THREE.Group();
    
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 1.5), chassisMat);
    base.position.y = -0.6;
    enclosure.add(base);
    
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 1.5), chassisMat);
    tower.position.set(-0.6, 0.2, 0);
    enclosure.add(tower);
    
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), new THREE.MeshBasicMaterial({color: 0x001133}));
    screen.position.set(-0.19, 0.5, 0.76);
    enclosure.add(screen);
    
    group.add(enclosure);
    parts.push({ mesh: base, name: "Synthesis Enclosure", description: "Vibration-isolated clean chassis.", function: "Provides a sterile, temperature-controlled environment for DNA manipulation."});

    // ==========================================
    // 2. PROCEDURAL CAD: Microfluidic Synthesis Chip
    // ==========================================
    // This is the core where the synthetic DNA is printed
    const chipGroup = new THREE.Group();
    chipGroup.position.set(0.4, -0.3, 0);
    
    // The glass slide
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.8), fluidicGlass);
    chipGroup.add(slide);
    
    // Microchannels etched into the glass (we'll model them as tiny glowing tubes inside)
    for(let i=0; i<10; i++) {
        const channel = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.7).rotateX(Math.PI/2), reagentFluid);
        channel.position.set(-0.35 + (i * 0.077), 0, 0);
        chipGroup.add(channel);
        group.userData.animatedMeshes.fluids.push(channel);
    }
    
    group.add(chipGroup);
    parts.push({ mesh: slide, name: "Microfluidic Synthesis Array", description: "Glass wafer etched with nanoscale capillary channels.", function: "Where the digital data (0s and 1s) is chemically synthesized into physical strands of DNA (A, C, G, T)."});

    // ==========================================
    // 3. PROCEDURAL CAD: Reagent Manifold & Micro-Valves
    // ==========================================
    // The complex plumbing that delivers the A, C, G, T nucleobases
    const manifoldGroup = new THREE.Group();
    manifoldGroup.position.set(0.4, 0.1, -0.6);
    
    // Brass mixing manifold block
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), brassFittings);
    manifoldGroup.add(block);
    
    // Four distinct reagent inputs (A, C, G, T)
    const valveMats = [laserA, laserC, laserG, laserT];
    for(let i=0; i<4; i++) {
        const valve = new THREE.Group();
        valve.position.set(-0.22 + (i*0.15), 0.15, 0);
        
        // Solenoid body
        const solenoid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1), darkSteel);
        valve.add(solenoid);
        
        // Feed line
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5), plastic);
        tube.position.y = 0.3;
        valve.add(tube);
        
        // Indicator LED
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), valveMats[i]);
        led.position.set(0, 0.05, 0.04);
        valve.add(led);
        
        manifoldGroup.add(valve);
        group.userData.animatedMeshes.valves.push(led);
    }
    
    // Delivery tube down to the chip
    const mainTube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), plastic);
    mainTube.position.set(0, -0.2, 0.2);
    mainTube.rotation.x = Math.PI/4;
    manifoldGroup.add(mainTube);
    
    group.add(manifoldGroup);
    parts.push({ mesh: block, name: "Piezoelectric Reagent Manifold", description: "High-precision brass fluidic multiplexer.", function: "Fires exact picoliter droplets of specific nucleobases into the synthesis chip at millions of cycles per second."});

    // ==========================================
    // 4. PROCEDURAL CAD: Optical Read/Write Head
    // ==========================================
    // A laser array hovering over the chip to sequence (read) the DNA via fluorescence
    const opticGroup = new THREE.Group();
    opticGroup.position.set(0.4, 0.3, 0);
    
    const lensHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.4), aluminum);
    opticGroup.add(lensHousing);
    
    // Internal objective lens
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16, 0, Math.PI*2, 0, Math.PI/2), fluidicGlass);
    lens.position.y = -0.2;
    lens.rotation.x = Math.PI;
    opticGroup.add(lens);
    
    // Scanning Lasers VFX (A,C,G,T colors)
    for(let i=0; i<4; i++) {
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.5).rotateX(Math.PI/2), valveMats[i]);
        laser.position.set(0, -0.2, 0);
        laser.rotation.x = Math.PI/2;
        opticGroup.add(laser);
        group.userData.animatedMeshes.lasers.push(laser);
    }
    
    // Linear actuator rail for the optic head
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.2), darkSteel);
    rail.position.set(0.4, 0.4, 0);
    group.add(rail);
    group.add(opticGroup);
    group.userData.animatedMeshes['opticHead'] = opticGroup;
    
    parts.push({ mesh: lensHousing, name: "Fluorescence Sequencing Optics", description: "Sub-diffraction limit optical objective.", function: "Scans the synthesized DNA strands using specific laser wavelengths to read back the encoded digital data."});

    // ==========================================
    // 5. PROCEDURAL CAD: Digital Interface PCB
    // ==========================================
    const pcbGroup = new THREE.Group();
    pcbGroup.position.set(-0.6, 0.2, 0); // Inside the tower
    
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.05), pcbGreen);
    board.rotation.y = Math.PI/2;
    pcbGroup.add(board);
    
    // Chips and ICs on the board
    for(let i=0; i<8; i++) {
        const ic = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.02), siliconChip);
        ic.position.set(0.035, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.4);
        ic.rotation.y = Math.PI/2;
        pcbGroup.add(ic);
    }
    
    // Giant ASIC for DNA encoding
    const asic = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.03), siliconChip);
    asic.position.set(0.04, 0, 0);
    asic.rotation.y = Math.PI/2;
    pcbGroup.add(asic);
    
    // We leave the tower partially open so we can see the PCB
    const towerCut = new THREE.Mesh(new THREE.BoxGeometry(0.81, 1.0, 1.0), new THREE.MeshBasicMaterial({color:0xff0000}));
    // In a real Three.js CSG we'd subtract this, but here we just place the PCB so it protrudes or is visible from the open side.
    board.position.x = 0.4; 
    
    group.add(pcbGroup);
    parts.push({ mesh: board, name: "Bio-Digital Encoding ASIC", description: "Custom silicon processing unit.", function: "Translates standard binary data (01001011) into biological quaternary base pairs (A, C, G, T) for synthesis."});

    // Scale adjustment
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // The Optic Head scans back and forth over the microfluidic chip
            const scanZ = Math.sin(timeAcc * 2.0 * speed) * 0.3;
            group.userData.animatedMeshes['opticHead'].position.z = scanZ;
            
            // Lasers fire in rapid sequence to read the bases
            group.userData.animatedMeshes.lasers.forEach((laser, index) => {
                const fire = Math.sin(timeAcc * 30 * speed + index) > 0.8;
                laser.material.opacity = fire ? 0.8 : 0.0;
                
                // Track slightly to scan the surface
                laser.rotation.z = Math.sin(timeAcc * 50 * speed + index) * 0.1;
                laser.rotation.x = Math.PI/2 + Math.cos(timeAcc * 40 * speed + index) * 0.1;
            });
            
            // Reagent valves flash as they dispense A,C,G,T
            group.userData.animatedMeshes.valves.forEach((valve, index) => {
                const dispense = Math.sin(timeAcc * 20 * speed + (index * Math.PI/2)) > 0.5;
                valve.material.opacity = dispense ? 1.0 : 0.2;
            });
            
            // Fluid in the microchannels flows/pulses
            group.userData.animatedMeshes.fluids.forEach((fluid, index) => {
                fluid.material.opacity = 0.4 + (Math.sin(timeAcc * 10 * speed + index) * 0.3);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.lasers.forEach(laser => laser.material.opacity = 0);
            group.userData.animatedMeshes.valves.forEach(valve => valve.material.opacity = 0.2);
            group.userData.animatedMeshes.fluids.forEach(fluid => fluid.material.opacity = 0.2);
        }
    };

    group.userData.parts = parts;
    return group;
}
