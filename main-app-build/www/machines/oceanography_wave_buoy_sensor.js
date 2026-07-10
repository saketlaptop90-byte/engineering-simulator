import { yellowAccent, orangeAccent, plastic, glass, redAccent, aluminum } from '../utils/materials.js';

export function createWaveBuoySensor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Buoy Body
    const bodyGeo = new THREE.SphereGeometry(2, 32, 32);
    const body = new THREE.Mesh(bodyGeo, yellowAccent);
    group.add(body);

    // Bottom Keel / Counterweight
    const keelGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const keel = new THREE.Mesh(keelGeo, aluminum);
    keel.position.y = -2.5;
    group.add(keel);

    const weightGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const weight = new THREE.Mesh(weightGeo, orangeAccent);
    weight.position.y = -4;
    group.add(weight);

    // Top Tower
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.5, 2);
    const tower = new THREE.Mesh(towerGeo, plastic);
    tower.position.y = 2.5;
    group.add(tower);

    // Solar panels
    for(let i=0; i<4; i++) {
        const panelGeo = new THREE.BoxGeometry(1.5, 1, 0.1);
        const panel = new THREE.Mesh(panelGeo, glass);
        
        const holder = new THREE.Group();
        holder.rotation.y = i * Math.PI / 2;
        
        panel.position.set(0, 2, 1);
        panel.rotation.x = -Math.PI / 4;
        
        holder.add(panel);
        group.add(holder);
    }

    // Beacon Light
    const lightGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const light = new THREE.Mesh(lightGeo, redAccent);
    light.position.y = 3.8;
    group.add(light);

    // Animation (Bobbing and rocking)
    const times = [0, 1.5, 3, 4.5, 6];
    
    // Y Position (bobbing)
    const posValues = [0, 0.5, 0, -0.3, 0];
    const posTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.position[y]`,
        times,
        posValues
    );

    // Rotation (rocking in waves)
    const rotXValues = [0, 0.15, 0, -0.1, 0];
    const rotZValues = [0, -0.1, 0.05, 0.1, 0];
    
    const rotXTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.rotation[x]`,
        times,
        rotXValues
    );
    const rotZTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.rotation[z]`,
        times,
        rotZValues
    );

    const clip = new THREE.AnimationClip('WaveBobbing', 6, [posTrack, rotXTrack, rotZTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
