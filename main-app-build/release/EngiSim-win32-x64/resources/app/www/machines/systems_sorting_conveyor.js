import { getMaterials } from '../utils/materials.js';

export function createSortingConveyor(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Conveyor base
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, materials.metalFrame || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    group.add(base);

    // Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.25, 0.25, 2);
    const rollers = [];
    for (let i = -4.5; i <= 4.5; i += 1) {
        const roller = new THREE.Mesh(rollerGeo, materials.metalDark || new THREE.MeshStandardMaterial({ color: 0x444444 }));
        roller.rotation.x = Math.PI / 2;
        roller.position.set(i, 0.35, 0);
        group.add(roller);
        rollers.push(roller);
    }

    // Packages
    const packageGeo = new THREE.BoxGeometry(1, 1, 1);
    const box1 = new THREE.Mesh(packageGeo, materials.plasticRed || new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    box1.position.set(-4, 1.1, 0);
    group.add(box1);

    const box2 = new THREE.Mesh(packageGeo, materials.plasticBlue || new THREE.MeshStandardMaterial({ color: 0x0000ff }));
    box2.position.set(-1, 1.1, 0);
    group.add(box2);

    // Sorting Arm
    const armGeo = new THREE.BoxGeometry(0.2, 1, 2);
    const arm = new THREE.Mesh(armGeo, materials.highlightBright || new THREE.MeshStandardMaterial({ color: 0xffff00 }));
    arm.position.set(2, 1, -1);
    group.add(arm);

    // Animations: Packages moving
    const times = [0, 2, 4];
    const valuesBox1 = [-4, 1.1, 0,  2, 1.1, 0,  2, 1.1, 2];
    const trackBox1 = new THREE.VectorKeyframeTrack(`${box1.uuid}.position`, times, valuesBox1);
    
    const valuesBox2 = [-1, 1.1, 0,  5, 1.1, 0,  5, 1.1, 0];
    const trackBox2 = new THREE.VectorKeyframeTrack(`${box2.uuid}.position`, times, valuesBox2);

    // Sorting Arm swinging
    const armTimes = [0, 1.5, 2, 2.5, 4];
    const armValues = [
        0,0,0,1,
        0,0,0,1,
        0, Math.sin(Math.PI/8), 0, Math.cos(Math.PI/8),
        0,0,0,1,
        0,0,0,1
    ];
    const trackArm = new THREE.QuaternionKeyframeTrack(`${arm.uuid}.quaternion`, armTimes, armValues);

    const clip = new THREE.AnimationClip('Sort', 4, [trackBox1, trackBox2, trackArm]);
    animationClips.push(clip);

    return { group, animationClips };
}
