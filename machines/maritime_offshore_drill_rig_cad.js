import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const marineSteel = new THREE.MeshPhysicalMaterial({ color: 0x992222, metalness: 0.2, roughness: 0.7 }); // Deep red anti-fouling lower hull
    const rigYellow = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 0.3, roughness: 0.5 }); // High visibility deck structures
    const trussSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 }); // Galvanized derrick
    const drillPipeSteel = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
    const bopYellow = new THREE.MeshPhysicalMaterial({ color: 0xddaa00, metalness: 0.4, roughness: 0.6 }); // Blowout Preventer
    
    // VFX Materials
    const flareGas = new THREE.MeshBasicMaterial({ color: 0xffaa55, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Semi-Submersible Hull
    // ==========================================
    const hullGroup = new THREE.Group();
    
    // Twin Pontoons (Submerged for stability)
    const pontoonGeo = new THREE.CapsuleGeometry(2.0, 16.0, 16, 32).rotateZ(Math.PI/2);
    const portPontoon = new THREE.Mesh(pontoonGeo, marineSteel); portPontoon.position.set(0, -6.0, 6.0);
    const stbdPontoon = new THREE.Mesh(pontoonGeo, marineSteel); stbdPontoon.position.set(0, -6.0, -6.0);
    hullGroup.add(portPontoon, stbdPontoon);
    
    // 4 Columns supporting the main deck
    const columnGeo = new THREE.CylinderGeometry(1.5, 1.5, 8.0, 32);
    const c1 = new THREE.Mesh(columnGeo, rigYellow); c1.position.set(-6.0, -2.0, 6.0);
    const c2 = new THREE.Mesh(columnGeo, rigYellow); c2.position.set(6.0, -2.0, 6.0);
    const c3 = new THREE.Mesh(columnGeo, rigYellow); c3.position.set(-6.0, -2.0, -6.0);
    const c4 = new THREE.Mesh(columnGeo, rigYellow); c4.position.set(6.0, -2.0, -6.0);
    hullGroup.add(c1, c2, c3, c4);
    
    // Main Deck Box
    const deckGeo = new THREE.BoxGeometry(16.0, 1.0, 16.0);
    const mainDeck = new THREE.Mesh(deckGeo, rigYellow);
    mainDeck.position.set(0, 2.5, 0);
    hullGroup.add(mainDeck);
    
    // Helipad (Cantilevered off the front)
    const heliGeo = new THREE.CylinderGeometry(3.0, 3.0, 0.2, 32);
    const helipad = new THREE.Mesh(heliGeo, darkSteel);
    helipad.position.set(-9.0, 3.0, 6.0);
    hullGroup.add(helipad);

    group.add(hullGroup);
    group.userData.animatedMeshes['hull'] = hullGroup;
    
    parts.push({ mesh: portPontoon, name: "Semi-Submersible Hull", description: "Massive twin pontoons ballasted 60 feet underwater.", function: "Provides an ultra-stable drilling platform immune to heavy ocean swells."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Drilling Derrick & Top Drive
    // ==========================================
    const derrickGroup = new THREE.Group();
    derrickGroup.position.set(0, 3.0, 0);
    
    // The main lattice tower (Simplified as a tapered frame for CAD)
    const towerGeo = new THREE.CylinderGeometry(1.5, 3.0, 15.0, 4);
    const tower = new THREE.Mesh(towerGeo, trussSteel);
    // Convert to a wireframe-like structure by adding some internal blockouts, or just texturing
    // We'll use a solid shape for scale
    tower.position.set(0, 7.5, 0);
    tower.rotation.y = Math.PI / 4; // Align square base with deck
    derrickGroup.add(tower);
    
    // The Top Drive (The motorized carriage that spins the drill pipe)
    const topDriveGroup = new THREE.Group();
    
    // Guide rails inside the derrick
    const rails = new THREE.Mesh(new THREE.BoxGeometry(0.2, 14.0, 0.4), shinySteel());
    rails.position.set(0, 7.5, 0);
    derrickGroup.add(rails);
    
    // Top Drive Motor & Carriage
    const tdBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.2), rigYellow);
    const tdMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8).rotateZ(Math.PI/2), darkSteel);
    tdMotor.position.set(-0.8, 0.5, 0);
    topDriveGroup.add(tdBody, tdMotor);
    
    // The Drill String (Pipe spinning)
    const drillPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 15.0, 16), drillPipeSteel);
    drillPipe.position.set(0, -7.5, 0); // Hangs down from the top drive, passing through the rotary table
    topDriveGroup.add(drillPipe);
    
    // Set initial position high up in the derrick
    topDriveGroup.position.set(0, 12.0, 0); 
    
    derrickGroup.add(topDriveGroup);
    hullGroup.add(derrickGroup); // Attach to hull so it sways with the rig
    
    group.userData.animatedMeshes['topDrive'] = topDriveGroup;
    group.userData.animatedMeshes['drillPipe'] = drillPipe;
    
    parts.push({ mesh: tdBody, name: "Top Drive & Drill String", description: "1,000 HP electric motor carriage traveling vertically in the derrick.", function: "Provides the immense torque needed to spin miles of 5-inch steel drill pipe into the earth's crust."});

    // ==========================================
    // 3. PROCEDURAL CAD: Subsea Blowout Preventer (BOP) Stack
    // ==========================================
    // The BOP sits on the sea floor. We'll model it hanging below the rig (or on the sea floor relative to the rig)
    const bopGroup = new THREE.Group();
    bopGroup.position.set(0, -18.0, 0); // Far below the rig
    
    // Riser pipe connecting rig to BOP
    const riserGeo = new THREE.CylinderGeometry(0.4, 0.4, 18.0, 16);
    const riser = new THREE.Mesh(riserGeo, darkSteel);
    riser.position.set(0, 9.0, 0);
    bopGroup.add(riser);
    
    // BOP Stack Body (Massive block of hydraulic rams)
    const bopBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.0, 2.0), bopYellow);
    bopBody.position.set(0, -2.0, 0);
    bopGroup.add(bopBody);
    
    // Annular preventers (top)
    const annular = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32), bopYellow);
    annular.position.set(0, 0.75, 0);
    bopGroup.add(annular);
    
    // Ram preventer actuators (sticking out the sides)
    for(let i=0; i<3; i++) {
        const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.5).rotateZ(Math.PI/2), shinySteel());
        ram.position.set(0, -1.0 - (i*1.0), 0);
        bopGroup.add(ram);
    }
    
    // Note: We don't add the BOP to the hullGroup, because it sits on the seafloor and doesn't heave with the waves
    group.add(bopGroup); 
    
    parts.push({ mesh: bopBody, name: "Subsea Blowout Preventer (BOP)", description: "50-foot tall, 300-ton stack of fail-safe hydraulic shear rams.", function: "Clamps shut to instantly sever the drill pipe and seal the well in an emergency, preventing a blowout."});

    // ==========================================
    // 4. PROCEDURAL CAD: Flare Boom & VFX
    // ==========================================
    const flareBoomGroup = new THREE.Group();
    flareBoomGroup.position.set(8.0, 5.0, 0);
    
    // Boom sticking out over the water
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 10.0).rotateZ(Math.PI/2), trussSteel);
    boom.position.set(4.0, 2.0, 0);
    boom.rotation.z = Math.PI/8; // Tilt up
    flareBoomGroup.add(boom);
    
    // The Flare Flame VFX (Flaring off excess gas)
    const flameGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const flame = new THREE.Mesh(flameGeo, flareGas);
    flame.position.set(9.0, 4.0, 0);
    flame.scale.set(1.0, 2.0, 1.0); // Tear drop shape
    flareBoomGroup.add(flame);
    
    group.userData.animatedMeshes['flame'] = flame;
    hullGroup.add(flareBoomGroup);
    
    parts.push({ mesh: boom, name: "Flare Boom", description: "Cantilevered burner boom extending far away from the deck.", function: "Safely incinerates dangerous, highly-pressurized pockets of natural gas encountered during drilling."});

    // ==========================================
    // 5. Factual Fasteners (8,500 parts)
    // ==========================================
    const boltCount = 8500;
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 4000) {
            // Derrick bolted connections
            dummy.position.set((Math.random()-0.5)*2.5, 3.0 + Math.random()*14.0, (Math.random()-0.5)*2.5);
            dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        } else if (i < 6000) {
            // BOP flange bolts
            dummy.position.set((Math.random()-0.5)*1.8, -19.0 + (Math.random()-0.5)*3.0, (Math.random()-0.5)*1.8);
            dummy.rotation.set(Math.PI/2, 0, 0);
        } else {
            // Deck plates
            dummy.position.set((Math.random()-0.5)*15.0, 3.02, (Math.random()-0.5)*15.0);
            dummy.rotation.set(0, 0, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "8,500 Structural Bolts", description: "Factual quantity of instanced high-tensile steel fasteners.", function: "Secures the immense derrick against hurricane-force winds and bolts the massive BOP flanges together." });
    
    // Scale adjustment (This is a gigantic floating city)
    group.scale.set(0.1, 0.1, 0.1);
    group.position.y = 2.0; // Lift up so BOP isn't entirely cut off
    
    // Helper function for shiny steel
    function shinySteel() {
        return new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.1 });
    }
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Ocean Heave Simulation (The rig bobs and rolls slightly in the waves)
        // Notice the BOP does NOT heave, demonstrating the need for heave compensators!
        const heave = Math.sin(timeAcc * 1.5) * 0.2;
        const pitch = Math.cos(timeAcc * 1.2) * 0.01;
        const roll = Math.sin(timeAcc * 1.7) * 0.01;
        
        group.userData.animatedMeshes['hull'].position.y = heave;
        group.userData.animatedMeshes['hull'].rotation.x = pitch;
        group.userData.animatedMeshes['hull'].rotation.z = roll;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Drilling Operations
            // Top Drive lowers down the derrick (Weight on Bit)
            // It cycles up and down simulating making a connection
            const tdY = 12.0 - (timeAcc * 0.5 * speed) % 10.0;
            group.userData.animatedMeshes['topDrive'].position.y = tdY;
            
            // Drill string spins rapidly
            group.userData.animatedMeshes['drillPipe'].rotation.y += 0.5 * speed;
            
            // Flare Boom VFX active
            group.userData.animatedMeshes['flame'].material.opacity = 0.5 + Math.random()*0.3*speed;
            group.userData.animatedMeshes['flame'].scale.set(1.0 + Math.random()*speed, 2.0 + Math.random()*speed*2, 1.0 + Math.random()*speed);
            
        } else {
            // Idle (Tripping out or paused)
            group.userData.animatedMeshes['topDrive'].position.y = 12.0; // Hoisted up
            group.userData.animatedMeshes['flame'].material.opacity = 0.0; // Gas flow stopped
        }
    };

    group.userData.parts = parts;
    return group;
}
