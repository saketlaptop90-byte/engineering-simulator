import { materials } from '../utils/materials.js';

export function createDarkSideObservatory(THREE) {
    const group = new THREE.Group();
    group.name = 'DarkSideObservatory';
    const animationClips = [];

    // Lunar surface base
    const baseGeo = new THREE.CylinderGeometry(8, 9, 1, 32);
    const baseMat = materials?.lunarDust || new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    group.add(base);

    // Large radio antenna arrays (for Askaryan effect)
    const antennas = new THREE.Group();
    antennas.name = 'AntennaArray';
    
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const poleMat = materials?.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    
    const dishGeo = new THREE.ConeGeometry(1, 0.5, 16, 1, true);
    
    for(let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const antenna = new THREE.Group();
        antenna.position.set(Math.cos(angle)*5, 2, Math.sin(angle)*5);
        
        const pole = new THREE.Mesh(poleGeo, poleMat);
        antenna.add(pole);
        
        const dish = new THREE.Mesh(dishGeo, poleMat);
        dish.position.y = 2;
        dish.rotation.x = Math.PI / 2;
        dish.name = `Dish_${i}`;
        antenna.add(dish);
        
        antennas.add(antenna);
    }
    group.add(antennas);

    // Central Processing Hub
    const hubGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const hubMat = materials?.goldFoil || new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.3 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    group.add(hub);

    // Animation: Dishes scanning the regolith (rotating up and down)
    const tracks = [];
    for(let i = 0; i < 6; i++) {
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2 + 0.5);
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2 - 0.5);
        
        const track = new THREE.QuaternionKeyframeTrack(
            `Dish_${i}.quaternion`,
            [0, 2, 4, 6],
            [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w, q1.x, q1.y, q1.z, q1.w]
        );
        tracks.push(track);
    }
    
    const clip = new THREE.AnimationClip('AntennaScan', 6, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
