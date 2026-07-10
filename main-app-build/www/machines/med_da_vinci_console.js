import { aluminum, glass, titanium } from '../utils/materials.js';

export function createDaVinciConsole(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Operator Base
    const baseGeo = new THREE.BoxGeometry(4, 0.2, 3);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Chair
    const seatGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const seat = new THREE.Mesh(seatGeo, aluminum);
    seat.position.set(0, 1, 0.5);
    group.add(seat);

    const backGeo = new THREE.BoxGeometry(1, 1.5, 0.2);
    const back = new THREE.Mesh(backGeo, aluminum);
    back.position.set(0, 1.75, 1.1);
    group.add(back);

    // Console Deck
    const deckGeo = new THREE.BoxGeometry(3, 1, 1.5);
    const deck = new THREE.Mesh(deckGeo, titanium);
    deck.position.set(0, 1.5, -1);
    group.add(deck);

    // Dual Eyepiece
    const viewerGeo = new THREE.BoxGeometry(1.5, 0.5, 1);
    const viewer = new THREE.Mesh(viewerGeo, titanium);
    viewer.position.set(0, 2.5, -0.8);
    viewer.rotation.x = Math.PI / 6;
    group.add(viewer);

    const lensLGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
    const lensL = new THREE.Mesh(lensLGeo, glass);
    lensL.rotation.x = Math.PI / 2;
    lensL.position.set(-0.3, 0, 0.5);
    viewer.add(lensL);

    const lensR = lensL.clone();
    lensR.position.set(0.3, 0, 0.5);
    viewer.add(lensR);

    // Manipulators
    const armLGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const armL = new THREE.Mesh(armLGeo, aluminum);
    armL.position.set(-0.8, 2, -0.5);
    armL.rotation.x = -Math.PI / 4;
    armL.name = 'ArmL';
    group.add(armL);

    const armRGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const armR = new THREE.Mesh(armRGeo, aluminum);
    armR.position.set(0.8, 2, -0.5);
    armR.rotation.x = -Math.PI / 4;
    armR.name = 'ArmR';
    group.add(armR);

    // Animation: Operator moving manipulators
    const armLTrack = new THREE.NumberKeyframeTrack('ArmL.rotation[z]', [0, 1, 2], [0, 0.3, 0]);
    const armLTrackX = new THREE.NumberKeyframeTrack('ArmL.rotation[x]', [0, 1, 2], [-Math.PI/4, -Math.PI/3, -Math.PI/4]);
    const armRTrack = new THREE.NumberKeyframeTrack('ArmR.rotation[z]', [0, 1.5, 3], [0, -0.4, 0]);

    const opClip = new THREE.AnimationClip('Operate', 3, [armLTrack, armLTrackX, armRTrack]);
    animationClips.push(opClip);

    return { group, animationClips };
}
