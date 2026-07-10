import { materials } from '../utils/materials.js';

export function createBogieSuspension(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bogie frame
    const frameGeometry = new THREE.BoxGeometry(4, 0.4, 2);
    const frame = new THREE.Mesh(frameGeometry, materials.metalDark || new THREE.MeshStandardMaterial({color: 0x333333}));
    group.add(frame);

    // Wheels
    const wheelRadius = 0.5;
    const wheelThickness = 0.2;
    const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 32);
    wheelGeometry.rotateX(Math.PI / 2); // align with z-axis

    const wheelPositions = [
        [-1.5, -0.2, 1],
        [1.5, -0.2, 1],
        [-1.5, -0.2, -1],
        [1.5, -0.2, -1]
    ];

    const wheels = [];
    wheelPositions.forEach((pos, idx) => {
        const wheel = new THREE.Mesh(wheelGeometry, materials.metal || new THREE.MeshStandardMaterial({color: 0x888888}));
        wheel.name = `wheel_${idx}`;
        wheel.position.set(...pos);
        
        // Add spokes for visual rotation
        const spokeGeo = new THREE.BoxGeometry(0.1, wheelRadius * 2, wheelThickness * 1.1);
        const spoke = new THREE.Mesh(spokeGeo, materials.metalDark || new THREE.MeshStandardMaterial({color: 0x333333}));
        wheel.add(spoke);
        const spoke2 = new THREE.Mesh(spokeGeo, materials.metalDark || new THREE.MeshStandardMaterial({color: 0x333333}));
        spoke2.rotation.x = Math.PI / 2;
        wheel.add(spoke2);

        frame.add(wheel);
        wheels.push(wheel);
    });

    // Suspension Springs
    const springGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const springPositions = [
        [-1.5, 0.3, 1],
        [1.5, 0.3, 1],
        [-1.5, 0.3, -1],
        [1.5, 0.3, -1]
    ];
    
    springPositions.forEach((pos, idx) => {
        const spring = new THREE.Mesh(springGeometry, materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333}));
        spring.name = `spring_${idx}`;
        spring.position.set(...pos);
        frame.add(spring);
    });

    // Animation: Wheels rolling + suspension bouncing
    const times = [0, 1, 2];
    const wheelTracks = wheels.map((wheel, idx) => {
        const rot0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
        const rot1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI));
        const rot2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * 2));
        return new THREE.QuaternionKeyframeTrack(`${wheel.name}.quaternion`, times, [
            ...rot0.toArray(), ...rot1.toArray(), ...rot2.toArray()
        ]);
    });

    // Bounce animation on the frame itself
    const bounceTimes = [0, 0.5, 1, 1.5, 2];
    const bounceValues = [
        0, 0.05, 0, -0.05, 0
    ];
    const positionTrack = new THREE.NumberKeyframeTrack('.position[y]', bounceTimes, bounceValues);

    const clip = new THREE.AnimationClip('BogieMovement', 2, [...wheelTracks, positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
