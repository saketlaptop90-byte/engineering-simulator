import { darkSteel, aluminum, glass } from '../utils/materials.js';

export function createSubglacialOceanProbe(THREE) {
    const group = new THREE.Group();
    group.name = 'Subglacial Ocean Probe';

    // Hull
    const hullGeom = new THREE.CapsuleGeometry(2, 6, 16, 16);
    const hull = new THREE.Mesh(hullGeom, aluminum);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // Viewport
    const viewportGeom = new THREE.SphereGeometry(1.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const viewport = new THREE.Mesh(viewportGeom, glass);
    viewport.position.x = 4;
    viewport.rotation.z = -Math.PI / 2;
    group.add(viewport);

    // Tail fin / prop
    const tailGroup = new THREE.Group();
    tailGroup.position.x = -4;
    
    const propGeom = new THREE.ConeGeometry(1.5, 2, 4);
    const prop = new THREE.Mesh(propGeom, darkSteel);
    prop.rotation.z = Math.PI / 2;
    prop.name = 'SubPropeller';
    tailGroup.add(prop);
    group.add(tailGroup);

    // Animation: Swimming motion and propeller rotation
    const times = [0, 1, 2, 3, 4];
    const swayValues = [
        0, 0, 0,
        0, 0.5, 0,
        0, 0, 0,
        0, -0.5, 0,
        0, 0, 0
    ];
    const swayTrack = new THREE.VectorKeyframeTrack(`${group.name}.position`, times, swayValues);

    const propTimes = [0, 4];
    const propValues = [0, Math.PI * 20];
    const propTrack = new THREE.NumberKeyframeTrack('SubPropeller.rotation[x]', propTimes, propValues);

    const clip = new THREE.AnimationClip('ExploreOcean', 4, [swayTrack, propTrack]);

    return { group, animationClips: [clip] };
}
