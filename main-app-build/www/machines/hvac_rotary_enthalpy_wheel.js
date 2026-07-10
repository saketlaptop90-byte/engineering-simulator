import { materials } from '../utils/materials.js';

export function createRotaryEnthalpyWheel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.6, roughness: 0.4 });
    const matAluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xc0c5cb, metalness: 0.5, roughness: 0.5 });
    const matDarkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });

    // Housing
    const housingGeo = new THREE.BoxGeometry(3, 3, 1);
    const housing = new THREE.Mesh(housingGeo, matSteel);
    housing.position.y = 1.5;
    group.add(housing);

    // Central Wheel (Desiccant coated)
    const wheelGroup = new THREE.Group();
    const wheelGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.9, 64);
    const wheel = new THREE.Mesh(wheelGeo, matAluminum);
    wheel.rotation.x = Math.PI / 2;
    wheelGroup.add(wheel);

    // Internal spokes for visual effect
    const spokeGeo = new THREE.BoxGeometry(2.8, 0.9, 0.05);
    for(let i=0; i<6; i++) {
        const spoke = new THREE.Mesh(spokeGeo, matDarkMetal);
        spoke.rotation.y = (i * Math.PI) / 6;
        wheelGroup.add(spoke);
    }
    
    wheelGroup.position.y = 1.5;
    group.add(wheelGroup);

    // Separator plate (Airflow separation)
    const plateGeo = new THREE.BoxGeometry(3.2, 0.1, 1.1);
    const plate = new THREE.Mesh(plateGeo, matSteel);
    plate.position.y = 1.5;
    group.add(plate);

    // Animations - Wheel rotates slowly
    const times = [0, 5];
    const values = [0, -Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack(`${wheelGroup.uuid}.rotation[z]`, times, values);
    const clip = new THREE.AnimationClip('wheel_rotation', 5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
