import { colors, getMaterial } from '../utils/materials.js';

export function createEvaporationPanMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Wooden Pallet Base
    const palletGroup = new THREE.Group();
    const slatGeometry = new THREE.BoxGeometry(4, 0.1, 0.5);
    const woodMaterial = getMaterial('wood', colors.brown || 0x8B4513);
    for (let i = -3; i <= 3; i++) {
        const slat = new THREE.Mesh(slatGeometry, woodMaterial);
        slat.position.z = i * 0.6;
        palletGroup.add(slat);
    }
    const runnerGeometry = new THREE.BoxGeometry(0.5, 0.3, 4);
    for (let i = -1; i <= 1; i+=2) {
        const runner = new THREE.Mesh(runnerGeometry, woodMaterial);
        runner.position.y = -0.2;
        runner.position.x = i * 1.5;
        palletGroup.add(runner);
    }
    group.add(palletGroup);

    // Pan
    const panGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 32, 1, false);
    const pan = new THREE.Mesh(panGeometry, getMaterial('metallic', colors.silver));
    pan.position.y = 0.3;
    group.add(pan);

    // Water
    const waterGeometry = new THREE.CylinderGeometry(1.78, 1.78, 0.4, 32);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = 0.3;
    water.name = "WaterVolume";
    group.add(water);

    // Stilling Well
    const wellGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const well = new THREE.Mesh(wellGeometry, getMaterial('metallic', colors.silver));
    well.position.set(0.5, 0.35, 0.5);
    group.add(well);

    // Hook Gauge Pointer
    const hookGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
    const hook = new THREE.Mesh(hookGeometry, getMaterial('metallic', colors.darkGrey));
    hook.position.set(0.5, 0.5, 0.5);
    hook.name = "HookGauge";
    group.add(hook);

    // Animations: Water evaporating (scaling Y and moving down), Hook gauge adjusting
    const duration = 20;
    
    const scaleTimes = [0, duration/2, duration];
    const posTimes = [0, duration/2, duration];
    
    const waterScaleTrack = new THREE.VectorKeyframeTrack('WaterVolume.scale', scaleTimes, [
        1, 1, 1,
        1, 0.8, 1,
        1, 0.5, 1
    ]);
    const waterPosTrack = new THREE.VectorKeyframeTrack('WaterVolume.position', posTimes, [
        0, 0.3, 0,
        0, 0.26, 0,
        0, 0.2, 0
    ]);
    const hookPosTrack = new THREE.VectorKeyframeTrack('HookGauge.position', posTimes, [
        0.5, 0.5, 0.5,
        0.5, 0.46, 0.5,
        0.5, 0.4, 0.5
    ]);

    const clip = new THREE.AnimationClip('EvaporationProcess', duration, [
        waterScaleTrack, waterPosTrack, hookPosTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
