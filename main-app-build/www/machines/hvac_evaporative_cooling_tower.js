import { materials } from '../utils/materials.js';

export function createEvaporativeCoolingTower(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matDarkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 });
    const matPlastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.9 });
    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.4 });

    // Tower Basin
    const basinGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const basin = new THREE.Mesh(basinGeo, matDarkMetal);
    basin.position.y = 0.25;
    group.add(basin);

    // Tower Casing (Fill area)
    const casingGeo = new THREE.BoxGeometry(3.8, 3, 3.8);
    const casing = new THREE.Mesh(casingGeo, matPlastic); 
    casing.position.y = 2;
    group.add(casing);

    // Air Inlet Louvers
    const louverGroup = new THREE.Group();
    const louverGeo = new THREE.BoxGeometry(3.9, 0.1, 0.2);
    for(let i=0; i<10; i++) {
        const louver = new THREE.Mesh(louverGeo, matSteel);
        louver.rotation.x = Math.PI / 4;
        louver.position.set(0, 0.8 + i*0.2, 1.95);
        louverGroup.add(louver);
        
        const louverBack = louver.clone();
        louverBack.position.set(0, 0.8 + i*0.2, -1.95);
        louverGroup.add(louverBack);
        
        const louverSide1 = louver.clone();
        louverSide1.rotation.y = Math.PI / 2;
        louverSide1.position.set(1.95, 0.8 + i*0.2, 0);
        louverGroup.add(louverSide1);
        
        const louverSide2 = louverSide1.clone();
        louverSide2.position.set(-1.95, 0.8 + i*0.2, 0);
        louverGroup.add(louverSide2);
    }
    group.add(louverGroup);

    // Fan Cylinder on top
    const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const cylinder = new THREE.Mesh(cylinderGeo, matSteel);
    cylinder.position.y = 4;
    group.add(cylinder);

    // Large axial fan
    const fanGroup = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const hub = new THREE.Mesh(hubGeo, matSteel);
    fanGroup.add(hub);

    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(1.4, 0.05, 0.3);
        const blade = new THREE.Mesh(bladeGeo, matDarkMetal);
        blade.position.set(0.7, 0, 0);
        blade.rotation.x = Math.PI / 6;
        
        const bladePivot = new THREE.Group();
        bladePivot.rotation.y = (i * Math.PI) / 2;
        bladePivot.add(blade);
        fanGroup.add(bladePivot);
    }
    fanGroup.position.set(0, 4.2, 0);
    group.add(fanGroup);

    // Animations
    const times = [0, 1];
    const values = [0, -Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack(`${fanGroup.uuid}.rotation[y]`, times, values);
    const clip = new THREE.AnimationClip('fan_spin', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
