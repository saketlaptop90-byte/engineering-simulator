import * as matModule from '../utils/materials.js';

export function createScreenPrinter(THREE) {
    const materials = matModule.materials || matModule.default || matModule;
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = (materials && materials.steel) || new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5 });
    const screenMat = (materials && materials.fabric) || new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const squeegeeMat = (materials && materials.rubber) || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const substrateMat = (materials && materials.plastic) || new THREE.MeshStandardMaterial({ color: 0xcccccc });

    const bed = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), frameMat);
    bed.position.set(0, -0.1, 0);
    group.add(bed);

    const substrate = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 2), substrateMat);
    substrate.position.set(0, 0.025, 0);
    group.add(substrate);

    const screenAssembly = new THREE.Group();
    screenAssembly.name = 'screenAssembly';
    screenAssembly.position.set(0, 1.0, 0); // Start raised
    
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 3), frameMat);
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), screenMat);
    screenMesh.rotation.x = -Math.PI / 2;
    screenMesh.position.y = 0.051;
    
    screenAssembly.add(screenFrame);
    screenAssembly.add(screenMesh);
    group.add(screenAssembly);

    const squeegee = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 0.1), squeegeeMat);
    squeegee.position.set(0, 0.3, -1);
    squeegee.name = 'squeegee';
    screenAssembly.add(squeegee);

    const times = [0, 1, 2, 3, 4];
    const screenPosTrack = new THREE.VectorKeyframeTrack('screenAssembly.position', times, [
        0, 1.0, 0,
        0, 0.1, 0,
        0, 0.1, 0,
        0, 1.0, 0,
        0, 1.0, 0
    ]);

    const squeegeeTrack = new THREE.VectorKeyframeTrack('squeegee.position', times, [
        0, 0.3, -1,
        0, 0.3, -1,
        0, 0.3, 1,
        0, 0.3, -1,
        0, 0.3, -1
    ]);

    const clip = new THREE.AnimationClip('ScreenPrintCycle', 4, [screenPosTrack, squeegeeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
