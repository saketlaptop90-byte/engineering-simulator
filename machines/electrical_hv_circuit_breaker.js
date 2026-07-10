import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createCircuitBreaker(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeometry = new THREE.BoxGeometry(4, 0.5, 4);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    group.add(base);

    // Insulators (Porcelain)
    const insulatorGeom = new THREE.CylinderGeometry(0.5, 0.6, 6, 16);
    
    const insulatorGroup1 = new THREE.Group();
    insulatorGroup1.position.set(-1.5, 3.25, 0);
    const ins1 = new THREE.Mesh(insulatorGeom, porcelain);
    insulatorGroup1.add(ins1);

    const insulatorGroup2 = new THREE.Group();
    insulatorGroup2.position.set(1.5, 3.25, 0);
    const ins2 = new THREE.Mesh(insulatorGeom, porcelain);
    insulatorGroup2.add(ins2);

    for(let i=0; i<6; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 8, 24), porcelain);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -2.5 + i * 1;
        insulatorGroup1.add(ring.clone());
        insulatorGroup2.add(ring.clone());
    }

    group.add(insulatorGroup1);
    group.add(insulatorGroup2);

    // Contacts
    const fixedContactGeom = new THREE.BoxGeometry(0.4, 1, 0.4);
    const fixedContact = new THREE.Mesh(fixedContactGeom, copper);
    fixedContact.position.set(-1.5, 6.75, 0);
    group.add(fixedContact);

    const movingContactGeom = new THREE.BoxGeometry(0.4, 3, 0.4);
    const movingContact = new THREE.Mesh(movingContactGeom, brass);
    
    const pivotNode = new THREE.Group();
    pivotNode.name = 'pivotNode';
    pivotNode.position.set(1.5, 6.75, 0);
    
    movingContact.position.set(-1.5, 0, 0); // Extended position
    const breakerArm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 0.3), brass);
    breakerArm.position.set(-1.75, 0, 0);
    pivotNode.add(breakerArm);
    pivotNode.add(movingContact);

    group.add(pivotNode);

    // Arc Flash (Visual)
    const arcGeom = new THREE.SphereGeometry(0.6, 16, 16);
    const arcFlash = new THREE.Mesh(arcGeom, brass);
    arcFlash.name = 'arcFlash';
    arcFlash.position.set(-1.5, 6.75, 0);
    group.add(arcFlash);

    // Animation for breaker snapping (open/close)
    const qOpen = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
    const qClosed = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const times = [0, 1, 1.1, 3, 3.1, 4];
    const values = [
        ...qOpen.toArray(),
        ...qOpen.toArray(),
        ...qClosed.toArray(),
        ...qClosed.toArray(),
        ...qOpen.toArray(),
        ...qOpen.toArray()
    ];
    
    const breakerTrack = new THREE.QuaternionKeyframeTrack(
        `${pivotNode.name}.quaternion`,
        times,
        values
    );

    const arcScaleTimes = [0, 0.9, 1.05, 1.2, 2.9, 3.05, 3.2, 4];
    const arcScaleValues = [
        0, 0, 0,
        0, 0, 0,
        1, 1, 1,
        0, 0, 0,
        0, 0, 0,
        1, 1, 1,
        0, 0, 0,
        0, 0, 0
    ];
    const arcTrack = new THREE.VectorKeyframeTrack(`${arcFlash.name}.scale`, arcScaleTimes, arcScaleValues);

    const clip = new THREE.AnimationClip('BreakerSnap', 4, [breakerTrack, arcTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
