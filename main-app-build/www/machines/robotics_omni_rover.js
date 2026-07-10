import * as materials from '../utils/materials.js';

export function createOmniRover(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyMat = materials.robotBody || new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.8, roughness: 0.2});
    const wheelMat = materials.robotWheel || new THREE.MeshStandardMaterial({color: 0x222222, roughness: 0.9});

    // Body
    const bodyGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    group.add(body);

    // Mecanum wheels (cylinders as base representation)
    const wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const wheelPositions = [
        [-1.15, 0.4, 1.2],
        [1.15, 0.4, 1.2],
        [-1.15, 0.4, -1.2],
        [1.15, 0.4, -1.2]
    ];

    wheelPositions.forEach((pos, i) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos[0], pos[1], pos[2]);
        wheelGroup.rotation.z = Math.PI / 2;
        wheelGroup.name = `RoverWheel${i}`;

        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheelGroup.add(wheel);
        
        // Add rollers for detail
        for(let j=0; j<8; j++) {
            const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), materials.metalHighlight || new THREE.MeshStandardMaterial({color: 0xff5500}));
            const angle = (j / 8) * Math.PI * 2;
            roller.position.set(Math.cos(angle)*0.4, 0, Math.sin(angle)*0.4);
            roller.rotation.x = Math.PI / 4; // Mecanum diagonal rollers
            wheelGroup.add(roller);
        }

        group.add(wheelGroup);
        wheels.push(wheelGroup);
        
        // Spinning animation
        const times = [0, 1, 2];
        const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

        const values = [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w
        ];
        
        const track = new THREE.QuaternionKeyframeTrack(`${wheelGroup.name}.quaternion`, times, values);
        animationClips.push(new THREE.AnimationClip(`SpinWheel${i}`, 2, [track]));
    });

    return { group, animationClips };
}
