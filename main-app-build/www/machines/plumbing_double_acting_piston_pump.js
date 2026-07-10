import { copper, brass, iron, steel, rubber } from '../utils/materials.js';

export function createDoubleActingPistonPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cylinder body (cutaway)
    const cylinderGeo = new THREE.CylinderGeometry(2, 2, 6, 32, 1, false, 0, Math.PI * 1.5);
    const cylinder = new THREE.Mesh(cylinderGeo, iron);
    cylinder.rotation.z = Math.PI / 2;
    group.add(cylinder);

    // Piston and Rod
    const pistonSystem = new THREE.Group();
    pistonSystem.name = 'PistonSystem';
    
    const pistonGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 32);
    const piston = new THREE.Mesh(pistonGeo, rubber);
    piston.rotation.z = Math.PI / 2;
    pistonSystem.add(piston);

    const rodGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.rotation.z = Math.PI / 2;
    rod.position.x = 4;
    pistonSystem.add(rod);
    
    group.add(pistonSystem);

    // Animation: Piston moving left and right
    const times = [0, 1, 2];
    const positionValues = [
        -2, 0, 0,
         2, 0, 0,
        -2, 0, 0
    ];
    
    const track = new THREE.VectorKeyframeTrack('PistonSystem.position', times, positionValues);
    const clip = new THREE.AnimationClip('Pump', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
