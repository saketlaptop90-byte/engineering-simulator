import * as materials from '../utils/materials.js';

export function createTachyonCatcher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer frame (hyperboloid shape approx)
    const frameGeo = new THREE.CylinderGeometry(8, 2, 15, 16, 1, true);
    const frameMat = materials.frameMaterial || new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true, transparent: true, opacity: 0.5 });
    const frame1 = new THREE.Mesh(frameGeo, frameMat);
    frame1.position.y = 7.5;
    group.add(frame1);

    const frame2 = new THREE.Mesh(frameGeo, frameMat);
    frame2.rotation.x = Math.PI;
    frame2.position.y = -7.5;
    group.add(frame2);

    // Central capture node
    const nodeGeo = new THREE.OctahedronGeometry(2);
    const nodeMat = materials.captureMaterial || new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xffffff, transmission: 1, roughness: 0 });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    group.add(node);

    // Energy rings
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(3, 0.1, 16, 50);
    const ringMat = materials.energyMaterial || new THREE.MeshBasicMaterial({ color: 0x00ffff });

    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ringGroup.add(ring);
    }
    group.add(ringGroup);

    // Tachyon streaks
    const streakGeo = new THREE.CylinderGeometry(0.05, 0.05, 20);
    const streakMat = materials.streakMaterial || new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const streak1 = new THREE.Mesh(streakGeo, streakMat);
    streak1.rotation.z = Math.PI / 4;
    group.add(streak1);

    const streak2 = new THREE.Mesh(streakGeo, streakMat);
    streak2.rotation.z = -Math.PI / 4;
    group.add(streak2);

    // Animations
    const times = [0, 0.5, 1];
    
    // Streaks flashing (moving fast)
    const streakPosTrack = new THREE.VectorKeyframeTrack('.position[y]', times, [10, 0, -10]);
    const streakClip = new THREE.AnimationClip('StreakFlash', 1, [streakPosTrack]);
    animationClips.push({ mesh: streak1, clip: streakClip });
    animationClips.push({ mesh: streak2, clip: streakClip });

    // Ring fast spin
    const ringRotTrack = new THREE.VectorKeyframeTrack('.rotation[z]', times, [0, Math.PI, Math.PI * 2]);
    const ringClip = new THREE.AnimationClip('RingSpin', 1, [ringRotTrack]);
    animationClips.push({ mesh: ringGroup, clip: ringClip });

    // Node pulse
    const nodeScaleTrack = new THREE.VectorKeyframeTrack('.scale', times, [1, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1]);
    const nodeClip = new THREE.AnimationClip('NodePulse', 1, [nodeScaleTrack]);
    animationClips.push({ mesh: node, clip: nodeClip });

    return { group, animationClips };
}
