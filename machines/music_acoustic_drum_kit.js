import { wood, steel, copper, blackPlastic } from '../utils/materials.js';

export function createAcousticDrumKit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bass drum
    const bassGeo = new THREE.CylinderGeometry(1, 1, 1.5, 32);
    const bass = new THREE.Mesh(bassGeo, wood);
    bass.rotation.z = Math.PI / 2;
    bass.position.set(0, 1, 0);
    group.add(bass);

    // Snare
    const snareGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
    const snare = new THREE.Mesh(snareGeo, steel);
    snare.position.set(-1.2, 1.5, 0.5);
    group.add(snare);

    // Cymbal
    const cymbalGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.02, 32);
    const cymbal = new THREE.Mesh(cymbalGeo, copper);
    cymbal.position.set(1.5, 2.5, 0.5);
    cymbal.rotation.x = -Math.PI / 8;
    cymbal.name = 'crash_cymbal';
    group.add(cymbal);

    // Drum pedal
    const pedalGeo = new THREE.BoxGeometry(0.2, 0.1, 0.5);
    const pedal = new THREE.Mesh(pedalGeo, steel);
    pedal.position.set(0, 0.1, 1);
    pedal.name = 'drum_pedal';
    group.add(pedal);

    // Animate Pedal
    const pedalTimes = [0, 0.1, 0.2];
    const pedalValues = [0, -0.2, 0]; // kicking
    const pedalTrack = new THREE.NumberKeyframeTrack(`${pedal.name}.rotation[x]`, pedalTimes, pedalValues);
    const pedalClip = new THREE.AnimationClip('kick_pedal', 0.2, [pedalTrack]);
    animationClips.push(pedalClip);

    // Animate Cymbal
    const cymbalTimes = [0, 0.1, 0.4];
    const cymbalValues = [-Math.PI/8, -Math.PI/6, -Math.PI/8];
    const cymbalTrack = new THREE.NumberKeyframeTrack(`${cymbal.name}.rotation[x]`, cymbalTimes, cymbalValues);
    const cymbalClip = new THREE.AnimationClip('hit_cymbal', 0.4, [cymbalTrack]);
    animationClips.push(cymbalClip);

    return { group, animationClips };
}
