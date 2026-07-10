import { darkSteel, wood, blackPlastic, brass } from '../utils/materials.js';

export function createPoisonUmbrella(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Handle (Wood)
    const handleGeo = new THREE.TorusGeometry(0.25, 0.06, 16, 32, Math.PI);
    const handle = new THREE.Mesh(handleGeo, wood);
    handle.position.set(0.25, -2.0, 0);
    group.add(handle);

    // Shaft (Dark steel)
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.0, 16);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    group.add(shaft);

    // Canopy folded (Black plastic)
    const canopyGeo = new THREE.ConeGeometry(0.3, 3.0, 32);
    const canopy = new THREE.Mesh(canopyGeo, blackPlastic);
    canopy.position.y = 0.5;
    group.add(canopy);

    // Hidden compartment tip (Brass)
    const tipGeo = new THREE.CylinderGeometry(0.05, 0.02, 0.2, 16);
    const tip = new THREE.Mesh(tipGeo, brass);
    tip.position.y = 2.1;
    tip.name = 'umbrellaTip';
    group.add(tip);

    // Dart (Dark Steel)
    const dartGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.3, 8);
    const dart = new THREE.Mesh(dartGeo, darkSteel);
    dart.position.y = 2.0;
    dart.name = 'poisonDart';
    group.add(dart);

    // Trigger on handle
    const triggerGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const trigger = new THREE.Mesh(triggerGeo, brass);
    trigger.position.set(0.04, -1.8, 0);
    trigger.name = 'umbrellaTrigger';
    group.add(trigger);

    // Animation: tip opens, dart fires
    const times = [0, 0.2, 0.4, 0.6, 0.8];
    
    // Tip shifting to the side to reveal dart
    const tipTrack = new THREE.NumberKeyframeTrack('umbrellaTip.position[x]', [0, 0.2, 0.8], [0, 0.1, 0]);
    const tipRotTrack = new THREE.NumberKeyframeTrack('umbrellaTip.rotation[z]', [0, 0.2, 0.8], [0, -Math.PI/4, 0]);
    
    // Trigger pressing
    const triggerTrack = new THREE.NumberKeyframeTrack('umbrellaTrigger.position[x]', [0.1, 0.2, 0.3], [0.04, 0.02, 0.04]);
    
    // Dart firing rapidly
    const dartTrack = new THREE.NumberKeyframeTrack('poisonDart.position[y]', [0.2, 0.3, 0.8], [2.0, 10.0, 2.0]);
    
    const clip = new THREE.AnimationClip('FirePoisonDart', 0.8, [tipTrack, tipRotTrack, triggerTrack, dartTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
