import { materials } from '../utils/materials.js';

export function createVRFOutdoorUnit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xefefef, metalness: 0.3, roughness: 0.7 });
    const matDarkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const matPlastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8 });
    const matCopper = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(1.5, 2.5, 1);
    const chassis = new THREE.Mesh(chassisGeo, matSteel);
    chassis.position.y = 1.25;
    group.add(chassis);

    // Front Grille
    const grilleGeo = new THREE.BoxGeometry(1.3, 1.8, 0.05);
    const grille = new THREE.Mesh(grilleGeo, matDarkMetal);
    grille.position.set(0, 1.4, 0.51);
    group.add(grille);

    // Fan behind grille
    const fanGroup = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const hub = new THREE.Mesh(hubGeo, matSteel);
    hub.rotation.x = Math.PI / 2;
    fanGroup.add(hub);

    for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.5, 0.05, 0.2);
        const blade = new THREE.Mesh(bladeGeo, matPlastic);
        blade.position.set(0.3, 0, 0);
        
        const bladePivot = new THREE.Group();
        bladePivot.rotation.z = (i * Math.PI * 2) / 3;
        bladePivot.add(blade);
        fanGroup.add(bladePivot);
    }
    fanGroup.position.set(0, 1.4, 0.45);
    group.add(fanGroup);

    // Side Piping Connections
    const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, matCopper);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(0.85, 0.5, 0.2);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeo, matCopper);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(0.85, 0.3, 0.2);
    group.add(pipe2);

    // Animations
    const times = [0, 0.5];
    const values = [0, -Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack(`${fanGroup.uuid}.rotation[z]`, times, values);
    const clip = new THREE.AnimationClip('fan_spin', 0.5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
