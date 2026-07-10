import { titanium, copper } from '../utils/materials.js';

export function createShapeMemoryActuator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Spring (Shape memory alloy)
    const springCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.5, 1, 0),
        new THREE.Vector3(-0.5, 2, 0),
        new THREE.Vector3(0.5, 3, 0),
        new THREE.Vector3(-0.5, 4, 0),
        new THREE.Vector3(0, 5, 0)
    ]);
    const springGeo = new THREE.TubeGeometry(springCurve, 64, 0.2, 8, false);
    
    // Using a clone to animate material color
    const smaMaterial = copper.clone();
    const spring = new THREE.Mesh(springGeo, smaMaterial);
    spring.position.y = 0.25;
    group.add(spring);

    // Animations (stretching and reforming, color changing)
    const times = [0, 2, 4];
    const scales = [1, 1, 1,  1, 1.5, 1,  1, 1, 1]; // y scale change
    const scaleTrack = new THREE.VectorKeyframeTrack(`${spring.name || spring.uuid}.scale`, times, scales);

    // Safe color access fallback just in case
    const initR = copper.color ? copper.color.r : 0.8;
    const initG = copper.color ? copper.color.g : 0.4;
    const initB = copper.color ? copper.color.b : 0.2;

    const colors = [
        initR, initG, initB,
        1, 0, 0, // Heat up to red
        initR, initG, initB
    ];
    const colorTrack = new THREE.ColorKeyframeTrack(`${smaMaterial.name || smaMaterial.uuid}.color`, times, colors);

    // Need proper names for tracks if relying on UUIDs is problematic in some mixers
    spring.name = 'SpringMesh';
    smaMaterial.name = 'SpringMaterial';
    
    const scaleTrackNamed = new THREE.VectorKeyframeTrack(`SpringMesh.scale`, times, scales);
    const colorTrackNamed = new THREE.ColorKeyframeTrack(`SpringMaterial.color`, times, colors);

    const clip = new THREE.AnimationClip('Actuate', 4, [scaleTrackNamed, colorTrackNamed]);
    animationClips.push(clip);

    return { group, animationClips };
}
