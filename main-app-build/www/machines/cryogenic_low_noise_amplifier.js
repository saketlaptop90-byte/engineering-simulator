import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createCryogenicLowNoiseAmplifier(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Housing
    const bodyGeom = new THREE.BoxGeometry(2, 1, 3);
    const body = new THREE.Mesh(bodyGeom, copper);
    group.add(body);

    // Connectors
    const connectorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const conn1 = new THREE.Mesh(connectorGeom, gold);
    conn1.rotation.z = Math.PI / 2;
    conn1.position.set(1.1, 0, 1);
    group.add(conn1);

    const conn2 = new THREE.Mesh(connectorGeom, gold);
    conn2.rotation.z = Math.PI / 2;
    conn2.position.set(-1.1, 0, -1);
    group.add(conn2);

    // Heat sink fins
    for(let i=-1.2; i<=1.2; i+=0.4) {
        const finGeom = new THREE.BoxGeometry(1.8, 0.4, 0.1);
        const fin = new THREE.Mesh(finGeom, aluminum);
        fin.position.set(0, 0.7, i);
        group.add(fin);
    }

    // Animation: Subtle pulsing to indicate operation
    const trackName = body.uuid + '.position';
    const times = [0, 0.5, 1];
    const values = [
        0, 0, 0,
        0, 0.02, 0,
        0, 0, 0
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('LNA_Operate', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
