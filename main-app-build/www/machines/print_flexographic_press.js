import * as matModule from '../utils/materials.js';

export function createFlexoPress(THREE) {
    const materials = matModule.materials || matModule.default || matModule;
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = (materials && materials.steel) || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.3 });
    const flexoPlateMat = (materials && materials.rubber) || new THREE.MeshStandardMaterial({ color: 0x228822, roughness: 0.8 });
    const aniloxMat = (materials && materials.ceramic) || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const labelMat = (materials && materials.paper) || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0 });

    const createCylinder = (radius, posY, mat, name) => {
        const pivot = new THREE.Group();
        pivot.position.set(0, posY, 0);
        pivot.name = name;
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1.2, 32), mat);
        mesh.rotation.z = Math.PI / 2;
        pivot.add(mesh);
        group.add(pivot);
        return pivot;
    };

    createCylinder(0.4, 1.2, aniloxMat, 'aniloxRoller');
    createCylinder(0.6, 0.2, flexoPlateMat, 'plateCylinder');
    createCylinder(0.6, -1.0, frameMat, 'impressionCylinder');

    const web = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 5), labelMat);
    web.position.set(0, -0.4, -2.5);
    web.rotation.x = -Math.PI / 2;
    web.name = 'labelWeb';
    group.add(web);

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
        new THREE.QuaternionKeyframeTrack('aniloxRoller.quaternion', times, getQuats(false)),
        new THREE.QuaternionKeyframeTrack('plateCylinder.quaternion', times, getQuats(true)),
        new THREE.QuaternionKeyframeTrack('impressionCylinder.quaternion', times, getQuats(false)),
        new THREE.VectorKeyframeTrack('labelWeb.position', [0, 2], [0, -0.4, -2.5, 0, -0.4, 2.5])
    ];

    const clip = new THREE.AnimationClip('FlexoRun', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
