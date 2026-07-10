import { steel, aluminum, redAccent, brass } from '../utils/materials.js';

export function createPneumaticValvePositioner(THREE) {
    const group = new THREE.Group();

    // Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const pipe = new THREE.Mesh(pipeGeo, steel);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Valve Body
    const bodyGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const body = new THREE.Mesh(bodyGeo, steel);
    group.add(body);

    // Bonnet & Stem enclosure
    const bonnetGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 16);
    const bonnet = new THREE.Mesh(bonnetGeo, steel);
    bonnet.position.y = 1.2;
    group.add(bonnet);

    // Valve Stem
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 16);
    const stem = new THREE.Mesh(stemGeo, aluminum);
    stem.position.y = 2;
    group.add(stem);

    // Diaphragm Casing
    const casingBaseGeo = new THREE.CylinderGeometry(1.5, 0.2, 0.5, 32);
    const casingBase = new THREE.Mesh(casingBaseGeo, redAccent);
    casingBase.position.y = 3.5;
    group.add(casingBase);

    const casingTopGeo = new THREE.CylinderGeometry(0.2, 1.5, 0.5, 32);
    const casingTop = new THREE.Mesh(casingTopGeo, redAccent);
    casingTop.position.y = 4.0;
    group.add(casingTop);

    // Positioner Box
    const posBoxGeo = new THREE.BoxGeometry(0.6, 0.8, 0.4);
    const posBox = new THREE.Mesh(posBoxGeo, aluminum);
    posBox.position.set(0.5, 2.5, 0);
    group.add(posBox);

    // Positioner Linkage
    const linkageGeo = new THREE.BoxGeometry(0.5, 0.05, 0.05);
    const linkage = new THREE.Mesh(linkageGeo, brass);
    linkage.position.set(0.2, 2.5, 0);
    group.add(linkage);

    // Animation
    const times = [0, 2, 4];
    const stemPosValues = [2.0, 1.5, 2.0];
    const stemTrack = new THREE.NumberKeyframeTrack(stem.uuid + '.position[y]', times, stemPosValues);

    const linkageRotValues = [0, -Math.PI/6, 0];
    const linkageTrack = new THREE.NumberKeyframeTrack(linkage.uuid + '.rotation[z]', times, linkageRotValues);

    const clip = new THREE.AnimationClip('ValveActuation', 4, [stemTrack, linkageTrack]);

    return { group, animationClips: [clip] };
}
