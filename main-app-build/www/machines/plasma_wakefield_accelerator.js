import { copper, darkSteel, gold, aluminum } from '../utils/materials.js';

export function createWakefieldAccelerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Accelerator tube
    const tubeGeo = new THREE.CylinderGeometry(2, 2, 20, 32);
    const tubeMat = new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, metalness: 0.1, roughness: 0.1, ior: 1.5 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Magnets / Focusing lenses along the tube
    for (let i = -8; i <= 8; i += 4) {
        const lensGeo = new THREE.TorusGeometry(2.2, 0.4, 16, 32);
        const lens = new THREE.Mesh(lensGeo, aluminum);
        lens.position.x = i;
        lens.rotation.y = Math.PI / 2;
        group.add(lens);
    }

    // Driving beam (Laser or particle)
    const beamGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const driverBeam = new THREE.Mesh(beamGeo, beamMat);
    driverBeam.name = 'DriverBeam';
    driverBeam.position.set(-10, 0, 0);
    group.add(driverBeam);

    // Wakefield (Plasma waves)
    const wakeGroup = new THREE.Group();
    wakeGroup.name = 'WakeGroup';
    const waveGeo = new THREE.TorusGeometry(1, 0.2, 16, 32);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7 });
    for (let i = 0; i < 5; i++) {
        const wave = new THREE.Mesh(waveGeo, waveMat);
        // Waves trail behind the driver beam
        wave.position.set(-1 - i * 0.8, 0, 0);
        wave.rotation.y = Math.PI / 2;
        
        // Scale down waves as they trail further
        const scale = 1 - (i * 0.15);
        wave.scale.set(scale, scale, scale);
        
        wakeGroup.add(wave);
    }
    // Initial position of wake group
    wakeGroup.position.set(-10, 0, 0);
    group.add(wakeGroup);

    // Trailing bunch (accelerated particles)
    const trailingGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const trailingMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const trailingBunch = new THREE.Mesh(trailingGeo, trailingMat);
    trailingBunch.name = 'TrailingBunch';
    // Positioned in the accelerating phase of the wake
    trailingBunch.position.set(-13, 0, 0);
    group.add(trailingBunch);

    // Animation: Move driver, wakefield, and trailing bunch across tube
    const times = [0, 2];
    const driverPos = [-10, 0, 0, 10, 0, 0];
    const wakePos = [-10, 0, 0, 10, 0, 0];
    const trailingPos = [-13, 0, 0, 7, 0, 0];
    
    const driverTrack = new THREE.VectorKeyframeTrack('DriverBeam.position', times, driverPos);
    const wakeTrack = new THREE.VectorKeyframeTrack('WakeGroup.position', times, wakePos);
    const trailingTrack = new THREE.VectorKeyframeTrack('TrailingBunch.position', times, trailingPos);
    
    const clip = new THREE.AnimationClip('Acceleration', 2, [driverTrack, wakeTrack, trailingTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
