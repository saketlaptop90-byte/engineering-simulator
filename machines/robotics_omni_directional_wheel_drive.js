import { aluminum, carbonFiber, blackPlastic, yellowAccent } from '../utils/materials.js';

export function createOmniDirectionalWheelDrive(THREE) {
    const group = new THREE.Group();
    group.name = "OmniDirectionalWheelDrive";

    // Base chassis
    const chassisGeo = new THREE.CylinderGeometry(2, 2, 0.5, 8);
    const chassis = new THREE.Mesh(chassisGeo, carbonFiber);
    group.add(chassis);

    // 4 Omni-wheels
    const wheelPositions = [
        { x: 2.2, z: 0, angle: 0, name: 'Wheel1' },
        { x: 0, z: 2.2, angle: Math.PI / 2, name: 'Wheel2' },
        { x: -2.2, z: 0, angle: Math.PI, name: 'Wheel3' },
        { x: 0, z: -2.2, angle: -Math.PI / 2, name: 'Wheel4' }
    ];

    const wheelTracks = [];
    const duration = 2;

    wheelPositions.forEach((pos) => {
        const wheelPivot = new THREE.Group();
        wheelPivot.position.set(pos.x, 0, pos.z);
        wheelPivot.rotation.y = pos.angle;
        chassis.add(wheelPivot);

        const hubGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
        hubGeo.rotateZ(Math.PI / 2);
        
        const wheelSpinPivot = new THREE.Group();
        wheelSpinPivot.name = pos.name;
        wheelPivot.add(wheelSpinPivot);

        const hub = new THREE.Mesh(hubGeo, aluminum);
        wheelSpinPivot.add(hub);

        // Rollers
        for (let i = 0; i < 8; i++) {
            const rollerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
            const roller = new THREE.Mesh(rollerGeo, blackPlastic);
            const angle = (i / 8) * Math.PI * 2;
            roller.position.set(0, Math.cos(angle) * 0.6, Math.sin(angle) * 0.6);
            roller.rotation.x = angle;
            wheelSpinPivot.add(roller);
        }

        // Animation track for each wheel spinning
        const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
        const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI, 0, 0));
        const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI * 2, 0, 0));
        
        const track = new THREE.QuaternionKeyframeTrack(`${pos.name}.quaternion`, [0, 1, 2], [
            ...q0.toArray(), ...q1.toArray(), ...q2.toArray()
        ]);
        wheelTracks.push(track);
    });

    const driveClip = new THREE.AnimationClip('Drive', duration, wheelTracks);

    return { group, animationClips: [driveClip] };
}
