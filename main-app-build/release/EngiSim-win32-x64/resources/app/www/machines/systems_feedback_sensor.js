import { getMaterials } from '../utils/materials.js';

export function createFeedbackSensor(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Sensor Base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const base = new THREE.Mesh(baseGeo, materials.metalFrame || new THREE.MeshStandardMaterial({ color: 0x666666 }));
    group.add(base);

    // Lens
    const lensGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const lensMat = materials.glassClear || new THREE.MeshPhysicalMaterial({ transmission: 1, opacity: 1, roughness: 0.1 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.y = 0.5;
    group.add(lens);

    // Laser Beam (starts invisible)
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5);
    const beamMat = materials.laserRed || new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 3;
    beam.scale.y = 0.01;
    group.add(beam);

    // Data Ring
    const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
    const ring = new THREE.Mesh(ringGeo, materials.indicatorBlue || new THREE.MeshBasicMaterial({ color: 0x00aaff }));
    ring.position.y = 0.2;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Animations: Beam scanning, Ring spinning
    const times = [0, 1, 2, 3];
    
    // Beam stretching
    const beamScales = [1, 0.01, 1,  1, 1, 1,  1, 1, 1,  1, 0.01, 1];
    const beamPositions = [0, 0.5, 0,  0, 3, 0,  0, 3, 0,  0, 0.5, 0];
    const trackBeamScale = new THREE.VectorKeyframeTrack(`${beam.uuid}.scale`, times, beamScales);
    const trackBeamPos = new THREE.VectorKeyframeTrack(`${beam.uuid}.position`, times, beamPositions);

    // Ring rotation
    const ringRots = [
        Math.sin(Math.PI/4),0,0,Math.cos(Math.PI/4),
        Math.sin(Math.PI/4),Math.sin(Math.PI),0,Math.cos(Math.PI),
        Math.sin(Math.PI/4),Math.sin(Math.PI*2),0,Math.cos(Math.PI*2),
        Math.sin(Math.PI/4),Math.sin(Math.PI*3),0,Math.cos(Math.PI*3)
    ];
    const trackRing = new THREE.QuaternionKeyframeTrack(`${ring.uuid}.quaternion`, times, ringRots);

    const clip = new THREE.AnimationClip('Feedback_Scan', 3, [trackBeamScale, trackBeamPos, trackRing]);
    animationClips.push(clip);

    return { group, animationClips };
}
