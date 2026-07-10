import { getMaterials } from '../utils/materials.js';

export function createProportionalDirectionalControlValve(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const mMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const mSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
    const mIron = materials.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.6 });
    const mCopper = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.4 });

    const bodyGeom = new THREE.BoxGeometry(4, 2, 2);
    const bodyMat = mIron.clone();
    bodyMat.transparent = true;
    bodyMat.opacity = 0.5;
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    group.add(body);

    const spoolGroup = new THREE.Group();
    spoolGroup.name = 'spoolGroup';
    const spoolGeom = new THREE.CylinderGeometry(0.4, 0.4, 5, 16);
    const spool = new THREE.Mesh(spoolGeom, mSteel);
    spool.rotation.z = Math.PI / 2;
    spoolGroup.add(spool);

    for(let i = -1; i <= 1; i++) {
        const landGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16);
        const land = new THREE.Mesh(landGeom, mSteel);
        land.rotation.z = Math.PI / 2;
        land.position.x = i * 1.5;
        spoolGroup.add(land);
    }
    group.add(spoolGroup);

    const solenoidGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const sol1 = new THREE.Mesh(solenoidGeom, mCopper);
    sol1.rotation.z = Math.PI / 2;
    sol1.position.x = -3;
    group.add(sol1);

    const sol2 = new THREE.Mesh(solenoidGeom, mCopper);
    sol2.rotation.z = Math.PI / 2;
    sol2.position.x = 3;
    group.add(sol2);

    const times = [0, 1, 2, 3, 4];
    const values = [0, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0];
    const track = new THREE.VectorKeyframeTrack(`${spoolGroup.name}.position`, times, values);
    
    const clip = new THREE.AnimationClip('SpoolShift', 4, [track]);
    return { group, animationClips: [clip] };
}
