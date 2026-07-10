import { materials } from '../utils/materials.js';

export function createPumpImpeller(THREE) {
    const group = new THREE.Group();
    group.name = "PumpImpeller";
    
    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    const shaft = new THREE.Mesh(shaftGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    shaft.rotation.x = Math.PI / 2;
    group.add(shaft);
    
    // Impeller Base Plate
    const plateGeo = new THREE.CylinderGeometry(4, 4, 0.2, 64);
    const plate = new THREE.Mesh(plateGeo, materials.bronze || new THREE.MeshStandardMaterial({color: 0xcd7f32}));
    plate.rotation.x = Math.PI / 2;
    group.add(plate);
    
    // Vanes
    const vaneGeo = new THREE.BoxGeometry(0.2, 3, 1.5);
    const numVanes = 6;
    for (let i = 0; i < numVanes; i++) {
        const vane = new THREE.Mesh(vaneGeo, materials.bronze || new THREE.MeshStandardMaterial({color: 0xcd7f32}));
        const angle = (i / numVanes) * Math.PI * 2;
        vane.position.x = Math.cos(angle) * 1.5;
        vane.position.y = Math.sin(angle) * 1.5;
        vane.position.z = 0.85;
        vane.rotation.z = angle + Math.PI / 6;
        plate.add(vane);
    }
    
    // Animations
    const animationClips = [];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI * 2));
    
    const spinTrack = new THREE.QuaternionKeyframeTrack(
        plate.uuid + '.quaternion',
        [0, 0.5, 1],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ]
    );
    
    const clip = new THREE.AnimationClip('ImpellerSpin', 1, [spinTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
