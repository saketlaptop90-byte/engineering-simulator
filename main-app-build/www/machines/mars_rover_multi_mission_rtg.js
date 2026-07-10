import { aluminum, gold, blackPlastic, titanium } from '../utils/materials.js';

export function createMultiMissionRTG(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32), blackPlastic);
    group.add(core);

    for(let i=0; i<8; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.3, 0.05), titanium);
        fin.rotation.y = (Math.PI / 4) * i;
        group.add(fin);
    }

    const cap1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI*2, 0, Math.PI/2), aluminum);
    cap1.position.set(0, 0.75, 0);
    group.add(cap1);

    const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1), gold);
    cap2.position.set(0, -0.75, 0);
    group.add(cap2);

    group.name = "rtgGroup";
    const scaleTimes = [0, 2, 4];
    const scaleValues = [1, 1, 1,  1.02, 1.02, 1.02,  1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('rtgGroup.scale', scaleTimes, scaleValues);
    const clip = new THREE.AnimationClip('Pulse', 4, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
