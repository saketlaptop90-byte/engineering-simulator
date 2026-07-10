import { titanium, carbonFiber, ghostMaterial } from '../utils/materials.js';

export function createDNAOrigamiMotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // DNA Base plate (folded origami structure)
    const baseGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const basePlate = new THREE.Mesh(baseGeo, ghostMaterial);
    group.add(basePlate);

    // Central stator (fixed part)
    const statorGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const stator = new THREE.Mesh(statorGeo, titanium);
    stator.position.y = 0.4;
    group.add(stator);

    // Rotor (spinning part)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 0.8;
    group.add(rotorGroup);

    const rotorCoreGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
    const rotorCore = new THREE.Mesh(rotorCoreGeo, carbonFiber);
    rotorGroup.add(rotorCore);

    // DNA strands as propeller blades
    for(let i=0; i<3; i++) {
        const bladeGeo = new THREE.CapsuleGeometry(0.05, 0.6, 8, 16);
        const blade = new THREE.Mesh(bladeGeo, ghostMaterial);
        blade.rotation.x = Math.PI / 2;
        blade.position.set(
            Math.cos(i * Math.PI * 2 / 3) * 0.4,
            0,
            Math.sin(i * Math.PI * 2 / 3) * 0.4
        );
        blade.rotation.y = -(i * Math.PI * 2 / 3);
        rotorGroup.add(blade);
    }

    // Strands linking base and stator
    for(let i=0; i<4; i++) {
        const linkGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
        const link = new THREE.Mesh(linkGeo, carbonFiber);
        link.position.set(
            Math.cos(i * Math.PI / 2) * 0.4,
            0.2,
            Math.sin(i * Math.PI / 2) * 0.4
        );
        link.lookAt(0, 0.4, 0);
        link.rotateX(Math.PI / 2);
        group.add(link);
    }

    // Animation: Rotor spinning and base pulsating
    const times = [0, 0.5, 1.0];
    
    // Rapid rotation of rotor
    const spinTrack = new THREE.QuaternionKeyframeTrack(
        `${rotorGroup.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0)).toArray(),
        ].flat()
    );

    // Base pulsing (scale)
    const pulseTrack = new THREE.VectorKeyframeTrack(
        `${basePlate.uuid}.scale`,
        times,
        [
            1, 1, 1,
            1.1, 1, 1.1,
            1, 1, 1
        ]
    );

    const clip = new THREE.AnimationClip('motor_action', 1.0, [spinTrack, pulseTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
