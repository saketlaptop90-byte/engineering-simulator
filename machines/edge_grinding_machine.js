import { materials } from '../utils/materials.js';

export function createEdgeGrindingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeometry = new THREE.BoxGeometry(8, 2, 3);
    const bodyMat = materials.metal ? materials.metal : new THREE.MeshStandardMaterial({ color: 0x778899 });
    const body = new THREE.Mesh(bodyGeometry, bodyMat);
    body.position.y = 1;
    group.add(body);

    // Conveyor Belt
    const beltGeometry = new THREE.BoxGeometry(9, 0.1, 1);
    const beltMat = materials.rubber ? materials.rubber : new THREE.MeshStandardMaterial({ color: 0x222222 });
    const belt = new THREE.Mesh(beltGeometry, beltMat);
    belt.position.set(0, 2.05, 1);
    group.add(belt);

    // Grinding Wheels
    const wheels = [];
    for (let i = 0; i < 4; i++) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(-3 + i * 2, 2.3, 0.5);
        
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
        const wheelMat = materials.stone ? materials.stone : new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        
        const motorGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.8);
        const motorMat = materials.darkMetal ? materials.darkMetal : new THREE.MeshStandardMaterial({ color: 0x333333 });
        const motor = new THREE.Mesh(motorGeometry, motorMat);
        motor.position.z = -0.5;

        wheelGroup.add(wheel);
        wheelGroup.add(motor);
        group.add(wheelGroup);
        wheels.push(wheel);
    }

    // Glass moving through
    const glassGeometry = new THREE.BoxGeometry(2, 0.05, 0.8);
    const glassMat = materials.glass ? materials.glass : new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true });
    const glass = new THREE.Mesh(glassGeometry, glassMat);
    glass.position.set(-4.5, 2.125, 1);
    group.add(glass);

    // Animations
    // Glass movement
    const times = [0, 5];
    const glassPositions = [
        -4.5, 2.125, 1,
        4.5, 2.125, 1
    ];
    const glassTrack = new THREE.VectorKeyframeTrack(`${glass.uuid}.position`, times, glassPositions);
    
    // Wheel rotation
    const wheelTracks = wheels.map(wheel => {
        const qTimes = [0, 0.25, 0.5, 0.75, 1];
        const values = [];
        for (let i = 0; i <= 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, angle, 0));
            values.push(q.x, q.y, q.z, q.w);
        }
        return new THREE.QuaternionKeyframeTrack(`${wheel.uuid}.quaternion`, qTimes, values);
    });

    const clip = new THREE.AnimationClip('Grinding', 5, [glassTrack, ...wheelTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
