import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Glass Prism ---
    // Create a triangular prism
    const shape = new THREE.Shape();
    shape.moveTo(0, 2);
    shape.lineTo(1.5, -1);
    shape.lineTo(-1.5, -1);
    shape.lineTo(0, 2);

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const prismGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center it
    prismGeo.translate(0, 0, -1); 

    const prismMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.0,
        ior: 1.5, // Glass index of refraction
        thickness: 2.0
    });
    
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.userData = { id: 'glass_prism', name: 'Triangular Glass Prism', description: 'Because different wavelengths (colors) of light travel at slightly different speeds through glass, they bend (refract) at different angles, splitting the white light.' };
    group.add(prism);

    // --- 2. Light Source (White Light) ---
    const sourceGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const source = new THREE.Mesh(sourceGeo, sourceMat);
    source.position.set(-4, 0.5, 0);
    group.add(source);

    // The incoming white beam
    const inBeamGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.5, 8);
    const inBeamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const inBeam = new THREE.Mesh(inBeamGeo, inBeamMat);
    inBeam.position.set(-2.25, 0.5, 0);
    inBeam.rotation.z = Math.PI / 2;
    group.add(inBeam);

    // --- 3. The Dispersed Spectrum (Rainbow Rays) ---
    const spectrumGroup = new THREE.Group();
    group.add(spectrumGroup);
    
    const rayCount = 7;
    const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3]; // ROYGBIV
    const rayGeo = new THREE.CylinderGeometry(0.02, 0.04, 5, 8); // slightly widening
    
    for (let i = 0; i < rayCount; i++) {
        const rayMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
        
        // Ray inside prism (from left edge down to right edge)
        const insideRay = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), rayMat);
        insideRay.position.set(0, 0.2 - (i*0.03), 0);
        // Angle bends down slightly inside glass. Violet (i=6) bends the most.
        insideRay.rotation.z = Math.PI/2 - 0.2 - (i * 0.02);
        spectrumGroup.add(insideRay);

        // Ray exiting prism
        const exitRay = new THREE.Mesh(rayGeo, rayMat);
        // Position at exit point of prism (approx x=0.75, y=-0.2)
        exitRay.position.set(3, -1.0 - (i*0.3), 0);
        // Bends even further upon exiting
        exitRay.rotation.z = Math.PI/2 - 0.4 - (i * 0.05);
        spectrumGroup.add(exitRay);
    }

    // --- 4. Projection Screen ---
    const screenGeo = new THREE.BoxGeometry(0.2, 5, 4);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    // Angle screen slightly to catch the rays
    screen.rotation.z = -0.2;
    screen.position.set(4.5, -2, 0);
    screen.userData = { id: 'spectrum_screen', name: 'Projection Screen', description: 'The continuous spectrum of visible light: Red bends the least, Violet bends the most.' };
    group.add(screen);

    // Dynamic photon particles to show motion
    const partCount = 100;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(partCount * 3);
    const pCol = new Float32Array(partCount * 3);
    
    // Assign each particle to a color band
    const pBands = new Float32Array(partCount); 

    for (let i = 0; i < partCount; i++) {
        pBands[i] = i % rayCount; // 0 to 6
        pPos[i*3] = -4 + Math.random() * 8; // Random start X
        pPos[i*3+1] = 0;
        pPos[i*3+2] = (Math.random()-0.5)*0.1;
    }
    
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const pMaterial = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMaterial);
    group.add(particles);

    // --- 5. Animation ---
    const c = new THREE.Color();
    group.userData.animate = function(delta) {
        const pos = particles.geometry.attributes.position.array;
        const col = particles.geometry.attributes.color.array;
        
        for (let i = 0; i < partCount; i++) {
            const band = pBands[i];
            let x = pos[i*3];
            let y = pos[i*3+1];

            // Speed of light particle
            x += delta * 6;

            if (x < -0.75) {
                // Before prism: White light, straight line
                y = 0.5;
                c.setHex(0xffffff);
            } else if (x < 0.75) {
                // Inside prism: Splitting, bending down slightly
                // x goes from -0.75 to 0.75 (dist 1.5)
                const t = (x + 0.75) / 1.5;
                const drop = t * (0.3 + (band * 0.05));
                y = 0.5 - drop;
                c.setHex(colors[band]);
            } else {
                // Exiting prism: Bending more
                const t = x - 0.75;
                const angle = 0.4 + (band * 0.05); // tan approx
                const startY = 0.5 - (0.3 + (band * 0.05));
                y = startY - (t * angle * 1.5);
                c.setHex(colors[band]);
            }

            if (x > 4.5) {
                // Hit screen, reset to source
                x = -4;
            }

            pos[i*3] = x;
            pos[i*3+1] = y;
            
            col[i*3] = c.r;
            col[i*3+1] = c.g;
            col[i*3+2] = c.b;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
    };

    return group;
}
