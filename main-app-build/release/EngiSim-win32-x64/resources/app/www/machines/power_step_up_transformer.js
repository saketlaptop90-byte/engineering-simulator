import { 
  metalMaterial, 
  darkMetalMaterial, 
  copperMaterial, 
  insulatorMaterial, 
  casingMaterial, 
  highlightMaterial 
} from '../utils/materials.js';

export function createStepUpTransformer(THREE) {
    const group = new THREE.Group();
    group.name = "StepUpTransformer";

    const animationClips = [];

    // Main Tank
    const tankGeom = new THREE.BoxGeometry(4, 3, 2);
    const tank = new THREE.Mesh(tankGeom, darkMetalMaterial);
    tank.position.y = 1.5;
    group.add(tank);

    // Cooling Fins (Radiators)
    const finGeom = new THREE.BoxGeometry(0.1, 2.5, 1.5);
    for(let i = 0; i < 6; i++) {
        const finL = new THREE.Mesh(finGeom, darkMetalMaterial);
        finL.position.set(-2.1, 1.5, -0.75 + i * 0.3);
        group.add(finL);

        const finR = new THREE.Mesh(finGeom, darkMetalMaterial);
        finR.position.set(2.1, 1.5, -0.75 + i * 0.3);
        group.add(finR);
    }

    // High Voltage Bushings
    const bushingGeom = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 16);
    for(let i = -1; i <= 1; i++) {
        const bushing = new THREE.Mesh(bushingGeom, insulatorMaterial);
        bushing.position.set(i * 1.2, 3.75, -0.4);
        group.add(bushing);
        
        const terminalGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const terminal = new THREE.Mesh(terminalGeom, copperMaterial);
        terminal.position.set(0, 0.8, 0);
        bushing.add(terminal);
    }

    // Low Voltage Bushings
    const lvBushingGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16);
    for(let i = -1; i <= 1; i++) {
        const bushing = new THREE.Mesh(lvBushingGeom, insulatorMaterial);
        bushing.position.set(i * 1.2, 3.4, 0.5);
        group.add(bushing);
    }

    // Animation: Vibration (Humming)
    const times = [0, 0.05, 0.1, 0.15, 0.2];
    const values = [
        1.5,
        1.51,
        1.5,
        1.49,
        1.5
    ];
    tank.name = "TransformerTank";
    const trackName = `${tank.name}.position[y]`;
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('HumVibration', 0.2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
