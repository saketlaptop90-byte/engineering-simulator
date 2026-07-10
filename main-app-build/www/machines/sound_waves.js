import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Tuning Fork ---
    const forkGroup = new THREE.Group();
    forkGroup.position.set(-5, 0, 0);
    group.add(forkGroup);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    
    // Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), metalMat);
    handle.position.set(0, -1.5, 0);
    forkGroup.add(handle);

    // U-Shape Base
    const uBase = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 32, Math.PI), metalMat);
    uBase.rotation.x = Math.PI/2;
    uBase.rotation.z = Math.PI;
    forkGroup.add(uBase);

    // Tines (Prongs)
    const tineGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    const tineLeft = new THREE.Mesh(tineGeo, metalMat);
    tineLeft.position.set(-0.8, 2, 0);
    forkGroup.add(tineLeft);
    
    const tineRight = new THREE.Mesh(tineGeo, metalMat);
    tineRight.position.set(0.8, 2, 0);
    forkGroup.add(tineRight);

    forkGroup.userData = { id: 'tuning_fork', name: 'Tuning Fork', description: 'When struck, the prongs vibrate back and forth very quickly. This physical vibration pushes on adjacent air molecules, initiating a sound wave.' };

    // --- 2. Air Particles (Longitudinal Wave) ---
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pBaseX = new Float32Array(pCount); // Store equilibrium positions

    for(let i=0; i<pCount; i++) {
        // Distribute particles in a tube to the right of the fork
        const x = (Math.random() * 12) - 4; 
        const y = (Math.random() - 0.5) * 4 + 2;
        const z = (Math.random() - 0.5) * 4;

        pPos[i*3] = x;
        pPos[i*3+1] = y;
        pPos[i*3+2] = z;
        pBaseX[i] = x;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    
    const pMat = new THREE.PointsMaterial({ 
        color: 0x00c8ff, 
        size: 0.08,
        transparent: true,
        opacity: 0.7
    });
    const airParticles = new THREE.Points(pGeo, pMat);
    group.add(airParticles);

    airParticles.userData = { id: 'air_particles', name: 'Air Molecules', description: 'Sound travels as a longitudinal wave. Molecules do not travel across the room; they merely oscillate back and forth around their equilibrium, passing the compression energy forward.' };

    // --- 3. Animation ---
    let time = 0;
    const frequency = 15; // frequency of vibration
    const waveSpeed = 8;
    const waveLength = 4;
    const amplitude = 0.6; // Displacement amplitude

    group.userData.animate = function(delta) {
        time += delta;

        // Animate tuning fork tines (Vibrate outward and inward)
        const forkVib = Math.sin(time * frequency * Math.PI) * 0.15;
        tineLeft.position.x = -0.8 - forkVib;
        tineLeft.rotation.z = forkVib * 0.1; // Slight bend
        
        tineRight.position.x = 0.8 + forkVib;
        tineRight.rotation.z = -forkVib * 0.1;

        // Animate air particles
        const positions = airParticles.geometry.attributes.position.array;
        
        for(let i=0; i<pCount; i++) {
            const baseX = pBaseX[i];
            
            // Equation for longitudinal traveling wave: 
            // Displacement s(x,t) = A * sin(k*x - w*t)
            // We use baseX to determine phase.
            
            const k = (2 * Math.PI) / waveLength;
            const w = frequency * Math.PI;
            
            // Only apply wave to particles to the right of the fork (x > -4)
            let displacement = 0;
            if (baseX > -4.5) {
                // Attenuate amplitude with distance
                const dist = Math.max(0, baseX + 4);
                const localAmp = amplitude * Math.exp(-dist * 0.05); // slight damping
                
                // Add a small random jitter to simulate Brownian motion of air
                const jitter = (Math.random() - 0.5) * 0.05;
                
                displacement = localAmp * Math.sin(k * baseX - w * time) + jitter;
            }

            positions[i*3] = baseX + displacement;
        }
        
        airParticles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
