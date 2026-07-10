import * as matModule from '../utils/materials.js';

export function createOffsetPress(THREE) {
    const materials = matModule.materials || matModule.default || matModule;
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = (materials && materials.steel) || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const rollerMat = (materials && materials.rubber) || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const paperMat = (materials && materials.paper) || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0 });

    const createCylinder = (radius, posY, mat, name) => {
        const pivot = new THREE.Group();
        pivot.position.set(0, posY, 0);
        pivot.name = name;
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1.8, 32), mat);
        mesh.rotation.z = Math.PI / 2;
        pivot.add(mesh);
        group.add(pivot);
        return pivot;
    };

    createCylinder(0.8, 1.5, baseMat, 'plateCylinder');
    createCylinder(0.8, -0.2, rollerMat, 'blanketCylinder');
    createCylinder(0.8, -1.9, baseMat, 'impressionCylinder');

    const paper = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 5), paperMat);
    paper.position.set(0, -1.05, -3);
    paper.rotation.x = -Math.PI / 2;
    paper.name = 'paperSheet';
    group.add(paper);

    const times = [0, 0.5, 1, 1.5, 2];
    const getQuats = (reverse) => {
        const vals = [];
        const axis = new THREE.Vector3(1, 0, 0);
        for(let i=0; i<=4; i++) {
            const angle = (reverse ? -1 : 1) * (i/4) * Math.PI * 2;
            const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            vals.push(q.x, q.y, q.z, q.w);
        }
        return vals;
    };

    const tracks = [
        new THREE.QuaternionKeyframeTrack('plateCylinder.quaternion', times, getQuats(false)),
        new THREE.QuaternionKeyframeTrack('blanketCylinder.quaternion', times, getQuats(true)),
        new THREE.QuaternionKeyframeTrack('impressionCylinder.quaternion', times, getQuats(false)),
        new THREE.VectorKeyframeTrack('paperSheet.position', [0, 2], [0, -1.05, -3, 0, -1.05, 3])
    ];

    const clip = new THREE.AnimationClip('OffsetPressRun', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
