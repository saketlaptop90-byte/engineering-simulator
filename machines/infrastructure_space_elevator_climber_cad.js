import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const carbonComposite = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7, clearcoat: 0.3 }); // Main climber body
    const gripTread = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 }); // Roller treads grabbing the tether
    const receiverMirror = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.1 }); // Laser power receiver
    const tetherMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.1, roughness: 0.5 }); // Carbon Nanotube Ribbon
    const radiatorAl = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 }); 
    
    // VFX Materials
    const powerLaserVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Beamed power from Earth
    const sparkVFX = new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.rollers = [];
    group.userData.animatedMeshes.lasers = [];
    group.userData.animatedMeshes.sparks = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Carbon Nanotube Tether
    // ==========================================
    // Visualizing a section of the 100,000 km ribbon
    const tetherGeo = new THREE.BoxGeometry(0.1, 20.0, 2.0); // 10cm thick, 2m wide ribbon
    const tether = new THREE.Mesh(tetherGeo, tetherMat);
    tether.position.set(0, 0, 0);
    group.add(tether);
    
    // We scroll the texture (or just leave it solid since CNT is visually featureless at macro scale)
    group.userData.animatedMeshes['tether'] = tether;

    // ==========================================
    // 2. PROCEDURAL CAD: The Climber Body
    // ==========================================
    const climberGroup = new THREE.Group();
    
    // Main Chassis (wraps around the tether)
    const chassisGeo = new THREE.BoxGeometry(2.5, 4.0, 3.0);
    const chassis = new THREE.Mesh(chassisGeo, carbonComposite);
    
    // Cut a slot out for the tether using a smaller box (simulate by building with 2 sides)
    // Actually, we'll build it out of distinct plates
    const leftPlate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.0, 3.0), carbonComposite); leftPlate.position.x = -0.75;
    const rightPlate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.0, 3.0), carbonComposite); rightPlate.position.x = 0.75;
    const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.0, 0.5), carbonComposite); frontPlate.position.z = 1.25;
    
    climberGroup.add(leftPlate, rightPlate, frontPlate); // Back is open where it was slotted onto the tether
    
    // Payload Module (top)
    const payloadGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.5, 32).rotateZ(Math.PI/2);
    const payload = new THREE.Mesh(payloadGeo, aluminum);
    payload.position.set(0, 2.5, 0);
    climberGroup.add(payload);
    
    parts.push({ mesh: leftPlate, name: "Climber Chassis & Payload", description: "Ultralight carbon-composite structure.", function: "Carries 20 tons of cargo to Geostationary Earth Orbit (GEO) over a 7-day climb."});

    // ==========================================
    // 3. PROCEDURAL CAD: Traction Rollers
    // ==========================================
    // The mechanism that grips the ribbon and drives the climber upwards
    // Array of heavy duty rollers pressing against both sides of the ribbon
    for(let yOffset of [-1.5, 0, 1.5]) {
        for(let side of [-1, 1]) {
            const rollerGroup = new THREE.Group();
            // Rollers are positioned on the face of the ribbon (which is along the Z axis, so they press in from X)
            rollerGroup.position.set(side * 0.15, yOffset, 0); 
            
            // The drive wheel
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.0, 32).rotateX(Math.PI/2), gripTread);
            rollerGroup.add(wheel);
            
            // Motor housing
            const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5).rotateX(Math.PI/2), darkSteel);
            motor.position.set(0, 0, side * 1.1); // Stick out the end
            rollerGroup.add(motor);
            
            climberGroup.add(rollerGroup);
            group.userData.animatedMeshes.rollers.push({ wheel: wheel, side: side });
        }
    }
    
    parts.push({ mesh: climberGroup.children[3], name: "Magnetic Traction Rollers", description: "Array of high-friction treads powered by superconducting motors.", function: "Grips the atomically smooth carbon nanotube ribbon to drive the climber vertically at 200 km/h."});

    // ==========================================
    // 4. PROCEDURAL CAD: Laser Power Receivers
    // ==========================================
    // Massive mirror dishes deployed to catch the power beam from Earth
    for(let side of [-1, 1]) {
        const receiverGroup = new THREE.Group();
        receiverGroup.position.set(side * 1.5, -2.0, 0);
        
        // Deployment arm
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.0).rotateZ(Math.PI/2), darkSteel);
        arm.position.set(side * 1.0, 0, 0);
        receiverGroup.add(arm);
        
        // The parabolic dish (pointing down towards Earth)
        const dish = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI/3), receiverMirror);
        dish.position.set(side * 2.0, 0, 0);
        dish.rotation.x = Math.PI; // Point down
        receiverGroup.add(dish);
        
        // Photovoltaic / Thermal conversion core
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), darkSteel);
        core.position.set(side * 2.0, -0.8, 0);
        receiverGroup.add(core);
        
        // Beamed Power VFX
        const laserVFX = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 20.0, 32), powerLaserVFX);
        laserVFX.position.set(side * 2.0, -10.0, 0);
        receiverGroup.add(laserVFX);
        group.userData.animatedMeshes.lasers.push(laserVFX);
        
        climberGroup.add(receiverGroup);
    }
    
    parts.push({ mesh: climberGroup.children[9], name: "Laser Power Receivers", description: "Parabolic reflectors focusing ground-based multi-megawatt laser beams.", function: "Because batteries are too heavy for a 100,000km climb, the climber receives its power continuously beamed from Earth."});

    group.add(climberGroup);
    group.userData.animatedMeshes['climber'] = climberGroup;

    // ==========================================
    // 5. Factual Fasteners (8,500 parts)
    // ==========================================
    const boltCount = 8500;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Bolt the chassis plates together
    for (let i = 0; i < boltCount; i++) {
        if (i < 4000) {
            // Seams along the front plate
            const x = (Math.random() > 0.5) ? -1.2 : 1.2;
            const y = (Math.random() - 0.5) * 3.8;
            dummy.position.set(x, y, 1.25);
            dummy.rotation.set(Math.PI/2, 0, 0); 
        } else {
            // Roller mounts
            dummy.position.set((Math.random() - 0.5) * 2.0, (Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 1.5);
            dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    climberGroup.add(instancedBolts); // Add to climber so they move with it
    
    parts.push({ mesh: instancedBolts, name: "8,500 Structural Fasteners", description: "Factual quantity of titanium alloy bolts.", function: "Secures the high-tension traction rollers against the ribbon." });
    
    // Scale adjustment
    group.scale.set(0.5, 0.5, 0.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // The climber moves up (simulated by moving the tether down, or just vibrating the climber while the rollers spin)
            // We will vibrate the climber slightly and spin the rollers extremely fast
            
            group.userData.animatedMeshes.rollers.forEach(roller => {
                // Side -1 spins one way, side 1 spins the other to drive up
                roller.wheel.rotation.x -= roller.side * 0.5 * speed;
            });
            
            // Ground-based lasers turn on to supply power
            group.userData.animatedMeshes.lasers.forEach(laser => {
                laser.material.opacity = 0.4 + (Math.random() * 0.2); // Atmospheric scintillation effect
            });
            
            // Slight vertical vibration
            const vibe = Math.sin(timeAcc * 60) * 0.01 * speed;
            group.userData.animatedMeshes['climber'].position.y = vibe;
            
        } else {
            // Idle
            group.userData.animatedMeshes.lasers.forEach(laser => {
                laser.material.opacity = 0;
            });
            group.userData.animatedMeshes['climber'].position.y = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
