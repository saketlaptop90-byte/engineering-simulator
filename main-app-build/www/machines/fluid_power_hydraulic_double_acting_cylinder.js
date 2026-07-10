import { getMaterials } from '../utils/materials.js';

export function createHydraulicDoubleActingCylinder(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const mMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const mSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
    const mBrass = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.3 });
    const mIron = materials.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.6 });

    const bodyGeom = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const bodyMat = mIron.clone();
    bodyMat.transparent = true;
    bodyMat.opacity = 0.4;
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    const rodGroup = new THREE.Group();
    rodGroup.name = 'rodGroup';
    
    const rodGeom = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const rod = new THREE.Mesh(rodGeom, mSteel);
    rod.rotation.z = Math.PI / 2;
    rod.position.x = 2;
    rodGroup.add(rod);

    const pistonGeom = new THREE.CylinderGeometry(1.4, 1.4, 1, 32);
    const piston = new THREE.Mesh(pistonGeom, mBrass);
    piston.rotation.z = Math.PI / 2;
    piston.position.x = -3.5;
    rodGroup.add(piston);

    group.add(rodGroup);

    const times = [0, 2, 4];
    const values = [0, 0, 0, 4, 0, 0, 0, 0, 0];
    const track = new THREE.VectorKeyframeTrack(`${rodGroup.name}.position`, times, values);
    
    const clip = new THREE.AnimationClip('Stroke', 4, [track]);
    return { group, animationClips: [clip] };
}
