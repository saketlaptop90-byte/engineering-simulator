import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const hullMat = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.3 }); // Starship hull
    const warpRingMat = new THREE.MeshPhysicalMaterial({ color: 0x333344, metalness: 0.9, roughness: 0.2 }); // Super-dense negative mass housing
    const coilMat = new THREE.MeshPhysicalMaterial({ color: 0xaa5522, metalness: 1.0, roughness: 0.4 }); // Exotic matter coils
    const radiatorMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 }); // Heat radiators
    
    // VFX Materials
    const warpBubbleVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, wireframe: true, blending: THREE.AdditiveBlending }); // Spacetime distortion field
    const blueShiftVFX = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Forward spacetime compression
    const redShiftVFX = new THREE.MeshBasicMaterial({ color: 0xff4422, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Aft spacetime expansion

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.rings = [];
    group.userData.animatedMeshes.coils = [];
    group.userData.animatedMeshes.bubble = null;
    group.userData.animatedMeshes.blueShift = null;
    group.userData.animatedMeshes.redShift = null;
    group.userData.animatedMeshes.ship = null;

    // ==========================================
    // 1. PROCEDURAL CAD: The Ship (Payload)
    // ==========================================
    const shipGroup = new THREE.Group();
    
    // Command module (front)
    const cmdMod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 1.5, 16).rotateX(Math.PI/2), hullMat);
    cmdMod.position.set(0, 0, 1.5);
    shipGroup.add(cmdMod);
    
    // Central spine
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4.0, 16).rotateX(Math.PI/2), hullMat);
    shipGroup.add(spine);
    
    // Radiator fins
    for(let i=0; i<4; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 2.0), radiatorMat);
        fin.rotation.z = (i * Math.PI) / 2;
        fin.position.set(0, 0, -1.0);
        shipGroup.add(fin);
    }
    
    group.add(shipGroup);
    group.userData.animatedMeshes.ship = shipGroup;
    parts.push({ mesh: cmdMod, name: "Crew Habitat & Command", description: "Zero-G central payload.", function: "Rests safely in the flat, un-warped spacetime inside the warp bubble, experiencing no acceleration or G-forces."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Warp Rings
    // ==========================================
    const ringGroup = new THREE.Group();
    
    // Two massive rings generating the Alcubierre metric
    const ringZPositions = [1.0, -1.0];
    
    for(let i=0; i<2; i++) {
        const singleRingGroup = new THREE.Group();
        singleRingGroup.position.z = ringZPositions[i];
        
        // The heavy housing
        const housing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.3, 32, 64), warpRingMat);
        singleRingGroup.add(housing);
        
        // Exposed exotic matter coils wrapped around the ring
        for(let j=0; j<16; j++) {
            const angle = (j * Math.PI*2) / 16;
            const coil = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.8), coilMat);
            // Position on the torus
            coil.position.set(1.8 * Math.cos(angle), 1.8 * Math.sin(angle), 0);
            coil.rotation.z = angle; // Align with ring normal
            singleRingGroup.add(coil);
            group.userData.animatedMeshes.coils.push(coil);
        }
        
        // Struts connecting to the ship
        for(let j=0; j<4; j++) {
            const angle = (j * Math.PI*2) / 4;
            const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5).rotateZ(Math.PI/2), hullMat);
            strut.position.set(0.9 * Math.cos(angle), 0.9 * Math.sin(angle), 0);
            strut.rotation.z = angle;
            singleRingGroup.add(strut);
        }
        
        ringGroup.add(singleRingGroup);
        group.userData.animatedMeshes.rings.push(singleRingGroup);
    }
    
    group.add(ringGroup);
    parts.push({ mesh: ringGroup.children[0].children[0], name: "Negative Mass Warp Rings", description: "Exotic matter toroids.", function: "Generates massive negative energy density to violently contract spacetime in front of the ship and expand it behind."});

    // ==========================================
    // 3. PROCEDURAL CAD: Spacetime Distortion VFX
    // ==========================================
    
    // The main warp bubble enclosing the ship
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 16), warpBubbleVFX);
    bubble.scale.z = 1.2; // Slightly elongated
    group.add(bubble);
    group.userData.animatedMeshes.bubble = bubble;
    
    // Forward Spacetime Compression (Blue Shift)
    const blueShift = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), blueShiftVFX);
    blueShift.position.z = 3.5;
    group.add(blueShift);
    group.userData.animatedMeshes.blueShift = blueShift;
    
    // Aft Spacetime Expansion (Red Shift)
    const redShift = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), redShiftVFX);
    redShift.position.z = -3.5;
    group.add(redShift);
    group.userData.animatedMeshes.redShift = redShift;

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    group.rotation.y = Math.PI/4; // View at an angle
    group.rotation.x = 0.2;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Warp rings spin in opposite directions
            group.userData.animatedMeshes.rings[0].rotation.z = timeAcc * 2.0 * speed;
            group.userData.animatedMeshes.rings[1].rotation.z = -timeAcc * 2.0 * speed;
            
            // Coils pulse with energy
            group.userData.animatedMeshes.coils.forEach((coil, idx) => {
                coil.material.emissiveIntensity = 0.5 + Math.sin(timeAcc * 15 * speed + idx) * 0.5;
                coil.material.emissive.setHex(0xffaa00);
            });
            
            // 2. Warp Bubble activates (wireframe rotates to show metric distortion)
            group.userData.animatedMeshes.bubble.material.opacity = 0.3 * speed;
            group.userData.animatedMeshes.bubble.rotation.z -= 0.1 * speed;
            group.userData.animatedMeshes.bubble.scale.x = 1.0 + Math.sin(timeAcc * 10 * speed) * 0.05;
            group.userData.animatedMeshes.bubble.scale.y = 1.0 + Math.cos(timeAcc * 10 * speed) * 0.05;
            
            // 3. Spacetime compression (Blue Shift) pulses rapidly at the front
            group.userData.animatedMeshes.blueShift.material.opacity = 0.6 * speed * (0.5 + Math.sin(timeAcc * 30 * speed)*0.5);
            group.userData.animatedMeshes.blueShift.scale.set(1.0, 1.0, 0.2 + (Math.sin(timeAcc * 20 * speed) * 0.1)); // Flattening
            
            // 4. Spacetime expansion (Red Shift) stretches out at the rear
            group.userData.animatedMeshes.redShift.material.opacity = 0.6 * speed * (0.5 + Math.sin(timeAcc * 30 * speed)*0.5);
            group.userData.animatedMeshes.redShift.scale.set(1.0, 1.0, 1.5 + (Math.sin(timeAcc * 20 * speed) * 0.5)); // Stretching
            
            // 5. Very slight vibration of the ship payload (though it should be perfectly still, it adds effect)
            group.userData.animatedMeshes.ship.position.y = Math.sin(timeAcc * 50 * speed) * 0.02 * speed;
            
        } else {
            // Idle
            group.userData.animatedMeshes.rings[0].rotation.z = 0;
            group.userData.animatedMeshes.rings[1].rotation.z = 0;
            group.userData.animatedMeshes.bubble.material.opacity = 0.0;
            group.userData.animatedMeshes.blueShift.material.opacity = 0.0;
            group.userData.animatedMeshes.redShift.material.opacity = 0.0;
            group.userData.animatedMeshes.coils.forEach(c => c.material.emissiveIntensity = 0.0);
            group.userData.animatedMeshes.ship.position.y = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
