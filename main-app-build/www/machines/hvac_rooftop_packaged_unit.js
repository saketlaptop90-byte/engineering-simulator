import { materials } from '../utils/materials.js';

export function createRooftopPackagedUnit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.5, roughness: 0.5 });
    const matDarkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const matPlastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const matAluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xd0d5db, metalness: 0.7, roughness: 0.3 });

    // Main Cabinet
    const cabinetGeo = new THREE.BoxGeometry(4, 2, 2.5);
    const cabinet = new THREE.Mesh(cabinetGeo, matSteel);
    cabinet.position.y = 1;
    group.add(cabinet);

    // Condenser Fans on top
    const fanGroup1 = new THREE.Group();
    const fanGroup2 = new THREE.Group();

    const fanBladeGeo = new THREE.BoxGeometry(1.2, 0.05, 0.2);
    const fanBlade1 = new THREE.Mesh(fanBladeGeo, matPlastic);
    const fanBlade2 = new THREE.Mesh(fanBladeGeo, matPlastic);
    fanBlade2.rotation.y = Math.PI / 2;
    
    fanGroup1.add(fanBlade1.clone(), fanBlade2.clone());
    fanGroup2.add(fanBlade1.clone(), fanBlade2.clone());

    const fanHousingGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32);
    const fanHousing1 = new THREE.Mesh(fanHousingGeo, matDarkMetal);
    fanHousing1.rotation.x = Math.PI / 2;
    fanHousing1.position.set(-1, 2.1, 0);
    group.add(fanHousing1);
    
    fanGroup1.position.set(-1, 2.1, 0);
    group.add(fanGroup1);

    const fanHousing2 = new THREE.Mesh(fanHousingGeo, matDarkMetal);
    fanHousing2.rotation.x = Math.PI / 2;
    fanHousing2.position.set(1, 2.1, 0);
    group.add(fanHousing2);
    
    fanGroup2.position.set(1, 2.1, 0);
    group.add(fanGroup2);

    // Return and Supply Air Ducts
    const ductGeo = new THREE.BoxGeometry(1, 1, 1);
    const supplyDuct = new THREE.Mesh(ductGeo, matAluminum);
    supplyDuct.position.set(-1.5, 0.5, 1.75);
    group.add(supplyDuct);

    const returnDuct = new THREE.Mesh(ductGeo, matAluminum);
    returnDuct.position.set(1.5, 0.5, 1.75);
    group.add(returnDuct);

    // Animations
    const times = [0, 1];
    const values = [0, -Math.PI * 2]; 
    
    const track1 = new THREE.NumberKeyframeTrack(`${fanGroup1.uuid}.rotation[y]`, times, values);
    const track2 = new THREE.NumberKeyframeTrack(`${fanGroup2.uuid}.rotation[y]`, times, values);
    
    const clip = new THREE.AnimationClip('fan_spin', 1, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
