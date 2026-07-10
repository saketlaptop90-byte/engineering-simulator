import { materials } from '../utils/materials.js';

export function createDryPipeValve(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const redMat = (materials && materials.redMetal) || new THREE.MeshStandardMaterial({ color: 0xaa0000, metalness: 0.7, roughness: 0.3 });
    const brassMat = (materials && materials.brass) || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.2 });

    // Main Body
    const bodyGeom = new THREE.CylinderGeometry(2, 2, 6, 32);
    const body = new THREE.Mesh(bodyGeom, redMat);
    group.add(body);

    // Clapper inside
    const clapperGroup = new THREE.Group();
    clapperGroup.position.set(0, 0, 0);
    clapperGroup.name = "clapperGroup";
    
    const clapperGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const clapper = new THREE.Mesh(clapperGeom, brassMat);
    clapper.position.set(0, 0, 0);
    clapperGroup.add(clapper);
    group.add(clapperGroup);

    // Gauge
    const gaugeGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16);
    const gauge = new THREE.Mesh(gaugeGeom, brassMat);
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 2, 2.1);
    group.add(gauge);

    const needleGeom = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const needle = new THREE.Mesh(needleGeom, new THREE.MeshBasicMaterial({color: 0x000000}));
    needle.position.set(0, 2, 2.3);
    needle.name = "needle";
    group.add(needle);

    // Animation
    const times = [0, 2, 4];
    
    const clapperTrack = new THREE.QuaternionKeyframeTrack(
        `clapperGroup.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0)).toArray()
        ]
    );

    const needleTrack = new THREE.QuaternionKeyframeTrack(
        `needle.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/4)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/4)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/4)).toArray()
        ]
    );

    const clip = new THREE.AnimationClip("Activate", 4, [clapperTrack, needleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
