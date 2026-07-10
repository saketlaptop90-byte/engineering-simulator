import { materials } from '../utils/materials.js';

export function createSmokeFan(THREE) {
    const group = new THREE.Group();
    group.name = "SmokeFan";
    
    // Housing
    const housingGeo = new THREE.TorusGeometry(3, 0.5, 16, 64);
    const housing = new THREE.Mesh(housingGeo, materials.paintedMetal || new THREE.MeshStandardMaterial({color: 0x444444}));
    group.add(housing);
    
    // Fan Rotor Group
    const fanRotor = new THREE.Group();
    
    // Center Hub
    const hubGeo = new THREE.CylinderGeometry(0.8, 1, 1, 32);
    const hub = new THREE.Mesh(hubGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    hub.rotation.x = Math.PI / 2;
    fanRotor.add(hub);
    
    // Fan Blades
    const bladeGeo = new THREE.BoxGeometry(2.5, 0.1, 0.6);
    const numBlades = 8;
    for (let i = 0; i < numBlades; i++) {
        const blade = new THREE.Mesh(bladeGeo, materials.aluminum || new THREE.MeshStandardMaterial({color: 0xdddddd}));
        const angle = (i / numBlades) * Math.PI * 2;
        blade.position.x = Math.cos(angle) * 2;
        blade.position.y = Math.sin(angle) * 2;
        blade.rotation.z = angle;
        blade.rotation.x = Math.PI / 6;
        fanRotor.add(blade);
    }
    
    group.add(fanRotor);
    
    // Animations
    const animationClips = [];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * 2));
    
    const spinTrack = new THREE.QuaternionKeyframeTrack(
        fanRotor.uuid + '.quaternion',
        [0, 0.5, 1],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ]
    );
    
    const clip = new THREE.AnimationClip('FanSpin', 1, [spinTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
