import { materials } from '../utils/materials.js';

export function createSubmarinePressureHull(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const hullMat = materials.titanium || new THREE.MeshStandardMaterial({ color: 0x888899, transparent: true, opacity: 0.5 });
    const ribMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8 });
    
    const hullGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.x = Math.PI / 2;
    group.add(hull);

    for (let i = -3.5; i <= 3.5; i += 1) {
        const ribGeo = new THREE.TorusGeometry(1.95, 0.05, 16, 32);
        const rib = new THREE.Mesh(ribGeo, ribMat);
        rib.position.z = i;
        group.add(rib);
    }

    const tankGeo = new THREE.BoxGeometry(1, 1, 4);
    
    const tankL = new THREE.Mesh(tankGeo, ballastMat);
    tankL.name = 'tankL';
    tankL.position.set(-1.5, -1, 0);
    group.add(tankL);

    const tankR = new THREE.Mesh(tankGeo, ballastMat);
    tankR.name = 'tankR';
    tankR.position.set(1.5, -1, 0);
    group.add(tankR);

    const duration = 5;
    const times = [0, duration / 2, duration];
    
    const scaleTrackL = new THREE.VectorKeyframeTrack('tankL.scale', times, [
        1, 0.1, 1,
        1, 1, 1,
        1, 0.1, 1
    ]);
    const scaleTrackR = new THREE.VectorKeyframeTrack('tankR.scale', times, [
        1, 0.1, 1,
        1, 1, 1,
        1, 0.1, 1
    ]);

    const posTrackL = new THREE.VectorKeyframeTrack('tankL.position', times, [
        -1.5, -1.45, 0,
        -1.5, -1, 0,
        -1.5, -1.45, 0
    ]);
    const posTrackR = new THREE.VectorKeyframeTrack('tankR.position', times, [
        1.5, -1.45, 0,
        1.5, -1, 0,
        1.5, -1.45, 0
    ]);

    const clip = new THREE.AnimationClip('Hull_Action', duration, [
        scaleTrackL, scaleTrackR, posTrackL, posTrackR
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
