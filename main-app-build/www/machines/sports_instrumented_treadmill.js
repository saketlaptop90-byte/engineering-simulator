import { materials } from '../utils/materials.js';

export function createInstrumentedTreadmill(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameGeo = new THREE.BoxGeometry(2, 0.3, 4);
    const frame = new THREE.Mesh(frameGeo, materials.steel);
    frame.position.y = 0.15;
    group.add(frame);

    const beltGroup = new THREE.Group();
    beltGroup.position.y = 0.32;
    group.add(beltGroup);

    const rollerGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.8);
    const rollers = [];
    for(let i = -18; i <= 18; i++) {
        const pivot = new THREE.Group();
        pivot.position.z = i * 0.1;
        pivot.name = `roller_${i+18}`;
        beltGroup.add(pivot);

        const roller = new THREE.Mesh(rollerGeo, materials.carbonFiber);
        roller.rotation.z = Math.PI / 2;
        pivot.add(roller);
        
        rollers.push(pivot);
    }

    const railGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5);
    const leftRail1 = new THREE.Mesh(railGeo, materials.aluminum);
    leftRail1.position.set(-0.9, 1.05, 1);
    const leftRail2 = new THREE.Mesh(railGeo, materials.aluminum);
    leftRail2.position.set(-0.9, 1.05, -1);
    const rightRail1 = new THREE.Mesh(railGeo, materials.aluminum);
    rightRail1.position.set(0.9, 1.05, 1);
    const rightRail2 = new THREE.Mesh(railGeo, materials.aluminum);
    rightRail2.position.set(0.9, 1.05, -1);
    group.add(leftRail1, leftRail2, rightRail1, rightRail2);

    const topRailGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0);
    const leftTopRail = new THREE.Mesh(topRailGeo, materials.plastic);
    leftTopRail.rotation.x = Math.PI / 2;
    leftTopRail.position.set(-0.9, 1.8, 0);
    const rightTopRail = new THREE.Mesh(topRailGeo, materials.plastic);
    rightTopRail.rotation.x = Math.PI / 2;
    rightTopRail.position.set(0.9, 1.8, 0);
    group.add(leftTopRail, rightTopRail);

    const consoleGeo = new THREE.BoxGeometry(1.8, 0.4, 0.2);
    const consoleMesh = new THREE.Mesh(consoleGeo, materials.plastic);
    consoleMesh.position.set(0, 1.9, -1.1);
    consoleMesh.rotation.x = Math.PI / 6;
    group.add(consoleMesh);

    const times = [0, 1, 2];
    const tracks = [];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI * 2);
    const rotVals = [...q0.toArray(), ...q1.toArray(), ...q2.toArray()];

    rollers.forEach((pivot) => {
        const track = new THREE.QuaternionKeyframeTrack(`${pivot.name}.quaternion`, times, rotVals);
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('TreadmillAction', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
