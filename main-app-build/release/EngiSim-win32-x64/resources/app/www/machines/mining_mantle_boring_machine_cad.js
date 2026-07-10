import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const tungstenCarbide = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.7 }); // Extremely hard cutter teeth
    const thermalShield = new THREE.MeshPhysicalMaterial({ color: 0x994422, metalness: 0.3, roughness: 0.8 }); // Ablative heat shielding
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x445566, metalness: 0.8, roughness: 0.6 }); // Main chassis
    const conveyorBeltMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.9 }); // High-temp rubber
    
    // VFX Materials
    const magmaVFX = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Superheated rock
    const plasmaTorchVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Pre-melting the rock

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.cutterhead = null;
    group.userData.animatedMeshes.tracks = [];
    group.userData.animatedMeshes.conveyorBelt = null;
    group.userData.animatedMeshes.magmaChunks = [];
    group.userData.animatedMeshes.torches = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Mantle Cutterhead
    // ==========================================
    // A massive, multi-staged rotating shield
    const cutterGroup = new THREE.Group();
    cutterGroup.position.set(0, 0, 3.0);
    
    // The main dome face
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI*2, 0, Math.PI/2), heavySteel);
    dome.rotation.x = Math.PI/2;
    cutterGroup.add(dome);
    
    // Plasma pre-heaters embedded in the face
    for(let i=0; i<4; i++) {
        const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8).rotateX(Math.PI/2), plasmaTorchVFX);
        const angle = (i * Math.PI * 2) / 4;
        torch.position.set(0.8 * Math.cos(angle), 0.8 * Math.sin(angle), 0.5);
        cutterGroup.add(torch);
        group.userData.animatedMeshes.torches.push(torch);
    }
    
    // Tungsten Carbide Roller Cutters (Disk cutters)
    for(let ring=1; ring<=3; ring++) {
        const r = ring * 0.45;
        const numCutters = ring * 6;
        for(let i=0; i<numCutters; i++) {
            const angle = (i * Math.PI * 2) / numCutters;
            // The individual roller disk
            const cutter = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05).rotateZ(Math.PI/2), tungstenCarbide);
            const zOff = Math.sqrt(2.25 - (r*r)); // Match dome curve
            cutter.position.set(r * Math.cos(angle), r * Math.sin(angle), zOff + 0.05);
            // Angle the cutter to follow the curvature
            cutter.lookAt(0,0,0); 
            cutterGroup.add(cutter);
        }
    }
    
    group.add(cutterGroup);
    group.userData.animatedMeshes.cutterhead = cutterGroup;
    parts.push({ mesh: cutterGroup.children[4], name: "Tungsten Carbide Roller Cutters", description: "Hundreds of independent rotating disks.", function: "Crushes and shears the ultra-hard mantle rock into small chips after it has been pre-softened by the plasma torches."});

    // ==========================================
    // 2. PROCEDURAL CAD: Thermal Shielding & Chassis
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    // Main segmented cylindrical body
    for(let i=0; i<4; i++) {
        const segment = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.48, 1.5, 32).rotateX(Math.PI/2), heavySteel);
        segment.position.z = 1.0 - (i * 1.6);
        
        // Wrap in ablative thermal shielding tiles
        const shield = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.4, 32).rotateX(Math.PI/2), thermalShield);
        shield.position.z = 1.0 - (i * 1.6);
        chassisGroup.add(segment, shield);
    }
    
    // Continuous Crawler Tracks for gripping the tunnel walls (4 independent pods)
    for(let i=0; i<4; i++) {
        const trackPod = new THREE.Group();
        const angle = (i * Math.PI * 2) / 4 + Math.PI/4;
        
        trackPod.position.set(1.4 * Math.cos(angle), 1.4 * Math.sin(angle), 0);
        trackPod.rotation.z = angle;
        
        // Track housing
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 4.0), heavySteel);
        trackPod.add(housing);
        
        // The tread texture (we animate the texture offset later)
        const treadMap = new THREE.CanvasTexture(document.createElement('canvas')); // Dummy texture
        const treadMat = new THREE.MeshStandardMaterial({ color: 0x222222, map: treadMap });
        const tread = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 3.9), treadMat);
        trackPod.add(tread);
        group.userData.animatedMeshes.tracks.push(treadMat); // Store material to scroll
        
        chassisGroup.add(trackPod);
    }
    
    group.add(chassisGroup);
    parts.push({ mesh: chassisGroup.children[1], name: "Ablative Thermal Shielding", description: "Multi-layered ceramic/carbon composite tiles.", function: "Protects the internal cryo-systems and crew from the 4000°C ambient temperature of the Earth's lower mantle."});

    // ==========================================
    // 3. PROCEDURAL CAD: Spoil Conveyor System & Magma VFX
    // ==========================================
    const spoilGroup = new THREE.Group();
    
    // Internal conveyor tube running down the center
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6.0).rotateX(Math.PI/2), heavySteel);
    tube.position.z = 0;
    spoilGroup.add(tube);
    
    // The belt surface
    const beltMap = new THREE.CanvasTexture(document.createElement('canvas')); // Dummy texture
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x111111, map: beltMap });
    const belt = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 6.0), beltMat);
    belt.rotation.x = -Math.PI/2;
    belt.position.y = -0.1;
    spoilGroup.add(belt);
    group.userData.animatedMeshes.conveyorBelt = beltMat;
    
    // Superheated Magma Chunks (Spoil) moving down the belt
    for(let i=0; i<15; i++) {
        const chunk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 0), magmaVFX);
        chunk.userData = { t: Math.random() };
        spoilGroup.add(chunk);
        group.userData.animatedMeshes.magmaChunks.push(chunk);
    }
    
    group.add(spoilGroup);
    parts.push({ mesh: tube, name: "Internal Spoil Conveyor", description: "High-temperature Archimedes screw & belt system.", function: "Extracts the molten rock chips from the cutterhead face and rapidly transports them backward out of the bore hole to prevent clogging."});

    // Scale adjustment
    group.scale.set(0.3, 0.3, 0.3);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Cutterhead rotates
            group.userData.animatedMeshes.cutterhead.rotation.z += 1.0 * speed;
            
            // Plasma torches fire
            group.userData.animatedMeshes.torches.forEach(torch => {
                torch.material.opacity = 0.8 + (Math.random() * 0.2);
                torch.scale.y = 1.0 + (Math.random() * 2.0); // Flicker length
            });
            
            // 2. Crawler Tracks and Conveyor Belt scroll
            // (Assuming we had a real repeating texture, we would scroll offset.y)
            group.userData.animatedMeshes.tracks.forEach(mat => {
                if(mat.map) mat.map.offset.y += 0.02 * speed;
            });
            if(group.userData.animatedMeshes.conveyorBelt.map) {
                group.userData.animatedMeshes.conveyorBelt.map.offset.y -= 0.05 * speed; // Moves backwards
            }
            
            // 3. Magma Spoil chunks move down the belt
            group.userData.animatedMeshes.magmaChunks.forEach(chunk => {
                chunk.userData.t -= 0.01 * speed; // Move from +Z to -Z
                if (chunk.userData.t < 0) chunk.userData.t = 1.0;
                
                chunk.position.z = 3.0 - (chunk.userData.t * 6.0);
                chunk.position.y = -0.05 + (Math.sin(timeAcc * 20 + chunk.userData.t * 100) * 0.02); // Rumble
                chunk.position.x = Math.sin(chunk.userData.t * 50) * 0.2; // Scatter on belt
                
                // Glow fades as it cools moving backward
                chunk.material.opacity = chunk.userData.t * 1.5;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.torches.forEach(torch => torch.material.opacity = 0);
            group.userData.animatedMeshes.magmaChunks.forEach(chunk => chunk.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
