import { steel, darkSteel, copper, concrete } from '../utils/materials.js';

export function createPeltonWheel(THREE) {
    const group = new THREE.Group();
    group.name = 'PeltonWheelTurbine';

    // Base
    const baseGeo = new THREE.BoxGeometry(6, 1, 4);
    const base = new THREE.Mesh(baseGeo, concrete);
    base.position.y = -3;
    group.add(base);

    // Wheel Pivot
    const pivot = new THREE.Group();
    pivot.name = 'PeltonPivot';
    pivot.position.y = 0;
    group.add(pivot);

    const wheelGeo = new THREE.CylinderGeometry(2, 2, 0.4, 32);
    const wheel = new THREE.Mesh(wheelGeo, darkSteel);
    wheel.rotation.x = Math.PI / 2;
    pivot.add(wheel);

    // Buckets
    for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const bucketGeo = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI);
        const bucket = new THREE.Mesh(bucketGeo, copper);
        bucket.position.set(Math.cos(angle) * 2.15, Math.sin(angle) * 2.15, 0);
        bucket.rotation.z = angle + Math.PI / 2;
        wheel.add(bucket);
    }

    // Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.4, 0.15, 2, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, steel);
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.set(-3, -2.15, 0);
    group.add(nozzle);

    // Water Jet
    const waterGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const waterMat = new THREE.MeshBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.6 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.name = 'WaterJet';
    water.rotation.z = -Math.PI / 2;
    water.position.set(-1.5, -2.15, 0);
    group.add(water);

    // Animations
    const spinClip = new THREE.AnimationClip('Spin', 2, [
        new THREE.NumberKeyframeTrack('PeltonPivot.rotation[z]', [0, 1, 2], [0, -Math.PI, -Math.PI * 2])
    ]);

    const waterClip = new THREE.AnimationClip('WaterFlow', 0.2, [
        new THREE.NumberKeyframeTrack('WaterJet.scale[y]', [0, 0.1, 0.2], [1, 1.2, 1])
    ]);

    return { group, animationClips: [spinClip, waterClip] };
}
