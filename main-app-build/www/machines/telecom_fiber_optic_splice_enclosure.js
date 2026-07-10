import { materials } from '../utils/materials.js';

export function createFiberOpticSpliceEnclosure(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = (materials && materials.metal) || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const plasticMat = (materials && materials.plastic) || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const pulseMat = (materials && materials.emissiveCyan) || new THREE.MeshStandardMaterial({ emissive: 0x00ffff, emissiveIntensity: 0, color: 0x000000 });

    const baseGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const base = new THREE.Mesh(baseGeo, plasticMat);
    group.add(base);

    const domeGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, plasticMat);
    dome.position.y = 2;
    group.add(dome);

    for(let i=0; i<5; i++) {
        const trayGeo = new THREE.BoxGeometry(1.2, 0.05, 1.2);
        const tray = new THREE.Mesh(trayGeo, metalMat);
        tray.position.y = -1.5 + (i * 0.4);
        group.add(tray);
        
        const fiberGeo = new THREE.TorusGeometry(0.4, 0.02, 8, 24);
        const fiber = new THREE.Mesh(fiberGeo, pulseMat);
        fiber.rotation.x = Math.PI / 2;
        fiber.position.y = tray.position.y + 0.05;
        fiber.name = `fiber_${i}`;
        group.add(fiber);
        
        const times = [0, 0.5, 1.0];
        const values = [0, 1, 0];
        const track = new THREE.NumberKeyframeTrack(`${fiber.name}.material.emissiveIntensity`, times, values);
        const clip = new THREE.AnimationClip(`Pulse_${i}`, 1 + i*0.2, [track]);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
