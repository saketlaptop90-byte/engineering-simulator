import * as sharedMaterials from '../utils/materials.js';

export function createDraglineBucket(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const steel = sharedMaterials.steel || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.6, roughness: 0.4 });
    const rust = sharedMaterials.rust || new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 });

    // The entire bucket logic is wrapped in a group so we can move and tilt it easily
    const bucketGroup = new THREE.Group();
    group.add(bucketGroup);

    // Bucket Floor
    const bottomGeo = new THREE.BoxGeometry(4, 0.2, 5);
    const bottom = new THREE.Mesh(bottomGeo, steel);
    bucketGroup.add(bottom);

    // Left Wall
    const sideGeo = new THREE.BoxGeometry(0.2, 2.5, 5);
    const sideL = new THREE.Mesh(sideGeo, steel);
    sideL.position.set(-1.9, 1.25, 0);
    bucketGroup.add(sideL);

    // Right Wall
    const sideR = new THREE.Mesh(sideGeo, steel);
    sideR.position.set(1.9, 1.25, 0);
    bucketGroup.add(sideR);

    // Back Wall
    const backGeo = new THREE.BoxGeometry(3.6, 2.5, 0.2);
    const back = new THREE.Mesh(backGeo, steel);
    back.position.set(0, 1.25, 2.4);
    bucketGroup.add(back);

    // Heavy Duty Excavation Teeth
    for (let i = -1.5; i <= 1.5; i += 0.75) {
        const toothGeo = new THREE.ConeGeometry(0.15, 0.8, 4);
        const tooth = new THREE.Mesh(toothGeo, rust);
        tooth.position.set(i, 0.1, -2.8);
        tooth.rotation.x = Math.PI / 2; // Point forwards
        bucketGroup.add(tooth);
    }

    // Hoisting Arch / Rigging
    const archGeo = new THREE.TorusGeometry(2, 0.15, 8, 16, Math.PI);
    const arch = new THREE.Mesh(archGeo, rust);
    arch.position.set(0, 2.5, 0);
    bucketGroup.add(arch);

    // Ropes Setup (Mocked using thin cylinders)
    const ropeGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    const dragRope = new THREE.Mesh(ropeGeo, steel);
    dragRope.rotation.x = Math.PI / 2;
    dragRope.position.set(0, 1, -5);
    bucketGroup.add(dragRope);

    const hoistRope = new THREE.Mesh(ropeGeo, steel);
    hoistRope.position.set(0, 5, 0);
    bucketGroup.add(hoistRope);

    // Animations: The cycle of Drag, Hoist, Dump, Return
    const dumpRotTrack = new THREE.NumberKeyframeTrack(
        bucketGroup.uuid + '.rotation[x]',
        [0, 2, 4, 6, 8],
        [0, -Math.PI / 6, Math.PI / 2, 0, 0] // level -> digging angle -> dumping -> level
    );

    const posTrack = new THREE.NumberKeyframeTrack(
        bucketGroup.uuid + '.position[y]',
        [0, 2, 4, 6, 8],
        [0, 0, 6, 6, 0] // on ground -> dragging -> hoisted up -> holding -> lowered
    );

    const zPosTrack = new THREE.NumberKeyframeTrack(
        bucketGroup.uuid + '.position[z]',
        [0, 2, 4, 6, 8],
        [0, -4, -4, 0, 0] // start -> pulled towards cab -> holding -> released outwards
    );

    const clip = new THREE.AnimationClip('DraglineCycle', 8, [dumpRotTrack, posTrack, zPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
