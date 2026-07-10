import * as materials from '../utils/materials.js';

export function createThreePhaseSeparator(THREE) {
    const group = new THREE.Group();
    group.name = 'ThreePhaseSeparatorVessel';

    const vesselMat = materials.metalWhite || new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.3 });
    const pipeMat = materials.metalSteel || new THREE.MeshStandardMaterial({ color: 0x777777 });
    const fluidMat = materials.fluidOil || new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.8 });

    // Main Horizontal Vessel
    const vesselGeo = new THREE.CylinderGeometry(3, 3, 12, 32);
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    vessel.rotation.z = Math.PI / 2;
    vessel.position.y = 4;
    group.add(vessel);

    // End Caps (Spheres)
    const capGeo = new THREE.SphereGeometry(3, 32, 16);
    
    const leftCap = new THREE.Mesh(capGeo, vesselMat);
    leftCap.position.set(-6, 4, 0);
    group.add(leftCap);
    
    const rightCap = new THREE.Mesh(capGeo, vesselMat);
    rightCap.position.set(6, 4, 0);
    group.add(rightCap);

    // Saddles (Supports)
    const saddleGeo = new THREE.BoxGeometry(2, 2, 4);
    
    const leftSaddle = new THREE.Mesh(saddleGeo, vesselMat);
    leftSaddle.position.set(-4, 1.5, 0);
    group.add(leftSaddle);
    
    const rightSaddle = new THREE.Mesh(saddleGeo, vesselMat);
    rightSaddle.position.set(4, 1.5, 0);
    group.add(rightSaddle);

    // Inlet Pipe
    const inletGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const inlet = new THREE.Mesh(inletGeo, pipeMat);
    inlet.position.set(-5, 6, 0);
    group.add(inlet);

    // Outlet Pipes (Gas, Oil, Water)
    const gasOutlet = new THREE.Mesh(inletGeo, pipeMat);
    gasOutlet.position.set(0, 6, 0);
    group.add(gasOutlet);

    const oilOutlet = new THREE.Mesh(inletGeo, pipeMat);
    oilOutlet.position.set(3, 2, 0);
    group.add(oilOutlet);

    const waterOutlet = new THREE.Mesh(inletGeo, pipeMat);
    waterOutlet.position.set(5, 2, 0);
    group.add(waterOutlet);

    // Optional: Internal fluid level animation (Simulated by an indicator or sight glass moving)
    // Here we'll create a simple sight glass fluid level
    const sightGlassGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
    const sightGlassMat = new THREE.MeshStandardMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.4 });
    const sightGlass = new THREE.Mesh(sightGlassGeo, sightGlassMat);
    sightGlass.position.set(4, 4, 3.2);
    group.add(sightGlass);

    const fluidIndicatorGeo = new THREE.CylinderGeometry(0.18, 0.18, 2, 8);
    const fluidIndicator = new THREE.Mesh(fluidIndicatorGeo, fluidMat);
    fluidIndicator.position.set(4, 3, 3.2);
    group.add(fluidIndicator);

    // Animation: Fluid level pulsating slightly
    const duration = 5;
    const times = [0, duration / 2, duration];
    const fluidValues = [3, 3.5, 3];
    const fluidScaleValues = [1, 1.5, 1];
    
    const posTrack = new THREE.NumberKeyframeTrack(`${fluidIndicator.uuid}.position[y]`, times, fluidValues);
    const scaleTrack = new THREE.NumberKeyframeTrack(`${fluidIndicator.uuid}.scale[y]`, times, fluidScaleValues);

    const clip = new THREE.AnimationClip('FluidLevelFluctuation', duration, [posTrack, scaleTrack]);

    return { group, animationClips: [clip] };
}
