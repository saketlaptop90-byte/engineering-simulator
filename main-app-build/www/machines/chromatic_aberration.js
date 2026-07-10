import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Thick Convex Lens ---
    // Make it intentionally thick to exaggerate the aberration effect
    const lensGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.6, // High dispersion glass
    });
    
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.scale.set(0.4, 1, 1);
    lens.userData = { id: 'thick_lens', name: 'Thick Glass Lens', description: 'Because glass has a different refractive index for different colors, a simple lens cannot focus all colors to the exact same point.' };
    group.add(lens);

    // --- 2. The Incoming White Light ---
    const inBeamGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const inBeamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const inBeam = new THREE.Mesh(inBeamGeo, inBeamMat);
    inBeam.rotation.z = Math.PI / 2;
    inBeam.position.set(-2, 1.5, 0); // Hitting the top edge of the lens where bending is most severe
    group.add(inBeam);
    
    const inBeam2 = new THREE.Mesh(inBeamGeo, inBeamMat);
    inBeam2.rotation.z = Math.PI / 2;
    inBeam2.position.set(-2, -1.5, 0); // Hitting bottom edge
    group.add(inBeam2);

    // --- 3. The Aberrated Outgoing Light ---
    // We will show Red, Green, and Blue rays splitting
    
    // Top rays bending down
    const topGroup = new THREE.Group();
    topGroup.position.set(0, 1.5, 0);
    group.add(topGroup);
    
    // Bottom rays bending up
    const botGroup = new THREE.Group();
    botGroup.position.set(0, -1.5, 0);
    group.add(botGroup);

    const colors = [
        { c: 0xff0000, name: 'Red', f: 4.5, angleTop: Math.atan2(-1.5, 4.5) },   // Bends least, focuses furthest
        { c: 0x00ff00, name: 'Green', f: 3.5, angleTop: Math.atan2(-1.5, 3.5) }, // Middle
        { c: 0x0000ff, name: 'Blue', f: 2.5, angleTop: Math.atan2(-1.5, 2.5) }   // Bends most, focuses closest
    ];

    const outRayGeo = new THREE.CylinderGeometry(0.02, 0.02, 6, 8);
    
    colors.forEach(col => {
        const mat = new THREE.MeshBasicMaterial({ color: col.c, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        
        // Top ray
        const rTop = new THREE.Mesh(outRayGeo, mat);
        rTop.rotation.z = Math.PI/2 + col.angleTop;
        rTop.position.set(3 * Math.cos(col.angleTop), 3 * Math.sin(col.angleTop), 0);
        topGroup.add(rTop);
        
        // Bottom ray (inverse angle)
        const angleBot = Math.atan2(1.5, col.f);
        const rBot = new THREE.Mesh(outRayGeo, mat);
        rBot.rotation.z = Math.PI/2 + angleBot;
        rBot.position.set(3 * Math.cos(angleBot), 3 * Math.sin(angleBot), 0);
        botGroup.add(rBot);

        // Add a glowing dot at its specific focal point
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16,16), new THREE.MeshBasicMaterial({color: col.c}));
        dot.position.set(col.f, 0, 0);
        dot.userData = { id: `focus_${col.name}`, name: `${col.name} Focus`, description: `Notice how ${col.name} light focuses at a completely different distance! This causes color fringing in cheap cameras.`};
        group.add(dot);
    });

    // --- 4. Moving Photons ---
    const partCount = 150;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(partCount * 3);
    const pCol = new Float32Array(partCount * 3);
    
    const pData = []; // Store state for animation

    for(let i=0; i<partCount; i++){
        // 0: top red, 1: top green, 2: top blue, 3: bot red, 4: bot green, 5: bot blue
        const type = i % 6; 
        const isTop = type < 3;
        const colorIdx = type % 3;
        
        pData.push({
            isTop,
            colIdx: colorIdx,
            progress: Math.random() * 8
        });

        pPos[i*3] = -4; pPos[i*3+1] = 0; pPos[i*3+2] = 0;
        
        const hex = colors[colorIdx].c;
        pCol[i*3] = ((hex >> 16) & 255) / 255;
        pCol[i*3+1] = ((hex >> 8) & 255) / 255;
        pCol[i*3+2] = (hex & 255) / 255;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const pMaterial = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMaterial);
    group.add(particles);

    // --- 5. Animation ---
    group.userData.animate = function(delta) {
        const pos = particles.geometry.attributes.position.array;
        const colArray = particles.geometry.attributes.color.array;

        for (let i = 0; i < partCount; i++) {
            const data = pData[i];
            data.progress += delta * 4;
            if (data.progress > 8) data.progress = 0;
            
            const startY = data.isTop ? 1.5 : -1.5;

            if (data.progress < 4) {
                // Incoming (Mixed as White light)
                pos[i*3] = data.progress - 4; // -4 to 0
                pos[i*3+1] = startY;
                pos[i*3+2] = 0;
                
                // Show as white
                colArray[i*3] = 1; colArray[i*3+1] = 1; colArray[i*3+2] = 1;
            } else {
                // Outgoing (Split into colors)
                const t = data.progress - 4;
                const targetF = colors[data.colIdx].f;
                
                const dy = 0 - startY;
                const dx = targetF;
                const angle = Math.atan2(dy, dx);
                
                pos[i*3] = t * Math.cos(angle);
                pos[i*3+1] = startY + (t * Math.sin(angle));
                
                // Show actual color
                const hex = colors[data.colIdx].c;
                colArray[i*3] = ((hex >> 16) & 255) / 255;
                colArray[i*3+1] = ((hex >> 8) & 255) / 255;
                colArray[i*3+2] = (hex & 255) / 255;
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
    };

    return group;
}
