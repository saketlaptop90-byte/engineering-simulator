import { wood, iron, steel } from '../utils/materials.js';

export function createTrebuchet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(10, 1, 20);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 0.5;
    group.add(base);

    // Uprights
    const uprightGeo = new THREE.BoxGeometry(1, 15, 1);
    const leftUpright = new THREE.Mesh(uprightGeo, wood);
    leftUpright.position.set(-2.5, 8, 0);
    group.add(leftUpright);

    const rightUpright = new THREE.Mesh(uprightGeo, wood);
    rightUpright.position.set(2.5, 8, 0);
    group.add(rightUpright);

    // Axle
    const axleGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const axle = new THREE.Mesh(axleGeo, iron);
    axle.rotation.z = Math.PI / 2;
    axle.position.y = 15;
    group.add(axle);

    // Throwing Arm (pivot around axle)
    const armGroup = new THREE.Group();
    armGroup.name = 'armGroup';
    armGroup.position.y = 15;
    
    const armGeo = new THREE.BoxGeometry(0.8, 20, 0.8);
    // Move the geometry so the pivot is off-center (counterweight is heavy/short, sling is long)
    armGeo.translate(0, 5, 0); 
    const arm = new THREE.Mesh(armGeo, wood);
    armGroup.add(arm);

    // Counterweight
    const cwGeo = new THREE.BoxGeometry(3, 4, 3);
    const counterweight = new THREE.Mesh(cwGeo, iron);
    counterweight.position.y = -4;
    armGroup.add(counterweight);

    // Sling (simplified as a small bucket or box at the end of the arm)
    const slingGeo = new THREE.BoxGeometry(1, 0.5, 1);
    const sling = new THREE.Mesh(slingGeo, steel);
    sling.position.y = 14;
    armGroup.add(sling);

    group.add(armGroup);

    // Animation
    // Counterweight drops, throwing arm swings
    const times = [0, 1, 2];
    const values = [
        Math.PI / 4, // Starting pulled back
        -Math.PI / 2, // Thrown
        Math.PI / 4 // Reset
    ];
    
    // Rotate armGroup around X axis
    const armTrack = new THREE.NumberKeyframeTrack('armGroup.rotation[x]', times, values);
    const clip = new THREE.AnimationClip('Fire', 2, [armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
