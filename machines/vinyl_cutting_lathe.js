import { materials } from '../utils/materials.js';

export function createVinylCuttingLathe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(8, 2, 8);
    const baseMesh = new THREE.Mesh(baseGeo, materials.metallic);
    group.add(baseMesh);

    // Platter
    const platterGeo = new THREE.CylinderGeometry(3, 3, 0.2, 64);
    const platterMesh = new THREE.Mesh(platterGeo, materials.darkMetal);
    platterMesh.position.y = 1.1;
    platterMesh.name = "platter";
    group.add(platterMesh);

    // Cutting Head Arm
    const armGeo = new THREE.BoxGeometry(0.4, 0.4, 4);
    const armMesh = new THREE.Mesh(armGeo, materials.iron);
    armMesh.position.set(2, 1.5, 0);
    armMesh.name = "cuttingArm";
    group.add(armMesh);
    
    // Cutting head
    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMesh = new THREE.Mesh(headGeo, materials.plastic);
    headMesh.position.set(0, -0.2, -1.8);
    armMesh.add(headMesh);

    // Animations: Platter rotation and arm tracking
    const times = [0, 5];
    
    // Platter rotates 360 degrees multiple times
    const platterValues = [0, -Math.PI * 2 * 5]; // 5 rotations
    const platterTrack = new THREE.NumberKeyframeTrack('platter.rotation[y]', times, platterValues);

    // Arm moves slowly towards center
    const armValues = [0, -1.5]; // Move inwards
    const armTrack = new THREE.NumberKeyframeTrack('cuttingArm.position[x]', times, armValues);

    const clip = new THREE.AnimationClip('CutVinyl', 5, [platterTrack, armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
