import { materials } from '../utils/materials.js';

export function createRibbonTweeterMotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Magnets
    const magnetGeo = new THREE.BoxGeometry(1, 4, 1);
    
    const magnetLeft = new THREE.Mesh(magnetGeo, materials.magnetic);
    magnetLeft.position.set(-1, 2, 0);
    group.add(magnetLeft);
    
    const magnetRight = new THREE.Mesh(magnetGeo, materials.magnetic);
    magnetRight.position.set(1, 2, 0);
    group.add(magnetRight);

    // Ribbon
    const ribbonGeo = new THREE.PlaneGeometry(0.8, 3.8, 10, 20);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, materials.aluminum);
    ribbonMesh.position.set(0, 2, 0);
    ribbonMesh.name = "ribbon";
    group.add(ribbonMesh);

    // Animation: High frequency vibration of the ribbon
    const times = [];
    const values = [];
    
    for (let i = 0; i <= 30; i++) {
        const t = i / 15; // 2 seconds
        times.push(t);
        // high frequency vibration
        values.push(Math.sin(t * Math.PI * 40) * 0.02);
    }

    const ribbonTrack = new THREE.NumberKeyframeTrack('ribbon.position[z]', times, values);

    const clip = new THREE.AnimationClip('RibbonVibrate', 2, [ribbonTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
