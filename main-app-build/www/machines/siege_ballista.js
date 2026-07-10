import { wood, iron, steel } from '../utils/materials.js';

export function createBallista(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base stand
    const baseGeo = new THREE.BoxGeometry(4, 4, 6);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 2;
    group.add(base);

    // Slider/Stock
    const stockGeo = new THREE.BoxGeometry(1.5, 1, 12);
    const stock = new THREE.Mesh(stockGeo, wood);
    stock.position.set(0, 4.5, 0);
    group.add(stock);

    // Bow arms
    const bowArmGeo = new THREE.BoxGeometry(6, 0.5, 0.5);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.name = 'leftArmGroup';
    leftArmGroup.position.set(-1, 4.5, 4);
    
    const leftArm = new THREE.Mesh(bowArmGeo, wood);
    leftArm.position.x = -2.5; // offset
    leftArmGroup.add(leftArm);
    group.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.name = 'rightArmGroup';
    rightArmGroup.position.set(1, 4.5, 4);
    
    const rightArm = new THREE.Mesh(bowArmGeo, wood);
    rightArm.position.x = 2.5; // offset
    rightArmGroup.add(rightArm);
    group.add(rightArmGroup);

    // Projectile (bolt)
    const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
    const bolt = new THREE.Mesh(boltGeo, steel);
    bolt.name = 'bolt';
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(0, 5, 2);
    group.add(bolt);

    // Animation: arms pull back and release, bolt shoots forward
    const times = [0, 0.5, 0.6, 2];
    // Left arm rotation y
    const leftArmRot = [Math.PI/6, 0, Math.PI/6, Math.PI/6];
    const leftArmTrack = new THREE.NumberKeyframeTrack('leftArmGroup.rotation[y]', times, leftArmRot);
    
    // Right arm rotation y
    const rightArmRot = [-Math.PI/6, 0, -Math.PI/6, -Math.PI/6];
    const rightArmTrack = new THREE.NumberKeyframeTrack('rightArmGroup.rotation[y]', times, rightArmRot);

    // Bolt position z
    const boltZ = [2, 5, -20, 2];
    const boltTrack = new THREE.NumberKeyframeTrack('bolt.position[z]', times, boltZ);

    const clip = new THREE.AnimationClip('Shoot', 2, [leftArmTrack, rightArmTrack, boltTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
