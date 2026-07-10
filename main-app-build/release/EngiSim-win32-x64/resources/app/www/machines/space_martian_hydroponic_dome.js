import { glass, steel, redAccent, greenAccent, ceramic } from '../utils/materials.js';

export function createMartianHydroponicDome(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Foundation / Base
    const baseGeo = new THREE.CylinderGeometry(21, 21, 2, 32);
    const base = new THREE.Mesh(baseGeo, ceramic);
    base.position.y = -1;
    group.add(base);

    // Glass Dome (Hemisphere)
    const domeGeo = new THREE.SphereGeometry(20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, glass);
    
    // Wireframe structure for the dome
    const wireframeGeo = new THREE.WireframeGeometry(domeGeo);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    
    const domeGroup = new THREE.Group();
    domeGroup.add(dome);
    domeGroup.add(wireframe);
    group.add(domeGroup);

    // Interior Plant Tiers
    const tierCount = 4;
    for (let i = 0; i < tierCount; i++) {
        const radius = 15 - (i * 3);
        const tierGeo = new THREE.TorusGeometry(radius, 1.5, 16, 64);
        const tier = new THREE.Mesh(tierGeo, greenAccent);
        tier.rotation.x = Math.PI / 2;
        tier.position.y = i * 4 + 2;
        group.add(tier);
    }

    // Central Water Column / Core
    const coreGeo = new THREE.CylinderGeometry(2, 2, 20, 16);
    const core = new THREE.Mesh(coreGeo, steel);
    core.position.y = 10;
    group.add(core);

    // Rotating Sprinkler System
    const sprinklerGroup = new THREE.Group();
    sprinklerGroup.position.y = 18;
    group.add(sprinklerGroup);

    const sprinklerArmGeo = new THREE.BoxGeometry(30, 0.5, 0.5);
    const sprinklerArm = new THREE.Mesh(sprinklerArmGeo, redAccent);
    sprinklerGroup.add(sprinklerArm);

    // Animation: Sprinkler Rotation
    const sprinklerTrack = new THREE.NumberKeyframeTrack(`${sprinklerGroup.uuid}.rotation[y]`, [0, 5], [0, Math.PI * 2]);
    const sprinklerClip = new THREE.AnimationClip('SprinklerSweep', 5, [sprinklerTrack]);
    animationClips.push(sprinklerClip);

    return { group, animationClips };
}
