import { materials } from '../utils/materials.js';

export function createNeutrinoBeamGenerator(THREE) {
    const group = new THREE.Group();
    group.name = 'NeutrinoBeamGenerator';
    const animationClips = [];

    // Accelerator Ring segment
    const ringGeo = new THREE.TorusGeometry(5, 0.4, 16, 50, Math.PI);
    const ringMat = materials?.steel || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Target chamber
    const targetGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    const targetMat = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 });
    const target = new THREE.Mesh(targetGeo, targetMat);
    target.position.set(5, 0, 0);
    target.rotation.x = Math.PI / 2;
    group.add(target);

    // Magnetic Horns
    const hornGeo = new THREE.ConeGeometry(0.6, 3, 16);
    const hornMat = materials?.aluminum || new THREE.MeshStandardMaterial({ color: 0xaabbcc, metalness: 0.5, roughness: 0.4, wireframe: true });
    const horn = new THREE.Mesh(hornGeo, hornMat);
    horn.position.set(5, 0, 3);
    horn.rotation.x = Math.PI / 2;
    group.add(horn);

    // Beam pulse
    const pulseGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const pulseMat = materials?.glowCyan || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.name = 'BeamPulse';
    pulse.rotation.x = Math.PI / 2;
    group.add(pulse);

    // Animation: Beam pulse traveling through horns
    const pulsePosTrack = new THREE.VectorKeyframeTrack(
        `BeamPulse.position`,
        [0, 0.5, 1],
        [5, 0, 0, 5, 0, 4, 5, 0, 8]
    );
    const pulseScaleTrack = new THREE.VectorKeyframeTrack(
        `BeamPulse.scale`,
        [0, 0.5, 1],
        [1, 1, 1, 3, 1, 3, 8, 1, 8] // beam expanding slightly
    );
    const pulseOpacityTrack = new THREE.NumberKeyframeTrack(
        `BeamPulse.material.opacity`,
        [0, 0.2, 0.8, 1],
        [0, 0.8, 0.8, 0]
    );

    const clip = new THREE.AnimationClip('BeamFire', 1.5, [pulsePosTrack, pulseScaleTrack, pulseOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
