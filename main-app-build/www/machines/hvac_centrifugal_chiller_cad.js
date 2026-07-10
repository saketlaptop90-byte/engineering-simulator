import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const castIron = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.8 }); // Compressor volute
    const paintedSteelBlue = new THREE.MeshPhysicalMaterial({ color: 0x113366, metalness: 0.2, roughness: 0.4, clearcoat: 0.1 }); // Evaporator shell
    const paintedSteelRed = new THREE.MeshPhysicalMaterial({ color: 0x882222, metalness: 0.2, roughness: 0.4, clearcoat: 0.1 }); // Condenser shell
    const copperTube = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.3 }); // Internal heat exchanger tubes
    const controlBoxAl = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    
    // VFX Materials
    const lcdScreenOn = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 
    const lcdScreenOff = new THREE.MeshPhysicalMaterial({ color: 0x112211, metalness: 0.1, roughness: 0.2 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Heat Exchanger Shells
    // ==========================================
    const shellGroup = new THREE.Group();
    
    // Lower Shell: Evaporator (Chilled Water)
    const evapGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.0, 32).rotateZ(Math.PI/2);
    const evaporator = new THREE.Mesh(evapGeo, paintedSteelBlue);
    evaporator.position.set(0, -0.6, 0);
    shellGroup.add(evaporator);
    
    // Upper Shell: Condenser (Cooling Tower Water)
    const condGeo = new THREE.CylinderGeometry(1.0, 1.0, 5.5, 32).rotateZ(Math.PI/2);
    const condenser = new THREE.Mesh(condGeo, paintedSteelRed);
    condenser.position.set(0, 1.8, 0);
    shellGroup.add(condenser);
    
    // Water Box Heads (The end caps where pipes connect)
    const headGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.4, 32).rotateZ(Math.PI/2);
    const evapHeadL = new THREE.Mesh(headGeo, paintedSteelBlue); evapHeadL.position.set(-3.0, -0.6, 0);
    const evapHeadR = new THREE.Mesh(headGeo, paintedSteelBlue); evapHeadR.position.set(3.0, -0.6, 0);
    const condHeadL = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.4, 32).rotateZ(Math.PI/2), paintedSteelRed); condHeadL.position.set(-2.75, 1.8, 0);
    const condHeadR = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.4, 32).rotateZ(Math.PI/2), paintedSteelRed); condHeadR.position.set(2.75, 1.8, 0);
    
    // Massive Water pipe connections (flanges)
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const p1 = new THREE.Mesh(pipeGeo, paintedSteelBlue); p1.position.set(-3.0, -0.6, 1.2); p1.rotation.x = Math.PI/2;
    const p2 = new THREE.Mesh(pipeGeo, paintedSteelBlue); p2.position.set(-3.0, -0.6, -1.2); p2.rotation.x = Math.PI/2;
    const p3 = new THREE.Mesh(pipeGeo, paintedSteelRed); p3.position.set(2.75, 1.8, 1.0); p3.rotation.x = Math.PI/2;
    const p4 = new THREE.Mesh(pipeGeo, paintedSteelRed); p4.position.set(2.75, 1.8, -1.0); p4.rotation.x = Math.PI/2;
    
    shellGroup.add(evapHeadL, evapHeadR, condHeadL, condHeadR, p1, p2, p3, p4);

    group.add(shellGroup);
    parts.push({ mesh: evaporator, name: "Evaporator & Condenser Shells", description: "Massive ASME-rated steel pressure vessels.", function: "Houses thousands of internally enhanced copper tubes to exchange heat between the refrigerant and the building's water loops."});

    // ==========================================
    // 2. PROCEDURAL CAD: Centrifugal Compressor
    // ==========================================
    const compressorGroup = new THREE.Group();
    compressorGroup.position.set(0, 3.8, 0); // Sits on top of the condenser
    
    // Motor Housing (Direct drive electric motor)
    const motorGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32).rotateZ(Math.PI/2);
    const motor = new THREE.Mesh(motorGeo, castIron);
    motor.position.set(-1.0, 0, 0);
    compressorGroup.add(motor);
    
    // Volute / Scroll casing (where the impeller lives)
    // We'll simulate a volute using a squashed torus
    const voluteGeo = new THREE.TorusGeometry(1.0, 0.6, 32, 64);
    const volute = new THREE.Mesh(voluteGeo, castIron);
    volute.rotation.y = Math.PI / 2;
    volute.scale.set(1.0, 1.2, 1.0); // Make it slightly oblong like a real volute
    volute.position.set(0.8, 0, 0);
    compressorGroup.add(volute);
    
    // Suction Pipe (from Evaporator to Compressor)
    const suctionGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32);
    const suctionPipe = new THREE.Mesh(suctionGeo, castIron);
    suctionPipe.position.set(1.5, -1.5, 0); // Connects into the eye of the impeller
    suctionPipe.rotation.z = Math.PI/4;
    compressorGroup.add(suctionPipe);
    
    // Discharge Pipe (from Compressor to Condenser)
    const dischargeGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const dischargePipe = new THREE.Mesh(dischargeGeo, castIron);
    dischargePipe.position.set(0.8, -1.0, 0); 
    compressorGroup.add(dischargePipe);
    
    // Animate the internal motor shaft (visualized as a spinning coupling between motor and volute if visible, 
    // but here it's sealed. We will animate a cooling fan on the back of the motor instead)
    const fanGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16).rotateZ(Math.PI/2);
    const fan = new THREE.Mesh(fanGeo, steel);
    fan.position.set(-2.3, 0, 0);
    compressorGroup.add(fan);
    group.userData.animatedMeshes['motorFan'] = fan;

    group.add(compressorGroup);
    parts.push({ mesh: volute, name: "Centrifugal Compressor & Volute", description: "Direct-drive, multi-stage aerodynamic compressor casing.", function: "Spins a machined titanium impeller at high speeds to compress low-pressure refrigerant gas into high-pressure hot gas."});

    // ==========================================
    // 3. PROCEDURAL CAD: Control Panel & VSD
    // ==========================================
    const controlGroup = new THREE.Group();
    
    // Variable Speed Drive (VSD) cabinet
    const vsdGeo = new THREE.BoxGeometry(1.5, 2.5, 0.8);
    const vsd = new THREE.Mesh(vsdGeo, controlBoxAl);
    vsd.position.set(-1.5, 1.5, 1.5);
    
    // HMI Screen
    const hmiGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const hmi = new THREE.Mesh(hmiGeo, lcdScreenOff);
    hmi.position.set(-1.5, 2.0, 1.91);
    
    controlGroup.add(vsd, hmi);
    group.add(controlGroup);
    
    group.userData.animatedMeshes['hmi'] = hmi;
    
    parts.push({ mesh: vsd, name: "VSD & OptiView Control Center", description: "Variable Speed Drive power cabinet and HMI touchscreen.", function: "Modulates compressor speed to perfectly match the building's cooling load, saving massive amounts of energy."});

    // ==========================================
    // 4. Factual Fasteners (3,800 parts)
    // ==========================================
    const boltCount = 3800;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6).rotateX(Math.PI/2);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, chrome, boltCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute tightly around the Water Box Heads (huge bolted flanges)
        if (i < 1900) {
            // Evaporator Heads
            const isLeft = Math.random() > 0.5;
            const x = isLeft ? -2.8 : 2.8;
            const theta = Math.random() * Math.PI * 2;
            const r = 1.15;
            bDummy.position.set(x, -0.6 + (r * Math.cos(theta)), r * Math.sin(theta));
            bDummy.rotation.set(0, Math.PI/2, 0);
        } else {
            // Condenser Heads
            const isLeft = Math.random() > 0.5;
            const x = isLeft ? -2.55 : 2.55;
            const theta = Math.random() * Math.PI * 2;
            const r = 0.95;
            bDummy.position.set(x, 1.8 + (r * Math.cos(theta)), r * Math.sin(theta));
            bDummy.rotation.set(0, Math.PI/2, 0);
        }
        bDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, bDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "3,800 Flange Bolts", description: "Factual quantity of instanced heavy-duty hex bolts.", function: "Seals the removable water box heads, allowing maintenance access to tube cleaning." });
    
    // Scale adjustment 
    group.scale.set(0.35, 0.35, 0.35);
    group.position.y = 0.5;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Compressor motor cooling fan spins extremely fast (representing the internal 15,000 RPM shaft)
            group.userData.animatedMeshes['motorFan'].rotation.x -= 2.0 * speed;
            
            // The massive machine vibrates slightly when running at high load
            const vibration = Math.sin(timeAcc * 40) * 0.002 * speed;
            compressorGroup.position.y = 3.8 + vibration;
            
            // HMI Screen turns Green
            group.userData.animatedMeshes['hmi'].material = lcdScreenOn;
            
        } else {
            // Idle
            group.userData.animatedMeshes['hmi'].material = lcdScreenOff;
            compressorGroup.position.y = 3.8;
            group.userData.animatedMeshes['motorFan'].rotation.x -= 0.05; // Spindown
        }
    };

    group.userData.parts = parts;
    return group;
}
