import { blackPlastic, aluminum, glass, wood } from '../utils/materials.js';

export function createInstantFilmMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Camera Body
    const bodyGeom = new THREE.BoxGeometry(2.5, 2, 2);
    const body = new THREE.Mesh(bodyGeom, blackPlastic);
    group.add(body);

    // Lens Base
    const lensBaseGeom = new THREE.BoxGeometry(1.2, 1.2, 0.5);
    const lensBase = new THREE.Mesh(lensBaseGeom, aluminum);
    lensBase.position.set(0, 0, 1.25);
    group.add(lensBase);

    // Lens
    const lensGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32);
    lensGeom.rotateX(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeom, glass);
    lens.position.set(0, 0, 1.4);
    group.add(lens);

    // Film Slot
    const slotGeom = new THREE.BoxGeometry(2.2, 0.1, 0.5);
    const slot = new THREE.Mesh(slotGeom, aluminum);
    slot.position.set(0, -1.05, 0.5);
    group.add(slot);

    // Film Print
    const printGeom = new THREE.BoxGeometry(2, 0.05, 2.2);
    const print = new THREE.Mesh(printGeom, new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
    print.position.set(0, -1.05, -0.5); // Starts inside
    group.add(print);

    // Film rollers
    const rollerGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 16);
    rollerGeom.rotateZ(Math.PI / 2);
    const roller1 = new THREE.Mesh(rollerGeom, aluminum);
    roller1.position.set(0, -1.0, 0.6);
    group.add(roller1);

    const roller2 = new THREE.Mesh(rollerGeom, aluminum);
    roller2.position.set(0, -1.1, 0.6);
    group.add(roller2);

    // Animation: Film ejecting
    const times = [0, 0.5, 2, 2.5];
    const printPos = [
        0, -1.05, -0.5,
        0, -1.05, -0.5,
        0, -1.05, 2.0,  // Ejected
        0, -1.05, 2.0
    ];

    const rollerRot1 = [0, 0, Math.PI * 4, Math.PI * 4];
    const rollerRot2 = [0, 0, -Math.PI * 4, -Math.PI * 4];

    const printTrack = new THREE.NumberKeyframeTrack(`${print.uuid}.position`, times, printPos);
    const r1Track = new THREE.NumberKeyframeTrack(`${roller1.uuid}.rotation[x]`, times, rollerRot1);
    const r2Track = new THREE.NumberKeyframeTrack(`${roller2.uuid}.rotation[x]`, times, rollerRot2);

    const clip = new THREE.AnimationClip('FilmEject', 2.5, [printTrack, r1Track, r2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
