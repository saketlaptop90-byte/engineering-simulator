import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createMagneticShieldingCan(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer can (mu-metal represented by darkSteel)
    const canGeom = new THREE.CylinderGeometry(2, 2, 5, 32);
    const can = new THREE.Mesh(canGeom, darkSteel);
    can.material = can.material.clone();
    can.material.transparent = true;
    can.material.opacity = 0.8;
    group.add(can);

    // Inner shield
    const innerGeom = new THREE.CylinderGeometry(1.8, 1.8, 4.8, 32);
    const inner = new THREE.Mesh(innerGeom, aluminum);
    inner.material = inner.material.clone();
    inner.material.transparent = true;
    inner.material.opacity = 0.6;
    group.add(inner);

    // Support structure
    const rodGeom = new THREE.CylinderGeometry(0.1, 0.1, 5.5, 8);
    for(let i=0; i<4; i++) {
        const rod = new THREE.Mesh(rodGeom, copper);
        rod.position.set(Math.cos(i * Math.PI/2) * 1.5, 0, Math.sin(i * Math.PI/2) * 1.5);
        group.add(rod);
    }

    // Top cap
    const capGeom = new THREE.CylinderGeometry(2.1, 2.1, 0.2, 32);
    const cap = new THREE.Mesh(capGeom, gold);
    cap.position.y = 2.6;
    group.add(cap);

    // Animation: slow rotation of the shield
    const trackName = group.uuid + '.rotation[y]';
    const times = [0, 5, 10];
    const values = [0, Math.PI, Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Shield_Rotate', 10, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
