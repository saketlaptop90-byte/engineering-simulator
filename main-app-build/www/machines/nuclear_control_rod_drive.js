import * as sharedMaterials from '../utils/materials.js';

export function createControlRodDrive(THREE) {
    const group = new THREE.Group();
    
    // Materials with fallback
    const steel = sharedMaterials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const blueMetal = sharedMaterials.blueMetal || new THREE.MeshStandardMaterial({ color: 0x224488, metalness: 0.7, roughness: 0.3 });
    const rodMat = sharedMaterials.rod || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
    
    // Base casing
    const casingGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const casing = new THREE.Mesh(casingGeo, steel);
    group.add(casing);
    
    // Top motor housing
    const motorGeo = new THREE.CylinderGeometry(2.5, 2.5, 4, 32);
    const motor = new THREE.Mesh(motorGeo, blueMetal);
    motor.position.y = 7;
    group.add(motor);
    
    // Control Rods cluster
    const rods = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 12, 16);
    
    const positions = [
        [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]
    ];
    
    positions.forEach(pos => {
        const rod = new THREE.Mesh(rodGeo, rodMat);
        rod.position.set(pos[0], -6, pos[1]);
        rods.add(rod);
    });
    group.add(rods);
    
    // Animations: Control rods inserting and withdrawing
    const times = [0, 2, 4];
    const values = [0, -5, 0];
    const trackName = rods.uuid + '.position[y]';
    const positionTrack = new THREE.NumberKeyframeTrack(trackName, times, values);
    
    const clip = new THREE.AnimationClip('InsertRods', 4, [positionTrack]);
    
    return { group, animationClips: [clip] };
}
