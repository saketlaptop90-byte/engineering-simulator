import { materials } from '../utils/materials.js';

export function createRadiosondeBalloon(THREE) {
    const group = new THREE.Group();
    
    // Main balloon assembly, used to oscillate entirely
    const balloonAssembly = new THREE.Group();
    group.add(balloonAssembly);

    // Balloon
    const balloonGeo = new THREE.SphereGeometry(3, 32, 32);
    // gently scale it to look like a weather balloon
    balloonGeo.scale(1, 1.2, 1);
    
    const balloonMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.9,
        roughness: 0.4,
        metalness: 0.1
    });
    const balloon = new THREE.Mesh(balloonGeo, balloonMat);
    balloon.position.y = 10;
    balloonAssembly.add(balloon);

    // String
    const stringGeo = new THREE.CylinderGeometry(0.02, 0.02, 5, 4);
    const string = new THREE.Mesh(stringGeo, materials.metallic);
    string.position.y = 4.5;
    balloonAssembly.add(string);

    // Radiosonde instrument box
    const boxGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const boxMat = materials.accent || new THREE.MeshStandardMaterial({ color: 0xe6e6e6 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 1.4;
    balloonAssembly.add(box);

    // Small antenna
    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 4);
    const ant = new THREE.Mesh(antGeo, materials.metallic);
    ant.position.y = 2.3;
    balloonAssembly.add(ant);

    // Animations
    const animationClips = [];

    // Bobbing
    const bobTrack = new THREE.NumberKeyframeTrack(
        `${balloonAssembly.uuid}.position[y]`,
        [0, 2, 4],
        [0, 0.8, 0]
    );

    // Swaying
    const swayTrackZ = new THREE.NumberKeyframeTrack(
        `${balloonAssembly.uuid}.rotation[z]`,
        [0, 1, 3, 4],
        [0, 0.05, -0.05, 0]
    );

    const swayTrackX = new THREE.NumberKeyframeTrack(
        `${balloonAssembly.uuid}.rotation[x]`,
        [0, 1.5, 3.5, 4],
        [0, 0.03, -0.03, 0]
    );

    const clip = new THREE.AnimationClip('BalloonFlight', 4, [bobTrack, swayTrackZ, swayTrackX]);
    animationClips.push(clip);

    return { group, animationClips };
}
