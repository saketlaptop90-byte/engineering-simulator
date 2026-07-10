import { materials } from '../utils/materials.js';

export function createCassegrainReflectorTelescope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Telescope Tube
    const tubeGeo = new THREE.CylinderGeometry(2, 2, 8, 32, 1, true);
    const tube = new THREE.Mesh(tubeGeo, materials.darkMetal);
    tube.rotation.x = Math.PI / 2;
    tube.name = 'TelescopeTube';
    group.add(tube);

    // Primary Mirror
    const primaryMirrorGeo = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 6);
    const primaryMirror = new THREE.Mesh(primaryMirrorGeo, materials.glass);
    primaryMirror.rotation.x = -Math.PI / 2;
    primaryMirror.position.set(0, 0, 3.5);
    tube.add(primaryMirror); // Attach to tube so it moves with it

    // Secondary Mirror
    const secondaryMirrorGeo = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4);
    const secondaryMirror = new THREE.Mesh(secondaryMirrorGeo, materials.glass);
    secondaryMirror.rotation.x = Math.PI / 2;
    secondaryMirror.position.set(0, 0, -3);
    tube.add(secondaryMirror);

    // Spider Vanes (Supports secondary mirror)
    const vaneGeo = new THREE.BoxGeometry(0.05, 4, 0.1);
    const vane1 = new THREE.Mesh(vaneGeo, materials.metallic);
    vane1.position.set(0, 0, -3);
    tube.add(vane1);
    
    const vane2 = new THREE.Mesh(vaneGeo, materials.metallic);
    vane2.rotation.z = Math.PI / 2;
    vane2.position.set(0, 0, -3);
    tube.add(vane2);

    // Eyepiece Tube
    const eyepieceTubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const eyepieceTube = new THREE.Mesh(eyepieceTubeGeo, materials.darkMetal);
    eyepieceTube.rotation.x = Math.PI / 2;
    eyepieceTube.position.set(0, 0, 4.5);
    tube.add(eyepieceTube);

    // Light Beams inside telescope
    const beamGeo = new THREE.CylinderGeometry(1.8, 0.5, 6.5);
    const beam = new THREE.Mesh(beamGeo, materials.laserLight || new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.1}));
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 0, 0.25);
    tube.add(beam);

    // Mount
    const mountGeo = new THREE.BoxGeometry(1, 4, 1);
    const mount = new THREE.Mesh(mountGeo, materials.metallic);
    mount.position.set(0, -3, 0);
    group.add(mount);

    // Animation: Telescope tracking the sky (sliding position back and forth)
    const tubeTrack = new THREE.VectorKeyframeTrack('TelescopeTube.position', [0, 5, 10], [
        0, 0, 0,
        1, 0, 0,
        0, 0, 0
    ]);

    const clip = new THREE.AnimationClip('TelescopeTracking', 10, [tubeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
