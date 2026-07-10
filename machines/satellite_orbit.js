import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Central Body (Earth) ---
    const earthGeo = new THREE.SphereGeometry(2, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({ 
        color: 0x2266cc, 
        roughness: 0.6,
        metalness: 0.1
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.userData = { id: 'earth', name: 'Earth (Gravity Well)', description: 'The massive central body warps spacetime, creating a gravitational pull that keeps the satellite in orbit.' };
    group.add(earth);

    // Landmasses (simple green blobs)
    const landGeo = new THREE.SphereGeometry(2.02, 16, 16);
    const landMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    for(let i=0; i<5; i++){
        const land = new THREE.Mesh(landGeo, landMat);
        // Randomly squashed
        land.scale.set(0.3 + Math.random()*0.5, 0.3 + Math.random()*0.5, 0.3 + Math.random()*0.5);
        land.position.set(
            (Math.random()-0.5)*2,
            (Math.random()-0.5)*2,
            (Math.random()-0.5)*2
        ).normalize().multiplyScalar(2.0); // stick to surface
        land.lookAt(0,0,0);
        earth.add(land);
    }

    // --- 2. The Satellite ---
    const satGroup = new THREE.Group();
    group.add(satGroup);

    // Main body
    const bodyGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    satGroup.add(body);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(1.5, 0.05, 0.3);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1122aa, metalness: 0.9, roughness: 0.1 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    satGroup.add(panel);

    satGroup.userData = { id: 'satellite', name: 'Artificial Satellite', description: 'Moving incredibly fast sideways. It is constantly falling towards Earth, but moving so fast horizontally that it continually misses the ground.' };

    // --- 3. Orbital Path (Visualized) ---
    const orbitRadius = 4.5;
    const pathGeo = new THREE.BufferGeometry();
    const pathPoints = [];
    for(let i=0; i<=64; i++){
        const a = (i/64) * Math.PI * 2;
        pathPoints.push(new THREE.Vector3(Math.cos(a)*orbitRadius, 0, Math.sin(a)*orbitRadius));
    }
    pathGeo.setFromPoints(pathPoints);
    const pathMat = new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.5 });
    const orbitPath = new THREE.Line(pathGeo, pathMat);
    group.add(orbitPath);

    // --- 4. Force Vectors (Arrows) ---
    // Gravity Vector (Red, points to center)
    const gravityArrow = new THREE.ArrowHelper(
        new THREE.Vector3(-1, 0, 0), // direction (will update)
        new THREE.Vector3(0, 0, 0),  // origin
        1.5, // length
        0xff0000, // color
        0.3, 0.2
    );
    satGroup.add(gravityArrow); // Local to satellite

    // Velocity Vector (Green, points forward)
    const velocityArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 0, 0),
        2.0,
        0x00ff00,
        0.3, 0.2
    );
    satGroup.add(velocityArrow);

    // --- 5. Animation ---
    let angle = 0;
    group.userData.animate = function(delta) {
        // Earth spins slowly
        earth.rotation.y += delta * 0.2;

        // Satellite orbits
        const speed = 1.0; // rad/s
        angle += speed * delta;
        
        satGroup.position.x = Math.cos(angle) * orbitRadius;
        satGroup.position.z = Math.sin(angle) * orbitRadius;
        
        // Satellite always faces its velocity vector (tangent to orbit)
        satGroup.rotation.y = -angle;

        // Update arrows relative to satellite
        // Gravity points directly left (local -X) when flying tangent in a circle
        gravityArrow.setDirection(new THREE.Vector3(-1, 0, 0));
        // Velocity points directly forward (local -Z)
        velocityArrow.setDirection(new THREE.Vector3(0, 0, -1));
    };

    return group;
}
