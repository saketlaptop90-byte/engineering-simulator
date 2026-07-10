import { brass, gold, wood, steel } from '../utils/materials.js';

export function createSingingBirdBox(THREE) {
    const group = new THREE.Group();

    // Box
    const boxGeo = new THREE.BoxGeometry(4, 2, 3);
    const box = new THREE.Mesh(boxGeo, gold);
    box.position.y = 1;
    group.add(box);

    // Lid
    const lidGeo = new THREE.BoxGeometry(3.8, 0.2, 2.8);
    const lid = new THREE.Mesh(lidGeo, brass);
    lid.position.set(0, 0.1, 1.4); // Offset for hinge
    
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 2, -1.4);
    lidPivot.add(lid);
    lidPivot.name = "LidPivot";
    group.add(lidPivot);

    // Bird
    const birdGeo = new THREE.CylinderGeometry(0.3, 0.4, 1);
    const bird = new THREE.Mesh(birdGeo, wood);
    bird.position.y = 0.5;
    
    const beakGeo = new THREE.ConeGeometry(0.1, 0.3, 4);
    const beak = new THREE.Mesh(beakGeo, gold);
    beak.position.set(0, 0.4, 0.3);
    beak.rotation.x = Math.PI / 2;
    bird.add(beak);

    const birdPivot = new THREE.Group();
    birdPivot.position.set(0, 1, 0);
    birdPivot.add(bird);
    birdPivot.name = "BirdPivot";
    group.add(birdPivot);

    // Animations
    const times = [0, 1, 2, 3, 4];
    
    // Lid opens and closes
    const l0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const l1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    const lidValues = [
        l0.x, l0.y, l0.z, l0.w,
        l1.x, l1.y, l1.z, l1.w,
        l1.x, l1.y, l1.z, l1.w,
        l0.x, l0.y, l0.z, l0.w,
        l0.x, l0.y, l0.z, l0.w
    ];
    const lidTrack = new THREE.QuaternionKeyframeTrack('LidPivot.quaternion', times, lidValues);

    // Bird pops up, spins, goes down
    const birdPosValues = [
        0, 1, 0,
        0, 2, 0,
        0, 2, 0,
        0, 1, 0,
        0, 1, 0
    ];
    
    const b0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const b1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const b2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const birdRotValues = [
        b0.x, b0.y, b0.z, b0.w,
        b0.x, b0.y, b0.z, b0.w,
        b2.x, b2.y, b2.z, b2.w,
        b2.x, b2.y, b2.z, b2.w,
        b0.x, b0.y, b0.z, b0.w
    ];

    const birdPosTrack = new THREE.VectorKeyframeTrack('BirdPivot.position', times, birdPosValues);
    const birdRotTrack = new THREE.QuaternionKeyframeTrack('BirdPivot.quaternion', times, birdRotValues);

    const clip = new THREE.AnimationClip('singing_bird', 4, [lidTrack, birdPosTrack, birdRotTrack]);

    return { group, animationClips: [clip] };
}
