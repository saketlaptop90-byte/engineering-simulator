import { aluminum, glass, titanium } from '../utils/materials.js';

export function createOrganRegenTank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tank Base
    const baseGeo = new THREE.CylinderGeometry(2, 2.5, 1, 32);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Glass Cylinder
    const tankGeo = new THREE.CylinderGeometry(1.8, 1.8, 5, 32);
    const tank = new THREE.Mesh(tankGeo, glass);
    tank.position.y = 3;
    group.add(tank);

    // Tank Top
    const topGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const top = new THREE.Mesh(topGeo, aluminum);
    top.position.y = 5.75;
    group.add(top);

    // Central core (organ stand)
    const coreGeo = new THREE.CylinderGeometry(0.2, 0.5, 1, 16);
    const core = new THREE.Mesh(coreGeo, titanium);
    core.position.y = 1;
    group.add(core);

    // The Regenerating Organ (abstract representation)
    const organGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const organ = new THREE.Mesh(organGeo, glass); // Using glass to represent translucent organic material
    organ.position.y = 2.5;
    organ.name = 'RegeneratingOrgan';
    group.add(organ);

    // Nutrient tubes
    for(let i=0; i<4; i++) {
        const tubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
        const tube = new THREE.Mesh(tubeGeo, aluminum);
        tube.position.set(
            1.5 * Math.cos(i * Math.PI / 2),
            3,
            1.5 * Math.sin(i * Math.PI / 2)
        );
        group.add(tube);
    }

    // Light inside the tank
    const regenLight = new THREE.PointLight(0x00ff00, 2, 10);
    regenLight.position.y = 3;
    regenLight.name = 'RegenLight';
    group.add(regenLight);

    // Animation: Organ pulsating, floating, and regenerating light
    const scaleTrack = new THREE.NumberKeyframeTrack('RegeneratingOrgan.scale[x]', [0, 1, 2], [1, 1.15, 1]);
    const scaleTrackY = new THREE.NumberKeyframeTrack('RegeneratingOrgan.scale[y]', [0, 1, 2], [1, 1.1, 1]);
    const scaleTrackZ = new THREE.NumberKeyframeTrack('RegeneratingOrgan.scale[z]', [0, 1, 2], [1, 1.15, 1]);
    const posTrack = new THREE.NumberKeyframeTrack('RegeneratingOrgan.position[y]', [0, 1, 2], [2.5, 2.7, 2.5]);
    const lightTrack = new THREE.NumberKeyframeTrack('RegenLight.intensity', [0, 1, 2], [1, 3, 1]);

    const regenClip = new THREE.AnimationClip('Regenerate', 2, [scaleTrack, scaleTrackY, scaleTrackZ, posTrack, lightTrack]);
    animationClips.push(regenClip);

    return { group, animationClips };
}
