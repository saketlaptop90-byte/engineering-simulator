import * as THREE from 'three';
import { steel, aluminum, chrome, darkSteel } from '../utils/materials.js';

export function createHexapod(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 6);
    const base = new THREE.Mesh(baseGeo, steel);
    base.position.y = 0.1;
    group.add(base);

    const topGroup = new THREE.Group();
    topGroup.name = 'TopPlatform';
    topGroup.position.y = 1.5;
    group.add(topGroup);

    const topGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 6);
    const topPlatform = new THREE.Mesh(topGeo, aluminum);
    topGroup.add(topPlatform);

    for (let i = 0; i < 6; i++) {
        const angleBase = (i * Math.PI / 3) + (i % 2 === 0 ? 0.2 : -0.2);
        const angleTop = (i * Math.PI / 3) + (i % 2 === 0 ? -0.2 : 0.2);
        
        const bJoint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), darkSteel);
        bJoint.position.set(Math.cos(angleBase) * 1.0, 0.2, Math.sin(angleBase) * 1.0);
        group.add(bJoint);

        const tJoint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), chrome);
        tJoint.position.set(Math.cos(angleTop) * 0.7, 0, Math.sin(angleTop) * 0.7);
        topGroup.add(tJoint);
    }

    const centerBellow = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.3, 16), darkSteel);
    centerBellow.position.y = 0.85;
    centerBellow.name = 'CenterBellow';
    group.add(centerBellow);

    const times = [0, 1.5, 3, 4.5, 6];
    const posValues = [0, 1.5, 0, 0.2, 1.7, 0.2, -0.2, 1.3, -0.2, 0, 1.6, 0.3, 0, 1.5, 0];
    const posTrack = new THREE.VectorKeyframeTrack('TopPlatform.position', times, posValues);

    const rotValues = [];
    const e = new THREE.Euler();
    const q = new THREE.Quaternion();
    [
        [0, 0, 0], [0.3, 0.1, -0.2], [-0.2, -0.3, 0.3], [0.1, 0, 0.4], [0, 0, 0]
    ].forEach(euler => {
        e.set(...euler); q.setFromEuler(e); rotValues.push(q.x, q.y, q.z, q.w);
    });

    const rotTrack = new THREE.QuaternionKeyframeTrack('TopPlatform.quaternion', times, rotValues);
    const bellowScaleValues = [1, 1, 1, 1, 1.15, 1, 1, 0.85, 1, 1, 1.07, 1, 1, 1, 1];
    const bellowScaleTrack = new THREE.VectorKeyframeTrack('CenterBellow.scale', times, bellowScaleValues);

    const clip = new THREE.AnimationClip('Hexapod_Motion', 6, [posTrack, rotTrack, bellowScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
