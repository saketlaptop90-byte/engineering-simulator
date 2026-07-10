import { glass, titanium, copper } from '../utils/materials.js';

export function createElectrochromicGlass(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const frameGeo = new THREE.BoxGeometry(4.2, 3.2, 0.2);
    const frame = new THREE.Mesh(frameGeo, titanium);
    group.add(frame);

    // Glass panel
    const panelGeo = new THREE.BoxGeometry(4, 3, 0.25);
    const smartGlass = glass.clone();
    smartGlass.name = 'SmartGlassMaterial';
    smartGlass.transparent = true;
    smartGlass.opacity = 0.1;
    if (smartGlass.color) smartGlass.color.setHex(0xaaaaaa);
    const panel = new THREE.Mesh(panelGeo, smartGlass);
    panel.name = 'GlassPanel';
    group.add(panel);

    // Wires
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const wire = new THREE.Mesh(wireGeo, copper);
    wire.position.set(2.2, 0, 0);
    group.add(wire);

    // Animation: Glass darkening and changing opacity
    const times = [0, 1.5, 3];
    const opacities = [0.1, 0.9, 0.1];
    
    const opacityTrack = new THREE.NumberKeyframeTrack(`SmartGlassMaterial.opacity`, times, opacities);
    
    const colors = [
        0.66, 0.66, 0.66,
        0.1, 0.1, 0.2, // Darkens
        0.66, 0.66, 0.66
    ];
    const colorTrack = new THREE.ColorKeyframeTrack(`SmartGlassMaterial.color`, times, colors);

    const clip = new THREE.AnimationClip('ToggleTint', 3, [opacityTrack, colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
