import { copper, brass, iron, steel, rubber } from '../utils/materials.js';

export function createGateValve(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Valve body
    const bodyGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const body = new THREE.Mesh(bodyGeo, iron);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    const bonnetGeo = new THREE.CylinderGeometry(1.5, 1.8, 3, 32);
    const bonnet = new THREE.Mesh(bonnetGeo, iron);
    bonnet.position.y = 2;
    group.add(bonnet);

    // Stem and Wheel
    const stemGroup = new THREE.Group();
    stemGroup.name = 'Stem';
    
    const stemGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    const stem = new THREE.Mesh(stemGeo, steel);
    stem.position.y = 4;
    stemGroup.add(stem);

    const wheelGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
    const wheel = new THREE.Mesh(wheelGeo, steel);
    wheel.position.y = 6.5;
    wheel.rotation.x = Math.PI / 2;
    stemGroup.add(wheel);

    group.add(stemGroup);

    // Gate
    const gateGroup = new THREE.Group();
    gateGroup.name = 'Gate';
    const gateGeo = new THREE.BoxGeometry(1.8, 2, 0.5);
    const gate = new THREE.Mesh(gateGeo, brass);
    gate.position.y = 0;
    gateGroup.add(gate);
    group.add(gateGroup);

    // Animation: Wheel turns and gate lifts
    const times = [0, 2, 4];
    const rotationValues = [0, Math.PI * 4, 0];
    const positionValuesStem = [0, 0, 0,  0, 2, 0,  0, 0, 0];
    const positionValuesGate = [0, 0, 0,  0, 2, 0,  0, 0, 0];

    const wheelTrack = new THREE.NumberKeyframeTrack('Stem.rotation[y]', times, rotationValues);
    const stemPosTrack = new THREE.VectorKeyframeTrack('Stem.position', times, positionValuesStem);
    const gatePosTrack = new THREE.VectorKeyframeTrack('Gate.position', times, positionValuesGate);

    const clip = new THREE.AnimationClip('OpenClose', 4, [wheelTrack, stemPosTrack, gatePosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
