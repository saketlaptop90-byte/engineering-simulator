import { copper, aluminum, glass, gold } from '../utils/materials.js';

export function createSandBattery(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const siloGeom = new THREE.CylinderGeometry(2, 2, 5, 32);
    const silo = new THREE.Mesh(siloGeom, glass);
    group.add(silo);

    const pipeGroup = new THREE.Group();
    pipeGroup.name = "heat_pipes";
    for(let i=0; i<4; i++) {
        const hPipeGeom = new THREE.CylinderGeometry(0.1, 0.1, 4.8);
        const hPipe = new THREE.Mesh(hPipeGeom, copper);
        hPipe.position.x = Math.cos(i * Math.PI/2);
        hPipe.position.z = Math.sin(i * Math.PI/2);
        pipeGroup.add(hPipe);
    }
    group.add(pipeGroup);

    const sandGeom = new THREE.CylinderGeometry(1.9, 1.9, 4, 32);
    const sand = new THREE.Mesh(sandGeom, gold);
    sand.position.y = -0.4;
    sand.name = "hot_sand";
    group.add(sand);

    const times = [0, 2, 4];
    const scales = [1, 1, 1,  1.02, 1.05, 1.02,  1, 1, 1];
    const track = new THREE.VectorKeyframeTrack('hot_sand.scale', times, scales);
    const clip = new THREE.AnimationClip('heat_pulse', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
