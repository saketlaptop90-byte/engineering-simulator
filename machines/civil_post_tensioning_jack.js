import { steel, whitePlastic, redAccent, chrome, darkSteel } from '../utils/materials.js';

export function createPostTensioningJack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Concrete block
    const blockGeo = new THREE.BoxGeometry(10, 10, 5);
    const block = new THREE.Mesh(blockGeo, whitePlastic);
    block.position.set(0, 5, -2.5);
    group.add(block);

    // Tendon (Cable)
    const tendonGeo = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    const tendon = new THREE.Mesh(tendonGeo, darkSteel);
    tendon.rotation.x = Math.PI / 2;
    tendon.position.set(0, 5, 5);
    group.add(tendon);

    // Jack Body
    const jackGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const jack = new THREE.Mesh(jackGeo, redAccent);
    jack.rotation.x = Math.PI / 2;
    jack.position.set(0, 5, 2);
    group.add(jack);

    // Jack Piston
    const pistonGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const piston = new THREE.Mesh(pistonGeo, chrome);
    piston.rotation.x = Math.PI / 2;
    piston.position.set(0, 5, 2);
    group.add(piston);

    // Anchor head / Wedge
    const anchorGeo = new THREE.CylinderGeometry(0.6, 0.4, 0.5, 16);
    const anchor = new THREE.Mesh(anchorGeo, steel);
    anchor.rotation.x = Math.PI / 2;
    anchor.position.set(0, 5, 0.25);
    group.add(anchor);

    // Animations
    const duration = 5;

    // Jack moves back, pulling tendon
    const jackTimes = [0, 1.5, 3, 4.5, 5];
    const jackValues = [
        0, 5, 2,
        0, 5, 4,
        0, 5, 4,
        0, 5, 2,
        0, 5, 2
    ];
    const jackTrack = new THREE.VectorKeyframeTrack(`${jack.uuid}.position`, jackTimes, jackValues);

    // Tendon elongates / moves with jack
    const tendonTimes = [0, 1.5, 3, 4.5, 5];
    const tendonValues = [
        0, 5, 5,
        0, 5, 7,
        0, 5, 7,
        0, 5, 7,
        0, 5, 7
    ];
    const tendonTrack = new THREE.VectorKeyframeTrack(`${tendon.uuid}.position`, tendonTimes, tendonValues);

    // Piston extends from body to push against block
    const pistonValues = [
        0, 5, 2,
        0, 5, 3,
        0, 5, 3,
        0, 5, 2,
        0, 5, 2
    ];
    const pistonTrack = new THREE.VectorKeyframeTrack(`${piston.uuid}.position`, jackTimes, pistonValues);

    const clip = new THREE.AnimationClip('PostTensioning', duration, [
        jackTrack, tendonTrack, pistonTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
