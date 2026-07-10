import { steel, darkSteel, copper, concrete } from '../utils/materials.js';

export function createFrancisTurbine(THREE) {
    const group = new THREE.Group();
    group.name = 'FrancisTurbine';

    // Volute / Spiral Casing (simplified as a torus)
    const casingGeo = new THREE.TorusGeometry(3, 1, 16, 64);
    const casing = new THREE.Mesh(casingGeo, darkSteel);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.y = 2;
    group.add(shaft);

    // Runner Pivot
    const runnerPivot = new THREE.Group();
    runnerPivot.name = 'RunnerPivot';
    group.add(runnerPivot);

    const runnerBaseGeo = new THREE.CylinderGeometry(1.5, 2.5, 1, 32);
    const runnerBase = new THREE.Mesh(runnerBaseGeo, copper);
    runnerPivot.add(runnerBase);

    // Runner Blades
    for (let i = 0; i < 12; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1, 1.5);
        const blade = new THREE.Mesh(bladeGeo, copper);
        const angle = (i / 12) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
        blade.rotation.y = -angle;
        blade.rotation.x = Math.PI / 6;
        runnerPivot.add(blade);
    }

    // Guide Vanes
    for (let i = 0; i < 16; i++) {
        const guideGeo = new THREE.BoxGeometry(0.1, 1.2, 0.8);
        const guide = new THREE.Mesh(guideGeo, steel);
        const angle = (i / 16) * Math.PI * 2;
        guide.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
        guide.rotation.y = -angle;
        guide.name = `GuideVane_${i}`;
        group.add(guide);
    }

    // Animations
    const runClip = new THREE.AnimationClip('Run', 1, [
        new THREE.NumberKeyframeTrack('RunnerPivot.rotation[y]', [0, 1], [0, Math.PI * 2])
    ]);

    // Guide Vanes Opening/Closing
    const tracks = [];
    for (let i = 0; i < 16; i++) {
        const baseRot = -(i / 16) * Math.PI * 2;
        tracks.push(new THREE.NumberKeyframeTrack(`GuideVane_${i}.rotation[y]`, [0, 2, 4], [baseRot, baseRot + 0.5, baseRot]));
    }
    const guideClip = new THREE.AnimationClip('OperateGuides', 4, tracks);

    return { group, animationClips: [runClip, guideClip] };
}
