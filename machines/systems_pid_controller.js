import { getMaterials } from '../utils/materials.js';

export function createPIDController(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(3, 2, 1);
    const body = new THREE.Mesh(bodyGeo, materials.plasticGrey || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    group.add(body);

    // Display Screen
    const screenGeo = new THREE.PlaneGeometry(2, 0.8);
    const screenMat = materials.screenGlow || new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.3, 0.51);
    group.add(screen);

    // Dials (P, I, D)
    const dialGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2);
    const dials = [];
    for (let i = -1; i <= 1; i += 1) {
        const dial = new THREE.Mesh(dialGeo, materials.metalDark || new THREE.MeshStandardMaterial({ color: 0x222222 }));
        dial.rotation.x = Math.PI / 2;
        dial.position.set(i, -0.5, 0.5);
        group.add(dial);
        dials.push(dial);
    }

    // Indicator Needle
    const needleGeo = new THREE.BoxGeometry(0.05, 0.6, 0.05);
    const needle = new THREE.Mesh(needleGeo, materials.highlightBright || new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    needle.position.set(0, 0.3, 0.52);
    group.add(needle);

    // Animations: Needle fluctuating to stabilize, Dials turning
    const times = [0, 1, 2, 3, 4];
    
    // Needle rotation (z-axis)
    const needleRotations = [
        0,0,Math.sin(Math.PI/4),Math.cos(Math.PI/4),
        0,0,Math.sin(-Math.PI/6),Math.cos(-Math.PI/6),
        0,0,Math.sin(Math.PI/12),Math.cos(Math.PI/12),
        0,0,Math.sin(-Math.PI/24),Math.cos(-Math.PI/24),
        0,0,0,1
    ];
    const trackNeedle = new THREE.QuaternionKeyframeTrack(`${needle.uuid}.quaternion`, times, needleRotations);

    // Dials rotating
    const dial1Rotations = [0,0,0,1, 0.5,0,0,0.866, 0.5,0,0,0.866, 0.5,0,0,0.866, 0.5,0,0,0.866];
    const trackDial1 = new THREE.QuaternionKeyframeTrack(`${dials[0].uuid}.quaternion`, times, dial1Rotations);

    const clip = new THREE.AnimationClip('PID_Control', 4, [trackNeedle, trackDial1]);
    animationClips.push(clip);

    return { group, animationClips };
}
