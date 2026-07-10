import * as materials from '../utils/materials.js';

export function createArcMeltingFurnace(THREE) {
    const group = new THREE.Group();
    group.name = 'ArcMeltingFurnace';

    const darkMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), darkMat);
    base.position.y = 0.25;
    group.add(base);

    const crucible = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        materials.copper || new THREE.MeshStandardMaterial({ color: 0xa5734d, side: THREE.DoubleSide })
    );
    crucible.position.y = 1.5;
    crucible.rotation.x = Math.PI;
    group.add(crucible);

    const pool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 0.1, 32),
        materials.glowingMetal || new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff3300 })
    );
    pool.name = 'meltPool';
    pool.position.y = 0.6;
    group.add(pool);

    const electrode = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2),
        materials.graphite || new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    electrode.name = 'electrode';
    electrode.position.set(0, 3.0, 0);
    group.add(electrode);

    const holder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.5),
        materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    holder.position.y = 4.0;
    group.add(holder);

    const arc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1),
        new THREE.MeshBasicMaterial({ color: 0xccffff, transparent: true, opacity: 0.9 })
    );
    arc.name = 'electricArc';
    arc.position.set(0, 1.5, 0);
    group.add(arc);

    // Animation Tracks
    const times = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const electrodePos = [
        0, 3.0, 0,
        0, 2.0, 0,
        0, 1.8, 0,
        0, 1.9, 0,
        0, 1.8, 0,
        0, 2.0, 0,
        0, 3.0, 0
    ];
    
    const arcPosTimes = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const arcPos = [
        0, 1.5, 0,
        0, 0.8, 0,
        0, 0.7, 0,
        0, 0.75, 0,
        0, 0.7, 0,
        0, 0.8, 0,
        0, 1.5, 0
    ];
    const arcScale = [
        1, 0.01, 1,
        1.5, 0.4, 1.5,
        2.0, 0.2, 2.0,
        1.2, 0.3, 1.2,
        2.5, 0.2, 2.5,
        1.5, 0.4, 1.5,
        1, 0.01, 1
    ];
    
    const poolScaleTimes = [0, 1, 2, 3];
    const poolScale = [
        1, 0.1, 1,
        1, 0.8, 1,
        1, 1.2, 1,
        1, 1.0, 1
    ];

    const electrodeTrack = new THREE.VectorKeyframeTrack('electrode.position', times, electrodePos);
    const arcPosTrack = new THREE.VectorKeyframeTrack('electricArc.position', arcPosTimes, arcPos);
    const arcScaleTrack = new THREE.VectorKeyframeTrack('electricArc.scale', arcPosTimes, arcScale);
    const poolTrack = new THREE.VectorKeyframeTrack('meltPool.scale', poolScaleTimes, poolScale);

    const clip = new THREE.AnimationClip('MeltProcess', 3, [electrodeTrack, arcPosTrack, arcScaleTrack, poolTrack]);

    return { group, animationClips: [clip] };
}
