import * as sharedMaterials from '../utils/materials.js';

export function createMassSpectrometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const caseMat = sharedMaterials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });
    const darkMat = sharedMaterials.darkMetalMaterial || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const screenMat = sharedMaterials.screenMaterial || new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(3, 2, 2);
    const body = new THREE.Mesh(bodyGeo, caseMat);
    body.position.set(0, 1, 0);
    group.add(body);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(0.8, 0.6);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0.5, 1.2, 1.01);
    group.add(screen);

    // Sample Tray
    const trayGroup = new THREE.Group();
    trayGroup.name = "SampleTray";
    trayGroup.position.set(-0.8, 0.5, 1);
    
    const trayGeo = new THREE.BoxGeometry(0.6, 0.1, 0.8);
    const tray = new THREE.Mesh(trayGeo, darkMat);
    trayGroup.add(tray);
    group.add(trayGroup);

    // Tray Animation
    const times = [0, 1, 4, 5, 6];
    const values = [
        -0.8, 0.5, 1.4, // Out
        -0.8, 0.5, 0.6, // In
        -0.8, 0.5, 0.6, // In
        -0.8, 0.5, 1.4, // Out
        -0.8, 0.5, 1.4  // Out
    ];
    const trayTrack = new THREE.VectorKeyframeTrack('SampleTray.position', times, values);

    const clip = new THREE.AnimationClip('MassSpecAnalyze', 6, [trayTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
