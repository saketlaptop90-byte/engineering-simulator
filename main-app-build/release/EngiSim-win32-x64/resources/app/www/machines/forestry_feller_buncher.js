import {
    yellowPaintMaterial,
    blackRubberMaterial,
    metalMaterial,
    glassMaterial
} from '../utils/materials.js';

export function createFellerBuncher(THREE) {
    const group = new THREE.Group();
    group.name = 'FellerBuncher';
    const animationClips = [];

    // Base/Chassis
    const chassisGeo = new THREE.BoxGeometry(4, 1.5, 6);
    const chassis = new THREE.Mesh(chassisGeo, yellowPaintMaterial);
    chassis.position.y = 1.25;
    group.add(chassis);

    // Tracks
    const trackGeo = new THREE.BoxGeometry(1.2, 1.5, 7.5);
    const trackL = new THREE.Mesh(trackGeo, blackRubberMaterial);
    trackL.position.set(2.6, 0.75, 0);
    const trackR = new THREE.Mesh(trackGeo, blackRubberMaterial);
    trackR.position.set(-2.6, 0.75, 0);
    group.add(trackL);
    group.add(trackR);

    // Cab
    const cabGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
    const cab = new THREE.Mesh(cabGeo, glassMaterial);
    cab.position.set(0, 3.5, -0.5);
    group.add(cab);

    // Main Arm (Boom)
    const boomGeo = new THREE.CylinderGeometry(0.4, 0.5, 5, 16);
    const boom = new THREE.Mesh(boomGeo, yellowPaintMaterial);
    boom.name = 'boom';
    boom.position.set(0, 2.5, 2.5);
    boom.rotation.x = -Math.PI / 4;
    
    // Stick (Secondary Arm)
    const stickGeo = new THREE.CylinderGeometry(0.3, 0.4, 4, 16);
    const stick = new THREE.Mesh(stickGeo, yellowPaintMaterial);
    stick.name = 'stick';
    stick.position.set(0, 2, 2);
    stick.rotation.x = Math.PI / 2;
    boom.add(stick);

    // Feller Head
    const headGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const head = new THREE.Mesh(headGeo, metalMaterial);
    head.name = 'head';
    head.position.set(0, 2, 0);
    stick.add(head);

    // Saw Blade
    const bladeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    const blade = new THREE.Mesh(bladeGeo, metalMaterial);
    blade.name = 'blade';
    blade.position.set(0, -1, 0);
    blade.rotation.x = Math.PI / 2;
    head.add(blade);

    // Claws
    const clawGeo = new THREE.BoxGeometry(0.2, 1, 1.5);
    const clawL = new THREE.Mesh(clawGeo, yellowPaintMaterial);
    clawL.name = 'clawL';
    clawL.position.set(0.8, 0, 0);
    const clawR = new THREE.Mesh(clawGeo, yellowPaintMaterial);
    clawR.name = 'clawR';
    clawR.position.set(-0.8, 0, 0);
    head.add(clawL);
    head.add(clawR);

    group.add(boom);

    // Animations
    const times = [0, 1, 2, 3, 4];
    
    // Boom rotation
    const boomQuats = [];
    const qBoom = new THREE.Quaternion();
    [0, Math.PI/8, 0, -Math.PI/8, 0].forEach(angle => {
        qBoom.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle - Math.PI/4);
        boomQuats.push(qBoom.x, qBoom.y, qBoom.z, qBoom.w);
    });
    const boomTrack = new THREE.QuaternionKeyframeTrack('boom.quaternion', times, boomQuats);

    // Blade rotation
    const bladeTimes = [0, 0.5, 1, 1.5, 2];
    const bladeQuats = [];
    const qBlade = new THREE.Quaternion();
    [0, Math.PI/2, Math.PI, Math.PI*1.5, Math.PI*2].forEach(angle => {
        qBlade.setFromEuler(new THREE.Euler(Math.PI/2, 0, angle));
        bladeQuats.push(qBlade.x, qBlade.y, qBlade.z, qBlade.w);
    });
    const bladeTrack = new THREE.QuaternionKeyframeTrack('blade.quaternion', bladeTimes, bladeQuats);

    // Claw grab animation
    const clawLQuats = [];
    const clawRQuats = [];
    const qL = new THREE.Quaternion();
    const qR = new THREE.Quaternion();
    [0, -Math.PI/4, 0, -Math.PI/4, 0].forEach(angle => {
        qL.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        qR.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -angle);
        clawLQuats.push(qL.x, qL.y, qL.z, qL.w);
        clawRQuats.push(qR.x, qR.y, qR.z, qR.w);
    });
    const clawLTrack = new THREE.QuaternionKeyframeTrack('clawL.quaternion', times, clawLQuats);
    const clawRTrack = new THREE.QuaternionKeyframeTrack('clawR.quaternion', times, clawRQuats);

    const clip = new THREE.AnimationClip('FellerBuncherOperation', 4, [boomTrack, bladeTrack, clawLTrack, clawRTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
