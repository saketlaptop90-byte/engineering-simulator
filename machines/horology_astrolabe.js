import { materials } from '../utils/materials.js';

export function createAstrolabe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Mater (Brass Main Body)
    const materGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 64);
    const mater = new THREE.Mesh(materGeometry, materials.brass);
    mater.rotation.x = Math.PI / 2;
    group.add(mater);

    // Rete (Gold intricate overlay)
    const rete = new THREE.Group();
    rete.name = "Rete";
    rete.position.z = 0.15;

    const reteRingGeom = new THREE.TorusGeometry(1.8, 0.05, 16, 64);
    const reteRing = new THREE.Mesh(reteRingGeom, materials.gold);
    rete.add(reteRing);
    
    // Add some star pointers
    for(let i=0; i<5; i++) {
        const ptrGeo = new THREE.ConeGeometry(0.1, 0.5);
        const ptr = new THREE.Mesh(ptrGeo, materials.gold);
        ptr.position.y = 1.8;
        const pivot = new THREE.Group();
        pivot.rotation.z = (Math.PI * 2 / 5) * i;
        pivot.add(ptr);
        rete.add(pivot);
    }
    group.add(rete);

    // Rule (Steel pointer)
    const rule = new THREE.Group();
    rule.name = "Rule";
    rule.position.z = 0.25;

    const ruleGeometry = new THREE.BoxGeometry(0.1, 4, 0.05);
    const ruleMesh = new THREE.Mesh(ruleGeometry, materials.steel);
    rule.add(ruleMesh);
    group.add(rule);

    // Animation: Rete and Rule rotating at different speeds
    const reteTrack = new THREE.NumberKeyframeTrack(
        'Rete.rotation[z]',
        [0, 10],
        [0, -Math.PI * 2]
    );

    const ruleTrack = new THREE.NumberKeyframeTrack(
        'Rule.rotation[z]',
        [0, 10],
        [0, Math.PI * 2]
    );

    const clip = new THREE.AnimationClip('AstrolabeMotion', 10, [reteTrack, ruleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
