import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const chrononMat = new THREE.MeshPhysicalMaterial({ color: 0x99aacc, metalness: 0.9, roughness: 0.1 }); // Polished chronon projectors
    const stasisPodMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.1 }); // White medical-grade pods
    const podGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x4488ff, metalness: 0.1, roughness: 0.0, transmission: 0.9, transparent: true, opacity: 0.5 }); // Stasis glass
    const hyperClockMat = new THREE.MeshPhysicalMaterial({ color: 0xffcc44, metalness: 1.0, roughness: 0.2 }); // Gold-plated atomic clock
    
    // VFX Materials
    const temporalFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Time dilation bubble
    const clockTickVFX = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Visual ticking energy

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.projectors = [];
    group.userData.animatedMeshes.fields = [];
    group.userData.animatedMeshes.clockHands = [];
    group.userData.animatedMeshes.tickVFX = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Hyper-Clock Core
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 1.0;
    
    // Central atomic hyper-clock (looks like an intricate astrolabe)
    const clockBody = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), hyperClockMat);
    coreGroup.add(clockBody);
    
    // Spinning intersecting rings
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0 + (i*0.2), 0.05, 16, 64), hyperClockMat);
        if(i===0) ring.rotation.x = Math.PI/2;
        if(i===1) ring.rotation.y = Math.PI/2;
        if(i===2) ring.rotation.z = Math.PI/2;
        coreGroup.add(ring);
        group.userData.animatedMeshes.clockHands.push(ring);
    }
    
    group.add(coreGroup);
    parts.push({ mesh: clockBody, name: "Optical Lattice Hyper-Clock", description: "Ultra-precise quantum timekeeper.", function: "Measures the flow of time with zero drift across billions of years, serving as the temporal anchor for the array."});

    // ==========================================
    // 2. PROCEDURAL CAD: Stasis Pods & Projectors
    // ==========================================
    const arrayGroup = new THREE.Group();
    
    // A ring of 6 stasis pods arranged around the core
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI*2) / 6;
        const podGroup = new THREE.Group();
        podGroup.position.set(3.0 * Math.cos(angle), 0, 3.0 * Math.sin(angle));
        podGroup.lookAt(0, 0, 0);
        
        // Base of the pod
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 1.5), stasisPodMat);
        base.position.y = -0.5;
        podGroup.add(base);
        
        // The glass cover
        const coverGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32, 1, false, 0, Math.PI);
        const cover = new THREE.Mesh(coverGeo, podGlassMat);
        cover.rotation.z = Math.PI/2;
        cover.position.y = -0.5;
        podGroup.add(cover);
        
        // Chronon Field Projector (pointed down at the pod from above)
        const projector = new THREE.Group();
        projector.position.set(0, 2.0, 0);
        projector.lookAt(0, -0.5, 0); // Point at the pod
        
        const projBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.8), chrononMat);
        projBody.rotation.x = Math.PI/2;
        projector.add(projBody);
        
        // Temporal field bubble (VFX) around the pod
        const field = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), temporalFieldVFX);
        field.position.y = -0.5;
        podGroup.add(field);
        
        podGroup.add(projector);
        
        group.userData.animatedMeshes.projectors.push(projector);
        group.userData.animatedMeshes.fields.push(field);
        
        arrayGroup.add(podGroup);
    }
    
    group.add(arrayGroup);
    parts.push({ mesh: arrayGroup.children[0].children[2].children[0], name: "Chronon Field Projector", description: "Temporal distortion emitters.", function: "Projects a localized field that alters the metric of spacetime, effectively slowing down or stopping the flow of time within the bubble."});
    parts.push({ mesh: arrayGroup.children[0].children[1], name: "Stasis Pod", description: "Cryo-temporal preservation bed.", function: "Houses the subject while the temporal field reduces their biological aging and metabolic processes to absolute zero."});

    // ==========================================
    // 3. PROCEDURAL CAD: Energy Conduits & Base
    // ==========================================
    // Massive base connecting the pods to the core
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.0, 0.2, 6), darkSteel());
    floor.position.y = -0.7;
    group.add(floor);
    
    // Conduits running from core to pods
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI*2) / 6;
        const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.0).rotateZ(Math.PI/2), chrome());
        conduit.position.set(1.5 * Math.cos(angle), -0.5, 1.5 * Math.sin(angle));
        conduit.rotation.y = -angle;
        
        // Tick VFX (energy moving along conduit)
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), clockTickVFX);
        tick.position.copy(conduit.position);
        tick.rotation.y = -angle;
        tick.userData = { angle: angle };
        group.userData.animatedMeshes.tickVFX.push(tick);
        
        group.add(conduit, tick);
    }

    // Helper material
    function darkSteel() {
        return new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 });
    }
    function chrome() {
        return new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.0 });
    }

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // The hyper-clock always ticks (normal time)
        group.userData.animatedMeshes.clockHands[0].rotation.y += 0.01;
        group.userData.animatedMeshes.clockHands[1].rotation.x += 0.02;
        group.userData.animatedMeshes.clockHands[2].rotation.z += 0.03;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Temporal fields activate
            group.userData.animatedMeshes.fields.forEach((field, idx) => {
                field.material.opacity = 0.4 * speed + (Math.sin(timeAcc * 5 + idx) * 0.1);
                // Field bubbles and warps
                field.scale.setScalar(1.0 + Math.sin(timeAcc * 10 * speed + idx) * 0.05);
            });
            
            // 2. Projectors hum and vibrate
            group.userData.animatedMeshes.projectors.forEach((proj, idx) => {
                proj.position.y = 2.0 + Math.sin(timeAcc * 30 * speed + idx) * 0.05 * speed;
            });
            
            // 3. Hyper-clock speeds up drastically (relative to the slowed pods)
            group.userData.animatedMeshes.clockHands[0].rotation.y += 0.2 * speed;
            group.userData.animatedMeshes.clockHands[1].rotation.x += 0.4 * speed;
            group.userData.animatedMeshes.clockHands[2].rotation.z += 0.6 * speed;
            
            // 4. Chronon energy ticks along the conduits from the core to the pods
            group.userData.animatedMeshes.tickVFX.forEach(tick => {
                // Move from radius 0.8 to 2.5
                const phase = (timeAcc * 2 * speed) % 1.0;
                const r = 0.8 + (phase * 1.7);
                tick.position.set(r * Math.cos(tick.userData.angle), -0.5, r * Math.sin(tick.userData.angle));
                tick.material.opacity = (1.0 - phase) * speed; // Fades as it reaches the pod
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.fields.forEach(field => {
                field.material.opacity = 0.0;
                field.scale.setScalar(1.0);
            });
            group.userData.animatedMeshes.projectors.forEach(proj => proj.position.y = 2.0);
            group.userData.animatedMeshes.tickVFX.forEach(tick => tick.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
