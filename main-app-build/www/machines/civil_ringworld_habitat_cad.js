import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const scrithMat = new THREE.MeshPhysicalMaterial({ color: 0x223344, metalness: 0.9, roughness: 0.2 }); // Indestructible foundation material
    const shadowSquareMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.8 }); // Light-absorbing panels
    const terrainMat = new THREE.MeshPhysicalMaterial({ color: 0x228833, metalness: 0.0, roughness: 0.9 }); // Biosphere
    const oceanMat = new THREE.MeshPhysicalMaterial({ color: 0x1144aa, metalness: 0.2, roughness: 0.1, transmission: 0.8, transparent: true, opacity: 0.9 }); // Great oceans
    const retainingWallMat = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.3 }); // 1000-mile high walls
    
    // VFX Materials
    const sunVFX = new THREE.MeshBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.9 }); // Central G-type star
    const solarWindVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Stellar flares
    const atmosphereVFX = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, side: THREE.DoubleSide }); // Glowing air layer

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.shadowRing = null;
    group.userData.animatedMeshes.habitatRing = null;
    group.userData.animatedMeshes.flares = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Central Star & Shadow Squares
    // ==========================================
    // The Star
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sunVFX);
    group.add(star);
    
    // Solar flares
    for(let i=0; i<6; i++) {
        const flare = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 1.2, 8).rotateX(Math.PI/2), solarWindVFX);
        flare.userData = { angleX: Math.random()*Math.PI*2, angleY: Math.random()*Math.PI*2, speed: 0.5 + Math.random() };
        group.add(flare);
        group.userData.animatedMeshes.flares.push(flare);
    }
    
    // Shadow Squares (Inner Ring to create Day/Night cycle)
    const shadowGroup = new THREE.Group();
    const numSquares = 12;
    for(let i=0; i<numSquares; i++) {
        const angle = (i * Math.PI*2) / numSquares;
        // Make them wide enough to block light but leave gaps
        const square = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.2), shadowSquareMat);
        square.position.set(1.2 * Math.cos(angle), 0, 1.2 * Math.sin(angle));
        square.lookAt(0,0,0);
        
        // Connecting ultra-thin wire
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, (2.4 * Math.PI) / numSquares).rotateZ(Math.PI/2), scrithMat);
        wire.position.set(1.2 * Math.cos(angle + Math.PI/numSquares), 0, 1.2 * Math.sin(angle + Math.PI/numSquares));
        wire.lookAt(0,0,0);
        
        shadowGroup.add(square, wire);
    }
    group.add(shadowGroup);
    group.userData.animatedMeshes.shadowRing = shadowGroup;
    
    parts.push({ mesh: star, name: "G-Type Main Sequence Star", description: "The central power source.", function: "Provides energy and light to the habitat."});
    parts.push({ mesh: shadowGroup.children[0], name: "Shadow Squares", description: "Inner orbital sunshades.", function: "Orbits slightly faster than the main ring to simulate a natural 24-hour day/night cycle on the surface."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Megascale Habitat Ring
    // ==========================================
    const habitatGroup = new THREE.Group();
    const ringRadius = 4.0;
    const ringWidth = 1.0;
    
    // The Foundation (Scrith)
    const foundation = new THREE.Mesh(new THREE.CylinderGeometry(ringRadius+0.05, ringRadius+0.05, ringWidth, 128, 1, true), scrithMat);
    habitatGroup.add(foundation);
    
    // The Terrain Layer (Inner surface)
    // We'll use a slightly smaller radius so it sits on the foundation
    const terrain = new THREE.Mesh(new THREE.CylinderGeometry(ringRadius, ringRadius, ringWidth, 128, 1, true), terrainMat);
    // Add some "oceans" by rendering a slightly smaller blue cylinder
    const oceans = new THREE.Mesh(new THREE.CylinderGeometry(ringRadius-0.01, ringRadius-0.01, ringWidth*0.8, 128, 1, true), oceanMat);
    
    // We need to flip normals so they are visible from the inside
    terrain.material.side = THREE.BackSide;
    oceans.material.side = THREE.BackSide;
    foundation.material.side = THREE.DoubleSide;
    
    habitatGroup.add(terrain, oceans);
    
    // Atmosphere Retaining Walls (Rim walls)
    // 1000-mile high walls pointing inwards towards the star
    const wall1 = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.05, 16, 128), retainingWallMat);
    wall1.rotation.x = Math.PI/2;
    wall1.position.y = ringWidth/2;
    
    const wall2 = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.05, 16, 128), retainingWallMat);
    wall2.rotation.x = Math.PI/2;
    wall2.position.y = -ringWidth/2;
    
    habitatGroup.add(wall1, wall2);
    
    // Atmosphere (Glowing layer inside the walls)
    const atmosphere = new THREE.Mesh(new THREE.CylinderGeometry(ringRadius-0.08, ringRadius-0.08, ringWidth, 128, 1, true), atmosphereVFX);
    habitatGroup.add(atmosphere);
    
    group.add(habitatGroup);
    group.userData.animatedMeshes.habitatRing = habitatGroup;
    
    parts.push({ mesh: terrain, name: "Biosphere & Foundation", description: "3 million times the surface area of Earth.", function: "Supported by an indestructible material called Scrith, it spins to simulate 1G of gravity via centrifugal force."});
    parts.push({ mesh: wall1, name: "Atmosphere Retaining Walls", description: "1,000-mile high rim walls.", function: "Prevents the atmosphere from spilling off the edges of the ribbon into the vacuum of space."});

    // Scale and orient so we can see inside
    group.scale.set(0.35, 0.35, 0.35);
    group.rotation.x = 0.4;
    group.rotation.z = 0.2;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Habitat Ring spins (to generate gravity)
            group.userData.animatedMeshes.habitatRing.rotation.y += 0.05 * speed;
            
            // 2. Shadow Squares spin FASTER to create day/night
            group.userData.animatedMeshes.shadowRing.rotation.y += 0.15 * speed;
            
            // 3. Solar flares erupt from the star
            group.userData.animatedMeshes.flares.forEach((flare, idx) => {
                flare.material.opacity = 0.6 * speed;
                
                // Randomly change direction when near center
                if (flare.position.length() < 0.1) {
                    flare.userData.angleX = Math.random() * Math.PI * 2;
                    flare.userData.angleY = Math.random() * Math.PI * 2;
                }
                
                // Move outward
                const dist = (timeAcc * 5 * speed * flare.userData.speed + idx) % 2.0;
                flare.position.set(
                    dist * Math.cos(flare.userData.angleX) * Math.sin(flare.userData.angleY),
                    dist * Math.cos(flare.userData.angleY),
                    dist * Math.sin(flare.userData.angleX) * Math.sin(flare.userData.angleY)
                );
                flare.lookAt(0,0,0);
                
                // Fade out as it gets further away
                flare.material.opacity = (1.0 - (dist / 2.0)) * speed;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.habitatRing.rotation.y = 0;
            group.userData.animatedMeshes.shadowRing.rotation.y = 0;
            group.userData.animatedMeshes.flares.forEach(flare => flare.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
