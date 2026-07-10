import {
    yellowPaintMaterial,
    metalMaterial,
    blackRubberMaterial,
    glassMaterial
} from '../utils/materials.js';

export function createLogSkimmer(THREE) {
    const group = new THREE.Group();
    group.name = 'LogSkimmer';
    const animationClips = [];

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(3.5, 1.5, 8);
    const chassis = new THREE.Mesh(chassisGeo, yellowPaintMaterial);
    chassis.position.y = 2;
    group.add(chassis);

    // Wheels (4 huge wheels)
    const wheelPositions = [
        [2.2, 1.5, 3],
        [-2.2, 1.5, 3],
        [2.2, 1.5, -3],
        [-2.2, 1.5, -3]
    ];
    const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    
    wheelPositions.forEach((pos, index) => {
        const wheel = new THREE.Mesh(wheelGeo, blackRubberMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        wheel.name = `wheel_${index}`;
        group.add(wheel);
    });

    // Cab
    const cabGeo = new THREE.BoxGeometry(2, 2.5, 2);
    const cab = new THREE.Mesh(cabGeo, glassMaterial);
    cab.position.set(0, 4, 1.5);
    group.add(cab);

    // Cable Arch (Skidder Arch)
    const archGeo = new THREE.TorusGeometry(2, 0.3, 16, 50, Math.PI);
    const arch = new THREE.Mesh(archGeo, yellowPaintMaterial);
    arch.rotation.x = Math.PI / 2;
    arch.position.set(0, 3.5, -3.5);
    group.add(arch);

    // Winch Drum
    const drumGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const drum = new THREE.Mesh(drumGeo, metalMaterial);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 2.5, -2.5);
    drum.name = 'winchDrum';
    group.add(drum);

    // Grapple Boom (attached to back)
    const boomGeo = new THREE.BoxGeometry(0.6, 3, 0.6);
    const boom = new THREE.Mesh(boomGeo, yellowPaintMaterial);
    boom.name = 'skimmerBoom';
    boom.position.set(0, 3, -4);
    boom.rotation.x = Math.PI / 4;
    group.add(boom);

    // Grapple Tongs
    const tongGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const tongL = new THREE.Mesh(tongGeo, metalMaterial);
    tongL.name = 'tongL';
    tongL.position.set(1, -1.5, 0);
    const tongR = new THREE.Mesh(tongGeo, metalMaterial);
    tongR.name = 'tongR';
    tongR.position.set(-1, -1.5, 0);
    boom.add(tongL);
    boom.add(tongR);

    // Animations
    const times = [0, 2, 4];
    
    // Wheels rotating
    const tracks = [];
    const qWheel = new THREE.Quaternion();
    wheelPositions.forEach((_, i) => {
        const wheelQuats = [];
        [0, Math.PI, Math.PI * 2].forEach(angle => {
            qWheel.setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
            qWheel.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle));
            wheelQuats.push(qWheel.x, qWheel.y, qWheel.z, qWheel.w);
        });
        tracks.push(new THREE.QuaternionKeyframeTrack(`wheel_${i}.quaternion`, times, wheelQuats));
    });

    // Winch winding
    const drumQuats = [];
    const qDrum = new THREE.Quaternion();
    [0, Math.PI * 4, Math.PI * 8].forEach(angle => {
        qDrum.setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
        qDrum.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle));
        drumQuats.push(qDrum.x, qDrum.y, qDrum.z, qDrum.w);
    });
    tracks.push(new THREE.QuaternionKeyframeTrack('winchDrum.quaternion', times, drumQuats));

    // Grapple Tongs moving
    const tongLQuats = [];
    const tongRQuats = [];
    const qTL = new THREE.Quaternion();
    const qTR = new THREE.Quaternion();
    [0, Math.PI/6, 0].forEach(angle => {
        qTL.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        qTR.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle);
        tongLQuats.push(qTL.x, qTL.y, qTL.z, qTL.w);
        tongRQuats.push(qTR.x, qTR.y, qTR.z, qTR.w);
    });
    tracks.push(new THREE.QuaternionKeyframeTrack('tongL.quaternion', times, tongLQuats));
    tracks.push(new THREE.QuaternionKeyframeTrack('tongR.quaternion', times, tongRQuats));

    const clip = new THREE.AnimationClip('SkimmerAction', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
