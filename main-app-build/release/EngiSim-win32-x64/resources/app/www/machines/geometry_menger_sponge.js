export function createMengerSponge(THREE) {
    const group = new THREE.Group();

    const level = 3; // 8000 cubes
    const positions = [];

    // Recursive function to generate sponge positions
    function generateSponge(cx, cy, cz, size, currentLevel) {
        if (currentLevel === 0) {
            positions.push({ x: cx, y: cy, z: cz });
            return;
        }

        const newSize = size / 3;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    // Menger sponge condition: at most one coordinate is 0
                    const zeroCount = (x === 0 ? 1 : 0) + (y === 0 ? 1 : 0) + (z === 0 ? 1 : 0);
                    if (zeroCount < 2) {
                        generateSponge(
                            cx + x * newSize,
                            cy + y * newSize,
                            cz + z * newSize,
                            newSize,
                            currentLevel - 1
                        );
                    }
                }
            }
        }
    }

    generateSponge(0, 0, 0, 9, level);

    const baseGeometry = new THREE.BoxGeometry(9 / Math.pow(3, level), 9 / Math.pow(3, level), 9 / Math.pow(3, level));
    const material = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        metalness: 0.5,
        roughness: 0.2
    });

    const instancedMesh = new THREE.InstancedMesh(baseGeometry, material, positions.length);
    instancedMesh.name = 'MengerSpongeMesh';

    const dummy = new THREE.Object3D();
    for (let i = 0; i < positions.length; i++) {
        dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
    group.add(instancedMesh);

    // Animation Clip: Rotate the whole sponge and pulse scale
    const duration = 10;
    const numFrames = 60;
    
    const times = [];
    const quatValues = [];
    const scaleValues = [];

    const axis = new THREE.Vector3(1, 1, 1).normalize();

    for (let i = 0; i <= numFrames; i++) {
        const t = i / numFrames;
        times.push(t * duration);

        // Rotation
        const angle = t * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        quatValues.push(q.x, q.y, q.z, q.w);

        // Pulse Scale (breathing effect)
        const s = 1.0 + 0.1 * Math.sin(t * Math.PI * 4);
        scaleValues.push(s, s, s);
    }

    const uuidOrName = instancedMesh.name || instancedMesh.uuid;

    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        uuidOrName + '.quaternion',
        times,
        quatValues
    );

    const scaleTrack = new THREE.VectorKeyframeTrack(
        uuidOrName + '.scale',
        times,
        scaleValues
    );

    const clip = new THREE.AnimationClip('MengerAnimation', duration, [rotationTrack, scaleTrack]);

    return { group, animationClips: [clip] };
}
