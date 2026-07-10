import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Convex Lens ---
    // A biconvex lens can be made by intersecting two spheres, or just a simple squashed sphere for visualization
    const lensGeo = new THREE.SphereGeometry(2, 32, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.5,
        thickness: 0.5
    });
    
    const lens = new THREE.Mesh(lensGeo, lensMat);
    // Squash it on the X axis to make it a lens shape
    lens.scale.set(0.3, 1, 1);
    lens.userData = { id: 'convex_lens', name: 'Biconvex Lens', description: 'Curved glass bends parallel incoming light rays so they all intersect at a single Focal Point.' };
    group.add(lens);

    // --- 2. Light Rays ---
    const rayGroup = new THREE.Group();
    group.add(rayGroup);
    
    const rayCount = 7;
    const raySpacing = 0.5;
    const focalLength = 4.0; // Distance from center of lens to focal point
    
    // We'll draw static transparent cylinders for the path, and animate particles along them
    const pathMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });

    for (let i = 0; i < rayCount; i++) {
        const yOffset = (i - Math.floor(rayCount/2)) * raySpacing;
        
        // Incoming parallel ray (Left of lens)
        const inGeo = new THREE.CylinderGeometry(0.02, 0.02, 4, 8);
        const inRay = new THREE.Mesh(inGeo, pathMat);
        inRay.rotation.z = Math.PI / 2;
        inRay.position.set(-2, yOffset, 0);
        rayGroup.add(inRay);

        // Outgoing converging ray (Right of lens)
        // Need to calculate angle from (0, yOffset) to (focalLength, 0)
        const dx = focalLength;
        const dy = 0 - yOffset;
        const angle = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx*dx + dy*dy); // Distance to focal point
        
        // We make the ray twice as long so it passes THROUGH the focal point
        const outGeo = new THREE.CylinderGeometry(0.02, 0.02, dist * 2, 8);
        const outRay = new THREE.Mesh(outGeo, pathMat);
        
        // Cylinder is centered on its length. We want it to start at x=0
        // Standard cylinder goes along Y. 
        outRay.rotation.z = Math.PI/2 + angle;
        
        // Position center of cylinder halfway along its path
        outRay.position.set( (dist) * Math.cos(angle), yOffset + (dist) * Math.sin(angle), 0 );
        
        rayGroup.add(outRay);
    }

    // Focal point marker
    const fpGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const fpMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const fp = new THREE.Mesh(fpGeo, fpMat);
    fp.position.set(focalLength, 0, 0);
    fp.userData = { id: 'focal_point', name: 'Focal Point', description: 'The exact point where all parallel rays converge. The distance from the lens is the Focal Length.' };
    group.add(fp);

    // --- 3. Photon Particles ---
    const partCount = 140;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(partCount * 3);
    const pRayIdx = new Float32Array(partCount);
    const pProgress = new Float32Array(partCount);

    for (let i = 0; i < partCount; i++) {
        pRayIdx[i] = i % rayCount;
        pProgress[i] = Math.random() * 8; // -4 to +4 (total travel dist approx 8)
        
        pPos[i*3] = -4; // start x
        pPos[i*3+1] = 0;
        pPos[i*3+2] = 0;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMaterial = new THREE.PointsMaterial({ color: 0xff4444, size: 0.15, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMaterial);
    group.add(particles);

    // --- 4. Animation ---
    group.userData.animate = function(delta) {
        const pos = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < partCount; i++) {
            const rayIdx = pRayIdx[i];
            let prog = pProgress[i];
            
            prog += delta * 5; // speed
            if (prog > 8) prog = 0; // reset
            pProgress[i] = prog;

            const yOffset = (rayIdx - Math.floor(rayCount/2)) * raySpacing;

            if (prog < 4) {
                // Incoming parallel (x from -4 to 0)
                pos[i*3] = prog - 4;
                pos[i*3+1] = yOffset;
            } else {
                // Outgoing converging
                const t = prog - 4; // Distance traveled past lens
                const dx = focalLength;
                const dy = 0 - yOffset;
                const angle = Math.atan2(dy, dx);
                
                pos[i*3] = t * Math.cos(angle);
                pos[i*3+1] = yOffset + t * Math.sin(angle);
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
