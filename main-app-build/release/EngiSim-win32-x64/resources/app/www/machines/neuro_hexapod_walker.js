import { darkSteel, aluminum, copper } from '../utils/materials.js';

export function createHexapodWalker(THREE) {
    const group = new THREE.Group();
    group.name = "HexapodWalker";

    const bodyGeo = new THREE.SphereGeometry(0.5, 32, 16);
    const body = new THREE.Mesh(bodyGeo, darkSteel);
    group.add(body);

    const legs = [];
    const tracks = [];
    const times = [0, 0.5, 1.0];

    for (let i = 0; i < 6; i++) {
        const legPivot = new THREE.Group();
        legPivot.name = `LegPivot_${i}`;
        const angle = (i / 6) * Math.PI * 2;
        legPivot.position.set(Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5);
        legPivot.rotation.y = -angle; // Point outward

        const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.1), aluminum);
        legMesh.position.set(0.4, 0, 0);
        legPivot.add(legMesh);

        group.add(legPivot);
        legs.push(legPivot);

        const phase = i % 2 === 0 ? 0 : 1; // Tripod gait
        const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -angle, 0));
        const qLift = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -angle, Math.PI/6));
        
        let values;
        if (phase === 0) {
            values = [...qStart.toArray(), ...qLift.toArray(), ...qStart.toArray()];
        } else {
            values = [...qLift.toArray(), ...qStart.toArray(), ...qLift.toArray()];
        }
        
        tracks.push(new THREE.QuaternionKeyframeTrack(`LegPivot_${i}.quaternion`, times, values));
    }

    const clip = new THREE.AnimationClip('Walk', 1.0, tracks);

    return { group, animationClips: [clip] };
}
