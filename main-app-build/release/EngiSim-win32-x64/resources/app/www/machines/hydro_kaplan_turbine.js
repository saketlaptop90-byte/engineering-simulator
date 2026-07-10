import { steel, darkSteel, copper, concrete } from '../utils/materials.js';

export function createKaplanTurbine(THREE) {
    const group = new THREE.Group();
    group.name = 'KaplanTurbine';

    // Draft Tube
    const tubeGeo = new THREE.CylinderGeometry(2, 3, 4, 32, 1, true);
    const tube = new THREE.Mesh(tubeGeo, concrete);
    tube.position.y = -2;
    group.add(tube);

    const casingGeo = new THREE.CylinderGeometry(3, 3, 2, 32, 1, true);
    const casing = new THREE.Mesh(casingGeo, steel);
    casing.position.y = 1;
    group.add(casing);

    // Rotor Hub
    const hubGroup = new THREE.Group();
    hubGroup.name = 'RotorHub';
    hubGroup.position.y = 0.5;
    group.add(hubGroup);

    const hubGeo = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const hub = new THREE.Mesh(hubGeo, copper);
    hub.rotation.x = Math.PI;
    hubGroup.add(hub);

    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 5, 16);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.y = 2.5;
    hubGroup.add(shaft);

    // Adjustable Blades
    for (let i = 0; i < 4; i++) {
        const bladePivot = new THREE.Group();
        bladePivot.name = `BladePivot_${i}`;
        const angle = (i / 4) * Math.PI * 2;
        bladePivot.position.set(Math.cos(angle) * 0.8, -0.2, Math.sin(angle) * 0.8);
        bladePivot.rotation.y = -angle;
        hubGroup.add(bladePivot);

        const bladeGeo = new THREE.BoxGeometry(1.5, 0.05, 1);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.position.set(0.75, 0, 0);
        bladePivot.add(blade);
    }

    // Guide Vanes
    for (let i = 0; i < 12; i++) {
        const guidePivot = new THREE.Group();
        guidePivot.name = `KaplanGuide_${i}`;
        const angle = (i / 12) * Math.PI * 2;
        guidePivot.position.set(Math.cos(angle) * 2.8, 1, Math.sin(angle) * 2.8);
        guidePivot.rotation.y = -angle;
        group.add(guidePivot);

        const guideGeo = new THREE.BoxGeometry(0.1, 1.5, 0.8);
        const guide = new THREE.Mesh(guideGeo, steel);
        guidePivot.add(guide);
    }

    // Animations
    const spinClip = new THREE.AnimationClip('Spin', 1, [
        new THREE.NumberKeyframeTrack('RotorHub.rotation[y]', [0, 1], [0, -Math.PI * 2])
    ]);

    // Blade pitch adjustment and guide vane adjustment
    const tracks = [];
    for (let i = 0; i < 4; i++) {
        tracks.push(new THREE.NumberKeyframeTrack(`BladePivot_${i}.rotation[x]`, [0, 2, 4], [0, Math.PI / 4, 0]));
    }
    for (let i = 0; i < 12; i++) {
        tracks.push(new THREE.NumberKeyframeTrack(`KaplanGuide_${i}.rotation[y]`, [0, 2, 4], [0, 0.5, 0]));
    }
    const adjustClip = new THREE.AnimationClip('AdjustPitch', 4, tracks);

    return { group, animationClips: [spinClip, adjustClip] };
}
