import { materials } from '../utils/materials.js';

export function createGeneDriveMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const wildTypeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 });
    const driveMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const cutMaterial = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1 });

    // Chromosome 1 (Wild Type -> Target)
    const chromo1 = new THREE.Group();
    const c1Top = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), wildTypeMaterial);
    c1Top.position.y = 1.5;
    const c1Bot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), wildTypeMaterial);
    c1Bot.position.y = -1.5;
    chromo1.add(c1Top, c1Bot);
    chromo1.position.x = -2;
    group.add(chromo1);

    // Chromosome 2 (Contains Gene Drive)
    const chromo2 = new THREE.Group();
    const c2Top = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), wildTypeMaterial);
    c2Top.position.y = 1.5;
    const c2Mid = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1), driveMaterial);
    const c2Bot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), wildTypeMaterial);
    c2Bot.position.y = -1.5;
    chromo2.add(c2Top, c2Mid, c2Bot);
    chromo2.position.x = 2;
    group.add(chromo2);

    // Copied Drive Element
    const copiedDrive = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1), driveMaterial);
    copiedDrive.position.set(2, 0, 0);
    copiedDrive.scale.set(0.01, 0.01, 0.01);
    group.add(copiedDrive);

    // CRISPR scissors (abstract)
    const scissors = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 4), cutMaterial);
    scissors.position.set(0, 3, 0);
    scissors.rotation.z = -Math.PI / 4;
    group.add(scissors);

    // Animation: Scissors move to wild type, then drive copies over
    const scissorsPosTrack = new THREE.VectorKeyframeTrack(
        scissors.uuid + '.position',
        [0, 1, 1.5, 2],
        [0, 3, 0, -2, 0, 0, -2, 0, 0, 0, 3, 0]
    );

    const c1TopPosTrack = new THREE.VectorKeyframeTrack(
        c1Top.uuid + '.position',
        [0, 1, 1.5],
        [0, 1.5, 0, 0, 1.5, 0, 0, 2, 0] // Separates to make room
    );

    const c1BotPosTrack = new THREE.VectorKeyframeTrack(
        c1Bot.uuid + '.position',
        [0, 1, 1.5],
        [0, -1.5, 0, 0, -1.5, 0, 0, -2, 0]
    );

    const driveCopyPosTrack = new THREE.VectorKeyframeTrack(
        copiedDrive.uuid + '.position',
        [1.5, 2.5],
        [2, 0, 0, -2, 0, 0]
    );

    const driveCopyScaleTrack = new THREE.VectorKeyframeTrack(
        copiedDrive.uuid + '.scale',
        [1.5, 2, 2.5],
        [0.01, 0.01, 0.01, 1, 1, 1, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('Gene_Drive_Copy', 3, [
        scissorsPosTrack, c1TopPosTrack, c1BotPosTrack, driveCopyPosTrack, driveCopyScaleTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
