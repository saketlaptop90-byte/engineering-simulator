import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Laser Sources ---
    const laserGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    
    // Top Laser (Hits Mirror)
    const topLaser = new THREE.Mesh(laserGeo, laserMat);
    topLaser.rotation.z = Math.PI / 2 + 0.5; // Angled down
    topLaser.position.set(-3, 3, 0);
    group.add(topLaser);

    // Bottom Laser (Hits Rough Surface)
    const botLaser = new THREE.Mesh(laserGeo, laserMat);
    botLaser.rotation.z = Math.PI / 2 + 0.5;
    botLaser.position.set(-3, -1, 0);
    group.add(botLaser);

    // Incoming beams
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
    
    const tBeam = new THREE.Mesh(beamGeo, beamMat);
    tBeam.rotation.z = Math.PI/2 + 0.5;
    tBeam.position.set(-1.25, 2.05, 0);
    group.add(tBeam);
    
    const bBeam = new THREE.Mesh(beamGeo, beamMat);
    bBeam.rotation.z = Math.PI/2 + 0.5;
    bBeam.position.set(-1.25, -1.95, 0);
    group.add(bBeam);

    // --- 2. Surfaces ---
    // Top: Perfect Mirror (Specular Reflection)
    const mirrorGeo = new THREE.BoxGeometry(4, 0.2, 2);
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.0 });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(1, 1, 0);
    mirror.userData = { id: 'smooth_mirror', name: 'Smooth Mirror', description: 'Specular Reflection: A perfectly smooth surface bounces all parallel light rays at the exact same angle.' };
    group.add(mirror);

    // Bottom: Rough Surface (Diffuse Reflection)
    // We'll generate a bumpy plane
    const planeGeo = new THREE.PlaneGeometry(4, 2, 32, 16);
    const pos = planeGeo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
        pos[i+2] += (Math.random() - 0.5) * 0.4; // Add Z noise to make it rough
    }
    planeGeo.computeVertexNormals();
    
    const roughMat = new THREE.MeshStandardMaterial({ color: 0xaa8866, roughness: 1.0 });
    const roughSurf = new THREE.Mesh(planeGeo, roughMat);
    roughSurf.rotation.x = -Math.PI / 2;
    roughSurf.position.set(1, -3, 0);
    roughSurf.userData = { id: 'rough_surface', name: 'Rough Surface', description: 'Diffuse Reflection: Microscopic bumps on everyday objects scatter the incoming parallel light in all directions, allowing you to see the object from any angle.' };
    group.add(roughSurf);

    // --- 3. Reflected Light ---
    // Top Reflected Beam (Specular)
    const tOutBeam = new THREE.Mesh(beamGeo, beamMat);
    tOutBeam.rotation.z = Math.PI/2 - 0.5; // Bounces up perfectly
    tOutBeam.position.set(2.4, 2.05, 0);
    group.add(tOutBeam);

    // --- 4. Particles (Photons) ---
    const partCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(partCount * 3);
    const pData = []; // Store state for animation

    for(let i=0; i<partCount; i++) {
        const isTop = i < (partCount / 2);
        pData.push({
            isTop,
            progress: Math.random() * 8, // 0 to 4 incoming, 4 to 8 outgoing
            scatterAngle: (Math.random() * Math.PI) - (Math.random() * 0.5) // Random angle for rough scatter (mostly upwards)
        });
        
        pPos[i*3] = -3;
        pPos[i*3+1] = isTop ? 3 : -1;
        pPos[i*3+2] = 0;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.15, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMaterial);
    group.add(particles);

    // --- 5. Animation ---
    const inAngle = -0.5; // Angled down
    const outAngleSpec = 0.5; // Angled up (perfect bounce)

    group.userData.animate = function(delta) {
        const pArr = particles.geometry.attributes.position.array;

        for (let i = 0; i < partCount; i++) {
            const data = pData[i];
            data.progress += delta * 5;
            if (data.progress > 8) data.progress = 0;
            
            const startX = -3;
            const startY = data.isTop ? 3 : -1;
            const hitX = 0.5; // Approximate hit point
            const hitY = data.isTop ? 1.1 : -2.9;

            if (data.progress < 4) {
                // Incoming ray
                const t = data.progress / 4; // 0 to 1
                pArr[i*3] = startX + t * (hitX - startX);
                pArr[i*3+1] = startY + t * (hitY - startY);
                pArr[i*3+2] = 0;
            } else {
                // Outgoing ray
                const t = (data.progress - 4) / 4; // 0 to 1
                const dist = t * 4; // Travel distance
                
                if (data.isTop) {
                    // Specular bounce
                    pArr[i*3] = hitX + dist * Math.cos(outAngleSpec);
                    pArr[i*3+1] = hitY + dist * Math.sin(outAngleSpec);
                    pArr[i*3+2] = 0;
                } else {
                    // Diffuse bounce (Scattered)
                    // Scatter angle is roughly upwards (0 to PI)
                    const ang = Math.abs(data.scatterAngle) % Math.PI; 
                    pArr[i*3] = hitX + dist * Math.cos(ang);
                    pArr[i*3+1] = hitY + dist * Math.sin(ang);
                    
                    // Add Z scatter too for rough surface
                    const zAng = data.scatterAngle * 2;
                    pArr[i*3+2] = dist * Math.sin(zAng) * 0.5;
                }
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
