import { darkSteel, wood, blackPlastic, brass } from '../utils/materials.js';

export function createMicrodotCamera(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main body (Dark Steel)
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 32);
    const body = new THREE.Mesh(bodyGeo, darkSteel);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Lens housing (Brass)
    const lensHousingGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32);
    const lensHousing = new THREE.Mesh(lensHousingGeo, brass);
    lensHousing.rotation.z = Math.PI / 2;
    lensHousing.position.x = 0.65;
    group.add(lensHousing);

    // Actual Lens (Black plastic)
    const lensGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
    const lens = new THREE.Mesh(lensGeo, blackPlastic);
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 0.8;
    lens.name = 'cameraLens';
    group.add(lens);

    // Viewfinder
    const viewfinderGeo = new THREE.BoxGeometry(0.4, 0.2, 0.2);
    const viewfinder = new THREE.Mesh(viewfinderGeo, blackPlastic);
    viewfinder.position.set(-0.4, 0.35, 0);
    group.add(viewfinder);

    // Shutter button (Brass)
    const buttonGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 16);
    const button = new THREE.Mesh(buttonGeo, brass);
    button.position.set(0.3, 0.35, 0.15);
    button.name = 'shutterButton';
    group.add(button);
    
    // Film advance lever
    const leverGeo = new THREE.BoxGeometry(0.3, 0.05, 0.1);
    const lever = new THREE.Mesh(leverGeo, darkSteel);
    lever.position.set(0.3, 0.35, -0.15);
    lever.name = 'advanceLever';
    group.add(lever);

    // Animation for shutter press, lens focus, and lever advance
    const times = [0, 0.2, 0.4, 0.8, 1.0];
    
    // Button pressing down
    const buttonTrack = new THREE.NumberKeyframeTrack('shutterButton.position[y]', [0, 0.1, 0.2], [0.35, 0.3, 0.35]);
    
    // Lens focusing in and out slightly
    const lensTrack = new THREE.NumberKeyframeTrack('cameraLens.position[x]', [0, 0.1, 0.2], [0.8, 0.85, 0.8]);
    
    // Lever pulling back and returning
    const leverTrack = new THREE.NumberKeyframeTrack('advanceLever.rotation[y]', [0.3, 0.6, 0.9], [0, Math.PI/4, 0]);
    
    const clip = new THREE.AnimationClip('CameraClickAndAdvance', 1.0, [buttonTrack, lensTrack, leverTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
