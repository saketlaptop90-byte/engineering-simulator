import { materials } from '../utils/materials.js';

export function createSandblastingCabinet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cabinet Base
    const baseGeometry = new THREE.BoxGeometry(4, 2.5, 3);
    const baseMat = materials.metal ? materials.metal : new THREE.MeshStandardMaterial({ color: 0x4a6984 });
    const base = new THREE.Mesh(baseGeometry, baseMat);
    base.position.y = 1.25;
    group.add(base);

    // Cabinet Top (Angled)
    const topGeometry = new THREE.BoxGeometry(4, 2, 3);
    const topMat = materials.metal ? materials.metal : new THREE.MeshStandardMaterial({ color: 0x4a6984 });
    const top = new THREE.Mesh(topGeometry, topMat);
    top.position.y = 3.5;
    top.rotation.x = 0.1;
    group.add(top);

    // Window
    const windowGeometry = new THREE.PlaneGeometry(3, 1);
    const windowMat = materials.glass ? materials.glass : new THREE.MeshPhysicalMaterial({ transmission: 0.9, transparent: true });
    const windowMesh = new THREE.Mesh(windowGeometry, windowMat);
    windowMesh.position.set(0, 0, 1.51); // relative to top
    top.add(windowMesh);

    // Gloves
    const gloveGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8);
    const gloveMat = materials.rubber ? materials.rubber : new THREE.MeshStandardMaterial({ color: 0x111111 });
    const gloveL = new THREE.Mesh(gloveGeometry, gloveMat);
    gloveL.position.set(-0.8, -0.5, 1.5);
    gloveL.rotation.x = Math.PI / 2;
    top.add(gloveL);

    const gloveR = new THREE.Mesh(gloveGeometry, gloveMat);
    gloveR.position.set(0.8, -0.5, 1.5);
    gloveR.rotation.x = Math.PI / 2;
    top.add(gloveR);

    // Nozzle inside
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(0, -0.3, 0);
    
    const nozzleGeom = new THREE.CylinderGeometry(0.05, 0.02, 0.4);
    const nozzleMat = materials.darkMetal ? materials.darkMetal : new THREE.MeshStandardMaterial({ color: 0x222222 });
    const nozzle = new THREE.Mesh(nozzleGeom, nozzleMat);
    nozzle.rotation.x = Math.PI / 4;
    nozzleGroup.add(nozzle);
    top.add(nozzleGroup);

    // Animation: Nozzle moving
    const times = [0, 1, 2, 3, 4];
    const nozzlePositions = [
        0, -0.3, 0,
        -1, -0.5, 0,
        0, -0.1, 0,
        1, -0.5, 0,
        0, -0.3, 0
    ];
    
    const nozzleTrack = new THREE.VectorKeyframeTrack(`${nozzleGroup.uuid}.position`, times, nozzlePositions);
    const clip = new THREE.AnimationClip('Sandblasting', 4, [nozzleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
