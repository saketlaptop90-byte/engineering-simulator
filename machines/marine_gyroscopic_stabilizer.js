import { materials } from '../utils/materials.js';

export function createGyroscopicStabilizer(THREE) {
    const group = new THREE.Group();
    group.name = 'stabilizerAssembly';
    const animationClips = [];

    const frameGeo = new THREE.TorusGeometry(8, 0.5, 16, 64);
    const frame = new THREE.Mesh(frameGeo, materials.metal);
    frame.rotation.x = Math.PI / 2;
    group.add(frame);

    const gimbalGeo = new THREE.TorusGeometry(6, 0.5, 16, 64);
    const gimbal = new THREE.Mesh(gimbalGeo, materials.steel);
    gimbal.name = 'gimbal';
    group.add(gimbal);

    const flywheelGeo = new THREE.CylinderGeometry(5, 5, 2, 64);
    const flywheel = new THREE.Mesh(flywheelGeo, materials.brass || materials.metal);
    flywheel.name = 'flywheel';
    gimbal.add(flywheel);

    const flywheelTrack = new THREE.NumberKeyframeTrack('flywheel.rotation[y]', [0, 0.5], [0, Math.PI * 2]);
    const gimbalTrack = new THREE.NumberKeyframeTrack('gimbal.rotation[x]', [0, 2, 4], [-Math.PI / 4, Math.PI / 4, -Math.PI / 4]);
    
    const clip = new THREE.AnimationClip('Stabilize', 4, [flywheelTrack, gimbalTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
