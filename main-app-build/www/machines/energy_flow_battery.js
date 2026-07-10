import { copper, aluminum, glass, gold } from '../utils/materials.js';

export function createFlowBattery(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const tankGeom = new THREE.CylinderGeometry(1, 1, 3, 16);
    
    const tank1 = new THREE.Mesh(tankGeom, glass);
    tank1.position.set(-1.5, 0, 0);
    group.add(tank1);

    const tank2 = new THREE.Mesh(tankGeom, glass);
    tank2.position.set(1.5, 0, 0);
    group.add(tank2);

    const cellGeom = new THREE.BoxGeometry(1, 2, 1);
    const cell = new THREE.Mesh(cellGeom, aluminum);
    group.add(cell);

    const pipeGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const pipe1 = new THREE.Mesh(pipeGeom, copper);
    pipe1.position.set(-0.75, 0.5, 0);
    pipe1.rotation.z = Math.PI / 2;
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeom, copper);
    pipe2.position.set(0.75, -0.5, 0);
    pipe2.rotation.z = Math.PI / 2;
    group.add(pipe2);

    const fluidGeom = new THREE.CylinderGeometry(0.9, 0.9, 1, 16);
    const fluid1 = new THREE.Mesh(fluidGeom, gold);
    fluid1.position.set(-1.5, -1, 0);
    fluid1.name = "fluid1";
    group.add(fluid1);

    const fluid2 = new THREE.Mesh(fluidGeom, gold);
    fluid2.position.set(1.5, 0, 0);
    fluid2.name = "fluid2";
    group.add(fluid2);

    const times = [0, 2, 4];
    const pos1 = [-1.5, -1, 0,  -1.5, 0, 0,  -1.5, -1, 0];
    const pos2 = [1.5, 0, 0,   1.5, -1, 0,  1.5, 0, 0];
    
    const track1 = new THREE.VectorKeyframeTrack('fluid1.position', times, pos1);
    const track2 = new THREE.VectorKeyframeTrack('fluid2.position', times, pos2);
    const clip = new THREE.AnimationClip('fluid_flow', 4, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
