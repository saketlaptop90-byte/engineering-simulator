import { glass, metals } from '../utils/materials.js';

export function createElectrochromicWindow(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Window frame
    const frameGeo = new THREE.BoxGeometry(4.2, 6.2, 0.2);
    const frameMat = metals ? metals.aluminum : new THREE.MeshStandardMaterial({ color: 0x222222 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Glass pane
    const paneGeo = new THREE.BoxGeometry(4, 6, 0.22);
    const paneMat = glass ? glass.smartGlass : new THREE.MeshPhysicalMaterial({ 
        color: 0xeeeeee, 
        transparent: true, 
        opacity: 0.2, 
        transmission: 0.9,
        roughness: 0.1
    });
    const pane = new THREE.Mesh(paneGeo, paneMat);
    pane.name = 'smartPane';
    group.add(pane);

    // Switch/Button on frame
    const buttonGeo = new THREE.BoxGeometry(0.1, 0.4, 0.25);
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.set(2.05, 0, 0);
    button.name = 'switchBtn';
    group.add(button);

    // Animation: Switch toggles, glass transitions from clear to dark blue (tinted)
    const opacityTrack = new THREE.NumberKeyframeTrack(
        'smartPane.material.opacity',
        [0, 1, 2, 3, 4],
        [0.2, 0.8, 0.8, 0.2, 0.2]
    );
    const transmissionTrack = new THREE.NumberKeyframeTrack(
        'smartPane.material.transmission',
        [0, 1, 2, 3, 4],
        [0.9, 0.1, 0.1, 0.9, 0.9]
    );
    const colorTrack = new THREE.ColorKeyframeTrack(
        'smartPane.material.color',
        [0, 1, 2, 3, 4],
        [0.9, 0.9, 0.9,  0.1, 0.1, 0.5,  0.1, 0.1, 0.5,  0.9, 0.9, 0.9,  0.9, 0.9, 0.9]
    );
    const switchColorTrack = new THREE.ColorKeyframeTrack(
        'switchBtn.material.color',
        [0, 0.1, 2, 2.1, 4],
        [1, 0, 0,  0, 1, 0,  0, 1, 0,  1, 0, 0,  1, 0, 0] // Red to Green to Red
    );

    const clip = new THREE.AnimationClip('ToggleTint', 4, [opacityTrack, transmissionTrack, colorTrack, switchColorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
