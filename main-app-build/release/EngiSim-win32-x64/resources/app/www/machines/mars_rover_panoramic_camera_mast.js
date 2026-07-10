import { aluminum, gold, blackPlastic, titanium } from '../utils/materials.js';

export function createPanoramicCameraMast(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.2), titanium);
    group.add(base);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), aluminum);
    mast.position.y = 0.85;
    group.add(mast);

    const headGroup = new THREE.Group();
    headGroup.name = "cameraHead";
    headGroup.position.y = 1.6;
    group.add(headGroup);

    const headBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.2), blackPlastic);
    headGroup.add(headBody);

    const lensGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1);
    lensGeo.rotateX(Math.PI/2);
    
    const lensL = new THREE.Mesh(lensGeo, gold);
    lensL.position.set(-0.1, 0, 0.1);
    headGroup.add(lensL);

    const lensR = new THREE.Mesh(lensGeo, gold);
    lensR.position.set(0.1, 0, 0.1);
    headGroup.add(lensR);

    const times = [0, 2, 4, 6, 8];
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI/4, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI/4, 0));
    
    const quatValues = [
        ...q1.toArray(),
        ...q2.toArray(),
        ...q1.toArray(),
        ...q3.toArray(),
        ...q1.toArray()
    ];
    
    const panTrack = new THREE.QuaternionKeyframeTrack('cameraHead.quaternion', times, quatValues);
    const clip = new THREE.AnimationClip('Pan', 8, [panTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
