import { materials } from '../utils/materials.js';

export function createPostTensionedAnchorage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Concrete block
    const concreteGeo = new THREE.BoxGeometry(4, 4, 2);
    const concrete = new THREE.Mesh(concreteGeo, materials.concrete || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    concrete.position.z = -1;
    group.add(concrete);

    // Anchor plate
    const plateGeo = new THREE.BoxGeometry(2.5, 2.5, 0.2);
    const plate = new THREE.Mesh(plateGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x555555 }));
    plate.position.z = 0.1;
    group.add(plate);

    // Wedge head
    const headGeo = new THREE.CylinderGeometry(0.8, 1, 0.5, 32);
    const head = new THREE.Mesh(headGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x666666 }));
    head.rotation.x = Math.PI / 2;
    head.position.z = 0.45;
    group.add(head);

    // Tendons (strands)
    const tendons = new THREE.Group();
    for(let i=0; i<7; i++) {
        const angle = i === 6 ? 0 : (i * Math.PI * 2 / 6);
        const radius = i === 6 ? 0 : 0.4;
        const tendonGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
        const tendon = new THREE.Mesh(tendonGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x444444 }));
        tendon.rotation.x = Math.PI / 2;
        tendon.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 2);
        tendons.add(tendon);
    }
    group.add(tendons);

    // Animation: Tensioning the tendons (pulling outward, stretching)
    const times = [0, 2, 4];
    const values = [2, 2, 2, 2.5, 2.5, 2.5, 2, 2, 2];
    const scaleValues = [1, 1, 1, 1, 1, 1.2, 1, 1, 1];
    
    const posTrack = new THREE.VectorKeyframeTrack(`${tendons.uuid}.position`, times, values);
    const scaleTrack = new THREE.VectorKeyframeTrack(`${tendons.uuid}.scale`, times, scaleValues);
    
    const clip = new THREE.AnimationClip('Tensioning', 4, [posTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
