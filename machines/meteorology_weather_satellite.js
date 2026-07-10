import { materials } from '../utils/materials.js';

export function createWeatherSatellite(THREE) {
    const group = new THREE.Group();

    // Main body
    const bodyGeo = new THREE.BoxGeometry(2, 2, 4);
    const body = new THREE.Mesh(bodyGeo, materials.metallic);
    group.add(body);

    // Camera lens
    const lensGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.z = 2.25;
    lens.rotation.x = Math.PI / 2;
    group.add(lens);

    // Solar panels
    const panelGroup1 = new THREE.Group();
    const panelGroup2 = new THREE.Group();
    
    panelGroup1.position.x = 1;
    panelGroup2.position.x = -1;
    
    const panelGeo = new THREE.BoxGeometry(5, 0.1, 1.5);
    const panelMat = materials.accent || new THREE.MeshStandardMaterial({ color: 0x1a4a8c, metalness: 0.6, roughness: 0.3 });
    
    const panel1 = new THREE.Mesh(panelGeo, panelMat);
    panel1.position.x = 2.5;
    panelGroup1.add(panel1);

    const panel2 = new THREE.Mesh(panelGeo, panelMat);
    panel2.position.x = -2.5;
    panelGroup2.add(panel2);

    group.add(panelGroup1);
    group.add(panelGroup2);

    // Dish antenna
    const dishGeo = new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dish = new THREE.Mesh(dishGeo, materials.metallic);
    dish.position.y = 1.2;
    dish.rotation.x = -Math.PI / 4;
    group.add(dish);

    // Animations
    const animationClips = [];

    // Satellite bobbing and slow rotation
    const bobTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.position[y]`,
        [0, 4, 8],
        [0, 1, 0]
    );

    const rotTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.rotation[y]`,
        [0, 8, 16],
        [0, Math.PI, Math.PI * 2]
    );

    // Solar panels tilting
    const tiltTrack1 = new THREE.NumberKeyframeTrack(
        `${panelGroup1.uuid}.rotation[x]`,
        [0, 4, 8],
        [-Math.PI/6, Math.PI/6, -Math.PI/6]
    );
    const tiltTrack2 = new THREE.NumberKeyframeTrack(
        `${panelGroup2.uuid}.rotation[x]`,
        [0, 4, 8],
        [-Math.PI/6, Math.PI/6, -Math.PI/6]
    );

    const clip = new THREE.AnimationClip('SatelliteOrbit', 16, [bobTrack, rotTrack, tiltTrack1, tiltTrack2]);
    animationClips.push(clip);

    return { group, animationClips };
}
