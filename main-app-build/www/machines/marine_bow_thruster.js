import * as importedMaterials from '../utils/materials.js';
const materials = importedMaterials.default || importedMaterials;

export function createBowThruster(THREE) {
    const group = new THREE.Group();
    group.name = 'BowThruster';
    
    const fallbackMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const fallbackBronze = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.9, roughness: 0.2 });
    const fallbackDark = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 });
    
    const metalMat = materials?.metal || fallbackMetal;
    const bronzeMat = materials?.bronze || fallbackBronze;
    const darkMat = materials?.darkMetal || fallbackDark;

    const tunnelGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32, 1, true);
    const tunnelMat = darkMat.clone();
    tunnelMat.side = THREE.DoubleSide;
    const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
    tunnel.rotation.z = Math.PI / 2;
    group.add(tunnel);

    const housingGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    const housing = new THREE.Mesh(housingGeo, metalMat);
    housing.position.y = 1;
    group.add(housing);

    const gearGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const gearbox = new THREE.Mesh(gearGeo, metalMat);
    group.add(gearbox);

    const prop1 = new THREE.Group();
    prop1.name = 'prop1';
    prop1.position.x = 0.7;
    group.add(prop1);

    const prop2 = new THREE.Group();
    prop2.name = 'prop2';
    prop2.position.x = -0.7;
    group.add(prop2);

    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const hub1 = new THREE.Mesh(hubGeo, bronzeMat);
    hub1.rotation.z = Math.PI / 2;
    prop1.add(hub1);

    const hub2 = new THREE.Mesh(hubGeo, bronzeMat);
    hub2.rotation.z = Math.PI / 2;
    prop2.add(hub2);

    const bladeGeo = new THREE.BoxGeometry(0.05, 1.3, 0.3);
    for (let i = 0; i < 4; i++) {
        const p1 = new THREE.Group();
        p1.rotation.x = (Math.PI / 2) * i;
        const b1 = new THREE.Mesh(bladeGeo, bronzeMat);
        b1.position.y = 0.65;
        b1.rotation.y = Math.PI / 6;
        p1.add(b1);
        prop1.add(p1);

        const p2 = new THREE.Group();
        p2.rotation.x = (Math.PI / 2) * i;
        const b2 = new THREE.Mesh(bladeGeo, bronzeMat);
        b2.position.y = 0.65;
        b2.rotation.y = -Math.PI / 6;
        p2.add(b2);
        prop2.add(p2);
    }

    const duration = 1;
    const times = [];
    const values1 = [];
    const values2 = [];

    for (let i = 0; i <= 30; i++) {
        const t = (i / 30) * duration;
        times.push(t);
        values1.push(t * Math.PI * 2);
        values2.push(-t * Math.PI * 2);
    }

    const prop1Track = new THREE.NumberKeyframeTrack('prop1.rotation[x]', times, values1);
    const prop2Track = new THREE.NumberKeyframeTrack('prop2.rotation[x]', times, values2);

    const animationClips = [
        new THREE.AnimationClip('Thrust', duration, [prop1Track, prop2Track])
    ];

    return { group, animationClips };
}

// Auto-generated missing stub
export function createShipBowThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
