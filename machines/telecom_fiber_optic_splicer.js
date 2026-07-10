import * as materials from '../utils/materials.js';

export function createFiberOpticSplicer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base of the splicer
    const baseGeo = new THREE.BoxGeometry(4, 2, 3);
    const base = new THREE.Mesh(baseGeo, materials.plastic);
    group.add(base);

    // Screen
    const screenGeo = new THREE.BoxGeometry(2, 1.5, 0.1);
    const screen = new THREE.Mesh(screenGeo, materials.glass);
    screen.position.set(0, 1.5, -1.2);
    screen.rotation.x = Math.PI / 6;
    group.add(screen);

    const screenFrameGeo = new THREE.BoxGeometry(2.2, 1.7, 0.1);
    const screenFrame = new THREE.Mesh(screenFrameGeo, materials.darkSteel);
    screenFrame.position.copy(screen.position);
    screenFrame.position.z -= 0.05;
    screenFrame.rotation.copy(screen.rotation);
    group.add(screenFrame);

    // Splice Chamber Lid
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 1, 0); // Hinge position
    group.add(lidGroup);

    const lidGeo = new THREE.BoxGeometry(2, 0.2, 1.5);
    const lid = new THREE.Mesh(lidGeo, materials.whitePlastic);
    lid.position.set(0, 0, 0.75); // Offset from hinge
    lidGroup.add(lid);

    // Electrodes
    const electrodeGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.5);
    const electrode1 = new THREE.Mesh(electrodeGeo, materials.titanium);
    electrode1.position.set(-0.2, 1.2, 0.5);
    electrode1.rotation.z = Math.PI / 2;
    group.add(electrode1);

    const electrode2 = new THREE.Mesh(electrodeGeo, materials.titanium);
    electrode2.position.set(0.2, 1.2, 0.5);
    electrode2.rotation.z = -Math.PI / 2;
    group.add(electrode2);

    // Arc flash (spark)
    const arcGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const arc = new THREE.Mesh(arcGeo, materials.fire);
    arc.position.set(0, 1.2, 0.5);
    arc.scale.set(0.001, 0.001, 0.001); // Initially hidden
    group.add(arc);

    // Fibers
    const fiberGeo = new THREE.CylinderGeometry(0.02, 0.02, 2);
    const fiber1 = new THREE.Mesh(fiberGeo, materials.glass);
    fiber1.position.set(-1.2, 1.2, 0.5);
    fiber1.rotation.z = Math.PI / 2;
    group.add(fiber1);

    const fiber2 = new THREE.Mesh(fiberGeo, materials.glass);
    fiber2.position.set(1.2, 1.2, 0.5);
    fiber2.rotation.z = Math.PI / 2;
    group.add(fiber2);

    // Animations
    const lidTrack = new THREE.NumberKeyframeTrack(`${lidGroup.uuid}.rotation[x]`, [0, 1, 4, 5], [-Math.PI/2, 0, 0, -Math.PI/2]);
    const f1Track = new THREE.NumberKeyframeTrack(`${fiber1.uuid}.position[x]`, [0, 1, 1.5, 4, 5], [-1.5, -1.5, -1.05, -1.05, -1.5]);
    const f2Track = new THREE.NumberKeyframeTrack(`${fiber2.uuid}.position[x]`, [0, 1, 1.5, 4, 5], [1.5, 1.5, 1.05, 1.05, 1.5]);

    const arcTrack = new THREE.NumberKeyframeTrack(`${arc.uuid}.scale`, [0, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2], [
        0.001, 0.001, 0.001,
        0.001, 0.001, 0.001,
        1, 1, 1,
        0.5, 0.5, 0.5,
        1.5, 1.5, 1.5,
        0.5, 0.5, 0.5,
        1, 1, 1,
        0.001, 0.001, 0.001,
        0.001, 0.001, 0.001
    ]);

    const clip = new THREE.AnimationClip('SpliceCycle', 5, [lidTrack, f1Track, f2Track, arcTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
