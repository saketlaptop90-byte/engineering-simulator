import { aluminum, glass, titanium } from '../utils/materials.js';

export function createMicroSurgeryBot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base platform
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Main rotating joint
    const joint1Geo = new THREE.SphereGeometry(0.8, 32, 32);
    const joint1 = new THREE.Mesh(joint1Geo, aluminum);
    joint1.position.y = 0.5;
    joint1.name = 'Joint1';
    group.add(joint1);

    // Lower arm
    const arm1Geo = new THREE.CylinderGeometry(0.3, 0.4, 3, 16);
    const arm1 = new THREE.Mesh(arm1Geo, aluminum);
    arm1.position.y = 1.5;
    joint1.add(arm1);

    // Middle joint
    const joint2Geo = new THREE.SphereGeometry(0.6, 32, 32);
    const joint2 = new THREE.Mesh(joint2Geo, titanium);
    joint2.position.y = 1.5;
    joint2.name = 'Joint2';
    arm1.add(joint2);

    // Upper arm
    const arm2Geo = new THREE.CylinderGeometry(0.2, 0.3, 2.5, 16);
    const arm2 = new THREE.Mesh(arm2Geo, aluminum);
    arm2.position.y = 1.25;
    joint2.add(arm2);

    // Scalpel head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeo, titanium);
    head.position.y = 1.25;
    head.name = 'Head';
    arm2.add(head);

    // Scalpel blade
    const bladeGeo = new THREE.ConeGeometry(0.1, 1, 16);
    const blade = new THREE.Mesh(bladeGeo, glass); // Plasma-like blade
    blade.position.y = 0.75;
    head.add(blade);

    // Animations
    const j1Track = new THREE.NumberKeyframeTrack('Joint1.rotation[y]', [0, 2, 4], [0, Math.PI / 2, 0]);
    const j2Track = new THREE.NumberKeyframeTrack('Joint2.rotation[x]', [0, 1, 2, 3, 4], [0, Math.PI/4, 0, -Math.PI/4, 0]);
    const headTrack = new THREE.NumberKeyframeTrack('Head.rotation[z]', [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], [0, 0.2, -0.2, 0.2, -0.2, 0.2, -0.2, 0.2, 0]);
    
    const cutClip = new THREE.AnimationClip('MicroSurgeryCut', 4, [j1Track, j2Track, headTrack]);
    animationClips.push(cutClip);

    return { group, animationClips };
}
