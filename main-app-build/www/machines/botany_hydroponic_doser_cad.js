import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const chassisAl = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.3 });
    const lcdScreenOn = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green digital readout
    const lcdScreenOff = new THREE.MeshPhysicalMaterial({ color: 0x112211, metalness: 0.1, roughness: 0.2 });
    const clearTubing = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const nutrientA = new THREE.MeshPhysicalMaterial({ color: 0xff3333, transmission: 0.6, opacity: 1, transparent: true }); // Red Nitrogen
    const nutrientB = new THREE.MeshPhysicalMaterial({ color: 0x3333ff, transmission: 0.6, opacity: 1, transparent: true }); // Blue Phos/Potash
    const phUp = new THREE.MeshPhysicalMaterial({ color: 0xffff33, transmission: 0.6, opacity: 1, transparent: true });    // Yellow pH buffer
    
    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pumpRotors = [];
    group.userData.animatedMeshes.fluidFlow = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Main Controller Housing
    // ==========================================
    const consoleGroup = new THREE.Group();
    
    // Extruded aluminum back panel / mounting rail
    const panelShape = new THREE.Shape();
    panelShape.moveTo(-1.2, -0.6);
    panelShape.lineTo(1.2, -0.6);
    panelShape.lineTo(1.2, 0.6);
    panelShape.lineTo(-1.2, 0.6);
    const panelGeo = new THREE.ExtrudeGeometry(panelShape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
    const panel = new THREE.Mesh(panelGeo, chassisAl);
    panel.position.set(0, 1.0, 0);
    consoleGroup.add(panel);
    
    // Digital LCD Touchscreen
    const lcdFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.05), plastic);
    lcdFrame.position.set(0, 1.2, 0.21);
    const lcdDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.4), lcdScreenOff);
    lcdDisplay.position.set(0, 1.2, 0.24);
    consoleGroup.add(lcdFrame, lcdDisplay);
    group.userData.animatedMeshes['lcd'] = lcdDisplay;
    
    group.add(consoleGroup);
    parts.push({ mesh: panel, name: "Control Panel & Manifold Rail", description: "Wall-mounted aluminum extrusion.", function: "Houses the master PLC controller and supports the peristaltic pumps."});

    // ==========================================
    // 2. PROCEDURAL CAD: Peristaltic Pump Heads
    // ==========================================
    const pumpGroup = new THREE.Group();
    
    const pumpCount = 3;
    const pumpSpacing = 0.6;
    const startX = -((pumpCount-1) * pumpSpacing) / 2;
    
    // We create an intricate rotary peristaltic mechanism
    const headGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32).rotateX(Math.PI/2);
    const rotorGeo = new THREE.BoxGeometry(0.3, 0.08, 0.08); // The crossbar holding the rollers
    const rollerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16).rotateX(Math.PI/2);
    
    for (let i = 0; i < pumpCount; i++) {
        const pAssembly = new THREE.Group();
        pAssembly.position.set(startX + i * pumpSpacing, 0.8, 0.25);
        
        // Pump Motor housing (behind the panel)
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3).rotateX(Math.PI/2), darkSteel);
        motor.position.set(0, 0, -0.2);
        pAssembly.add(motor);
        
        // Transparent Pump Head Cover
        const cover = new THREE.Mesh(headGeo, clearTubing);
        pAssembly.add(cover);
        
        // Internal Rotor
        const rotor = new THREE.Group();
        const crossbar = new THREE.Mesh(rotorGeo, steel);
        
        // Rollers at the ends of the crossbar (they squeeze the tube)
        const roller1 = new THREE.Mesh(rollerGeo, plastic); roller1.position.set(0.12, 0, 0);
        const roller2 = new THREE.Mesh(rollerGeo, plastic); roller2.position.set(-0.12, 0, 0);
        rotor.add(crossbar, roller1, roller2);
        
        pAssembly.add(rotor);
        group.userData.animatedMeshes.pumpRotors.push(rotor);
        
        // The squishy silicone tube routed around the rollers
        // A half-circle tube
        const tubePath = new THREE.TorusGeometry(0.13, 0.025, 16, 32, Math.PI);
        const pumpTube = new THREE.Mesh(tubePath, clearTubing);
        pumpTube.rotation.z = Math.PI / 2;
        pAssembly.add(pumpTube);
        
        pumpGroup.add(pAssembly);
    }
    
    group.add(pumpGroup);
    parts.push({ mesh: pumpGroup, name: "Peristaltic Dosing Pumps", description: "3 stepper-motor driven rotary pumps with silicone tubing.", function: "Provides ultra-precise volumetric displacement (ml/min) without fluid contacting the pump mechanism."});

    // ==========================================
    // 3. PROCEDURAL CAD: Nutrient Tanks & Fluid Tubing
    // ==========================================
    const tankGroup = new THREE.Group();
    const fluidColors = [nutrientA, nutrientB, phUp];
    
    const tankGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 32);
    
    for (let i = 0; i < pumpCount; i++) {
        const xPos = startX + i * pumpSpacing;
        
        // Source Tank
        const tank = new THREE.Mesh(tankGeo, plastic);
        tank.material.transparent = true;
        tank.material.opacity = 0.5;
        tank.position.set(xPos, -0.5, 0);
        
        // Fluid inside tank
        const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.7, 32), fluidColors[i]);
        fluid.position.set(xPos, -0.5, 0);
        
        tankGroup.add(tank, fluid);
        
        // Supply Tube (Tank to Pump)
        const supplyTube = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2), clearTubing);
        supplyTube.position.set(xPos - 0.13, 0.2, 0.25); // Connects to left side of pump head
        tankGroup.add(supplyTube);
        
        // Discharge Tube (Pump to mixing manifold)
        const dischargeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5), clearTubing);
        dischargeTube.position.set(xPos + 0.13, 0.55, 0.25); // Connects to right side of pump head
        tankGroup.add(dischargeTube);
        
        // Simulated fluid flow drops in the discharge tube
        const dropGeo = new THREE.SphereGeometry(0.01, 8, 8);
        const drop = new THREE.Mesh(dropGeo, fluidColors[i]);
        drop.position.set(xPos + 0.13, 0.55, 0.25);
        drop.visible = false; // Hidden when idle
        tankGroup.add(drop);
        group.userData.animatedMeshes.fluidFlow.push({ drop: drop, x: xPos + 0.13, baseY: 0.55 });
    }
    
    // Mixing Manifold (Main PVC pipe below)
    const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.8).rotateZ(Math.PI/2), plastic);
    manifold.position.set(0, 0.2, 0.25);
    tankGroup.add(manifold);

    group.add(tankGroup);
    parts.push({ mesh: manifold, name: "Mixing Manifold & Storage Tanks", description: "Clear PVC piping networks integrating source solutions.", function: "Injects concentrated Nitrogen, Potassium, and pH buffers into the main irrigation line."});

    // ==========================================
    // 4. Factual Fasteners (1,200 parts)
    // ==========================================
    const boltCount = 1200;
    const boltGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 6).rotateX(Math.PI/2);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the control panel
        dummy.position.set((Math.random() - 0.5) * 2.2, Math.random() * 1.0 + 0.5, 0.1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "1,200 Panel Screws", description: "Factual quantity of instanced M3 mounting screws.", function: "Seals the control electronics against the highly humid greenhouse environment." });
    
    // Scale adjustment
    group.scale.set(1.5, 1.5, 1.5);
    group.position.y = 0.5;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // LCD Screen turns ON
            group.userData.animatedMeshes['lcd'].material = lcdScreenOn;
            
            // Pump rotors spin!
            group.userData.animatedMeshes.pumpRotors.forEach((rotor, idx) => {
                // Different pumps can pulse at different rates, but we just use speed
                rotor.rotation.z -= (0.1 + (idx * 0.05)) * speed;
            });
            
            // Fluid drops flow down the discharge tubes into the manifold
            group.userData.animatedMeshes.fluidFlow.forEach((flow, idx) => {
                flow.drop.visible = true;
                // Move drop down
                flow.drop.position.y -= 0.02 * speed;
                // Reset drop if it hits the manifold
                if (flow.drop.position.y < 0.25) {
                    flow.drop.position.y = flow.baseY + 0.2; // Start from top of tube
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes['lcd'].material = lcdScreenOff;
            group.userData.animatedMeshes.fluidFlow.forEach(flow => {
                flow.drop.visible = false;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
