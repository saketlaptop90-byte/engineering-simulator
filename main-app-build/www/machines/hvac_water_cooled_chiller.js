import { materials } from '../utils/materials.js';

export function createWaterCooledChiller(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const matAluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xd0d5db, metalness: 0.7, roughness: 0.3 });
    const matCopper = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });
    const matCastIron = materials.castIron || new THREE.MeshStandardMaterial({ color: 0x434b4d, metalness: 0.6, roughness: 0.5 });
    const matHighlight = materials.highlight || new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff0000, emissiveIntensity: 0.5 });

    // Chiller Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, matSteel);
    base.position.y = 0.25;
    group.add(base);

    // Evaporator (Lower shell)
    const evapGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32);
    const evaporator = new THREE.Mesh(evapGeo, matAluminum);
    evaporator.rotation.z = Math.PI / 2;
    evaporator.position.set(0, 1.2, 0);
    group.add(evaporator);

    // Condenser (Upper shell)
    const condGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.5, 32);
    const condenser = new THREE.Mesh(condGeo, matCopper);
    condenser.rotation.z = Math.PI / 2;
    condenser.position.set(0, 2.5, 0);
    group.add(condenser);

    // Compressor (Centrifugal)
    const compGroup = new THREE.Group();
    const compGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const compressorMain = new THREE.Mesh(compGeo, matCastIron);
    compGroup.add(compressorMain);
    
    // Indicator/Spinning shaft
    const indicatorGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const indicator = new THREE.Mesh(indicatorGeo, matHighlight);
    indicator.rotation.z = Math.PI / 2;
    compGroup.add(indicator);
    
    compGroup.position.set(0, 3.8, 0);
    group.add(compGroup);

    // Pipes connecting them
    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, matSteel);
    pipe1.position.set(1, 1.85, 0);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeo, matSteel);
    pipe2.position.set(-1, 1.85, 0);
    group.add(pipe2);

    const pipe3 = new THREE.Mesh(pipeGeo, matSteel);
    pipe3.position.set(0, 3.15, 0);
    group.add(pipe3);

    // Animations
    const trackName = '.rotation[x]';
    const times = [0, 1];
    const values = [0, Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack(`${indicator.uuid}${trackName}`, times, values);
    const clip = new THREE.AnimationClip('compressor_spin', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
