import * as matModule from '../utils/materials.js';

export function createGravureCylinder(THREE) {
    const materials = matModule.materials || matModule.default || matModule;
    const group = new THREE.Group();
    const animationClips = [];

    const copperMat = (materials && materials.copper) || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 });
    const inkMat = (materials && materials.ink) || new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.1 });
    const bladeMat = (materials && materials.steel) || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const paperMat = (materials && materials.paper) || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0 });

    const cylinderPivot = new THREE.Group();
    cylinderPivot.name = 'gravureCylinder';
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 64), copperMat);
    cylinder.rotation.z = Math.PI / 2;
    cylinderPivot.add(cylinder);
    group.add(cylinderPivot);

    const inkBath = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 2.2), inkMat);
    inkBath.position.set(0, -1.5, 0);
    group.add(inkBath);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 0.5), bladeMat);
    blade.position.set(0, 0, 1.1);
    blade.rotation.x = -Math.PI / 4;
    group.add(blade);

    const paper = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 6), paperMat);
    paper.position.set(0, 1, -3);
    paper.rotation.x = -Math.PI / 2;
    paper.name = 'paperWeb';
    group.add(paper);

    const times = [0, 0.5, 1, 1.5, 2];
    const quatVals = [];
    for(let i=0; i<=4; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (i/4) * Math.PI * 2);
        quatVals.push(q.x, q.y, q.z, q.w);
    }

    const tracks = [
        new THREE.QuaternionKeyframeTrack('gravureCylinder.quaternion', times, quatVals),
        new THREE.VectorKeyframeTrack('paperWeb.position', [0, 2], [0, 1, -3, 0, 1, 3])
    ];

    const clip = new THREE.AnimationClip('GravureRun', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
