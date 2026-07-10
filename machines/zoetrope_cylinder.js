import { materials } from '../utils/materials.js';

export function createZoetrope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Stand
    const baseGeo = new THREE.CylinderGeometry(0.8, 1, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, materials.darkSteel);
    group.add(base);

    const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const post = new THREE.Mesh(postGeo, materials.brass);
    post.position.set(0, 1, 0);
    group.add(post);

    // Cylinder Group
    const cylinderGroup = new THREE.Group();
    cylinderGroup.position.set(0, 2, 0);
    cylinderGroup.name = "cylinder";
    group.add(cylinderGroup);

    // The drum
    const drumGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32, 1, true); // Open ended
    const drum = new THREE.Mesh(drumGeo, materials.aluminum);
    cylinderGroup.add(drum);

    // Drum bottom
    const drumBottomGeo = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const drumBottom = new THREE.Mesh(drumBottomGeo, materials.darkSteel);
    drumBottom.position.set(0, -0.75, 0);
    cylinderGroup.add(drumBottom);

    // Slits in the drum
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const slitGeo = new THREE.BoxGeometry(0.05, 0.8, 0.2);
        const slit = new THREE.Mesh(slitGeo, materials.darkSteel);
        slit.position.set(Math.cos(angle) * 2, 0.35, Math.sin(angle) * 2);
        slit.rotation.y = -angle;
        cylinderGroup.add(slit);
    }

    // Animation
    const times = [0, 1, 2];
    const yAxis = new THREE.Vector3(0, 1, 0);
    const q0 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2);

    const values = [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray()
    ];

    const cylinderTrack = new THREE.QuaternionKeyframeTrack('cylinder.quaternion', times, values);

    const clip = new THREE.AnimationClip('ZoetropeSpin', 2, [cylinderTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
