import { steel, castIron, darkSteel, tinted, ceramic } from '../utils/materials.js';

export function createSuspensionAnchorage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Concrete Base
    const concreteMaterial = tinted(ceramic, 0x888888);
    const baseGeom = new THREE.BoxGeometry(20, 10, 30);
    const base = new THREE.Mesh(baseGeom, concreteMaterial);
    base.position.y = 5;
    group.add(base);

    // Anchor Block
    const blockGeom = new THREE.BoxGeometry(15, 15, 10);
    const block = new THREE.Mesh(blockGeom, concreteMaterial);
    block.position.set(0, 17.5, -10);
    group.add(block);

    // Main Cable
    const cableGeom = new THREE.CylinderGeometry(1.5, 1.5, 30, 16);
    const mainCable = new THREE.Mesh(cableGeom, steel);
    mainCable.rotation.x = Math.PI / 4;
    mainCable.position.set(0, 25, 5);
    group.add(mainCable);

    // Splay Saddle
    const saddleGeom = new THREE.CylinderGeometry(2, 2, 6, 32);
    const saddle = new THREE.Mesh(saddleGeom, castIron);
    saddle.rotation.z = Math.PI / 2;
    saddle.position.set(0, 19, -5);
    group.add(saddle);

    // Strand Shoes and Tie Rods
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(0, 17, -9);
    for (let i = 0; i < 5; i++) {
        const shoeGeom = new THREE.BoxGeometry(0.5, 2, 1);
        const shoe = new THREE.Mesh(shoeGeom, darkSteel);
        shoe.position.set(-4 + i * 2, 0, 0);
        
        const rodGeom = new THREE.CylinderGeometry(0.1, 0.1, 8);
        const rod = new THREE.Mesh(rodGeom, steel);
        rod.rotation.x = Math.PI / 4;
        rod.position.set(-4 + i * 2, 3, 3);
        
        shoeGroup.add(shoe);
        shoeGroup.add(rod);
    }
    group.add(shoeGroup);

    // Animation: Cable tensioning (slight scale change and vibration)
    const times = [0, 1, 2];
    const scaleValues = [
        1, 1, 1,
        1, 1.02, 1,
        1, 1, 1
    ];
    const cableTrack = new THREE.VectorKeyframeTrack(`${mainCable.uuid}.scale`, times, scaleValues);
    
    const posValues = [
        0, 17, -9,
        0, 17.1, -8.9,
        0, 17, -9
    ];
    const shoeTrack = new THREE.VectorKeyframeTrack(`${shoeGroup.uuid}.position`, times, posValues);

    const clip = new THREE.AnimationClip('Tensioning', 2, [cableTrack, shoeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
