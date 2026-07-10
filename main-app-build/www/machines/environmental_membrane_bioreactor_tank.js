import * as sharedMaterials from '../utils/materials.js';

export function createMembraneBioreactorTank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const concrete = sharedMaterials.concreteMaterial || new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 });
    const water = sharedMaterials.waterMaterial || new THREE.MeshPhysicalMaterial({ color: 0x3388cc, transmission: 0.8, opacity: 0.7, transparent: true, roughness: 0.1 });
    const membrane = sharedMaterials.whitePlastic || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    
    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 0.2), concrete);
    wall1.position.set(0, 1.6, 1.6);
    group.add(wall1);
    
    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 0.2), concrete);
    wall2.position.set(0, 1.6, -1.6);
    group.add(wall2);
    
    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 3.0), concrete);
    wall3.position.set(2.0, 1.6, 0);
    group.add(wall3);
    
    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 3.0), concrete);
    wall4.position.set(-2.0, 1.6, 0);
    group.add(wall4);
    
    const floor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 3.4), concrete);
    floor.position.set(0, 0.1, 0);
    group.add(floor);

    const waterVol = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.6, 3.0), water);
    waterVol.position.set(0, 1.5, 0);
    group.add(waterVol);

    for(let i=0; i<4; i++) {
        const cassette = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 2), membrane);
        cassette.position.set(-1.2 + i*0.8, 1.5, 0);
        group.add(cassette);
    }

    const bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'MBR_Bubbles';
    for(let i=0; i<30; i++) {
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), bubbleMat);
        bubble.position.set((Math.random()-0.5)*3.5, Math.random()*2.5, (Math.random()-0.5)*2.5);
        bubbleGroup.add(bubble);
    }
    group.add(bubbleGroup);
    
    const posTrack = new THREE.VectorKeyframeTrack('MBR_Bubbles.position', [0, 2], [0, 0, 0, 0, 2, 0]);
    animationClips.push(new THREE.AnimationClip('MBR_Aeration', 2.0, [posTrack]));

    return { group, animationClips };
}
