export function createPathogenAnatomy(THREE) {
    const group = new THREE.Group();

    // Core / Capsid
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x8e44ad, metalness: 0.1, roughness: 0.9, wireframe: true });
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = "Capsid";
    group.add(core);

    // RNA strand inside
    const rnaMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0x333300 });
    const rnaGeo = new THREE.TorusKnotGeometry(0.8, 0.1, 64, 8);
    const rna = new THREE.Mesh(rnaGeo, rnaMat);
    rna.name = "RNA";
    group.add(rna);

    // Spikes
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const spikeGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.5, 8);
    spikeGeo.translate(0, 0.25, 0);

    const spikeCount = 40;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x * 1.5, y * 1.5, z * 1.5);
        
        // Orient spike outwards
        const target = new THREE.Vector3(x * 2, y * 2, z * 2);
        spike.lookAt(target);
        spike.rotateX(Math.PI / 2);

        core.add(spike);
    }

    // Animation: core rotates slowly, RNA rotates inside
    const times = [0, 5, 10];

    // Using QuaternionKeyframeTrack for rotations
    const qCore0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qCore1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const qCore2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI*2, 0));

    const qRNA0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qRNA1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, Math.PI, 0));
    const qRNA2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, Math.PI*2, 0));

    const trackCore = new THREE.QuaternionKeyframeTrack(`${core.name}.quaternion`, times, [
        qCore0.x, qCore0.y, qCore0.z, qCore0.w,
        qCore1.x, qCore1.y, qCore1.z, qCore1.w,
        qCore2.x, qCore2.y, qCore2.z, qCore2.w,
    ]);

    const trackRNA = new THREE.QuaternionKeyframeTrack(`${rna.name}.quaternion`, times, [
        qRNA0.x, qRNA0.y, qRNA0.z, qRNA0.w,
        qRNA1.x, qRNA1.y, qRNA1.z, qRNA1.w,
        qRNA2.x, qRNA2.y, qRNA2.z, qRNA2.w,
    ]);

    const clip = new THREE.AnimationClip('PathogenIdle', 10, [trackCore, trackRNA]);

    return { group, animationClips: [clip] };
}
