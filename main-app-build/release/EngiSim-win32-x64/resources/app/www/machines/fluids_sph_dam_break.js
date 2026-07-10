export function createSPHDamBreak(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Container
    const containerGeo = new THREE.BoxGeometry(20, 10, 10);
    const containerMat = new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true });
    const container = new THREE.Mesh(containerGeo, containerMat);
    container.position.y = 5;
    group.add(container);

    // Particles
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    // Initial block of water on the left side
    let idx = 0;
    for (let x = -9; x < -1; x += 0.8) {
        for (let y = 0.5; y < 8; y += 0.8) {
            for (let z = -4; z < 4; z += 0.8) {
                if (idx >= particleCount) break;
                positions[idx * 3] = x;
                positions[idx * 3 + 1] = y;
                positions[idx * 3 + 2] = z;
                velocities.push(new THREE.Vector3(0, 0, 0));
                idx++;
            }
        }
    }
    // Fill the rest randomly just in case
    for (; idx < particleCount; idx++) {
        positions[idx * 3] = -5 + Math.random() * 4;
        positions[idx * 3 + 1] = 1 + Math.random() * 4;
        positions[idx * 3 + 2] = -3 + Math.random() * 6;
        velocities.push(new THREE.Vector3(0, 0, 0));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // We'll use instanced mesh for better look
    const sphereGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        ior: 1.33
    });
    const instancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, particleCount);
    const dummyObj = new THREE.Object3D();
    
    for (let i = 0; i < particleCount; i++) {
        dummyObj.position.set(positions[i*3], positions[i*3+1], positions[i*3+2]);
        dummyObj.updateMatrix();
        instancedMesh.setMatrixAt(i, dummyObj.matrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    group.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const track = new THREE.NumberKeyframeTrack('.position[x]', [0, 10], [0, 10]);
    const clip = new THREE.AnimationClip('SPHDamBreakAnim', 10, [track]);
    animationClips.push(clip);

    // Simple pseudo-SPH physics simulation
    group.userData.update = (dt) => {
        // Simple gravity and collision with walls
        const gravity = -9.8;
        const dtSim = Math.min(dt, 0.03); // clamp dt for stability
        
        // Pseudo-simulation: just gravity, floor/wall collision, and slight repulsion
        for (let i = 0; i < particleCount; i++) {
            let px = positions[i*3];
            let py = positions[i*3+1];
            let pz = positions[i*3+2];
            let vel = velocities[i];
            
            // Gravity
            vel.y += gravity * dtSim;
            
            // Advance
            px += vel.x * dtSim;
            py += vel.y * dtSim;
            pz += vel.z * dtSim;
            
            // Floor collision
            if (py < 0.3) {
                py = 0.3;
                vel.y *= -0.5;
                vel.x *= 0.9;
                vel.z *= 0.9;
            }
            // Walls
            if (px < -9.7) { px = -9.7; vel.x *= -0.5; }
            if (px > 9.7) { px = 9.7; vel.x *= -0.5; }
            if (pz < -4.7) { pz = -4.7; vel.z *= -0.5; }
            if (pz > 4.7) { pz = 4.7; vel.z *= -0.5; }
            
            // Very fake repulsion towards right side to simulate water breaking out
            if (px < 0 && py < 4) {
                vel.x += 10.0 * dtSim; // Push particles right
            }

            positions[i*3] = px;
            positions[i*3+1] = py;
            positions[i*3+2] = pz;
            
            dummyObj.position.set(px, py, pz);
            dummyObj.updateMatrix();
            instancedMesh.setMatrixAt(i, dummyObj.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
    };

    return { group, animationClips };
}
