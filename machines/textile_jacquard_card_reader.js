import * as materials from '../utils/materials.js';

export function createJacquardCardReaderMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const wood = materials.wood || new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });
    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.4 });
    const cardMat = materials.paper || new THREE.MeshStandardMaterial({ color: 0xddddaa, roughness: 1.0 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 2), wood);
    group.add(base);

    // Cylinder
    const cylinder = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5), metal);
    cylinder.position.set(0, 1, 0);
    group.add(cylinder);

    // Punched cards connected in a chain
    const cards = new THREE.Group();
    for(let i=0; i<4; i++) {
        const card = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.8), cardMat);
        card.position.set(0, 1 + Math.sin(i*Math.PI/2)*0.5, Math.cos(i*Math.PI/2)*0.5);
        card.rotation.x = -i * Math.PI/2;
        cards.add(card);
    }
    group.add(cards);

    // Sensing Needles
    const needles = new THREE.Group();
    for(let i=0; i<8; i++) {
        const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1), metal);
        needle.position.set(-0.8 + i*0.2, 1.5, 0);
        needles.add(needle);
    }
    group.add(needles);

    // Animations
    const cardsRotTrack = new THREE.NumberKeyframeTrack(
        cards.uuid + '.rotation[x]',
        [0, 1, 2],
        [0, Math.PI/2, Math.PI]
    );

    const needlesPosTrack = new THREE.VectorKeyframeTrack(
        needles.uuid + '.position',
        [0, 0.2, 0.8, 1, 1.2, 1.8, 2],
        [0,0,0, 0,-0.3,0, 0,-0.3,0, 0,0,0, 0,-0.3,0, 0,-0.3,0, 0,0,0]
    );

    const cylinderPosTrack = new THREE.VectorKeyframeTrack(
        cylinder.uuid + '.position',
        [0, 0.2, 0.8, 1, 1.2, 1.8, 2],
        [0,1,0, 0,1,-0.1, 0,1,-0.1, 0,1,0, 0,1,-0.1, 0,1,-0.1, 0,1,0]
    );

    const clip = new THREE.AnimationClip('JacquardReading', 2, [cardsRotTrack, needlesPosTrack, cylinderPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
