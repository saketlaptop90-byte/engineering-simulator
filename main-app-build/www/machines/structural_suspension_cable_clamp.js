import { materials } from '../utils/materials.js';

export function createSuspensionCableClamp(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main suspension cable
    const mainCableGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
    const mainCable = new THREE.Mesh(mainCableGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777 }));
    mainCable.rotation.z = Math.PI / 2;
    group.add(mainCable);

    // Clamp body (top and bottom halves)
    const clampGroup = new THREE.Group();
    
    const clampHalfGeo = new THREE.BoxGeometry(1.5, 1.0, 2.5);
    const topClamp = new THREE.Mesh(clampHalfGeo, materials.paintedSteel || new THREE.MeshStandardMaterial({ color: 0xaa3333 }));
    topClamp.position.y = 0.9;
    clampGroup.add(topClamp);

    const bottomClamp = new THREE.Mesh(clampHalfGeo, materials.paintedSteel || new THREE.MeshStandardMaterial({ color: 0xaa3333 }));
    bottomClamp.position.y = -0.9;
    clampGroup.add(bottomClamp);

    // Bolts connecting the clamp halves
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16);
            const bolt = new THREE.Mesh(boltGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            bolt.position.set(0, 0, 0); // relative to clamp body
            bolt.position.x = i * 0.6;
            bolt.position.z = j * 1.0;
            clampGroup.add(bolt);
        }
    }

    group.add(clampGroup);

    // Suspender cable (dropping down)
    const suspenderGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const suspender = new THREE.Mesh(suspenderGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777 }));
    suspender.position.y = -3.4;
    clampGroup.add(suspender);

    // Animation: Vibration and tightening
    const times = [0, 1, 2, 3, 4];
    
    // Clamp slightly moves/vibrates along main cable
    const clampPosValues = [0,0,0, 0.1,0,0, 0,0,0, -0.1,0,0, 0,0,0];
    const clampPosTrack = new THREE.VectorKeyframeTrack(`${clampGroup.uuid}.position`, times, clampPosValues);
    
    // Suspender cable tensioning (stretching)
    const suspenderScaleValues = [1,1,1, 1,1.1,1, 1,1,1, 1,1.05,1, 1,1,1];
    const suspenderScaleTrack = new THREE.VectorKeyframeTrack(`${suspender.uuid}.scale`, times, suspenderScaleValues);

    const clip = new THREE.AnimationClip('CableVibration', 4, [clampPosTrack, suspenderScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
